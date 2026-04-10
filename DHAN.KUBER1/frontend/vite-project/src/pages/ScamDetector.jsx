import { useState } from "react";
import { FiAlertTriangle, FiSearch, FiShield } from "react-icons/fi";
import AppLayout from "../layout/AppLayout";
import { apiRequest } from "../lib/api";

export default function ScamDetector() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyzeMessage() {
    if (!message.trim()) {
      setError("Please paste a message to analyze.");
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/detect-scam", {
        method: "POST",
        body: JSON.stringify({ message: message.trim() }),
      });

      setResult(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  const tone =
    result?.classification === "SCAM"
      ? "bg-red-50 text-red-700"
      : result?.classification === "SUSPICIOUS"
        ? "bg-amber-50 text-amber-700"
        : "bg-emerald-50 text-emerald-700";

  return (
    <AppLayout>
      <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <section className="soft-card bg-slate-950 p-7 text-white">
          <div className="flex items-center gap-3 text-amber-300">
            <FiShield size={18} />
            <p className="text-sm font-semibold uppercase tracking-[0.24em]">ScamShield AI</p>
          </div>
          <h3 className="mt-4 text-3xl font-black">Strict scam analysis for messages, links, and payment traps.</h3>
          <p className="mt-4 text-sm leading-7 text-white/68">
            This scanner is intentionally strict. It looks for urgency, fake authority, payment pressure, suspicious links,
            guaranteed returns, and requests for OTP or card details.
          </p>

          <div className="mt-8 space-y-3 text-sm text-white/72">
            <div className="rounded-2xl bg-white/8 px-4 py-4">Guaranteed returns or money-transfer requests are treated as high risk by default.</div>
            <div className="rounded-2xl bg-white/8 px-4 py-4">If the message is unclear, the scanner prefers SUSPICIOUS instead of SAFE.</div>
            <div className="rounded-2xl bg-white/8 px-4 py-4">Paste SMS, WhatsApp text, emails, or suspicious website copy for a structured verdict.</div>
          </div>
        </section>

        <section className="soft-card p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <FiSearch size={18} />
            </span>
            <div>
              <h3 className="text-2xl font-black text-slate-950">Analyze a message</h3>
              <p className="text-sm text-slate-600">The result follows the ScamShield AI JSON model you provided.</p>
            </div>
          </div>

          <textarea
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setError("");
              setResult(null);
            }}
            rows="9"
            className="mt-6 w-full rounded-[1.8rem] border border-slate-200/80 bg-white px-5 py-5 text-sm leading-7 outline-none transition focus:border-red-400"
            placeholder="Paste suspicious SMS, email, WhatsApp message, or website text..."
          />

          {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          {result && (
            <div className={`mt-6 rounded-[1.8rem] px-5 py-5 ${tone}`}>
              <p className="text-sm font-semibold uppercase tracking-[0.22em]">Classification</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <h4 className="text-3xl font-black">{result.classification}</h4>
                <p className="text-sm font-semibold">Risk score: {result.risk_score}/100</p>
              </div>

              <p className="mt-4 text-sm leading-7">{result.explanation}</p>

              <div className="mt-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em]">Detected flags</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.detected_flags.length > 0 ? (
                    result.detected_flags.map((flag) => (
                      <span key={flag} className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]">
                        {flag.replaceAll("_", " ")}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]">
                      No flags
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-white/70 px-4 py-4 text-sm">
                <p className="font-semibold uppercase tracking-[0.16em]">Recommended action</p>
                <p className="mt-2 font-medium">{result.recommended_action}</p>
              </div>
            </div>
          )}

          <button
            onClick={analyzeMessage}
            disabled={loading}
            className="mt-6 rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Analyzing..." : "Run risk check"}
          </button>

          <div className="mt-5 rounded-[1.6rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
            Output shape:
            <div className="mt-2 font-mono text-xs leading-6 text-slate-700">
              classification, risk_score, detected_flags, explanation, recommended_action
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
