import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import type { AppStateType } from "../agent";
import { finalResponseSystemPrompt } from "../prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { policy } from "../sop.policy";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-flash-lite",
  maxRetries: 2,
  temperature: 0.1,
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function finalResponse(state: AppStateType) {
  try {
    const matchedRecords = (state.matchedSOP ?? [])
      .map((id) => policy.sops.find((s) => s.sop_id === id))
      .filter(Boolean);

    console.log("matchedRecords ", JSON.stringify(matchedRecords));
    const messages = [
      finalResponseSystemPrompt,
      new HumanMessage(
        `userQuery: ${state.userQuery}\nweather data: ${JSON.stringify(state.weatherData)}\nmatchedSOPs: ${JSON.stringify(matchedRecords)}`,
      ),
    ];

    const response = await model.invoke(messages);

    return {
      finalResponse: response.content,
      messages: [new AIMessage(response.content as string)],
    };
  } catch (error) {
    console.log("error occured in final response data", error);
    return { finalResponse: "agent failed, Try again!" };
  }
}
