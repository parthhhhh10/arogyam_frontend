import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ArogyamProvider } from './context/ArogyamContext'
import { ThemeProvider } from "@/components/theme-provider"

console.log("Arogyam: Starting init...");

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found");

import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key")
}

try {
  const root = ReactDOM.createRoot(rootElement);

  if (!PUBLISHABLE_KEY) {
    root.render(
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4 font-sans text-center">
        <div className="p-4 bg-red-500/10 rounded-full mb-4">
          <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Authentication Config Missing</h1>
        <p className="text-slate-400 max-w-md mb-6">
          The Clerk Publishable Key is missing. You must add it to your environment variables to sign in.
        </p>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-left w-full max-w-lg overflow-x-auto">
          <p className="text-xs text-slate-500 mb-2 uppercase font-bold tracking-wider">Create .env.local file:</p>
          <code className="text-green-400 font-mono text-sm block">
            VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
          </code>
        </div>
        <a
          href="https://dashboard.clerk.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 px-6 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors"
        >
          Get API Key from Clerk Dashboard
        </a>
      </div>
    );
  } else {
    root.render(
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <ArogyamProvider>
            <App />
          </ArogyamProvider>
        </ThemeProvider>
      </ClerkProvider>
    );
  }
  console.log("Arogyam: Render initiated.");
} catch (error) {
  console.error("Arogyam: Fatal Error", error);
  // Fallback if root exists
  if (rootElement) {
    rootElement.innerHTML = `<div style="color:red; padding:20px;"><h1>Failed to start</h1><pre>${error.message}</pre></div>`;
  }
}
