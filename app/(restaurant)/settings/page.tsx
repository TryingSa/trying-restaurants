export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-2">الإعدادات</h1>
      <p className="text-white/40 mb-4">
        بيانات المطعم، الفروع، أوقات العمل، نوع (مطعم/مقهى).
      </p>
      <div className="bg-[#241A30] border border-white/5 rounded-xl p-4">
        (نربطها بجدول restaurants و restaurant_branches)
      </div>
    </div>
  );
}