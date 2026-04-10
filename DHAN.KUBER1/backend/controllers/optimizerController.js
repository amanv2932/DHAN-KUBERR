const { optimizeAllocation } = require("../utils/analysis");

exports.optimizeMoney = (req, res) => {
  try {
    const { income, expenses } = req.body;

    if (
      typeof income !== "number" ||
      typeof expenses !== "number" ||
      !Number.isFinite(income) ||
      !Number.isFinite(expenses) ||
      income < 0 ||
      expenses < 0
    ) {
      return res.status(400).json({ message: "Income and expenses must be valid non-negative numbers." });
    }

    return res.json(optimizeAllocation(income, expenses));
  } catch (error) {
    console.error("Optimizer error:", error);
    return res.status(500).json({ message: "Unable to optimize money right now." });
  }
};
