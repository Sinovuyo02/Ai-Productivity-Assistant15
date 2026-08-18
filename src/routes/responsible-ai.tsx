import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { promptCatalog } from "@/lib/prompts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI at HireBoost" },
      {
        name: "description",
        content:
          "How HireBoost handles your data, prevents fabricated experience, guards against bias, and keeps you in control of every AI draft.",
      },
      { property: "og:title", content: "Responsible AI at HireBoost" },
      {
        property: "og:description",
        content:
          "Transparency on data, fabrication guardrails, bias and human control.",
      },
    ],
  }),
  component: ResponsibleAi,
});

const principles = [
  {
    title: "You are always the author",
    body: "Every output is a draft labelled as AI-generated and is fully editable before you use it. HireBoost never sends an email, applies to a job, or contacts anyone on your behalf.",
  },
  {
    title: "No invented experience",
    body: "Each prompt contains an explicit rule against inventing employers, titles, dates, qualifications or metrics. Where a fact is missing, the model must insert a visible placeholder instead of guessing. Lying on an application costs people jobs — the system is built to refuse it.",
  },
  {
    title: "Honest about what it doesn't know",
    body: "The research assistant has no live internet access, so it separates general knowledge from time-sensitive claims and gives you a 'verify this yourself' checklist with every brief.",
  },
  {
    title: "Bias awareness",
    body: "Prompts forbid referencing or inferring protected characteristics, and the coach never advises hiding or revealing them. AI writing assistance can flatten voices toward one corporate register, so tone controls and free editing are built into every tool.",
  },
  {
    title: "Data minimisation",
    body: "Your profile, drafts, debriefs and tasks are stored only in your browser's local storage — there is no HireBoost account and no server database. Text you generate with is sent to the AI model to produce that output and is not used to train it.",
  },
  {
    title: "Limits stated up front",
    body: "Boost is not a therapist, lawyer, recruiter or immigration adviser. When a conversation reaches crisis-level distress it says so plainly and points to local support services.",
  },
];

function ResponsibleAi() {
  const { clearAll } = useAppState();
  return (
    <AppShell
      title="Responsible AI"
      subtitle="What HireBoost does with your data, and where the AI stops."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {principles.map((p) => (
          <Card key={p.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{p.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {p.body}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">
            Open prompts — read exactly what we ask the model
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {Object.entries(promptCatalog).map(([key, v]) => (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger className="text-sm">{v.label}</AccordionTrigger>
                <AccordionContent>
                  <pre className="max-h-80 overflow-auto rounded-lg bg-surface p-3 text-[11px] whitespace-pre-wrap text-muted-foreground">
                    {v.system}
                  </pre>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Your control</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <p className="text-sm text-muted-foreground">
            One click erases everything HireBoost has stored on this device.
          </p>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              clearAll();
              toast.success("All HireBoost data deleted from this device");
            }}
          >
            Delete all my data
          </Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}
