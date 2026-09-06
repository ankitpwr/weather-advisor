import type {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { HumanMessage as HumanMessageImpl } from "@langchain/core/messages";
import {
  Annotation,
  StateGraph,
  START,
  END,
  MemorySaver,
  messagesStateReducer,
} from "@langchain/langgraph";
import { queryAnalyzer } from "./core/queryAnalyzer";
import { resolveCity } from "./core/resolveCity";
import { getWeatherData } from "./core/getWeatherData";
import { finalResponse } from "./core/finalResponse";
import { sopMatching } from "./core/sopMatching";

export const AppState = Annotation.Root({
  userQuery: Annotation<string>,
  relevant: Annotation<boolean>,
  finalResponse: Annotation<string>,
  city: Annotation<string>,
  weatherData: Annotation<JSON>,
  matchedSOP: Annotation<string[]>,

  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),
});
export type AppStateType = typeof AppState.State;

const graph = new StateGraph(AppState);

graph
  .addNode("analyze_query", queryAnalyzer)
  .addNode("resolve_city", resolveCity)
  .addNode("weather_data", getWeatherData)
  .addNode("sop_matching", sopMatching)
  .addNode("final_response", finalResponse)
  .addEdge(START, "analyze_query")
  .addConditionalEdges("analyze_query", (state: AppStateType) => {
    return state.relevant ? "resolve_city" : END;
  })
  .addConditionalEdges("resolve_city", (state: AppStateType) => {
    return state.city ? "weather_data" : END;
  })
  .addConditionalEdges("weather_data", (state: AppStateType) => {
    return state.weatherData ? "sop_matching" : END;
  })
  .addConditionalEdges("sop_matching", (state: AppStateType) => {
    if (!state.matchedSOP) return END;
    else if (state.matchedSOP.length == 0) return END;
    return "final_response";
  })
  .addEdge("final_response", END);

const checkpointer = new MemorySaver();

const workflow = graph.compile({ checkpointer });

export async function startAgent(userQuery: string, sessionId: string) {
  const res = await workflow.invoke(
    {
      userQuery,

      messages: [new HumanMessageImpl(userQuery)],
    },
    { configurable: { thread_id: sessionId } },
  );

  console.log(`userquery: ${userQuery}\n relevant : ${res.relevant}\n city: ${res.city}\n weather data: ${JSON.stringify(res.weatherData)}\n
    matchedSOPs: ${JSON.stringify(res.matchedSOP)}\n finalResponse: ${res.finalResponse}`);

  return res;
}
