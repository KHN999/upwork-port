"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { site } from "@/data/site";
import { Terminal } from "./terminal";

export function Hero() {
  const reduce = useReducedMotion();
  // Scroll-linked parallax: hero content drifts up and fades as you scroll past.
  // Tied to the section's own height so tall (mobile) heroes fade at the same
  // visual point as short (desktop) ones.
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const contentOpacity = useTransform(scrollYProgress, [0.35, 0.95], [1, 0]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);
  const spotX = useSpring(mouseX, { stiffness: 150, damping: 25 });
  const spotY = useSpring(mouseY, { stiffness: 150, damping: 25 });
  const spotlight = useMotionTemplate`radial-gradient(480px circle at ${spotX}px ${spotY}px, var(--accent-glow), transparent 70%)`;

  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % site.specialties.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }}
      className="relative flex min-h-[80svh] items-center overflow-hidden px-6 pt-16"
    >
      <motion.div
        className="hero-grid absolute inset-0"
        style={reduce ? undefined : { y: gridY }}
        aria-hidden
      />
      {!reduce && (
        <motion.div className="pointer-events-none absolute inset-0" style={{ background: spotlight }} aria-hidden />
      )}

      <motion.div
        className="relative mx-auto grid w-full max-w-5xl items-center gap-12 py-16 lg:grid-cols-[1fr_minmax(0,400px)]"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Available for freelance work
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            {site.name}
            <span className="text-accent">.</span>
            {/* rotating phrase: always one line — font scales instead of wrapping */}
            <span className="mt-1 block whitespace-nowrap text-[6.2vw] sm:text-5xl lg:text-[2.6rem]">
              <span className="text-muted">I build</span>{" "}
              <span className="relative inline-block text-left">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={site.specialties[index]}
                    initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                    transition={{ duration: 0.35 }}
                    className="inline-block text-accent"
                  >
                    {site.specialties[index]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted">{site.tagline}</p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <MagneticLink
              href="#work"
              className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
            >
              View my work
            </MagneticLink>
            <MagneticLink
              href={site.links.upwork}
              external
              className="rounded-full border border-line-strong px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              Hire me on Upwork ↗
            </MagneticLink>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-6"
          >
            {site.stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-xl font-semibold text-foreground">
                  {stat.value}
                  <span className="text-accent">.</span>
                </p>
                <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-faint">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <Terminal />
      </motion.div>

      <motion.div
        style={reduce ? undefined : { opacity: contentOpacity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        aria-hidden
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-9 w-6 items-start justify-center rounded-full border border-line-strong p-1.5"
        >
          <div className="h-2 w-1 rounded-full bg-accent" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function MagneticLink({
  href,
  children,
  className,
  external,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 15 });
  const y = useSpring(0, { stiffness: 200, damping: 15 });
  const reduce = useReducedMotion();

  return (
    <motion.a
      ref={ref}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      style={reduce ? undefined : { x, y }}
      onMouseMove={(e) => {
        if (reduce || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.25);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.96 }}
      className={`inline-block ${className ?? ""}`}
    >
      {children}
    </motion.a>
  );
}
