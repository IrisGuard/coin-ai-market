
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useEnhancedVoiceCommands } from './useEnhancedVoiceCommands';

export const useAIVoiceAssistant = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lastResponse, setLastResponse] = useState<string>('');
  const { processCommand } = useEnhancedVoiceCommands();

  const processVoiceInput = useCallback(async (transcript: string, languageCode?: string, detectedLanguage?: string) => {
    setIsProcessing(true);
    console.log('Processing voice input:', transcript, 'Language:', languageCode, 'Detected:', detectedLanguage);

    try {
      // First try to process as a known voice command with language context
      const wasHandled = processCommand(transcript, languageCode || 'en-US');
      
      if (wasHandled) {
        setIsProcessing(false);
        return;
      }

      // If not a known command, send to AI for processing with language context
      console.log('Sending to AI for processing:', transcript);
      
      const { data, error } = await supabase.functions.invoke('ai-voice-assistant', {
        body: {
          input: transcript,
          context: 'coin_marketplace_app',
          language: languageCode || 'en-US',
          detectedLanguage: detectedLanguage || 'english'
        }
      });

      if (error) {
        console.error('AI processing error:', error);
        
        // Error message in appropriate language
        const lang = (languageCode || 'en-US').split('-')[0];
        const errorMessages: Record<string, string> = {
          'el': 'Δεν μπόρεσα να επεξεργαστώ την εντολή σου',
          'en': 'Could not process your command',
          'es': 'No pude procesar tu comando',
          'fr': 'Je n\'ai pas pu traiter votre commande',
          'de': 'Konnte Ihren Befehl nicht verarbeiten',
          'it': 'Non sono riuscito a elaborare il tuo comando',
          'pt': 'Não consegui processar seu comando',
          'ru': 'Не удалось обработать вашу команду',
          'zh': '无法处理您的命令',
          'ja': 'コマンドを処理できませんでした',
          'ko': '명령을 처리할 수 없습니다',
          'ar': 'لم أتمكن من معالجة أمرك',
          'hi': 'आपकी कमांड प्रोसेस नहीं कर सका',
          'tr': 'Komutunuzu işleyemedim',
          'nl': 'Kon uw commando niet verwerken',
          'pl': 'Nie mogłem przetworzyć twojego polecenia',
          'cs': 'Nepodařilo se mi zpracovat váš příkaz',
          'sv': 'Kunde inte bearbeta ditt kommando',
          'no': 'Kunne ikke behandle kommandoen din',
          'da': 'Kunne ikke behandle din kommando',
          'fi': 'En voinut käsitellä komentoasi',
          'he': 'לא הצלחתי לעבד את הפקודה שלך',
          'th': 'ไม่สามารถประมวลผลคำสั่งของคุณได้',
          'vi': 'Không thể xử lý lệnh của bạn',
          'uk': 'Не вдалося обробити вашу команду',
          'ro': 'Nu am putut procesa comanda ta',
          'hu': 'Nem tudtam feldolgozni a parancsot',
          'bg': 'Не можах да обработя командата ви',
          'hr': 'Nisam mogao obraditi vašu naredbu',
          'sr': 'Нисам могао да обрадим вашу команду',
          'sl': 'Nisem mogel obdelati vašega ukaza',
          'sk': 'Nemohol som spracovať váš príkaz',
          'lt': 'Negalėjau apdoroti jūsų komandos',
          'lv': 'Nevarēju apstrādāt jūsu komandu',
          'et': 'Ei saanud teie käsku töödelda'
        };

        const message = errorMessages[lang] || errorMessages['en'];
        toast({
          title: "AI Error",
          description: message,
          variant: "destructive"
        });
        return;
      }

      if (data?.response) {
        setLastResponse(data.response);
        
        // Execute any actions returned by the AI
        if (data.actions && data.actions.length > 0) {
          for (const action of data.actions) {
            await executeAction(action);
          }
        }

        toast({
          title: "AI Assistant",
          description: data.response,
        });
      }

    } catch (error) {
      console.error('Voice processing error:', error);
      
      // Error message in appropriate language
      const lang = (languageCode || 'en-US').split('-')[0];
      const errorMessages: Record<string, string> = {
        'el': 'Κάτι πήγε στραβά με την επεξεργασία της φωνής',
        'en': 'Something went wrong with voice processing',
        'es': 'Algo salió mal con el procesamiento de voz',
        'fr': 'Quelque chose s\'est mal passé avec le traitement vocal',
        'de': 'Etwas ist mit der Sprachverarbeitung schief gelaufen',
        'it': 'Qualcosa è andato storto con l\'elaborazione vocale',
        'pt': 'Algo deu errado com o processamento de voz',
        'ru': 'Что-то пошло не так с обработкой голоса',
        'zh': '语音处理出现问题',
        'ja': '音声処理で何かが間違いました',
        'ko': '음성 처리에 문제가 발생했습니다',
        'ar': 'حدث خطأ في معالجة الصوت',
        'hi': 'आवाज़ प्रसंस्करण में कुछ गलत हुआ',
        'tr': 'Ses işlemede bir şeyler ters gitti',
        'nl': 'Er ging iets mis met spraakverwerking',
        'pl': 'Coś poszło nie tak z przetwarzaniem głosu',
        'cs': 'Něco se pokazilo při zpracování hlasu',
        'sv': 'Något gick fel med röstbehandlingen',
        'no': 'Noe gikk galt med talebehandlingen',
        'da': 'Noget gik galt med talebehandlingen',
        'fi': 'Jotain meni pieleen äänenkäsittelyssä',
        'he': 'משהו השתבש בעיבוד הקול',
        'th': 'เกิดข้อผิดพลาดในการประมวลผลเสียง',
        'vi': 'Đã xảy ra lỗi trong xử lý giọng nói',
        'uk': 'Щось пішло не так з обробкою голосу',
        'ro': 'Ceva a mers prost cu procesarea vocii',
        'hu': 'Valami elromlott a hangfeldolgozással',
        'bg': 'Нещо се обърка с обработката на гласа',
        'hr': 'Nešto je pošlo po zlu s obradom glasa',
        'sr': 'Нешто је пошло по злу са обрадом гласа',
        'sl': 'Nekaj je šlo narobe z obdelavo glasu',
        'sk': 'Niečo sa pokazilo so spracovaním hlasu',
        'lt': 'Kažkas nepavyko su balso apdorojimu',
        'lv': 'Kaut kas nogāja greizi ar balss apstrādi',
        'et': 'Midagi läks hääletöötlusega valesti'
      };

      const message = errorMessages[lang] || errorMessages['en'];
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [processCommand]);

  const executeAction = useCallback(async (action: any) => {
    console.log('Executing action:', action);
    
    switch (action.type) {
      case 'navigate':
        if (typeof window !== 'undefined') {
          window.location.href = action.url;
        }
        break;
      case 'search':
        if (typeof window !== 'undefined') {
          window.location.href = `/search?q=${encodeURIComponent(action.query)}`;
        }
        break;
      case 'toast':
        toast({
          title: action.title || "Ενημέρωση",
          description: action.message,
        });
        break;
      default:
        console.log('Unknown action type:', action.type);
    }
  }, []);

  return {
    processVoiceInput,
    isProcessing,
    isListening,
    setIsListening,
    lastResponse
  };
};
