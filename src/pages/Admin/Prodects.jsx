import React, { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../../rudex/store/productSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/loading";
import { replace, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Products() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [Search, setSearch] = useState("")
    const { products, loadingGetAllProducts, loadingDelete } = useSelector(
        (state) => state.product
    );

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);
    // useEffect(() => {
    //     console.log(Search);

    // }, [Search]);
    const filteredproducts = products.filter(item =>
        item.productName.toLowerCase().includes(Search.trim().toLowerCase())
    ).sort((a, b) => {
        if (a.productStock === "inStock" && b.productStock === "outOfStock") return -1;
        if (a.productStock === "outOfStock" && b.productStock === "inStock") return 1;

        return a.productPrice - b.productPrice;
    });

    if (loadingGetAllProducts) return <Loading />;

    return (
        <div className="w-full p-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-between items-center max-md:flex-col-reverse gap-2">

                <button
                    onClick={() => navigate("add")}
                    className="bg-green-700 px-4 py-2 rounded cursor-pointer hover:opacity-80 duration-200 mb-6"
                >
                    Add Product
                </button>
                <div>
                    <input type="text" placeholder="Search"
className="p-1 border-b-2 duration-300 border-b-green-50 hover:border-green-500 focus:border-green-400 focus:outline-none focus:ring-0 "
                        onChange={(e) => {
                            setSearch(e.target.value)
                        }} />

                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {
                    filteredproducts.length > 0 ? (
                        filteredproducts.map((product, index) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, }}
                                animate={{ opacity: 1, }}
                                transition={{ duration: 0.3, delay: .5 }}
                                whileHover={{ scale: 1.05 }}
                                className="bg-zinc-900 w-full p-6 rounded-xl text-white shadow hover:shadow-xl transition hover:bg-green-950"
                            >

                                <div>
                                    <h2 className="text-xl font-semibold mb-2">
                                        {product.productName}
                                    </h2>

                                    <p className="text-gray-400 mb-4 text-lg">
                                        ${product.productPrice}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center flex-wrap gap-3">

                                    {product.productStock === "inStock" && (
                                        <span className="text-sm text-green-500">
                                            In Stock
                                        </span>
                                    )}

                                    {product.productStock === "outOfStock" && (
                                        <span className="text-sm text-red-500">
                                            Out of Stock
                                        </span>
                                    )}

                                    <div className="flex gap-2 flex-wrap">

                                        <button 
                                        onClick={() => navigate(`/admin/products/view/${product._id}`, replace)}
                                        
                                        className=" cursor-pointer bg-black px-3 py-1 text-sm rounded">
                                            View
                                        </button>

                                        <button
                                            onClick={() => navigate(`/admin/products/edit/${product._id}`, replace)}
                                            className=" cursor-pointer  bg-blue-500 px-3 py-1 text-sm rounded">
                                            Edit
                                        </button>

                                        <button
                                            disabled={loadingDelete}
                                            onClick={() => dispatch(deleteProduct(product._id))}
                                            className=" cursor-pointer bg-red-500 px-3 py-1 text-sm rounded disabled:opacity-50"
                                        >
                                            {loadingDelete ? "Deleting..." : "Delete"}
                                        </button>

                                    </div>
                                </div>

                            </motion.div>
                        ))
                    ) : (
                        <p>No products found</p>
                    )
                }
            </div>
        </div >
    );
}