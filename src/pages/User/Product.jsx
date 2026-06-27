import { sendOrder } from "../../rudex/store/orderSlice";
import { setBuyNow } from "../../rudex/store/cartSlice";
import { useEffect, useState, useMemo } from "react";

import { motion } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";


import {
    getProdect,
    getSimilarProducts,
    getRandomProducts,
} from "../../rudex/store/profileSlice";

import {
    addToCart,
    addGuestCart,
} from "../../rudex/store/cartSlice";

import { setNotification } from "../../rudex/store/notificationSlice";

import Loading from "../../components/loading";

import {
    useNavigate,
    useParams,
} from "react-router-dom";




const onSubmit = async (data) => {
    try {
        await dispatch(
            sendOrder({
                data,
                currentCart,
                totalprice: Number(totalprice),
            })
        ).unwrap();

        dispatch(
            setNotification({
                message: "تم إرسال الطلب بنجاح 📦",
                type: "success",
            })
        );

        navigate("/home", { replace: true });
    } catch (err) {
        console.log(err);
    }
};

// token

export default function Product() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [more, setMore] = useState(false)
    const { id } = useParams();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const {
        productDetails,
        similarProducts,
        loadingProduct,
        randomProducts,
    } = useSelector((state) => state.profile);



    /* ================= GET PRODUCT ================= */

    useEffect(() => {
        if (id) {
            dispatch(getProdect(id));
        }
    }, [dispatch, id]);

    /* ================= GET SIMILAR ================= */

    useEffect(() => {
        if (productDetails?.productCategory) {
            dispatch(
                getSimilarProducts({
                    category: productDetails.productCategory,
                })
            );
        }
    }, [productDetails?.productCategory]);
    /* ================= RANDOM PRODUCTS ================= */

    useEffect(() => {
        dispatch(getRandomProducts());
    }, [dispatch]);

    /* ================= LOADING ================= */

    const similarProductsUpdated = useMemo(() => {
        return similarProducts?.filter(
            (e) => e._id !== id
        );
    }, [similarProducts, id]);


    if (loadingProduct || !productDetails) {
        return <Loading />;
    }

    const product = productDetails;

    /* ================= HELPERS ================= */

    const capitalize = (text) => {
        if (!text) return "";
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    const getCategoryStyle = (category) => {
        const base =
            "border px-3 py-1 rounded-full font-semibold tracking-wide text-xs md:text-sm";

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

    /* ================= ADD TO CART ================= */
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

        } catch (error) {

            dispatch(
                setNotification({
                    message: "Failed to add product ❌",
                    type: "error",
                })
            );
        }
    };



    return (
        <div className="w-full min-h-screen bg-black text-white py-6 md:py-10">


            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">


                <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="
                    relative overflow-hidden rounded-3xl
                    border border-green-500/20
                    bg-zinc-900
                    shadow-[0_0_40px_rgba(34,197,94,0.12)]
                    "
                >


                    <div
                        className={`
              absolute top-4 right-4 z-20
              ${getCategoryStyle(product.productCategory)}
              backdrop-blur-xl
            `}
                    >
                        {capitalize(product.productCategory)}
                    </div>


                    <div
                        className="
              absolute top-4 left-4 z-20
              px-3 py-1 rounded-full
              bg-red-500/20 border border-red-400/30
              text-red-300 text-xs md:text-sm font-bold
              tracking-widest backdrop-blur-xl
            "
                    >
                        🔥 HOT DEAL
                    </div>


                    <img
                        src={product.productImage?.[0]}
                        alt={product.productName}
                        className="
              w-full aspect-video object-cover
              hover:scale-105 transition duration-700
            "
                    />


                    <div
                        className="
              absolute inset-0
              bg-gradient-to-t
              from-black via-black/20 to-transparent
            "
                    />
                </motion.div>


                <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                >


                    <div className="space-y-3">

                        <div
                            className="
                            text-3xl md:text-5xl font-black
                            text-green-400
                            leading-tight
                            break-words
                            flex
                             flex-wrap
                            "
                        >
                            {product.productName}
                        </div>
                        <div className="space-y-2 w-full min-w-0">

                            <h3
                                className="
      text-gray-300
      leading-relaxed
      text-sm md:text-base
      break-words
      whitespace-pre-wrap
      max-w-full
    "
                            >
                                {more
                                    ? product.productDescription
                                    : product.productDescription?.slice(0, 120)}
                            </h3>

                            {product.productDescription?.length > 120 && (
                                <button
                                    onClick={() => setMore((prev) => !prev)}
                                    className="text-green-400 text-sm hover:underline w-fit"
                                >
                                    {more ? "Show Less" : "Read More"}
                                </button>
                            )}

                        </div>
                    </div>


                    <div
                        className="
              inline-flex items-center gap-3
              px-5 py-3 rounded-2xl
              bg-green-500/10
              border border-green-400/20
            "
                    >
                        <span className="text-gray-300 text-sm">
                            Price
                        </span>

                        <span className="text-2xl md:text-3xl font-bold text-white">
                            L.E {product.productPrice}
                        </span>
                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">


                        <div
                            className="
                bg-zinc-900 border border-zinc-800
                rounded-2xl p-4
              "
                        >
                            <p className="text-gray-400 text-sm">
                                Availability
                            </p>

                            <p
                                className={`font-bold mt-2 ${product.productStock === "inStock"
                                    ? "text-green-400"
                                    : "text-red-400"
                                    }`}
                            >
                                {product.productStock === "inStock"
                                    ? "In Stock"
                                    : "Out Of Stock"}
                            </p>
                        </div>


                        <div
                            className="
                bg-zinc-900 border border-zinc-800
                rounded-2xl p-4
              "
                        >
                            <p className="text-gray-400 text-sm">
                                Category
                            </p>

                            <div className="mt-2">
                                <span className={getCategoryStyle(product.productCategory)}>
                                    {capitalize(product.productCategory)}
                                </span>
                            </div>
                        </div>


                        <div
                            className="
                bg-zinc-900 border border-zinc-800
                rounded-2xl p-4
              "
                        >
                            <p className="text-gray-400 text-sm">
                                Account Type
                            </p>

                            <p className="font-bold text-white mt-2">
                                {capitalize(product.accountType)}
                            </p>
                        </div>

                    </div>


                    <div className="flex flex-col sm:flex-row gap-4 pt-2">

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={product.productStock !== "inStock"}
                            className="
                px-6 py-3 rounded-2xl
                bg-green-500/15
                border border-green-400/30
                text-green-300 font-semibold
                hover:bg-green-500/20
                hover:shadow-[0_0_25px_rgba(34,197,94,0.3)]
                transition-all
              "
                            onClick={() => {
                                dispatch(
                                    setBuyNow({
                                        ...product,
                                        quantity: 1,
                                    })
                                )
                                navigate("/checkout")

                            }}
                        >
                            Buy Now
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={product.productStock !== "inStock"}
                            onClick={() => handleAddToCart(product)}
                            className="px-6 py-3 rounded-2xl bg-zinc-900 border border-zinc-700 text-white font-semibold hover:border-green-500/30 hover:text-green-300 transition-all"
                        >
                            Add To Cart
                        </motion.button>


                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(-1)}
                            className="
                px-6 py-3 rounded-2xl
                bg-zinc-900
                border border-zinc-700
                text-gray-300
              "
                        >
                            Back
                        </motion.button>

                    </div>

                </motion.div>
            </div>


            <div className="max-w-7xl mx-auto px-4 mt-20">

                <div className="flex items-center justify-between mb-8">

                    <h2 className="text-2xl md:text-3xl font-bold text-green-400">
                        Similar Products
                    </h2>

                    <span className="text-gray-400 text-sm">
                        {capitalize(product.productCategory)}
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {similarProductsUpdated?.filter((item) => item._id !== id)
                        .map((item) => (
                            <motion.div
                                key={item._id}
                                whileHover={{ y: -6 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => navigate(`/home/product/${item._id}`)}
                                className="
                cursor-pointer overflow-hidden rounded-3xl
                bg-zinc-900/80
                border border-green-500/10
                hover:border-green-500/30
                transition-all
              "
                            >


                                <div className="relative overflow-hidden">

                                    <img
                                        src={item.productImage?.[0]}
                                        alt={item.productName}
                                        className="
                    w-full aspect-video object-cover
                    hover:scale-105 transition duration-500
                  "
                                    />

                                    <div
                                        className={`
                    absolute top-3 right-3
                    ${getCategoryStyle(item.productCategory)}
                    backdrop-blur-xl
                  `}
                                    >
                                        {capitalize(item.productCategory)}
                                    </div>

                                </div>


                                <div className="p-5 space-y-3">

                                    <h3 className="text-lg font-bold text-green-300">
                                        {item.productName}
                                    </h3>

                                    <p className="text-white text-xl font-semibold">
                                        L.E {item.productPrice}
                                    </p>

                                </div>

                            </motion.div>

                        ))}

                </div>
            </div>


            <div className="max-w-7xl mx-auto px-4 mt-20">

                <h2 className="text-2xl md:text-3xl font-bold text-green-400 mb-8">
                    You May Like
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {randomProducts
                        ?.filter((item) => item._id !== id)
                        .map((item) => (
                            <motion.div
                                key={item._id}
                                whileHover={{ y: -6 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => navigate(`/home/product/${item._id}`)}
                                className="
                    cursor-pointer overflow-hidden rounded-3xl
                    bg-zinc-900/80
                    border border-green-500/10
                    hover:border-green-500/30
                    transition-all
                "
                            >


                                <div className="relative overflow-hidden">

                                    <img
                                        src={item.productImage?.[0]}
                                        alt={item.productName}
                                        className="
                            w-full aspect-video object-cover
                            hover:scale-105 transition duration-500
                        "
                                    />

                                    <div
                                        className={`
                            absolute top-3 right-3
                            ${getCategoryStyle(item.productCategory)}
                            backdrop-blur-xl
                        `}
                                    >
                                        {capitalize(item.productCategory)}
                                    </div>

                                </div>


                                <div className="p-5 space-y-3">

                                    <h3 className="text-lg font-bold text-green-300">
                                        {item.productName}
                                    </h3>

                                    <p className="text-white text-xl font-semibold">
                                        L.E {item.productPrice}
                                    </p>

                                </div>

                            </motion.div>
                        ))}

                </div>
            </div>

        </div>
    );
}
