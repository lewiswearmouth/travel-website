import express from "express";
import { buildOptimizerInput } from "../lib/optimizer_input.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/optimize", async (req, res) => {
    try {
        const optimizerInput = buildOptimizerInput();

        // ---- REST API Endpoint (AI Studio Compatible) ----
        const url =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
            process.env.GEMINI_API_KEY;

        // ---- Combined system + user instructions ----
        const prompt = `
You are an aviation fleet optimization consultant specializing in Rolls-Royce engines,
carbon-emission modeling, and sustainability strategy.

Your task:
1. Choose the best engine (lowest emissions among eligible engines) for each route.
2. Compute:
   - optimized total emissions
   - worst-case total emissions
   - absolute + percentage reduction
3. Identify top routes with largest savings.
4. Output ONLY strict JSON:

{
  "optimalAssignments": [...],
  "totals": {
    "optimizedTotalEmissionsKg": ...,
    "worstCaseTotalEmissionsKg": ...,
    "absoluteReductionKg": ...,
    "percentageReduction": ...
  },
    "insights": [...]
}

ROUTES:
${JSON.stringify(optimizerInput.routes, null, 2)}

ENGINES:
${JSON.stringify(optimizerInput.engines, null, 2)}

EMISSIONS TABLE:
${JSON.stringify(optimizerInput.emissionsTable, null, 2)}
`;

        // ---- REST Payload Format ----
        const payload = {
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }],
                },
            ],
        };

        // ---- Perform REST Request ----
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (data.error) {
            console.error("Gemini REST API error:", data.error);
            return res.status(400).json({ error: data.error });
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            return res.status(400).json({
                error: "Unexpected Gemini REST response format.",
                raw: data,
            });
        }

        // ---- Clean up Markdown fences like ```json ... ``` ----
        let clean = text.trim();

        if (clean.startsWith("```")) {
            const firstNewline = clean.indexOf("\n");
            const lastFence = clean.lastIndexOf("```");
            if (firstNewline !== -1 && lastFence !== -1) {
                clean = clean.slice(firstNewline + 1, lastFence).trim();
            }
        }

        // ---- Parse JSON Output ----
        let parsed;
        try {
            parsed = JSON.parse(clean);
        } catch (err) {
            console.error("Gemini returned non-JSON:", clean);
            return res.status(400).json({
                error: "Gemini output was not valid JSON.",
                raw: clean,
            });
        }

        return res.json(parsed);
    } catch (error) {
        console.error("Optimizer error:", error);
        return res.status(500).json({ error: error.message });
    }
});

export default router;