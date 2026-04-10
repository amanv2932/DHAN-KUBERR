const fs = require("fs");
const path = require("path");

const storePath = path.join(__dirname, "runtime-data.json");
const defaultTransactions = [
  { date: "2026-04-12", type: "Food", amount: 500 },
  { date: "2026-04-10", type: "Rent", amount: 15000 },
];
const defaultFinance = {
  income: 50000,
  expenses: 35000,
  savings: 120000,
};
const defaultState = {
  users: [],
  userData: {},
};

const cloneDefaultTransactions = (source = defaultTransactions) => structuredClone(source);
const cloneDefaultFinance = (source = defaultFinance) => structuredClone(source);

function loadState() {
  try {
    if (!fs.existsSync(storePath)) {
      fs.writeFileSync(storePath, JSON.stringify(defaultState, null, 2));
      return structuredClone(defaultState);
    }

    const raw = fs.readFileSync(storePath, "utf8");
    const parsed = JSON.parse(raw);
    const baseState = { ...structuredClone(defaultState), ...parsed };
    const seedTransactions = Array.isArray(parsed.transactions) && parsed.transactions.length > 0
      ? parsed.transactions
      : defaultTransactions;
    const seedFinance = parsed.finance && typeof parsed.finance === "object"
      ? { ...defaultFinance, ...parsed.finance }
      : defaultFinance;

    if (!baseState.userData || typeof baseState.userData !== "object") {
      baseState.userData = {};
    }

    baseState._seedTransactions = cloneDefaultTransactions(seedTransactions);
    baseState._seedFinance = cloneDefaultFinance(seedFinance);

    return baseState;
  } catch (error) {
    return {
      ...structuredClone(defaultState),
      _seedTransactions: cloneDefaultTransactions(),
      _seedFinance: cloneDefaultFinance(),
    };
  }
}

const runtimeStore = loadState();

runtimeStore.reload = () => {
  const nextState = loadState();
  runtimeStore.users = nextState.users;
  runtimeStore.userData = nextState.userData;
  runtimeStore._seedTransactions = nextState._seedTransactions;
  runtimeStore._seedFinance = nextState._seedFinance;
};

runtimeStore.ensureUserData = (userId) => {
  if (!runtimeStore.userData[userId]) {
    runtimeStore.userData[userId] = {
      transactions: cloneDefaultTransactions(runtimeStore._seedTransactions),
      finance: cloneDefaultFinance(runtimeStore._seedFinance),
    };
  }

  return runtimeStore.userData[userId];
};

runtimeStore.getTransactions = (userId) => runtimeStore.ensureUserData(userId).transactions;
runtimeStore.setTransactions = (userId, transactions) => {
  runtimeStore.ensureUserData(userId).transactions = transactions;
};

runtimeStore.getFinance = (userId) => runtimeStore.ensureUserData(userId).finance;
runtimeStore.setFinance = (userId, finance) => {
  runtimeStore.ensureUserData(userId).finance = finance;
};

runtimeStore.save = () => {
  fs.writeFileSync(
    storePath,
    JSON.stringify(
      {
        users: runtimeStore.users,
        userData: runtimeStore.userData,
      },
      null,
      2
    )
  );
};

runtimeStore.defaultTransactions = () => cloneDefaultTransactions(runtimeStore._seedTransactions);
runtimeStore.defaultFinance = () => cloneDefaultFinance(runtimeStore._seedFinance);

module.exports = runtimeStore;
