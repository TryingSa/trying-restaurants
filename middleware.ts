import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const protectedPaths = ['/dashboard', '/menu', '/orders', '/loyalty', '/settings', '/admin'];

  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path),
  );

  if (isProtected && !user) {
    const redirectUrl = new URL('/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/menu/:path*', '/orders/:path*', '/loyalty/:path*', '/settings/:path*', '/admin/:path*'],
};