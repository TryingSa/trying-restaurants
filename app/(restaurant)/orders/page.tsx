export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-2">الطلبات</h1>
      <p className="text-white/40 mb-4">
        إدارة طلبات الصالة + الطلبات الملغاة بطلب من القرسون + حالات الدفع.
      </p>
      <div className="bg-[#241A30] border border-white/5 rounded-xl p-4">
        (لاحقًا نربطها بجداول orders, order_items, order_item_cancel_requests)
      </div>
    </div>
  );
}