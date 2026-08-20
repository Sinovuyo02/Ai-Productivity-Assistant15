import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  Phone,
  ArrowLeft,
  Share2,
  GraduationCap,
  Sparkles,
  Briefcase,
  Check,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Sinovuyo Mqikela — AI Student • Future Innovator • People Person" },
      {
        name: "description",
        content:
          "Professional portfolio of Sinovuyo Mqikela: a motivated, adaptable professional with experience in customer service, community support, call-centre operations and hospitality, now developing skills in Artificial Intelligence and digital technology.",
      },
      {
        property: "og:title",
        content: "Sinovuyo Mqikela — AI Student • Future Innovator • People Person",
      },
      {
        property: "og:description",
        content:
          "Professional portfolio of Sinovuyo Mqikela: a motivated, adaptable professional building a future in AI and technology.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:image",
        content: "https://sinovuyo-mqikela-ai-assistant.lovable.app/portfolio-portrait.jpg",
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:image",
        content: "https://sinovuyo-mqikela-ai-assistant.lovable.app/portfolio-portrait.jpg",
      },
    ],
  }),
  component: PortfolioPage,
});

const experience = [
  {
    title: "Hostess",
    company: "Grand Africa and Beach Cafe",
    period: "Sep 2025 – Dec 2025",
    description:
      "Welcomed and seated guests, managed reservations, and maintained a polished front-of-house experience in a fast-paced hospitality environment.",
  },
  {
    title: "Call Center Agent",
    company: "Amathuba-Collective under Youth@Work",
    period: "Nov 2024 – Sep 2025",
    description:
      "Handled inbound and outbound calls, resolved queries, captured data accurately, and built rapport with community members over the phone.",
  },
  {
    title: "Receptionist & Community Listener",
    company: "Clinic under YearBeyond",
    period: "Apr 2024 – Nov 2024",
    description:
      "Managed reception duties, listened to and directed community members, and supported clinic staff with administrative tasks.",
  },
];

const skills = [
  "Communication",
  "Customer Service",
  "Active Listening",
  "Multitasking",
  "Time Management",
  "Computer Skills",
  "Adaptability",
  "Problem Solving",
  "Teamwork",
  "Digital Literacy",
];

function PortfolioPage() {
  const [copied, setCopied] = useState(false);

  const share = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-cream text-charcoal">
      <nav className="sticky top-0 z-50 border-b border-cream-dark bg-cream/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="font-serif text-lg font-semibold text-gold-dark">S.M.</span>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-charcoal-light transition-colors hover:bg-cream-dark hover:text-charcoal"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">HireBoost</span>
            </Link>
            <button
              onClick={share}
              className="inline-flex items-center gap-1.5 rounded-md bg-gold px-4 py-2 text-sm font-medium text-gold-foreground shadow-sm transition-colors hover:bg-gold-dark"
            >
              {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
              {copied ? "Copied" : "Share"}
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-cream-dark bg-cream-warm shadow-2xl shadow-charcoal/10">
              <img
                src="/portfolio-portrait.jpg"
                alt="Formal portrait of Sinovuyo Mqikela"
                width={1024}
                height={1280}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-2 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-gold-foreground shadow-lg sm:-right-4">
              Open to opportunities
            </div>
          </div>

          <div className="text-center lg:text-left">
            <p className="font-serif text-lg text-gold-dark">Hello, I'm</p>
            <h1 className="font-serif mt-2 text-4xl font-bold tracking-tight text-charcoal sm:text-5xl">
              SINOVUYO MQIKELA
            </h1>
            <p className="mt-4 text-lg text-charcoal-light sm:text-xl">
              AI Student • Future Innovator • People Person
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 text-sm text-charcoal-muted sm:flex-row lg:justify-start">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4 text-gold" />
                Cape Town, South Africa
              </span>
              <span className="hidden sm:inline text-cream-dark">|</span>
              <a
                href="tel:0693465570"
                className="flex items-center gap-1.5 transition-colors hover:text-gold-dark"
              >
                <Phone className="size-4 text-gold" />
                069 346 5570
              </a>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <a
                href="tel:0693465570"
                className="inline-flex items-center gap-2 rounded-md bg-gold px-5 py-2.5 text-sm font-medium text-gold-foreground shadow-sm transition-colors hover:bg-gold-dark"
              >
                <Phone className="size-4" />
                Call or WhatsApp
              </a>
              <button
                onClick={share}
                className="inline-flex items-center gap-2 rounded-md border border-cream-dark bg-white px-5 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-cream-warm"
              >
                <Share2 className="size-4" />
                Share portfolio
              </button>
            </div>
          </div>
        </section>

        <section className="mt-20">
          <h2 className="font-serif text-3xl font-semibold text-charcoal sm:text-4xl">
            Professional Profile
          </h2>
          <div className="mt-6 rounded-2xl border border-cream-dark bg-white p-6 shadow-sm sm:p-8">
            <p className="text-base leading-relaxed text-charcoal-light sm:text-lg">
              A motivated, adaptable and hardworking professional with experience in customer
              service, community support, call-centre operations and hospitality. I enjoy working
              with people, solving problems, and learning new systems. Currently developing skills
              in Artificial Intelligence and digital technology, I am eager to bring my people-first
              mindset into a tech-driven career.
            </p>
          </div>
        </section>

        <section className="mt-20">
          <h2 className="font-serif text-3xl font-semibold text-charcoal sm:text-4xl">
            Work Experience
          </h2>
          <div className="mt-6 space-y-6">
            {experience.map((job) => (
              <div
                key={job.title}
                className="relative overflow-hidden rounded-2xl border border-cream-dark bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-gold" />
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-charcoal">{job.title}</h3>
                    <p className="mt-1 text-gold-dark">{job.company}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-warm px-3 py-1 text-xs font-medium text-charcoal-muted">
                    <Briefcase className="size-3.5" />
                    {job.period}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-charcoal-light sm:text-base">
                  {job.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <h2 className="font-serif text-3xl font-semibold text-charcoal sm:text-4xl">
            Education & Certificate
          </h2>
          <div className="mt-6 rounded-2xl border border-cream-dark bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-cream-warm text-gold">
                <GraduationCap className="size-6" />
              </span>
              <div>
                <h3 className="font-serif text-xl font-semibold text-charcoal">
                  National Senior Certificate (Matric)
                </h3>
                <p className="mt-1 text-charcoal-muted">Completed</p>
                <p className="mt-3 text-sm text-charcoal-light">
                  Foundation completed; now focused on building practical AI, digital and
                  workplace-ready skills.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20">
          <h2 className="font-serif text-3xl font-semibold text-charcoal sm:text-4xl">Skills</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-cream-dark bg-white px-4 py-2 text-sm font-medium text-charcoal-light shadow-sm transition-colors hover:border-gold hover:text-gold-dark"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="relative overflow-hidden rounded-2xl bg-charcoal p-8 sm:p-12">
            <div className="absolute -right-10 -top-10 size-40 rounded-full bg-gold/10 blur-3xl" />
            <div className="relative">
              <Sparkles className="size-8 text-gold" />
              <h2 className="font-serif mt-4 text-3xl font-semibold text-cream sm:text-4xl">
                Career Vision
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-cream-warm sm:text-lg">
                To grow in the fields of AI and technology while gaining practical experience and
                contributing meaningfully to every team and project I join.
              </p>
              <div className="mt-8 border-t border-charcoal-light pt-8">
                <p className="font-serif text-xl italic text-gold sm:text-2xl">
                  “Committed to learning, growing and making a difference.”
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-cream-dark bg-cream-warm py-10">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="font-serif text-lg font-semibold text-charcoal">Sinovuyo Mqikela</p>
          <p className="mt-1 text-sm text-charcoal-muted">
            AI Student • Future Innovator • People Person
          </p>
          <p className="mt-6 text-xs text-charcoal-muted">
            © {new Date().getFullYear()} Sinovuyo Mqikela. Portfolio built with{" "}
            <Link to="/" className="text-gold-dark hover:underline">
              HireBoost
            </Link>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
