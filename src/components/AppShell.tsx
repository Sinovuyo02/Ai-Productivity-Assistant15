import { Link } from "@tanstack/react-router";
import {
  Bot,
  CalendarCheck,
  LayoutDashboard,
  Mail,
  MicVocal,
  ShieldCheck,
  Telescope,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard },
  { to: "/emails", label: "Smart emails", icon: Mail },
  { to: "/interviews", label: "Meeting debrief", icon: MicVocal },
  { to: "/planner", label: "Week planner", icon: CalendarCheck },
  { to: "/research", label: "Research", icon: Telescope },
  { to: "/coach", label: "Coach chat", icon: Bot },
  { to: "/responsible-ai", label: "Responsible AI", icon: ShieldCheck },
] as const;

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid size-8 place-items-center rounded-lg bg-[image:var(--gradient-signal)] text-[oklch(0.19_0.04_60)]">
        <Zap className="size-4" strokeWidth={2.5} />
      </span>
      {!compact && (
        <span className="font-display text-lg font-bold tracking-tight">
          Hire<span className="text-primary">Boost</span>
        </span>
      )}
    </Link>
  );
}

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <div className="px-2 py-2">
          <Logo />
        </div>
        <nav className="mt-6 flex flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
              activeProps={{
                className:
                  "bg-sidebar-accent text-sidebar-foreground font-medium",
              }}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="mt-auto rounded-lg bg-surface p-3 text-xs leading-relaxed text-muted-foreground">
          Your notes stay on this device. AI drafts are suggestions — read
          before you send.
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="min-w-0">
              <div className="lg:hidden">
                <Logo />
              </div>
              <h1 className="truncate font-display text-xl font-bold sm:text-2xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-1 overflow-x-auto px-3 pb-2 lg:hidden">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="shrink-0 rounded-full px-3 py-1.5 text-xs text-muted-foreground"
                activeProps={{ className: "bg-secondary text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
