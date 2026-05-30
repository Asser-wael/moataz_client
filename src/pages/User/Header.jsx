// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllProducts, getUser } from "../../rudex/store/profileSlice";
// import { getCart } from "../../rudex/store/cartSlice";
// import { motion, AnimatePresence } from "framer-motion";
// import { Outlet, useNavigate } from "react-router-dom";
// import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
// import Loading from "../../components/loading";
// import Footer from "../../components/Footer";
// import Toast from "../../components/Toast";
// import { Link } from "react-router-dom";
// import { MdDashboard, MdInventory, MdShoppingCart, MdPeople, MdMenu, MdLogout } from "react-icons/md";
// import { logoutUser } from "../../rudex/store/authSlice";

// export default function Header() {
//   const { userData } = useSelector((state) => state.profile);
//   const { deal, loadingdeal } = useSelector((state) => state.profile);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // حالة التحكم في فتح وإغلاق قائمة الموبايل
//   const [isOpen, setIsOpen] = useState(false);
//   // token
//   const Token = localStorage.getItem("accessToken") || null;
//   const { cart, guestCart, loading } = useSelector((state) => state.cart);
//   useEffect(() => {
//     dispatch(getUser());

//     if (Token) {
//       dispatch(getCart());
//     }
//   }, [dispatch, Token]);

//   const navItems = [
//     { name: "HOME", path: "/home" },
//     { name: "GAMES", path: "/games" },
//     { name: "DEALS", path: "/deals" },
//     { name: "ORDERS", path: "/orders" },
//   ];

//   const handleLogout = async () => {
//     try {
//       await dispatch(logoutUser()).unwrap();

//       setIsOpen(false);
//       window.location.reload();

//       navigate("/home", { replace: true });
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const [search, setSearch] = useState("");
//   const [results, setResults] = useState([]);
//   const [showResults, setShowResults] = useState(false);

//   useEffect(() => {
//     if (!search.trim()) {
//       setResults([]);
//       return;
//     }

//     const delay = setTimeout(async () => {
//       try {
//         const res = await fetch(
//           `/getAllProducts?search=${search}`
//         );
//         const data = await res.json();
//         setResults(data.slice(0, 5)); // 5 suggestions
//       } catch (err) {
//         console.log(err);
//       }
//     }, 300);

//     return () => clearTimeout(delay);
//   }, [search]);

//   // إغلاق قائمة الاقتراحات عند الضغط في أي مكان خارجها
//   useEffect(() => {
//     const handleOutsideClick = () => setShowResults(false);
//     window.addEventListener("click", handleOutsideClick);
//     return () => window.removeEventListener("click", handleOutsideClick);
//   }, []);

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.4 }}
//       className="w-full min-h-screen bg-black text-white overflow-x-hidden"
//     >

//       {/* HEADER */}
//       <motion.div
//         initial={{ y: -40, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5, ease: "easeOut" }}
//         className="w-full border-b border-green-500/10 backdrop-blur-xl bg-black/40 sticky top-0 z-50"
//       >
//         <div className="w-full px-4 md:px-8 py-4 flex items-center justify-between gap-4">

//           {/* LEFT: LOGO & HAMBURGER (MOBILE) */}
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="lg:hidden text-xl text-green-400 p-2 rounded-xl bg-green-500/10 border border-green-500/20 cursor-pointer"
//             >
//               {isOpen ? <FaTimes /> : <FaBars />}
//             </button>

//             {/* LOGO */}
//             <motion.h1
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               onClick={() => navigate("/home")}
//               className="
//                 text-xl md:text-2xl font-extrabold uppercase tracking-[3px] md:tracking-[5px]
//                 text-green-400 drop-shadow-[0_0_12px_rgba(0,255,120,0.8)]
//                 font-['Orbitron'] cursor-pointer select-none
//               "
//             >
//               MOATEZ
//             </motion.h1>
//           </div>

//           {/* DESKTOP NAV */}
//           <nav className="hidden lg:block">
//             <motion.ul className="flex items-center gap-6 xl:gap-8">
//               {navItems.map((item, index) => (
//                 <motion.li
//                   key={item.name}
//                   initial={{ opacity: 0, y: -20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3, delay: 0.1 * index }}
//                   whileHover={{ scale: 1.05 }}
//                 >
//                   <Link
//                     to={item.path}
//                     className="text-xs xl:text-sm tracking-[2px] font-semibold text-gray-300 hover:text-green-500 transition-colors"
//                   >
//                     {item.name}
//                   </Link>
//                 </motion.li>
//               ))}
//             </motion.ul>
//           </nav>

//           {/* RIGHT SIDE: SEARCH & BUTTONS */}
//           <div className="flex items-center gap-3 msg:gap-4 ml-auto lg:ml-0">

//             {/* SEARCH (DESKTOP) */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.4 }}
//               className="relative hidden sm:block w-[180px] md:w-[260px] xl:w-[320px]"
//               onClick={(e) => e.stopPropagation()} // منع إغلاق القائمة عند الضغط داخل الصندوق
//             >
//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 onFocus={() => setShowResults(true)}
//                 placeholder="Search games..."
//                 className="
//                   w-full bg-green-500/5 backdrop-blur-xl
//                   border border-green-500/20 rounded-2xl
//                   py-2 pl-4 pr-4 text-sm text-white
//                   outline-none transition-all
//                   focus:border-green-400
//                   focus:shadow-[0_0_20px_rgba(0,255,120,0.2)]
//                 "
//               />

//               {/* Suggestions Dropdown */}
//               <AnimatePresence>
//                 {showResults && results.length > 0 && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: 10 }}
//                     className="absolute top-full left-0 w-full mt-2 bg-black/95 border border-green-500/20 rounded-2xl overflow-hidden backdrop-blur-2xl z-50 shadow-[0_4px_30px_rgba(0,255,120,0.1)]"
//                   >
//                     {results.map((product) => (
//                       <div
//                         key={product._id || product.id}
//                         onClick={() => {
//                           navigate(`/game/${product._id || product.id}`);
//                           setShowResults(false);
//                           setSearch("");
//                         }}
//                         className="px-4 py-3 hover:bg-green-500/10 cursor-pointer flex items-center justify-between transition-colors border-b border-green-500/5 last:border-b-0"
//                       >
//                         <span className="text-sm font-medium text-gray-200 hover:text-green-400 transition-colors">
//                           {product.title || product.name}
//                         </span>
//                         {product.price && (
//                           <span className="text-xs text-green-400 font-mono">
//                             ${product.price}
//                           </span>
//                         )}
//                       </div>
//                     ))}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>

//             {/* CART */}
//             <motion.button
//               whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(34,197,94,0.3)" }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => navigate("/cart")}
//               className="
//                 relative p-2.5 md:p-3 rounded-xl md:rounded-2xl
//                 bg-green-500/10 border border-green-500/20
//                 text-green-300 cursor-pointer transition-all
//                 hover:border-green-400
//               "
//             >
//               <FaShoppingCart className="text-sm md:text-base" />
//               <span className="absolute -top-1 -right-1 scale-75 bg-green-700 px-1.5 rounded-full text-[10px] text-white">
//                 {loading
//                   ? "..."
//                   : Token
//                     ? cart?.length || 0
//                     : guestCart?.length || 0}
//               </span>
//             </motion.button>

//             {/* USER PROFILE & LOGIN */}
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => {
//                 if (userData?.role === "admin") {
//                   navigate("/admin");
//                 } else if (!userData?.role) {
//                   navigate("/login");
//                 }
//               }}
//               className="
//                 px-3 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl
//                 bg-green-500/10 border border-green-500/20
//                 text-green-300 text-xs md:text-sm font-medium transition-all
//                 hover:border-green-300 max-w-[120px] md:max-w-[200px] truncate
//               "
//             >
//               {userData?.role === "admin"
//                 ? "Admin"
//                 : userData?.role === "user"
//                   ? userData?.email
//                   : "Login"}
//             </motion.button>

//             {/* LOGOUT BUTTON (DESKTOP) */}
//             {userData?.role && (
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handleLogout}
//                 className="hidden lg:flex items-center justify-center p-2.5 md:p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all cursor-pointer"
//                 title="Logout"
//               >
//                 <MdLogout className="text-lg" />
//               </motion.button>
//             )}
//           </div>
//         </div>

//         {/* MOBILE MENU */}
//         <AnimatePresence>
//           {isOpen && (
//             <motion.div
//               initial={{ x: "-100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "-100%" }}
//               transition={{ type: "spring", bounce: 0, duration: 0.4 }}
//               className="fixed top-[73px] left-0 w-64 h-[calc(100vh-73px)] bg-black/95 border-r border-green-500/10 backdrop-blur-2xl z-40 p-6 lg:hidden flex flex-col justify-between"
//             >
//               <div>
//                 {/* Search inside Mobile Menu */}
//                 <div className="sm:hidden mb-6 relative" onClick={(e) => e.stopPropagation()}>
//                   <input
//                     type="text"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     onFocus={() => setShowResults(true)}
//                     placeholder="Search games..."
//                     className="w-full bg-green-500/5 border border-green-500/20 rounded-xl py-2 px-4 text-sm text-white outline-none focus:border-green-400"
//                   />

//                   {/* Mobile Suggestions Dropdown */}
//                   <AnimatePresence>
//                     {showResults && results.length > 0 && (
//                       <motion.div
//                         initial={{ opacity: 0, y: 5 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: 5 }}
//                         className="absolute top-full left-0 w-full mt-2 bg-black border border-green-500/20 rounded-xl overflow-hidden z-50"
//                       >
//                         {results.map((product) => (
//                           <div
//                             key={product._id || product.id}
//                             onClick={() => {
//                               navigate(`/game/${product._id || product.id}`);
//                               setIsOpen(false);
//                               setShowResults(false);
//                               setSearch("");
//                             }}
//                             className="px-4 py-2.5 hover:bg-green-500/10 cursor-pointer flex items-center justify-between border-b border-green-500/5 last:border-b-0"
//                           >
//                             <span className="text-xs text-gray-200 truncate max-w-[120px]">
//                               {product.title || product.name}
//                             </span>
//                             {product.price && (
//                               <span className="text-[11px] text-green-400">${product.price}</span>
//                             )}
//                           </div>
//                         ))}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>

//                 {/* Navigation Links */}
//                 <ul className="flex flex-col gap-5">
//                   {navItems.map((item) => (
//                     <li
//                       key={item.name}
//                       onClick={() => {
//                         setIsOpen(false);
//                         navigate(item.path);
//                       }}
//                       className="text-sm tracking-[2px] font-semibold text-gray-300 hover:text-green-400 cursor-pointer py-2 border-b border-gray-900 transition-colors"
//                     >
//                       {item.name}
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               {/* LOGOUT BUTTON (MOBILE) */}
//               {userData?.role && (
//                 <motion.button
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   onClick={handleLogout}
//                   className="flex items-center gap-4 p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all w-full mt-auto border border-red-500/10"
//                 >
//                   <span className="text-2xl"><MdLogout /></span>
//                   <span className="font-medium">Logout</span>
//                 </motion.button>
//               )}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>

//       {/* PAGES */}
//       <Outlet />
//       <Footer />
//     </motion.div>
//   );
// }




import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../rudex/store/profileSlice";
import { getCart } from "../../rudex/store/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import api from "../../api/api";
import Footer from "../../components/Footer";
import Toast from "../../components/Toast";

export default function Header() {
  const { userData } = useSelector((state) => state.profile);
  const { cart, guestCart, loading } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const Token = localStorage.getItem("accessToken");

  const navItems = [
    { name: "HOME", path: "/home" },
    { name: "GAMES", path: "/games" },
    { name: "DEALS", path: "/deals" },
    { name: "ORDERS", path: "/orders" },
  ];

  useEffect(() => {
    dispatch(getUser());
    if (Token) dispatch(getCart());
  }, [dispatch, Token]);

  /* ================= SEARCH (FIXED) ================= */
  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await api.get(
          `/getAllProducts?page=1&limit=5&search=${search}`
        );
        setResults(res.data?.products || []);
        setShowResults(true);
      } catch (err) {
        console.log(err);
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClick = (e) => {
      const isInsideSearch = e.target.closest(".search-box");
      if (!isInsideSearch) setShowResults(false);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("accessToken");
    setIsOpen(false);
    window.location.reload();
    navigate("/home", { replace: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-10/12 min-h-screen bg-black text-white overflow-x-hidden"
    >
      <Toast />

      {/* HEADER */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full border-b border-green-500/10 backdrop-blur-xl bg-black/40 sticky top-0 z-50"
      >
        <div className="w-full px-4 md:px-8 py-4 flex items-center justify-between gap-4">

          {/* LEFT: LOGO & HAMBURGER (MOBILE) */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-xl text-green-400 p-2 rounded-xl bg-green-500/10 border border-green-500/20 cursor-pointer"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* LOGO */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={() => navigate("/home")}
              className="
                text-xl md:text-2xl font-extrabold uppercase tracking-[3px] md:tracking-[5px]
                text-green-400 drop-shadow-[0_0_12px_rgba(0,255,120,0.8)]
                font-['Orbitron'] cursor-pointer select-none
              "
            >
              MOATEZ
            </motion.h1>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:block">
            <motion.ul className="flex items-center gap-6 xl:gap-8">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link
                    to={item.path}
                    className="text-xs xl:text-sm tracking-[2px] font-semibold text-gray-300 hover:text-green-500 transition-colors"
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </nav>

          {/* RIGHT SIDE: SEARCH & BUTTONS */}
          <div className="flex items-center gap-3 msg:gap-4 ml-auto lg:ml-0">

            {/* SEARCH — (VISIBLE IN DESKTOP & SCREEN > SM) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative hidden sm:block w-[180px] md:w-[260px] xl:w-[320px] search-box"
            >
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowResults(true)}
                placeholder="Search games..."
                className="
                  w-full bg-green-500/5 backdrop-blur-xl
                  border border-green-500/20 rounded-2xl
                  py-2 pl-4 pr-4 text-sm text-white
                  outline-none transition-all
                  focus:border-green-400
                  focus:shadow-[0_0_20px_rgba(0,255,120,0.2)]
                "
              />

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showResults && results.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-full mt-2 bg-black/95 border border-green-500/20 rounded-2xl overflow-hidden backdrop-blur-2xl z-50 shadow-[0_4px_30px_rgba(0,255,120,0.1)]"
                  >
                    {results.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => {
                          navigate(`/home/product/${item._id}`);
                          setShowResults(false);
                          setSearch("");
                        }}
                        className="px-4 py-3 hover:bg-green-500/10 cursor-pointer flex items-center justify-between transition-colors border-b border-green-500/5 last:border-b-0"
                      >
                        <span className="text-sm font-medium text-gray-200 hover:text-green-400 transition-colors">
                          {item.productName || item.title || item.name}
                        </span>
                        {(item.productPrice || item.price) && (
                          <span className="text-xs text-green-400 font-mono">
                            ${item.productPrice || item.price}
                          </span>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* CART */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(34,197,94,0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/cart")}
              className="
                relative p-2.5 md:p-3 rounded-xl md:rounded-2xl
                bg-green-500/10 border border-green-500/20
                text-green-300 cursor-pointer transition-all
                hover:border-green-400
              "
            >
              <FaShoppingCart className="text-sm md:text-base" />
              <span className="absolute -top-1 -right-1 scale-75 bg-green-700 px-1.5 rounded-full text-[10px] text-white">
                {loading
                  ? "..."
                  : Token
                    ? cart?.length || 0
                    : guestCart?.length || 0}
              </span>
            </motion.button>

            {/* USER PROFILE & LOGIN */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (userData?.role === "admin") {
                  navigate("/admin");
                } else if (!userData?.role) {
                  navigate("/login");
                }
              }}
              className="
                px-3 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl
                bg-green-500/10 border border-green-500/20
                text-green-300 text-xs md:text-sm font-medium transition-all
                hover:border-green-300 max-w-[120px] md:max-w-[200px] truncate
              "
            >
              {userData?.role === "admin"
                ? "Admin"
                : userData?.role === "user"
                  ? userData?.email
                  : "Login"}
            </motion.button>

            {/* LOGOUT BUTTON (DESKTOP) */}
            {userData?.role && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="hidden lg:flex items-center justify-center p-2.5 md:p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all cursor-pointer"
                title="Logout"
              >
                <MdLogout className="text-lg" />
              </motion.button>
            )}
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-[73px] left-0 w-64 h-[calc(100vh-73px)] bg-black/95 border-r border-green-500/10 backdrop-blur-2xl z-40 p-6 lg:hidden flex flex-col justify-between"
            >
              <div>
                {/* Search inside Mobile Menu (for phones below sm breakdown) */}
                <div className="sm:hidden mb-6 relative search-box">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setShowResults(true)}
                    placeholder="Search games..."
                    className="w-full bg-green-500/5 border border-green-500/20 rounded-xl py-2 px-4 text-sm text-white outline-none focus:border-green-400"
                  />

                  {/* Mobile Suggestions Dropdown */}
                  <AnimatePresence>
                    {showResults && results.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute top-full left-0 w-full mt-2 bg-black border border-green-500/20 rounded-xl overflow-hidden z-50"
                      >
                        {results.map((item) => (
                          <div
                            key={item._id}
                            onClick={() => {
                              navigate(`/home/product/${item._id}`);
                              setIsOpen(false);
                              setShowResults(false);
                              setSearch("");
                            }}
                            className="px-4 py-2.5 hover:bg-green-500/10 cursor-pointer flex items-center justify-between border-b border-green-500/5 last:border-b-0"
                          >
                            <span className="text-xs text-gray-200 truncate max-w-[120px]">
                              {item.productName || item.title || item.name}
                            </span>
                            {(item.productPrice || item.price) && (
                              <span className="text-[11px] text-green-400">${item.productPrice || item.price}</span>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Navigation Links */}
                <ul className="flex flex-col gap-5">
                  {navItems.map((item) => (
                    <li
                      key={item.name}
                      onClick={() => {
                        setIsOpen(false);
                        navigate(item.path);
                      }}
                      className="text-sm tracking-[2px] font-semibold text-gray-300 hover:text-green-400 cursor-pointer py-2 border-b border-gray-900 transition-colors"
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>

              {/* LOGOUT BUTTON (MOBILE) */}
              {userData?.role && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleLogout}
                  className="flex items-center gap-4 p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all w-full mt-auto border border-red-500/10"
                >
                  <span className="text-2xl"><MdLogout /></span>
                  <span className="font-medium">Logout</span>
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* PAGES & FOOTER */}
      <Outlet />
      <Footer />
    </motion.div>
  );
}