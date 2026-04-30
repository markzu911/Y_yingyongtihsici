import express from "express";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json({ limit: '10mb' }));

// CORS Support
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Security-Policy", "frame-ancestors *");
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

// SaaS Proxy Logic
const proxyRequest = async (req: express.Request, res: express.Response, targetPath: string) => {
  const targetUrl = `http://aibigtree.com${targetPath}`;
  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error(`SaaS Proxy Error (${targetPath}):`, error.message);
    res.status(500).json({ error: "代理转发失败", message: error.message });
  }
};

app.post("/api/tool/launch", (req, res) => proxyRequest(req, res, "/api/tool/launch"));
app.post("/api/tool/verify", (req, res) => proxyRequest(req, res, "/api/tool/verify"));
app.post("/api/tool/consume", (req, res) => proxyRequest(req, res, "/api/tool/consume"));

// Gemini Proxy Logic
app.post("/api/gemini", async (req, res) => {
  try {
    const { model, payload } = req.body;
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    const ai = new GoogleGenAI({ apiKey: key });
    // Using (ai as any).models to bypass TS error if the SDK types are out of sync with the runtime.
    const result = await (ai as any).models.generateContentStream({
      model: model || "gemini-1.5-flash",
      contents: payload.contents,
      config: payload.generationConfig || {}
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    for await (const chunk of result) {
      if (chunk.text) {
        res.write(chunk.text);
      }
    }
    res.end();
  } catch (error: any) {
    console.error("Gemini Proxy Error:", error);
    res.status(500).json({ error: "Failed to generate content", message: error.message });
  }
});

export default app;
