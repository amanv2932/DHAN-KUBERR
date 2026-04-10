const Transaction = require("../model/Transaction");
const mongoose = require("mongoose");
const runtimeStore = require("../store");

const usingDatabase = () => mongoose.connection.readyState === 1;

exports.getTransactions = async (req, res) => {
  try {
    if (!usingDatabase()) {
      runtimeStore.reload();
      return res.json(runtimeStore.getTransactions(req.userId));
    }

    let transactions = await Transaction.find({ userId: req.userId }).sort({ createdAt: -1 }).lean();

    if (transactions.length === 0) {
      transactions = await Transaction.insertMany(
        runtimeStore.defaultTransactions().map((transaction) => ({
          userId: req.userId,
          ...transaction,
        }))
      );
    }

    return res.json(
      transactions.map((transaction) => ({
        date: transaction.date,
        type: transaction.type,
        amount: transaction.amount,
      }))
    );
  } catch (error) {
    console.error("Transaction fetch error:", error);
    return res.status(500).json({ message: "Unable to fetch transactions right now." });
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const { date, type, amount } = req.body;
    const parsedAmount = Number(amount);

    if (!date || !type || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: "Date, category, and a valid positive amount are required." });
    }

    const newTransaction = {
      userId: req.userId,
      date: String(date).trim(),
      type: String(type).trim(),
      amount: parsedAmount,
    };

    if (!usingDatabase()) {
      runtimeStore.reload();
      runtimeStore.setTransactions(req.userId, [newTransaction, ...runtimeStore.getTransactions(req.userId)]);
      runtimeStore.save();

      return res.status(201).json({
        message: "Transaction added",
        transactions: runtimeStore.getTransactions(req.userId),
      });
    }

    await Transaction.create(newTransaction);
    const transactions = await Transaction.find({ userId: req.userId }).sort({ createdAt: -1 }).lean();

    return res.status(201).json({
      message: "Transaction added",
      transactions: transactions.map((transaction) => ({
        date: transaction.date,
        type: transaction.type,
        amount: transaction.amount,
      })),
    });
  } catch (error) {
    console.error("Transaction error:", error);
    return res.status(500).json({ message: "Unable to add transaction right now." });
  }
};
