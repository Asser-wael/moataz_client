import { setNotification } from "../../rudex/store/notificationSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, replace } from "react-router-dom";
import { useForm } from "react-hook-form";
import { sendOrder } from "../../rudex/store/orderSlice";
import { getCart, setBuyNow } from "../../rudex/store/cartSlice";
export default function Checkout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();

    const { cart, guestCart, totalprice, buyNow } = useSelector(
        (state) => state.cart
    );
    const { loading } = useSelector(
        (state) => state.order
    );

    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        if (token) dispatch(getCart());
    }, [dispatch, token]);

    const currentCart = token ? cart : guestCart;
    const payment = buyNow
        ? [{
            productId: buyNow._id,
            quantity: 1,
            product: buyNow
        }]
        : currentCart.map((item) => ({
            productId: item.productId?._id || item._id,
            quantity: item.quantity,
            product: item.productId || item
        }));
    const guestTotalPrice = guestCart.reduce((acc, item) => {
        return acc + ((item.productPrice || 0) * (item.quantity || 1));
    }, 0);

    const price = buyNow
        ? buyNow.productPrice
        : token
            ? totalprice
            : guestTotalPrice;
    const onSubmit = async (data) => {
        try {
            await dispatch(
                sendOrder({
                    data,
                    currentCart: payment,
                    totalprice: Number(price),
                })
            ).unwrap();

            dispatch(
                setNotification({
                    message: "تم إرسال الطلب بنجاح 📦",
                    type: "success",
                })
            );
            dispatch(setBuyNow(null));
            navigate("/home", { replace: true });
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className="min-h-screen bg-black text-white px-4 py-10 max-sm:w-100 flex justify-center">
            <div className="w-full max-w-4xl space-y-8">

                {/* HEADER */}
                <h1 className="text-3xl md:text-4xl font-black text-green-400 tracking-widest">
                    CHECKOUT
                </h1>

                {/* باقي الكود زي ما هو */}

                {/* CART */}
                <div className="bg-zinc-900 border border-white/10 rounded-2xl p-4 md:p-6 space-y-4">

                    <h2 className="text-lg font-bold text-white mb-2">
                        🛒 Cart Items
                    </h2>

                    {payment?.length > 0 ? (
                        payment.map((item) => {
                            const product = item.product;

                            return (
                                <div
                                    key={product._id}
                                    className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-white/10"
                                >
                                    <div>
                                        <h3 className="font-bold text-white">
                                            {product.productName}
                                        </h3>

                                        <p className="text-green-400 text-sm">
                                            ${product.productPrice}
                                        </p>

                                        <p className="text-zinc-500 text-xs">
                                            {product.productCategory}
                                        </p>
                                        <p className="text-zinc-500 text-xs">
                                            {product.accountType}
                                        </p>
                                    </div>

                                    <div className="text-green-400 font-bold">
                                        x{item.quantity || 1}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-zinc-500 text-center py-10">
                            Cart is empty 😢
                        </p>
                    )}
                </div>

                {/* TOTAL */}
                <div className="flex justify-between items-center bg-zinc-900 p-5 rounded-2xl border border-green-500/20">
                    <h2 className="text-lg font-bold text-white">Total Price</h2>
                    <span className="text-2xl font-black text-green-400">
                        ${price}
                    </span>
                </div>

                {/* PAYMENT INFO */}
                <div className="bg-zinc-900 border border-white/10 p-5 rounded-2xl space-y-2">
                    <h3 className="text-green-400 font-bold">
                        💳 Payment Info
                    </h3>

                    <p className="text-white">
                        حول على الرقم ده:
                    </p>

                    <p className="text-2xl font-black text-green-400 tracking-widest">
                        01111191289
                    </p>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid md:grid-cols-2 gap-4 bg-zinc-900 p-6 rounded-2xl border border-white/10"
                >
                    <input
                        {...register("name")} required
                        placeholder=" الرقم الي هتحول منه"
                        className="w-full p-3 bg-black border border-white/10 rounded-xl outline-none focus:border-green-500"
                    />

                    <input
                        {...register("phoneNum")} required
                        placeholder="رقم الواتس"
                        className="w-full p-3 bg-black border border-white/10 rounded-xl outline-none focus:border-green-500"
                    />

                    {/* UPLOAD */}
                    <div className="md:col-span-2">
                        <label className="text-gray-400 mb-2 block">
                            صورة التحويل
                        </label>

                        <input
                            type="file"
                            {...register("photo")} required
                            className="w-full text-sm text-gray-300 cursor-pointer border border-white/10 p-3 rounded-xl bg-black"
                        />
                    </div>

                    {/* BUTTON */}
                    <button
                        disabled={loading}
                        type="submit"
                        className="md:col-span-2 bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl transition"
                    >
                        {loading ? "....." : " ارسال الطلب 🚀"}
                    </button>
                    <button
                        disabled={loading}
                        type="button"
                        onClick={() => {
                            navigate(-1)
                            dispatch(setBuyNow(null));
                        }}
                        className="md:col-span-2 bg-gray-500 hover:bg-gray-400 text-black font-bold py-3 rounded-xl transition"
                    >
                        عوده
                    </button>
                </form>
                <div className="mt-6 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/10 text-yellow-200 text-sm leading-relaxed">
                    <p>
                        ⚠️ لو حصل أي مشكلة، كلم الرقم <span className="font-bold">0111191289</span> وهنساعدك فورًا.
                    </p>

                    <p className="mt-2">
                        برجاء التأكد من إدخال معلومات صحيحة،
                        <br />
                        وهتستلم الأوردر خلال <span className="font-bold text-white">5 دقايق</span> لحد <span className="font-bold text-white">24 ساعة</span> حسب ضغط الشغل.
                    </p>

                    <p className="mt-2 text-green-300 font-semibold">
                        الله المستعان 🤍
                    </p>
                </div>
            </div>
        </div>
    );
}