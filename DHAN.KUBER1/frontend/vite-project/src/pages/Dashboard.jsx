import AppLayout from "../layout/AppLayout";
import { Pie, Bar } from "react-chartjs-2";
import { useEffect, useMemo, useState } from "react";
import { FiActivity, FiArrowUpRight, FiBriefcase, FiDollarSign, FiShield } from "react-icons/fi";
import { apiRequest } from "../lib/api";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const cardMeta = [
  { label: "Account Balance", key: "savings", icon: FiBriefcase, tone: "from-emerald-200 to-teal-100" },
  { label: "Monthly Income", key: "income", icon: FiDollarSign, tone: "from-cyan-200 to-sky-100" },
  { label: "Monthly Expenses", key: "expenses", icon: FiArrowUpRight, tone: "from-amber-200 to-orange-100" },
  { label: "Financial Health", key: "health", icon: FiActivity, tone: "from-violet-200 to-fuchsia-100" },
];
const initialFinance = { income: "", expenses: "", savings: "" };

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [finance, setFinance] = useState({ income: 0, expenses: 0, savings: 0 });
  const [financeForm, setFinanceForm] = useState(initialFinance);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savingFinance, setSavingFinance] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const [financeData, transactionData] = await Promise.all([apiRequest("/finance"), apiRequest("/transactions")]);
        setFinance(financeData);
        setFinanceForm({
          income: String(financeData.income ?? ""),
          expenses: String(financeData.expenses ?? ""),
          savings: String(financeData.savings ?? ""),
        });
        setTransactions(transactionData);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  async function addTransaction() {
    if (!date || !category.trim() || !amount) {
      setError("Please complete all transaction fields.");
      return;
    }

    if (Number(amount) <= 0) {
      setError("Transaction amount must be greater than zero.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await apiRequest("/transactions", {
        method: "POST",
        body: JSON.stringify({ date, type: category.trim(), amount: Number(amount) }),
      });

      setTransactions(response.transactions);
      setDate("");
      setCategory("");
      setAmount("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function saveFinanceSnapshot() {
    const nextFinance = {
      income: Number(financeForm.income),
      expenses: Number(financeForm.expenses),
      savings: Number(financeForm.savings),
    };

    if (Object.values(nextFinance).some((value) => !Number.isFinite(value) || value < 0)) {
      setError("Finance values must be valid non-negative numbers.");
      return;
    }

    setSavingFinance(true);
    setError("");

    try {
      const response = await apiRequest("/finance", {
        method: "POST",
        body: JSON.stringify(nextFinance),
      });

      setFinance(response.finance);
      setFinanceForm({
        income: String(response.finance.income),
        expenses: String(response.finance.expenses),
        savings: String(response.finance.savings),
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSavingFinance(false);
    }
  }

  function calculateHealthScore(income, expenses, savings) {
    if (!income || income <= 0) {
      return 0;
    }

    let score = 0;
    const savingsRate = savings / income;
    const spendingRatio = expenses / income;

    if (savingsRate >= 0.3) score += 40;
    else if (savingsRate >= 0.2) score += 30;
    else if (savingsRate >= 0.1) score += 20;
    else score += 10;

    if (spendingRatio <= 0.5) score += 30;
    else if (spendingRatio <= 0.7) score += 20;
    else score += 10;

    if (savings >= income * 3) score += 30;
    else if (savings >= income * 2) score += 20;
    else score += 10;

    return score;
  }

  const healthScore = calculateHealthScore(finance.income, finance.expenses, finance.savings);
  const totalSpent = transactions.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const cardValues = {
    savings: formatCurrency(finance.savings),
    income: formatCurrency(finance.income),
    expenses: formatCurrency(finance.expenses),
    health: `${healthScore}/100`,
  };

  const pieData = useMemo(() => {
    const grouped = transactions.reduce((accumulator, transaction) => {
      const key = transaction.type || "Other";
      accumulator[key] = (accumulator[key] || 0) + Number(transaction.amount || 0);
      return accumulator;
    }, {});

    const labels = Object.keys(grouped);
    const values = Object.values(grouped);

    return {
      labels: labels.length ? labels : ["No data"],
      datasets: [
        {
          data: values.length ? values : [1],
          backgroundColor: ["#0f766e", "#2563eb", "#f59e0b", "#ef4444", "#7c3aed", "#0891b2"],
          borderWidth: 0,
        },
      ],
    };
  }, [transactions]);

  const barData = useMemo(
    () => ({
      labels: transactions.length ? transactions.map((transaction) => transaction.date) : ["No data"],
      datasets: [
        {
          label: "Spending",
          data: transactions.length ? transactions.map((transaction) => Number(transaction.amount || 0)) : [0],
          backgroundColor: "#0f172a",
          borderRadius: 999,
        },
      ],
    }),
    [transactions]
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {error && <p className="rounded-[1.6rem] bg-red-50 px-5 py-4 text-sm text-red-700 shadow-sm">{error}</p>}
        {loading && <p className="rounded-[1.6rem] bg-blue-50 px-5 py-4 text-sm text-blue-700 shadow-sm">Loading dashboard data...</p>}

        <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="soft-card p-7">
            <p className="section-kicker">Financial Snapshot</p>
            <h3 className="mt-3 text-3xl font-black text-slate-950">Your money picture, made readable.</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              This screen is designed to give you fast signal: how much is coming in, how much is going out, and whether your reserves are keeping pace.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {cardMeta.map((item) => {
                const Icon = item.icon;

                return (
                  <article key={item.key} className={`rounded-[1.6rem] bg-gradient-to-br ${item.tone} p-5 text-slate-950 shadow-sm`}>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70">
                      <Icon size={18} />
                    </div>
                    <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">{item.label}</p>
                    <p className="mt-3 text-3xl font-black">{cardValues[item.key]}</p>
                    {item.key === "health" && (
                      <p className="mt-2 text-sm text-slate-700">
                        {healthScore > 75 ? "Excellent footing" : healthScore > 50 ? "Stable, with room to improve" : "Needs attention soon"}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          </div>

          <div className="soft-card bg-slate-950 p-7 text-white">
            <div className="flex items-center gap-3 text-emerald-300">
              <FiShield size={18} />
              <p className="text-sm font-semibold uppercase tracking-[0.24em]">Money stance</p>
            </div>
            <h3 className="mt-4 text-3xl font-black">Stay steady, not noisy.</h3>
            <p className="mt-3 text-sm leading-7 text-white/68">
              Healthy money behavior is usually boring in the best way. Consistency beats rushes, clarity beats hype, and reserves buy breathing room.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-[1.5rem] bg-white/8 p-4">
                <p className="text-sm text-white/60">Tracked transactions</p>
                <p className="mt-2 text-3xl font-black">{transactions.length}</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/8 p-4">
                <p className="text-sm text-white/60">Visible outflow</p>
                <p className="mt-2 text-3xl font-black">{formatCurrency(totalSpent)}</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/8 p-4">
                <p className="text-sm text-white/60">Savings buffer</p>
                <p className="mt-2 text-3xl font-black">{finance.income > 0 ? (finance.savings / finance.income).toFixed(1) : "0.0"}x</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <div className="soft-card p-7">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-kicker">Finance Snapshot</p>
                <h3 className="mt-2 text-3xl font-black text-slate-950">Update your core numbers</h3>
              </div>
              <p className="text-sm leading-6 text-slate-600">These values power the dashboard cards and optimizer planning.</p>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <input type="number" min="0" placeholder="Monthly Income" value={financeForm.income} onChange={(event) => setFinanceForm((current) => ({ ...current, income: event.target.value }))} className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 outline-none transition focus:border-emerald-500" />
              <input type="number" min="0" placeholder="Monthly Expenses" value={financeForm.expenses} onChange={(event) => setFinanceForm((current) => ({ ...current, expenses: event.target.value }))} className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 outline-none transition focus:border-emerald-500" />
              <input type="number" min="0" placeholder="Savings Balance" value={financeForm.savings} onChange={(event) => setFinanceForm((current) => ({ ...current, savings: event.target.value }))} className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 outline-none transition focus:border-emerald-500" />
            </div>

            <button onClick={saveFinanceSnapshot} disabled={savingFinance} className="mt-5 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 disabled:cursor-not-allowed disabled:opacity-60">
              {savingFinance ? "Saving snapshot..." : "Save finance numbers"}
            </button>
          </div>

          <div className="soft-card p-7">
            <h3 className="text-2xl font-black text-slate-950">Spending mix</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">Where your money is clustering right now across categories.</p>
            <div className="mt-6 h-[320px]">
              <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }} />
            </div>
          </div>

          <div className="soft-card p-7">
            <h3 className="text-2xl font-black text-slate-950">Transaction rhythm</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">Quick view of the amounts attached to your recent entries.</p>
            <div className="mt-6 h-[320px]">
              <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          </div>
        </section>

        <section className="soft-card p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-kicker">Manual Entry</p>
              <h3 className="mt-2 text-3xl font-black text-slate-950">Add a fresh transaction</h3>
            </div>
            <p className="text-sm leading-6 text-slate-600">Keep the list current so the charts stay honest.</p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 outline-none transition focus:border-emerald-500" />
            <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 outline-none transition focus:border-emerald-500" />
            <input type="number" min="0" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 outline-none transition focus:border-emerald-500" />
            <button onClick={addTransaction} disabled={submitting} className="rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? "Saving..." : "Add entry"}
            </button>
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Date</th>
                    <th className="px-5 py-4 font-semibold">Category</th>
                    <th className="px-5 py-4 font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((tx, index) => (
                      <tr key={`${tx.date}-${tx.type}-${index}`} className="border-t border-slate-100 text-slate-700">
                        <td className="px-5 py-4">{tx.date}</td>
                        <td className="px-5 py-4">{tx.type}</td>
                        <td className="px-5 py-4 font-semibold text-red-500">{formatCurrency(tx.amount)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-t border-slate-100 text-slate-500">
                      <td className="px-5 py-6" colSpan="3">No transactions yet. Add your first entry to start the dashboard charts.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
