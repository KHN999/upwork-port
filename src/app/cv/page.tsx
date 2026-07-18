import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";
import { CvActions } from "@/components/cv-actions";

export const metadata: Metadata = {
  title: `CV — ${site.name}`,
  description: `Curriculum vitae of ${site.name}, ${site.role}.`,
};

const skills = [
  { label: "Frontend", items: "React, Next.js, TypeScript, Tailwind CSS" },
  { label: "Mobile", items: "React Native, Expo (production apps in daily use)" },
  { label: "Backend", items: "Node.js, NestJS, Go, Python, REST APIs, WebSockets" },
  { label: "Data & AI", items: "PostgreSQL, Supabase, MongoDB, Redis, Prisma, LLM APIs, n8n" },
];

export default function CvPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 print:bg-white print:p-0">
      <CvActions />

      {/* The paper — always light, independent of site theme */}
      <div
        id="cv-paper"
        className="mx-auto w-full max-w-[210mm] bg-white p-10 text-[#1a1d23] shadow-2xl print:max-w-none print:p-8 print:shadow-none sm:p-12"
      >
        {/* Header */}
        <header className="border-b-2 border-[#0d9488] pb-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Kaung Htet Naing<span className="text-[#0d9488]">.</span>
          </h1>
          <p className="mt-1 text-lg font-medium text-[#3d4451]">
            Full-Stack Software Engineer — Web · Mobile · AI Agents · Data
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-[#5c6572]">
            Bangkok, Thailand (remote worldwide) · {site.email}
            <br />
            kaunghtetnaing-nine.vercel.app · github.com/KHN999 ·
            upwork.com/freelancers/kaunghtetnaing
          </p>
        </header>

        {/* Summary */}
        <section className="mt-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0d9488]">
            Summary
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-[#3d4451]">
            Full-stack engineer with production software running at real scale: a chat platform
            serving 1,000,000+ users, a POS and business-control system operating a textile shop
            in Yangon, and data/AI products in daily use. I own work end-to-end — requirements,
            architecture, build, deploy, support — and specialize in React/Next.js, React Native,
            Go, and LLM-powered workflows.
          </p>
        </section>

        {/* Skills */}
        <section className="mt-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0d9488]">
            Skills
          </h2>
          <div className="mt-1.5 space-y-0.5">
            {skills.map((row) => (
              <p key={row.label} className="text-[13px] leading-relaxed">
                <span className="inline-block w-24 font-semibold text-[#1a1d23]">{row.label}</span>
                <span className="text-[#3d4451]">{row.items}</span>
              </p>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="mt-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0d9488]">
            Experience
          </h2>

          <div className="mt-2">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-[14px] font-bold">
                Software Engineer — Puraido Co., Ltd.
              </h3>
              <span className="shrink-0 text-[12px] text-[#5c6572]">Dec 2025 — present</span>
            </div>
            <p className="text-[12px] italic text-[#5c6572]">Bangkok · full-time</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[13px] leading-relaxed text-[#3d4451]">
              <li>
                Build and operate a chat platform serving 1,000,000+ users with ~400 new signups
                daily — Go backend services, Remix web apps, and React Native mobile.
              </li>
              <li>
                Own features end-to-end across the product monorepo — database schema to API to
                UI — including AgentHQ Chat, the team-messaging app (realtime, voice notes, shift
                tools) used daily company-wide.
              </li>
            </ul>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-[14px] font-bold">
                Software Engineer Intern — Puraido Co., Ltd.
              </h3>
              <span className="shrink-0 text-[12px] text-[#5c6572]">Jun — Nov 2025</span>
            </div>
            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[13px] leading-relaxed text-[#3d4451]">
              <li>
                Built two fully functional mobile apps that went straight to production — adopted
                by all employees; promoted to full-time after six months.
              </li>
            </ul>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-[14px] font-bold">Freelance Full-Stack Developer</h3>
              <span className="shrink-0 text-[12px] text-[#5c6572]">2025 — present</span>
            </div>
            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[13px] leading-relaxed text-[#3d4451]">
              <li>
                LGY — full business-control system + POS for a textile wholesale shop in Yangon
                (Next.js, NestJS, Prisma, PostgreSQL): 26 data models, Burmese-only UI for
                non-technical staff, daily cash reconciliation. In production; I run support and
                iterate with the client.
              </li>
            </ul>
          </div>
        </section>

        {/* Projects */}
        <section className="mt-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0d9488]">
            Selected projects
          </h2>
          <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[13px] leading-relaxed text-[#3d4451]">
            <li>
              <b className="text-[#1a1d23]">Football Analysis</b> — data pipeline (2,700+ match
              snapshots), Poisson + gradient-boosting fair-line models, and a three-stage LLM brief
              pipeline with a verifier. Python, DuckDB, scikit-learn. In daily use.
            </li>
            <li>
              <b className="text-[#1a1d23]">SE-Map</b>{" "}(se-learn.vercel.app) — interactive map of
              software engineering: 157 topics, 7 step-through flows, content generated by an AI
              pipeline I designed. Next.js, TypeScript. Live &amp; public.
            </li>
          </ul>
          <p className="mt-1.5 text-[12px] text-[#5c6572]">
            Case studies &amp; interactive demos: kaunghtetnaing-nine.vercel.app
          </p>
        </section>

        {/* Education */}
        <section className="mt-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0d9488]">
            Education
          </h2>
          <div className="mt-1.5 space-y-1.5 text-[13px] leading-relaxed">
            <div className="flex items-baseline justify-between gap-4">
              <p>
                <b>B.Sc. Information &amp; Communication Technology</b> — Rangsit University,
                Thailand <span className="text-[#5c6572]">(50% academic scholarship)</span>
              </p>
              <span className="shrink-0 text-[12px] text-[#5c6572]">2023 — 2025</span>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <p>
                <b>MBBS (3.5 years, preclinical completed)</b> — University of Medicine 1, Yangon
                <span className="text-[#5c6572]"> · medical domain knowledge for healthtech</span>
              </p>
              <span className="shrink-0 text-[12px] text-[#5c6572]">2016 — 2020</span>
            </div>
          </div>
        </section>

        {/* Languages */}
        <section className="mt-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0d9488]">
            Languages
          </h2>
          <p className="mt-1.5 text-[13px] text-[#3d4451]">
            English (professional) · Burmese (native) · Thai (conversational)
          </p>
        </section>
      </div>

      <p className="mx-auto mt-6 max-w-[210mm] text-center text-xs text-faint print:hidden">
        <Link href="/" className="text-accent hover:underline">
          ← back to portfolio
        </Link>
      </p>
    </main>
  );
}
