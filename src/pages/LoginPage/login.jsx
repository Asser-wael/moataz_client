import { useDispatch, useSelector } from "react-redux";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginUser } from "../../rudex/store/authSlice";
import { motion } from "framer-motion"; 
import { MdEmail, MdLockOutline } from "react-icons/md"; 

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const { loadingLogin } = useSelector((state) => state.auth);

  const onSubmit = async (formData) => {
    const result = await dispatch(loginUser(formData));

    if (result.payload?.accessToken) {
      reset();

      // مهم جدًا: سيب وقت لـ profile load
      setTimeout(() => {
        navigate("/home");
      }, 100);
    } else {
      alert("Login failed");
    }
  };
  return (
    // الخلفية السوداء بالكامل مثل الداشبورد
    <div className="min-h-screen min-w-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-zinc-950 border inset-shadow-2xs  border-zinc-800 p-8 rounded-2xl shadow-2xl flex flex-col gap-6"
        >
          {/* Header */}
          <div className="text-center mb-2">
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="text-zinc-400 mt-2">Login to manage your account</p>
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

          <div className="flex justify-between items-center px-1">
            <Link
              to="/register"
              className="text-green-500 underline hover:text-green-400 text-sm font-medium transition-colors"
            >
              Create a new account ?
            </Link>
          </div>
          <div className="flex flex-col justify-center items-center gap-3">
            <button
              disabled={loadingLogin}
              className={`bg-green-600 w-70 py-3 rounded-lg flex justify-center items-center gap-2 ${loadingLogin && "opacity-50"
                }`}
            >
              {loadingLogin ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Loading...
                </>
              ) : (
                "Sign In"
              )}
            </button>
            <Link
              to="/home"
              className="text-gray-500 hover:text-green-400 text-sm font-medium transition-colors"
            >
              Login as a guest

            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}



