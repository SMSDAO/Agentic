'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Coins,
  Image as ImageIcon,
  TrendingUp,
  Bot,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: CreditCard, label: 'Transactions', href: '/admin/transactions' },
  { icon: Coins, label: 'Tokens', href: '/admin/tokens' },
  { icon: ImageIcon, label: 'NFTs', href: '/admin/nfts' },
  { icon: TrendingUp, label: 'DeFi', href: '/admin/defi' },
  { icon: Bot, label: 'AI Agents', href: '/admin/agents' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen neo-card border-r border-white/10 transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
        {!collapsed && <h2 className="text-xl font-bold glow-text">Admin</h2>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)] neo-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 text-neon-blue border border-neon-blue/30'
                  : 'hover:bg-white/5 text-gray-400 hover:text-white'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
