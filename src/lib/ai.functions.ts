import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type {
  EmailResult,
  PlanResult,
  ResearchResult,
  SummaryResult,
} from "./types";

const profileSchema = z.object({
  name: z.string().default(""),
  headline: z.string().default(""),
  location: z.string().default(""),
  skills: z.string().default(""),
  experience: z.string().default(""),
  targetRoles: z.string().default(""),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        profile: profileSchema,
        purpose: z.string(),
        tone: z.string(),
        length: z.string(),
        recipient: z.string().default(""),
        context: z.string().default(""),
      })
      .parse(d),
  )
  .handler(async ({ data }): Promise<EmailResult> => {
    const { runJson } = await import("./ai-gateway.server");
    const { emailSystem, emailPrompt } = await import("./prompts");
    return runJson<EmailResult>(emailSystem, emailPrompt(data.profile, data));
  });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        profile: profileSchema,
        meta: z.string().default(""),
        transcript: z.string().min(20),
      })
      .parse(d),
  )
  .handler(async ({ data }): Promise<SummaryResult> => {
    const { runJson } = await import("./ai-gateway.server");
    const { summarySystem, summaryPrompt } = await import("./prompts");
    return runJson<SummaryResult>(
      summarySystem,
      summaryPrompt(data.profile, data.transcript, data.meta),
    );
  });

export const buildPlan = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        profile: profileSchema,
        goal: z.string().min(3),
        hoursPerDay: z.string().default("4"),
        constraints: z.string().default(""),
        leads: z.string().default(""),
      })
      .parse(d),
  )
  .handler(async ({ data }): Promise<PlanResult> => {
    const { runJson } = await import("./ai-gateway.server");
    const { plannerSystem, plannerPrompt } = await import("./prompts");
    return runJson<PlanResult>(plannerSystem, plannerPrompt(data.profile, data));
  });

export const researchCompany = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        profile: profileSchema,
        company: z.string().min(1),
        role: z.string().default(""),
        question: z.string().default(""),
      })
      .parse(d),
  )
  .handler(async ({ data }): Promise<ResearchResult> => {
    const { runJson } = await import("./ai-gateway.server");
    const { researchSystem, researchPrompt } = await import("./prompts");
    return runJson<ResearchResult>(
      researchSystem,
      researchPrompt(data.profile, data),
    );
  });
