import React, { useEffect, useState } from "react";
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
import { addToCart, addGuestCart } from "../rudex/store/cartSlice";
import { setNotification } from "../rudex/store/notificationSlice";
import Loading from "./loading";

function CardSlider() {
  const [index, setIndex] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { deal, loadingDeal } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getDeals());
  }, [dispatch]);

  useEffect(() => {
    if (!deal?.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % deal.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [deal]);

  if (loadingDeal) return <Loading />;
  if (!deal?.length) return null;

  const current = deal[index];

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % deal.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + deal.length) % deal.length);
  };

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
    } catch {
      dispatch(
        setNotification({
          message: "Failed to add product ❌",
          type: "error",
        })
      );
    }
  };

  return (
    <section className="w-full bg-black py-20 text-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <FaFire className="text-green-400 text-3xl" />
            <h2 className="text-4xl md:text-5xl font-black">
              HOT <span className="text-green-400">DEALS</span>
            </h2>
          </div>

          <p className="text-zinc-500">
            Exclusive gaming offers updated daily
          </p>
        </div>

        {/* SLIDER */}
        <div className="relative w-full overflow-hidden">

          <AnimatePresence mode="wait">
            <motion.div
              key={current._id}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.4 }}
              className="
                grid grid-cols-1 md:grid-cols-2
                w-full
                rounded-[24px]
                overflow-hidden
                border border-white/10
                bg-zinc-900
              "
            >

              {/* IMAGE */}
              <div className="relative w-full h-[220px] sm:h-[320px] md:h-full overflow-hidden">

                <img
                  src={current.productImage?.[0]}
                  alt={current.productName}
                  className="
                    w-full h-full object-cover
                    transition-transform duration-700
                    hover:scale-110
                  "
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />

                <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded-full text-green-300 flex items-center gap-2">
                  <FaTag />
                  L.E {current.productPrice}
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-5 sm:p-8 md:p-10 flex flex-col justify-center">

                <span className="text-green-300 text-xs mb-3">
                  {current.productCategory}
                </span>

                <h3 className="text-2xl md:text-4xl font-black mb-4 break-words">
                  {current.productName}
                </h3>

                {/* ❗ FIX IMPORTANT */}
                <p className="text-zinc-400 text-sm md:text-base mb-6 break-words w-full">
                  {current.productDescription}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">

                  <button
                    onClick={() =>
                      navigate(`/home/product/${current._id}`)
                    }
                    className="bg-green-500 text-black px-5 py-3 rounded-xl font-bold w-full sm:w-auto"
                  >
                    View Product
                  </button>

                  <button
                    onClick={() => handleAddToCart(current)}
                    className="bg-white/5 border border-white/10 px-5 py-3 rounded-xl w-full sm:w-auto"
                  >
                    Add To Cart
                  </button>

                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* NAV */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 p-3 rounded-full"
          >
            <FaChevronLeft />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 p-3 rounded-full"
          >
            <FaChevronRight />
          </button>

        </div>

        {/* DOTS */}
        <div className="flex justify-center mt-6 gap-2">
          {deal.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? "w-8 bg-green-400"
                  : "w-2 bg-zinc-700"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default React.memo(CardSlider);