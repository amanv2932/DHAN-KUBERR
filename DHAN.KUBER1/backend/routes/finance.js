const express = require("express");

const router = express.Router();

const {
  getFinance,
  updateFinance
} = require("../controllers/financeController");

router.get("/", getFinance);

router.post("/", updateFinance);

module.exports = router;