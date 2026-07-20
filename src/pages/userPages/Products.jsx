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
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
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

  const isInFavorites = (productId) =>
    favorites.some((p) => p._id === productId);

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
        _id: product._id,
        name: product.name,
        image: product.image,
        option: account.name,
        price: product.offer ? account.priceOffer : account.price,
      })
    );
    dispatch(
      setNotification({
        message: `${product.name} _ ${account.name} added to cart`,
        type: "success",
      })
    );
  };

  if (view) return <UserView />;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6">
        {/* Hero */}
        <motion.div initial="hidden" animate="show" variants={staggerContainer} className="mb-10 text-center sm:text-left">
          <motion.span
            variants={fadeUp}
            className="pill-soft inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]"
          >
            <HiOutlineSparkles /> The Arsenal
          </motion.span>

          <motion.h1 variants={fadeUp} className="mt-4 text-3xl font-black tracking-tight text-[var(--color-text)] sm:text-5xl">
            EVERY ACCOUNT. <span className="glow-text text-[var(--color-accent)]">EVERY EDITION.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-muted)] sm:mx-0 sm:text-base">
            Vetted accounts, official keys, and exclusive editions — delivered instantly, priced to win.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="card-bg-soft mx-auto mt-6 flex w-full max-w-md items-center gap-2 rounded-2xl border border-[var(--color-border)] px-4 py-3 transition-colors focus-within:border-[var(--color-accent)] sm:mx-0"
          >
            <CiSearch className="shrink-0 text-xl text-[var(--color-muted)]" />
            <input
              type="text"
              placeholder="Search titles, genres, editions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted)]"
            />
          </motion.div>
        </motion.div>

        {/* Category filters */}
        <div className="mb-8 flex flex-wrap justify-center gap-2 sm:justify-start">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(setCat("All"))}
            className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              cat === "All"
                ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white shadow-[0_0_16px_-4px_var(--color-accent)]"
                : "card-bg-soft border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)]"
            }`}
          >
            All
          </motion.button>

          {loadingCategories
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-[var(--color-card)]" />
              ))
            : categories?.map((category, index) => (
                <motion.button
                  key={category._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => dispatch(setCat(category.name))}
                  className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                    cat === category.name
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white shadow-[0_0_16px_-4px_var(--color-accent)]"
                      : "card-bg-soft border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)]"
                  }`}
                >
                  {category.name}
                </motion.button>
              ))}
        </div>

        {!loadingProducts && (
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
            {filteredProducts?.length ?? 0} titles found
          </p>
        )}

        {/* Products grid */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {loadingProducts &&
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] w-full animate-pulse rounded-3xl bg-[var(--color-card)]" />
            ))}

          {!loadingProducts &&
            filteredProducts?.map((product) => {
              const firstAccount = product.account?.find((a) => a.count > 0) ?? product.account?.[0];
              const inStock = !!firstAccount && firstAccount.count > 0;

              return (
                <motion.div
                  key={product._id}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="card-bg-soft group flex flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] transition-colors hover:border-[var(--color-accent)]/50 hover:shadow-[0_16px_40px_-16px_var(--color-accent)]"
                >
                  {/* Image */}
                  <div
                    onClick={() => dispatch(setView(product))}
                    className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden bg-[var(--color-bg)]"
                  >
                    <img
                      src={`${import.meta.env.VITE_API_URL}/uploads/${product.image}`}
                      alt={product.name}
                      onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                    {product.offer && (
                      <span className="absolute left-3 top-3 rounded-full bg-[var(--color-accent)] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-lg">
                        Deal
                      </span>
                    )}
                    {!inStock && (
                      <span className="absolute left-3 top-3 rounded-full bg-black/75 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-lg">
                        Sold out
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(product);
                      }}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-transform hover:scale-110"
                      aria-label="Toggle favorite"
                    >
                      <CiHeart className={`text-lg ${isInFavorites(product._id) ? "text-red-500" : "text-white"}`} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-4">
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-[var(--color-accent)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]">
                        {product.Category}
                      </span>
                      {product.GameplayType && (
                        <span className="rounded-full bg-[var(--color-border)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                          {product.GameplayType}
                        </span>
                      )}
                    </div>

                    <h3
                      onClick={() => dispatch(setView(product))}
                      className="line-clamp-1 cursor-pointer text-base font-bold text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
                    >
                      {product.name}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--color-muted)]">
                      {product.description}
                    </p>

                    <div className="mt-4 flex items-end justify-between gap-2 border-t border-[var(--color-border)] pt-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
                          {firstAccount?.name ?? "Unavailable"}
                        </p>
                        {firstAccount ? (
                          product.offer ? (
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-[11px] text-[var(--color-muted)] line-through">
                                {firstAccount.price}
                              </span>
                              <span className="text-lg font-black text-[var(--color-accent)]">
                                {firstAccount.priceOffer} <span className="text-xs font-normal">L.E</span>
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-black text-[var(--color-text)]">
                              {firstAccount.price} <span className="text-xs font-normal">L.E</span>
                            </span>
                          )
                        ) : (
                          <span className="text-xs font-semibold text-[var(--color-muted)]">—</span>
                        )}
                      </div>

                      <motion.button
                        disabled={!inStock}
                        whileHover={inStock ? { scale: 1.06 } : {}}
                        whileTap={inStock ? { scale: 0.94 } : {}}
                        onClick={() => inStock && handleAddToCart(product, firstAccount)}
                        className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[var(--color-accent)] px-3 py-2 text-xs font-bold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
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

        {/* Empty state */}
        {!loadingProducts && filteredProducts?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center text-[var(--color-muted)]">
            <p className="mb-4 text-5xl">🎮</p>
            <h3 className="text-lg font-bold text-[var(--color-text)]">No titles match your search</h3>
            <p className="mt-1 text-sm">Try a different keyword or browse another category.</p>
          </div>
        )}
      </div>

      <style>{`
        .glow-text { text-shadow: 0 0 15px color-mix(in srgb, var(--color-accent) 45%, transparent); }
        .pill-soft { background-color: color-mix(in srgb, var(--color-accent) 10%, transparent); }
        .card-bg-soft { background-color: color-mix(in srgb, var(--color-card) 70%, transparent); }
      `}</style>
    </div>
  );
}