import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { CiHeart, CiSearch } from "react-icons/ci";
import { FiShoppingCart } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { getAllProducts, setCat } from "../../features/productsSlice";
import { getAllCategories } from "../../features/customuseSlice";
import { setView } from "../../features/usersSlice";
import { addToCart } from "../../features/cartSlice";
import { setNotification } from "../../features/notificationSlice";
import { getFavorites, toggleFavorite } from "../../features/favoritesSlice";
import UserView from "../../components/UserView";

const FALLBACK_IMAGE = "https://placehold.co/600x450/111/fff?text=No+Image";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

export default function Products() {
  const dispatch = useDispatch();
  const { products, loadingProducts, cat } = useSelector((state) => state.productsSlice);
  const { categories, loadingCategories } = useSelector((state) => state.customuseSlice);
  const { view } = useSelector((state) => state.usersSlice);
  const { favorites = [] } = useSelector((state) => state.favoritesSlice);

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAllCategories());
    dispatch(getFavorites());
  }, [dispatch]);

  const handleToggleFavorite = async (product) => {
    await dispatch(toggleFavorite(product));
    dispatch(getFavorites());
  };

  const isInFavorites = (productId) => favorites.some((p) => p._id === productId);

  const filteredProducts = products?.filter((product) => {
    const text = search.toLowerCase();
    const matchesSearch =
      product.name?.toLowerCase().includes(text) ||
      product.description?.toLowerCase().includes(text) ||
      product.Category?.toLowerCase().includes(text);
    const matchesCategory = cat === "All" || product.Category === cat;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product, account) => {
    dispatch(
      addToCart({
        _id: product.id,
        name: product.name,
        image: product.image,
        option: account.name,
        price: product.offer ? account.priceOffer : account.price,
      })
    );
    dispatch(
      setNotification({
        message: `${product.name} - ${account.name} added to cart`,
        type: "success",
      })
    );
  };

  /* ================= HELPERS (SAME AS CODE 1) ================= */

  const capitalize = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const getCategoryStyle = (category) => {
    const base = "border px-3 py-1 rounded-full font-semibold tracking-wide text-xs";

    switch (category?.toLowerCase()) {

      case "playstaiton":
        return `${base} text-sky-400 border-sky-400 bg-sky-400/10`;
      case "xbox":
        return `${base} text-green-400 border-green-400 bg-green-400/10`;
      case "steam":
        return `${base} text-cyan-300 border-cyan-300 bg-cyan-300/10`;
      case "pc":
        return `${base} text-gray-300 border-gray-500 bg-gray-500/10`;
      default:
        return `${base} text-yellow-400 border-yellow-400 bg-yellow-400/10`;
    }
  };

  if (view) return <UserView />;

  return (
    <div className="w-full min-h-screen bg-black text-white py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ================= HERO SECTION ================= */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          className="mb-12 text-center"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-400/20 text-green-400 text-xs font-bold tracking-widest uppercase backdrop-blur-xl"
          >
            <HiOutlineSparkles className="text-sm" /> The Arsenal
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mt-4 text-3xl sm:text-5xl font-black text-white tracking-tight"
          >
            EVERY ACCOUNT. <span className="text-green-400 drop-shadow-[0_0_25px_rgba(34,197,94,0.4)]">EVERY EDITION.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-3 text-sm sm:text-base text-gray-400 max-w-xl mx-auto"
          >
            Vetted accounts, official keys, and exclusive editions — delivered instantly, priced to win.
          </motion.p>

          {/* Search Box */}
          <motion.div
            variants={fadeUp}
            className="relative max-w-md mx-auto mt-6 flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 focus-within:border-green-500/50 focus-within:shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all"
          >
            <CiSearch className="text-xl text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search titles, genres, editions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none"
            />
          </motion.div>
        </motion.div>

        {/* ================= CATEGORY FILTERS ================= */}
        <div className="mb-8 flex flex-wrap justify-center gap-2.5">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(setCat("All"))}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              cat === "All"
                ? "bg-green-500/20 border border-green-400/40 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                : "bg-zinc-900 border border-zinc-800 text-gray-400 hover:border-green-500/30 hover:text-green-300"
            }`}
          >
            All
          </motion.button>

          {loadingCategories
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-zinc-800" />
              ))
            : categories?.map((category, index) => (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => dispatch(setCat(category.name))}
                  className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    cat === category.name
                      ? "bg-green-500/20 border border-green-400/40 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                      : "bg-zinc-900 border border-zinc-800 text-gray-400 hover:border-green-500/30 hover:text-green-300"
                  }`}
                >
                  {category.name}
                </motion.button>
              ))}
        </div>

        {/* Titles Counter */}
        {!loadingProducts && (
          <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-gray-400">
            {filteredProducts?.length ?? 0} titles found
          </p>
        )}

        {/* ================= PRODUCTS GRID ================= */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {loadingProducts &&
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] w-full animate-pulse rounded-3xl bg-zinc-900 border border-zinc-800"
              />
            ))}

          {!loadingProducts &&
            filteredProducts?.map((product) => {
              const firstAccount = product.account?.find((a) => a.count > 0) ?? product.account?.[0];
              const inStock = !!firstAccount && firstAccount.count > 0;

              return (
                <motion.div
                  key={product.id}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-zinc-900 border border-green-500/10 hover:border-green-500/30 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] transition-all cursor-pointer"
                >
                  {/* Image Container */}
                  <div
                    onClick={() => dispatch(setView(product))}
                    className="relative aspect-[16/10] w-full overflow-hidden bg-black"
                  >
                    <img
                      src={`${import.meta.env.VITE_API_URL}/uploads/${product.image}`}
                      alt={product.name}
                      onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/10 to-transparent" />

                    {/* Category Badge */}
                    <div className={`absolute top-3 right-3 z-10 backdrop-blur-xl ${getCategoryStyle(product.Category)}`}>
                      {capitalize(product.Category)}
                    </div>

                    {/* Offer / Out of stock Badge */}
                    {product.offer && (
                      <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-red-500/20 border border-red-400/30 text-red-300 text-[10px] font-bold tracking-widest backdrop-blur-xl">
                        🔥 DEAL
                      </div>
                    )}

                    {!inStock && !product.offer && (
                      <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700 text-gray-400 text-[10px] font-bold tracking-widest backdrop-blur-xl">
                        OUT OF STOCK
                      </div>
                    )}

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(product);
                      }}
                      className="absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 border border-white/10 text-white backdrop-blur-md transition-all hover:scale-110"
                      aria-label="Toggle favorite"
                    >
                      <CiHeart className={`text-xl ${isInFavorites(product._id) ? "text-red-500 fill-red-500" : "text-white"}`} />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col p-5 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {product.GameplayType && (
                        <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] font-semibold text-gray-300">
                          {product.GameplayType}
                        </span>
                      )}
                    </div>

                    <h3
                      onClick={() => dispatch(setView(product))}
                      className="text-lg font-bold text-white group-hover:text-green-400 transition-colors line-clamp-1"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Price & Action Footer */}
                    <div className="pt-4 border-t border-zinc-800/80 flex items-end justify-between gap-2 mt-auto">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400">
                          {firstAccount?.name ?? "Unavailable"}
                        </p>
                        {firstAccount ? (
                          product.offer ? (
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                              <span className="text-xs text-gray-500 line-through">
                                L.E {firstAccount.price}
                              </span>
                              <span className="text-lg font-extrabold text-green-400">
                                L.E {firstAccount.priceOffer}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-white mt-0.5 block">
                              L.E {firstAccount.price}
                            </span>
                          )
                        ) : (
                          <span className="text-xs font-semibold text-gray-500">—</span>
                        )}
                      </div>

                      <motion.button
                        disabled={!inStock}
                        whileHover={inStock ? { scale: 1.04 } : {}}
                        whileTap={inStock ? { scale: 0.95 } : {}}
                        onClick={() => inStock && handleAddToCart(product, firstAccount)}
                        className="px-4 py-2.5 rounded-2xl bg-green-500/15 border border-green-400/30 text-green-300 font-semibold text-xs hover:bg-green-500/25 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <FiShoppingCart size={14} />
                        {inStock ? "Add" : "N/A"}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </motion.div>

        {/* ================= EMPTY STATE ================= */}
        {!loadingProducts && filteredProducts?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center text-gray-400">
            <span className="text-6xl mb-4">🎮</span>
            <h3 className="text-xl font-bold text-white">No titles match your search</h3>
            <p className="mt-1 text-sm text-gray-400">Try a different keyword or browse another category.</p>
          </div>
        )}
      </div>
    </div>
  );
}