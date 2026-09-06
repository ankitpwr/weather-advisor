import express from "express";
import { startAgent } from "./agent/agent";
import cors from "cors";
const app = express();
app.use(cors({ origin: [process.env.CLIENT_URL!] }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.post("/api/v1/ask", async (req, res) => {
  const { query, conversationId } = req.body;

  try {
    const response = await startAgent(query, conversationId);
    return res.status(200).json({
      message: response.finalResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.get("/api/v1/health-check", async (req, res) => {
  try {
    return res.status(200).json({
      message: "up and running",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});
const port = Number(process.env.PORT) || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`up and running on port ${port}`);
});
