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
        <div className="min-h-screen bg-[var(--color-bg)]">
            <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
                <button
                    onClick={() => dispatch(clearView())}
                    className="mb-8 flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
                >
                    <FaArrowLeft size={13} />
                    Back
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 gap-10 lg:grid-cols-2"
                >
                    {/* Image */}
                    <div className="overflow-hidden bg-[var(--color-card)]">
                        {view?.image ? (
                            <img
                                src={`${import.meta.env.VITE_API_URL}/uploads/${view.image}`}
                                alt={view.name}
                                className="w-full object-cover"
                            />
                        ) : (
                            <div className="flex  flex-col items-center justify-center">
                                <FaBoxOpen size={64} className="text-[var(--color-muted)]" />
                                <p className="mt-4 text-[13px] text-[var(--color-muted)]">The product is no available</p>
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div>
                        <div className="mb-4 flex flex-wrap items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.1em]">
                            <span className="text-[var(--color-accent)]">{view.Category}</span>
                            <span className="text-[var(--color-muted)]">·</span>
                            <span className={view.availability ? "text-green-600" : "text-red-500"}>
                                {view.availability ? "Available" : "Not available"}
                            </span>
                            {avgRating && (
                                <>
                                    <span className="text-[var(--color-muted)]">·</span>
                                    <span className="flex items-center gap-1 text-[var(--color-text)]">
                                        <FaStar size={11} className="text-[var(--color-accent)]" />
                                        {avgRating} ({view.comment.length})
                                    </span>
                                </>
                            )}
                            {view.offer && (
                                <>
                                    <span className="text-[var(--color-muted)]">·</span>
                                    <span className="rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-bold text-white">
                                        OFFER
                                    </span>
                                </>
                            )}
                        </div>

                        <h1 className="font-serif text-[36px] italic leading-tight text-[var(--color-text)] sm:text-[44px]">
                            {view.name}
                        </h1>
                        <p className="mt-1 text-[12px] text-[var(--color-muted)]">
                            {new Date(view.createdAt).toLocaleDateString()}
                        </p>

                        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[var(--color-muted)]">
                            {view.description}
                        </p>

                        {/* Specifications */}
                        <div className="mt-8">
                            <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                                Specifications
                            </h3>

                            <div className="border border-[var(--color-border)]">
                                {view?.account?.map((item, index) => {
                                    const isSelected = account?.name === item.name;
                                    const isOutOfStock = item.count === 0;

                                    return (
                                        <button
                                            key={index}
                                            disabled={isOutOfStock}
                                            onClick={() => setAccount(item)}
                                            className={`flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors ${
                                                index !== 0 ? "border-t border-[var(--color-border)]" : ""
                                            } ${
                                                isOutOfStock
                                                    ? "cursor-not-allowed opacity-40"
                                                    : "hover:bg-[var(--color-card)]"
                                            } ${isSelected ? "bg-[var(--color-card)]" : ""}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {isSelected && (
                                                    <FaCircleCheck size={14} className="text-[var(--color-accent)]" />
                                                )}
                                                <span
                                                    className={`text-[14px] ${
                                                        isSelected ? "font-semibold text-[var(--color-text)]" : "text-[var(--color-text)]"
                                                    }`}
                                                >
                                                    {item.name}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 text-[13px]">
                                                <span
                                                    className={
                                                        isOutOfStock
                                                            ? "text-red-500"
                                                            : item.count <= 5
                                                            ? "text-orange-500"
                                                            : "text-[var(--color-muted)]"
                                                    }
                                                >
                                                    {isOutOfStock ? "Out of stock" : `${item.count} left`}
                                                </span>

                                                {view.offer && item.priceOffer ? (
                                                    <span>
                                                        <span className="mr-1.5 text-gray-400 line-through">
                                                            {item.price} L.E
                                                        </span>
                                                        <span className="font-semibold text-red-500">
                                                            {item.priceOffer} L.E
                                                        </span>
                                                    </span>
                                                ) : (
                                                    <span className="font-semibold text-[var(--color-text)]">
                                                        {item.price} L.E
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Selected price summary */}
                        <div className="mt-8 flex items-baseline justify-between border-y border-[var(--color-border)] py-5">
                            <span className="text-[13px] text-[var(--color-muted)]">
                                {account?.name ?? "Select an option"}
                            </span>
                            <span className="font-serif text-[36px] italic text-[var(--color-accent)]">
                                {effectivePrice != null ? `${effectivePrice} L.E` : "—"}
                            </span>
                        </div>

                        <button
                            disabled={!view.availability || outOfStock}
                            className="mt-6 w-full border border-[var(--color-text)] bg-[var(--color-text)] py-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-bg)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                            onClick={handleAddToCart}
                        >
                            {outOfStock ? "Out of stock" : `Add to cart — ${effectivePrice ?? ""} L.E`}
                        </button>

                        <div className="mt-10 border border-[var(--color-border)] p-5 rounded">
                            <h3 className="mb-4 font-semibold">Add Review</h3>

                            <input
                                className="w-full border p-3 mb-3"
                                placeholder="Your name"
                                value={reviewName}
                                onChange={(e) => setReviewName(e.target.value)}
                            />

                            <textarea
                                className="w-full border p-3 mb-3"
                                rows={4}
                                placeholder="Write your review..."
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                            />

                            <select
                                className="w-full border p-3 mb-4"
                                value={reviewStars}
                                onChange={(e) => setReviewStars(Number(e.target.value))}
                            >
                                <option value={5}>★★★★★</option>
                                <option value={4}>★★★★</option>
                                <option value={3}>★★★</option>
                                <option value={2}>★★</option>
                                <option value={1}>★</option>
                            </select>

                            <button onClick={submitReview} className="bg-black text-white px-6 py-3 rounded">
                                Submit Review
                            </button>
                        </div>
                    </div>
                </motion.div>

                {view.comment?.length > 0 && (
                    <div className="mt-12">
                        <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                            Reviews ({view.comment.length})
                        </h3>
                        <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
                            {view.comment.map((c, index) => (
                                <div key={index} className="py-4">
                                    <div className="mb-1.5 flex items-center justify-between">
                                        <span className="text-[14px] font-semibold text-[var(--color-text)]">
                                            <span className="text-[var(--color-accent)]">{c.name}</span>
                                        </span>
                                        {c.stars != null && (
                                            <span className="flex items-center gap-1 text-[12px] text-[var(--color-accent)]">
                                                <FaStar size={10} />
                                                {c.stars}
                                            </span>
                                        )}
                                    </div>
                                    {c.comment != null && (
                                        <p className="text-[13px] text-[var(--color-muted)]">{c.comment}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .font-serif { font-family: "Fraunces", serif; }
      `}</style>
        </div>
    );
}