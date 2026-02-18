import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AgentsScreen from './screens/Agents/AgentsScreen';
import UsersScreen from './screens/Users/UsersScreen';
import BillingScreen from './screens/Billing/BillingScreen';
import FeesScreen from './screens/Fees/FeesScreen';
import WalletsScreen from './screens/Wallets/WalletsScreen';
import OraclesScreen from './screens/Oracles/OraclesScreen';
import RPCScreen from './screens/RPC/RPCScreen';
import AddonsScreen from './screens/Addons/AddonsScreen';
import SDKScreen from './screens/SDK/SDKScreen';
import LogsScreen from './screens/Logs/LogsScreen';
import SettingsScreen from './screens/Settings/SettingsScreen';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/agents" replace />} />
          <Route path="/agents" element={<AgentsScreen />} />
          <Route path="/users" element={<UsersScreen />} />
          <Route path="/billing" element={<BillingScreen />} />
          <Route path="/fees" element={<FeesScreen />} />
          <Route path="/wallets" element={<WalletsScreen />} />
          <Route path="/oracles" element={<OraclesScreen />} />
          <Route path="/rpc" element={<RPCScreen />} />
          <Route path="/addons" element={<AddonsScreen />} />
          <Route path="/sdk" element={<SDKScreen />} />
          <Route path="/logs" element={<LogsScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
