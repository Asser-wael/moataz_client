import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../rudex/store/orderSlice";
import { getAdminUsers } from "../../rudex/store/adminSlice";
import { getAllProducts } from "../../rudex/store/productSlice";
import Toast from "../../components/Toast";
import { useNavigate } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  FaMoneyBillWave,
  FaShoppingCart,
  FaUsers,
  FaBoxOpen,
} from "react-icons/fa";

import { motion } from "framer-motion";

export default function AdminHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { usersData } = useSelector((state) => state.admin);
  const { products } = useSelector((state) => state.product);
  const { allOrders } = useSelector((state) => state.order);

  // ================= FETCH =================
  useEffect(() => {
    dispatch(getAllOrders());
    dispatch(getAdminUsers());
    dispatch(getAllProducts());
  }, [dispatch]);

  // ================= TOTAL =================
  const totalRevenue = useMemo(() => {
    return allOrders?.reduce(
      (acc, o) => acc + o.totalPrice,
      0
    );
  }, [allOrders]);

  // ================= CHART =================
  const chartData = useMemo(() => {
    return (
      allOrders?.map((o) => ({
        date: new Date(
          o.createdAt
        ).toLocaleDateString(),
        revenue: o.totalPrice,
      })) || []
    );
  }, [allOrders]);

  // ================= STATUS STYLE =================
  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/20 text-amber-400 border border-amber-500/30";

      case "confirmed":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";

      case "completed":
        return "bg-green-500/20 text-green-400 border border-green-500/30";

      case "rejected":
        return "bg-red-500/20 text-red-400 border border-red-500/30";

      default:
        return "bg-zinc-700 text-white";
    }
  };

  // ================= CARDS =================
  const cards = [
    {
      text: "Revenue",
      number: `L.E ${totalRevenue || 0}`,
      icon: <FaMoneyBillWave />,
    },
    {
      text: "Orders",
      number: allOrders?.length || 0,
      icon: <FaShoppingCart />,
    },
    {
      text: "Users",
      number: usersData?.length || 0,
      icon: <FaUsers />,
    },
    {
      text: "Products",
      number: products?.length || 0,
      icon: <FaBoxOpen />,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-7 md:p-6 max-sm:w-85 max-md:w-112">

      <Toast />

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-gray-400">
          Real-time overview
        </p>
      </motion.div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {cards.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.1,
              duration: 0.4,
            }}
            whileHover={{
              scale: 1.03,
            }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:bg-zinc-800 transition-all duration-300"
          >
            <div className="text-2xl mb-3 text-green-500">
              {c.icon}
            </div>

            <h2 className="text-2xl font-bold">
              {c.number}
            </h2>

            <p className="text-gray-400 text-sm">
              {c.text}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ORDERS */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 bg-zinc-900 rounded-2xl p-5 border border-zinc-800"
      >
        <h2 className="text-xl font-bold mb-4">
          Recent Orders
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">

            <thead className="text-gray-400">
              <tr>
                <th className="pb-3 text-left">
                  User
                </th>

                <th className="pb-3 text-left">
                  Price
                </th>

                <th className="pb-3 text-left">
                  Status
                </th>

                <th className="pb-3 text-left">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {allOrders?.slice(0, 5).map((o, index) => (
                <motion.tr
                  key={o._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.1,
                  }}
                  onClick={() =>
                    navigate(`/admin/orders/${o._id}`)
                  }
                  className="border-t border-zinc-800 hover:bg-zinc-800/70 cursor-pointer transition-all duration-200"
                >
                  {/* USER */}
                  <td className="py-4">
                    {o?.userId?.name || "Unknown"}
                  </td>

                  {/* PRICE */}
                  <td className="text-green-400 font-semibold">
                    L.E {o.totalPrice}
                  </td>

                  {/* STATUS */}
                  <td>
                    <motion.span
                      whileHover={{
                        scale: 1.08,
                      }}
                      className={`text-xs px-3 py-1 rounded-full font-semibold capitalize inline-block transition-all duration-300 ${getStatusStyle(
                        o.status
                      )}`}
                    >
                      {o.status}
                    </motion.span>
                  </td>

                  {/* DATE */}
                  <td className="text-gray-400 text-sm">
                    {new Date(
                      o.createdAt
                    ).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* CHART */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 0.5,
          duration: 0.8,
        }}
        className="mt-8 bg-zinc-900 rounded-2xl p-5 border border-zinc-800"
      >
        <h2 className="text-xl font-bold mb-4">
          Revenue Chart
        </h2>

        <div className="h-[300px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart data={chartData}>
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
              />

              <YAxis stroke="#9ca3af" />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#22c55e",
                }}
                activeDot={{
                  r: 7,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}