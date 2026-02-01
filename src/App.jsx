import React from 'react';
import { useArogyam } from './context/ArogyamContext';
import Shell from './components/layout/Shell';
import SetupPage from './components/setup/SetupPage';
import StockPage from './components/stock/StockPage';
import RefillPage from './components/refill/RefillPage';
import StatsPage from './components/stats/StatsPage';
import EmergencyPage from './components/emergency/EmergencyPage';
import ToastContainer from './components/ui/ToastContainer';

const App = () => {
  const { activeTab } = useArogyam();

  return (
    <Shell>
      <div className="relative min-h-[400px]">
        {activeTab === 'setup' && <SetupPage />}
        {activeTab === 'stock' && <StockPage />}
        {activeTab === 'refill' && <RefillPage />}
        {activeTab === 'history' && <StatsPage />}
        {activeTab === 'emergency' && <EmergencyPage />}
      </div>
      <ToastContainer />
    </Shell>
  );
};

export default App;
