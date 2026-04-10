const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
