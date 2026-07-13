import React, { useState } from "react";
import { Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import api from "../api/axiosInstance";

const PasswordReset = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!currentPassword || !newPassword) {
      setError("Both current and new passwords are required.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }
    try {
      setLoading(true);
      await api.post("/users/reset-password", {
        currentPassword,
        newPassword,
      });
      setSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "Password update failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] border border-[var(--color-border)] p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 shrink-0 rounded-full bg-[var(--color-primary-tint)] flex items-center justify-center">
            <KeyRound
              className="w-5 h-5 text-[var(--color-primary)]"
              strokeWidth={1.8}
            />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-[family-name:var(--font-display)] font-semibold text-[var(--color-text-primary)]">
              Change Password
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Enter your current password to set a new one
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

          {success && (
            <div className="text-green-600 text-sm mb-4">{success}</div>
          )}
          {/* Current password */}
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5"
            >
              Current Password
            </label>
            <div className="relative">
              <Lock
                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                strokeWidth={1.8}
              />
              <input
                id="currentPassword"
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 focus:border-[var(--color-accent)] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                aria-label={showCurrent ? "Hide password" : "Show password"}
              >
                {showCurrent ? (
                  <EyeOff className="w-4 h-4" strokeWidth={1.8} />
                ) : (
                  <Eye className="w-4 h-4" strokeWidth={1.8} />
                )}
              </button>
            </div>
          </div>

          {/* New password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5"
            >
              New Password
            </label>
            <div className="relative">
              <Lock
                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                strokeWidth={1.8}
              />
              <input
                id="newPassword"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-10 py-2.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 focus:border-[var(--color-accent)] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? (
                  <EyeOff className="w-4 h-4" strokeWidth={1.8} />
                ) : (
                  <Eye className="w-4 h-4" strokeWidth={1.8} />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-[var(--color-text-inverse)] text-sm font-medium shadow-[var(--shadow-sm)] transition-colors"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
