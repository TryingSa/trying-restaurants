'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type MenuItem = {
  id: string;
  name: string;
  price: number;
  calories: number | null;
  category: string | null;
  is_drink: boolean | null;
  created_at?: string;
};

export default function MenuClient({
  restaurantId,
  initialItems,
}: {
  restaurantId: string;
  initialItems: MenuItem[];
}) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [name, setName] = useState('');
  const [price, setPrice] = useState<string>('');
  const [calories, setCalories] = useState<string>('');
  const [category, setCategory] = useState('main');
  const [isDrink, setIsDrink] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!name.trim()) {
      setError('اكتب اسم الصنف');
      setSaving(false);
      return;
    }
    if (!price) {
      setError('اكتب السعر');
      setSaving(false);
      return;
    }

    const { data, error } = await supabase
      .from('restaurant_menu')
      .insert({
        restaurant_id: restaurantId,
        name,
        price: Number(price),
        calories: calories ? Number(calories) : null,
        category,
        is_drink: isDrink,
      })
      .select()
      .maybeSingle();

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    if (data) {
      setItems((prev) => [data as MenuItem, ...prev]);
    }

    // reset form
    setName('');
    setPrice('');
    setCalories('');
    setCategory('main');
    setIsDrink(false);
    setSaving(false);
  };

  const deleteItem = async (id: string) => {
    const prev = items;
    setItems((p) => p.filter((i) => i.id !== id));

    const { error } = await supabase
      .from('restaurant_menu')
      .delete()
      .eq('id', id)
      .eq('restaurant_id', restaurantId); // حماية زيادة

    if (error) {
      // رجع القديم اذا فيه خطأ
      setItems(prev);
      alert('ما قدرنا نحذف الصنف: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* الفورم */}
      <form
        onSubmit={addItem}
        className="bg-[#241A30] border border-white/5 rounded-xl p-4 grid grid-cols-1 md:grid-cols-6 gap-3"
      >
        <div className="md:col-span-2">
          <label className="text-white/60 text-sm block mb-1">اسم الصنف</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2"
            placeholder="مثال: باستا اليخنة"
          />
        </div>
        <div>
          <label className="text-white/60 text-sm block mb-1">السعر (ر.س)</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            min={0}
            className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2"
            placeholder="48"
          />
        </div>
        <div>
          <label className="text-white/60 text-sm block mb-1">السعرات</label>
          <input
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            type="number"
            min={0}
            className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2"
            placeholder="650"
          />
        </div>
        <div>
          <label className="text-white/60 text-sm block mb-1">التصنيف</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2"
          >
            <option value="main">طبق رئيسي</option>
            <option value="starter">مقبلات</option>
            <option value="drink">مشروبات</option>
            <option value="dessert">حلويات</option>
            <option value="breakfast">فطور</option>
          </select>
        </div>
        <div className="flex items-center gap-2 mt-6 md:mt-8">
          <input
            id="isDrink"
            type="checkbox"
            checked={isDrink}
            onChange={(e) => setIsDrink(e.target.checked)}
          />
          <label htmlFor="isDrink" className="text-white/70 text-sm">
            هذا مشروب / قهوة
          </label>
        </div>
        <div className="flex items-center justify-end md:justify-start md:items-start mt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#B19859] text-black px-4 py-2 rounded-md font-semibold"
          >
            {saving ? '...جارٍ الحفظ' : 'إضافة الصنف'}
          </button>
        </div>

        {error && (
          <p className="text-red-300 text-sm md:col-span-6">{error}</p>
        )}
      </form>

      {/* الجدول */}
      <div className="bg-[#241A30] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="py-3 px-4">الصنف</th>
              <th className="py-3 px-4">السعر</th>
              <th className="py-3 px-4">السعرات</th>
              <th className="py-3 px-4">التصنيف</th>
              <th className="py-3 px-4">نوع</th>
              <th className="py-3 px-4">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-white/40">
                  ما فيه أصناف حالياً
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-white/5">
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4">{item.price} ر.س</td>
                  <td className="py-2 px-4">
                    {item.calories ? `${item.calories} kcal` : '-'}
                  </td>
                  <td className="py-2 px-4">{item.category ?? '-'}</td>
                  <td className="py-2 px-4">
                    {item.is_drink ? 'مشروب' : 'صنف عادي'}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-red-300 hover:text-red-100"
                    >
                      حذف
                    </button>
                    {/* تقدر تضيف زر تعديل هنا بعدين */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}