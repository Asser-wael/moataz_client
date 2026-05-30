
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  getRandomProducts,
  getDeals,
  getAllProducts,
} from "../../rudex/store/profileSlice";

import { useNavigate } from "react-router-dom";

import CardSlider from "../../components/CardSlider";

import { FaXbox, FaSteam } from "react-icons/fa";
import { SiSony } from "react-icons/si";

/* ================= VARIANTS ================= */

export const fade = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  
  show: {
    opacity: 1,
    y: 0,
    
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function Home() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { randomProducts } = useSelector(
    (state) => state.profile
  );
  const { products ,loadingGetAllProducts } = useSelector(
    (state) => state.product
  );
  useEffect(() => {

    window.scrollTo(0, 0);

    dispatch(getRandomProducts());
    dispatch(getDeals());

  }, [dispatch]);


  return (
    <motion.div
      variants={fade}
      initial="hidden"
      animate="show"
      className="bg-black text-white overflow-hidden"
    >

      {/* HERO */}

      <motion.section
        variants={fade}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="min-h-screen flex items-center justify-center px-6 text-center relative overflow-hidden"
      >

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute w-[500px] h-[500px] bg-green-500/10 blur-[140px] rounded-full"
        />

        <div className="max-w-4xl relative z-10">

          <h1 className="text-4xl md:text-7xl font-black">
            LEVEL UP YOUR
          </h1>

          <motion.span
            whileHover={{
              scale: 1.1,
              color: "#22c55e",
            }}
            className="text-green-400 text-2xl md:text-4xl block mt-2 font-bold"
          >
            GAMING
          </motion.span>

          <p className="text-zinc-400 mt-6">
            Buy premium accounts and exclusive deals instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/games")}
              className="px-8 py-4 bg-green-500 text-black font-bold rounded-2xl"
            >
              Start Shopping
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/deals")}
              className="px-8 py-4 border border-white/10 rounded-2xl bg-white/5"
            >
              Explore Deals
            </motion.button>

          </div>

        </div>

      </motion.section>

      {/* DEALS */}

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <CardSlider />
      </motion.section>

      {/* CATEGORIES */}

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="py-24 px-6"
      >

        <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
          GAME <span className="text-green-400">CATEGORIES</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {[
            {
              name: "PLAYSTATION",
              icon: <SiSony />,
            },

            {
              name: "XBOX",
              icon: <FaXbox />,
            },

            {
              name: "PC",
              icon: <FaSteam />,
            },
          ].map((cat, i) => (

            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{
                scale: 1.08,
              }}
              onClick={() =>
                navigate(`/games`)
              }
              className="p-8 bg-zinc-900 border border-white/10 rounded-3xl text-center cursor-pointer"
            >

              <div className="text-3xl text-green-400 mb-3 flex justify-center">
                {cat.icon}
              </div>

              <h3 className="font-bold">
                {cat.name}
              </h3>

            </motion.div>

          ))}

        </div>

      </motion.section>

      {/* PRODUCTS */}

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="py-24 px-6"
      >

        <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
          RANDOM <span className="text-green-400">PRODUCTS</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">

          {randomProducts?.slice(0, 8).map((item, i) => (

            <motion.div
              key={item._id}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{
                y: -10,
                scale: 1.02,
              }}
              onClick={() =>
                navigate(`/home/product/${item._id}`)
              }
              className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden cursor-pointer"
            >

              <img
                src={item.productImage?.[0]}
                alt={item.productName}
                className="h-48 w-full object-cover"
              />

              <div className="p-4">

                <h3 className="font-bold line-clamp-1">
                  {item.productName}
                </h3>

                <p className="text-green-400 font-bold mt-2">
                 L.E {item.productPrice}
                </p>

              </div>

            </motion.div>

          ))}

        </div>

      </motion.section>

    </motion.div>
  );
}
                