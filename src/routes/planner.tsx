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
import { useAppState, uid, type TaskItem } from "@/lib/store";

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
  component: Planner;
});

function Planner() {
  return null;
}
