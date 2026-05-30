// components/Toast.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearNotification } from "../rudex/store/notificationSlice";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast() {
  const dispatch = useDispatch();
  const { message, type, visible } = useSelector(
    (state) => state.notification
  );

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, dispatch]);

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`
            fixed bottom-5 right-5 px-5 py-3 rounded-xl text-white
            shadow-lg z-50
            ${colors[type] || "bg-gray-700"}
          `}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}