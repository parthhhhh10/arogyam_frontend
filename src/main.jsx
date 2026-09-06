import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ArogyamProvider } from './context/ArogyamContext'
import { ThemeProvider } from "@/components/theme-provider"

console.log("Arogyam: Starting init...");

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found");

const root = ReactDOM.createRoot(rootElement);

root.render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <ArogyamProvider>
      <App />
    </ArogyamProvider>
  </ThemeProvider>
);
console.log("Arogyam: Render initiated.");
