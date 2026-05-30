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
      className="min-h-screen bg-zinc-950 text-white flex flex-col"
    >
      {/* HEADER */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-4 sm:px-6 py-4 flex justify-between items-center">
        <h1 className="text-base sm:text-2xl font-bold text-green-400">
          🎮 Create Game Product
        </h1>

        <button
          onClick={() => navigate("/admin/products")}
          className="bg-zinc-800 hover:bg-green-500/10 border border-zinc-700 px-3 sm:px-4 py-2 rounded-lg transition text-sm sm:text-base"
        >
          Back
        </button>
      </header>

      {/* CONTENT */}
      <main className="flex-1 flex justify-center px-3 sm:px-6 py-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-3xl bg-zinc-900/60 border border-zinc-800 p-4 sm:p-8 rounded-2xl space-y-6"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-green-400">
            Game Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* NAME */}
            <div className="md:col-span-2">
              <label className="text-gray-300 mb-1 block">
                Game Name
              </label>
              <input
                type="text"
                {...register("productName", { required: true })}
                className="w-full bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <label className="text-gray-300 mb-1 block">
                Description
              </label>
              <textarea
                {...register("productDescription", { required: true })}
                className="w-full bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* PRICE */}
            <div>
              <label className="text-gray-300 mb-1 block">Price</label>
              <input
                type="number"
                {...register("productPrice", { required: true })}
                className="w-full bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg"
              />
            </div>

            {/* STOCK */}
            <div>
              <label className="text-gray-300 mb-1 block">Availability</label>
              <select
                {...register("productStock", { required: true })}
                className="w-full bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg"
              >
                <option value="">Select</option>
                <option value="inStock">Available</option>
                <option value="outOfStock">Not Available</option>
              </select>
            </div>

            {/* ACCOUNT TYPE */}
            <div>
              <label className="text-gray-300 mb-1 block">Account Type</label>
              <select
                {...register("accountType", { required: true })}
                className="w-full bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg"
              >
                <option value="">Select</option>
                <option value="sign">sign</option>
                <option value="home">home</option>
                <option value="pre">pre</option>
                <option value="sec">sec</option>
                <option value="full">full</option>
              </select>
            </div>

            {/* CATEGORY */}
            <div>
              <label className="text-gray-300 mb-1 block">Game Category</label>
              <select
                {...register("productCategory", { required: true })}
                className="w-full bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg"
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

            {/* IMAGES */}
            <div className="md:col-span-2">
              <label className="text-gray-300 mb-1 block">
                Game Images
              </label>
              <input
                type="file"
                multiple
                {...register("productImages")}
                className="w-full text-sm text-gray-300 border border-zinc-700 p-2 rounded-lg"
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">

            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="bg-zinc-800 border border-zinc-700 hover:bg-green-500/10 px-5 py-2 rounded-lg w-full sm:w-auto"
            >
              Cancel
            </button>

            <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("deal")}
                className="w-5 h-5 accent-green-500"
              />
              <span className="text-green-300 font-medium">DEAL</span>
            </label>

            <button
              disabled={loadingCreateProduct}
              type="submit"
              className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded-lg w-full sm:w-auto"
            >
              {loadingCreateProduct ? "Saving..." : "Create game"}
            </button>
          </div>
        </form>
      </main>
    </motion.div>
  );
}