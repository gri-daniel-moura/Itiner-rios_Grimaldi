import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin and /api/admin paths
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Exclude the login paths
    if (pathname === '/admin/login' || pathname === '/api/admin/auth') {
      return NextResponse.next();
    }

    const token = request.cookies.get('admin_token')?.value;
    const isValid = token ? await verifyToken(token) : false;

    if (!isValid) {
      if (pathname.startsWith('/api')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      } else {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
