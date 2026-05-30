import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { viewProduct, deleteProduct } from "../../rudex/store/productSlice";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../../components/loading";
import { motion } from "framer-motion";

export default function ViewProdect() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const {
        viewProduct: product,
        loadingView,
        loadingDelete
    } = useSelector((state) => state.product);

    useEffect(() => {
        dispatch(viewProduct({ id }));
    }, [dispatch, id]);

    const capitalize = (text) => {
        if (!text) return "";
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    const getCategoryStyle = (category) => {
        const base =
            "border px-3 py-1 rounded-md font-semibold tracking-wide transition-all duration-200";

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

    const handleDelete = async () => {
        try {
            await dispatch(deleteProduct(id)).unwrap();
            navigate("/admin/products");
        } catch (err) {
            console.log(err);
        }
    };

    if (loadingView) return <Loading />;
    if (!product) return <div className="text-white p-6">No product found</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-black text-white p-4 sm:p-6"
        >
            {/* CONTAINER */}
            <div className="max-w-5xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-8 space-y-6">

                {/* HEADER */}
                <div className="flex justify-between items-center flex-wrap gap-3 border-b border-zinc-800 pb-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-green-400">
                        🎮 Product Details
                    </h1>

                    <button
                        onClick={() => navigate("/admin/products")}
                        className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition"
                    >
                        Back
                    </button>
                </div>

                {/* IMAGES */}
                {product.productImage?.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {product.productImage.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt="product"
                                className="w-full h-32 sm:h-44 object-cover rounded-xl border border-zinc-800 hover:scale-[1.02] transition"
                            />
                        ))}
                    </div>
                )}

                {/* INFO */}
                <div className="space-y-4">

                    <h2 className="text-2xl font-bold text-green-400">
                        {capitalize(product.productName)}
                    </h2>

                    <p className="text-gray-300 leading-relaxed">
                        {product.productDescription}
                    </p>

                    {/* GRID INFO */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div className="bg-black/40 p-4 rounded-xl border border-zinc-800">
                            <p className="text-gray-400 text-sm">Price</p>
                            <p className="text-xl font-bold text-white">
                                ${product.productPrice}
                            </p>
                        </div>

                        <div className="bg-black/40 p-4 rounded-xl border border-zinc-800">
                            <p className="text-gray-400 text-sm">Stock</p>
                            <p className={`font-bold ${
                                product.productStock === "inStock"
                                    ? "text-green-400"
                                    : "text-red-400"
                            }`}>
                                {product.productStock === "inStock"
                                    ? "In Stock"
                                    : "Out of Stock"}
                            </p>
                        </div>

                        <div className="bg-black/40 p-4 rounded-xl border border-zinc-800">
                            <p className="text-gray-400 text-sm">Category</p>
                            <p className={getCategoryStyle(product.productCategory)}>
                                {capitalize(product.productCategory)}
                            </p>
                        </div>

                        <div className="bg-black/40 p-4 rounded-xl border border-zinc-800">
                            <p className="text-gray-400 text-sm">Account Type</p>
                            <p className="font-bold text-white">
                                {capitalize(product.accountType)}
                            </p>
                        </div>

                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-zinc-800">

                    <button
                        onClick={handleDelete}
                        disabled={loadingDelete}
                        className="bg-red-600 hover:bg-red-500 px-5 py-2 rounded-lg transition disabled:opacity-50"
                    >
                        {loadingDelete ? "Deleting..." : "Delete"}
                    </button>

                    <button
                        onClick={() =>
                            navigate(`/admin/products/edit/${product._id}`)
                        }
                        className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded-lg transition"
                    >
                        Edit
                    </button>

                </div>
            </div>
        </motion.div>
    );
}