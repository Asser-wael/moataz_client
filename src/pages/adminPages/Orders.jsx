import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminOrders, setOrderView } from "../../features/orderSlice";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loading";
import { motion } from "framer-motion";

const STATUS_STYLES = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  accepted: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  preparing: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { orders, loading } = useSelector((state) => state.orderSlice);

  useEffect(() => {
    dispatch(getAdminOrders());
  }, [dispatch]);

  const safeOrdersList = Array.isArray(orders)
    ? orders
    : (orders?.orders && Array.isArray(orders.orders)
      ? orders.orders
      : (orders?.data && Array.isArray(orders.data) ? orders.data : []));

  const filteredOrders = safeOrdersList.filter((order) => {
    if (!order) return false;

    const orderId = order._id ? String(order._id).toLowerCase() : "";
    const whatsContact = order.whats ? String(order.whats).toLowerCase() : "";
    const walletName = order.walletName ? String(order.walletName).toLowerCase() : "";
    const searchWord = search.toLowerCase();

    const matchesSearch = orderId.includes(searchWord) || whatsContact.includes(searchWord) || walletName.includes(searchWord);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <motion.div
      className="p-4 md:p-8 min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders Management</h1>
        <span className="text-sm bg-[var(--color-card)] px-3 py-1 rounded-full border border-[var(--color-border)]">
          Total Found: {filteredOrders.length}
        </span>
      </div>

      {/* Search & Filter tools */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by Order ID, Wallet name or WhatsApp number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] outline-none transition focus:border-[var(--color-accent)]"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] cursor-pointer outline-none font-medium"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="preparing">Preparing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Grid List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-muted)] bg-[var(--color-card)] rounded-xl border border-[var(--color-border)]">
          No orders found matching your criteria.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                {/* Card Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-[var(--color-muted)]">
                      #{order._id ? order._id.slice(-8) : "——"}
                    </span>
                    <span className="text-xs text-[var(--color-muted)] mt-1">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border uppercase tracking-wider ${STATUS_STYLES[order.status] ?? STATUS_STYLES.pending
                      }`}
                  >
                    {order.status || "pending"}
                  </span>
                </div>

                {/* Contact and Payment info */}
                <div className="text-sm text-[var(--color-muted)] mb-2 flex flex-col gap-1 bg-[var(--color-bg)]/50 p-2 rounded-lg border">
                  <span>💬 WhatsApp: <b className="text-[var(--color-text)]">{order.whats || "—"}</b></span>
                  <span>💳 Wallet: <b className="text-[var(--color-text)]">{order.walletName || "—"}</b></span>
                </div>

                {/* Items loop */}
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 border-t border-[var(--color-border)] pt-2 mt-2">
                  {Array.isArray(order.cart) && order.cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-xs text-[var(--color-muted)] pb-1"
                    >
                      <span className="line-clamp-1 flex-1">
                        {item.name} {item.option ? `(${item.option})` : ""} × {item.count}
                      </span>
                      <span className="text-[var(--color-text)] font-medium ml-2">
                        {item.price && item.count ? (item.price * item.count) : 0} L.E
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action and total price */}
              <div className="mt-4 pt-3 border-t border-[var(--color-border)]">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-[var(--color-muted)]">Total Amount</span>
                  <span className="font-bold text-lg text-[var(--color-accent)]">
                    {order.totalPrice ?? 0} L.E
                  </span>
                </div>

                <button
                  onClick={() => {
                    dispatch(setOrderView(order._id)); 
                    navigate(`/admin/orders/view`); 
                  }}
                  className="w-full bg-[var(--color-accent)] text-white py-2 rounded-lg font-medium hover:opacity-90 transition shadow-sm"
                >
                  View Full Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}