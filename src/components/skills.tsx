"use client";

import { motion } from "framer-motion";
import { skillGroups } from "@/data/skills";
import { Reveal } from "./reveal";

export function Skills() {
  const allSkills = skillGroups.flatMap((g) => g.skills);
  const rowA = allSkills.filter((_, i) => i % 2 === 0);
  const rowB = allSkills.filter((_, i) => i % 2 === 1);

  return (
    <section className="px-6 pb-20 sm:pb-28">
      <div className="mx-auto max-w-5xl rounded-3xl border border-line bg-surface p-6 py-8 sm:p-12">
        <Reveal>
          <h2 className="text-xl font-semibold">Tech stack</h2>
          <p className="mt-1 text-sm text-muted">The tools I ship with, grouped by where they live.</p>
        </Reveal>

        {/* Mobile: two auto-scrolling marquee rows */}
        <div className="mt-7 space-y-3 sm:hidden">
          <MarqueeRow skills={rowA} />
          <MarqueeRow skills={rowB} reverse />
        </div>

        {/* Desktop: grouped rows */}
        <div className="mt-8 hidden space-y-6 sm:block">
          {skillGroups.map((group, gi) => (
            <Reveal key={group.label} delay={gi * 0.06}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline">
                <span className="w-36 shrink-0 font-mono text-xs uppercase tracking-wider text-faint">
                  {group.label}
                </span>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill, si) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: si * 0.04, type: "spring", stiffness: 260, damping: 18 }}
                      whileHover={{ scale: 1.08, rotate: si % 2 === 0 ? 1.5 : -1.5 }}
                      className="cursor-default rounded-full border border-line bg-background px-3.5 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:bg-accent-soft hover:text-accent"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function MarqueeRow({ skills, reverse }: { skills: string[]; reverse?: boolean }) {
  return (
    <div className="marquee-fade -mx-6 overflow-hidden px-6">
      <div className={`marquee-track ${reverse ? "reverse" : ""}`}>
        {/* Content duplicated once for a seamless loop */}
        {[0, 1].map((copy) => (
          <div key={copy} className="flex gap-2 pr-2" aria-hidden={copy === 1}>
            {skills.map((skill) => (
              <span
                key={`${copy}-${skill}`}
                className="whitespace-nowrap rounded-full border border-line bg-background px-3.5 py-1.5 text-sm text-muted"
              >
                {skill}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
