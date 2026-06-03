import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { MdDashboard, MdInventory, MdShoppingCart, MdPeople, MdMenu, MdLogout } from "react-icons/md";
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

  const menuItems = [
    { id: 1, title: "Dashboard", icon: <MdDashboard />, to: "/admin" },
    { id: 2, title: "Products", icon: <MdInventory />, to: "/admin/products" },
    { id: 3, title: "Orders", icon: <MdShoppingCart />, to: "/admin/orders" },
    { id: 4, title: "Users", icon: <MdPeople />, to: "/admin/users" },
    { id: 5, title: "Page", icon: <FaPager />, to: "/home" },
  ];

  const dispatch = useDispatch();

  return (
    <div className="flex h-full w-full bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <motion.div
        animate={{ width: open ? 260 : 80 }}
        className="fixed top-0 left-0 h-screen bg-zinc-950 border-r border-zinc-800 p-4 flex flex-col z-50"
      >
        {/* Toggle Button */}
        <motion.button
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setOpen(!open)}
          className="mb-8 text-green-500 text-2xl hover:bg-zinc-800 p-2 rounded-lg transition-colors w-fit"
        >
          <MdMenu />
        </motion.button>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2 flex-1">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              onClick={() => navigate(item.to)}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.2 }}
              className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 ${location.pathname === item.to
                ? "bg-green-600 text-white"
                : "hover:bg-zinc-800 text-zinc-400 hover:text-white"
                }`}
            >
              <span className="text-2xl">{item.icon}</span>
              {open && <span className="font-medium whitespace-nowrap">{item.title}</span>}
            </motion.div>
          ))}
        </nav>

        {/* Logout Button - تم وضعه في الأسفل باستخدام mt-auto */}
        <motion.button

          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 1 }}
          onClick={async () => {
            try {
              await dispatch(logoutUser()).unwrap();
              window.location.reload();
              navigate("/home");
            } catch (error) {
              console.log(error);
            }
          }}
          className="mt-auto flex items-center gap-4 p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all w-full"
        >
          <span className="text-2xl"><MdLogout /></span>
          {open && <span className="font-medium">Logout</span>}
        </motion.button>
      </motion.div>

      {/* Main Content Area */}
      <div className="p-10 md:p-8 max-w-7xl w-full overflow-y-auto max-sm:translate-7">
        <Toast />

        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;