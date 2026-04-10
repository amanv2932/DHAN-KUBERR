import { NavLink } from "react-router-dom";
import { FiAlertTriangle, FiBookOpen, FiGrid, FiHome, FiMessageSquare, FiTrendingUp } from "react-icons/fi";

const links = [
  { to: "/", label: "Home", icon: FiHome },
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/chat", label: "AI Coach", icon: FiMessageSquare },
  { to: "/optimizer", label: "Optimizer", icon: FiTrendingUp },
  { to: "/scam", label: "Scam Shield", icon: FiAlertTriangle },
  { to: "/learning", label: "Learning Hub", icon: FiBookOpen },
];

export default function Sidebar() {
  return (
    <aside className="glass-panel sticky top-0 z-20 border-b border-white/70 px-4 py-4 lg:fixed lg:left-6 lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-[18rem] lg:rounded-[2rem] lg:border">
      <div className="flex items-center justify-between lg:flex-col lg:items-start lg:gap-8">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-white shadow-lg shadow-slate-900/15">DK</div>
          <div className="mt-3 hidden lg:block">
            <p className="section-kicker">Finance OS</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">Dhan.Kuber</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Calm, sharp money decisions in one place.</p>
          </div>
        </div>

        <div className="hidden rounded-2xl bg-emerald-50/80 px-4 py-3 text-sm text-emerald-900 lg:block">
          <p className="font-semibold">Today&apos;s mode</p>
          <p className="mt-1 text-emerald-800/80">Protect cashflow, avoid noise, move with clarity.</p>
        </div>
      </div>

      <nav className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:mt-8 lg:grid-cols-1">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-slate-950 text-white shadow-lg shadow-slate-900/15"
                    : "bg-white/55 text-slate-700 hover:bg-white hover:text-slate-950"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${isActive ? "bg-white/15" : "bg-slate-100 text-slate-700 group-hover:bg-slate-950 group-hover:text-white"}`}>
                    <Icon size={16} />
                  </span>
                  <span className="truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
