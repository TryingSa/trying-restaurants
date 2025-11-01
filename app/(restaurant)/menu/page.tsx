// app/(restaurant)/menu/page.tsx
import { createClient } from '@/lib/supabaseServer';
import MenuClient from './MenuClient';

export const dynamic = 'force-dynamic';

export default async function MenuPage() {
  const supabase = createClient();

  // المستخدم الحالي
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div className="text-white">غير مسجل دخول</div>;
  }

  // المطعم اللي هو عضو فيه
  const { data: member } = await supabase
    .from('restaurant_members')
    .select('restaurant_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!member) {
    return (
      <div className="bg-red-500/10 text-red-200 p-4 rounded">
        لم يتم ربط هذا الحساب بأي مطعم أو مقهى.
      </div>
    );
  }

  // نجيب المنيو
  const { data: menuItems } = await supabase
    .from('restaurant_menu')
    .select('id, name, price, calories, category, is_drink, created_at')
    .eq('restaurant_id', member.restaurant_id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">المنيو</h1>
        <p className="text-sm text-white/40">
          أضف أو عدّل أصناف مطعمك/مقهىك. يدعم السعرات 👌
        </p>
      </div>

      <MenuClient
        restaurantId={member.restaurant_id}
        initialItems={menuItems ?? []}
      />
    </div>
  );
}