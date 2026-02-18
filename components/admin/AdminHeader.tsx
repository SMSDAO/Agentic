'use client';

import { Bell, User as UserIcon } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/components/auth/AuthProvider';

interface AdminHeaderProps {
  breadcrumbs: Array<{ label: string; href?: string }>;
}

export function AdminHeader({ breadcrumbs }: AdminHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-dark-surface/50 backdrop-blur-xl sticky top-0 z-20">
      <Breadcrumbs items={breadcrumbs} />

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <Avatar
            src={user?.avatar_url}
            alt={user?.full_name || user?.email}
            fallback={user?.full_name?.[0] || user?.email?.[0]}
            size="sm"
          />
          <div className="text-sm">
            <p className="font-medium">{user?.full_name || 'Admin'}</p>
            <p className="text-gray-400 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
