import React, { useState, useEffect } from 'react';
import { useArogyam } from './context/ArogyamContext';
import Shell from './components/layout/Shell';
import SetupPage from './components/setup/SetupPage';
import InventoryPage from './components/inventory/InventoryPage';
import RefillPage from './components/refill/RefillPage';
import StatsPage from './components/stats/StatsPage';
import EmergencyPage from './components/emergency/EmergencyPage';
import DoctorPage from './components/doctor/DoctorPage';
import StockPage from './components/stock/StockPage';
import Onboarding from './components/auth/Onboarding';
import ChatPage from './components/chat/ChatPage';

import ToastContainer from './components/ui/ToastContainer';
import LoginPage from "./components/auth/LoginPage";

const App = () => {
  const { activeTab, userRole } = useArogyam();
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const path = currentPath.replace(/\/$/, '').toLowerCase() || '/';

  // 1. Standalone Public Routes (No Auth Required)
  if (path === '/login') {
    return <LoginPage />;
  }
  if (path === '/onboarding') {
    return <Onboarding onComplete={() => { window.location.href = '/setup'; }} />;
  }
  if (path === '/chat') {
    return <ChatPage />;
  }

  // 2. Shell-wrapped Public Routes (No Auth Required)
  let content = null;
  if (path === '/doctor' || path === '/patients') {
    content = <DoctorPage />;
  } else if (path === '/setup') {
    content = <SetupPage />;
  } else if (path === '/inventory') {
    content = <InventoryPage />;
  } else if (path === '/refill') {
    content = <RefillPage />;
  } else if (path === '/stats' || path === '/history') {
    content = <StatsPage />;
  } else if (path === '/emergency' || path === '/sos') {
    content = <EmergencyPage />;
  } else if (path === '/stock') {
    content = <StockPage />;
  } else {
    // Default fallback route '/' based on activeTab or role
    if (userRole === 'doctor') {
      content = <DoctorPage />;
    } else {
      if (activeTab === 'stock') content = <InventoryPage />;
      else if (activeTab === 'refill') content = <RefillPage />;
      else if (activeTab === 'history' || activeTab === 'stats') content = <StatsPage />;
      else if (activeTab === 'emergency') content = <EmergencyPage />;
      else if (activeTab === 'patients' || activeTab === 'doctor') content = <DoctorPage />;
      else content = <SetupPage />;
    }
  }

  return (
    <Shell>
      <div className="relative min-h-[400px]">
        {content}
      </div>
      <ToastContainer />
    </Shell>
  );
};

export default App;
