import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { CiHeart } from "react-icons/ci";

import { getFavorites, toggleFavorite } from "../../features/favoritesSlice";
import { setView } from "../../features/usersSlice";
import UserView from "../../components/UserView";

export default function Favorites() {
  const dispatch = useDispatch();

  const {
    favorites = [],
    loadingFavorites,
    loadingToggle,
  } = useSelector((state) => state.favoritesSlice);

  const { view } = useSelector((state) => state.usersSlice);

  useEffect(() => {
    dispatch(getFavorites());
  }, [dispatch]);

  const handleToggle = async (product) => {
    await dispatch(toggleFavorite(product));
    dispatch(getFavorites()); // يحدث القائمة بعد الإضافة أو الحذف
  };

  if (view) {
    return <UserView />;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 text-[var(--color-text)] sm:px-5 sm:py-10 md:px-8">
      <div className="mb-8 border-b border-[var(--color-border)] pb-8">
        <h1 className="font-serif text-[26px] italic text-[var(--color-text)] sm:text-[32px] md:text-[38px]">
          Favorites
        </h1>

        <p className="mt-1 text-[13px] text-[var(--color-muted)]">
          {favorites.length} saved item{favorites.length !== 1 ? "s" : ""}
        </p>
      </div>

      {loadingFavorites || loadingToggle ? (
        <div className="flex items-center justify-center py-24 text-[var(--color-muted)]">
          Loading...
        </div>
      ) : favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 border border-[var(--color-border)] px-4 py-16 text-center text-[var(--color-muted)] sm:py-24">
          <CiHeart className="text-6xl opacity-40" />
          <p className="text-sm">No favorite products yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((product, index) => {
            const editions = product.account?.filter(
              (e) => e.price !== null && e.price !== undefined
            );
            const firstAvailable =
              editions?.find((e) => e.count > 0) ?? editions?.[0];

            const hasOffer = !!product.offer && !!firstAvailable?.priceOffer;
            const inStock = !!firstAvailable && firstAvailable.count > 0;

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
                className="group flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${product.image}`}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {hasOffer && (
                    <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white shadow">
                      Offer
                    </span>
                  )}

                  {!inStock && (
                    <span className="absolute left-3 top-3 rounded-full bg-black/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white shadow">
                      Sold out
                    </span>
                  )}

                  <button
                    onClick={() => handleToggle(product)}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-bg)]/90 backdrop-blur shadow-sm transition hover:scale-105"
                    aria-label="Toggle favorite"
                    disabled={loadingToggle}
                  >
                    <CiHeart className="text-xl text-red-500 fill-red-500" />
                  </button>
                </div>

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {product.Category && (
                      <span className="rounded-full bg-[var(--color-accent)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]">
                        {product.Category}
                      </span>
                    )}
                    {product.GameplayType && (
                      <span className="rounded-full bg-[var(--color-border)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                        {product.GameplayType}
                      </span>
                    )}
                  </div>

                  <h3 className="text-[15px] font-semibold text-[var(--color-text)] sm:text-[16px]">
                    {product.name}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-[13px] text-[var(--color-muted)]">
                    {product.description}
                  </p>

                  {editions?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5 border-t border-[var(--color-border)] pt-3">
                      {editions.map((e, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-[var(--color-bg)] px-2 py-1 text-[10px] font-semibold text-[var(--color-muted)]"
                        >
                          {e.name} · {e.count > 0 ? `${e.count} in stock` : "sold out"}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex flex-1 items-end justify-between gap-3 border-t border-[var(--color-border)] pt-4">
                    <div>
                      {firstAvailable?.name && (
                        <span className="block text-[11px] text-[var(--color-muted)]">
                          {firstAvailable.name}
                        </span>
                      )}

                      {firstAvailable ? (
                        hasOffer ? (
                          <div className="flex items-baseline gap-2">
                            <span className="text-[13px] text-[var(--color-muted)] line-through">
                              {firstAvailable.price} L.E
                            </span>

                            <span className="text-[18px] font-bold text-red-500">
                              {firstAvailable.priceOffer} L.E
                            </span>
                          </div>
                        ) : (
                          <div className="text-[18px] font-bold text-[var(--color-accent)]">
                            {firstAvailable.price} L.E
                          </div>
                        )
                      ) : (
                        <span className="text-[13px] font-semibold text-[var(--color-muted)]">—</span>
                      )}
                    </div>

                    <button
                      onClick={() => dispatch(setView(product))}
                      className="shrink-0 whitespace-nowrap rounded-full border border-[var(--color-text)] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text)] transition-colors hover:bg-[var(--color-text)] hover:text-[var(--color-bg)]"
                    >
                      View
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <style>{`
        .font-serif {
          font-family: "Fraunces", serif;
        }
      `}</style>
    </div>
  );
}