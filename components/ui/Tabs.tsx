'use client';

import { useState } from 'react';

interface TabsProps {
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
  defaultTab?: string;
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="flex gap-2 border-b border-white/10 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-semibold transition-all duration-300 relative ${
              activeTab === tab.id
                ? 'text-neon-blue'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-blue to-neon-purple" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={activeTab === tab.id ? 'block' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
