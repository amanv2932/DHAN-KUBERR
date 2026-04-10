const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const connectDB = require("./config/db");
const transactionsRoutes = require("./routes/transactions");
const optimizerRoutes = require("./routes/optimizer");
const scamRoutes = require("./routes/scam");
const financeRoutes = require("./routes/finance");
const authRoutes = require("./routes/auth");
const requireAuth = require("./middleware/auth");

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "http://localhost:5173,http://127.0.0.1:3001,http://localhost:3001")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const aiClient = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} is not allowed by CORS.`));
    },
  })
);
app.use(express.json({ limit: "10mb" }));

app.use("/auth", authRoutes);
app.use("/transactions", requireAuth, transactionsRoutes);
app.use("/optimize", requireAuth, optimizerRoutes);
app.use("/detect-scam", requireAuth, scamRoutes);
app.use("/finance", requireAuth, financeRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.post("/api/chat", requireAuth, async (req, res) => {
  try {
    const { message, image } = req.body || {};

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "A valid message is required." });
    }

    if (!aiClient) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured." });
    }

    if (image && (!image.data || !image.mimeType)) {
      return res.status(400).json({ error: "Uploaded image is incomplete." });
    }

    const contents = image
      ? [
          {
            text:
              `${message.trim()}\n\n` +
              "The user also uploaded an image. Use both the text and image to answer clearly.",
          },
          {
            inlineData: {
              mimeType: image.mimeType,
              data: image.data,
            },
          },
        ]
      : message.trim();

    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    const reply = response.text;

    if (!reply) {
      return res.status(502).json({ error: "AI provider returned an empty response." });
    }

    return res.json({ reply });
  } catch (error) {
    console.error("AI ERROR:", error);
    const providerMessage = error?.message || error?.error?.message;
    const statusCode = Number(error?.status) || 500;

    return res.status(statusCode >= 400 && statusCode < 600 ? statusCode : 500).json({
      error: providerMessage || "Unable to process chat request.",
    });
  }
});

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    process.exit(1);
  }
})();
