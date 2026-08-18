export type EmailResult = { subject: string; body: string; why: string };

export type SummaryResult = {
  summary: string;
  signals: string[];
  commitments: string[];
  actions: { task: string; owner: string; due: string }[];
  risks: string[];
  followUpEmail: string;
};

export type PlanTask = {
  title: string;
  minutes: number;
  bucket: "apply" | "outreach" | "skill" | "admin" | "rest";
  why: string;
};

export type PlanResult = {
  strategy: string;
  days: { day: string; focus: string; tasks: PlanTask[] }[];
  metrics: string[];
};

export type ResearchResult = {
  brief: string;
  talkingPoints: string[];
  likelyQuestions: { question: string; how: string }[];
  askThem: string[];
  gaps: string[];
  verify: string[];
};
