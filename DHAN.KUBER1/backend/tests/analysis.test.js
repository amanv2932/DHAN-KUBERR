const test = require("node:test");
const assert = require("node:assert/strict");
const { optimizeAllocation, detectScamRisk } = require("../utils/analysis");

test("optimizeAllocation splits idle money into planned buckets", () => {
  assert.deepEqual(optimizeAllocation(10000, 4000), {
    idleMoney: 6000,
    emergencyFund: 2400,
    fixedDeposit: 2100,
    mutualFund: 1500,
  });
});

test("optimizeAllocation returns zero plan when there is no idle money", () => {
  assert.deepEqual(optimizeAllocation(3000, 3000), {
    idleMoney: 0,
    emergencyFund: 0,
    fixedDeposit: 0,
    mutualFund: 0,
    message: "No idle money available",
  });
});

test("detectScamRisk marks guaranteed returns as scam", () => {
  const result = detectScamRisk("Guaranteed returns. Double your money fast with no risk profit.");
  assert.equal(result.classification, "SCAM");
  assert.ok(result.risk_score >= 75);
  assert.ok(result.detected_flags.includes("guaranteed_returns"));
  assert.equal(result.recommended_action, "block_immediately");
});

test("detectScamRisk marks OTP plus fake authority as scam", () => {
  const result = detectScamRisk("Dear customer, your bank account will be blocked. Share OTP now to verify KYC.");
  assert.equal(result.classification, "SCAM");
  assert.ok(result.detected_flags.includes("sensitive_info_request"));
  assert.ok(result.detected_flags.includes("fake_authority"));
});

test("detectScamRisk marks link-based verification as scam", () => {
  const result = detectScamRisk("Click link to verify account: http://paytm-security-alert-login.com/verify-now");
  assert.equal(result.classification, "SCAM");
  assert.ok(result.detected_flags.includes("suspicious_link"));
});

test("detectScamRisk marks soft warning cases as suspicious", () => {
  const result = detectScamRisk("Limited time offer for a forex plan. Contact customer care for details.");
  assert.equal(result.classification, "SUSPICIOUS");
  assert.ok(result.risk_score >= 31 && result.risk_score <= 70);
  assert.equal(result.recommended_action, "warn_user");
});

test("detectScamRisk keeps plain reminder messages safe", () => {
  const result = detectScamRisk("Reminder: your electricity bill is due tomorrow. Please pay using the official app.");
  assert.equal(result.classification, "SAFE");
  assert.equal(result.recommended_action, "ignore");
});
