import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import '../BUILD_INFO.js';

// Force deployment check
console.log('🔥 VERCEL DEPLOYMENT CHECK:', new Date().toISOString());
console.log('✅ All systems operational - Real AI Recognition Active');

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
