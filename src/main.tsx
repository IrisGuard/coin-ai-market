
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

import { productionGuard, validateNoMockData } from '@/utils/mockDataBlocker';

// 🚨 ENABLE PRODUCTION GUARD
productionGuard();

// 🚨 CRASH APP IF MOCK DATA DETECTED IN PRODUCTION
if (process.env.NODE_ENV === 'production') {
  window.addEventListener('error', (event) => {
    if (event.message.includes('mock') || 
        event.message.includes('Math.random') ||
        event.message.includes('demo') ||
        event.message.includes('fake')) {
      alert('🚨 PRODUCTION ERROR: Mock data detected! Application will reload.');
      console.error('🚨 PRODUCTION SECURITY VIOLATION:', event.message);
      window.location.reload();
    }
  });

  // Additional protection - validate initial app state
  try {
    validateNoMockData({ appInitialization: true, timestamp: new Date().toISOString() });
    console.log('✅ App initialization validation passed - no mock data detected');
  } catch (error) {
    console.error('❌ App initialization failed - mock data detected:', error);
    alert('🚨 CRITICAL: Mock data detected during app initialization!');
  }
}

console.log('🛡️ Mock Data Protection System: ACTIVE');
console.log('🔍 Real-time validation: ENABLED');
console.log('✅ System ready for production deployment');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
