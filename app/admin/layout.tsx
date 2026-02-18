'use client';

import { Sidebar } from '@/components/admin/Sidebar';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Toast } from '@/components/ui/Toast';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProtectedRoute requireAdmin={true}>
        <div className="flex min-h-screen bg-dark-bg">
          <Sidebar />
          <main className="flex-1 ml-64">
            {children}
          </main>
          <Toast />
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}
