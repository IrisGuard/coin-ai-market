
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { productionGuard, runtimeMockGuard } from '@/utils/mockDataBlocker';

// 🛡️ ENABLE PRODUCTION PROTECTION
productionGuard();
runtimeMockGuard();

// 🚨 CRASH APP IF MOCK DATA DETECTED IN PRODUCTION
if (process.env.NODE_ENV === 'production') {
  window.addEventListener('error', (event) => {
    if (event.message.includes('mock') || 
        event.message.includes('Math.random') || 
        event.message.includes('demo') || 
        event.message.includes('fake')) {
      console.error('🚨 PRODUCTION ERROR: Mock data detected!', event);
      alert('🚨 PRODUCTION ERROR: Mock data detected! Reloading...');
      window.location.reload();
    }
  });

  // Monitor for runtime violations
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('PRODUCTION BLOCKED')) {
      console.error('🚨 PRODUCTION BLOCKED:', event.reason);
      alert('🚨 SYSTEM BLOCKED: Mock data violation detected!');
      event.preventDefault();
    }
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
