const express = require("express");

const router = express.Router();

const { detectScam } = require("../controllers/scamController");

router.post("/", detectScam);

module.exports = router;