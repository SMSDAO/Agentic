'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminLayout({ children, className }: AdminLayoutProps) {
  return (
    <>
      <Navbar />
      <div className={cn('container mx-auto px-4 py-8', className)}>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-neon-purple shadow-neon-purple animate-glow-pulse" />
            <span className="text-xs font-mono text-neon-purple uppercase tracking-widest">
              Admin Console
            </span>
          </div>
          <h1 className="text-4xl font-bold glow-text mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">
            Manage fee schedules, intent mappings, and platform configuration.
          </p>
        </div>
        {children}
      </div>
    </>
  );
}
