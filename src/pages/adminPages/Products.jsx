import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FiEye, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { GiGamepad, GiTrophyCup } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

import {
  getAllProducts,
  removeProduct,
  setIdToEdit,
  viewProduct,
} from "../../features/productsSlice";
import View from "../../components/View";
import Edit from "../../components/Edit";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function Products() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    products ,
    selectedProduct,
    selectedProductToEdit,
    loadingProducts,
    loadingAdd,
    loadingEdit,
  } = useSelector((state) => state.productsSlice);

  const [search, setSearch] = useState("");

  const filteredProducts = products?.filter((p) =>
    p.name?.toLowerCase().includes(search?.toLowerCase())
  );
  useEffect(() => {
    dispatch(getAllProducts())
  }, [dispatch]);

  if (selectedProduct) return <View />;
  if (selectedProductToEdit) return <Edit />;

  const isLoading = loadingAdd || loadingProducts || loadingEdit;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 text-[var(--color-text)] sm:px-5 sm:py-10 md:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 border-b-2 border-[var(--color-accent)]/30 pb-6 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-[var(--color-accent)] text-[var(--color-accent)] shadow-[0_0_14px_-4px_var(--color-accent)]">
            <GiTrophyCup size={20} />
          </div>
          <div>
            <h1 className="font-serif text-[24px] italic sm:text-[30px]">
              Game Library
            </h1>
            <p className="text-[12px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
              {products?.length ?? 0} titles in the catalog
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={15} />
            <input
              type="text"
              placeholder="Search titles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] py-2.5 pl-9 pr-4 text-[14px] outline-none transition focus:border-[var(--color-accent)]"
            />
          </div>

          <button
            onClick={() => navigate("add")}
            className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-[13px] font-black uppercase tracking-[0.05em] text-[var(--color-bg)] transition-colors hover:opacity-90"
          >
            <GiGamepad size={15} />
            Add game
          </button>
        </div>
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-96 w-full animate-pulse rounded-2xl bg-[var(--color-card)]" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredProducts?.length === 0 && (
        <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--color-border)] px-4 text-center">
          <GiGamepad className="text-3xl text-[var(--color-muted)]" />
          <p className="text-[14px] text-[var(--color-muted)]">
            No titles match your search.
          </p>
        </div>
      )}

      {/* Games grid */}
      {!isLoading && filteredProducts?.length > 0 && (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProducts?.map((item) => {
            const editions = (item.account ?? item.sizes)?.filter(
              (e) => e.price !== null && e.price !== ""
            );
            const lowestPrice = editions?.length
              ? Math.min(...editions.map((e) => Number(e.price)))
              : null;

            return (
              <motion.div
                key={item._id}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm transition-shadow hover:shadow-lg"
              >
                {/* Cover */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${item.image}`}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />

                  {item.offer && (
                    <span className="absolute left-3 top-3 rounded-md bg-[var(--color-accent)] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[var(--color-bg)] shadow-lg">
                      Deal
                    </span>
                  )}

                  <span
                    className={`absolute right-3 top-3 rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] shadow-lg ${item.availability ? "bg-green-500 text-white" : "bg-red-500 text-white"
                      }`}
                  >
                    {item.availability ? "Ready" : "Sold out"}
                  </span>

                  {/* Actions — always visible on mobile, hover on desktop */}
                  <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 p-3 opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
                    <button
                      onClick={() => dispatch(viewProduct(item._id))}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-bg)]/90 text-[var(--color-text)] backdrop-blur-sm transition hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)]"
                      aria-label="View game"
                    >
                      <FiEye size={14} />
                    </button>
                    <button
                      onClick={() => dispatch(setIdToEdit(item._id))}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-bg)]/90 text-[var(--color-text)] backdrop-blur-sm transition hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)]"
                      aria-label="Edit game"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      onClick={() => dispatch(removeProduct(item._id))}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-bg)]/90 text-red-500 backdrop-blur-sm transition hover:bg-red-500 hover:text-white"
                      aria-label="Remove game"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-serif text-[16px] italic leading-tight">
                      {item.name}
                    </h2>
                    {lowestPrice !== null && (
                      <span className="shrink-0 rounded-md bg-[var(--color-bg)] px-2 py-1 text-[12px] font-bold text-[var(--color-accent)]">
                        {lowestPrice} EGP
                      </span>
                    )}
                  </div>

                  <p className="mt-1.5 line-clamp-2 text-[12px] text-[var(--color-muted)]">
                    {item.description}
                  </p>

                  <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-accent)]">
                    {item.Category}
                  </span>

                  {/* Editions */}
                  {editions?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5 border-t border-[var(--color-border)] pt-3">
                      {editions.map((e, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-[var(--color-bg)] px-2 py-1 text-[10px] font-semibold text-[var(--color-muted)]"
                        >
                          {e.name} · {e.price} EGP
                        </span>
                      ))}
                    </div>
                  )}

                  <span className="mt-3 text-[10px] text-[var(--color-muted)]">
                    Added {new Date(item.createdAt).toLocaleDateString("en-GB", { dateStyle: "medium" })}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <style>{`
        .font-serif { font-family: "Fraunces", serif; }
      `}</style>
    </div>
  );
}