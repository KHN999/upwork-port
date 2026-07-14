"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { site } from "@/data/site";
import { Section } from "./section";
import { Reveal } from "./reveal";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <Section
      id="contact"
      eyebrow="Let's talk"
      title="Have a project in mind?"
      description="I'm available for freelance work — full builds, features, integrations, or fixing the thing nobody else could. I reply within a day."
    >
      <Reveal>
        <div className="rounded-3xl border border-line bg-surface p-8 sm:p-12">
          <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-faint">Email me at</p>
              <button
                onClick={copyEmail}
                className="group mt-2 flex flex-wrap items-center gap-3 text-left text-lg font-semibold text-foreground transition-colors hover:text-accent sm:text-2xl"
              >
                <span className="break-all">{site.email}</span>
                <motion.span
                  key={copied ? "copied" : "copy"}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-md border border-line px-2 py-1 font-mono text-[11px] ${
                    copied ? "border-accent text-accent" : "text-faint group-hover:text-muted"
                  }`}
                >
                  {copied ? "copied!" : "click to copy"}
                </motion.span>
              </button>
            </div>
            <a
              href={site.links.upwork}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.04]"
            >
              Hire me on Upwork ↗
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 border-t border-line pt-8 text-sm">
            <a
              href={site.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-foreground"
            >
              GitHub ↗
            </a>
            <a
              href={site.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-foreground"
            >
              LinkedIn ↗
            </a>
            <span className="text-faint">Based in {site.location} · Remote worldwide</span>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
