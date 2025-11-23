import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

import optimizeRouter from "./routes/optimize.js";

const app = express();

app.use(cors());
app.use(express.json());

// Mount optimizer route
app.use("/api", optimizeRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));