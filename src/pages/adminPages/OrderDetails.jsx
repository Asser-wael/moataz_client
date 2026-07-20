import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, updateOrderStatus } from "../../features/orderSlice";
import Loading from "../../components/loading";
import { IoClose, IoArrowBack } from "react-icons/io5";

const STATUS_OPTIONS = ["pending", "accepted", "preparing", "completed", "cancelled"];

const STATUS_STYLES = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  accepted: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  preparing: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function OrderDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, loading,id} = useSelector((state) => state.orderSlice);
  const [status, setStatus] = useState("");
  const [img, setImg] = useState(null);

 const order= orders.find(i => i._id == id)


  useEffect(() => {
    if (order?.status) {
      setStatus(order.status);
    }
  }, [order]);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    dispatch(updateOrderStatus({ id, status: newStatus }));
  };

  // شاشة عرض صورة إثبات الدفع بحجم كبير
  if (img) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
        <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-2 shadow-xl max-w-2xl w-full">
          <img
            src={img}
            alt="Payment Proof Preview"
            className="w-full rounded-xl object-contain max-h-[80vh] mx-auto"
          />
          <button
            onClick={() => setImg(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)] text-white transition-all duration-200 hover:rotate-90 hover:scale-110 shadow-md"
          >
            <IoClose size={22} />
          </button>
        </div>
      </div>
    );
  }

  if (loading || !order) {
    return <Loading />;
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto text-[var(--color-text)] min-h-screen bg-[var(--color-bg)]">
      {/* العودة للخلف + الهيدر */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/orders")}
            className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] hover:bg-[var(--color-border)]/20 transition text-[var(--color-text)]"
            title="Back to Orders"
          >
            <IoArrowBack size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">
              Order #{order._id ? order._id.slice(-8) : "------"}
            </h1>
            <p className="text-xs text-[var(--color-muted)] mt-0.5">
              Full ID: {order._id}
            </p>
          </div>
        </div>

        {/* أدوات التحكم في الحالة */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-sm font-medium text-[var(--color-muted)] hidden sm:inline">Change Status:</span>
          <select
            value={status}
            onChange={handleStatusChange}
            className={`flex-1 sm:flex-initial border px-4 py-2 rounded-lg text-sm outline-none cursor-pointer font-bold tracking-wide uppercase transition ${
              STATUS_STYLES[status] ?? STATUS_STYLES.pending
            }`}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="bg-[var(--color-card)] text-[var(--color-text)] font-semibold normal-case">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* كارت تفاصيل الأوردر الرئيسي */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm rounded-xl p-5 space-y-6">
        
        {/* شبكة الأوقات والحالة الحالية */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm bg-[var(--color-bg)]/40 p-4 rounded-xl border border-[var(--color-border)]">
          <div>
            <p className="text-[var(--color-muted)] text-xs mb-1">Current Status</p>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider ${
              STATUS_STYLES[order.status] ?? STATUS_STYLES.pending
            }`}>
              {order.status || "pending"}
            </span>
          </div>

          <div>
            <p className="text-[var(--color-muted)] text-xs mb-1">Order Time</p>
            <p className="font-semibold">
              {order.createdAt ? new Date(order.createdAt).toLocaleString() : "—"}
            </p>
          </div>

          <div>
            <p className="text-[var(--color-muted)] text-xs mb-1">Last Updated</p>
            <p className="font-semibold">
              {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : "—"}
            </p>
          </div>
        </div>

        {/* بيانات العميل والدفع */}
        <div className="border-t border-[var(--color-border)] pt-4">
          <h2 className="font-bold mb-3 text-lg">Customer & Payment Info</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-[var(--color-bg)] p-4 rounded-xl border border-[var(--color-border)]">
            <div>
              <p className="text-[var(--color-muted)] text-xs">WhatsApp / Contact</p>
              <p className="font-semibold text-[var(--color-accent)]">{order.whats || "—"}</p>
            </div>
            <div>
              <p className="text-[var(--color-muted)] text-xs">Wallet Name</p>
              <p className="font-semibold">{order.walletName || "—"}</p>
            </div>
            <div>
              <p className="text-[var(--color-muted)] text-xs">Wallet Number</p>
              <p className="font-semibold">{order.walletNumber || "—"}</p>
            </div>
            <div>
              <p className="text-[var(--color-muted)] text-xs">Wallet Type</p>
              <p className="font-semibold capitalize">{order.walletType || "—"}</p>
            </div>

            {order.image && (
              <div 
                className="col-span-2 md:col-span-4 mt-2 cursor-pointer w-fit" 
                onClick={() => setImg(`${import.meta.env.VITE_API_URL}/uploads/${order.image}`)}
              >
                <p className="text-[var(--color-muted)] text-xs mb-1">Payment Proof (Click to enlarge)</p>
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/${order.image}`}
                  alt="Proof"
                  className="h-20 w-20 rounded-lg object-cover border border-[var(--color-border)] hover:scale-105 transition shadow-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* المنتجات المطلوبة */}
        <div className="border-t border-[var(--color-border)] pt-4">
          <h2 className="font-bold mb-3 text-lg">Ordered Items</h2>
          <div className="space-y-3">
            {order.cart?.map((item, index) => (
              <div
                key={item._id || index}
                className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/30 p-4 md:flex-row md:items-center"
              >
                {/* صورة المنتج إن وجدت */}
                {item.image && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${item.image}`}
                    alt={item.name}
                    className="h-20 w-20 rounded-xl object-cover border border-[var(--color-border)] bg-[var(--color-card)]"
                  />
                )}

                {/* تفاصيل المنتج */}
                <div className="flex-1">
                  <h3 className="text-base font-bold">{item.name || "Product"}</h3>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {item.option && (
                      <span className="rounded-full bg-[var(--color-card)] px-3 py-1 border border-[var(--color-border)] font-medium">
                        Option: <b className="text-[var(--color-text)]">{item.option}</b>
                      </span>
                    )}
                    <span className="rounded-full bg-[var(--color-card)] px-3 py-1 border border-[var(--color-border)] font-medium">
                      Qty: <b className="text-[var(--color-text)]">{item.count}</b>
                    </span>
                    <span className="rounded-full bg-[var(--color-card)] px-3 py-1 border border-[var(--color-border)] font-medium">
                      Unit Price: <b className="text-[var(--color-text)]">{item.price || 0} L.E</b>
                    </span>
                  </div>
                </div>

                {/* حساب السعر الإجمالي للمنتج */}
                <div className="text-left md:text-right min-w-[120px] border-t md:border-t-0 pt-2 md:pt-0 border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-muted)]">Subtotal</p>
                  <p className="text-base font-extrabold text-[var(--color-accent)]">
                    {(item.price || 0) * (item.count || 0)} L.E
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* إجمالي الفاتورة النهائي */}
        <div className="flex justify-between items-center text-xl font-bold border-t border-[var(--color-border)] pt-5">
          <span className="text-[var(--color-text)] text-base md:text-lg">Grand Total</span>
          <span className="text-2xl font-black text-[var(--color-accent)]">
            {order.totalPrice || 0} L.E
          </span>
        </div>
      </div>
    </div>
  );
}