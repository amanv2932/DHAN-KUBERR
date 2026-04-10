import AppLayout from "../layout/AppLayout";
import { FiBookOpen, FiFeather, FiShield, FiTarget, FiTrendingUp } from "react-icons/fi";

const topics = [
  {
    title: "What is EMI?",
    text: "EMI stands for Equated Monthly Installment. It is the fixed amount you pay every month to repay a loan such as a home loan, car loan, or personal loan.",
    icon: FiTarget,
    accent: "from-emerald-200 to-teal-100",
  },
  {
    title: "What is Fixed Deposit?",
    text: "A Fixed Deposit (FD) is a low-risk investment where you deposit money in a bank for a fixed time and earn guaranteed interest.",
    icon: FiShield,
    accent: "from-amber-200 to-yellow-100",
  },
  {
    title: "How Mutual Funds Work",
    text: "Mutual funds pool money from many investors and invest it in stocks, bonds, or other assets managed by professional fund managers.",
    icon: FiTrendingUp,
    accent: "from-cyan-200 to-sky-100",
  },
  {
    title: "Saving Basics",
    text: "Always try to save at least 20% of your monthly income. Build an emergency fund that covers 3–6 months of expenses.",
    icon: FiFeather,
    accent: "from-violet-200 to-fuchsia-100",
  },
  {
    title: "How to Avoid Financial Scams",
    text: "Avoid schemes promising unrealistic returns. Never share OTPs, passwords, or bank details with unknown people.",
    icon: FiBookOpen,
    accent: "from-rose-200 to-orange-100",
  },
];

export default function Learning() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="soft-card p-7">
          <p className="section-kicker">Learning Library</p>
          <h2 className="mt-3 text-4xl font-black text-slate-950">Short lessons for better money instincts.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">This area is designed like an editorial reading shelf: easy to scan, calm to read, and focused on practical basics you will actually use.</p>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          {topics.map((topic) => {
            const Icon = topic.icon;

            return (
              <article key={topic.title} className="soft-card p-7">
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${topic.accent} text-slate-950`}>
                  <Icon size={21} />
                </div>
                <h3 className="mt-5 text-2xl font-black text-slate-950">{topic.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{topic.text}</p>
              </article>
            );
          })}
        </section>
      </div>
    </AppLayout>
  );
}
