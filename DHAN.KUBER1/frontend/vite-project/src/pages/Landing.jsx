import { Link } from "react-router-dom";
import { FaRobot, FaShieldAlt, FaChartLine } from "react-icons/fa";
import { FiArrowRight, FiLayers, FiShield, FiTrendingUp } from "react-icons/fi";

const pillars = [
  {
    icon: FaRobot,
    title: "AI Financial Coach",
    text: "Get plain-language guidance for daily money questions without the usual jargon spiral.",
    accent: "text-cyan-700",
  },
  {
    icon: FaShieldAlt,
    title: "Scam Detection",
    text: "Interrogate suspicious messages fast before urgency, greed, or fear takes over.",
    accent: "text-emerald-700",
  },
  {
    icon: FaChartLine,
    title: "Money Optimizer",
    text: "Translate unused cash into clearer allocations across emergency, fixed, and liquid buckets.",
    accent: "text-amber-600",
  },
];

export default function Landing() {
  const token = localStorage.getItem("dhankuber_token");

  return (
    <div className="min-h-screen px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="glass-panel rounded-[2rem] px-6 py-5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="section-kicker">Editorial Finance Suite</p>
              <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">Dhan.Kuber</h1>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to={token ? "/dashboard" : "/auth"} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15">
                {token ? "Open Workspace" : "Sign In"}
              </Link>
              {!token && (
                <Link to="/auth" className="rounded-full border border-slate-300/80 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700">
                  Create Account
                </Link>
              )}
            </div>
          </div>
        </header>

        <section className="overflow-hidden rounded-[2.4rem] bg-slate-950 text-white shadow-[0_35px_80px_rgba(15,23,32,0.18)]">
          <div className="grid gap-10 px-6 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-14">
            <div>
              <p className="section-kicker !text-emerald-200/80">Calm money, sharper judgment</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                A finance dashboard that feels premium, clear, and built to think with you.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
                Track spending, question risky offers, and ask your AI coach for grounded financial guidance through one polished workspace.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link to={token ? "/dashboard" : "/auth"} className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-300 px-6 py-3 text-sm font-semibold text-slate-950">
                  Start managing money
                  <FiArrowRight size={16} />
                </Link>
                <Link to={token ? "/learning" : "/auth"} className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/88">
                  Explore the learning hub
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[1.8rem] bg-white/8 p-5 backdrop-blur">
                <div className="flex items-center gap-3 text-emerald-200">
                  <FiTrendingUp size={18} />
                  <span className="text-sm font-semibold uppercase tracking-[0.24em]">Signal</span>
                </div>
                <p className="mt-4 text-3xl font-black">Health-first</p>
                <p className="mt-2 text-sm leading-6 text-white/68">Know whether your savings, spending, and reserves are moving in the right direction.</p>
              </div>

              <div className="rounded-[1.8rem] bg-white/8 p-5 backdrop-blur">
                <div className="flex items-center gap-3 text-cyan-200">
                  <FiShield size={18} />
                  <span className="text-sm font-semibold uppercase tracking-[0.24em]">Protection</span>
                </div>
                <p className="mt-4 text-3xl font-black">Scam-aware</p>
                <p className="mt-2 text-sm leading-6 text-white/68">Pressure-test suspicious offers before emotions turn into expensive mistakes.</p>
              </div>

              <div className="rounded-[1.8rem] bg-gradient-to-r from-amber-200 to-emerald-200 p-5 text-slate-950 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3 text-slate-700">
                  <FiLayers size={18} />
                  <span className="text-sm font-semibold uppercase tracking-[0.24em]">Flow</span>
                </div>
                <p className="mt-4 text-3xl font-black">Built for momentum</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">From login to dashboard to action, every screen is designed to remove friction.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-3">
          {pillars.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="soft-card p-7">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950/5 ${item.accent}`}>
                  <Icon size={25} />
                </div>
                <h3 className="mt-5 text-2xl font-black text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </article>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="soft-card p-7">
            <p className="section-kicker">How it works</p>
            <h3 className="mt-3 text-3xl font-black text-slate-950">From uncertainty to action in three clean steps.</h3>
            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">01</p>
                <p className="mt-2 text-xl font-bold text-slate-900">Capture your current money picture</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">Track balances, expenses, and transaction patterns in one calm dashboard.</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">02</p>
                <p className="mt-2 text-xl font-bold text-slate-900">Interrogate risky messages and assumptions</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">Use the scam shield and AI coach to slow down bad decisions before they happen.</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">03</p>
                <p className="mt-2 text-xl font-bold text-slate-900">Allocate with more confidence</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">Turn spare cash into a simple plan that protects today and supports tomorrow.</p>
              </div>
            </div>
          </div>

          <div className="soft-card overflow-hidden p-0">
            <div className="bg-gradient-to-br from-emerald-100 via-white to-cyan-100 px-7 py-8">
              <p className="section-kicker">Why people stay</p>
              <h3 className="mt-3 text-3xl font-black text-slate-950">Clearer than spreadsheets. Calmer than chaos.</h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                The experience is built to feel like a confident planning desk, not a noisy fintech toy. Large type, clear hierarchy, strong contrast, and intentional space keep attention where it matters.
              </p>
            </div>

            <div className="grid gap-px bg-slate-200/60 sm:grid-cols-3">
              <div className="bg-white/90 px-6 py-7">
                <p className="text-4xl font-black text-slate-950">3</p>
                <p className="mt-2 text-sm text-slate-600">Integrated tools working together</p>
              </div>
              <div className="bg-white/90 px-6 py-7">
                <p className="text-4xl font-black text-slate-950">1</p>
                <p className="mt-2 text-sm text-slate-600">Unified workspace for decisions</p>
              </div>
              <div className="bg-white/90 px-6 py-7">
                <p className="text-4xl font-black text-slate-950">0</p>
                <p className="mt-2 text-sm text-slate-600">Tolerance for fake confidence or vague design</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
