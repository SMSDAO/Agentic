'use client';

import { Sidebar } from '@/components/admin/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="flex min-h-screen bg-dark-bg">
        <Sidebar />
        <main className="flex-1 ml-64">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
