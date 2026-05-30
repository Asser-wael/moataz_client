import { useForm } from "react-hook-form";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, updateStatus } from "../../rudex/store/orderSlice";
import Loading from "../../components/loading";
import Toast from "../../components/Toast";
import { motion } from "framer-motion";
import { setNotification } from "../../rudex/store/notificationSlice";

export default function OrderDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        reset,
    } = useForm();

    const {
        allOrders,
        loading,
        updating,
    } = useSelector((state) => state.order);

    // GET ORDERS
    useEffect(() => {
        if (!allOrders.length) {
            dispatch(getAllOrders());
        }
    }, [dispatch, allOrders.length]);

    // FIND ORDER
    const order = allOrders.find((o) => o._id === id);

    // RESET FORM
    useEffect(() => {
        if (order) {
            reset({
                status: order.status,
            });
        }
    }, [order, reset]);

    // SUBMIT
    const onSubmit = async (data) => {
        try {
            await dispatch(
                updateStatus({
                    status: data.status,
                    id: order._id,
                })
            ).unwrap();

            dispatch(
                setNotification({
                    message: "Status changed successfully 🎉",
                    type: "success",
                })
            );
        } catch (error) {
            dispatch(
                setNotification({
                    message: "Failed to change status ❌",
                    type: "error",
                })
            );
        }
    };

    // LOADING
    if (loading) {
        return <Loading />;
    }

    // NOT FOUND
    if (!order) {
        return (
            <div className="w-full p-6 text-white">
                <div className="bg-zinc-900 p-6 rounded-xl border border-red-500/20">
                    <h1 className="text-2xl text-red-400 font-bold mb-2">
                        Order Not Found
                    </h1>

                    <p className="text-gray-400">
                        The requested order does not exist.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-6 text-white">
            <Toast />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 rounded-xl p-6 border border-white/10"
            >
                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl text-green-400 font-bold">
                        Order Details
                    </h1>

                    <span className="text-gray-400 text-sm">
                        {new Date(order.createdAt).toLocaleString()}
                    </span>
                </div>

                {/* INFO GRID */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">

                    {/* ORDER ID */}
                    <div className="bg-black/40 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm">
                            Order ID
                        </p>

                        <p className="text-green-400 font-bold break-all">
                            {order._id}
                        </p>
                    </div>

                    {/* USER */}
                    <div className="bg-black/40 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm">
                            User
                        </p>

                        <p>
                            {order.userId?.name || "Unknown User"}
                        </p>
                    </div>

                    {/* TOTAL */}
                    <div className="bg-black/40 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm">
                            Total
                        </p>

                        <p className="text-green-400 font-bold">
                            ${order.totalPrice}
                        </p>
                    </div>

                    {/* STATUS */}
                    <div className="bg-black/40 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm mb-2">
                            Status
                        </p>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex gap-2 items-center"
                        >
                            <select
                                {...register("status")}
                                className="w-full bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg outline-none"
                            >
                                <option value="pending">
                                    pending
                                </option>

                                <option value="confirmed">
                                    confirmed
                                </option>

                                <option value="rejected">
                                    rejected
                                </option>

                                <option value="completed">
                                    completed
                                </option>
                            </select>

                            <button
                                type="submit"
                                disabled={updating}
                                className="bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black px-4 py-2 rounded-lg font-bold duration-150"
                            >
                                {updating ? "Saving..." : "Save"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* WALLET NAME */}
                <div className="mb-4">
                    <h2 className="text-green-300 font-bold">
                        اسم المحفظة
                    </h2>

                    <p className="text-gray-300 mt-1">
                        {order.name}
                    </p>
                </div>

                <hr className="border-white/10 mb-4" />

                {/* PHONE */}
                <div className="mb-6">
                    <h2 className="text-green-300 font-bold">
                        رقم الواتس
                    </h2>

                    <p className="text-gray-300 mt-1">
                        {order.phoneNum}
                    </p>
                </div>

                {/* PRODUCTS */}
                <h2 className="text-green-300 font-bold mb-3">
                    Products
                </h2>

                <div className="space-y-3 mb-6">
                    {order.cart?.map((item) => (
                        <div
                            key={item._id}
                            className="flex justify-between items-center bg-black/40 p-4 rounded-lg"
                        >
                            {/* PRODUCT INFO */}
                            <div className="flex flex-col gap-1">
                                <span className="font-semibold">
                                    {item.productId?.productName}
                                </span>

                                <span className="text-gray-400 text-sm">
                                    Quantity × {item.quantity}
                                </span>
                            </div>

                            {/* EXTRA INFO */}
                            <div className="flex flex-col gap-1 border-l border-white/10 pl-4">
                                <span className="text-sm text-gray-300">
                                    {item.productId?.productCategory}
                                </span>

                                <span className="text-sm text-gray-500">
                                    {item.productId?.accountType}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* PAYMENT PHOTO */}
                {order.photo && (
                    <div>
                        <h3 className="text-green-300 mb-3 font-bold">
                            Payment Proof
                        </h3>

                        <a
                            href={order.photo}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={order.photo}
                                alt="payment-proof"
                                className="rounded-xl max-w-sm border border-white/10 cursor-pointer hover:scale-105 duration-200"
                            />
                        </a>
                    </div>
                )}
            </motion.div>
        </div>
    );
}