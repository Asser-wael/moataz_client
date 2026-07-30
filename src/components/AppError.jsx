import { useEffect } from "react";
import { Link, useRouteError } from "react-router-dom";
import { FiAlertTriangle, FiHome, FiRefreshCw } from "react-icons/fi";

export default function AppError() {
  const error = useRouteError();

  const isDynamicImportError =
    error?.message?.includes("Failed to fetch dynamically imported module");

  useEffect(() => {
    if (isDynamicImportError) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [isDynamicImportError]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-6">
      <div className="w-full max-w-xl rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-10 text-center shadow-2xl">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)]/10">
          <FiAlertTriangle
            size={40}
            className="text-[var(--color-accent)]"
          />
        </div>

        <h1 className="mt-6 text-4xl font-bold text-[var(--color-text)]">
          حدث خطأ غير متوقع
        </h1>

        <p className="mt-4 text-lg text-[var(--color-muted)]">
          {isDynamicImportError
            ? "يبدو أن التطبيق تم تحديثه. سيتم إعادة تحميل الصفحة تلقائيًا..."
            : "حدث خطأ أثناء تحميل الصفحة. يمكنك المحاولة مرة أخرى أو العودة للرئيسية."}
        </p>

        {import.meta.env.DEV && error?.message && (
          <div className="mt-6 overflow-auto rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-left">
            <p className="mb-2 text-sm font-semibold text-red-400">
              Error
            </p>

            <pre className="whitespace-pre-wrap break-words text-xs text-red-300">
              {error.message}
            </pre>
          </div>
        )}

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-accent)] bg-[var(--color-accent)] px-6 py-3 font-semibold text-[var(--color-bg)] transition-all duration-300 hover:scale-105"
          >
            <FiRefreshCw />
            إعادة المحاولة
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-6 py-3 font-semibold text-[var(--color-text)] transition-all duration-300 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            <FiHome />
            العودة للرئيسية
          </Link>
        </div>

      </div>
    </div>
  );
}