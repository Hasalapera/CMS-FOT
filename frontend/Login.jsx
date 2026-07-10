import React, { useState } from "react";
import {
  FlaskConical,
  Landmark,
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Thermometer,
  ScanLine,
} from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const features = [
    { icon: Landmark, label: "Hierarchical location structure" },
    { icon: Thermometer, label: "Real-time Inventory Tracking" },
    { icon: ShieldCheck, label: "Full chemical audit trail" },
    { icon: ScanLine, label: "Usage analytics and Report Generation" },
  ];
  return (
    <div className="min-h-screen w-full flex bg-(--color-bg) font-(family-name:--font-body)">
      {/* ---------------- Left brand panel ---------------- */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-(--color-primary-dark)">
        {/* Hexagon watermark pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.08]"
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern
              id="hex"
              width="44"
              height="76"
              patternUnits="userSpaceOnUse"
              patternTransform="scale(1.4)"
            >
              <polygon
                points="22,0 44,12.6 44,37.9 22,50.5 0,37.9 0,12.6"
                fill="none"
                stroke="var(--color-accent-light)"
                strokeWidth="1.2"
              />
              <polygon
                points="22,25.3 44,37.9 44,63.2 22,75.8 0,63.2 0,37.9"
                fill="none"
                stroke="var(--color-accent-light)"
                strokeWidth="1.2"
              />
            </pattern>
          </defs>
          <rect width="400" height="400" fill="url(#hex)" />
        </svg>

        {/* radial glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-(--color-primary-light) opacity-30 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-(--color-accent) opacity-20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between w-full px-12 py-14 text-(--color-text-inverse)">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-(--color-accent)/20 border border-(--color-accent-light)/40 flex items-center justify-center">
              <FlaskConical
                className="w-6 h-6 text-(--color-accent-light)"
                strokeWidth={1.8}
              />
            </div>
            <div>
              <p className="font-(family-name:--font-display) text-lg font-semibold tracking-wide leading-none">
                FLCMS
              </p>
              <p className="text-xs text-(--color-text-inverse)/60 mt-1 tracking-wide">
                Faculty Laboratory Chemical Management System
              </p>
            </div>
          </div>

          {/* Hero copy */}
          <div className="max-w-sm">
            <h1 className="font-(family-name:--font-display) text-4xl leading-tight font-medium">
              Smarter labs.
              <br />
              Safer campus.
              <br />
              <span className="text-(--color-accent-light)">
                Stronger research.
              </span>
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-(--color-text-inverse)/70">
              Sign in to track every chemical, cabinet, and reading
              across your department — in one place.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-4">
            {features.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="w-8 h-8 shrink-0 rounded-md bg-white/5 border border-white/10 flex items-center justify-center">
                  <Icon
                    className="w-4 h-4 text-(--color-accent-light)"
                    strokeWidth={1.8}
                  />
                </span>
                <span className="text-sm text-(--color-text-inverse)/80">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ---------------- Right form panel ---------------- */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 py-12 relative">
        {/* Mobile-only brand header */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-full bg-(--color-primary-tint) flex items-center justify-center">
            <FlaskConical
              className="w-5 h-5 text-(--color-primary)"
              strokeWidth={1.8}
            />
          </div>
          <div>
            <p className="font-(family-name:--font-display) text-base font-semibold text-(--color-primary) leading-none">
              FLCMS
            </p>
            <p className="text-[11px] text-(--color-text-muted) mt-1">
              Chemical Management System
            </p>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <div className="bg-(--color-surface) rounded-lg shadow-(--shadow-lg) border border-(--color-border) p-8 sm:p-9">
            <h2 className="text-3xl font-(family-name:--font-display) font-semibold text-(--color-primary-dark) tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-(--color-text-secondary)">
              Sign in with your department credentials to continue.
            </p>

            <form className="mt-8 space-y-5">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-xs font-medium text-(--color-text-secondary) mb-1.5"
                >
                  Username
                </label>
                <div className="relative">
                  <User
                    className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
                    strokeWidth={1.8}
                  />
                  <input
                    id="username"
                    type="text"
                    placeholder="e.g. adavis"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-sm border border-(--color-border) bg-(--color-surface) text-sm text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:ring-2 focus:ring-(--color-accent)/40 focus:border-(--color-accent) transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-(--color-text-secondary)"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs font-medium text-(--color-accent-dark) hover:text-(--color-accent)"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock
                    className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
                    strokeWidth={1.8}
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-sm border border-(--color-border) bg-(--color-surface) text-sm text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:ring-2 focus:ring-(--color-accent)/40 focus:border-(--color-accent) transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-(--color-text-muted) hover:text-(--color-text-secondary)"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" strokeWidth={1.8} />
                    ) : (
                      <Eye className="w-4 h-4" strokeWidth={1.8} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-(--color-border-strong) text-(--color-primary) focus:ring-(--color-accent)/40"
                />
                <span className="text-xs text-(--color-text-secondary)">
                  Keep me signed in on this device
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-2.5 rounded-sm bg-(--color-primary) hover:bg-(--color-primary-light) text-(--color-text-inverse) text-sm font-medium shadow-(--shadow-sm) transition-colors"
              >
                Sign in
              </button>
            </form>

            <div className="mt-7 pt-5 border-t border-(--color-border) flex items-center gap-2 justify-center">
              <ShieldCheck
                className="w-3.5 h-3.5 text-(--color-text-muted)"
                strokeWidth={1.8}
              />
              <p className="text-[11px] text-(--color-text-muted)">
                Access is restricted to authorized department staff
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-(--color-text-muted) mt-6">
            © {new Date().getFullYear()} FLCMS · Faculty Laboratory Chemical
            Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
