# HireBoost — AI job-search accelerator

An AI productivity app for unemployed job seekers: write applications faster, prep and debrief interviews, plan the week, research employers, and get coaching — in one workspace.

## Defaults I picked (you skipped the questions)

- No login required. Everything is saved in the browser so the app opens instantly for a demo or judged submission.
- App-shell layout with a sidebar: Dashboard, Emails, Interviews, Planner, Research, Coach.
- Landing/pitch section on the home page (problem, solution, responsible AI), with a clear "Open the app" entry.

## The five AI features

1. **Smart email generator** — pick a purpose (application, cold outreach, recruiter follow-up, thank-you, salary reply), paste the job ad + your background, choose tone and length, get a subject line and body. Editable, regenerate, copy.
2. **Meeting summarizer** — paste an interview/networking-call transcript or notes; returns a summary, decisions, commitments made to you, follow-up actions with owners, and a suggested thank-you email that hands off to feature 1.
3. **AI task planner / scheduler** — enter your goal ("3 offers in 8 weeks"), available hours per day, and current leads; AI produces a weekly job-search schedule of concrete time-blocked tasks. Tasks are checkable, re-plannable, and roll into the dashboard streak.
4. **AI research assistant** — research a company or role: what they do, likely interview themes, questions to ask them, skill gaps versus your profile, and talking points. Answers are labelled as AI-generated background to verify, not verified facts.
5. **AI chatbot coach** — streaming chat with job-search context (your profile + saved items), markdown rendering, and quick prompts like "mock interview me", "review this CV bullet".

Plus: a lightweight **profile** (skills, experience, target roles) that every feature reads, so output is personalised without re-pasting.

## Prompt engineering approach

Each feature has a purpose-built system prompt with: a defined role, the user's profile injected as context, explicit output structure, tone/length controls, and rules against inventing experience the user does not have. Structured features (summarizer, planner) return typed JSON so the UI renders real components, not a text blob. Prompts are visible to the user via a "See how this was prompted" disclosure — good for judging on prompt quality.

## Responsible AI

- Every generation is labelled AI-generated with a "review before sending" notice.
- Anti-fabrication instruction in every prompt: never invent employers, dates, or qualifications.
- Research output carries a "verify before relying on this" banner.
- A visible Responsible AI page: what data is sent, what is stored (locally), bias and fairness notes, and the user's right to edit or discard any output.
- No CV data leaves the browser except in the model call itself; nothing is stored on a server.

## Design

Confident, energetic career-tech look — deep ink navy base with a warm signal accent, strong typographic hierarchy, card-based dense dashboard, subtle motion on generation. Not a generic purple SaaS gradient.

## Technical notes

- TanStack Start routes: `/` (pitch + dashboard entry), `/emails`, `/interviews`, `/planner`, `/research`, `/coach`, `/responsible-ai`.
- Lovable AI (`google/gemini-3.6-flash`) via the AI SDK. Chat streams through a server route at `/api/chat`; the other four features use `createServerFn` handlers with structured output where the UI needs fields.
- Profile, saved emails, summaries, tasks and chat history persist in localStorage behind a small typed store.
- Gateway errors (rate limit, credits) surface as clear in-app messages, never as a silent fake answer.
- Semantic design tokens in `src/styles.css`; per-route SEO metadata.

## Build order

1. Design system, app shell, routes, profile store.
2. Email generator + research assistant.
3. Meeting summarizer + task planner.
4. Streaming chat coach.
5. Dashboard, landing pitch, Responsible AI page, polish.
