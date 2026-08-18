import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AiNotice, PromptDisclosure } from "@/components/AiNotice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { researchCompany } from "@/lib/ai.functions";
import { researchSystem } from "@/lib/prompts";
import { useAppState } from "@/lib/store";
import type { ResearchResult } from "@/lib/types";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI interview research assistant | HireBoost" },
      {
        name: "description",
        content:
          "Prepare for any company and role: talking points, likely questions, honest skill gaps and a checklist of facts to verify yourself.",
      },
      { property: "og:title", content: "AI interview research assistant | HireBoost" },
      {
        property: "og:description",
        content:
          "Walk into the interview knowing the company, the questions and your gaps.",
      },
    ],
  }),
  component: Research,
});

function Research() {
  const { state } = useAppState();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);

  async function run() {
    if (!company.trim()) {
      toast.error("Enter a company first");
      return;
    }
    setLoading(true);
    try {
      setResult(
        await researchCompany({
          data: { profile: state.profile, company, role, question },
        }),
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not run the research");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      title="AI research assistant"
      subtitle="Know the company, the questions and your own gaps before you walk in."
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">What are you preparing for?</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Company</Label>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Takealot"
              />
            </div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <Input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Warehouse coordinator"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Anything specific you want answered? (optional)</Label>
            <Textarea
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="How do I explain a two-year gap in my CV to them?"
            />
          </div>
          <Button onClick={run} disabled={loading} className="justify-self-start">
            {loading ? "Researching…" : "Prepare me"}
          </Button>
          <PromptDisclosure system={researchSystem} />
        </CardContent>
      </Card>

      {result && (
        <div className="mt-6 grid gap-4">
          <AiNotice>
            HireBoost has no live internet access. This brief is AI background
            knowledge — confirm anything time-sensitive using the verify list
            below.
          </AiNotice>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Brief</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
              <p className="text-muted-foreground">{result.brief}</p>
              <Bullets title="Talking points" items={result.talkingPoints} />
              <div>
                <p className="mb-2 text-xs font-semibold uppercase">
                  Likely questions
                </p>
                <div className="grid gap-2">
                  {result.likelyQuestions?.map((q, i) => (
                    <div key={i} className="rounded-lg bg-surface p-3">
                      <p className="font-medium">{q.question}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{q.how}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Bullets title="Questions to ask them" items={result.askThem} />
              <Bullets title="Your gaps and how to handle them" items={result.gaps} />
            </CardContent>
          </Card>
          {result.verify?.length > 0 && (
            <Card className="border-primary/40">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="size-4 text-primary" />
                  Verify these yourself
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Bullets items={result.verify} />
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </AppShell>
  );
}

function Bullets({ title, items }: { title?: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      {title && <p className="mb-2 text-xs font-semibold uppercase">{title}</p>}
      <ul className="grid gap-1.5 text-sm text-muted-foreground">
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
