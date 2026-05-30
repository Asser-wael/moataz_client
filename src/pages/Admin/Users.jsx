import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminUsers, deleteUser } from "../../rudex/store/adminSlice";
import { motion } from "framer-motion";
import { TiUserDeleteOutline } from "react-icons/ti";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
export default function Users() {
  const dispatch = useDispatch();

  const { usersData, loadingUsers, loadingDelete } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    dispatch(getAdminUsers());
  }, [dispatch]);

  if (loadingUsers) {
    return <h1 className="text-white text-center mt-10">Loading...</h1>;
  }

  return (
    <div className="w-full text-white">

      <h1 className="text-2xl font-bold mb-6 text-green-400">
        👥 Users Management
      </h1>

      <div className="grid md:grid-cols-3 gap-4">

        {usersData?.map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 hover:border-green-500 transition"
          >

            {/* Name */}
            <h2 className="text-lg font-semibold mb-1">
              {user.name}
            </h2>

            {/* Email */}
            <p className="text-gray-400 text-sm mb-2">
              {user.email}
            </p>

            {/* Role */}
            <span
              className={`text-xs px-2 py-1 rounded ${user.role === "admin"
                ? "bg-red-500/20 text-red-400"
              
                : "bg-green-500/20 text-green-400"
                }`}
            >
              {user.role}
            </span>

            {/* Cart Count */}
            <div className="flex justify-between items-center">

              <p className="text-xs text-gray-500 mt-3">
                {user.role === "admin" ? "" : `Cart Items: ${user.cart?.length || 0}`}

              </p>

              {user.role === "admin" ? "" :
                <button className=" px-3 py-1 translate-2 cursor-pointer text-2xl rounded disabled:opacity-50 
                duration-300 hover:text-red-500 "
                  disabled={loadingDelete}
                  onClick={() => dispatch(deleteUser(user._id))}>
                  {loadingDelete == true ? (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  ) : (
                    <TiUserDeleteOutline />
                  )}
                </button>}
            </div>
          </motion.div>
        ))}

      </div>
    </div >
  );
}