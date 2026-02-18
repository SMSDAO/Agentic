'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
      } else if (requireAdmin && user.role !== 'admin' && user.role !== 'super_admin') {
        router.push('/dashboard');
      } else if (user.status === 'suspended' || user.status === 'banned') {
        router.push('/auth/login?error=account_suspended');
      }
    }
  }, [user, loading, requireAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requireAdmin && user.role !== 'admin' && user.role !== 'super_admin') {
    return null;
  }

  if (user.status === 'suspended' || user.status === 'banned') {
    return null;
  }

  return <>{children}</>;
}
