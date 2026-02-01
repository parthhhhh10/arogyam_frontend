import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ArogyamProvider } from './context/ArogyamContext'
import { ThemeProvider } from "@/components/theme-provider"

console.log("Arogyam: Starting init...");

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found");

try {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ArogyamProvider>
        <App />
      </ArogyamProvider>
    </ThemeProvider>
  );
  console.log("Arogyam: Render initiated.");
} catch (error) {
  console.error("Arogyam: Fatal Error", error);
  // Fallback if root exists
  if (rootElement) {
    rootElement.innerHTML = `<div style="color:red; padding:20px;"><h1>Failed to start</h1><pre>${error.message}</pre></div>`;
  }
}
