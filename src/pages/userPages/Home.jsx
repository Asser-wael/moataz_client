import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// أيقونات المنصات
import { FaXbox, FaSteam } from "react-icons/fa6";
import { SiSony } from "react-icons/si";

// Redux slices
import { getAllProducts, setCat } from "../../features/productsSlice";
import { getOffers, getPopularProducts, getAllCategories } from "../../features/customuseSlice";
import { setView } from "../../features/usersSlice";
import UserView from "../../components/UserView";
import CardSlider from "../../components/CardSlider";

/* ================= ANIMATION VARIANTS ================= */
const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// شريط المنصات المتحرك — العنصر المميز اللي بيدي هوية الصفحة
const MARQUEE_ITEMS = [
  "PLAYSTATION",
  "XBOX",
  "PC / STEAM",
  "INSTANT DELIVERY",
  "SECURE PAYMENTS",
  "24/7 SUPPORT",
];

// فئات افتراضية لو الـ API لسه ملوش كاتيجوريز
const DEFAULT_CATEGORIES = [
  { name: "PLAYSTATION", icon: <SiSony />, searchName: "PlayStation" },
  { name: "XBOX", icon: <FaXbox />, searchName: "Xbox" },
  { name: "PC / STEAM", icon: <FaSteam />, searchName: "Steam" },
];

const FALLBACK_IMAGE = "https://placehold.co/300x300/111/fff?text=%20";

// أيقونة افتراضية حسب اسم الكاتيجوري لو مفيهاش صورة
function platformIcon(name) {
  const upper = name?.toUpperCase() ?? "";
  if (upper.includes("XBOX")) return <FaXbox />;
  if (upper.includes("SONY") || upper.includes("PLAYSTATION")) return <SiSony />;
  return <FaSteam />;
}

// خلي أول عنصر في البروداكتس المفضلة ياخد مساحة أكبر (بينتو ستايل)
const bentoClass = (i) => (i === 0 ? "sm:col-span-2 sm:row-span-2" : "");

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [viewAll, setViewAll] = useState(false);

  const {
    categories = [],
    loadingCategories,
    popularProducts = [],
    loadingPopular,
  } = useSelector((state) => state.customuseSlice);

  const { view } = useSelector((state) => state.usersSlice);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getOffers());
    dispatch(getAllProducts());
    dispatch(getAllCategories());
    dispatch(getPopularProducts());
  }, [dispatch]);

  if (view) {
    return <UserView />;
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      className="bg-[var(--color-bg)] text-[var(--color-text)] overflow-hidden min-h-screen"
    >
      {/* ================= HERO SECTION ================= */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden pb-16"
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.3, ease: "backOut" }}
          className="absolute w-[300px] h-[300px] sm:w-[560px] sm:h-[560px] blur-[130px] rounded-full pointer-events-none glow-blob"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="max-w-4xl relative z-10 space-y-5"
        >
          <motion.span
            variants={fadeUp}
            className="font-bold tracking-widest text-xs uppercase sm:text-sm px-4 py-1.5 rounded-full inline-block border border-[var(--color-border)] text-[var(--color-accent)] pill-soft"
          >
            Premium Gaming Marketplace
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-7xl font-black tracking-tight leading-none text-[var(--color-text)]"
          >
            LEVEL UP YOUR
          </motion.h1>

          <motion.span
            variants={fadeUp}
            whileHover={{ scale: 1.04 }}
            className="text-[var(--color-accent)] text-3xl md:text-6xl block font-black cursor-default select-none glow-text"
          >
            GAMING EXPERIENCE
          </motion.span>

          <motion.p
            variants={fadeUp}
            className="text-[var(--color-muted)] mt-6 max-w-xl mx-auto text-sm md:text-base"
          >
            Buy premium accounts, official cd-keys, and exclusive deals instantly with 100% secured delivery.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/products")}
              className="px-8 py-4 bg-[var(--color-accent)] text-[var(--color-bg)] font-bold rounded-2xl transition-all cta-glow"
            >
              Start Shopping
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const element = document.getElementById("popular-products");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-4 border border-[var(--color-border)] rounded-2xl bg-[var(--color-card)] font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)]"
            >
              Explore Products
            </motion.button>
          </motion.div>
        </motion.div>

        {/* الشريط المتحرك — العنصر المميز اللي بيدي هوية بصرية للصفحة */}
        <div className="w-full mt-16 relative z-10 border-y border-[var(--color-border)] py-3 marquee-mask">
          <div className="marquee-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((label, i) => (
              <span key={i} className="marquee-item">
                {label}
                <span className="marquee-dot">•</span>
              </span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ================= OFFERS (CARD SLIDER) ================= */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="p-6 border-b border-[var(--color-border)] card-bg-soft"
      >
        <CardSlider />
      </motion.section>

      {/* ================= GAME CATEGORIES ================= */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 px-6 max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)] block mb-2">
              Browse By
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-[var(--color-text)]">
              GAME <span className="text-[var(--color-accent)]">CATEGORIES</span>
            </h2>
          </div>
          {categories.length > 3 && (
            <button
              onClick={() => setViewAll(!viewAll)}
              className="text-xs sm:text-sm font-semibold text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
            >
              {viewAll ? "Show Less" : "View All"}
            </button>
          )}
        </div>

        {loadingCategories ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-3xl bg-[var(--color-border)]" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4"
          >
            {categories.length === 0
              ? DEFAULT_CATEGORIES.map((cat, i) => (
                  <motion.div
                    key={i}
                    variants={scaleIn}
                    whileHover={{ y: -4 }}
                    onClick={() => {
                      dispatch(setCat(cat.searchName));
                      navigate("/products");
                    }}
                    className="card-bg-soft group flex aspect-square cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border border-[var(--color-border)] text-center transition-all hover:border-[var(--color-accent)]"
                  >
                    <div className="text-4xl text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-accent)]">
                      {cat.icon}
                    </div>
                    <h3 className="text-sm font-bold tracking-wider text-[var(--color-text)]">{cat.name}</h3>
                  </motion.div>
                ))
              : (viewAll ? categories : categories.slice(0, 4)).map((category) => (
                  <motion.div
                    key={category._id}
                    variants={scaleIn}
                    whileHover={{ y: -4 }}
                    onClick={() => {
                      dispatch(setCat(category.name));
                      navigate("/products");
                    }}
                    className="card-bg-soft group flex aspect-square cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border border-[var(--color-border)] p-6 text-center transition-all hover:border-[var(--color-accent)]"
                  >
                    {category.image ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}/uploads/${category.image}`}
                        alt={category.name}
                        onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                        className="h-16 w-16 rounded-2xl border border-[var(--color-border)] object-cover transition-all group-hover:border-[var(--color-accent)]"
                      />
                    ) : (
                      <div className="text-3xl text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-accent)]">
                        {platformIcon(category.name)}
                      </div>
                    )}
                    <h3 className="w-full truncate text-sm font-bold uppercase tracking-wide text-[var(--color-text)]">
                      {category.name}
                    </h3>
                  </motion.div>
                ))}
          </motion.div>
        )}
      </motion.section>

      {/* ================= POPULAR PRODUCTS (BENTO) ================= */}
<motion.section
  id="popular-products"
  variants={fadeUp}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, margin: "-100px" }}
  className="py-20 px-6 max-w-7xl mx-auto"
>
  <div className="text-center mb-14">
    <span className="text-[11px] uppercase tracking-[0.3em] text-[var(--color-accent)] font-semibold">
      Fan Favorites
    </span>

    <h2 className="mt-2 text-3xl md:text-5xl font-black text-[var(--color-text)]">
      POPULAR{" "}
      <span className="text-[var(--color-accent)]">PRODUCTS</span>
    </h2>

    <p className="mt-4 text-[var(--color-muted)] max-w-xl mx-auto">
      Browse the most purchased gaming accounts with secure delivery and the
      best prices.
    </p>
  </div>

  {loadingPopular ? (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-[360px] rounded-3xl bg-[var(--color-border)] animate-pulse"
        />
      ))}
    </div>
  ) : (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7"
    >
      {popularProducts?.slice(0, 8).map((item) => {
        const product = item.id || item;
        if (!product) return null;

        const mainAccount =
          product.account?.find((a) => a.priceOffer || a.price) ||
          product.account?.[0];

        return (
          <motion.div
            key={product._id}
            variants={fadeUp}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.25 }}
            onClick={() => dispatch(setView(product))}
            className="group overflow-hidden rounded-3xl bg-[var(--color-bg)] border border-white/5 hover:border-[var(--color-accent)] hover:shadow-[0_20px_45px_rgba(0,0,0,.45)] transition-all cursor-pointer"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={`${import.meta.env.VITE_API_URL}/uploads/${product.image}`}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/900x600/111827/ffffff?text=Game";
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              {product.offer && (
                <span className="absolute top-4 left-4 rounded-full bg-red-500 px-3 py-1 text-[11px] font-bold text-white shadow-lg">
                  SALE
                </span>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/70">
                  {product.Category}
                </span>

                <h3 className="mt-1 text-xl font-bold text-white line-clamp-2">
                  {product.name}
                </h3>
              </div>
            </div>

            <div className="p-5">
              <p className="line-clamp-2 text-sm text-[var(--color-muted)]">
                {product.description}
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs text-[var(--color-muted)]">
                <span>{product.GameplayType}</span>
                <span>•</span>
                <span>{product?.account?.length} Editions</span>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-[var(--color-muted)]">
                    Starting From
                  </p>

                  {mainAccount ? (
                    product.offer && mainAccount.priceOffer ? (
                      <>
                        <p className="text-xs line-through text-gray-500">
                          {mainAccount.price} EGP
                        </p>

                        <h4 className="text-2xl font-black text-[var(--color-accent)]">
                          {mainAccount.priceOffer} EGP
                        </h4>
                      </>
                    ) : (
                      <h4 className="text-2xl font-black text-[var(--color-accent)]">
                        {mainAccount.price} EGP
                      </h4>
                    )
                  ) : (
                    <span className="text-sm text-gray-500">
                      Out of Stock
                    </span>
                  )}
                </div>

                <button className="rounded-xl bg-[var(--color-accent)]  text-[var(--color-text)] px-4 py-2 text-sm font-bold  transition hover:scale-105">
                  View
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  )}
</motion.section>

      {/* أدوات مساعدة تعتمد فقط على متغيرات الثيم */}
      <style>{`
        .glow-blob {
          background-color: color-mix(in srgb, var(--color-accent) 12%, transparent);
        }
        .glow-text {
          text-shadow: 0 0 15px color-mix(in srgb, var(--color-accent) 45%, transparent);
        }
        .pill-soft {
          background-color: color-mix(in srgb, var(--color-accent) 10%, transparent);
        }
        .card-bg-soft {
          background-color: color-mix(in srgb, var(--color-card) 70%, transparent);
        }
        .cta-glow:hover {
          box-shadow: 0 0 20px color-mix(in srgb, var(--color-accent) 40%, transparent);
        }

        .marquee-mask {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 26s linear infinite;
        }
        .marquee-item {
          display: inline-flex;
          align-items: center;
          gap: 1.5rem;
          padding: 0 1.5rem;
          font-family: "Orbitron", sans-serif;
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.18em;
          color: var(--color-muted);
          white-space: nowrap;
        }
        .marquee-dot {
          color: var(--color-accent);
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </motion.div>
  );
}