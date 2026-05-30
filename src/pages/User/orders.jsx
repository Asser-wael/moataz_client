import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyOrders } from "../../rudex/store/orderSlice";
import Loading from "../../components/loading";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaHome, FaSearch } from "react-icons/fa";

export default function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken")
  if (!token) {
    navigate("/login")
  }

  const { myorders, loading } = useSelector((state) => state.order);

  const [photoOpen, setPhotoOpen] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  if (loading) return <Loading />;

  const filteredOrders = myorders?.filter((order) => {
    return (
      order.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.phoneNum?.includes(search)
    );
  });
  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >

        <h1 className="text-3xl font-bold text-green-400">
          My Orders 📦
        </h1>

        <div className="flex gap-3">

          {/* SEARCH */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="bg-zinc-900 border border-zinc-800 pl-10 pr-4 py-2 rounded-xl outline-none focus:border-green-500"
            />
          </div>

          {/* HOME BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-300"
          >
            <FaHome />
            Home
          </motion.button>

        </div>
      </motion.div>

      {/* ORDERS */}
      {filteredOrders?.length === 0 ? (
        <p className="text-gray-500">No orders found 😢</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredOrders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 hover:border-green-500/30 transition"
            >

              {/* HEADER */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-green-400 font-bold">
                  {order.name}
                </h2>

                <span className={`text-xs px-2 py-1 rounded-full
                  ${order.status === "pending" && "bg-yellow-500/20 text-yellow-400"}
                  ${order.status === "completed" && "bg-green-500/20 text-green-400"}
                  ${order.status === "rejected" && "bg-red-500/20 text-red-400"}
                  ${order.status === "confirmed" && "bg-blue-500/20 text-blue-400"}
                `}>
                  {order.status}
                </span>
              </div>

              {/* INFO */}
              <div className="text-sm text-gray-300 space-y-1 mb-3">
              <p className="text-green-400 font-bold mt-2">
                id:
                 <br />    
                {order._id}
              </p>
                <p>📞 {order.phoneNum}</p>

                <p>
                  💰 Total:{" "}
                  <span className="text-green-400 font-bold">
                    ${order.totalPrice}
                  </span>
                </p>

                <p className="text-gray-500 text-xs">
                  🕒 {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              {/* ITEMS */}
              <div className="bg-black/40 p-3 rounded-xl mb-3">
                <p className="text-green-300 font-bold mb-2">
                  Items
                </p>

                {order.cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between text-sm text-gray-300"
                  >
                    <span>{item.productId?.productName}</span>
                    <span>x{item.quantity}</span>

                  </div>
                ))}
              </div>

              {/* IMAGE */}
              {order.photo && (
                <div
                  onClick={() => setPhotoOpen(order.photo)}
                  className="cursor-pointer rounded-xl overflow-hidden border border-zinc-700 hover:border-green-500 transition"
                >
                  <img
                    src={order.photo}
                    alt="transfer"
                    className="w-full h-40 object-cover hover:scale-105 transition"
                  />
                </div>
              )}

            </motion.div>
          ))}
        </div>
      )}


      {/* IMAGE MODAL */}
      <AnimatePresence>
        {photoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={() => setPhotoOpen(null)}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={photoOpen}
              className="max-w-3xl max-h-[80vh] rounded-xl border border-green-500"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}