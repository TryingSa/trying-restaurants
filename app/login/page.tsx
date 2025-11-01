'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(''); // تقدر تحط ايميل افتراضي للتجربة
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // لو تبي بعد الدخول يتأكد انه مرتبط بمطعم:
    // تقدر هنا تعمل fetch لـ restaurant_members وتشوفه
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#120A1C] flex">
      {/* الشريط الجانبي */}
      <aside className="hidden lg:flex w-[320px] bg-gradient-to-b from-[#241A30] to-[#1F1528] flex-col p-8 border-r border-white/5">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-[#F8E27C] flex items-center justify-center">
            <span className="text-[#1F1528] font-bold text-lg">T</span>
          </div>
          <div>
            <p className="text-white font-semibold">Trying Restaurants</p>
            <p className="text-white/40 text-sm">لوحة إدارة المطاعم والمقاهي</p>
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <p className="text-white/70 text-sm">
            أنجز الطلبات، حدّث المنيو، شغّل عروضك الذكية.
          </p>
          <p className="text-white/30 text-xs">
            نسخة تجريبية • Trying OS™
          </p>
        </div>
      </aside>

      {/* المحتوى */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">تسجيل الدخول</h1>
            <p className="text-white/40 text-sm">
              ادخل بالبريد اللي سجّلت فيه كمطعم / مقهى
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
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
            <div>
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

            {error && <p className="text-red-300 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F8E27C] text-black font-semibold py-2 rounded-md hover:bg-[#f8e27ccf] transition"
            >
              {loading ? 'جاري الدخول...' : 'دخول'}
            </button>

            <p
              className="text-center text-white/40 text-sm cursor-pointer hover:text-white/80"
              onClick={() => router.push('/register')}
            >
              ما عندك حساب؟ سجّل مطعم جديد
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}