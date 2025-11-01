'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const router = useRouter();

  // حساب
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // مطعم
  const [name, setName] = useState('');
  const [type, setType] = useState<'restaurant' | 'cafe'>('restaurant');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    // 1) نسوي يوزر
    const { data: signData, error: signErr } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signErr) {
      setError(signErr.message);
      setLoading(false);
      return;
    }

    // نجيب السيشن
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setError('تم إنشاء الحساب، سجّل دخول بعد التفعيل.');
      setLoading(false);
      return;
    }

    const userId = session.user.id;

    // 2) ننشئ المطعم
    const { data: restaurant, error: restErr } = await supabase
      .from('restaurants')
      .insert({
        name,
        type,
        phone: phone || null,
        status: 'pending', // مهم: علشان الإدارة توافق
      })
      .select('id')
      .maybeSingle();

    if (restErr || !restaurant) {
      setError('الحساب انشأناه، لكن ما قدرنا نسجّل المطعم.');
      setLoading(false);
      return;
    }

    // 3) نربط المالك
    const { error: memberErr } = await supabase.from('restaurant_members').insert({
      restaurant_id: restaurant.id,
      user_id: userId,
      role: 'owner',
    });

    if (memberErr) {
      setError('المطعم انشأناه لكن الربط ما تم. تواصل مع الدعم.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    // ودّه للداشبورد أو للوجن
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#120A1C] flex">
      {/* الشريط الجانبي */}
      <aside className="hidden lg:flex w-[320px] bg-gradient-to-b from-[#241A30] to-[#1F1528] flex-col p-8 border-r border-white/5">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-[#F8E27C] flex items-center justify-center">
            {/* لو عندك لوقو شفاف حطه هنا */}
            {/* <Image src="/trying-logo.svg" alt="Trying" width={32} height={32} /> */}
            <span className="text-[#1F1528] font-bold text-lg">T</span>
          </div>
          <div>
            <p className="text-white font-semibold">Trying Restaurants</p>
            <p className="text-white/40 text-sm">لوحة إدارة المطاعم والمقاهي</p>
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <p className="text-white/70 text-sm">
            اربط الفروع، حدث المنيو، راقب الطلبات، وشغّل عروضك الذكية.
          </p>
          <p className="text-white/30 text-xs">
            نسخة تجريبية • Trying OS™
          </p>
        </div>
      </aside>

      {/* المحتوى */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">
              تسجيل مطعم / مقهى
            </h1>
            <p className="text-white/40 text-sm">
              عبّي البيانات عشان ننشئ لك لوحة التحكم فورًا
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* بيانات الحساب */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-white/70 mb-1">الإيميل</label>
                <input
                  type="email"
                  className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#F8E27C]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@restaurant.com"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-white/70 mb-1">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#F8E27C]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <hr className="border-white/5" />

            {/* بيانات المطعم */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-white/70 mb-1">
                  اسم المطعم / المقهى
                </label>
                <input
                  className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#F8E27C]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Trying Coffee House"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">النوع</label>
                <select
                  className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#F8E27C]"
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value as 'restaurant' | 'cafe')
                  }
                >
                  <option value="restaurant">مطعم</option>
                  <option value="cafe">مقهى</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  رقم التواصل
                </label>
                <input
                  className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#F8E27C]"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+9665xxxxxxx"
                />
              </div>
            </div>

            {error && <p className="text-red-300 text-sm">{error}</p>}
            {success && (
              <p className="text-green-200 text-sm">
                تم التسجيل بنجاح 🎉
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F8E27C] text-black font-semibold py-2 rounded-md hover:bg-[#f8e27ccf] transition"
            >
              {loading ? 'جاري التسجيل...' : 'إنشاء الحساب ولوحة المطعم'}
            </button>

            <p
              className="text-center text-white/40 text-sm cursor-pointer hover:text-white/80"
              onClick={() => router.push('/login')}
            >
              عندك حساب؟ تسجيل دخول
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}