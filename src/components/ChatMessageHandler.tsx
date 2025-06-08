
import { useEffect } from 'react';

const ChatMessageHandler = () => {
  useEffect(() => {
    const handleSendMessage = (event: CustomEvent) => {
      const { message } = event.detail;
      
      // Find the chat input element and simulate user input
      const chatInput = document.querySelector('textarea[placeholder*="Type a message"]') as HTMLTextAreaElement;
      if (chatInput) {
        // Set the value
        chatInput.value = message;
        
        // Trigger input events to make sure the chat system recognizes the change
        chatInput.dispatchEvent(new Event('input', { bubbles: true }));
        chatInput.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Try to find and click the send button
        setTimeout(() => {
          const sendButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
          if (sendButton && !sendButton.disabled) {
            sendButton.click();
          }
        }, 100);
      }
    };

    window.addEventListener('sendChatMessage', handleSendMessage as EventListener);
    
    return () => {
      window.removeEventListener('sendChatMessage', handleSendMessage as EventListener);
    };
  }, []);

  return null;
};

export default ChatMessageHandler;
