
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ErrorHandler } from '@/utils/errorHandler';

// Initialize global error handling
ErrorHandler.initializeGlobalErrorHandling();

// Check if error monitoring is enabled
ErrorHandler.checkSystemConfig().then((enabled) => {
  if (enabled) {
    console.log('Error monitoring is active');
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
