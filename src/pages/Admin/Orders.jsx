import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllOrders } from "../../rudex/store/orderSlice";
import Loading from "../../components/loading";
import { motion } from "framer-motion";

export default function Ordersadmin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allOrders, loading } = useSelector((state) => state.order);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  if (loading) return <Loading />;

  const filtered = allOrders
    ?.filter((o) =>
      o._id.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-400 bg-yellow-400/10 border border-yellow-500/30";
      case "confirmed":
        return "text-blue-400 bg-blue-400/10 border border-blue-500/30";
      case "completed":
        return "text-green-400 bg-green-400/10 border border-green-500/30";
      case "rejected":
        return "text-red-400 bg-red-400/10 border border-red-500/30";
      default:
        return "text-gray-300 bg-gray-500/10";
    }
  };

  return (
    <div className="w-full min-h-screen p-6 bg-black text-white">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center max-md:flex-col gap-4 mb-8"
      >
        <h1 className="text-3xl font-bold text-green-400">
          Orders Dashboard
        </h1>

        <input
          placeholder="Search Order ID..."
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-xl outline-none focus:border-green-500 transition"
        />
      </motion.div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {filtered?.map((order, index) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.03 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg hover:border-green-600 transition"
          >

            {/* TOP */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-green-400 font-bold">
                #{order._id.slice(-6)}
              </h2>

              <span className="text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* USER */}
            <p className="text-sm text-gray-400 mb-1">
              User:{" "}
              <span className="text-white font-semibold">
                {order.userId?.name || "Unknown"}
              </span>
            </p>

            {/* TOTAL */}
            <p className="text-sm mb-2">
              Total:{" "}
              <span className="text-green-400 font-bold">
                ${order.totalPrice}
              </span>
            </p>

            {/* STATUS */}
            <div className="mb-4">
              <span className="text-gray-400 text-sm">Status:</span>

              <div
                className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
                  order.status
                )}`}
              >
                {order.status}
              </div>
            </div>

            {/* ITEMS */}
            <div className="text-sm text-gray-400 mb-5 space-y-1">
              {order.cart?.slice(0, 2).map((item) => (
                <div key={item._id}>
                  • {item.productId?.productName} × {item.quantity}
                </div>
              ))}

              {order.cart?.length > 2 && (
                <p className="text-xs text-gray-500">
                  +{order.cart.length - 2} more items
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              onClick={() => navigate(`/admin/orders/${order._id}`)}
              className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-2 rounded-xl transition"
            >
              View Details
            </button>

          </motion.div>
        ))}

      </div>
    </div>
  );
}