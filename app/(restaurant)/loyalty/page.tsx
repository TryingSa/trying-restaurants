export default function LoyaltyPage() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-2">الولاء</h1>
      <p className="text-white/40 mb-4">
        هنا تقدر تشوف نقاط العملاء اللي صرفوها عندك، والمكافآت.
      </p>
      <div className="bg-[#241A30] border border-white/5 rounded-xl p-4">
        (راح نجيب البيانات من loyalty_accounts و loyalty_transactions)
      </div>
    </div>
  );
}