import React from 'react';
import { useArogyam } from './context/ArogyamContext';
import Shell from './components/layout/Shell';
import SetupPage from './components/setup/SetupPage';
import InventoryPage from './components/inventory/InventoryPage';
import RefillPage from './components/refill/RefillPage';
import StatsPage from './components/stats/StatsPage';
import EmergencyPage from './components/emergency/EmergencyPage';
import ToastContainer from './components/ui/ToastContainer';

import { SignedIn, SignedOut, AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import LoginPage from "./components/auth/LoginPage";

const App = () => {
  const { activeTab } = useArogyam();
  const [isDemo, setIsDemo] = React.useState(false);

  // Handle Clerk SSO redirect
  if (window.location.pathname === '/sso-callback') {
    return <AuthenticateWithRedirectCallback />;
  }

  if (isDemo) {
    return (
      <Shell>
        <div className="relative min-h-[400px]">
          {activeTab === 'setup' && <SetupPage />}
          {activeTab === 'stock' && <InventoryPage />}
          {activeTab === 'refill' && <RefillPage />}
          {activeTab === 'history' && <StatsPage />}
          {activeTab === 'emergency' && <EmergencyPage />}
        </div>
        <ToastContainer />
      </Shell>
    );
  }

  return (
    <>
      <SignedOut>
        <LoginPage onDemoLogin={() => setIsDemo(true)} />
      </SignedOut>
      <SignedIn>
        <Shell>
          <div className="relative min-h-[400px]">
            {activeTab === 'setup' && <SetupPage />}
            {activeTab === 'stock' && <InventoryPage />}
            {activeTab === 'refill' && <RefillPage />}
            {activeTab === 'history' && <StatsPage />}
            {activeTab === 'emergency' && <EmergencyPage />}
          </div>
          <ToastContainer />
        </Shell>
      </SignedIn>
    </>
  );
};

export default App;
