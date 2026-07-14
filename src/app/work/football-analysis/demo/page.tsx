import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { FootballAnalysisDemo } from "@/components/demo/football-analysis-demo";

export const metadata: Metadata = {
  title: "Football Analysis — Interactive Demo",
  description:
    "A hardcoded simulation of my football match-analysis tool: scan fixtures, screen model-vs-market divergence, and read an AI match brief.",
};

export default function FootballAnalysisDemoPage() {
  return (
    <>
      <Header />
      <main className="px-6 pb-24 pt-32">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Link
              href="/work/football-analysis"
              className="font-mono text-sm text-muted transition-colors hover:text-accent"
            >
              ← back to the case study
            </Link>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
              Football Analysis — live demo
              <span className="text-accent">.</span>
            </h1>
            <p className="mt-3 max-w-2xl text-muted">
              This is the exact flow of the real tool I use every day, reproduced as a simulation:
              scan a time window, review the fixtures it finds, screen them by model-vs-market
              divergence, and read the AI&apos;s verified match brief. Data is a frozen snapshot
              (World Cup semi-final day, 14 Jul 2026) — no live calls.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8">
              <FootballAnalysisDemo />
            </div>
          </Reveal>

          <Reveal>
            <p className="mt-6 text-center text-xs text-faint">
              The production tool runs locally against a real data pipeline — 2,700+ match
              snapshots and counting. This page is a faithful, hardcoded re-creation of its UI flow.
            </p>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
