'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RegisterRestaurantPage() {
  const router = useRouter();

  // حق الحساب
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // حق المطعم / المقهى
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantType, setRestaurantType] = useState<'restaurant' | 'cafe'>(
    'restaurant'
  );
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !restaurantName) {
      setError('اكمل البيانات');
      return;
    }

    setLoading(true);

    // 1) نسوي الحساب
    const { data: signupData, error: signupError } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
      return;
    }

    // مهم: نجيب السيشن الحالي
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setError('تم إنشاء الحساب، لكن ما قدرنا نسجّل دخول. جرّب تسجّل دخول.');
      setLoading(false);
      return;
    }

    const userId = session.user.id;

    // 2) ننشئ المطعم
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .insert({
        name: restaurantName,
        type: restaurantType, // restaurant | cafe
        phone: phone || null,
      })
      .select('id')
      .maybeSingle();

    if (restaurantError || !restaurant) {
      setError(
        restaurantError?.message ||
          'تم إنشاء المستخدم لكن ما قدرنا ننشئ المطعم'
      );
      setLoading(false);
      return;
    }

    // 3) نربط المستخدم بالمطعم كـ owner
    const { error: memberError } = await supabase
      .from('restaurant_members')
      .insert({
        restaurant_id: restaurant.id,
        user_id: userId,
        role: 'owner',
      });

    if (memberError) {
      setError(
        'المطعم انشأناه لكن الربط ما تم، راجع الإدارة: ' + memberError.message
      );
      setLoading(false);
      return;
    }

    // كل شيء تمام → ودّه للوحة التحكم
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1F1528] px-4">
      <form
        onSubmit={handleRegister}
        className="bg-[#241A30] rounded-2xl p-6 w-full max-w-md border border-white/5 space-y-4"
      >
        <h1 className="text-2xl font-bold text-[#F8E27C] text-center">
          تسجيل مطعم / مقهى
        </h1>
        <p className="text-white/40 text-center text-sm mb-2">
          أنشئ حساب للمالك، ثم أربط المطعم بلوحة Trying
        </p>

        {/* بيانات الحساب */}
        <div>
          <label className="text-white/60 text-sm block mb-1">الإيميل</label>
          <input
            className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="owner@restaurant.com"
          />
        </div>

        <div>
          <label className="text-white/60 text-sm block mb-1">
            كلمة المرور
          </label>
          <input
            className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </div>

        {/* بيانات المطعم */}
        <hr className="border-white/5 my-3" />

        <div>
          <label className="text-white/60 text-sm block mb-1">
            اسم المطعم / المقهى
          </label>
          <input
            className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 text-white"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            required
            placeholder="Trying Coffee House"
          />
        </div>

        <div>
          <label className="text-white/60 text-sm block mb-1">النوع</label>
          <select
            className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 text-white"
            value={restaurantType}
            onChange={(e) =>
              setRestaurantType(e.target.value as 'restaurant' | 'cafe')
            }
          >
            <option value="restaurant">مطعم</option>
            <option value="cafe">مقهى</option>
          </select>
        </div>

        <div>
          <label className="text-white/60 text-sm block mb-1">
            رقم التواصل (اختياري)
          </label>
          <input
            className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 text-white"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+9665xxxxxxx"
          />
        </div>

        {error && <p className="text-red-300 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#F8E27C] text-black font-semibold py-2 rounded-md"
        >
          {loading ? 'جاري التسجيل...' : 'تسجيل المطعم'}
        </button>

        <p
          onClick={() => (window.location.href = '/login')}
          className="text-center text-white/40 text-sm hover:text-white/80 cursor-pointer"
        >
          عندك حساب؟ تسجيل دخول
        </p>
      </form>
    </div>
  );
}