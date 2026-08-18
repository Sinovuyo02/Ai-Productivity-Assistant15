import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useAppState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, MicVocal, CalendarCheck, Telescope, Bot } from "lucide-react";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Your job-search dashboard | HireBoost" },
      {
        name: "description",
        content:
          "Track applications, tasks and interview debriefs, and keep your profile sharp so every HireBoost AI tool writes in your voice.",
      },
      { property: "og:title", content: "Your job-search dashboard | HireBoost" },
      {
        property: "og:description",
        content:
          "One workspace for applications, tasks, interview debriefs and AI coaching.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  { to: "/emails", label: "Write an email", icon: Mail },
  { to: "/interviews", label: "Debrief a meeting", icon: MicVocal },
  { to: "/planner", label: "Plan my week", icon: CalendarCheck },
  { to: "/research", label: "Research a company", icon: Telescope },
  { to: "/coach", label: "Talk to the coach", icon: Bot },
] as const;

function Dashboard() {
  const { state, hydrated, update, clearAll } = useAppState();
  const p = state.profile;
  const doneTasks = state.tasks.filter((t) => t.done).length;

  const stats = [
    { label: "Emails drafted", value: state.emails.length },
    { label: "Meetings debriefed", value: state.summaries.length },
    { label: "Tasks done", value: `${doneTasks}/${state.tasks.length}` },
  ];

  return (
    <AppShell
      title={hydrated && p.name ? `Welcome back, ${p.name.split(" ")[0]}` : "Your dashboard"}
      subtitle="Momentum beats motivation. Pick the next action and do it now."
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="bg-card/70">
            <CardContent className="p-4">
              <p className="font-display text-3xl font-bold text-primary">
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tools.map((t) => (
          <Button key={t.to} asChild variant="secondary" size="sm">
            <Link to={t.to}>
              <t.icon className="size-4" />
              {t.label}
            </Link>
          </Button>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">
            Your profile — every AI tool reads this
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Full name"
              value={p.name}
              onChange={(v) => update({ profile: { ...p, name: v } })}
              placeholder="Sinovuyo Mbeki"
            />
            <Field
              label="Headline"
              value={p.headline}
              onChange={(v) => update({ profile: { ...p, headline: v } })}
              placeholder="Retail supervisor moving into logistics"
            />
            <Field
              label="Location"
              value={p.location}
              onChange={(v) => update({ profile: { ...p, location: v } })}
              placeholder="Johannesburg, South Africa"
            />
            <Field
              label="Target roles"
              value={p.targetRoles}
              onChange={(v) => update({ profile: { ...p, targetRoles: v } })}
              placeholder="Warehouse coordinator, stock controller"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="skills">Skills</Label>
            <Textarea
              id="skills"
              rows={2}
              value={p.skills}
              onChange={(e) => update({ profile: { ...p, skills: e.target.value } })}
              placeholder="Inventory control, Excel, team scheduling, forklift licence"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="experience">Experience highlights</Label>
            <Textarea
              id="experience"
              rows={4}
              value={p.experience}
              onChange={(e) =>
                update({ profile: { ...p, experience: e.target.value } })
              }
              placeholder="2019–2024 Shoprite, shift supervisor. Ran a team of 9, cut stock losses by 12%."
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => toast.success("Profile saved on this device")}
              size="sm"
            >
              Save profile
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clearAll();
                toast.success("All HireBoost data deleted from this device");
              }}
            >
              Delete all my data
            </Button>
          </div>
        </CardContent>
      </Card>

      {state.emails.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Recent drafts</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {state.emails.slice(0, 5).map((e) => (
              <div key={e.id} className="rounded-lg bg-surface p-3">
                <p className="text-sm font-medium">{e.subject}</p>
                <p className="text-xs text-muted-foreground">{e.purpose}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
