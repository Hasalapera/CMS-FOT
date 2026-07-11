import { useState } from "react";
import {
  UserPlus,
  X,
  IdCard,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import api from "../api/axiosInstance";

const AddUsers = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    institutionalId: "",
    fullName: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const roles = ["LECTURER", "TECHNICAL_OFFICER", "ADMIN"];

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.institutionalId ||
      !form.fullName ||
      !form.email ||
      !form.password ||
      !form.role
    ) {
      setError("All fields are required.");
      return;
    }
    try {
      setLoading(true);
      const response = await api.post("/users/register", {
        institutionalId: form.institutionalId,
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      setSuccess("User created successfully.");
      setForm({
        institutionalId: "",
        fullName: "",
        email: "",
        password: "",
        role: "",
      });
      setTimeout(() => {
        setIsOpen(false);
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to create user.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-[var(--color-text-inverse)] text-sm font-medium shadow-[var(--shadow-sm)] transition-colors"
      >
        <UserPlus className="w-4 h-4" strokeWidth={1.8} />
        Add User
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[var(--color-primary-dark)]/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] border border-[var(--color-border)]">
            {/* Header */}
            <div className="sticky top-0 bg-[var(--color-surface)] flex items-start justify-between gap-4 px-6 sm:px-7 pt-6 sm:pt-7 pb-5 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 rounded-full bg-[var(--color-primary-tint)] flex items-center justify-center">
                  <UserPlus
                    className="w-5 h-5 text-[var(--color-primary)]"
                    strokeWidth={1.8}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-[var(--color-text-primary)]">
                    Add New User
                  </h2>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    Create a system account for staff or students
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={1.8} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="px-6 sm:px-7 py-6 space-y-5"
            >
              {error && (
                <div className="rounded-md bg-red-100 border border-red-300 text-red-700 px-3 py-2 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-md bg-green-100 border border-green-300 text-green-700 px-3 py-2 text-sm">
                  {success}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Institutional ID */}
                <div>
                  <label
                    htmlFor="institutionalId"
                    className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5"
                  >
                    Institutional ID
                  </label>
                  <div className="relative">
                    <IdCard
                      className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                      strokeWidth={1.8}
                    />
                    <input
                      id="institutionalId"
                      type="text"
                      placeholder="e.g. LEC001"
                      value={form.institutionalId}
                      onChange={handleChange("institutionalId")}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 focus:border-[var(--color-accent)] transition-colors"
                    />
                  </div>
                </div>

                {/* Full name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                      strokeWidth={1.8}
                    />
                    <input
                      id="fullName"
                      type="text"
                      placeholder="e.g. John Smith"
                      value={form.fullName}
                      onChange={handleChange("fullName")}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 focus:border-[var(--color-accent)] transition-colors"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                      strokeWidth={1.8}
                    />
                    <input
                      id="email"
                      type="email"
                      placeholder="john.smith@example.com"
                      value={form.email}
                      onChange={handleChange("email")}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 focus:border-[var(--color-accent)] transition-colors"
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label
                    htmlFor="role"
                    className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5"
                  >
                    Role
                  </label>
                  <div className="relative">
                    <ShieldCheck
                      className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
                      strokeWidth={1.8}
                    />
                    <select
                      id="role"
                      value={form.role}
                      onChange={handleChange("role")}
                      className="w-full appearance-none pl-10 pr-9 py-2.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 focus:border-[var(--color-accent)] transition-colors"
                    >
                      <option value="" disabled>
                        Select role
                      </option>
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {r.charAt(0) + r.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
                      strokeWidth={1.8}
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5"
                >
                  Temporary Password
                </label>
                <div className="relative">
                  <Lock
                    className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                    strokeWidth={1.8}
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="e.g. Password@123"
                    value={form.password}
                    onChange={handleChange("password")}
                    className="w-full pl-10 pr-10 py-2.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 focus:border-[var(--color-accent)] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
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
                <p className="mt-1.5 text-[11px] text-[var(--color-text-muted)]">
                  Min 8 characters, include a number and a symbol. User can
                  change it after first login.
                </p>
              </div>
              {/* Footer actions */}
              <div className="sticky bottom-0 bg-[var(--color-surface)] px-6 sm:px-7 py-5 border-t border-[var(--color-border)] flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setError("");
                    setSuccess("");
                    setForm({
                      institutionalId: "",
                      fullName: "",
                      email: "",
                      password: "",
                      role: "",
                    });
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-[var(--color-text-inverse)] text-sm font-medium shadow-[var(--shadow-sm)] transition-colors"
                >
                  <UserPlus className="w-4 h-4" strokeWidth={1.8} />
                  {loading ? "Creating..." : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddUsers;
