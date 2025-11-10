import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// or "gemini-1.5-pro" if you later want more reasoning power

app.post("/api/insight", async (req, res) => {
    const { origin, destination } = req.body;
    try {
        const prompt = `
      Create a short, vivid, travel summary for a flight from ${origin} to ${destination}.
      Mention aviation efficiency or sustainability in one line, connecting to Rolls-Royce’s innovation themes.
    `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        res.json({ summary: text });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Gemini generation failed" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));