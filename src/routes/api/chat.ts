import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import { gatewayModel } from "@/lib/ai-gateway.server";
import { coachSystem, emptyProfile, type Profile } from "@/lib/prompts";

type Body = {
  messages?: { role: "user" | "assistant"; content: string }[];
  profile?: Partial<Profile>;
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as Body;
        const messages = body.messages;
        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response("Messages are required", { status: 400 });
        }
        if (!process.env["LOVABLE_API_KEY"]) {
          return new Response("AI is not configured for this app.", {
            status: 500,
          });
        }

        try {
          const result = streamText({
            model: gatewayModel(),
            system: coachSystem({ ...emptyProfile, ...(body.profile ?? {}) }),
            messages: messages.slice(-20).map((m) => ({
              role: m.role,
              content: m.content,
            })),
          });
          return result.toTextStreamResponse();
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "AI request failed";
          const status = /429/.test(message)
            ? 429
            : /402/.test(message)
              ? 402
              : 500;
          return new Response(message, { status });
        }
      },
    },
  },
});
