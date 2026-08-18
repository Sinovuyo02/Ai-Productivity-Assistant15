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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateEmail } from "@/lib/ai.functions";
import { emailSystem } from "@/lib/prompts";
import { useAppState, uid } from "@/lib/store";
import type { EmailResult } from "@/lib/types";

export const Route = createFileRoute("/emails")({
  head: () => ({
    meta: [
      { title: "Smart job email generator | HireBoost" },
      {
        name: "description",
        content:
          "Generate application, cold outreach, follow-up and thank-you emails tailored to the role and to your real experience.",
      },
      { property: "og:title", content: "Smart job email generator | HireBoost" },
      {
        property: "og:description",
        content:
          "Reply-worthy job-search emails in seconds, grounded in your own profile.",
      },
    ],
  }),
  component: Emails,
});

const purposes = [
  "Job application email",
  "Cold outreach to a hiring manager",
  "Follow-up after no reply",
  "Thank-you after an interview",
  "Reply to a salary question",
  "Ask a contact for a referral",
];

function Emails() {
  const { state, update } = useAppState();
  const [purpose, setPurpose] = useState<string>("Job application email");
  const [tone, setTone] = useState("Warm and professional");
  const [length, setLength] = useState("Short (under 150 words)");
  const [recipient, setRecipient] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailResult | null>(null);

  async function run() {
    setLoading(true);
    try {
      const res = await generateEmail({
        data: { profile: state.profile, purpose, tone, length, recipient, context },
      });
      setResult(res);
      update({
        emails: [
          { id: uid(), createdAt: Date.now(), purpose, subject: res.subject, body: res.body },
          ...state.emails,
        ].slice(0, 20),
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not generate the email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      title="Smart email generator"
      subtitle="Applications, outreach and follow-ups that sound like you."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Brief</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label>Purpose</Label>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {purposes.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Warm and professional", "Direct and confident", "Formal", "Friendly and casual"].map(
                      (t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Length</Label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Very short (under 90 words)", "Short (under 150 words)", "Medium (200–250 words)"].map(
                      (t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Recipient (optional)</Label>
              <Input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Ms Dlamini, Operations Manager at Takealot"
              />
            </div>
            <div className="grid gap-2">
              <Label>Paste the job ad or situation</Label>
              <Textarea
                rows={8}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Paste the advert, the recruiter's message, or describe what happened."
              />
            </div>
            <Button onClick={run} disabled={loading}>
              {loading ? "Writing…" : "Generate email"}
            </Button>
            <PromptDisclosure system={emailSystem} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Draft</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {!result && (
              <p className="text-sm text-muted-foreground">
                Your draft appears here. Fill in your profile on the dashboard
                first — the email is built from your real experience only.
              </p>
            )}
            {result && (
              <>
                <AiNotice />
                <div className="grid gap-2">
                  <Label>Subject</Label>
                  <Input
                    value={result.subject}
                    onChange={(e) => setResult({ ...result, subject: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Body</Label>
                  <Textarea
                    rows={16}
                    value={result.body}
                    onChange={(e) => setResult({ ...result, body: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      void navigator.clipboard.writeText(
                        `Subject: ${result.subject}\n\n${result.body}`,
                      );
                      toast.success("Copied");
                    }}
                  >
                    Copy
                  </Button>
                  <Button size="sm" variant="secondary" onClick={run} disabled={loading}>
                    Regenerate
                  </Button>
                </div>
                <p className="rounded-lg bg-surface p-3 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Why this works: </span>
                  {result.why}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
