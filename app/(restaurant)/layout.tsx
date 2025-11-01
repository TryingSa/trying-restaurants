import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic'; // عشان نقرأ المستخدم

export default async function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // نجيب المطعم اللي هو عضو فيه
  let restaurantName = 'مطعمي';
  let restaurantType = '';
  if (user) {
    const { data: member } = await supabase
      .from('restaurant_members')
      .select('restaurant_id, role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (member) {
      const { data: rest } = await supabase
        .from('restaurants')
        .select('name, type')
        .eq('id', member.restaurant_id)
        .maybeSingle();

      if (rest) {
        restaurantName = rest.name ?? restaurantName;
        restaurantType = rest.type ?? '';
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#1F1528] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#241A30] border-r border-white/5 flex flex-col">
        <div className="p-5 border-b border-white/5">
          <h1 className="text-xl font-bold text-[#B19859]">Trying OS</h1>
          <p className="text-xs text-white/50 mt-1">{restaurantName}</p>
          {restaurantType ? (
            <p className="text-[10px] text-white/30">{restaurantType}</p>
          ) : null}
        </div>

        <nav className="flex-1 p-4 space-y-2 text-sm">
          <NavItem href="/dashboard" label="لوحة التحكم" />
          <NavItem href="/orders" label="الطلبات" />
          <NavItem href="/menu" label="المنيو" />
          <NavItem href="/loyalty" label="الولاء" />
          <NavItem href="/settings" label="الإعدادات" />
        </nav>

        <form
          action="/auth/signout"
          method="post"
          className="p-4 border-t border-white/5"
        >
          {/* بنضبط signout بعد شوي */}
          <button
            type="submit"
            className="w-full text-left text-white/50 hover:text-white text-sm"
          >
            تسجيل خروج
          </button>
        </form>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#1F1528]/40 backdrop-blur">
          <div className="text-sm text-white/60">
            منصة المطاعم والمقاهي – Trying
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#B19859]/20 flex items-center justify-center text-xs">
              {user?.email?.[0]?.toUpperCase() ?? 'T'}
            </div>
            <div className="text-xs">
              <p className="text-white/70">{user?.email}</p>
              <p className="text-white/30">متصل</p>
            </div>
          </div>
        </header>

        {/* the actual page */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  // ما نقدر نعرف المسار الحالي في السيرفر بسهولة هنا بدون usePathname client
  // فبنسويها ثابتة، ولو تبغى هايلايت نسوي كمبوننت Client بعدين
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-md hover:bg-white/5 transition"
    >
      {label}
    </Link>
  );
}