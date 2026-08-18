import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { AiNotice, PromptDisclosure } from "@/components/AiNotice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { summarizeMeeting } from "@/lib/ai.functions";
import { summarySystem } from "@/lib/prompts";
import { useAppState, uid } from "@/lib/store";
import type { SummaryResult } from "@/lib/types";

export const Route = createFileRoute("/interviews")({
  head: () => ({
    meta: [
      { title: "Interview & meeting summarizer | HireBoost" },
      {
        name: "description",
        content:
          "Turn interview notes or a call transcript into a debrief: signals, commitments, follow-up actions and a ready thank-you email.",
      },
      { property: "og:title", content: "Interview & meeting summarizer | HireBoost" },
      {
        property: "og:description",
        content:
          "Never lose an interview follow-up again — AI debriefs with owners and due dates.",
      },
    ],
  }),
  component: Interviews,
});

function Interviews() {
  const { state, update } = useAppState();
  const [meta, setMeta] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SummaryResult | null>(null);

  async function run() {
    if (transcript.trim().length < 20) {
      toast.error("Paste at least a few lines of notes first");
      return;
    }
    setLoading(true);
    try {
      const res = await summarizeMeeting({
        data: { profile: state.profile, meta, transcript },
      });
      setResult(res);
      update({
        summaries: [
          { ...res, id: uid(), meta, createdAt: Date.now() },
          ...state.summaries,
        ].slice(0, 20),
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not summarize");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      title="Meeting summarizer"
      subtitle="Interviews, recruiter screens and networking calls — debriefed in seconds."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes in</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label>What was this meeting?</Label>
              <Input
                value={meta}
                onChange={(e) => setMeta(e.target.value)}
                placeholder="Second interview, Warehouse Coordinator at DSV, 2 interviewers"
              />
            </div>
            <div className="grid gap-2">
              <Label>Transcript or rough notes</Label>
              <Textarea
                rows={16}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste the transcript, or type what you remember — bullet points are fine."
              />
            </div>
            <Button onClick={run} disabled={loading}>
              {loading ? "Analysing…" : "Summarize meeting"}
            </Button>
            <PromptDisclosure system={summarySystem} />
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {!result && (
            <Card>
              <CardContent className="p-5 text-sm text-muted-foreground">
                Your debrief appears here: what was said, what was promised, what
                you must do next, and a thank-you email you can send today.
              </CardContent>
            </Card>
          )}
          {result && (
            <>
              <AiNotice>
                Generated from your notes only. If a commitment is not listed, it
                was not in the notes — check before you rely on it.
              </AiNotice>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm">
                  <p className="text-muted-foreground">{result.summary}</p>
                  <List title="Signals" items={result.signals} />
                  <List title="Commitments made" items={result.commitments} />
                  <div>
                    <p className="mb-2 text-xs font-semibold tracking-wide text-foreground uppercase">
                      Follow-up actions
                    </p>
                    <div className="grid gap-2">
                      {result.actions?.map((a, i) => (
                        <div
                          key={i}
                          className="flex flex-wrap items-center gap-2 rounded-lg bg-surface p-3"
                        >
                          <span className="flex-1 min-w-40">{a.task}</span>
                          <Badge variant="secondary">{a.owner}</Badge>
                          <Badge>{a.due}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <List title="Risks to address" items={result.risks} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Thank-you email</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <Textarea
                    rows={10}
                    value={result.followUpEmail}
                    onChange={(e) =>
                      setResult({ ...result, followUpEmail: e.target.value })
                    }
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      void navigator.clipboard.writeText(result.followUpEmail);
                      toast.success("Copied");
                    }}
                  >
                    Copy email
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function List({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold tracking-wide text-foreground uppercase">
        {title}
      </p>
      <ul className="grid gap-1.5 text-muted-foreground">
        {items.map((s, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-primary">•</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
