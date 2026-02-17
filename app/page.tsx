import Link from 'next/link';
import { Sparkles, Wallet, Image, TrendingUp, BarChart3, Bot } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Wallet,
      title: 'Token Operations',
      description: 'Deploy, transfer, and manage SPL tokens with ease',
      href: '/tokens',
      color: 'neon-blue',
    },
    {
      icon: Image,
      title: 'NFT Management',
      description: 'Create, mint, and trade NFTs on Solana',
      href: '/nfts',
      color: 'neon-purple',
    },
    {
      icon: TrendingUp,
      title: 'DeFi Integration',
      description: 'Swap, stake, and provide liquidity across protocols',
      href: '/defi',
      color: 'neon-pink',
    },
    {
      icon: BarChart3,
      title: 'Market Data',
      description: 'Real-time prices and analytics',
      href: '/market',
      color: 'neon-green',
    },
    {
      icon: Bot,
      title: 'AI Agents',
      description: 'Autonomous blockchain operations powered by AI',
      href: '/ai-agent',
      color: 'neon-yellow',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <Sparkles className="w-20 h-20 text-neon-blue animate-glow" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold glow-text">
            Agentic
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            The Ultimate Solana AI Web3 Platform
          </p>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Build, deploy, and manage blockchain applications with AI-powered agents.
            Full-stack platform for tokens, NFTs, DeFi, and more.
          </p>
          
          <div className="flex gap-4 justify-center mt-8">
            <Link href="/dashboard" className="neo-button">
              Launch Dashboard
            </Link>
            <Link 
              href="https://github.com/SMSDAO/Agentic" 
              target="_blank"
              className="px-6 py-3 rounded-xl font-semibold glass hover:bg-white/10 transition-all duration-300"
            >
              View on GitHub
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="neo-card p-6 hover:scale-105 transition-transform duration-300 group"
              >
                <div className={`inline-flex p-3 rounded-xl bg-${feature.color}/10 mb-4 group-hover:shadow-${feature.color}`}>
                  <Icon className={`w-6 h-6 text-${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </Link>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {[
            { label: 'Blockchain Integrations', value: '15+' },
            { label: 'DeFi Protocols', value: '10+' },
            { label: 'AI Models', value: '5+' },
            { label: 'Active Features', value: '50+' },
          ].map((stat) => (
            <div key={stat.label} className="neo-card p-6 text-center">
              <div className="text-3xl font-bold glow-text mb-2">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2024 Agentic. Built with 💜 for the Solana ecosystem.</p>
        </div>
      </footer>
    </div>
  );
}
