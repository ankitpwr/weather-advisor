import express from "express";
import { startAgent } from "./agent/agent";
import cors from "cors";
const app = express();
app.use(cors({ origin: [process.env.CLIENT_URL!] }));
app.use(express.json());

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

app.listen(3000, () => {
  console.log("up and running");
});

//   startAgent(
//     //   "Should I take my 7-year-old to the park this afternoon in Delhi?",
//     "how about in the evening around 5pm",
//     "123e4567-e89b-12d3-a456-426614174123",
//   );
