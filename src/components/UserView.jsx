import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft, FaBoxOpen, FaStar, FaCircleCheck } from "react-icons/fa6";

import { clearView } from "../features/usersSlice";
import { setNotification } from "../features/notificationSlice";
import { addToCart } from "../features/cartSlice";
import { addReview } from "../features/usersSlice";

export default function UserView() {
    const dispatch = useDispatch();
    const { view } = useSelector((state) => state.usersSlice);
    const [account, setAccount] = useState(null);

    const [reviewName, setReviewName] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [reviewStars, setReviewStars] = useState(5);

    useEffect(() => {
        if (view?.account?.length) {
            setAccount(view.account[0]);
        }
    }, [view]);

    if (!view) return null;

    /* ================= HELPERS ================= */

    const capitalize = (text) => {
        if (!text) return "";
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    // كل الفئات بقت بلون الـ accent بتاع الثيم، بس بفروقات شفافية/وزن بسيطة
    // عشان تفضل متسقة مع هوية الموقع في اللايت والدارك مود مع بعض
    const getCategoryStyle = () => {
        return "border border-accent/40 text-accent bg-accent/10 px-3 py-1 rounded-full font-semibold tracking-wide text-xs md:text-sm";
    };

    /* ================= REVIEWS ================= */

    const submitReview = () => {
        if (!reviewName.trim() || !reviewText.trim()) {
            dispatch(
                setNotification({
                    message: "Please fill in your name and review",
                    type: "error",
                })
            );
            return;
        }

        dispatch(
            addReview({
                id: view._id,
                review: {
                    name: reviewName,
                    comment: reviewText,
                    stars: reviewStars,
                },
            })
        );

        setReviewName("");
        setReviewText("");
        setReviewStars(5);

        dispatch(
            setNotification({
                message: "Review added successfully",
                type: "success",
            })
        );
    };

    const avgRating =
        view.comment?.length > 0
            ? (
                view.comment.reduce((sum, c) => sum + (c.stars ?? 0), 0) /
                view.comment.length
            ).toFixed(1)
            : null;

    const effectivePrice = view.offer ? account?.priceOffer : account?.price;
    const outOfStock = !account || account.count === 0;

    /* ================= ADD TO CART ================= */

    const handleAddToCart = () => {
        if (!account) {
            dispatch(
                setNotification({
                    message: "Please select an option",
                    type: "error",
                })
            );
            return;
        }

        if (outOfStock) {
            dispatch(
                setNotification({
                    message: "This option is out of stock",
                    type: "error",
                })
            );
            return;
        }

        dispatch(
            addToCart({
                _id: view._id,
                name: view.name,
                image: view.image,
                option: account.name,
                price: effectivePrice,
            })
        );
        dispatch(setNotification({ message: "Added to cart", type: "success" }));
    };

    return (
        <div className="w-full min-h-screen bg-bg text-text py-6 md:py-10">
            <div className="max-w-7xl mx-auto px-4">
                <button
                    onClick={() => dispatch(clearView())}
                    className="mb-8 flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
                >
                    <FaArrowLeft size={13} />
                    Back
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
                {/* ================= IMAGE ================= */}
                <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="
                    relative overflow-hidden rounded-3xl
                    border border-accent/20
                    bg-card
                    shadow-[0_0_40px_var(--color-accent-glow,rgba(0,0,0,0.06))]
                    "
                >
                    {view.Category && (
                        <div
                            className={`
              absolute top-4 right-4 z-20
              ${getCategoryStyle()}
              backdrop-blur-xl
            `}
                        >
                            {capitalize(view.Category)}
                        </div>
                    )}

                    {view.offer && (
                        <div
                            className="
              absolute top-4 left-4 z-20
              px-3 py-1 rounded-full
              bg-red-500/15 border border-red-400/30
              text-red-400 text-xs md:text-sm font-bold
              tracking-widest backdrop-blur-xl
            "
                        >
                            🔥 OFFER
                        </div>
                    )}

                    {view?.image ? (
                        <img
                            src={`${import.meta.env.VITE_API_URL}/uploads/${view.image}`}
                            alt={view.name}
                            className="
              w-full aspect-video object-cover
              hover:scale-105 transition duration-700
            "
                        />
                    ) : (
                        <div className="w-full aspect-video flex flex-col items-center justify-center">
                            <FaBoxOpen size={64} className="text-muted/60" />
                            <p className="mt-4 text-[13px] text-muted">
                                The product image is not available
                            </p>
                        </div>
                    )}

                    <div
                        className="
              absolute inset-0
              bg-gradient-to-t
              from-bg via-bg/10 to-transparent
              opacity-70
            "
                    />
                </motion.div>

                {/* ================= DETAILS ================= */}
                <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                >
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.1em]">
                            <span
                                className={
                                    view.availability ? "text-accent" : "text-red-400"
                                }
                            >
                                {view.availability ? "Available" : "Not Available"}
                            </span>

                            {avgRating && (
                                <>
                                    <span className="text-muted/50">·</span>
                                    <span className="flex items-center gap-1 text-muted">
                                        <FaStar size={11} className="text-accent" />
                                        {avgRating} ({view.comment.length})
                                    </span>
                                </>
                            )}
                        </div>

                        <div
                            className="
                            text-3xl md:text-5xl font-black
                            text-accent
                            leading-tight
                            break-words
                            flex
                             flex-wrap
                            "
                        >
                            {view.name}
                        </div>

                        <p className="text-[12px] text-muted">
                            {new Date(view.createdAt).toLocaleDateString()}
                        </p>

                        <div className="space-y-2 w-full min-w-0">
                            <h3
                                className="
      text-text/80
      leading-relaxed
      text-sm md:text-base
      break-words
      whitespace-pre-wrap
      max-w-full
    "
                            >
                                {view.description}
                            </h3>
                        </div>
                    </div>

                    <div
                        className="
              inline-flex items-center gap-3
              px-5 py-3 rounded-2xl
              bg-accent/10
              border border-accent/20
            "
                    >
                        <span className="text-text/70 text-sm">Price</span>

                        <span className="text-2xl md:text-3xl font-bold text-text">
                            {effectivePrice != null ? `L.E ${effectivePrice}` : "—"}
                        </span>
                    </div>

                    {/* ================= SPECIFICATIONS ================= */}
                    <div>
                        <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                            Specifications
                        </h3>

                        <div className="rounded-2xl overflow-hidden border border-border bg-card">
                            {view?.account?.map((item, index) => {
                                const isSelected = account?.name === item.name;
                                const isOutOfStock = item.count === 0;

                                return (
                                    <button
                                        key={index}
                                        disabled={isOutOfStock}
                                        onClick={() => setAccount(item)}
                                        className={`flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors ${
                                            index !== 0 ? "border-t border-border" : ""
                                        } ${
                                            isOutOfStock
                                                ? "cursor-not-allowed opacity-40"
                                                : "hover:bg-accent/5"
                                        } ${isSelected ? "bg-accent/10" : ""}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {isSelected && (
                                                <FaCircleCheck
                                                    size={14}
                                                    className="text-accent"
                                                />
                                            )}
                                            <span
                                                className={`text-[14px] ${
                                                    isSelected
                                                        ? "font-semibold text-accent"
                                                        : "text-text/90"
                                                }`}
                                            >
                                                {item.name}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 text-[13px]">
                                            <span
                                                className={
                                                    isOutOfStock
                                                        ? "text-red-400"
                                                        : item.count <= 5
                                                        ? "text-orange-400"
                                                        : "text-muted"
                                                }
                                            >
                                                {isOutOfStock
                                                    ? "Out of stock"
                                                    : `${item.count} left`}
                                            </span>

                                            {view.offer && item.priceOffer ? (
                                                <span>
                                                    <span className="mr-1.5 text-muted line-through">
                                                        {item.price} L.E
                                                    </span>
                                                    <span className="font-semibold text-red-400">
                                                        {item.priceOffer} L.E
                                                    </span>
                                                </span>
                                            ) : (
                                                <span className="font-semibold text-text">
                                                    {item.price} L.E
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ================= ACTIONS ================= */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={!view.availability || outOfStock}
                            onClick={handleAddToCart}
                            className="
                px-6 py-3 rounded-2xl
                bg-accent/15
                border border-accent/30
                text-accent font-semibold
                hover:bg-accent/20
                hover:shadow-[0_0_25px_var(--color-accent-glow,rgba(0,0,0,0.08))]
                transition-all
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
                        >
                            {outOfStock
                                ? "Out of stock"
                                : `Add To Cart — ${effectivePrice ?? ""} L.E`}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => dispatch(clearView())}
                            className="
                px-6 py-3 rounded-2xl
                bg-card
                border border-border
                text-text/80
                hover:border-accent/40
                hover:text-accent
                transition-all
              "
                        >
                            Back
                        </motion.button>
                    </div>

                    {/* ================= ADD REVIEW ================= */}
                    <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                        <h3 className="font-bold text-accent">Add Review</h3>

                        <input
                            className="w-full rounded-xl bg-bg border border-border p-3 text-sm text-text placeholder:text-muted focus:border-accent/50 focus:outline-none"
                            placeholder="Your name"
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                        />

                        <textarea
                            className="w-full rounded-xl bg-bg border border-border p-3 text-sm text-text placeholder:text-muted focus:border-accent/50 focus:outline-none"
                            rows={4}
                            placeholder="Write your review..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        />

                        <select
                            className="w-full rounded-xl bg-bg border border-border p-3 text-sm text-text focus:border-accent/50 focus:outline-none"
                            value={reviewStars}
                            onChange={(e) => setReviewStars(Number(e.target.value))}
                        >
                            <option value={5}>★★★★★</option>
                            <option value={4}>★★★★</option>
                            <option value={3}>★★★</option>
                            <option value={2}>★★</option>
                            <option value={1}>★</option>
                        </select>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={submitReview}
                            className="
                px-6 py-3 rounded-2xl
                bg-accent/15
                border border-accent/30
                text-accent font-semibold
                hover:bg-accent/20
                hover:shadow-[0_0_25px_var(--color-accent-glow,rgba(0,0,0,0.08))]
                transition-all
              "
                        >
                            Submit Review
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            {/* ================= REVIEWS LIST ================= */}
            {view.comment?.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 mt-20">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-accent">
                            Reviews
                        </h2>

                        <span className="text-muted text-sm">
                            {view.comment.length} review
                            {view.comment.length > 1 ? "s" : ""}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {view.comment.map((c, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -6 }}
                                transition={{ duration: 0.2 }}
                                className="
                overflow-hidden rounded-3xl
                bg-card
                border border-accent/10
                hover:border-accent/30
                transition-all
                p-5 space-y-3
              "
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-accent">
                                        {c.name}
                                    </h3>

                                    {c.stars != null && (
                                        <span className="flex items-center gap-1 text-sm text-accent">
                                            <FaStar size={12} />
                                            {c.stars}
                                        </span>
                                    )}
                                </div>

                                {c.comment != null && (
                                    <p className="text-muted text-sm leading-relaxed">
                                        {c.comment}
                                    </p>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}