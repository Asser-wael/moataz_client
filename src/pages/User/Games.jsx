import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../rudex/store/profileSlice";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loading";
import { FaSearch, FaHome } from "react-icons/fa";
import Footer from "../../components/Footer";

export default function Games() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        allProducts,
        loadingRandom,
        totalPages,
        currentPage,
    } = useSelector((state) => state.profile);

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [accountType, setAccountType] = useState("");

    /* ================= FETCH PRODUCTS (PAGINATION) ================= */
    useEffect(() => {
        dispatch(
            getAllProducts({
                page,
                limit: 12,
            })
        );
    }, [dispatch, page]);

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

    const filteredProducts = allProducts?.filter((item) => {
        const matchSearch = item.productName
            ?.toLowerCase()
            .includes(search.toLowerCase());

        const matchCategory = category
            ? item.productCategory === category
            : true;

        const matchAccount = accountType
            ? item.accountType === accountType
            : true;

        return matchSearch && matchCategory && matchAccount;
    });

    if (loadingRandom) {
        return <Loading />;
    }

    return (
        <div className="w-full min-h-screen bg-black text-white py-10 px-4">

            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto mb-10"
            >
                <div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-center">

                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-green-400">
                            GAMES 🎮
                        </h1>
                        <p className="text-gray-400 mt-3">
                            Explore all available products
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/home")}
                        className="
                            flex items-center gap-2
                            bg-green-500/10
                            border border-green-500/20
                            px-5 py-3 rounded-2xl
                            text-green-300 font-semibold
                        "
                    >
                        <FaHome />
                        Home
                    </motion.button>
                </div>
            </motion.div>

            {/* FILTERS */}
            <div className="max-w-7xl mx-auto mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* SEARCH */}
                <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search games..."
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-green-500"
                    />
                </div>

                {/* CATEGORY */}
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3"
                >
                    <option value="">All Categories</option>
                    <option value="ps4">ps4</option>
                    <option value="ps5">ps5</option>
                    <option value="pc">pc</option>
                    <option value="xbox">xbox</option>
                    <option value="steam">steam</option>
                </select>

                {/* ACCOUNT TYPE */}
                <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3"
                >
                    <option value="">All Types</option>
                    <option value="sign">sign</option>
                    <option value="home">home</option>
                    <option value="pre">pre</option>
                    <option value="sec">sec</option>
                    <option value="full">full</option>
                </select>
            </div>

            {/* PRODUCTS */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {filteredProducts?.length > 0 ? (
                    filteredProducts.map((item, index) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            whileHover={{ y: -6 }}
                            onClick={() => navigate(`/home/product/${item._id}`)}
                            className="
                                cursor-pointer rounded-3xl overflow-hidden
                                bg-zinc-900 border border-green-500/10
                                hover:border-green-500/30
                                transition-all
                            "
                        >

                            {/* IMAGE */}
                            <img
                                loading="lazy"
                                src={item.productImage?.[0]}
                                alt={item.productName}
                                className="w-full aspect-video object-cover hover:scale-105 transition"
                            />

                            {/* CONTENT */}
                            <div className="p-5 space-y-2">

                                <h3 className="text-lg font-bold text-green-300">
                                    {item.productName}
                                </h3>

                                <p className="text-gray-400 text-sm line-clamp-2">
                                    {item.productDescription}
                                </p>
                                <p
                                    className={
                                        item.productStock === "inStock"
                                            ? "text-green-400 text-sm line-clamp-2"
                                            : "text-red-400 text-sm line-clamp-2"
                                    }
                                >
                                    {item.productStock}

                                </p>

                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-white font-bold">
                                        L.E {item.productPrice}
                                    </span>

                                    <button className="px-3 py-1 text-sm bg-green-500/10 border border-green-500/20 rounded-xl text-green-300">
                                        View
                                    </button>
                                </div>
                            </div>

                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 text-gray-500">
                        No Products Found 😢
                    </div>
                )}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-4 mt-12">

                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl disabled:opacity-50"
                >
                    Prev
                </button>

                <span className="text-green-400 font-bold">
                    {currentPage} / {totalPages}
                </span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl disabled:opacity-50"
                >
                    Next
                </button>

            </div>

            <Footer />
        </div>
    );
}