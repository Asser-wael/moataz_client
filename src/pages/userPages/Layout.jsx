import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ToggleButton from "../../components/ToggleButton";
import {
  MdMenu,
  MdClose,
  MdHome,
  MdLocalOffer,
  MdFavoriteBorder,
  MdReceiptLong,
  MdOutlineShoppingBag,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { BiPackage } from "react-icons/bi";
import { RiAdminFill } from "react-icons/ri";
import { clearView } from "../../features/usersSlice";
import { useDispatch, useSelector } from "react-redux";


const menuItems = [
  { id: 1, title: "Home", to: "/", icon: <MdHome /> },
  { id: 2, title: "Products", to: "/products", icon: <BiPackage /> },
  { id: 3, title: "Offers", to: "/offers", icon: <MdLocalOffer /> },
  { id: 4, title: "Favorites", to: "/favorites", icon: <MdFavoriteBorder /> },
  { id: 5, title: "Cart", to: "/cart", icon: <MdOutlineShoppingBag /> },
  { id: 6, title: "Orders", to: "/orders", icon: <MdReceiptLong /> },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false); // desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer
  const dispatch = useDispatch();

  const token = localStorage.getItem("accessToken");
  const { cart } = useSelector((state) => state.cartSlice);

  const activeItem = menuItems.find((i) => i.to === location.pathname);
  const { userData: user } = useSelector(
    (state) => state.authSlice
  );
  const goHome = () => {
    dispatch(clearView());
    navigate("/");
  };

  useEffect(() => {
    dispatch(clearView());
    setMobileOpen(false);
  }, [location.pathname, dispatch]);

  const SidebarBody = ({ open, onNavigate }) => (
    <>
      {/* Brand */}
      <div className="mb-8 flex items-center gap-3 px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent)] text-lg font-bold text-[var(--color-bg)] logo">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <AnimatePresence>
          {open &&
            (!user ? (
              <button className=" border-b-2 rounded-b-sm cursor-pointer" onClick={() => navigate("login")}>Login</button>
            ) : (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="logo text-lg text-[var(--color-text)]"
              >
                {user.name}
                <span className="text-[var(--color-accent)]">.</span>
              </motion.span>
            ))}
        </AnimatePresence>
      </div>

      {/* Menu */}
      <nav className="flex flex-1 flex-col gap-1.5 px-3">
        {menuItems.map((item, index) => {
          const active = location.pathname === item.to;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.to)}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active
                ? "font-semibold text-[var(--color-accent)] active-tab-bg"
                : "text-[var(--color-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]"
                }`}
            >
              {active && (
                <motion.span
                  layoutId="userSidebarActive"
                  className="absolute left-0 h-5 w-[3px] rounded-r-full bg-[var(--color-accent)]"
                />
              )}
              <span className="relative text-lg transition-transform group-hover:scale-110">
                {item.icon}
                {item.id === 5 && cart.length > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-[8px] font-bold text-[var(--color-bg)]">
                    {cart.length}
                  </span>
                )}
              </span>
              <AnimatePresence>
                {open && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap uppercase tracking-wide"
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>

              {!open && (
                <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-[var(--color-text)] px-2.5 py-1.5 text-xs font-medium text-[var(--color-bg)] opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  {item.title}
                </span>
              )}
            </motion.button>
          );
        })}

        {user?.role == "admin" && (
          <motion.button
            onClick={() => onNavigate("/admin")}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: menuItems.length * 0.04 }}
            className="group relative mt-1 flex items-center gap-3 rounded-xl border-t border-[var(--color-border)] px-3 pt-3.5 pb-1 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
          >
            <span className="text-lg">
              <RiAdminFill />
            </span>
            {open && <span className="whitespace-nowrap uppercase tracking-wide">Admin</span>}
          </motion.button>
        )}
      </nav>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* DESKTOP SIDEBAR */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 236 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative hidden shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-card)] py-6 lg:flex"
      >
        <SidebarBody open={!collapsed} onNavigate={(to) => navigate(to)} />

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-9 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted)] shadow-sm transition-colors hover:text-[var(--color-accent)]"
        >
          {collapsed ? <MdChevronRight size={14} /> : <MdChevronLeft size={14} />}
        </button>
      </motion.aside>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 top-0 z-50 flex h-screen w-[78vw] max-w-72 flex-col border-r border-[var(--color-border)] bg-[var(--color-card)] py-6 lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-4 top-6 flex h-8 w-8 items-center justify-center rounded-full text-xl hover:bg-[var(--color-bg)]"
                aria-label="Close menu"
              >
                <MdClose />
              </button>
              <SidebarBody
                open
                onNavigate={(to) => {
                  navigate(to);
                  setMobileOpen(false);
                }}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN COLUMN */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* HEADER */}
        <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-xl hover:bg-[var(--color-bg)] lg:hidden"
              aria-label="Open menu"
            >
              <MdMenu />
            </button>

            <motion.div key={activeItem?.title ?? "Store"} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)] lg:hidden">
                MOATAZ<span className="text-[var(--color-accent)]">.</span>
              </p>
              <h1 className="logo text-base text-[var(--color-text)] sm:text-lg">
                {activeItem?.title ?? "Store"}
              </h1>
            </motion.div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate("/cart")}
              className={`relative flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${location.pathname === "/cart"
                ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                : "border-transparent text-[var(--color-muted)] hover:border-[var(--color-border)] hover:text-[var(--color-text)]"
                }`}
              aria-label="Cart"
            >
              <MdOutlineShoppingBag className="text-lg" />
              <AnimatePresence>
                {cart.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-1 -top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-[9px] font-bold text-[var(--color-bg)]"
                  >
                    {cart.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <ToggleButton />
          </div>
        </header>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 overflow-auto"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>

      <style>{`
        .ticker-track {
          width: max-content;
          animation: ticker-scroll 28s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none; }
        }
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .active-tab-bg {
          background-color: color-mix(in srgb, var(--color-accent) 10%, transparent);
        }
      `}</style>
    </div>
  );
}