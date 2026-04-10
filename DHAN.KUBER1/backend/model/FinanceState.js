const mongoose = require("mongoose");

const FinanceStateSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    income: { type: Number, required: true, default: 0, min: 0 },
    expenses: { type: Number, required: true, default: 0, min: 0 },
    savings: { type: Number, required: true, default: 0, min: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.FinanceState || mongoose.model("FinanceState", FinanceStateSchema);
