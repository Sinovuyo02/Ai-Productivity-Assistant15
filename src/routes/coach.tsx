import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PromptDisclosure } from "@/components/AiNotice";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { coachSystem } from "@/lib/prompts";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/coach")({
  head: () => ({
    meta: [
      { title: "Boost — your AI job-search coach | HireBoost" },
      {
        name: "description",
        content:
          "Chat with an AI career coach for mock interviews, CV feedback and the single next action that moves your job search forward today.",
      },
      { property: "og:title", content: "Boost — your AI job-search coach | HireBoost" },
      {
        property: "og:description",
        content: "Practical, honest job-search coaching, available any hour.",
      },
    ],
  }),
  component: Coach,
});

type Msg = { role: "user" | "assistant"; content: string };

const quick = [
  "Run a mock interview for a warehouse job",
  "How do I explain a 2-year employment gap?",
  "Rewrite this CV bullet to sound stronger",
  "I've had 30 rejections. What do I change?",
];

function Coach() {
  const { state } = useAppState();
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "**I'm Boost, your job-search coach.**\n\nTell me where you're stuck — a rejection, a gap in your CV, an interview tomorrow — and I'll give you the next concrete step.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, profile: state.profile }),
      });
      if (!res.ok || !res.body) {
        const detail = await res.text();
        throw new Error(
          res.status === 429
            ? "The coach is busy right now — try again in a moment."
            : res.status === 402
              ? "AI credits for this app have run out."
              : detail || "The coach could not reply.",
        );
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: acc }]);
      }
    } catch (e) {
      setMessages(next);
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell
      title="Coach chat"
      subtitle="Boost knows your profile — ask anything about your job search."
    >
      <div className="flex h-[calc(100vh-13rem)] flex-col rounded-xl border border-border bg-card/60">
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                    : "max-w-[85%] rounded-2xl rounded-bl-sm bg-surface px-4 py-2.5 text-sm"
                }
              >
                {m.role === "assistant" ? (
                  <div className="prose prose-sm prose-invert max-w-none prose-p:my-2 prose-ul:my-2">
                    <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border p-3">
          <div className="mb-2 flex gap-2 overflow-x-auto">
            {quick.map((q) => (
              <button
                key={q}
                onClick={() => void send(q)}
                disabled={busy}
                className="shrink-0 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {q}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-2">
            <Textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              placeholder="Ask Boost anything about getting hired…"
              className="resize-none"
            />
            <Button onClick={() => void send(input)} disabled={busy} size="icon">
              <Send className="size-4" />
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Boost is an AI, not a recruiter or a therapist. It can't apply for
            jobs or see live listings, and it can be wrong.
          </p>
        </div>
      </div>
      <PromptDisclosure system={coachSystem(state.profile)} />
    </AppShell>
  );
}
