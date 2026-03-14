import { Navbar } from '@/components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Upload } from 'lucide-react';

export default function NFTsPage() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold glow-text mb-2">NFT Management</h1>
            <p className="text-gray-400">Create, mint, and manage your NFT collections</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Collection
            </Button>
          </div>
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i}>
              <div className="aspect-square bg-gradient-to-br from-neon-blue/20 via-neon-purple/20 to-neon-pink/20 rounded-xl mb-4" />
              <CardTitle className="mb-2">NFT #{i}</CardTitle>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Floor: 2.5 SOL</span>
                  <Button size="sm" variant="ghost">View</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Metaplex Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Create and manage NFT collections using Metaplex standards
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Collection deployment</li>
                <li>• NFT minting</li>
                <li>• Metadata management</li>
                <li>• Royalty configuration</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3.Land Marketplace</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                List your NFTs for sale on 3.land marketplace
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Automatic listing</li>
                <li>• Accept any SPL token</li>
                <li>• Custom pricing</li>
                <li>• Instant settlement</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
