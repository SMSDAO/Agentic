import { Navbar } from '@/components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Bot, MessageSquare, Zap, Brain } from 'lucide-react';

export default function AIAgentPage() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold glow-text mb-2">AI Agent</h1>
          <p className="text-gray-400">Autonomous blockchain operations powered by AI</p>
        </div>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card hover={false} className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-neon-blue" />
                  Chat with AI Agent
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 neo-scrollbar overflow-y-auto mb-4 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="flex-1 glass p-3 rounded-lg">
                      <p>Hello! I&apos;m your AI assistant for Solana blockchain operations. How can I help you today?</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Ask me anything about blockchain operations..." />
                  <Button>Send</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Agent Capabilities */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-neon-purple" />
                  Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-neon-blue">•</span>
                    <span>Check wallet balances</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon-blue">•</span>
                    <span>Execute token transfers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon-blue">•</span>
                    <span>Swap tokens on Jupiter</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon-blue">•</span>
                    <span>Mint NFTs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon-blue">•</span>
                    <span>Generate NFT artwork</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon-blue">•</span>
                    <span>Market data analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon-blue">•</span>
                    <span>DeFi operations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-neon-green" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="secondary" size="sm" className="w-full justify-start">
                    Check my balance
                  </Button>
                  <Button variant="secondary" size="sm" className="w-full justify-start">
                    Show trending tokens
                  </Button>
                  <Button variant="secondary" size="sm" className="w-full justify-start">
                    Generate NFT artwork
                  </Button>
                  <Button variant="secondary" size="sm" className="w-full justify-start">
                    Latest market prices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Integrations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>LangChain Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Autonomous agent support with React framework
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Memory management</li>
                <li>• Tool orchestration</li>
                <li>• Streaming responses</li>
                <li>• Error handling</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vercel AI SDK</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Framework-agnostic AI integration
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Quick setup</li>
                <li>• Multiple providers</li>
                <li>• Real-time streaming</li>
                <li>• Type-safe</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
