import "dotenv/config";
import { GEval, TaskCompletionMetric } from "deepeval/metrics";
import { OpenAIModel } from "deepeval/models";
import { LLMTestCase, SingleTurnParams } from "deepeval/test-case";
import { goldenDataset } from "./dataset";
import { startAgent } from "../agent/agent";
import { policy } from "../agent/sop.policy";
import { evaluate } from "deepeval";

const judge = new OpenAIModel({
  model: "gpt-5.4-mini",
  apiKey: process.env.OPENAI_TOKEN,
  temperature: 0,
});

const faithfulnessMetric = new GEval({
  name: "faithfulness",
  model: judge,
  criteria:
    "Determine whether the agent's response faithfully follows the applicable SOP advice template. The response does not need to use the exact wording, but it must preserve the template's core safety recommendation and any important weather values or thresholds provided. Do not require details that are not present in the applicable SOP. Penalize responses that omit the main recommendation, contradict the SOP, give materially weaker or unsafe advice, or introduce unsupported claims.",
  evaluationSteps: [
    "Identify the applicable SOP or SOPs from the expected output and treat their advice templates as the source of truth.",
    "Check whether the actual response addresses the user's question and includes the main action or safety recommendation from each applicable template.",
    "Check whether important facts, measurements, thresholds, and severity implied by the template are preserved accurately when they are included in the expected output.",
    "Allow concise paraphrasing, reordering, and natural wording changes when the meaning and practical recommendation remain equivalent.",
    "Penalize omissions of essential guidance, contradictions, materially weaker or unsafe recommendations, and unsupported claims that change the meaning of the SOP.",
    "Give a high score only when the response is substantively aligned with the applicable SOP advice; give a low score when it is generic, irrelevant, or materially inconsistent with it.",
  ],

  evaluationParams: [
    SingleTurnParams.INPUT,
    SingleTurnParams.ACTUAL_OUTPUT,
    SingleTurnParams.EXPECTED_OUTPUT,
  ],
  threshold: 0.7,
});
const taskCompletion = new TaskCompletionMetric({
  threshold: 0.7,
  model: judge,
});

async function startEvaluation() {
  const testCases = [];

  for (let i = 0; i < goldenDataset.length; i++) {
    const response = await startAgent(
      goldenDataset[i]!.question,
      crypto.randomUUID(),
    );

    const matchedSOPs = policy.sops
      .filter((sop) => (response.matchedSOP ?? []).includes(sop.sop_id))
      .map((sop) => ({
        sopId: sop.sop_id,
        conditionDescription: sop.condition.description,
        template: sop.advice_template,
      }));

    testCases.push(
      new LLMTestCase({
        input: goldenDataset[i]!.question,
        actualOutput: JSON.stringify({
          matchedSOP: response.matchedSOP,
          finalResponse: response.finalResponse,
        }),
        expectedOutput: JSON.stringify(matchedSOPs),
      }),
    );
  }

  const metrics = [faithfulnessMetric, taskCompletion];
  await evaluate(testCases, metrics, { asyncConfig: { maxConcurrent: 2 } });
}

startEvaluation();
