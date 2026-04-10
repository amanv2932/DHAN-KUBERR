import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowRight, FiCheckCircle, FiShield } from "react-icons/fi";
import { apiRequest } from "../lib/api";

const initialForm = { name: "", email: "", password: "" };

const trustPoints = [
  "Protected app routes after login",
  "Server-side token signing",
  "AI tools kept off the client",
];

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const heading = useMemo(() => (mode === "login" ? "Re-enter your planning desk" : "Open your private workspace"), [mode]);

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
    setForm(nextMode === "login" ? { ...initialForm } : { ...initialForm, email: form.email });
  }

  function validateForm() {
    if (mode === "signup" && !form.name.trim()) {
      return "Please enter your full name.";
    }

    if (!form.email.trim()) {
      return "Please enter your email address.";
    }

    if (!form.password.trim()) {
      return "Please enter your password.";
    }

    if (form.password.trim().length < 6) {
      return "Password must be at least 6 characters.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationMessage = validateForm();

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const path = mode === "login" ? "/auth/login" : "/auth/signup";
      const payload =
        mode === "login"
          ? { email: form.email.trim(), password: form.password.trim() }
          : { name: form.name.trim(), email: form.email.trim(), password: form.password.trim() };
      const data = await apiRequest(path, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      localStorage.setItem("dhankuber_token", data.token);
      localStorage.setItem("dhankuber_user", JSON.stringify(data.user || null));

      const redirectPath = location.state?.from?.pathname || "/dashboard";
      navigate(redirectPath, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <section className="overflow-hidden rounded-[2.4rem] bg-slate-950 text-white shadow-[0_35px_80px_rgba(15,23,32,0.18)]">
          <div className="flex h-full flex-col justify-between px-7 py-8 sm:px-10 sm:py-10">
            <div>
              <p className="section-kicker !text-emerald-200/75">Secure Entry</p>
              <h1 className="mt-4 max-w-xl text-4xl font-black leading-tight sm:text-5xl">{heading}</h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
                This side of the product is built to feel private, premium, and reassuring. No clutter, no pressure, just a confident path into your financial workspace.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-start gap-3 rounded-2xl bg-white/6 px-4 py-4 backdrop-blur">
                  <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-300 text-slate-950">
                    <FiCheckCircle size={16} />
                  </span>
                  <div>
                    <p className="text-base font-semibold text-white">{point}</p>
                    <p className="mt-1 text-sm leading-6 text-white/62">Built so trust is visible, not implied.</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-[1.8rem] bg-gradient-to-r from-emerald-200 to-cyan-200 px-5 py-5 text-slate-950">
              <div className="flex items-center gap-3">
                <FiShield size={18} />
                <p className="text-sm font-semibold uppercase tracking-[0.24em]">Confidence layer</p>
              </div>
              <p className="mt-3 text-lg font-bold">Sign in, land in your dashboard, and keep your flow uninterrupted.</p>
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-[2.4rem] px-6 py-7 sm:px-8 sm:py-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-kicker">Account Access</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">{mode === "login" ? "Welcome back" : "Create account"}</h2>
            </div>
            <Link to="/" className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
              Home
            </Link>
          </div>

          <div className="mt-6 inline-flex rounded-full bg-slate-100 p-1.5 text-sm font-semibold">
            <button type="button" onClick={() => switchMode("login")} className={`rounded-full px-5 py-2.5 transition ${mode === "login" ? "bg-slate-950 text-white shadow-lg shadow-slate-900/15" : "text-slate-600"}`}>
              Login
            </button>
            <button type="button" onClick={() => switchMode("signup")} className={`rounded-full px-5 py-2.5 transition ${mode === "signup" ? "bg-slate-950 text-white shadow-lg shadow-slate-900/15" : "text-slate-600"}`}>
              Signup
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {mode === "signup" && (
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Full name</span>
                <input value={form.name} onChange={(event) => updateField("name", event.target.value)} className="w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3.5 outline-none transition focus:border-emerald-500" placeholder="Aman Verma" autoComplete="name" />
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
              <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} className="w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3.5 outline-none transition focus:border-emerald-500" placeholder="you@example.com" autoComplete="email" />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
              <input type="password" value={form.password} onChange={(event) => updateField("password", event.target.value)} className="w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3.5 outline-none transition focus:border-emerald-500" placeholder="At least 6 characters" autoComplete={mode === "login" ? "current-password" : "new-password"} />
            </label>

            {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Please wait..." : mode === "login" ? "Enter workspace" : "Create account"}
              {!loading && <FiArrowRight size={16} />}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
