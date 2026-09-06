import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import type { AppStateType } from "../agent";
import { z } from "zod";
import { cityResolveSystemPrompt } from "../prompts";
import { AIMessage } from "@langchain/core/messages";

const structuredRespose = z.object({
  city: z.string().optional().describe("city name mentioned by user"),
  relevant: z
    .boolean()
    .describe("true if city was mentioned and false if not mentioned"),
});

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-flash-lite",
  maxRetries: 2,
  temperature: 0.1,
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function resolveCity(state: AppStateType) {
  try {
    const messages = [cityResolveSystemPrompt, ...(state.messages ?? [])];

    const structuredModel = model.withStructuredOutput(structuredRespose);
    const response = await structuredModel.invoke(messages);
    const resolvedCity = response.city ?? state.city;

    if (!resolvedCity) {
      return {
        relevant: false,
        finalResponse: "Please provide the city name",
        messages: [new AIMessage("Please provide the city name")],
      };
    }

    return {
      city: resolvedCity,
      relevant: true,
    };
  } catch (error) {
    console.log("error occured in resolve city", error);
    return {
      relevant: false,
      finalResponse: "Agent failed, try again later",
      messages: [new AIMessage("Agent failed to respond")],
    };
  }
}
