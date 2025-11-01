// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  // نحتاج الرد عشان نمرّره للـ client
  const res = NextResponse.next();

  // نجهّز supabase من الميدلوير
  const supabase = createMiddlewareClient({ req, res });

  // نجيب جلسة المستخدم
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // 1) مسارات مفتوحة ما تبي حماية
  const publicPaths = ['/', '/login', '/register'];
  const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(p));

  // 2) ملفات Next و ستاتيك لازم تمر دايم
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/public')
  ) {
    return res;
  }

  // 3) لو هو مسار مفتوح → خله يمر حتى لو ما هو مسجّل
  if (isPublic) {
    // لو هو مسجّل أصلاً ويزور /login أو /register ودنا نودّيه للداشبورد
    if (session && (pathname === '/login' || pathname === '/register')) {
      const dashboardUrl = new URL('/dashboard', req.url);
      return NextResponse.redirect(dashboardUrl);
    }
    return res;
  }

  // 4) أي مسار غير مفتوح → لازم جلسة
  if (!session) {
    const loginUrl = new URL('/login', req.url);
    // نضيف له redirectTo عشان بعد ما يسجّل نرجعه لنفس الصفحة
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5) لو عنده جلسة → خله يكمل
  return res;
}

// 6) نحدد المسارات اللي يشتغل عليها الميدلوير
export const config = {
  matcher: [
    /*
     * كل شيء ما عدا الملفات الساكنة
     * وخليناها عامة عشان نتحكم احنا فوق
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};