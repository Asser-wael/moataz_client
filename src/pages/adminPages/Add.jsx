import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
    FiPlus,
    FiX,
    FiUploadCloud,
    FiZap,
    FiLayers,
} from "react-icons/fi";
import { GiSwordman, GiTrophyCup, GiGamepad } from "react-icons/gi";

import { addProduct } from "../../features/productsSlice";
import { getAllCategories } from "../../features/customuseSlice";
import Loading from "../../components/loading";

// ---------- building blocks ----------

function HudLabel({ icon, children }) {
    return (
        <div className="mb-2 flex items-center gap-2">
            <span className="text-[var(--color-accent)]">{icon}</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                {children}
            </span>
        </div>
    );
}

function SwitchStat({ value, onChange, onLabel, offLabel, icon }) {
    const isOn = value === "true";
    return (
        <button
            type="button"
            onClick={() => onChange(isOn ? "false" : "true")}
            className={`flex h-14 w-full flex-col items-start justify-center gap-0.5 rounded-lg border-2 px-4 transition-all ${isOn
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 shadow-[0_0_14px_-4px_var(--color-accent)]"
                    : "border-[var(--color-border)] bg-[var(--color-bg)]"
                }`}
        >
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--color-muted)]">
                {icon} {isOn ? "Active" : "Inactive"}
            </span>
            <span className={`text-sm font-bold ${isOn ? "text-[var(--color-accent)]" : "text-[var(--color-text)]"}`}>
                {isOn ? onLabel : offLabel}
            </span>
        </button>
    );
}

export default function Add() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, reset, watch, setValue } = useForm({
        defaultValues: { offer: "false", availability: "true" },
    });
    const { loadingAdd } = useSelector((state) => state.productsSlice);
    const { categories } = useSelector((state) => state.customuseSlice);

    const [platforms, setPlatforms] = useState([""]);
    const [image, setImage] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [editions, setEditions] = useState([{ name: "", price: "", priceOffer: "", count: "" }]);
    const [submitting, setSubmitting] = useState(false);

    const name = watch("name");
    const offer = watch("offer");
    const availability = watch("availability");

    useEffect(() => {
        dispatch(getAllCategories());
    }, [dispatch]);

    const updateEdition = (index, key, value) => {
        setEditions((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
    };

    const addEdition = () =>
        setEditions((prev) => [...prev, { name: "", price: "", priceOffer: "", count: "" }]);

    const removeEdition = (index) =>
        setEditions((prev) => prev.filter((_, i) => i !== index));

    const updatePlatform = (index, value) =>
        setPlatforms((prev) => prev.map((p, i) => (i === index ? value : p)));

    const addPlatform = () => setPlatforms((prev) => [...prev, ""]);

    const removePlatform = (index) => setPlatforms((prev) => prev.filter((_, i) => i !== index));

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) setImage(file);
    };

    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("offer", data.offer);
            formData.append("availability", data.availability);
            formData.append("Category", data.Category);
            formData.append("image", image);
            formData.append("GameplayType", data.GameplayType);
            formData.append("account", JSON.stringify(editions));

            console.log(formData);


            const res = await dispatch(addProduct(formData));

            if (res.payload) {
                reset();
                setImage(null);
                setPlatforms([""]);
                setEditions([{ name: "", price: "", priceOffer: "", count: "" }]);
                navigate("/admin/Products");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingAdd) return <Loading />;

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8 text-[var(--color-text)] sm:px-6">
            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex items-center gap-4 border-b-2 border-[var(--color-accent)]/30 pb-6"
            >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-[var(--color-accent)] text-[var(--color-accent)] shadow-[0_0_16px_-4px_var(--color-accent)]">
                    <GiGamepad size={24} />
                </div>
                <div>
                    <h1 className="font-serif text-[24px] italic sm:text-[30px]">Add New Game</h1>
                    <p className="text-[12px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
                        Add a title to the catalog
                    </p>
                </div>
            </motion.div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
                {/* LEFT COLUMN */}
                <div className="space-y-6">
                    {/* Cover + core info combined */}
                    <motion.section
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 gap-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 sm:grid-cols-[180px_1fr]"
                    >
                        {/* Cover art */}
                        <div>
                            <HudLabel icon={<FiUploadCloud size={14} />}>Cover art</HudLabel>
                            <label
                                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                                onDragLeave={() => setDragActive(false)}
                                onDrop={handleDrop}
                                className={`relative flex h-52 w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed transition-colors ${dragActive
                                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                                        : "border-[var(--color-border)] hover:border-[var(--color-accent)]/50"
                                    }`}
                            >
                                {image ? (
                                    <>
                                        <img src={URL.createObjectURL(image)} alt="cover" className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); setImage(null); }}
                                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/90"
                                        >
                                            <FiX size={14} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <GiSwordman className="text-3xl text-[var(--color-muted)]" />
                                        <span className="px-2 text-center text-xs text-[var(--color-muted)]">
                                            Drop cover art
                                        </span>
                                    </>
                                )}
                                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="hidden" />
                            </label>
                        </div>

                        {/* Core fields */}
                        <div className="space-y-4">
                            <div>
                                <HudLabel icon={<GiTrophyCup size={14} />}>Game title</HudLabel>
                                <input
                                    {...register("name", { required: true })}
                                    placeholder="e.g. Shadow Realm Chronicles"
                                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-sm outline-none focus:border-[var(--color-accent)]"
                                />
                            </div>

                            <div>
                                <HudLabel icon={<FiLayers size={14} />}>Genre</HudLabel>
                                <select
                                    {...register("Category", { required: true })}
                                    defaultValue=""
                                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-sm outline-none focus:border-[var(--color-accent)]"
                                >
                                    <option value="" disabled>Choose a genre</option>
                                    {categories?.map((c) => (
                                        <option key={c._id} value={c.name} className="text-black">
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <HudLabel icon={<FiLayers size={14} />}>Genre</HudLabel>
                                <select
                                    {...register("GameplayType", { required: true })}
                                    defaultValue=""
                                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-sm outline-none focus:border-[var(--color-accent)]"
                                >
                                    <option value="" disabled>Choose a Gameplay Type</option>
                                    <option value="Action">Action</option>
                                    <option value="Adventure">Adventure</option>
                                    <option value="RPG">RPG (Role-Playing Game)</option>
                                    <option value="Strategy">Strategy</option>
                                    <option value="Simulation">Simulation</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Racing">Racing</option>
                                    <option value="Puzzle">Puzzle</option>
                                    <option value="Shooter">Shooter (FPS/TPS)</option>
                                    <option value="Survival">Survival</option>
                                    <option value="Platformer">Platformer</option>
                                    <option value="Horror">Horror</option>

                                </select>
                            </div>

                            <div>
                                <HudLabel icon={<FiZap size={14} />}>Synopsis</HudLabel>
                                <textarea
                                    {...register("description", { required: true })}
                                    placeholder="What's the story? Give players a reason to play."
                                    rows={3}
                                    className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-sm outline-none focus:border-[var(--color-accent)]"
                                />
                            </div>
                        </div>
                    </motion.section>

                    {/* Status */}
                    <motion.section
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5"
                    >
                        <HudLabel icon={<FiZap size={14} />}>Launch status</HudLabel>
                        <div className="mt-2 grid grid-cols-2 gap-3">
                            <SwitchStat
                                value={offer}
                                onChange={(v) => setValue("offer", v)}
                                onLabel="Deal live"
                                offLabel="Full price"
                                icon={<FiZap size={11} />}
                            />
                            <SwitchStat
                                value={availability}
                                onChange={(v) => setValue("availability", v)}
                                onLabel="Ready to ship"
                                offLabel="Sold out"
                                icon={<FiLayers size={11} />}
                            />
                        </div>
                    </motion.section>

                    {/* Editions */}
                    <motion.section
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5"
                    >
                        <div className="flex items-center justify-between">
                            <HudLabel icon={<GiTrophyCup size={14} />}>Editions</HudLabel>
                            <button
                                type="button"
                                onClick={addEdition}
                                className="flex items-center gap-1.5 rounded-full border border-[var(--color-accent)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.05em] text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10"
                            >
                                <FiPlus size={12} /> New edition
                            </button>
                        </div>

                        <div className="mt-3 space-y-2">
                            <AnimatePresence initial={false}>
                                {editions.map((row, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex flex-wrap items-center gap-2 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-2.5"
                                    >
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--color-accent)]/10 text-[11px] font-bold text-[var(--color-accent)]">
                                            {index + 1}
                                        </span>
                                        <input
                                            placeholder="Edition name (Standard, Deluxe...)"
                                            value={row.name}
                                            onChange={(e) => updateEdition(index, "name", e.target.value)}
                                            className="min-w-[130px] flex-1 rounded-md border border-[var(--color-border)] bg-transparent p-2 text-sm outline-none focus:border-[var(--color-accent)]"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Price"
                                            value={row.price}
                                            onChange={(e) => updateEdition(index, "price", e.target.value)}
                                            className="w-24 rounded-md border border-[var(--color-border)] bg-transparent p-2 text-sm outline-none focus:border-[var(--color-accent)]"
                                        />
                                        {offer === "true" && (
                                            <input
                                                type="number"
                                                placeholder="Deal price"
                                                value={row.priceOffer}
                                                onChange={(e) => updateEdition(index, "priceOffer", e.target.value)}
                                                className="w-24 rounded-md border border-[var(--color-border)] bg-transparent p-2 text-sm outline-none focus:border-[var(--color-accent)]"
                                            />
                                        )}
                                        <input
                                            type="number"
                                            placeholder="Copies"
                                            value={row.count}
                                            onChange={(e) => updateEdition(index, "count", e.target.value)}
                                            className="w-20 rounded-md border border-[var(--color-border)] bg-transparent p-2 text-sm outline-none focus:border-[var(--color-accent)]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeEdition(index)}
                                            disabled={editions.length === 1}
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-red-500 hover:bg-red-500/10 disabled:opacity-30"
                                        >
                                            <FiX size={14} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.section>
                </div>

                {/* RIGHT: sticky game card preview */}
                <div className="lg:sticky lg:top-6 lg:self-start">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="overflow-hidden rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-card)] shadow-[0_0_24px_-8px_rgba(0,0,0,0.3)]"
                    >
                        <div className="relative flex   w-full items-center justify-center bg-[var(--color-bg)]">
                            {image ? (
                                <img src={URL.createObjectURL(image)} alt="preview" className="h-full w-full object-cover" />
                            ) : (
                                <GiSwordman className="text-5xl text-[var(--color-muted)]" />
                            )}
                            {offer === "true" && (
                                <span className="absolute left-3 top-3 rounded-md bg-[var(--color-accent)] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[var(--color-bg)] shadow-lg">
                                    Deal
                                </span>
                            )}
                            <span
                                className={`absolute right-3 top-3 rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] shadow-lg ${availability === "true"
                                        ? "bg-green-500 text-white"
                                        : "bg-red-500 text-white"
                                    }`}
                            >
                                {availability === "true" ? "In stock" : "Sold out"}
                            </span>
                        </div>

                        <div className="p-5">
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-accent)]">
                                Store preview
                            </p>
                            <h3 className="mt-1 font-serif text-xl italic">
                                {name || "Untitled title"}
                            </h3>

                            <div className="mt-4 flex flex-wrap gap-1.5">
                                {platforms.filter(Boolean).map((p, i) => (
                                    <span key={i} className="rounded-md bg-[var(--color-bg)] px-2 py-1 text-[10px] font-bold uppercase text-[var(--color-muted)]">
                                        {p}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[var(--color-border)] pt-4 text-center">
                                <div className="rounded-lg bg-[var(--color-bg)] py-2">
                                    <p className="text-lg font-bold text-[var(--color-accent)]">
                                        {editions.filter((r) => r.name).length}
                                    </p>
                                    <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--color-muted)]">Editions</p>
                                </div>
                                <div className="rounded-lg bg-[var(--color-bg)] py-2">
                                    <p className="text-lg font-bold text-[var(--color-accent)]">
                                        {platforms.filter(Boolean).length}
                                    </p>
                                    <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--color-muted)]">Platforms</p>
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={submitting}
                                whileHover={{ scale: submitting ? 1 : 1.01 }}
                                whileTap={{ scale: submitting ? 1 : 0.98 }}
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] py-3.5 text-sm font-black uppercase tracking-[0.05em] text-[var(--color-bg)] shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? (
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                                        className="h-4 w-4 rounded-full border-2 border-current/40 border-t-current"
                                    />
                                ) : (
                                    <GiGamepad size={16} />
                                )}
                                {submitting ? "Publishing..." : "Add game to store"}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </form>

            <style>{`
                .font-serif { font-family: "Fraunces", serif; }
            `}</style>
        </div>
    );
}