import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function OrderTracking() {
  const reduxTracking = useSelector(
    (state) => state.orderSlice.OrderTracking
  );

  const [tracking, setTracking] = useState([]);

  useEffect(() => {
    if (reduxTracking) {
      setTracking(reduxTracking);
    }
    console.log(reduxTracking);
    
  }, [reduxTracking]);

  const parseCart = (cartData) => {
    if (!cartData) return [];
    if (Array.isArray(cartData)) return cartData;
    try {
      return JSON.parse(cartData);
    } catch (error) {
      console.error("Error parsing cart data:", error);
      return [];
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] py-8 px-4"
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Order Tracking</h1>
          <p className="text-[var(--color-muted)] mt-2">
            Track the status of your latest orders in real time.
          </p>
        </div>

        {tracking.length === 0 ? (
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-10 text-center shadow-sm">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
            <p className="text-[var(--color-muted)]">
              You don't have any tracked orders yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {tracking?.map((order, index) => {
              const cartItems = parseCart(order?.cart);

              return (
                <div
                  key={order.orderId || index}
                  className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 border-b border-[var(--color-border)]">
                    <div>
                      <h2 className="font-bold text-lg">
                        Order #{order.orderId ? order.orderId.slice(-6) : index + 1}
                      </h2>
                      <p className="text-sm text-[var(--color-muted)] mt-1">
                        {order?.createdAt ? new Date(order.createdAt).toLocaleString() : "Unknown Date"}
                      </p>
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold w-fit
                    ${
                      order?.status === "pending"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : order?.status === "accepted"
                        ? "bg-blue-500/10 text-blue-500"
                        : order?.status === "preparing"
                        ? "bg-purple-500/10 text-purple-500"
                        : order?.status === "completed"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                    >
                      {order?.status ? order.status.toUpperCase() : "PENDING"}
                    </span>
                  </div>

                  {/* Contact & Wallet Summary for user */}
                  <div className="px-5 pt-4 text-sm grid grid-cols-1 sm:grid-cols-2 gap-2 text-[var(--color-muted)] bg-[var(--color-bg)]/50 py-2 border-b border-[var(--color-border)]">
                    {order.whats && <div>💬 WhatsApp: <span className="text-[var(--color-text)] font-medium">{order.whats}</span></div>}
                    {order.walletName && <div>💳 Wallet: <span className="text-[var(--color-text)] font-medium">{order.walletName} ({order.walletType || "Wallet"})</span></div>}
                  </div>

                  {/* Items */}
                  <div className="p-5">
                    <h3 className="font-semibold mb-4">Ordered Items</h3>

                    <div className="space-y-3">
                      {cartItems.length === 0 ? (
                        <p className="text-sm text-[var(--color-muted)]">No items details available.</p>
                      ) : (
                        cartItems.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between border border-[var(--color-border)] rounded-xl p-4"
                          >
                            <div>
                              <h4 className="font-medium">{item?.name || "Product"}</h4>
                              <div className="flex gap-2 items-center mt-1 text-sm text-[var(--color-muted)]">
                                <span>Quantity: {item?.count || 0}</span>
                                {item?.option && (
                                  <span className="bg-[var(--color-card)] border px-2 py-0.5 rounded text-xs">
                                    Option: {item.option}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="font-bold text-[var(--color-accent)]">
                              {(item?.price || 0) * (item?.count || 0)} L.E
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-4 border-t border-[var(--color-border)] flex justify-between items-center bg-[var(--color-bg)]/30">
                    <span className="text-[var(--color-muted)]">Total Amount</span>
                    <span className="font-bold text-xl text-[var(--color-accent)]">
                      {order?.totalPrice || 0} L.E
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}