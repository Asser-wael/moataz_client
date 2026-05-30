import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDeals } from "../../rudex/store/profileSlice";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loading";

import {
    FaSearch,
    FaHome,
    FaFire,
    FaArrowRight,
} from "react-icons/fa";
import Footer from "../../components/Footer";

export default function Deals() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    const { allDeals, loadingDeal } = useSelector(
        (state) => state.profile
    );

    useEffect(() => {
        dispatch(getAllDeals());
        window.scrollTo(0, 0);
    }, [dispatch]);

    /* ================= FILTER ================= */

    const filteredDeals = useMemo(() => {
        return allDeals?.filter((item) =>
            item.productName
                ?.toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [allDeals, search]);

    /* ================= HELPERS ================= */

    const capitalize = (text) => {
        if (!text) return "";
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    const getCategoryStyle = (category) => {

        const base =
            "border px-3 py-1 rounded-full font-semibold tracking-wide text-xs";

        switch (category?.toLowerCase()) {

            case "ps4":
                return `${base} text-blue-400 border-blue-400 bg-blue-400/10`;

            case "ps5":
                return `${base} text-sky-400 border-sky-400 bg-sky-400/10`;

            case "xbox":
                return `${base} text-green-400 border-green-400 bg-green-400/10`;

            case "steam":
                return `${base} text-cyan-300 border-cyan-300 bg-cyan-300/10`;

            case "pc":
                return `${base} text-gray-300 border-gray-500 bg-gray-500/10`;

            default:
                return `${base} text-yellow-400 border-yellow-400 bg-yellow-400/10`;
        }
    };

    if (loadingDeal) {
        return <Loading />;
    }

    return (
        <div className="w-full min-h-screen bg-black text-white overflow-hidden">

            {/* BACKGROUND GLOW */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-green-500/10 blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-red-500/10 blur-[120px]" />
            </div>

            <div className="relative z-10 px-4 py-10">

                {/* ================= HEADER ================= */}

                <motion.div
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-7xl mx-auto mb-10"
                >

                    <div className="flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between">

                        {/* LEFT */}
                        <div>

                            <div className="flex items-center gap-3">

                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 10, -10, 0],
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 2,
                                    }}
                                >
                                    <FaFire className="text-red-500 text-3xl" />
                                </motion.div>

                                <h1
                                    className="
                                        text-4xl md:text-6xl
                                        font-black
                                        text-green-400
                                        tracking-wider
                                    "
                                >
                                    HOT DEALS
                                </h1>

                            </div>

                            <p className="text-gray-400 mt-4 text-sm md:text-base">
                                Best offers available right now ⚡
                            </p>
                        </div>

                        {/* RIGHT */}
                        <div className="flex flex-col sm:flex-row gap-4">

                            {/* SEARCH */}
                            <motion.div
                                whileFocus={{ scale: 1.02 }}
                                className="
                                    flex items-center gap-3
                                    bg-zinc-900/80
                                    border border-green-500/20
                                    rounded-2xl
                                    px-4 py-3
                                    backdrop-blur-xl
                                "
                            >
                                <FaSearch className="text-green-400" />

                                <input
                                    type="text"
                                    placeholder="Search deals..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    className="
                                        bg-transparent
                                        outline-none
                                        text-white
                                        placeholder:text-gray-500
                                        w-full sm:w-[220px]
                                    "
                                />
                            </motion.div>

                            {/* HOME BUTTON */}
                            <motion.button
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow:
                                        "0 0 25px rgba(34,197,94,0.25)",
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/home")}
                                className="
                                    flex items-center justify-center gap-3
                                    px-6 py-3
                                    rounded-2xl
                                    bg-green-500/10
                                    border border-green-500/20
                                    text-green-300
                                    font-semibold
                                    hover:border-green-400
                                    transition-all
                                "
                            >
                                <FaHome />
                                Home
                            </motion.button>

                        </div>
                    </div>
                </motion.div>

                {/* ================= DEALS ================= */}

                <div
                    className="
                        max-w-7xl mx-auto
                        grid grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-3
                        gap-6
                    "
                >

                    {filteredDeals?.length > 0 ? (

                        filteredDeals.map((item, index) => (

                            <motion.div
                                key={item._id}

                                initial={{
                                    opacity: 0,
                                    y: 40,
                                }}

                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}

                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.05,
                                }}

                                whileHover={{
                                    y: -10,
                                    scale: 1.02,
                                }}

                                onClick={() =>
                                    navigate(`/home/product/${item._id}`)
                                }

                                className="
                                    group
                                    cursor-pointer
                                    overflow-hidden
                                    rounded-3xl
                                    bg-zinc-900/70
                                    border border-green-500/10
                                    hover:border-green-500/40
                                    backdrop-blur-xl
                                    transition-all
                                    relative
                                "
                            >

                                {/* GLOW */}
                                <div
                                    className="
                                        absolute inset-0 opacity-0
                                        group-hover:opacity-100
                                        transition duration-500
                                        bg-gradient-to-br
                                        from-green-500/10
                                        via-transparent
                                        to-red-500/10
                                    "
                                />

                                {/* IMAGE */}
                                <div className="relative overflow-hidden">

                                    <motion.img
                                        whileHover={{ scale: 1.08 }}
                                        transition={{ duration: 0.5 }}
                                        src={item.productImage?.[0]}
                                        alt={item.productName}
                                        className="
                                            w-full
                                            aspect-video
                                            object-cover
                                        "
                                    />

                                    {/* OVERLAY */}
                                    <div
                                        className="
                                            absolute inset-0
                                            bg-gradient-to-t
                                            from-black
                                            via-black/10
                                            to-transparent
                                        "
                                    />

                                    {/* CATEGORY */}
                                    <div
                                        className={`
                                            absolute top-3 right-3 z-20
                                            ${getCategoryStyle(item.productCategory)}
                                            backdrop-blur-xl
                                        `}
                                    >
                                        {capitalize(item.productCategory)}
                                    </div>

                                    {/* DEAL */}
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.1, 1],
                                        }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1.5,
                                        }}
                                        className="
                                            absolute top-3 left-3 z-20
                                            bg-red-500/20
                                            border border-red-400/30
                                            text-red-300
                                            px-3 py-1
                                            rounded-full
                                            text-xs font-bold
                                            tracking-widest
                                            backdrop-blur-xl
                                        "
                                    >
                                        🔥 DEAL
                                    </motion.div>

                                </div>

                                {/* CONTENT */}
                                <div className="relative z-10 p-5 space-y-4">

                                    <h3
                                        className="
                                            text-xl
                                            font-black
                                            text-green-300
                                            line-clamp-1
                                        "
                                    >
                                        {item.productName}
                                    </h3>

                                    <p
                                        className="
                                            text-gray-400
                                            text-sm
                                            line-clamp-2
                                            leading-relaxed
                                        "
                                    >
                                        {item.productDescription}
                                    </p>

                                    {/* PRICE */}
                                    <div className="flex items-center justify-between pt-2">

                                        <div>

                                            <p className="text-gray-500 text-xs">
                                                Price
                                            </p>

                                            <p
                                                className="
                                                    text-white
                                                    text-2xl
                                                    font-black
                                                "
                                            >
                                                L.E {item.productPrice}
                                            </p>

                                        </div>

                                        <motion.div
                                            whileHover={{ x: 5 }}
                                            className="
                                                w-11 h-11
                                                rounded-full
                                                bg-green-500/10
                                                border border-green-500/20
                                                flex items-center justify-center
                                                text-green-400
                                            "
                                        >
                                            <FaArrowRight />
                                        </motion.div>

                                    </div>

                                </div>

                            </motion.div>
                        ))

                    ) : (

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="
                                col-span-full
                                flex flex-col items-center justify-center
                                py-28
                            "
                        >

                            <div className="text-7xl mb-5">
                                😢
                            </div>

                            <h2 className="text-3xl font-black text-gray-300">
                                No Deals Found
                            </h2>

                            <p className="text-gray-500 mt-3">
                                Try searching with another name
                            </p>

                        </motion.div>
                    )}

                </div>
            </div>
                        <Footer/>
            
        </div>
    );
}