import { createClient } from '@/lib/supabaseServer';

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // نجيب المطعم
  const { data: member } = await supabase
    .from('restaurant_members')
    .select('restaurant_id, role')
    .eq('user_id', user?.id)
    .maybeSingle();

  if (!member) {
    return (
      <div className="bg-[#2B2036] border border-red-500/20 text-red-200 p-5 rounded-xl">
        ما تم ربطك بأي مطعم إلى الآن. اطلب من الإدارة يربطونك.
      </div>
    );
  }

  const { data: statsOrders } = await supabase
    .from('orders')
    .select('id, status')
    .eq('restaurant_id', member.restaurant_id);

  const totalOrders = statsOrders?.length ?? 0;
  const doneOrders =
    statsOrders?.filter((o) => o.status === 'completed').length ?? 0;

  const { count: menuCount } = await supabase
    .from('restaurant_menu')
    .select('*', { count: 'exact', head: true })
    .eq('restaurant_id', member.restaurant_id);

  const { count: loyaltyCount } = await supabase
    .from('loyalty_transactions')
    .select('*', { count: 'exact', head: true })
    .eq('restaurant_id', member.restaurant_id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">لوحة التحكم</h1>
        <p className="text-white/40 text-sm">
          نظرة سريعة على أداء مطعمك داخل Trying.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="إجمالي الطلبات" value={totalOrders} />
        <StatCard title="الطلبات المكتملة" value={doneOrders} />
        <StatCard title="أصناف المنيو" value={menuCount ?? 0} />
        <StatCard title="عمليات الولاء" value={loyaltyCount ?? 0} />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-[#241A30] rounded-xl p-4 border border-white/5">
      <p className="text-white/50 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}