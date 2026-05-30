import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { createProduct } from "../../rudex/store/productSlice";
import { motion } from "framer-motion";

export default function AddProdect() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const { loadingCreateProduct } = useSelector((state) => state.product);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("productName", data.productName);
      formData.append("productDescription", data.productDescription);
      formData.append("productPrice", data.productPrice);
      formData.append("productStock", data.productStock);
      formData.append("productCategory", data.productCategory);
      formData.append("accountType", data.accountType);
      formData.append("deal", data.deal ? "true" : "false");
      for (let i = 0; i < data.productImages.length; i++) {
        formData.append("productImages", data.productImages[i]);
      }

      await dispatch(createProduct(formData)).unwrap();

      navigate("/admin/products");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: .2 }}
      className="flex h-screen bg-zinc-950 text-white max-sm:scale-95 max-sm:-translate-y-8">

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg md:text-2xl font-bold text-green-400">
            🎮 Create Game Product
          </h1>

          <button
            onClick={() => navigate("/admin/products")}
            className="bg-zinc-800 hover:bg-green-500/10 hover:border-green-500 border border-zinc-700 px-4 py-2 rounded-lg transition"
          >
            Back
          </button>
        </header>

        {/* Content */}
        <main className="p-6 flex justify-center overflow-y-auto">

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-3xl bg-zinc-900/60 border border-zinc-800 p-8 rounded-2xl space-y-6"
          >

            <h2 className="text-xl font-semibold text-green-400">
              Game Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Name */}
              <div className="md:col-span-2">
                <label className="text-gray-300 mb-1 block">
                  Game Name
                </label>
                <input
                  type="text"
                  {...register("productName", { required: true })}
                  className="w-full bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg 
                  focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="text-gray-300 mb-1 block">
                  Description
                </label>
                <textarea
                  {...register("productDescription", { required: true })}
                  className="w-full bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg 
                  focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                />
              </div>

              {/* Price */}
              <div>
                <label className="text-gray-300 mb-1 block">
                  Price
                </label>
                <input
                  type="number"
                  {...register("productPrice", { required: true })}
                  className="w-full bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg 
                  focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="text-gray-300 mb-1 block">
                  Availability
                </label>
                <select
                  {...register("productStock", { required: true })}
                  className="w-full bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg 
                  focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                >
                  <option value="">Select</option>
                  <option value="inStock">Available</option>
                  <option value="outOfStock">Not Available</option>
                </select>
              </div>
              <div>
                <label className="text-gray-300 mb-1 block">
                  Account Type
                </label>
                <select
                  {...register("accountType", { required: true })}
                  className="w-full bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg 
                  focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                >
                  <option value="">Select</option>
                  <option value="sign">sign</option>
                  <option value="home">home</option>
                  <option value="pre">pre</option>
                  <option value="sec">sec</option>
                  <option value="full">full</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="text-gray-300 mb-1 block">
                  Game Category
                </label>
                <select
                  {...register("productCategory", { required: true })}
                  className="w-full bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg 
                  focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                >
                  <option value="">Select</option>
                  <option value="ps4">ps4</option>
                  <option value="ps5">ps5</option>
                  <option value="pc">pc</option>
                  <option value="xbox">xbox</option>
                  <option value="steam">steam</option>
                  <option value="else">else</option>

                </select>
              </div>

              {/* Images */}
              <div className="md:col-span-2">
                <label className="text-gray-300 mb-1 block">
                  Game Images
                </label>
                <input
                  type="file"
                  multiple
                  {...register("productImages")}
                  className="w-full text-sm text-gray-300 cursor-pointer rounded-sm border-1 p-2 "
                />
              </div>

            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-3 pt-4">

              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="bg-zinc-800 border border-zinc-700 hover:bg-green-500/10 hover:border-green-500 px-5 py-2 rounded-lg transition"
              >
                Cancel
              </button>

              <button
                disabled={loadingCreateProduct}
                type="submit"
                className="bg-green-600 hover:bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)] px-5 py-2 rounded-lg transition"
              >
                {loadingCreateProduct == true ? "SaveingGame..." : "Create game"}
              </button>
              <label className="flex items-center gap-3 cursor-pointer">

                <input
                  type="checkbox"
                  {...register("deal")}
                  className="
      w-5 h-5
      accent-green-500
      cursor-pointer
    "
                />

                <span className="text-green-300 font-medium">
                  DEAL
                </span>

              </label>

            </div>
          </form>
        </main>
      </div>
    </motion.div>
  );
}