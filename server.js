const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Mistral } = require("@mistralai/mistralai");

dotenv.config();
console.log("Loaded API Key:", process.env.MISTRAL_API_KEY ? "✅ Found" : "❌ Missing");

const app = express();
app.use(cors({
  origin: ["http://localhost:3000", "https://the-hari-s-portfolio.netlify.app"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "✅ Backend is working!" });
});

const portfolioData = ` ... your portfolio data ... `;

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: "No message provided" });

  try {
    console.log("Incoming message:", message);

    const response = await client.chat.complete({
      model: "mistral-medium-latest",
      messages: [
        {
          role: "user",
          content: `
You are an AI chatbot that must answer ONLY from the following portfolio data.
If the information is not explicitly present, reply with: "Not found in portfolio."

Portfolio Data:
${portfolioData}

User question: ${message}
`
        }
      ],
      temperature: 0,
      maxTokens: 1024,
      topP: 1
    });

    console.log("Mistral API response:", response);

    let reply = response.choices[0]?.message?.content || "No answer found.";
    reply = reply.replace(/\*\*(.*?)\*\*/g, '$1').replace(/`([^`]*)`/g, '$1');
    res.json({ reply });

  } catch (error) {
    console.error("🔥 Mistral API Error:", error);
    res.status(500).json({ reply: `Error: ${error.message}` });
  }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
