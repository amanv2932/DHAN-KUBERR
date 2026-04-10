const express = require("express");

const router = express.Router();

const { optimizeMoney } = require("../controllers/optimizerController");

router.post("/", optimizeMoney);

module.exports = router;