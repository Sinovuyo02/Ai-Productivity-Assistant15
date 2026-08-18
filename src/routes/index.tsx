import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  Mail,
  MicVocal,
  ShieldCheck,
  Telescope,
} from "lucide-react";
import { Logo } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HireBoost — AI that gets unemployed people hired faster" },
      {
        name: "description",
        content:
          "HireBoost turns a scattered job hunt into a system: AI emails, interview debriefs, a time-blocked weekly plan, company research and a coach that knows your profile.",
      },
      { property: "og:title", content: "HireBoost — AI that gets unemployed people hired faster" },
      {
        property: "og:description",
        content:
          "Five AI tools in one workspace: smart emails, meeting summaries, week planning, company research and coaching.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Mail,
    title: "Smart email generator",
    body: "Applications, cold outreach, follow-ups and thank-you notes written from your real experience — never invented.",
    to: "/emails",
  },
  {
    icon: MicVocal,
    title: "Meeting summarizer",
    body: "Paste interview notes and get signals, commitments, dated follow-up actions and a ready thank-you email.",
    to: "/interviews",
  },
  {
    icon: CalendarCheck,
    title: "AI task planner",
    body: "A time-blocked week that fits the hours you actually have, balanced across applying, outreach and skills.",
    to: "/planner",
  },
  {
    icon: Telescope,
    title: "Research assistant",
    body: "Company brief, likely questions, your honest gaps — plus a checklist of facts to verify yourself.",
    to: "/research",
  },
  {
    icon: Bot,
    title: "Coach chat",
    body: "Mock interviews, CV feedback and the next concrete step, at 2am when the doubt hits.",
    to: "/coach",
  },
  {
    icon: ShieldCheck,
    title: "Responsible by design",
    body: "Open prompts, anti-fabrication rules, no account, no server database, one-click delete.",
    to: "/responsible-ai",
  },
] as const;

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <Button asChild size="sm">
          <Link to="/app">Open the app</Link>
        </Button>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-10 pb-16">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" />
          Built for people who are out of work right now
        </p>
        <h1 className="mt-6 max-w-3xl font-display text-4xl leading-[1.05] font-bold sm:text-6xl">
          Unemployment isn't a talent problem.
          <br />
          <span className="text-gradient-signal">It's a systems problem.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Most job seekers send the same generic CV into a void, forget every
          follow-up, and burn out by week three. HireBoost gives you the
          operating system that employed people with networks already have —
          five AI tools that work from one profile.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/app">
              Start free — no signup <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to="/coach">Talk to the coach</Link>
          </Button>
        </div>

        <dl className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            ["3 weeks", "Average time job seekers waste on unstructured searching each month"],
            ["1 profile", "Fills every tool, so you never re-explain yourself"],
            ["0 accounts", "Your data stays in your browser and you can delete it in one click"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-border bg-card/60 p-5">
              <dt className="font-display text-2xl font-bold text-primary">{k}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          Five tools, one job: get you hired faster
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link key={f.title} to={f.to} className="group">
              <Card className="h-full transition-colors group-hover:border-primary/50">
                <CardContent className="p-5">
                  <span className="grid size-10 place-items-center rounded-lg bg-surface text-primary">
                    <f.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.body}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-2xl border border-border bg-card/60 p-8">
          <h2 className="font-display text-2xl font-bold">How a week looks</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              ["Monday", "Plan the week around the hours you really have."],
              ["Tuesday–Thursday", "Research targets, send tailored emails, apply."],
              ["After each call", "Debrief in 60 seconds, send the thank-you same day."],
              ["Friday", "Review the numbers with the coach and re-plan."],
            ].map(([k, v], i) => (
              <li key={k}>
                <span className="font-display text-sm text-primary">0{i + 1}</span>
                <p className="mt-1 font-semibold">{k}</p>
                <p className="mt-1 text-sm text-muted-foreground">{v}</p>
              </li>
            ))}
          </ol>
          <Button asChild className="mt-8">
            <Link to="/app">
              Open my dashboard <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground">
          <p>HireBoost — AI job-search productivity.</p>
          <Link to="/responsible-ai" className="hover:text-foreground">
            Responsible AI &amp; your data
          </Link>
        </div>
      </footer>
    </div>
  );
}
