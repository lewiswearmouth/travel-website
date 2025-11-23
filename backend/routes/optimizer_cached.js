import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

router.get("/optimizer-cached", (req, res) => {
    try {
        const filePath = path.join(process.cwd(), "data", "optimized_routes.json");
        const json = fs.readFileSync(filePath, "utf-8");
        const data = JSON.parse(json);
        res.json(data);
    } catch (err) {
        console.error("Cache read error:", err);
        res.status(500).json({ error: "Failed to load cached optimizer data" });
    }
});

export default router;