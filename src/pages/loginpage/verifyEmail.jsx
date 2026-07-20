import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { verifyEmail, resendOtp } from "../../features/authSlice";
import { motion } from "framer-motion";
import { MdMarkEmailRead } from "react-icons/md";

const RESEND_COOLDOWN = 60;

export default function VerifyEmail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loadingVerify, loadingResendOtp } = useSelector((state) => state.authSlice);

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (index, value) => {
    const clean = value.replace(/[^0-9]/g, "").slice(-1);

    const updated = [...digits];
    updated[index] = clean;
    setDigits(updated);

    if (clean && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (!pasted) return;

    const updated = pasted.split("");
    while (updated.length < 6) updated.push("");
    setDigits(updated);
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otp = digits.join("");
    if (otp.length !== 6) return;

    try {
      await dispatch(verifyEmail({ otp })).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Verify email failed:", err);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || loadingResendOtp) return;

    try {
      await dispatch(resendOtp()).unwrap();
      setDigits(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      console.error("Resend OTP failed:", err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--color-bg)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <form
          onSubmit={handleSubmit}
          className="
            bg-[var(--color-card)]
            border border-[var(--color-border)]
            p-8 rounded-2xl shadow-2xl
            flex flex-col gap-6
          "
        >
          {/* Header */}
          <div className="text-center flex flex-col items-center gap-3">
            <div
              className="
                w-14 h-14 rounded-full
                bg-[var(--color-accent)]/10
                flex items-center justify-center
                text-[var(--color-accent)] text-3xl
              "
            >
              <MdMarkEmailRead />
            </div>

            <h2 className="text-2xl font-bold text-[var(--color-text)]">
              Verify Your Email
            </h2>

            <p className="text-[var(--color-muted)] text-sm">
              Enter the 6-digit code we sent to your email
            </p>
          </div>

          {/* OTP Inputs */}
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="
                  w-12 h-14
                  bg-[var(--color-bg)]
                  border border-[var(--color-border)]
                  text-[var(--color-text)]
                  text-center text-xl font-semibold
                  rounded-xl
                  focus:outline-none
                  focus:ring-2 focus:ring-[var(--color-accent)]/40
                  focus:border-[var(--color-accent)]
                  transition-all
                "
              />
            ))}
          </div>

          {/* Resend OTP */}
          <div className="text-center -mt-2">
            {cooldown > 0 ? (
              <p className="text-[var(--color-muted)] text-sm">
                Resend code in{" "}
                <span className="text-[var(--color-text)] font-medium">
                  {cooldown}s
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={loadingResendOtp}
                className={`
                  text-[var(--color-accent)] hover:opacity-80
                  text-sm font-medium transition
                  ${loadingResendOtp ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {loadingResendOtp ? "Sending..." : "Resend code"}
              </button>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loadingVerify || digits.join("").length !== 6}
            className={`
              bg-[var(--color-accent)]
              text-white rounded-xl py-3 font-bold text-lg
              hover:opacity-90 active:scale-95
              transition-all duration-200
              shadow-lg
              ${loadingVerify || digits.join("").length !== 6 ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {loadingVerify ? "Verifying..." : "Verify Email"}
          </button>

          {/* Link */}
          <div className="text-center">
            <Link
              to="/login"
              className="text-[var(--color-accent)] hover:opacity-80 text-sm font-medium transition"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}