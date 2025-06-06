
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeSecurity } from './lib/securityInitializer';
import { ConsoleMonitor } from './lib/consoleMonitoring';
import { setupGlobalErrorHandlers } from './lib/globalErrorHandlers';
import { setupDevToolsExtensions } from './lib/devToolsExtensions';

// Initialize security
initializeSecurity();

// Initialize console monitoring
const consoleMonitor = ConsoleMonitor.getInstance();
consoleMonitor.init();

// Setup global error handlers
setupGlobalErrorHandlers();

// Setup development tools extensions
setupDevToolsExtensions();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
