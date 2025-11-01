'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('ceo@tryingapp.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
      return;
    }

    // لو نجح → ودّيه للدashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1F1528]">
      <form
        onSubmit={handleLogin}
        className="bg-[#241A30] p-8 rounded-2xl w-full max-w-sm border border-white/5"
      >
        <h1 className="text-center text-2xl font-bold text-[#F8E27C] mb-2">
          Trying Restaurants
        </h1>
        <p className="text-center text-white/40 mb-6">
          سجل دخول للمالك / المطعم / المقهى
        </p>

        <label className="text-white/60 text-sm mb-1 block">الإيميل</label>
        <input
          className="w-full mb-4 bg-black/30 border border-white/10 rounded-md px-3 py-2 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />

        <label className="text-white/60 text-sm mb-1 block">
          كلمة المرور
        </label>
        <input
          className="w-full mb-4 bg-black/30 border border-white/10 rounded-md px-3 py-2 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />

        {error && <p className="text-red-300 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#F8E27C] text-black font-semibold py-2 rounded-md"
        >
          {loading ? 'جاري الدخول...' : 'دخول'}
        </button>
      </form>
    </div>
  );
}