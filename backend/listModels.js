import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
    const list = await genAI.listModels();
    console.log("AVAILABLE MODELS:\n");
    for (const m of list.models) {
        console.log(m.name);
    }
}

main().catch(console.error);
