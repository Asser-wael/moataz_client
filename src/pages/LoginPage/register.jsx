import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { registerUser } from "../../rudex/store/authSlice";
import { motion } from "framer-motion";
import { MdEmail, MdLockOutline, MdPersonOutline } from "react-icons/md";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { loadingRegister } = useSelector((state) => state.auth);

  const onSubmit = async (formData) => {
    setLoading(true);
    setErrorMsg("");
    setLoading(false);

    const result = await dispatch(registerUser(formData));

    const status = result.payload?.status;

    if (status === 201) {
      reset();
      navigate("/login", { replace: true });
    } else {
      setErrorMsg(result.payload?.data?.message || "Server error");
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl shadow-2xl flex flex-col gap-5"
        >
          {/* Header */}
          <div className="text-center mb-2">
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
            <p className="text-zinc-400 mt-2">Join us and start managing today</p>
          </div>

          {/* Name Input */}
          <div className="flex flex-col gap-2">
            <label className="text-zinc-400 text-sm ml-1">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 text-xl">
                <MdPersonOutline />
              </span>
              <input
                className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all placeholder:text-zinc-600"
                type="text"
                placeholder="Aser Dev"
                {...register("name", { required: true })}
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label className="text-zinc-400 text-sm ml-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 text-xl">
                <MdEmail />
              </span>
              <input
                className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all placeholder:text-zinc-600"
                type="email"
                placeholder="name@company.com"
                {...register("email", { required: true })}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <label className="text-zinc-400 text-sm ml-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 text-xl">
                <MdLockOutline />
              </span>
              <input
                className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all placeholder:text-zinc-600"
                type="password"
                placeholder="••••••••"
                {...register("password", { required: true })}
              />
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20"
            >
              {errorMsg}
            </motion.p>
          )}

          <div className="flex justify-between items-center px-1">
            <Link
              to="/login"
              className="text-green-500 hover:text-green-400 text-sm font-medium transition-colors"
            >
              Already have an account?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loadingRegister}
            className={`bg-green-600 text-white rounded-xl py-3 font-bold text-lg hover:bg-green-500 active:scale-95 transition-all duration-200 shadow-lg shadow-green-900/20 ${loadingRegister ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loadingRegister ? "Creating account..." : "Register"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}