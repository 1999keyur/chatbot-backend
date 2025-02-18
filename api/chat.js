const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const HUGGING_FACE_API_TOKEN = process.env.HUGGING_FACE_API_TOKEN;
const HUGGING_FACE_MODEL_URL = process.env.HUGGING_FACE_URL;

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch(HUGGING_FACE_MODEL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HUGGING_FACE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: message,
        parameters: {
          max_new_tokens: 60,
          return_full_text: false,
        },
      }),
    });

    const data = await response.json();

    const botReply =
      data?.[0]?.generated_text || "Sorry, I couldn't generate a response.";

    return res.json({ reply: botReply });
  } catch (error) {
    console.error("Hugging Face API Error:", error);
    return res.status(500).json({ error: "Error generating response." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
