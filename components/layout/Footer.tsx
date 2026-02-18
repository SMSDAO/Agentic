import Link from 'next/link';
import { Github, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold glow-text mb-4">Agentic</h3>
            <p className="text-gray-400 text-sm">
              Next-gen Web3 platform with AI-powered agents
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/tokens" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Tokens
                </Link>
              </li>
              <li>
                <Link href="/nfts" className="text-gray-400 hover:text-neon-blue transition-colors">
                  NFTs
                </Link>
              </li>
              <li>
                <Link href="/defi" className="text-gray-400 hover:text-neon-blue transition-colors">
                  DeFi
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 rounded-lg border border-white/10 hover:border-neon-blue/50 hover:bg-neon-blue/10 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg border border-white/10 hover:border-neon-blue/50 hover:bg-neon-blue/10 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg border border-white/10 hover:border-neon-blue/50 hover:bg-neon-blue/10 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Agentic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
