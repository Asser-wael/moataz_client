// ==============================
// CART PAGE
// ==============================

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  getCart,
  RemoveFromCart,
  addToCart,
  decreaseQuantity,
  addGuestCart,
  removeGuestCart,
  decreaseGuestQuantity,
} from "../../rudex/store/cartSlice";

import Loading from "../../components/loading";


import {
  FaTrash,
  FaPlus,
  FaMinus,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

export default function Cart() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const token = localStorage.getItem("accessToken");

  const {
    cart,
    guestCart,
    totalprice,
    loading,
  } = useSelector((state) => state.cart);
  useEffect(() => {
    if (token) {
      dispatch(getCart());
    }
  }, [dispatch, token]);

  // ==============================
  // SELECT CART
  // ==============================

  const currentCart = token ? cart : guestCart;

  const guestTotalPrice = guestCart.reduce((acc, item) => {
    return acc + ((item.productPrice || 0) * (item.quantity || 1));
  }, 0);

  const finalTotalPrice = token
    ? totalprice
    : guestTotalPrice;

  // ==============================
  // FILTER
  // ==============================

  const filteredCart = (currentCart || [])
    .filter((item) => {

      const product = item.productId || item;

      return product?.productName
        ?.toLowerCase()
        .includes(search.trim().toLowerCase());

    })

    .sort((a, b) => {

      const productA = a.productId || a;
      const productB = b.productId || b;

      const stockA = productA?.productStock;
      const stockB = productB?.productStock;

      if (stockA === "inStock" && stockB === "outOfStock") return -1;
      if (stockA === "outOfStock" && stockB === "inStock") return 1;

      return (
        (productA?.productPrice || 0) -
        (productB?.productPrice || 0)
      );
    });

  if (loading) return <Loading />;

  return (
    <div className="w-full p-4 min-h-screen bg-black text-white">

      {/* BG */}
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.1),transparent_40%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">

        {/* TOP BAR */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-between items-center max-md:flex-col-reverse gap-4 border-b border-white/5 pb-6"
        >

          {/* TOTAL */}
          <div className="flex items-center gap-4 max-md:w-full max-md:justify-between">

            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">
                Total Price
              </p>

              <h2 className="text-2xl md:text-3xl font-black text-green-400">
                ${finalTotalPrice}
              </h2>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              disabled={filteredCart.length === 0}
              className="bg-green-700 px-5 py-2.5 rounded-xl font-bold hover:opacity-80 duration-200 disabled:opacity-40"
            >
              Checkout
            </button>

            <button
              onClick={() => navigate("/home")}
              className="bg-zinc-800 px-5 py-2.5 rounded-xl font-bold hover:bg-zinc-700 duration-200"
            >
              Home
            </button>

          </div>

          {/* SEARCH */}
          <div className="max-md:w-full">

            <input
              type="text"
              placeholder="Search in cart..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-64 p-2 bg-transparent border-b-2 border-b-zinc-800 hover:border-green-500 focus:border-green-400 outline-none"
            />

          </div>

        </motion.div>

        {/* PRODUCTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredCart.length > 0 ? (

            filteredCart.map((item, index) => {

              const product = item.productId || item;
              if (!product) return null;
              return (

                <motion.div
                  key={product._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                  }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-zinc-900 p-6 rounded-xl border border-white/5 flex flex-col justify-between"
                >

                  <div>

                    {/* IMAGE */}
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 border border-white/5">

                      <img
                        src={product.productImage?.[0]}
                        alt={product.productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />

                      {/* QUANTITY */}
                      <div className="absolute bottom-2 right-2 bg-black/80 flex items-center gap-3 px-2 py-1 rounded-lg">

                        {/* MINUS */}
                        <button
                          onClick={() =>
                            token
                              ? dispatch(decreaseQuantity(product._id))
                              : dispatch(decreaseGuestQuantity(product._id))
                          }
                          className="text-zinc-400 hover:text-white"
                        >
                          <FaMinus size={10} />
                        </button>

                        <span className="text-xs font-black text-green-400">
                          {item.quantity}
                        </span>

                        {/* PLUS */}
                        <button
                          onClick={() =>
                            token
                              ? dispatch(addToCart(product._id))
                              : dispatch(addGuestCart(product))
                          }
                          className="text-zinc-400 hover:text-white"
                        >
                          <FaPlus size={10} />
                        </button>

                      </div>

                    </div>

                    {/* NAME */}
                    <div className="flex justify-between items-start gap-2 mb-2">

                      <h2 className="text-lg font-bold line-clamp-1">
                        {product.productName}
                      </h2>

                      <p className="text-green-400 font-extrabold">
                        ${product.productPrice}
                      </p>

                    </div>

                    {/* DESC */}
                    <p className="text-zinc-400 text-xs line-clamp-2 mb-4">

                      {product.productDescription ||
                        "No description available."}

                    </p>

                  </div>

                  {/* FOOTER */}
                  <div className="flex justify-between items-center flex-wrap gap-3 pt-2 border-t border-white/5">

                    {/* STOCK */}
                    {product.productStock === "inStock" ? (

                      <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-md">
                        In Stock
                      </span>

                    ) : (

                      <span className="text-xs text-red-500 bg-red-500/10 px-2 py-1 rounded-md">
                        Out Of Stock
                      </span>

                    )}

                    {/* ACTIONS */}
                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          navigate(`/home/product/${product._id}`)
                        }
                        className="bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs rounded-lg"
                      >
                        View
                      </button>

                      {/* REMOVE */}
                      <button
                        onClick={() =>
                          token
                            ? dispatch(RemoveFromCart(product._id))
                            : dispatch(removeGuestCart(product._id))
                        }
                        className="bg-red-950/40 hover:bg-red-600 border border-red-500/30 text-red-400 hover:text-white px-3 py-1.5 text-xs rounded-lg flex items-center gap-1"
                      >
                        <FaTrash size={10} />
                        Remove
                      </button>

                    </div>

                  </div>

                </motion.div>

              );
            })

          ) : (

            <div className="col-span-full py-20 text-center text-zinc-500">
              <p className="text-lg">
                No items found in your cart
              </p>
            </div>

          )}

        </div>

      </div>

    </div>
  );
}