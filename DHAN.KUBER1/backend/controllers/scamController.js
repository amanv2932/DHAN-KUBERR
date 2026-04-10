const { detectScamRisk } = require("../utils/analysis");

exports.detectScam = (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "A valid message is required." });
    }

    return res.json(detectScamRisk(message));
  } catch (error) {
    console.error("Scam detection error:", error);
    return res.status(500).json({ message: "Unable to analyze message right now." });
  }
};
