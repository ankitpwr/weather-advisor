import { isZodArrayV4 } from "@langchain/core/utils/types";
import type { AppStateType } from "../agent";
import { z } from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { queryAnalyzerSystemPrompt } from "../prompts";

const structuredRespose = z.object({
  relevant: z
    .boolean()
    .describe("True if user query is relevent otherwise False"),
});

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-flash-lite",
  maxRetries: 2,
  temperature: 0.1,
  apiKey: process.env.GOOGLE_API_KEY,
});
export async function queryAnalyzer(state: AppStateType) {
  try {
    console.log("previous messages  ", state.messages);
    const messages = [
      queryAnalyzerSystemPrompt,
      new HumanMessage(
        `userQuery: ${state.userQuery}\n previous messages: ${JSON.stringify(state.messages)}`,
      ),
    ];

    const structuredModel = model.withStructuredOutput(structuredRespose);
    const response = await structuredModel.invoke(messages);

    if (!response.relevant) {
      return {
        relevant: response.relevant,
        finalResponse: "query is not relevant",
        messages: [new AIMessage("query is not relevant")],
      };
    }

    return {
      relevant: response.relevant,
    };
  } catch (error) {
    console.log("error occured in query analyzer subagent", error);
    return {
      relevant: false,
      finalResponse: "agent failed, Try again!",
      messages: [new AIMessage("Agent failed to respond")],
    };
  }
}
