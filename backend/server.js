import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import axios from "axios";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/insight", async (req, res) => {
    const { origin, destination } = req.body;
    try {
        // Example: call AviationStack for distance/aircraft
        const distance = 7210; // TODO replace with real API call
        const prompt = `
      Write a 3-sentence poetic travel summary for a flight from ${origin} to ${destination}.
      Include one detail about sustainable aviation or Rolls-Royce efficiency.
    `;
        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{ role: "user", content: prompt }],
        });
        res.json({ summary: completion.choices[0].message.content, distance });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "AI generation failed" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
