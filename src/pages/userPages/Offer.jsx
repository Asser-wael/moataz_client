import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Fuse from "fuse.js";
import { getAllOffers } from "../../features/customuseSlice";
import { setView } from "../../features/usersSlice";
import Loading from "../../components/loading";
import UserView from "../../components/UserView";
import { CiSearch } from "react-icons/ci";
import { HiOutlineBolt } from "react-icons/hi2";
import { FaStar } from "react-icons/fa6";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const FALLBACK_IMAGE = "https://placehold.co/960x540/111/fff?text=No+Image";
const STOCK_SEGMENTS = 6;

const discountOf = (account) =>
  account?.priceOffer > 0 && account?.price > 0
    ? Math.round(100 - (account.priceOffer / account.price) * 100)
    : 0;

const avgRating = (comments) => {
  if (!comments || comments.length === 0) return null;
  const sum = comments.reduce((acc, c) => acc + (c.stars || 0), 0);
  return (sum / comments.length).toFixed(1);
};

export default function Offer() {
  const dispatch = useDispatch();
  const { allOffers, loadingAllOffers } = useSelector((s) => s.customuseSlice);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const { view } = useSelector((state) => state.usersSlice);

  useEffect(() => {
    dispatch(getAllOffers());
  }, [dispatch]);

  const categories = ["All", ...new Set((allOffers ?? []).map((p) => p.Category))];

  const fuse = new Fuse(allOffers ?? [], {
    keys: ["name", "description", "Category"],
    threshold: 0.35,
  });
  const searched = search ? fuse.search(search).map((r) => r.item) : allOffers ?? [];

  const filtered = category === "All" ? searched : searched.filter((p) => p.Category === category);

  const grouped = {};
  for (let i = 0; i < filtered.length; i++) {
    const product = filtered[i];
    const categoryName = product.Category;
    if (grouped[categoryName] === undefined) {
      grouped[categoryName] = [];
    }
    grouped[categoryName].push(product);
  }

  if (view) {
    return <UserView />;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8">
        <motion.div initial="hidden" animate="show" variants={staggerContainer}>
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--color-accent)]"
            style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)" }}
          >
            <HiOutlineBolt /> Live Loadout Deals
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mt-4 text-3xl font-black uppercase tracking-tight text-[var(--color-text)] sm:text-5xl"
          >
            DEALS TOO GOOD <span className="glow-text text-[var(--color-accent)]">TO RESPAWN</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-3 max-w-xl text-sm text-[var(--color-muted)] sm:text-base">
            Grab premium editions before the timer runs out — same accounts, sharper prices.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-6 flex w-full max-w-md items-center gap-2 border border-[var(--color-border)] bg-[var(--color-card)]/70 px-4 py-3 transition-colors focus-within:border-[var(--color-accent)]"
          >
            <CiSearch className="shrink-0 text-xl text-[var(--color-muted)]" />
            <input
              type="text"
              placeholder="Search offers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted)]"
            />
          </motion.div>
        </motion.div>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`border px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors ${
                category === cat
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                  : "border-[var(--color-border)] bg-[var(--color-card)]/60 text-[var(--color-text)] hover:border-[var(--color-accent)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loadingAllOffers && <Loading />}

        {/* Empty */}
        {!loadingAllOffers && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center text-[var(--color-muted)]">
            <p className="mb-4 text-5xl">⚡</p>
            <h3 className="text-lg font-bold text-[var(--color-text)]">No live deals right now</h3>
            <p className="mt-1 text-sm">Check back soon — new drops land regularly.</p>
          </div>
        )}

        {!loadingAllOffers &&
          Object.keys(grouped).map((cat) => (
            <div key={cat} className="mt-14">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-2 w-2 bg-[var(--color-accent)]" />
                <h2 className="font-mono text-[13px] font-black uppercase tracking-[0.22em] text-[var(--color-text)]">
                  {cat}
                </h2>
                <span className="h-px flex-1 bg-[var(--color-border)]" />
                <span className="font-mono text-[10px] text-[var(--color-muted)]">
                  {grouped[cat].length} UNITS
                </span>
              </div>

              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                variants={staggerContainer}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {grouped[cat].map((item) => {
                  const account = item.account?.find((a) => a.priceOffer > 0) || item.account?.[0];
                  const discount = discountOf(account);
                  const totalEditions = item.account?.length ?? 0;
                  const liveEditions = item.account?.filter((a) => a.count > 0).length ?? 0;
                  const stockFilled = account
                    ? Math.max(0, Math.min(STOCK_SEGMENTS, account.count))
                    : 0;
                  const rating = avgRating(item.comment);

                  return (
                    <motion.div
                      key={item._id}
                      variants={fadeUp}
                      whileHover={{ y: -4 }}
                      onClick={() => dispatch(setView(item))}
                      className="group relative cursor-pointer border border-[var(--color-border)] bg-[var(--color-card)] transition-colors hover:border-[var(--color-accent)]/60"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)",
                      }}
                    >

                      <div className="relative aspect-video w-full overflow-hidden bg-[var(--color-bg)]">
                        <img
                          src={`${import.meta.env.VITE_API_URL}/uploads/${item.image}`}
                          alt={item.name}
                          onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                          className="h-full w-full object-cover grayscale-[45%] contrast-110 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                        />

                        <div
                          className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
                          style={{
                            backgroundImage:
                              "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 3px)",
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                        {[
                          "left-2 top-2 border-l-2 border-t-2",
                          "right-2 top-2 border-r-2 border-t-2",
                          "left-2 bottom-2 border-l-2 border-b-2",
                          "right-2 bottom-2 border-r-2 border-b-2",
                        ].map((pos, i) => (
                          <span
                            key={i}
                            className={`absolute h-3 w-3 border-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${pos}`}
                          />
                        ))}

                        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-3 py-2">
                          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/90">
                            {item.GameplayType}
                          </span>
                          {discount > 0 && (
                            <span className="bg-[var(--color-accent)] px-2 py-0.5 font-mono text-[10px] font-black text-white">
                              -{discount}%
                            </span>
                          )}
                        </div>

                        {rating && (
                          <div className="absolute bottom-2 left-3 flex items-center gap-1 font-mono text-[10px] font-bold text-white">
                            <FaStar className="text-[var(--color-accent)]" size={10} />
                            {rating}
                          </div>
                        )}
                      </div>

                      <div className="h-[3px] w-full bg-[var(--color-border)]">
                        <div
                          className="h-full bg-[var(--color-accent)] transition-all duration-500"
                          style={{ width: totalEditions ? `${(liveEditions / totalEditions) * 100}%` : "0%" }}
                        />
                      </div>

                      <div className="p-4">
                        <h3 className="line-clamp-1 text-sm font-bold text-[var(--color-text)]">
                          {item.name}
                        </h3>

                        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
                          {liveEditions}/{totalEditions} editions live
                        </p>

                        <div className="mt-2 flex items-center gap-1">
                          {Array.from({ length: STOCK_SEGMENTS }).map((_, i) => (
                            <span
                              key={i}
                              className={`h-2.5 w-2 ${
                                i < stockFilled ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"
                              }`}
                            />
                          ))}
                          <span className="ml-1 font-mono text-[9px] text-[var(--color-muted)]">
                            {account?.count ?? 0} in stock
                          </span>
                        </div>

                        <div className="mt-3 flex items-baseline gap-1.5 border-t border-[var(--color-border)] pt-3 font-mono">
                          {account?.priceOffer > 0 && (
                            <span className="text-[11px] text-[var(--color-muted)] line-through">
                              {account.price}
                            </span>
                          )}
                          <span className="text-lg font-black text-[var(--color-accent)]">
                            {account?.priceOffer > 0 ? account.priceOffer : account?.price} L.E
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          ))}
      </div>

      <style>{`
        .glow-text { text-shadow: 0 0 15px color-mix(in srgb, var(--color-accent) 45%, transparent); }
      `}</style>
    </div>
  );
}