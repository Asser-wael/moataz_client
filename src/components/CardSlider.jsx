//cluade
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setView } from "../features/usersSlice";
import { FaChevronLeft, FaChevronRight, FaXbox, FaSteam, FaFire } from "react-icons/fa6";
import { SiSony } from "react-icons/si";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const FALLBACK_IMAGE = "https://placehold.co/300x300/111/fff?text=Game";

// أيقونة واحدة بتتحدد حسب اسم الكاتيجوري - بدل ما نكررها 3 مرات جوه الكارد
function categoryIcon(category) {
  const name = category?.toLowerCase() ?? "";
  if (name.includes("playstation")) return <SiSony size={11} />;
  if (name.includes("xbox")) return <FaXbox size={11} />;
  if (name.includes("pc") || name.includes("steam")) return <FaSteam size={11} />;
  return null;
}

export default function CardSlider() {
  const dispatch = useDispatch();
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // السلايدر ده بيعتمد بالكامل على الـ offers الجاية من getOffers
  const { offers = [], loadingoffers } = useSelector((state) => state.customuseSlice);

  if (loadingoffers) {
    return (
      <div className="w-full py-12 flex gap-5 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="min-w-[360px] h-[150px] animate-pulse rounded-3xl bg-[var(--color-card)] border border-[var(--color-border)]"
          />
        ))}
      </div>
    );
  }

  if (!offers.length) return null;

  return (
    <div className="relative w-full py-10">
      {/* الرأس */}
      <div className="flex w-full items-end justify-between mb-8 px-1">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)] block mb-2">
            Curated Deals
          </span>
          <h2 className="font-serif text-[28px] italic text-[var(--color-text)] sm:text-[32px]">
            Featured Editions
          </h2>
        </div>

        <div className="flex gap-2">
          <button
            ref={prevRef}
            className={`p-3 rounded-full border border-[var(--color-border)] text-[var(--color-text)] transition-all duration-300 ${
              canScrollLeft
                ? "opacity-100 hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] cursor-pointer"
                : "opacity-30 cursor-not-allowed"
            }`}
          >
            <FaChevronLeft size={14} />
          </button>
          <button
            ref={nextRef}
            className={`p-3 rounded-full border border-[var(--color-border)] text-[var(--color-text)] transition-all duration-300 ${
              canScrollRight
                ? "opacity-100 hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] cursor-pointer"
                : "opacity-30 cursor-not-allowed"
            }`}
          >
            <FaChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* السلايدر بـ Swiper */}
      <Swiper
        modules={[Navigation]}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        onSlideChange={(swiper) => {
          setCanScrollLeft(!swiper.isBeginning);
          setCanScrollRight(!swiper.isEnd);
        }}
        onReachBeginning={() => setCanScrollLeft(false)}
        onReachEnd={() => setCanScrollRight(false)}
        spaceBetween={20}
        slidesPerView="auto"
        className="!overflow-visible !pb-6"
      >
        {offers.map((product) => {
          const firstAccount = product.account?.[0];
          const hasOffer = Boolean(product.offer) && firstAccount?.priceOffer > 0;
          const discountPercent = hasOffer
            ? Math.round(100 - (firstAccount.priceOffer / firstAccount.price) * 100)
            : null;

          return (
            <SwiperSlide key={product._id} className="!w-[400px] sm:!w-[500px] px-4 ">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                onClick={() => dispatch(setView(product))}
                className="group flex h-full cursor-pointer items-stretch overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] transition-colors hover:border-[var(--color-accent)]/50 hover:shadow-[0_16px_40px_-16px_var(--color-accent)]"
              >
                {/* الصورة - مربعة صغيرة على الشمال */}
                <div className="relative w-50 shrink-0 overflow-hidden bg-[var(--color-bg)] sm:w-40">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${product.image}`}
                    alt={product.name}
                    onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {hasOffer && (
                    <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-lg">
                      <FaFire size={9} />
                      -{discountPercent}%
                    </span>
                  )}
                </div>

                {/* التفاصيل - على اليمين */}
                <div className="flex flex-1 flex-col justify-between p-4 opacity-80">
                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
                      {categoryIcon(product.Category)}
                      {product.Category}
                    </span>

                    <h3 className="mt-1 truncate font-serif text-base font-semibold italic text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)] sm:text-lg">
                      {product.name}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--color-muted)]">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-3 flex items-end justify-between gap-2">
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-[var(--color-muted)]">
                        {firstAccount?.name || "Standard Edition"}
                      </span>
                      {hasOffer ? (
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[11px] text-[var(--color-muted)] line-through">
                            {firstAccount.price}
                          </span>
                          <span className="text-sm font-bold text-[var(--color-accent)]">
                            {firstAccount.priceOffer} <span className="text-[10px] font-normal">EGP</span>
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-[var(--color-text)]">
                          {firstAccount?.price || 0} <span className="text-[10px] font-normal">EGP</span>
                        </span>
                      )}
                    </div>

                    <span className="shrink-0 rounded-full bg-[var(--color-accent)]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)] transition-colors group-hover:bg-[var(--color-accent)] group-hover:text-white">
                      Explore
                    </span>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}