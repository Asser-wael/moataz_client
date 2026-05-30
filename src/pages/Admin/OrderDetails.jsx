import { useForm } from "react-hook-form";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, updateStatus } from "../../rudex/store/orderSlice";
import Loading from "../../components/loading";
import { motion } from "framer-motion";
import { setNotification } from "../../rudex/store/notificationSlice";

export default function OrderDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { register, handleSubmit, reset } = useForm();

    const { allOrders, loading, updating } = useSelector(
        (state) => state.order
    );

    useEffect(() => {
        if (!allOrders.length) {
            dispatch(getAllOrders());
        }
    }, [dispatch, allOrders.length]);

    const order = allOrders.find((o) => o._id === id);

    useEffect(() => {
        if (order) {
            reset({ status: order.status });
        }
    }, [order, reset]);

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

    if (loading) return <Loading />;

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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="
                    w-full
                    max-w-4xl
                    mx-auto
                    bg-zinc-900
                    rounded-xl
                    p-6
                    border
                    border-white/10
                "
            >
                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-6">
                    <h1 className="text-2xl text-green-400 font-bold">
                        Order Details
                    </h1>

                    <span className="text-gray-400 text-sm">
                        {new Date(order.createdAt).toLocaleString()}
                    </span>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-black/40 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm">Order ID</p>
                        <p className="text-green-400 font-bold break-all">
                            {order._id}
                        </p>
                    </div>

                    <div className="bg-black/40 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm">User</p>
                        <p>{order.userId?.name || "Unknown User"}</p>
                    </div>

                    <div className="bg-black/40 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm">Total</p>
                        <p className="text-green-400 font-bold">
                            ${order.totalPrice}
                        </p>
                    </div>

                    <div className="bg-black/40 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm mb-2">Status</p>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex flex-col sm:flex-row gap-2"
                        >
                            <select
                                {...register("status")}
                                className="w-full bg-zinc-800 px-4 py-2 rounded-lg"
                            >
                                <option value="pending">pending</option>
                                <option value="confirmed">confirmed</option>
                                <option value="rejected">rejected</option>
                                <option value="completed">completed</option>
                            </select>

                            <button
                                disabled={updating}
                                className="bg-green-500 text-black px-4 py-2 rounded-lg"
                            >
                                {updating ? "Saving..." : "Save"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* INFO */}
                <div className="mb-4">
                    <h2 className="text-green-300 font-bold">
                        Wallet Name
                    </h2>
                    <p>{order.name}</p>
                </div>

                <div className="mb-6">
                    <h2 className="text-green-300 font-bold">
                        Phone
                    </h2>
                    <p>{order.phoneNum}</p>
                </div>

                {/* PRODUCTS */}
                <h2 className="text-green-300 font-bold mb-3">
                    Products
                </h2>

                <div className="space-y-3 mb-6">
                    {order.cart?.map((item) => (
                        <div
                            key={item._id}
                            className="flex flex-col sm:flex-row justify-between gap-2 bg-black/40 p-4 rounded-lg"
                        >
                            <div>
                                <p>{item.productId?.productName}</p>
                                <p className="text-gray-400 text-sm">
                                    Qty × {item.quantity}
                                </p>
                            </div>

                            <div className="sm:text-right">
                                <p className="text-sm">
                                    {item.productId?.productCategory}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {item.productId?.accountType}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* PHOTO */}
                {order.photo && (
                    <div>
                        <h3 className="text-green-300 mb-3">
                            Payment Proof
                        </h3>

                        <img
                            src={order.photo}
                            className="rounded-xl max-w-full sm:max-w-sm border"
                        />
                    </div>
                )}
            </motion.div>
        </div>
    );
}