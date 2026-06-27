import {
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  MdDashboard,
  MdInventory,
  MdShoppingCart,
  MdPeople,
  MdMenu,
  MdLogout,
} from "react-icons/md";
import { FaPager } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../rudex/store/authSlice";
import Toast from "../../components/Toast";

function Dashboard() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const menuItems = [
    { title: "Dashboard", icon: <MdDashboard />, to: "/admin" },
    { title: "Products", icon: <MdInventory />, to: "/admin/products" },
    { title: "Orders", icon: <MdShoppingCart />, to: "/admin/orders" },
    { title: "Users", icon: <MdPeople />, to: "/admin/users" },
    { title: "Home", icon: <FaPager />, to: "/home" },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white overflow-hidden">

      <motion.aside
        animate={{ width: open ? 260 : 80 }}
        className="fixed top-0 left-0 h-screen bg-zinc-950 border-r border-zinc-800 p-4 flex flex-col z-50"
      >
        <button
          onClick={() => setOpen(!open)}
          className="mb-8 text-green-500 text-2xl hover:bg-zinc-800 p-2 rounded-lg w-fit"
        >
          <MdMenu />
        </button>

        <nav className="flex flex-col gap-2 flex-1">
          {menuItems.map((item) => (
            <div
              key={item.to}
              onClick={() => navigate(item.to)}
              className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition ${
                location.pathname === item.to
                  ? "bg-green-600 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              {open && <span>{item.title}</span>}
            </div>
          ))}
        </nav>

        <button
          onClick={async () => {
            await dispatch(logoutUser()).unwrap();
            navigate("/home");
          }}
          className="mt-auto flex items-center gap-4 p-3 text-red-500 hover:bg-red-500/10 rounded-xl"
        >
          <MdLogout className="text-2xl" />
          {open && "Logout"}
        </button>
      </motion.aside>

      <main className="flex-1 ml-[80px] md:ml-[260px] p-6 overflow-x-hidden overflow-y-auto min-h-screen">
        <Toast />
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;