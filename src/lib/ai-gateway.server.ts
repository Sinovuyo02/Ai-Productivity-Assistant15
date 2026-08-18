import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { streamText } from "ai";

export const MODEL = "google/gemini-3.6-flash";

export function createLovableAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: { "Lovable-API-Key": apiKey },
  });
}

function requireKey() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured for this app (missing key).");
  return key;
}

export function gatewayModel() {
  return createLovableAiGatewayProvider(requireKey())(MODEL);
}

/** Streaming under the hood (long calls must stream), buffered for the caller. */
export async function runText(system: string, prompt: string): Promise<string> {
  const result = streamText({ model: gatewayModel(), system, prompt });
  return await result.text;
}

export function extractJson<T>(raw: string): T {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as T;
    }
    throw new Error("The AI returned an unexpected format. Please try again.");
  }
}

export async function runJson<T>(system: string, prompt: string): Promise<T> {
  return extractJson<T>(await runText(system, prompt));
}
