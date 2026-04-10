import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiBell, FiLogOut, FiSearch, FiZap } from "react-icons/fi";

const pageMeta = {
  "/dashboard": { title: "Money command center", subtitle: "Read the health of your finances at a glance, then act quickly." },
  "/chat": { title: "AI financial coach", subtitle: "Ask practical questions and turn uncertainty into next steps." },
  "/scam": { title: "Scam shield", subtitle: "Pressure-test risky messages before they pressure you." },
  "/optimizer": { title: "Allocation studio", subtitle: "See how idle money can be separated into safer buckets." },
  "/learning": { title: "Learning hub", subtitle: "Build sharper money instincts with short, useful lessons." },
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("dhankuber_user") || "null");
  const currentMeta = pageMeta[location.pathname] || pageMeta["/dashboard"];

  function handleLogout() {
    localStorage.removeItem("dhankuber_token");
    localStorage.removeItem("dhankuber_user");
    navigate("/auth");
  }

  return (
    <header className="px-4 pt-4 sm:px-6 lg:px-10 lg:pt-6">
      <div className="glass-panel rounded-[2rem] px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="section-kicker">{location.pathname === "/dashboard" ? "Overview" : "Workspace"}</p>
            <h2 className="mt-2 page-title">{currentMeta.title}</h2>
            <p className="mt-2 page-subtitle">{currentMeta.subtitle}</p>
          </div>

          <div className="flex flex-col gap-3 lg:min-w-[30rem] xl:items-end">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <label className="flex w-full items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-slate-500 shadow-sm sm:max-w-sm">
                <FiSearch size={16} />
                <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="Search topics, tools, or plans" />
              </label>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-slate-700 shadow-sm transition hover:bg-white"><FiBell size={17} /></button>
                <button onClick={handleLogout} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/15"><FiLogOut size={17} /></button>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-[1.5rem] bg-slate-950 px-4 py-4 text-white shadow-lg shadow-slate-900/15 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div>
                <p className="text-sm text-white/65">Signed in as</p>
                <p className="mt-1 text-base font-semibold">{user?.name || "Investor"}</p>
                <p className="text-sm text-white/65">{user?.email || "Ready to plan"}</p>
              </div>
              <Link to="/chat" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15">
                <FiZap size={15} />
                Ask AI Coach
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
