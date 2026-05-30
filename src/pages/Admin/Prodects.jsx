import React, { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../../rudex/store/productSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/loading";
import { replace, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Products() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [Search, setSearch] = useState("");

    const { products, loadingGetAllProducts, loadingDelete } = useSelector(
        (state) => state.product
    );

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    const filteredproducts = products
        .filter((item) =>
            item.productName
                .toLowerCase()
                .includes(Search.trim().toLowerCase())
        )
        .sort((a, b) => {
            if (
                a.productStock === "inStock" &&
                b.productStock === "outOfStock"
            )
                return -1;
            if (
                a.productStock === "outOfStock" &&
                b.productStock === "inStock"
            )
                return 1;

            return a.productPrice - b.productPrice;
        });

    if (loadingGetAllProducts) return <Loading />;

    return (
        <div className="w-full min-h-screen p-6 bg-black text-white">
            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center max-md:flex-col gap-4 mb-8"
            >
                <button
                    onClick={() => navigate("add")}
                    className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded-xl transition shadow-lg"
                >
                    + Add Product
                </button>

                {/* SEARCH */}
                <div className="w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-xl outline-none focus:border-green-500 transition"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </motion.div>

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredproducts.length > 0 ? (
                    filteredproducts.map((product) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.03 }}
                            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg hover:border-green-600 transition"
                        >
                            {/* TITLE */}
                            <h2 className="text-lg font-bold mb-2 text-white truncate">
                                {product.productName}
                            </h2>

                            {/* PRICE */}
                            <p className="text-green-400 text-xl font-semibold mb-4">
                                ${product.productPrice}
                            </p>

                            {/* STOCK */}
                            <div className="mb-4">
                                {product.productStock === "inStock" ? (
                                    <span className="text-green-400 text-sm font-medium">
                                        ● In Stock
                                    </span>
                                ) : (
                                    <span className="text-red-400 text-sm font-medium">
                                        ● Out of Stock
                                    </span>
                                )}
                            </div>

                            {/* BUTTONS */}
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() =>
                                        navigate(
                                            `/admin/products/view/${product._id}`,
                                            replace
                                        )
                                    }
                                    className="bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded-lg text-sm transition"
                                >
                                    View
                                </button>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/admin/products/edit/${product._id}`,
                                            replace
                                        )
                                    }
                                    className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-lg text-sm transition"
                                >
                                    Edit
                                </button>

                                <button
                                    disabled={loadingDelete}
                                    onClick={() =>
                                        dispatch(deleteProduct(product._id))
                                    }
                                    className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded-lg text-sm transition disabled:opacity-50"
                                >
                                    {loadingDelete ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <p className="text-gray-400">No products found</p>
                )}
            </div>
        </div>
    );
}