import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import type { AppStateType } from "../agent";
import { z } from "zod";
import { sopMatcherSystemPrompt } from "../prompts";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { policy } from "../sop.policy";

const validSopIds = policy.sops.map((s) => s.sop_id) as [string, ...string[]];
const structuredRespose = z.object({
  matchedSOP: z.array(z.enum(validSopIds)).optional(),
  isMatched: z.boolean(),
  failMessage: z.string().optional(),
});
const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-flash-lite",
  maxRetries: 2,
  temperature: 0.1,
  apiKey: process.env.GOOGLE_API_KEY,
});
export async function sopMatching(state: AppStateType) {
  try {
    const messages = [
      sopMatcherSystemPrompt,
      new HumanMessage(`SOP's are : \n ${JSON.stringify(policy)}`),
      new HumanMessage(
        `userQuery: ${state.userQuery}\n weather data: ${JSON.stringify(state.weatherData)}`,
      ),
    ];

    const structuredModel = model.withStructuredOutput(structuredRespose);
    const response = await structuredModel.invoke(messages);

    if (!response.isMatched) {
      const failMessage = response.failMessage ?? "No matching SOP found.";
      return {
        finalResponse: failMessage,
        messages: [new AIMessage(failMessage)],
      };
    }

    return {
      matchedSOP: response.matchedSOP,
    };
  } catch (error) {
    console.log("error occured in sop matching data", error);
    return { finalResponse: "agent failed, Try again!" };
  }
}
