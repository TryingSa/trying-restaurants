'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMsg('❌ ' + error.message);
      setLoading(false);
      return;
    }

    // بعد ما يدخل، نوديه للوحة المطعم
    window.location.href = '/dashboard';
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#1F1528]">
      <form
        onSubmit={login}
        className="bg-[#241A30] p-8 rounded-xl w-[360px] space-y-5 shadow-lg"
      >
        <h1 className="text-[#B19859] text-2xl font-bold text-center">Trying Restaurants</h1>
        <p className="text-white/60 text-sm text-center">سجّل دخول لإدارة المطعم/المقهى</p>

        <div>
          <label className="text-white/60 text-sm block mb-1">الإيميل</label>
          <input
            className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </div>
        <div>
          <label className="text-white/60 text-sm block mb-1">كلمة المرور</label>
          <input
            className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </div>

        {msg && <p className="text-red-400 text-sm">{msg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#B19859] text-black py-2 rounded-md font-semibold"
        >
          {loading ? '...جاري' : 'دخول'}
        </button>
      </form>
    </main>
  );
}