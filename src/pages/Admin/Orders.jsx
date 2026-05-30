import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllOrders } from "../../rudex/store/orderSlice";
import Loading from "../../components/loading";
import Toast from "../../components/Toast";
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

  return (
    <div className="w-full p-4 text-white">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center max-md:flex-col gap-3 mb-6"
      >
        <h1 className="text-2xl font-bold text-green-400">
          Orders Dashboard
        </h1>

        <input
          placeholder="Search Order ID..."
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border-b-2 border-green-500 bg-transparent outline-none"
        />
      </motion.div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filtered?.map((order) => (
          <motion.div
            key={order._id}
            whileHover={{ scale: 1.03 }}
            className="bg-zinc-900 p-5 rounded-xl border border-white/10 shadow"
          >

            {/* TOP */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-green-400 font-bold">
                #{order._id.slice(-6)}
              </h2>

              <span className="text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* USER */}
            <p className="text-sm text-gray-300 mb-1">
              User:{" "}
              <span className="text-white font-semibold">
                {order.userId?.name || "unknown"}
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
            <p className="mb-3">
              Status:{" "}
              <span className={`
                font-bold
                ${order.status === "pending" && "text-yellow-400"}
                ${order.status === "confirmed" && "text-blue-400"}
                ${order.status === "completed" && "text-green-400"}
                ${order.status === "rejected" && "text-red-400"}
              `}>
                {order.status}
              </span>
            </p>

            {/* ITEMS */}
            <div className="text-sm text-gray-400 mb-4">
              {order.cart?.slice(0, 2).map((item) => (
                <div key={item._id}>
                  • {item.productId?.productName} × {item.quantity}
                  {item.productId?.accountType}
                  {item.productId?.productCategory}
                </div>
              ))}

              {order.cart?.length > 2 && (
                <p className="text-xs text-gray-500">
                  +{order.cart.length - 2} more
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              onClick={() => navigate(`/admin/orders/${order._id}`)}
              className="w-full bg-green-500 text-black font-bold py-2 rounded-lg hover:bg-green-400"
            >
              View Details
            </button>

          </motion.div>
        ))}

      </div>
    </div>
  );
}