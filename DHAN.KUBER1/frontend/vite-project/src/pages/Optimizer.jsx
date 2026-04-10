import AppLayout from "../layout/AppLayout";
import { useEffect, useMemo, useState } from "react";
import { FiDivideCircle, FiLayers, FiShield, FiTrendingUp } from "react-icons/fi";
import { apiRequest } from "../lib/api";

export default function Optimizer() {
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasResult = useMemo(() => Boolean(result), [result]);

  useEffect(() => {
    async function loadFinanceDefaults() {
      try {
        const finance = await apiRequest("/finance");
        setIncome(String(finance.income ?? ""));
        setExpenses(String(finance.expenses ?? ""));
      } catch {
        // Keep the optimizer usable even if the finance request fails.
      }
    }

    loadFinanceDefaults();
  }, []);

  async function optimizeMoney() {
    if (income === "" || expenses === "") {
      setError("Please enter both income and expenses before optimizing.");
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/optimize", {
        method: "POST",
        body: JSON.stringify({ income: Number(income), expenses: Number(expenses) }),
      });

      setResult(data);
    } catch (requestError) {
      setError(requestError.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const buckets = [
    { label: "Emergency Fund", value: result?.emergencyFund, icon: FiShield, tone: "from-emerald-200 to-teal-100" },
    { label: "Fixed Deposit", value: result?.fixedDeposit, icon: FiLayers, tone: "from-amber-200 to-yellow-100" },
    { label: "Liquid Mutual Fund", value: result?.mutualFund, icon: FiTrendingUp, tone: "from-cyan-200 to-blue-100" },
  ];

  return (
    <AppLayout>
      <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <section className="soft-card bg-slate-950 p-7 text-white">
          <div className="flex items-center gap-3 text-emerald-300">
            <FiDivideCircle size={18} />
            <p className="text-sm font-semibold uppercase tracking-[0.24em]">Allocation Studio</p>
          </div>
          <h3 className="mt-4 text-3xl font-black">Give spare cash a job instead of a vague intention.</h3>
          <p className="mt-4 text-sm leading-7 text-white/68">This tool separates idle money into simpler buckets so you can protect short-term stability before chasing return.</p>
        </section>

        <section className="soft-card p-7">
          <h3 className="text-2xl font-black text-slate-950">Run an allocation check</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">Enter clean monthly numbers. The tool will estimate what is actually free to allocate.</p>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <input type="number" placeholder="Monthly Income" value={income} onChange={(e) => setIncome(e.target.value)} className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 outline-none transition focus:border-emerald-500" />
            <input type="number" placeholder="Monthly Expenses" value={expenses} onChange={(e) => setExpenses(e.target.value)} className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 outline-none transition focus:border-emerald-500" />
          </div>

          <button onClick={optimizeMoney} disabled={loading} className="mt-5 rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Optimizing..." : "Optimize my money"}
          </button>

          {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          {hasResult && (
            <div className="mt-6 space-y-5">
              <div className="rounded-[1.8rem] bg-slate-950 px-5 py-5 text-white">
                <p className="text-sm uppercase tracking-[0.22em] text-white/60">Idle money detected</p>
                <h4 className="mt-3 text-4xl font-black">₹{result.idleMoney}</h4>
                {result.message && <p className="mt-3 text-sm leading-6 text-white/65">{result.message}</p>}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {buckets.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.label} className={`rounded-[1.6rem] bg-gradient-to-br ${item.tone} p-5 text-slate-950 shadow-sm`}>
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70">
                        <Icon size={18} />
                      </span>
                      <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">{item.label}</p>
                      <h5 className="mt-3 text-3xl font-black">₹{item.value}</h5>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
