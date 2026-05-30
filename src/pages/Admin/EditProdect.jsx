import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { updateProduct } from "../../rudex/store/productSlice";

export default function EditProdect() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { register, handleSubmit, reset } = useForm();

  const { loadingUpdateProduct, products } = useSelector(
    (state) => state.product
  );

  const product = products?.find((p) => p._id === id);

  useEffect(() => {
    if (product) {
      reset({
        productName: product.productName,
        productDescription: product.productDescription,
        productPrice: product.productPrice,
        productStock: product.productStock,
        productCategory: product.productCategory,
        accountType: product.accountType,
        deal: product.deal ,
      });
    }
  }, [product, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "productImages") {
          for (let i = 0; i < value.length; i++) {
            formData.append("productImages", value[i]);
          }
        } else {
          formData.append(key, value);
        }
      });

      await dispatch(updateProduct({ id, formData })).unwrap();
      navigate("/admin/products");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-zinc-950 text-white p-4 sm:p-6"
    >
      <div className="flex flex-col">

        {/* HEADER */}
        <header className="bg-zinc-900 border border-zinc-800 px-4 sm:px-6 py-4 flex justify-between items-center rounded-xl">
          <h1 className="text-lg sm:text-2xl font-bold text-green-400">
            ✏️ Edit Game Product
          </h1>

          <button
            onClick={() => navigate("/admin/products")}
            className="bg-zinc-800 hover:bg-green-500/10 border border-zinc-700 px-4 py-2 rounded-lg transition"
          >
            Back
          </button>
        </header>

        {/* FORM */}
        <main className="mt-6 flex justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-3xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-8 rounded-2xl space-y-6"
          >

            <h2 className="text-xl font-semibold text-green-400">
              Game Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* NAME */}
              <div className="md:col-span-2">
                <label className="text-gray-300 block mb-1">
                  Game Name
                </label>
                <input
                  {...register("productName")}
                  className="w-full bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="md:col-span-2">
                <label className="text-gray-300 block mb-1">
                  Description
                </label>
                <textarea
                  {...register("productDescription")}
                  className="w-full bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              {/* PRICE */}
              <div>
                <label className="text-gray-300 block mb-1">Price</label>
                <input
                  type="number"
                  {...register("productPrice")}
                  className="w-full bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg"
                />
              </div>

              {/* STOCK */}
              <div>
                <label className="text-gray-300 block mb-1">Availability</label>
                <select
                  {...register("productStock")}
                  className="w-full bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg"
                >
                  <option value="">Select</option>
                  <option value="inStock">Available</option>
                  <option value="outOfStock">Not Available</option>
                </select>
              </div>

              {/* ACCOUNT TYPE */}
              <div>
                <label className="text-gray-300 block mb-1">
                  Account Type
                </label>
                <select
                  {...register("accountType")}
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
                <label className="text-gray-300 block mb-1">
                  Category
                </label>
                <select
                  {...register("productCategory")}
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
                <label className="text-gray-300 block mb-1">
                  Images
                </label>
                <input
                  type="file"
                  multiple
                  {...register("productImages")}
                  className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg"
                />
              </div>

              {/* DEAL */}
              <div className="md:col-span-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register("deal")}
                  className="w-5 h-5 accent-green-500 cursor-pointer"
                />
                <span className="text-green-300 font-medium">
                  Deal Product
                </span>
              </div>

            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="bg-zinc-800 border border-zinc-700 px-5 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                disabled={loadingUpdateProduct}
                type="submit"
                className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded-lg flex items-center gap-2"
              >
                {loadingUpdateProduct ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>
        </main>
      </div>
    </motion.div>
  );
}