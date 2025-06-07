
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initSentry } from "@/lib/sentry";
import { setupGlobalErrorHandlers } from "@/lib/globalErrorHandlers";
import { initializeSecurity } from "@/lib/securityInitializer";
import App from "./App.tsx";
import "./index.css";

// Initialize error monitoring
initSentry();
setupGlobalErrorHandlers();

// Initialize security systems
initializeSecurity();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
