import React ,{ useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTag,
  FaShoppingCart,
  FaFire,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getDeals } from "../rudex/store/profileSlice";

import {
  addToCart,
  addGuestCart,
} from "../rudex/store/cartSlice";

import { setNotification } from "../rudex/store/notificationSlice";

import Loading from "./loading";

function CardSlider() {
  const [index, setIndex] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { deal, loadingDeal } = useSelector(
    (state) => state.profile
  );

  /* ================= GET DEALS ================= */

  useEffect(() => {
    dispatch(getDeals());
  }, [dispatch]);

  /* ================= AUTO SLIDE ================= */

  useEffect(() => {
    if (!deal?.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % deal.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [deal]);

  /* ================= LOADING ================= */

  if (loadingDeal) return <Loading />;

  if (!deal?.length) return null;

  const current = deal[index];

  /* ================= SLIDER FUNCTIONS ================= */

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % deal.length);
  };

  const prevSlide = () => {
    setIndex((prev) =>
      (prev - 1 + deal.length) % deal.length
    );
  };

  /* ================= ADD TO CART ================= */

  const token = localStorage.getItem("accessToken");

  const handleAddToCart = async (product) => {
    try {
      if (token) {
        await dispatch(addToCart(product._id)).unwrap();
      } else {
        dispatch(addGuestCart(product));
      }

      dispatch(
        setNotification({
          message: "Product added successfully 🎉",
          type: "success",
        })
      );
    } catch (error) {
      dispatch(
        setNotification({
          message: "Failed to add product ❌",
          type: "error",
        })
      );
    }
  };

  return (
    <section className="w-full bg-black py-20 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">

        {/* ================= HEADER ================= */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <FaFire className="text-green-400 text-3xl" />

            <h2 className="text-4xl md:text-5xl font-black">
              HOT{" "}
              <span className="text-green-400">
                DEALS
              </span>
            </h2>
          </div>

          <p className="text-zinc-500 text-sm md:text-base">
            Exclusive gaming offers updated daily
          </p>
        </motion.div>

        {/* ================= SLIDER ================= */}

        <div className="relative">

          <AnimatePresence mode="wait">

            <motion.div
              key={current._id}
              initial={{
                opacity: 0,
                x: 120,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x: -120,
                scale: 0.95,
              }}
              transition={{ duration: 0.5 }}
              className="
                grid md:grid-cols-2
                rounded-[30px]
                overflow-hidden
                border border-white/10
                bg-zinc-900
                shadow-[0_0_40px_rgba(34,197,94,0.08)]
              "
            >

              {/* ================= IMAGE ================= */}

              <div className="relative group overflow-hidden">

                <img
                  src={current.productImage?.[0]}
                  alt={current.productName}
                  className="
                    w-full
                    h-[260px]
                    sm:h-[340px]
                    md:h-full
                    object-cover
                    group-hover:scale-110
                    transition duration-700
                  "
                />

                {/* OVERLAY */}

                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent" />

                {/* PRICE */}

                <div
                  className="
                    absolute top-5 left-5
                    flex items-center gap-2
                    px-4 py-2
                    rounded-full
                    bg-black/70
                    backdrop-blur-xl
                    border border-green-500/20
                  "
                >
                  <FaTag className="text-green-400" />

                  <span className="font-bold text-green-300">
                    L.E {current.productPrice}
                  </span>
                </div>

                {/* DEAL BADGE */}

                <div
                  className="
                    absolute bottom-5 left-5
                    px-4 py-2
                    rounded-full
                    bg-green-500/15
                    border border-green-500/20
                    text-green-300
                    text-sm font-bold
                    backdrop-blur-xl
                  "
                >
                  LIMITED OFFER
                </div>
              </div>

              {/* ================= CONTENT ================= */}

              <div className="p-6 md:p-10 flex flex-col justify-center">

                {/* CATEGORY */}

                <div className="mb-4">
                  <span
                    className="
                      px-3 py-1
                      rounded-full
                      bg-green-500/10
                      border border-green-500/20
                      text-green-300
                      text-xs font-bold
                      tracking-widest
                    "
                  >
                    {current.productCategory}
                  </span>
                </div>

                {/* TITLE */}

                <h3
                  className="
                    text-3xl
                    md:text-5xl
                    font-black
                    text-white
                    leading-tight
                    mb-5
                  "
                >
                  {current.productName}
                </h3>

                {/* DESCRIPTION */}

                <p
                  className="
                    text-zinc-400
                    text-sm md:text-base
                    leading-relaxed
                    mb-8

                    w-52
                  "
                >
                  {current.productDescription}
                </p>

                {/* ACTIONS */}

                <div className="flex flex-col sm:flex-row gap-4">

                  {/* VIEW */}

                  <motion.button
                    whileHover={{
                      scale: 1.03,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    onClick={() =>
                      navigate(
                        `/home/product/${current._id}`
                      )
                    }
                    className="
                      px-7 py-3
                      rounded-2xl
                      bg-green-500
                      text-black
                      font-black
                      shadow-lg
                      hover:shadow-green-500/30
                      transition-all
                    "
                  >
                    View Product
                  </motion.button>

                  {/* ADD */}

                  <motion.button
                    whileHover={{
                      scale: 1.03,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    onClick={() =>
                      handleAddToCart(current)
                    }
                    className="
                      px-7 py-3
                      rounded-2xl
                      bg-white/5
                      border border-white/10
                      hover:border-green-500/30
                      hover:bg-green-500/10
                      transition-all
                      flex items-center
                      justify-center
                      gap-3
                      font-semibold
                    "
                  >
                    <FaShoppingCart />

                    Add To Cart
                  </motion.button>

                </div>
              </div>
            </motion.div>

          </AnimatePresence>

          {/* ================= NAV BUTTONS ================= */}

          <button
            onClick={prevSlide}
            className="
              absolute
              left-2 md:-left-6
              top-1/2
              -translate-y-1/2
              w-11 h-11
              md:w-14 md:h-14
              rounded-full
              bg-black/70
              backdrop-blur-xl
              border border-white/10
              flex items-center justify-center
              hover:bg-green-500
              hover:text-black
              transition-all
            "
          >
            <FaChevronLeft />
          </button>

          <button
            onClick={nextSlide}
            className="
              absolute
              right-2 md:-right-6
              top-1/2
              -translate-y-1/2
              w-11 h-11
              md:w-14 md:h-14
              rounded-full
              bg-black/70
              backdrop-blur-xl
              border border-white/10
              flex items-center justify-center
              hover:bg-green-500
              hover:text-black
              transition-all
            "
          >
            <FaChevronRight />
          </button>
        </div>

        {/* ================= INDICATORS ================= */}

        <div className="flex justify-center gap-3 mt-8">

          {deal.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`
                transition-all duration-300 rounded-full

                ${i === index
                  ? "w-10 h-2 bg-green-400"
                  : "w-2 h-2 bg-zinc-700 hover:bg-zinc-500"
                }
              `}
            />
          ))}

        </div>
      </div>
    </section>
  );
}
export default React.memo(CardSlider);