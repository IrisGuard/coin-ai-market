
// Re-export from the new modular system for backward compatibility
export { getVoiceStatusMessages, getMessageByCategory } from './voice/messageResolver';
export type { VoiceStatusMessages } from './voice/messageResolver';

// Individual message exports for direct access
export { listeningMessages } from './voice/listeningMessages';
export { processingMessages } from './voice/processingMessages';
export { idleMessages } from './voice/idleMessages';
export { lastSearchMessages, originalTextMessages } from './voice/searchMessages';
