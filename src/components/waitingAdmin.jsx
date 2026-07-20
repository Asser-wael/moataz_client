import React from "react";
import { FaUserClock } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../features/authSlice";

export default function WaitingAdmin() {
    const dispatch = useDispatch();

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)] p-6">
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-8 max-w-md w-full text-center shadow-xl">

                <div className="flex justify-center mb-5">
                    <FaUserClock className="text-6xl text-[var(--color-accent)] animate-pulse" />
                </div>

                <h1 className="text-3xl font-bold mb-3">
                    Verify your email
                </h1>

                <p className="text-[var(--color-muted)] leading-relaxed">
                    Your account hasn't been verified yet. Please verify your email to
                    continue using all features.
                </p>

                <div className="mt-6 inline-flex items-center rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm font-medium text-yellow-500">
                    Pending Verification
                </div>

                <button
                    onClick={() =>
                        window.location.href = "/login/verifyEmail"
                    }
                    className="mt-6 w-full rounded-xl bg-[var(--color-accent)] py-3 font-semibold text-white transition hover:opacity-90"
                >
                    Verify your email
                </button>

                <button
                    onClick={async () => {
                        try {
                            await dispatch(logoutUser()).unwrap();
                            window.location.href = "/";
                            window.location.reload();
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                    className="mt-3 w-full rounded-xl bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}