import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { AiNotice, PromptDisclosure } from "@/components/AiNotice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { buildPlan } from "@/lib/ai.functions";
import { plannerSystem } from "@/lib/prompts";
import { useAppState, uid } from "@/lib/store";
import type { TaskItem } from "@/lib/store";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI job-search week planner | HireBoost" },
      {
        name: "description",
        content:
          "Turn your goal and the hours you actually have into a time-blocked week of applications, outreach and skill building.",
      },
      { property: "og:title", content: "AI job-search week planner | HireBoost" },
      {
        property: "og:description",
        content:
          "A realistic, time-blocked job-search week you can actually finish.",
      },
    ],
  }),
  component: Planner,
});

const bucketColor: Record<string, string> = {
  apply: "bg-primary/15 text-primary",
  outreach: "bg-accent/15 text-accent",
  skill: "bg-chart-3/15 text-chart-3",
  admin: "bg-muted text-muted-foreground",
  rest: "bg-chart-4/15 text-chart-4",
};

function Planner() {
  const { state, update } = useAppState();
  const [goal, setGoal] = useState("Get 3 interviews in the next 4 weeks");
  const [hoursPerDay, setHoursPerDay] = useState("4");
  const [constraints, setConstraints] = useState("");
  const [leads, setLeads] = useState("");
  const [loading, setLoading] = useState(false);

  const plan = state.plan;
  const tasks = state.tasks;
  const done = tasks.filter((t) => t.done).length;

  async function run() {
    setLoading(true);
    try {
      const res = await buildPlan({
        data: { profile: state.profile, goal, hoursPerDay, constraints, leads },
      });
      const flat: TaskItem[] = res.days.flatMap((d) =>
        (d.tasks ?? []).map((t) => ({
          id: uid(),
          title: t.title,
          minutes: t.minutes,
          bucket: t.bucket,
          day: d.day,
          done: false,
        })),
      );
      update({ plan: res, tasks: flat });
      toast.success("Your week is planned");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not build the plan");
    } finally {
      setLoading(false);
    }
  }

  function toggle(id: string) {
    update({
      tasks: tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    });
  }

  return (
    <AppShell
      title="AI task planner"
      subtitle="A week you can actually finish, built around the hours you really have."
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Plan my week</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
            <div className="grid gap-2">
              <Label>Goal</Label>
              <Input value={goal} onChange={(e) => setGoal(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Hours available per day</Label>
              <Input
                type="number"
                min="1"
                max="12"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Constraints</Label>
              <Textarea
                rows={3}
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="School run 7–8am, limited data, no laptop on Fridays"
              />
            </div>
            <div className="grid gap-2">
              <Label>Live leads / applications in flight</Label>
              <Textarea
                rows={3}
                value={leads}
                onChange={(e) => setLeads(e.target.value)}
                placeholder="DSV interview Thursday, 2 applications waiting on replies"
              />
            </div>
          </div>
          <Button onClick={run} disabled={loading} className="justify-self-start">
            {loading ? "Planning…" : plan ? "Re-plan the week" : "Build my week"}
          </Button>
          <PromptDisclosure system={plannerSystem} />
        </CardContent>
      </Card>

      {plan && (
        <div className="mt-6 grid gap-4">
          <AiNotice>
            An AI-suggested schedule, not a rule. Move anything that does not fit
            your real life.
          </AiNotice>
          <Card>
            <CardContent className="grid gap-3 p-5">
              <p className="text-sm text-muted-foreground">{plan.strategy}</p>
              <div className="flex flex-wrap gap-2">
                {plan.metrics?.map((m, i) => (
                  <Badge key={i} variant="secondary">
                    {m}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {done} of {tasks.length} tasks done this week
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-3 md:grid-cols-2">
            {plan.days?.map((d) => (
              <Card key={d.day}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{d.day}</CardTitle>
                  <p className="text-xs text-muted-foreground">{d.focus}</p>
                </CardHeader>
                <CardContent className="grid gap-2">
                  {tasks
                    .filter((t) => t.day === d.day)
                    .map((t) => (
                      <label
                        key={t.id}
                        className="flex cursor-pointer items-start gap-3 rounded-lg bg-surface p-3 text-sm"
                      >
                        <Checkbox
                          checked={t.done}
                          onCheckedChange={() => toggle(t.id)}
                          className="mt-0.5"
                        />
                        <span className="flex-1">
                          <span className={t.done ? "line-through opacity-60" : ""}>
                            {t.title}
                          </span>
                          <span className="mt-1 flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${bucketColor[t.bucket] ?? "bg-muted"}`}
                            >
                              {t.bucket}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {t.minutes} min
                            </span>
                          </span>
                        </span>
                      </label>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
