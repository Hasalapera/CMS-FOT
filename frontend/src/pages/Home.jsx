import React from "react";
import { LogIn, Building2, Boxes } from "lucide-react";

const Home = () => {
  const placeholderSlots = Array.from({ length: 8 });

  return (
    <div className="min-h-screen w-full flex flex-col bg-[var(--color-bg)] font-[family-name:var(--font-body)]">
      {/* ---------------- Header ---------------- */}
      <header className="w-full border-b border-[var(--color-primary-dark)] bg-[var(--color-primary)] color-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Faculty logo placeholder */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-full border-2 border-dashed border-[var(--color-primary-light)] bg-[var(--color-primary-dark)] flex items-center justify-center color-transition">
              <Building2
                className="w-5 h-5 text-[var(--color-text-inverse)]"
                strokeWidth={1.6}
              />
            </div>
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-display)] text-sm sm:text-base font-semibold text-[var(--color-text-inverse)] leading-none truncate color-transition">
                Faculty Logo
              </p>
              <p className="text-[11px] sm:text-xs text-[var(--color-primary-tint)] mt-1 truncate color-transition">
                Placeholder — replace with faculty crest
              </p>
            </div>
          </div>

          {/* Login button */}
          <button
            type="button"
            className="shrink-0 inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full border border-[var(--color-text-inverse)] text-[var(--color-text-inverse)] text-sm font-medium hover:bg-[var(--color-text-inverse)] hover:text-[var(--color-primary)] color-transition cursor-pointer"
          >
            <LogIn className="w-4 h-4" strokeWidth={1.8} />
            <span>Login</span>
          </button>
        </div>
      </header>

      {/* ---------------- Main content ---------------- */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="mb-8 sm:mb-10 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-medium text-[var(--color-text-primary)]">
              Welcome to FLCMS
            </h1>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)] max-w-xl mx-auto sm:mx-0">
              Faculty Laboratory Chemical Management System — an overview of
              your labs, storage, and safety status at a glance.
            </p>
          </div>

          {/* Placeholder grid — 2 rows x 4 cols, real cards to be added later */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
            {placeholderSlots.map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] rounded-[var(--radius-md)] border-2 border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] flex flex-col items-center justify-center gap-2 text-[var(--color-text-muted)]"
              >
                <Boxes className="w-6 h-6" strokeWidth={1.5} />
                <span className="text-xs font-medium">Component</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ---------------- Footer ---------------- */}
      <footer className="w-full border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-xs text-[var(--color-text-muted)]">
            © 2026 FLCMS · Faculty Laboratory Chemical Management System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
