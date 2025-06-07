
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { initSentry } from "@/lib/sentry";
import { setupGlobalErrorHandlers } from "@/lib/globalErrorHandlers";
import { initializeSecurity } from "@/lib/securityInitializer";
import { validateVercelEnvironment } from "@/utils/envCheck";
import App from "./App.tsx";
import "./index.css";

// Initialize error monitoring
initSentry();
setupGlobalErrorHandlers();

// Initialize security systems
initializeSecurity();

// Validate Vercel environment on startup
validateVercelEnvironment();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <SpeedInsights />
  </StrictMode>
);
