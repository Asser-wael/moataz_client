import React from "react";
import { motion } from "framer-motion";
import { BiSolidMessageAltError } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

export default function Error() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-black flex items-center justify-center px-4 overflow-hidden">

      {/* Glow Background */}
      <div className="absolute w-[500px] h-[500px] bg-green-500/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="
          relative z-10
          w-full max-w-xl
          bg-white/5 backdrop-blur-2xl
          border border-green-500/20
          rounded-3xl
          p-10
          flex flex-col items-center
          text-center
          shadow-[0_0_40px_rgba(0,255,120,0.08)]
        "
      >

        {/* ICON */}
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          className="
            text-green-400 text-8xl
            drop-shadow-[0_0_20px_rgba(0,255,120,0.7)]
          "
        >
          <BiSolidMessageAltError />
        </motion.div>

        {/* TITLE */}
        <h1
          className="
            mt-6 text-4xl md:text-5xl
            font-extrabold tracking-[4px]
            text-white
          "
        >
          404 ERROR
        </h1>

        {/* TEXT */}
        <p className="mt-4 text-gray-400 text-sm md:text-base max-w-md leading-7">
          The page you are looking for does not exist or has been moved.
        </p>

        {/* BUTTON */}
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 25px rgba(34,197,94,0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/home")}
          className="
            mt-8 px-8 py-3 rounded-2xl
            bg-green-500/10
            border border-green-500/30
            text-green-300 font-semibold
            backdrop-blur-xl
            transition-all
            hover:border-green-400
          "
        >
          Back Home
        </motion.button>
      </motion.div>
    </div>
  );
}