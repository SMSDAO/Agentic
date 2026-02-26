'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Wallet, 
  Image, 
  TrendingUp, 
  BarChart3, 
  Bot,
  Menu,
  X 
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tokens', href: '/tokens', icon: Wallet },
  { name: 'NFTs', href: '/nfts', icon: Image },
  { name: 'DeFi', href: '/defi', icon: TrendingUp },
  { name: 'Market', href: '/market', icon: BarChart3 },
  { name: 'AI Agent', href: '/ai-agent', icon: Bot },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple shadow-neon-blue" />
            <span className="text-xl font-bold glow-text">Agentic</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname?.startsWith(item.href);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300',
                    isActive
                      ? 'bg-neon-blue/20 text-neon-blue shadow-neon-blue/50'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname?.startsWith(item.href);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300',
                    isActive
                      ? 'bg-neon-blue/20 text-neon-blue shadow-neon-blue/50'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
