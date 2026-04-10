function optimizeAllocation(income, expenses) {
  const idleMoney = income - expenses;

  if (idleMoney <= 0) {
    return {
      idleMoney: 0,
      emergencyFund: 0,
      fixedDeposit: 0,
      mutualFund: 0,
      message: "No idle money available",
    };
  }

  return {
    idleMoney,
    emergencyFund: Math.round(idleMoney * 0.4),
    fixedDeposit: Math.round(idleMoney * 0.35),
    mutualFund: Math.round(idleMoney * 0.25),
  };
}

const phraseRules = [
  {
    flag: "urgency",
    score: 18,
    patterns: ["urgent", "act now", "limited time", "within minutes", "verify now", "right now", "immediately"],
  },
  {
    flag: "fear_tactics",
    score: 18,
    patterns: ["account blocked", "account will be blocked", "legal action", "penalty", "suspended", "last warning"],
  },
  {
    flag: "guaranteed_returns",
    score: 35,
    patterns: [
      "guaranteed returns",
      "guaranteed return",
      "guaranteed profit",
      "double your money",
      "double money fast",
      "no risk profit",
      "risk free profit",
    ],
  },
  {
    flag: "fake_authority",
    score: 20,
    patterns: ["bank", "rbi", "government", "paytm", "customer care", "income tax", "cyber cell", "kyc"],
  },
  {
    flag: "sensitive_info_request",
    score: 30,
    patterns: ["otp", "password", "card details", "cvv", "pin", "mpin", "passcode"],
  },
  {
    flag: "money_request",
    score: 32,
    patterns: [
      "upi",
      "bank transfer",
      "send money",
      "transfer money",
      "qr code",
      "scan qr",
      "verification payment",
      "refund processing fee",
      "processing fee",
    ],
  },
  {
    flag: "suspicious_link",
    score: 24,
    patterns: ["click link to verify account", "click the link", "tap the link", "login here", "verify account here"],
  },
  {
    flag: "secrecy_request",
    score: 16,
    patterns: ["do not share this message", "keep this confidential", "do not tell anyone"],
  },
  {
    flag: "generic_greeting",
    score: 10,
    patterns: ["dear user", "dear customer", "customer", "valued user"],
  },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function hasUrl(text) {
  return /(https?:\/\/|www\.)/i.test(text);
}

function extractUrls(text) {
  return text.match(/((https?:\/\/|www\.)[^\s]+)/gi) || [];
}

function scoreUrl(url) {
  const normalized = url.toLowerCase();
  let score = 0;
  const flags = [];

  if (!normalized.startsWith("https://")) {
    score += 12;
    flags.push("suspicious_link");
  }

  if (/@|-/.test(normalized) || (normalized.match(/\./g) || []).length >= 3) {
    score += 14;
    flags.push("suspicious_link");
  }

  if (normalized.length > 45) {
    score += 10;
    flags.push("suspicious_link");
  }

  if (/paytm|rbi|bank|gov/.test(normalized) && !/\.gov\.in|paytm\.com|onlinesbi\.sbi|rbi\.org\.in/.test(normalized)) {
    score += 18;
    flags.push("fake_authority");
    flags.push("suspicious_link");
  }

  return { score, flags };
}

function detectScamRisk(message) {
  const text = String(message || "").trim();
  const normalized = text.toLowerCase();
  let score = 0;
  const detectedFlags = new Set();
  const explanations = [];

  for (const rule of phraseRules) {
    if (rule.patterns.some((pattern) => normalized.includes(pattern))) {
      score += rule.score;
      detectedFlags.add(rule.flag);
    }
  }

  if (/\bclick\b.*\blink\b.*\bverify\b.*\baccount\b/i.test(normalized)) {
    score += 30;
    detectedFlags.add("suspicious_link");
    explanations.push("The message asks you to verify an account through a link, which is a high-risk phishing pattern.");
  }

  if (/\b(fast|daily)\b.*\bprofit\b|\bprofit\b.*\bwithout risk\b/i.test(normalized)) {
    score += 28;
    detectedFlags.add("guaranteed_returns");
  }

  if (/\b(otp|password|pin|cvv)\b/i.test(normalized) && /\b(bank|paytm|account|kyc)\b/i.test(normalized)) {
    score += 24;
    detectedFlags.add("sensitive_info_request");
    detectedFlags.add("fake_authority");
  }

  if ((detectedFlags.has("urgency") && detectedFlags.has("fear_tactics")) || (detectedFlags.has("urgency") && detectedFlags.has("money_request"))) {
    score += 14;
    explanations.push("The message combines pressure tactics with other scam indicators, which makes it significantly riskier.");
  }

  if (hasUrl(normalized)) {
    for (const url of extractUrls(normalized)) {
      const urlResult = scoreUrl(url);
      score += urlResult.score;

      for (const flag of urlResult.flags) {
        detectedFlags.add(flag);
      }
    }
  }

  if (/hello user|dear user|dear customer|customer\b/i.test(normalized) && /verify|update|blocked|transfer|otp/i.test(normalized)) {
    score += 12;
    detectedFlags.add("generic_greeting");
  }

  if (/\b(send money|upi|bank transfer|qr code|scan qr)\b/i.test(normalized)) {
    score = Math.max(score, 75);
  }

  if (/\bguaranteed returns?\b|\bguaranteed profit\b|\bdouble your money\b|\bdouble money fast\b/i.test(normalized)) {
    score = Math.max(score, 75);
  }

  if (score === 0 && /\bfree\b|\bbonus\b|\boffer\b/i.test(normalized)) {
    score = 35;
  }

  const finalScore = clamp(score, 0, 100);

  let classification = "SAFE";
  let recommendedAction = "ignore";

  if (finalScore >= 71) {
    classification = "SCAM";
    recommendedAction = "block_immediately";
  } else if (finalScore >= 31) {
    classification = "SUSPICIOUS";
    recommendedAction = "warn_user";
  }

  if (classification === "SAFE" && detectedFlags.size === 0) {
    explanations.push("No strong scam indicators were found in the provided text.");
  } else if (classification === "SUSPICIOUS") {
    explanations.push("Some scam-like patterns were found, so this should be treated with caution.");
  } else if (classification === "SCAM") {
    explanations.push("Multiple high-confidence scam indicators were detected in the message.");
  }

  return {
    classification,
    risk_score: finalScore,
    detected_flags: Array.from(detectedFlags),
    explanation: explanations[0] || "The message contains scam-related risk indicators.",
    recommended_action: recommendedAction,
  };
}

module.exports = {
  optimizeAllocation,
  detectScamRisk,
};
