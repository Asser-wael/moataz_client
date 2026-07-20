// components/Checkout.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiUser, FiPhone, FiMapPin, FiCreditCard, FiUploadCloud, FiX } from "react-icons/fi";
import { checkOut } from "../../features/orderSlice";
import { socket } from "../../services/socket";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();


      formData.append("walletType", data.walletType);
      formData.append("whats", data.whats);
      formData.append("walletName", data.walletName);
      formData.append("walletNumber", data.walletNumber);
      console.log(data.image[0]);

      formData.append("image", data.image[0]);
      const res = await dispatch(checkOut(formData));
      const orderId = res.payload?.order?._id;

      if (orderId) {
        socket.emit("join-order", orderId);
        window.dispatchEvent(new Event("orderPlaced"));
        navigate("/");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto mt-10 max-w-2xl space-y-6 p-4"
    >
      <div>
        <h2 className="text-3xl font-bold text-[var(--color-text)]">إتمام الطلب</h2>
        <p className="text-sm text-[var(--color-muted)] mt-1">برجاء إدخال بيانات الشحن وإرفاق إيصال التحويل.</p>
      </div>

      {/* قسم الدفع وعقد التحويل */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold flex items-center gap-2 text-[var(--color-text)]">
            <FiCreditCard className="text-[var(--color-accent)]" /> بيانات الدفع الفودافون كاش
          </h3>
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold">01111191289</span>
        </div>

        <select
          {...register("walletType", { required: "اختر نوع المحفظة المحول منها" })}
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-3"
        >
          <option value="">اختر المحفظة</option>
          <option value="vodafone">فودافون كاش</option>
          <option value="orange">أورانج كاش</option>
          <option value="etisalat">اتصالات كاش</option>
          <option value="we">وي باي</option>
        </select>
        {errors.walletType && <p className="text-sm text-red-500">{errors.walletType.message}</p>}

        <input
          placeholder="ارقم الوتس الي هنبعت عليه الحساب "
          {...register("whats", { required: " رقم الوتس الي هنبعت عليه الحساب " })}
          className="w-full rounded-xl border border-[var(--color-border)] bg-transparent p-3"
        />

        <input
          placeholder="اسم صاحب المحفظة المحول منها"
          {...register("walletName", { required: "اسم صاحب المحفظة مطلوب" })}
          className="w-full rounded-xl border border-[var(--color-border)] bg-transparent p-3"
        />

        <input
          type="tel"
          placeholder="رقم المحفظة التي قمت بالتحويل منها"
          {...register("walletNumber", { required: "رقم المحفظة مطلوب" })}
          className="w-full rounded-xl border border-[var(--color-border)] bg-transparent p-3"
        />

        {/* تحميل الصورة */}
        <label className="relative flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-colors overflow-hidden">
          {preview ? (
            <>
              <img src={URL.createObjectURL(preview)} alt="إيصال التحويل" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setPreview(null); setValue("image", null); }}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <FiX size={14} />
              </button>
            </>
          ) : (
            <>
              <FiUploadCloud className="text-3xl text-[var(--color-muted)]" />
              <span className="text-sm text-[var(--color-muted)]">اضغط لرفع لقطة شاشة لإيصال التحويل</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            onChange={(e) => {
              if (e.target.files[0]) {
                setPreview(e.target.files[0]);
              }
            }}
          />
        </label>
        {errors.image && <p className="text-sm text-red-500">{errors.image.message}</p>}
      </section>

      <motion.button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-[var(--color-accent)] py-4 font-semibold text-white shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "جاري إرسال الطلب..." : "تأكيد وإتمام الطلب الآن"}
      </motion.button>
    </motion.form>
  );
}