"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { projects, type Project } from "@/data/projects";
import { Section } from "./section";
import { Reveal } from "./reveal";

export function Projects() {
  return (
    <Section
      id="work"
      eyebrow="Selected work"
      title="Projects"
      description="A mix of professional case studies and personal builds. Each one shipped, each one owned end-to-end."
    >
      {/* Mobile: swipeable snap carousel */}
      <div className="sm:hidden">
        <MobileCarousel />
      </div>
      {/* Desktop: grid */}
      <div className="hidden gap-6 sm:grid sm:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 2) * 0.1}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function MobileCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[0] as HTMLElement | undefined;
    if (!card) return;
    const step = card.offsetWidth + 16; // card + gap
    setActive(Math.min(projects.length - 1, Math.round(track.scrollLeft / step)));
  };

  const scrollTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[0] as HTMLElement | undefined;
    if (!card) return;
    track.scrollTo({ left: i * (card.offsetWidth + 16), behavior: "smooth" });
  };

  return (
    <Reveal>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project) => (
          <div key={project.slug} className="w-[85%] shrink-0 snap-center">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-center gap-2">
        {projects.map((project, i) => (
          <button
            key={project.slug}
            aria-label={`Go to project ${i + 1}`}
            onClick={() => scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-6 bg-accent" : "w-1.5 bg-line-strong"
            }`}
          />
        ))}
      </div>
      <p className="mt-3 text-center font-mono text-[11px] text-faint">swipe to explore →</p>
    </Reveal>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [4, -4]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-4, 4]), { stiffness: 200, damping: 20 });

  return (
    <motion.article
      ref={ref}
      onMouseMove={(e) => {
        if (reduce || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        px.set((e.clientX - rect.left) / rect.width);
        py.set((e.clientY - rect.top) / rect.height);
      }}
      onMouseLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-line-strong"
    >
      <div className="relative h-44 overflow-hidden border-b border-line">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <PlaceholderCover project={project} />
        )}
        <span className="absolute left-4 top-4 rounded-full border border-line bg-background/70 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-muted backdrop-blur-sm">
          {project.kind === "work" ? "Client work" : "Personal"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        <p className="mt-1 text-sm font-medium text-accent">{project.summary}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{project.description}</p>

        <ul className="mt-4 space-y-1.5">
          {project.highlights.map((h) => (
            <li key={h} className="flex gap-2 text-sm text-muted">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-5">
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-md bg-surface-raised px-2 py-1 font-mono text-[11px] text-muted"
              >
                {tech}
              </span>
            ))}
          </div>
          {(project.caseStudy || project.links?.live || project.links?.github) && (
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
              {project.caseStudy && (
                <Link href={`/work/${project.slug}`} className="text-accent hover:underline">
                  Case study →
                </Link>
              )}
              {project.caseStudy?.demoUrl && (
                <Link href={project.caseStudy.demoUrl} className="text-accent hover:underline">
                  Live demo →
                </Link>
              )}
              {project.links?.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Live demo ↗
                </a>
              )}
              {project.links?.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition-colors hover:text-foreground"
                >
                  Source code ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function PlaceholderCover({ project }: { project: Project }) {
  return (
    <div className="flex h-full items-center justify-center bg-gradient-to-br from-accent-soft via-surface to-surface-raised">
      <span className="select-none font-mono text-4xl font-bold tracking-tight text-accent/40">
        {project.title
          .replace(/^Placeholder:\s*/, "")
          .split(" ")
          .slice(0, 2)
          .map((w) => w[0])
          .join("")}
      </span>
    </div>
  );
}
