import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import optimizerCachedRouter from "./routes/optimizer_cached.js";

// Load environment variables
dotenv.config();

import optimizeRouter from "./routes/optimize.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", optimizeRouter);
app.use("/api", optimizerCachedRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));