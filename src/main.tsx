
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Import enhanced security systems
import { initializeEnhancedSecurity } from "@/lib/enhancedSecurityInitializer";

// Initialize enhanced security on app startup
initializeEnhancedSecurity().catch(error => {
  console.error('Failed to initialize enhanced security:', error);
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
