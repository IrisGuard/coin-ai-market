
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ProdErrorHandler } from './utils/prodErrorHandler';
import { initSentry } from './lib/sentry';

// Initialize error monitoring
initSentry();
ProdErrorHandler.initializeGlobalErrorHandling();

// Add global error handler for production monitoring
window.addEventListener('error', (event) => {
  fetch('/api/webhook/error-monitor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      error: event.error?.message,
      stack: event.error?.stack,
      url: window.location.href,
      userAgent: navigator.userAgent
    })
  }).catch(console.error);
});

window.addEventListener('unhandledrejection', (event) => {
  fetch('/api/webhook/error-monitor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      error: event.reason?.message || 'Unhandled Promise Rejection',
      stack: event.reason?.stack,
      url: window.location.href,
      userAgent: navigator.userAgent
    })
  }).catch(console.error);
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
