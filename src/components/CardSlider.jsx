import React, { useEffect, useRef, useState } from "react";
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

// كود كتالوج قصير للكارت - PS-014 / XB-002 / PC-030 - زي رقم الصنف في محل حقيقي
function catalogCode(category, index) {
  const name = category?.toLowerCase() ?? "";
  let prefix = "GM";
  if (name.includes("playstation")) prefix = "PS";
  else if (name.includes("xbox")) prefix = "XB";
  else if (name.includes("pc") || name.includes("steam")) prefix = "PC";
  return `${prefix}-${String(index + 1).padStart(3, "0")}`;
}

export default function CardSlider() {
  const dispatch = useDispatch();
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // خزّنا الـ swiper instance في state عشان نقدر نربط الأزرار بعد ما الـ refs تتعمل mount
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    if (swiperInstance && prevRef.current && nextRef.current) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.destroy();
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full py-10"
    >
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
            aria-label="Previous"
            className={`p-3 rounded-full border border-[var(--color-border)] text-[var(--color-text)] transition-all duration-300 ${canScrollLeft
              ? "opacity-100 hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] cursor-pointer"
              : "opacity-30 cursor-not-allowed"
              }`}
          >
            <FaChevronLeft size={14} />
          </button>
          <button
            ref={nextRef}
            aria-label="Next"
            className={`p-3 rounded-full border border-[var(--color-border)] text-[var(--color-text)] transition-all duration-300 ${canScrollRight
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
        onSwiper={setSwiperInstance}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        onSlideChange={(swiper) => {
          setCanScrollLeft(!swiper.isBeginning);
          setCanScrollRight(!swiper.isEnd);
        }}
        onReachBeginning={() => setCanScrollLeft(false)}
        onReachEnd={() => setCanScrollRight(false)}
        spaceBetween={24}
        slidesPerView="auto"
        className="!overflow-visible !pb-8"
      >
        {offers.map((product, index) => {
          const firstAccount = product.account?.[0];
          const hasOffer = Boolean(product.offer) && firstAccount?.priceOffer > 0;
          const discountPercent = hasOffer
            ? Math.round(100 - (firstAccount.priceOffer / firstAccount.price) * 100)
            : null;

          return (
            <SwiperSlide key={product._id} className="!w-[340px] px-2">
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: "easeOut" ,delay : index * 0.2}}
                onClick={() => dispatch(setView(product))}
                className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] transition-all duration-300 hover:border-[var(--color-accent)]/60 hover:shadow-[0_24px_48px_-20px_var(--color-accent)]"
              >
                {/* شريط الكاتيجوري - علاقة معلقة على حافة الصورة زي تاج على كيس */}
                <div className="absolute right-4 top-0 z-10 flex items-center gap-1.5 rounded-b-lg bg-[var(--color-accent)] px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-md">
                  {categoryIcon(product.Category)}
                  {product.Category}
                </div>

                {/* الصورة 16:9 */}
                <div className="relative aspect-video w-full overflow-hidden bg-[var(--color-bg)]">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${product.image}`}
                    alt={product.name}
                    onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-card)] via-black/10 to-black/0" />

                  {/* ختم الخصم - زي ستامب مطاطي مايل */}
                  {hasOffer && (
                    <div className="absolute left-3 bottom-3 -rotate-[10deg] rounded-md border-2 border-dashed border-white/80 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                      <span className="flex items-center gap-1">
                        <FaFire size={9} />
                        -{discountPercent}%
                      </span>
                    </div>
                  )}
                </div>

                {/* حافة التذكرة المخرومة - بتفصل الصورة عن التفاصيل */}
                <div
                  aria-hidden
                  className="h-3 w-full bg-[var(--color-bg)]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 8px 8px, var(--color-card) 8px, transparent 8.5px)",
                    backgroundSize: "16px 16px",
                    backgroundPosition: "-8px -8px",
                    backgroundRepeat: "repeat-x",
                  }}
                />

                {/* التفاصيل */}
                <div className="flex flex-1 flex-col justify-between gap-3 bg-[var(--color-card)] p-4 pt-3">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--color-muted)]">
                        {catalogCode(product.Category, index)}
                      </span>
                    </div>

                    <h3 className="truncate font-serif text-lg font-semibold italic text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)]">
                      {product.name}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--color-muted)]">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-end justify-between gap-2 border-t border-dashed border-[var(--color-border)] pt-3">
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
                            {firstAccount.priceOffer}{" "}
                            <span className="text-[10px] font-normal">EGP</span>
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-[var(--color-text)]">
                          {firstAccount?.price || 0} <span className="text-[10px] font-normal">EGP</span>
                        </span>
                      )}
                    </div>

                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-[var(--color-accent)]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)] transition-all group-hover:gap-2 group-hover:bg-[var(--color-accent)] group-hover:text-white">
                      Explore
                      <FaChevronRight size={8} />
                    </span>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </motion.div>
  );
}