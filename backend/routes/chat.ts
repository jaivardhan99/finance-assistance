// /backend/routes/chat.ts
import express from "express";
import { Configuration, OpenAIApi } from "openai";

const router = express.Router();
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

router.post("/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: messages,
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
