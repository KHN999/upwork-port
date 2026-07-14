"use client";

import { motion, useReducedMotion } from "framer-motion";

type WorkflowStep = { step: string; detail: string };

/**
 * Animated pipeline: steps light up in sequence with a flowing connector,
 * looping forever. Works on scroll into view; static list under reduced motion.
 */
export function WorkflowDiagram({ steps }: { steps: WorkflowStep[] }) {
  const reduce = useReducedMotion();
  const CYCLE = steps.length * 1.4;

  return (
    <div className="relative">
      {steps.map((item, i) => (
        <div key={item.step} className="relative flex gap-5 pb-8 last:pb-0">
          {/* connector */}
          {i < steps.length - 1 && (
            <div className="absolute left-[19px] top-10 h-[calc(100%-40px)] w-px bg-line-strong">
              {!reduce && (
                <motion.div
                  className="absolute inset-x-0 top-0 h-full origin-top bg-accent"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: [0, 1, 1, 0] }}
                  viewport={{ once: false, margin: "-60px" }}
                  transition={{
                    duration: 1.4,
                    times: [0, 0.5, 0.9, 1],
                    delay: i * 1.4 + 0.7,
                    repeat: Infinity,
                    repeatDelay: CYCLE - 1.4,
                  }}
                />
              )}
            </div>
          )}

          {/* node */}
          <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface font-mono text-sm text-muted">
            {!reduce && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-accent"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 1.15] }}
                viewport={{ once: false, margin: "-60px" }}
                transition={{
                  duration: 1.4,
                  times: [0, 0.15, 0.8, 1],
                  delay: i * 1.4,
                  repeat: Infinity,
                  repeatDelay: CYCLE - 1.4,
                }}
              />
            )}
            {i + 1}
          </div>

          <div className="pt-1.5">
            <h4 className="font-semibold">{item.step}</h4>
            <p className="mt-1 text-sm leading-relaxed text-muted">{item.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
