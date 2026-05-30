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
        "border px-3 py-1 rounded-md font-semibold tracking-wide transition-all duration-200 hover:text-white";

    switch (category?.toLowerCase()) {
        case "ps4":
            return `${base} text-blue-400 border-blue-400 bg-blue-400/10 hover:bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]`;

        case "ps5":
            return `${base} text-sky-400 border-sky-400 bg-sky-400/10 hover:bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.3)]`;

        case "xbox":
            return `${base} text-green-400 border-green-400 bg-green-400/10 hover:bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]`;

        case "steam":
            return `${base} text-cyan-300 border-cyan-300 bg-cyan-300/10 hover:bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.35)]`;

        case "pc":
            return `${base} text-gray-300 border-gray-500 bg-gray-500/10 hover:bg-gray-500 shadow-[0_0_10px_rgba(107,114,128,0.2)]`;

        default:
            return `${base} text-yellow-400 border-yellow-400 bg-yellow-400/10 hover:bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.2)]`;
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
    if (!product) return <div className="text-white">No product found</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex min-h-screen bg-zinc-950 text-white p-4 sm:p-6"
        >
            <div className="flex-1 flex flex-col">

                {/* Header */}
                <header className="bg-zinc-900 border border-zinc-800 px-4 sm:px-6 py-4 flex justify-between items-center rounded-xl">
                    <h1 className="text-lg sm:text-2xl font-bold text-green-400 tracking-wide">
                        🎮 View Game Product
                    </h1>

                    <button
                        onClick={() => navigate("/admin/products")}
                        className="bg-zinc-800 hover:bg-green-500/10 hover:border-green-500 border border-zinc-700 px-4 py-2 rounded-lg transition"
                    >
                        Back
                    </button>
                </header>

                {/* Content */}
                <main className="mt-6 flex justify-center">
                    <div className="w-full max-w-4xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-8 rounded-2xl space-y-6">

                        {/* Images */}
                        {product.productImage?.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {product.productImage.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt="product"
                                        className="w-full h-40 object-cover rounded-lg border border-zinc-800"
                                    />
                                ))}
                            </div>
                        )}

                        {/* Info */}
                        <div className="space-y-4">

                            <h2 className="text-2xl font-bold text-green-400 tracking-wide">
                                {capitalize(product.productName)}
                            </h2>

                            <p className="text-gray-300">
                                {product.productDescription}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                                    <p className="text-gray-400 text-sm">Price</p>
                                    <p className="text-lg font-semibold">
                                        ${product.productPrice}
                                    </p>
                                </div>

                                <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                                    <p className="text-gray-400 text-sm">Availability</p>
                                    <p className={`text-lg font-semibold tracking-wide ${
                                        product.productStock === "inStock"
                                            ? "text-green-400"
                                            : "text-red-400"
                                    }`}>
                                        {product.productStock === "inStock"
                                            ? "In Stock"
                                            : "Out of Stock"}
                                    </p>
                                </div>

                                <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                                    <p className="text-gray-400 text-sm">Category</p>
                                    <p
                                        className={`text-sm font-semibold px-3 py-1 rounded-md border w-fit tracking-wide ${getCategoryStyle(product.productCategory)}`}
                                    >
                                        {capitalize(product.productCategory)}
                                    </p>
                                </div>

                                <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                                    <p className="text-gray-400 text-sm">Account Type</p>
                                    <p className="text-lg font-semibold">
                                        {capitalize(product.accountType)}
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4">

                            <button
                                onClick={handleDelete}
                                disabled={loadingDelete}
                                className="bg-red-600 hover:bg-red-500 px-5 py-2 rounded-lg transition disabled:opacity-50"
                            >
                                {loadingDelete ? "Deleting..." : "Delete"}
                            </button>

                            <button
                                onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                                className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded-lg transition"
                            >
                                Edit
                            </button>

                        </div>

                    </div>
                </main>
            </div>
        </motion.div>
    );
}