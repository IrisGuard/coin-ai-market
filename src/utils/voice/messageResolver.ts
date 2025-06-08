
import { listeningMessages } from './listeningMessages';
import { processingMessages } from './processingMessages';
import { idleMessages } from './idleMessages';
import { lastSearchMessages, originalTextMessages } from './searchMessages';

export interface VoiceStatusMessages {
  listening: string;
  processing: string;
  idle: string;
  lastSearch: string;
  original: string;
}

export const getVoiceStatusMessages = (languageCode: string): VoiceStatusMessages => {
  // Extract language part from codes like 'el-GR' -> 'el'
  const lang = languageCode.split('-')[0];
  
  return {
    listening: listeningMessages[lang] || listeningMessages['en'],
    processing: processingMessages[lang] || processingMessages['en'],
    idle: idleMessages[lang] || idleMessages['en'],
    lastSearch: lastSearchMessages[lang] || lastSearchMessages['en'],
    original: originalTextMessages[lang] || originalTextMessages['en']
  };
};

export const getMessageByCategory = (category: 'listening' | 'processing' | 'idle' | 'lastSearch' | 'original', languageCode: string): string => {
  const lang = languageCode.split('-')[0];
  
  switch (category) {
    case 'listening':
      return listeningMessages[lang] || listeningMessages['en'];
    case 'processing':
      return processingMessages[lang] || processingMessages['en'];
    case 'idle':
      return idleMessages[lang] || idleMessages['en'];
    case 'lastSearch':
      return lastSearchMessages[lang] || lastSearchMessages['en'];
    case 'original':
      return originalTextMessages[lang] || originalTextMessages['en'];
    default:
      return '';
  }
};
