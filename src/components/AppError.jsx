import { useEffect } from "react";
import { Link, useRouteError } from "react-router-dom";
import {
  FiAlertTriangle,
  FiHome,
  FiRefreshCw,
} from "react-icons/fi";

export default function AppError() {
  const error = useRouteError();

  const isDynamicImportError =
    error?.message?.includes("Failed to fetch dynamically imported module");

  useEffect(() => {
    if (isDynamicImportError) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isDynamicImportError]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg)] px-6">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)]/10 blur-3xl" />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">

        {/* Accent Bar */}
        <div className="absolute left-0 top-0 h-1 w-full bg-[var(--color-accent)]" />

        {/* Icon */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)]/10">
          <FiAlertTriangle
            size={46}
            className="text-[var(--color-accent)]"
          />
        </div>

        {/* Title */}
        <h1 className="mt-8 text-center text-4xl font-bold text-[var(--color-text)]">
          Oops! Something went wrong.
        </h1>

        {/* Description */}
        <p className="mx-auto mt-5 max-w-xl text-center text-lg leading-8 text-[var(--color-muted)]">
          {isDynamicImportError
            ? "The application may have been updated recently. We're loading the latest version to ensure everything works correctly. This page will refresh automatically in 3 seconds."
            : "An unexpected error occurred while loading this page. Please try again or return to the home page."}
        </p>

        {/* Auto Refresh */}
        {isDynamicImportError && (
          <div className="mt-8 flex items-center justify-center gap-3 rounded-xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 px-5 py-3 text-sm font-medium text-[var(--color-accent)]">
            <FiRefreshCw className="animate-spin" />
            <span>Refreshing automatically in 3 seconds...</span>
          </div>
        )}

        {/* Error Details (Development Only) */}
        {import.meta.env.DEV && error?.message && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-red-500/20 bg-red-500/10">
            <div className="border-b border-red-500/20 px-4 py-3 text-left text-sm font-semibold text-red-400">
              Error Details
            </div>

            <pre className="overflow-auto p-4 text-left text-xs leading-6 text-red-300">
              {error.message}
            </pre>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-7 py-3 font-semibold text-[var(--color-bg)] transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <FiRefreshCw />
            Refresh Now
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-7 py-3 font-semibold text-[var(--color-text)] transition-all duration-300 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)]"
          >
            <FiHome />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}