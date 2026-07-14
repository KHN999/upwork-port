"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type TermLine = { cmd: string; out: string[] };

const LINES: TermLine[] = [
  {
    cmd: "whoami",
    out: ["Kaung Htet Naing — Full-Stack Engineer"],
  },
  {
    cmd: "ls skills/",
    out: ["web/  mobile/  ai-agents/  data-analytics/"],
  },
  {
    cmd: "./status.sh",
    out: ["● available for freelance work", "→ remote · worldwide · Bangkok (GMT+7)"],
  },
];

const TYPE_MS = 55;
const PAUSE_AFTER_CMD = 350;
const PAUSE_AFTER_OUT = 1100;
const PAUSE_BEFORE_RESTART = 3200;

export function Terminal() {
  const reduce = useReducedMotion();
  // done: fully rendered lines; typed: chars of the current command
  const [done, setDone] = useState<TermLine[]>([]);
  const [typed, setTyped] = useState("");
  const [windowState, setWindowState] = useState<"open" | "minimized" | "closed">("open");
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (reduce) return;
    let line = 0;
    let char = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = LINES[line];
      if (char <= current.cmd.length) {
        setTyped(current.cmd.slice(0, char));
        char += 1;
        timer = setTimeout(tick, TYPE_MS);
      } else {
        // command fully typed — reveal output, move to next line
        timer = setTimeout(() => {
          setDone((prev) => [...prev, current]);
          setTyped("");
          char = 0;
          line += 1;
          if (line < LINES.length) {
            timer = setTimeout(tick, PAUSE_AFTER_OUT);
          } else {
            timer = setTimeout(() => {
              setDone([]);
              line = 0;
              timer = setTimeout(tick, 400);
            }, PAUSE_BEFORE_RESTART);
          }
        }, PAUSE_AFTER_CMD);
      }
    };

    timer = setTimeout(tick, 800);
    return () => clearTimeout(timer);
  }, [reduce]);

  const showAllStatic = reduce;
  const lines = showAllStatic ? LINES : done;

  if (windowState === "closed") {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setWindowState("open")}
        className="flex h-[120px] w-full items-center justify-center rounded-xl border border-dashed border-line-strong font-mono text-xs text-faint transition-colors hover:border-accent hover:text-accent"
      >
        terminal closed — click to reopen
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative w-full"
    >
      <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-accent/15 to-transparent blur-xl" aria-hidden />
      <motion.div
        animate={{ scale: zoomed ? 1.06 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative overflow-hidden rounded-xl border border-line bg-surface shadow-2xl"
      >
        <div className="group flex items-center gap-2 border-b border-line px-4 py-3">
          <TrafficLight
            color="#ff5f57"
            glyph="×"
            label="Close terminal"
            onClick={() => setWindowState("closed")}
          />
          <TrafficLight
            color="#febc2e"
            glyph="−"
            label={windowState === "minimized" ? "Restore terminal" : "Minimize terminal"}
            onClick={() =>
              setWindowState((s) => (s === "minimized" ? "open" : "minimized"))
            }
          />
          <TrafficLight
            color="#28c840"
            glyph="+"
            label={zoomed ? "Zoom out terminal" : "Zoom terminal"}
            onClick={() => setZoomed((z) => !z)}
          />
          <span className="ml-2 font-mono text-[11px] text-faint">kaung@bangkok — zsh</span>
        </div>

        <motion.div
          animate={{ height: windowState === "minimized" ? 0 : "auto" }}
          transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="overflow-hidden"
        >
          <div className="min-h-[248px] p-4 font-mono text-[13px] leading-relaxed">
            {lines.map((line) => (
              <div key={line.cmd} className="mb-3">
                <p>
                  <span className="text-accent">❯</span>{" "}
                  <span className="text-foreground">{line.cmd}</span>
                </p>
                {line.out.map((out) => (
                  <p key={out} className="text-muted">
                    {out}
                  </p>
                ))}
              </div>
            ))}
            {!showAllStatic && (
              <p>
                <span className="text-accent">❯</span>{" "}
                <span className="text-foreground">{typed}</span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="ml-0.5 inline-block h-[14px] w-[7px] translate-y-[2px] bg-accent"
                />
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function TrafficLight({
  color,
  glyph,
  label,
  onClick,
}: {
  color: string;
  glyph: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      style={{ backgroundColor: color }}
      className="flex h-3 w-3 items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-90"
    >
      <span className="text-[9px] font-bold leading-none text-black/50 transition-opacity group-hover:opacity-100 pointer-fine:opacity-0">
        {glyph}
      </span>
    </button>
  );
}
