import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Bot,
  Users,
  CreditCard,
  DollarSign,
  Wallet,
  TrendingUp,
  Server,
  Puzzle,
  Code,
  FileText,
  Settings,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navItems = [
    { path: '/agents', icon: Bot, label: 'Agents' },
    { path: '/users', icon: Users, label: 'Users' },
    { path: '/billing', icon: CreditCard, label: 'Billing' },
    { path: '/fees', icon: DollarSign, label: 'Fees' },
    { path: '/wallets', icon: Wallet, label: 'Wallets' },
    { path: '/oracles', icon: TrendingUp, label: 'Oracles' },
    { path: '/rpc', icon: Server, label: 'RPC' },
    { path: '/addons', icon: Puzzle, label: 'Add-ons' },
    { path: '/sdk', icon: Code, label: 'SDK' },
    { path: '/logs', icon: FileText, label: 'Logs' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-white">Agentic Admin</h1>
          <p className="text-sm text-gray-400 mt-1">Control Panel</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-800">
          <div className="text-xs text-gray-500">
            <div>Version 1.0.0</div>
            <div className="mt-1">© {new Date().getFullYear()} Agentic</div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="h-full">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
