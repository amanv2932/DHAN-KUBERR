const FinanceState = require("../model/FinanceState");
const mongoose = require("mongoose");
const runtimeStore = require("../store");

const isValidNumber = (value) => typeof value === "number" && Number.isFinite(value) && value >= 0;
const usingDatabase = () => mongoose.connection.readyState === 1;

async function getFinancePayload(userId) {
  if (!usingDatabase()) {
    runtimeStore.reload();
    return runtimeStore.getFinance(userId);
  }

  let financeState = await FinanceState.findOne({ userId });

  if (!financeState) {
    financeState = await FinanceState.create({
      userId,
      ...runtimeStore.defaultFinance(),
    });
  }

  return {
    income: financeState.income,
    expenses: financeState.expenses,
    savings: financeState.savings,
  };
}

exports.getFinance = async (req, res) => {
  try {
    return res.json(await getFinancePayload(req.userId));
  } catch (error) {
    console.error("Finance fetch error:", error);
    return res.status(500).json({ message: "Unable to fetch finance data." });
  }
};

exports.updateFinance = async (req, res) => {
  try {
    const { income, expenses, savings } = req.body;

    if (![income, expenses, savings].every(isValidNumber)) {
      return res.status(400).json({ message: "Income, expenses, and savings must be valid non-negative numbers." });
    }

    if (!usingDatabase()) {
      runtimeStore.reload();
      runtimeStore.setFinance(req.userId, { income, expenses, savings });
      runtimeStore.save();

      return res.json({
        message: "Finance data updated",
        finance: runtimeStore.getFinance(req.userId),
      });
    }

    let financeState = await FinanceState.findOne({ userId: req.userId });

    if (!financeState) {
      financeState = await FinanceState.create({ userId: req.userId, income, expenses, savings });
    } else {
      financeState.income = income;
      financeState.expenses = expenses;
      financeState.savings = savings;
      await financeState.save();
    }

    return res.json({
      message: "Finance data updated",
      finance: {
        income: financeState.income,
        expenses: financeState.expenses,
        savings: financeState.savings,
      },
    });
  } catch (error) {
    console.error("Finance update error:", error);
    return res.status(500).json({ message: "Unable to update finance data." });
  }
};
