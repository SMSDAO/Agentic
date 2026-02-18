import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/tokens', '/nfts', '/defi', '/market', '/ai-agent', '/admin'];
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  // Admin routes that require admin role
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/login', req.url);
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAdminRoute && session) {
    // Check user role
    const { data: user } = await supabase
      .from('users')
      .select('role, status')
      .eq('id', session.user.id)
      .single();

    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (user.status === 'suspended' || user.status === 'banned') {
      return NextResponse.redirect(new URL('/auth/login?error=account_suspended', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/tokens/:path*',
    '/nfts/:path*',
    '/defi/:path*',
    '/market/:path*',
    '/ai-agent/:path*',
    '/admin/:path*',
  ],
};
