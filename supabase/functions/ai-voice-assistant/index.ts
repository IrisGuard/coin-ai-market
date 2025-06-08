
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { input, context, language, detectedLanguage } = await req.json();

    if (!input) {
      throw new Error('No input provided');
    }

    console.log('Processing multilingual AI voice input:', { input, language, detectedLanguage });

    const systemPrompt = `You are a multilingual AI voice assistant for a global coin marketplace application.
The user speaks to you in various languages and you should respond in the SAME language they used.

Current detected language: ${detectedLanguage || language || 'unknown'}
User input: "${input}"

You can execute these commands across all languages:
- Navigation (marketplace, home, admin, etc.)
- Coin search and discovery
- Information display
- Voice search assistance

When a user gives you a command, respond with a JSON containing:
- response: A friendly response in the SAME language as the user input
- actions: Array of commands to execute

Example commands you can return:
- {"type": "navigate", "url": "/marketplace"} for navigation
- {"type": "search", "query": "gold coins"} for search
- {"type": "toast", "title": "Title", "message": "Message"} for notifications

Language-specific responses:
- Greek: Use Greek for responses
- English: Use English for responses  
- Spanish: Use Spanish for responses
- French: Use French for responses
- German: Use German for responses
- Italian: Use Italian for responses
- Portuguese: Use Portuguese for responses
- Russian: Use Russian for responses
- Chinese: Use Chinese for responses
- Japanese: Use Japanese for responses
- Korean: Use Korean for responses
- Arabic: Use Arabic for responses
- And all other supported languages

If you cannot execute something, politely explain it in the user's language.

Common search terms translation context:
- "gold" = "χρυσός" (Greek), "oro" (Spanish/Italian), "or" (French), "Gold" (German), "золото" (Russian), "金" (Chinese/Japanese), "금" (Korean), "ذهب" (Arabic)
- "silver" = "ασημί" (Greek), "plata" (Spanish), "argento" (Italian), "argent" (French), "Silber" (German), "серебро" (Russian), "银" (Chinese), "銀" (Japanese), "은" (Korean), "فضة" (Arabic)
- "ancient" = "αρχαίος" (Greek), "antiguo" (Spanish), "antico" (Italian), "ancien" (French), "antik" (German), "древний" (Russian), "古代" (Chinese), "古い" (Japanese), "고대" (Korean), "قديم" (Arabic)
- "rare" = "σπάνιος" (Greek), "raro" (Spanish/Italian), "rare" (French), "selten" (German), "редкий" (Russian), "稀有" (Chinese), "珍しい" (Japanese), "희귀한" (Korean), "نادر" (Arabic)

Understand natural language requests for coin searches in any language and extract appropriate search terms.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: input }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('Multilingual AI Response:', aiResponse);

    // Try to parse as JSON, if it fails treat as plain text
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch {
      // If not JSON, create a simple response
      parsedResponse = {
        response: aiResponse,
        actions: [],
        detectedLanguage: detectedLanguage || language || 'en'
      };
    }

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in multilingual AI voice assistant:', error);
    
    // Return error message in appropriate language
    const errorMessages: Record<string, string> = {
      'el': "Συγγνώμη, αντιμετώπισα ένα πρόβλημα. Δοκίμασε ξανά.",
      'en': "Sorry, I encountered a problem. Please try again.",
      'es': "Lo siento, encontré un problema. Inténtalo de nuevo.",
      'fr': "Désolé, j'ai rencontré un problème. Veuillez réessayer.",
      'de': "Entschuldigung, ich bin auf ein Problem gestoßen. Bitte versuchen Sie es erneut.",
      'it': "Scusa, ho riscontrato un problema. Riprova.",
      'pt': "Desculpe, encontrei um problema. Tente novamente.",
      'ru': "Извините, возникла проблема. Попробуйте еще раз.",
      'zh': "抱歉，我遇到了问题。请再试一次。",
      'ja': "申し訳ありませんが、問題が発生しました。もう一度お試しください。",
      'ko': "죄송합니다. 문제가 발생했습니다. 다시 시도해 주세요.",
      'ar': "آسف، واجهت مشكلة. يرجى المحاولة مرة أخرى.",
      'hi': "क्षमा करें, मुझे एक समस्या आई है। कृपया फिर से कोशिश करें।",
      'tr': "Üzgünüm, bir sorunla karşılaştım. Lütfen tekrar deneyin.",
      'nl': "Sorry, ik ondervond een probleem. Probeer het opnieuw.",
      'pl': "Przepraszam, napotkałem problem. Spróbuj ponownie.",
      'cs': "Omlouváme se, narazil jsem na problém. Zkuste to znovu.",
      'sv': "Förlåt, jag stötte på ett problem. Försök igen.",
      'no': "Beklager, jeg støtte på et problem. Prøv igjen.",
      'da': "Undskyld, jeg stødte på et problem. Prøv igen.",
      'fi': "Anteeksi, törmäsin ongelmaan. Yritä uudelleen.",
      'he': "סליחה, נתקלתי בבעיה. אנא נסה שוב.",
      'th': "ขออภัย ฉันพบปัญหา โปรดลองอีกครั้ง",
      'vi': "Xin lỗi, tôi gặp sự cố. Vui lòng thử lại.",
      'uk': "Вибачте, виникла проблема. Спробуйте ще раз.",
      'ro': "Îmi pare rău, am întâmpinat o problemă. Vă rog să încercați din nou.",
      'hu': "Sajnálom, problémába ütköztem. Kérjük, próbálja újra.",
      'bg': "Съжалявам, срещнах проблем. Моля, опитайте отново.",
      'hr': "Žao mi je, naišao sam na problem. Molimo pokušajte ponovo.",
      'sr': "Извините, наишао сам на проблем. Молимо покушајте поново.",
      'sl': "Oprostite, naletela sem na težavo. Poskusite znova.",
      'sk': "Prepáčte, narazil som na problém. Skúste to znova.",
      'lt': "Atsiprašau, susidūriau su problema. Bandykite dar kartą.",
      'lv': "Atvainojiet, saskāros ar problēmu. Lūdzu, mēģiniet vēlreiz.",
      'et': "Vabandust, ma sattusin probleemi. Palun proovige uuesti."
    };

    const userLanguage = req.headers.get('accept-language')?.split(',')[0].split('-')[0] || 'en';
    const errorMessage = errorMessages[userLanguage] || errorMessages['en'];

    return new Response(JSON.stringify({ 
      response: errorMessage,
      actions: [],
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
