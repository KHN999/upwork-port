"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  demoMatches,
  screenerRows,
  aiBrief,
  scanLog,
  franceForm,
  spainForm,
  currentSlot,
  pctGroups,
  type DemoMatch,
  type FormGame,
} from "@/data/football-demo";

// The real dashboard's chart palette — result fill colors + the gold line
const GREEN = "#3fb950";
const RED = "#f85149";
const GRAY = "#8b949e";
const GOLD = "#d29922";
const POS = "#0d9488";
const NEG = "#f43f5e";

type Tab = "scan" | "screener" | "ai";

export function FootballAnalysisDemo() {
  const [tab, setTab] = useState<Tab>("scan");
  const [hours, setHours] = useState(16);
  const [scanState, setScanState] = useState<"idle" | "scanning" | "done">("idle");
  const [logCount, setLogCount] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [screenerUnlocked, setScreenerUnlocked] = useState(false);
  const [aiUnlocked, setAiUnlocked] = useState(false);

  const startScan = () => {
    setScanState("scanning");
    setLogCount(0);
    let i = 0;
    const step = () => {
      i += 1;
      setLogCount(i);
      if (i < scanLog.length) {
        window.setTimeout(step, i === scanLog.length - 1 ? 700 : 450);
      } else {
        window.setTimeout(() => {
          setScanState("done");
          setSelected(new Set(demoMatches.map((m) => m.id)));
        }, 500);
      }
    };
    window.setTimeout(step, 400);
  };

  const exportMatches = () => {
    setScreenerUnlocked(true);
    setTab("screener");
  };

  const openAi = () => {
    setAiUnlocked(true);
    setTab("ai");
  };

  const restart = () => {
    setTab("scan");
    setScanState("idle");
    setLogCount(0);
    setSelected(new Set());
    setScreenerUnlocked(false);
    setAiUnlocked(false);
  };

  return (
    <div className="rounded-2xl border border-line bg-surface">
      {/* window chrome */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-[11px] text-faint">
          football-analysis — localhost:4002
        </span>
        <button
          onClick={restart}
          className="ml-auto rounded-md border border-line px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:border-accent hover:text-accent"
        >
          ↺ restart demo
        </button>
      </div>

      {/* tabs */}
      <div className="flex gap-1 border-b border-line px-4 pt-3">
        <DemoTab label="1 · Scan" active={tab === "scan"} onClick={() => setTab("scan")} />
        <DemoTab
          label="2 · Screener"
          active={tab === "screener"}
          disabled={!screenerUnlocked}
          onClick={() => screenerUnlocked && setTab("screener")}
        />
        <DemoTab
          label="3 · AI analysis"
          active={tab === "ai"}
          disabled={!aiUnlocked}
          onClick={() => aiUnlocked && setTab("ai")}
        />
      </div>

      <div className="p-4 sm:p-6">
        <AnimatePresence mode="wait">
          {tab === "scan" && (
            <TabPanel key="scan">
              <ScanTab
                hours={hours}
                setHours={setHours}
                scanState={scanState}
                logCount={logCount}
                selected={selected}
                setSelected={setSelected}
                onScan={startScan}
                onExport={exportMatches}
              />
            </TabPanel>
          )}
          {tab === "screener" && (
            <TabPanel key="screener">
              <ScreenerTab onAnalyze={openAi} />
            </TabPanel>
          )}
          {tab === "ai" && (
            <TabPanel key="ai">
              <AiTab onRestart={restart} />
            </TabPanel>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function DemoTab({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-accent text-foreground"
          : disabled
            ? "cursor-not-allowed border-transparent text-faint"
            : "border-transparent text-muted hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function TabPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

// ───────────────────────────── Scan ─────────────────────────────

function ScanTab({
  hours,
  setHours,
  scanState,
  logCount,
  selected,
  setSelected,
  onScan,
  onExport,
}: {
  hours: number;
  setHours: (h: number) => void;
  scanState: "idle" | "scanning" | "done";
  logCount: number;
  selected: Set<string>;
  setSelected: (s: Set<string>) => void;
  onScan: () => void;
  onExport: () => void;
}) {
  const leagues = useMemo(() => {
    const groups = new Map<string, DemoMatch[]>();
    for (const m of demoMatches) {
      groups.set(m.league, [...(groups.get(m.league) ?? []), m]);
    }
    return [...groups.entries()];
  }, []);

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-faint">
            Next … hours (from now)
          </label>
          <input
            type="number"
            min={1}
            max={336}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            disabled={scanState !== "idle"}
            className="w-24 rounded-lg border border-line bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none disabled:opacity-50"
          />
        </div>
        <button
          onClick={onScan}
          disabled={scanState !== "idle"}
          className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-background transition-transform hover:scale-[1.03] disabled:opacity-50 disabled:hover:scale-100"
        >
          {scanState === "scanning" ? "Scanning…" : "Scan for matches"}
        </button>
        {scanState === "done" && (
          <span className="pb-2 font-mono text-xs text-muted">
            8 fixtures · next {hours}h · frozen snapshot from 14 Jul 2026
          </span>
        )}
      </div>

      {/* scan log */}
      {scanState !== "idle" && (
        <div className="mt-4 rounded-lg border border-line bg-background p-3 font-mono text-xs leading-relaxed">
          {scanLog.slice(0, logCount).map((line, i) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className={i === scanLog.length - 1 ? "text-accent" : "text-muted"}
            >
              <span className="text-faint">$</span> {line}
            </motion.p>
          ))}
          {scanState === "scanning" && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.9, repeat: Infinity }}
              className="inline-block h-3 w-[7px] bg-accent"
            />
          )}
        </div>
      )}

      {/* match list */}
      {scanState === "done" && (
        <div className="mt-5">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-3 rounded-lg border border-accent/40 bg-accent-soft/50 px-3 py-2 text-xs text-muted"
          >
            <b className="text-accent">Step 2:</b> untick anything you don&apos;t want, then hit{" "}
            <b className="text-foreground">Export</b> in the bar below ↓
          </motion.p>
          {leagues.map(([league, matches], gi) => (
            <motion.div
              key={league}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.08 }}
              className="mb-3 overflow-hidden rounded-lg border border-line"
            >
              <div className="bg-surface-raised px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-muted">
                {league}
              </div>
              {matches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => toggle(m.id)}
                  className={`flex w-full flex-wrap items-center gap-x-3 gap-y-1 border-t border-line px-3 py-2.5 text-left transition-colors hover:bg-accent-soft ${
                    m.featured ? "bg-accent-soft/60" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    readOnly
                    checked={selected.has(m.id)}
                    className="pointer-events-none accent-[var(--accent)]"
                  />
                  <span className="w-12 font-mono text-xs text-faint">{m.kickoff}</span>
                  <span className="min-w-0 flex-1 text-sm">
                    {m.home} <span className="text-faint">v</span> {m.away}
                    {m.featured && (
                      <span className="ml-2 rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-accent">
                        featured
                      </span>
                    )}
                  </span>
                  <LineBadge label="AH" open={m.ahOpen} current={m.ah} signed />
                  <LineBadge label="O/U" open={m.totalOpen} current={m.total} />
                </button>
              ))}
            </motion.div>
          ))}

          {/* sticky action bar — always visible while browsing the list */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="sticky bottom-0 -mx-4 mt-4 flex items-center justify-between gap-3 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6"
          >
            <p className="text-xs text-faint">
              <b className="text-foreground">{selected.size}</b> selected · each becomes one
              immutable JSON snapshot
            </p>
            <div className="relative shrink-0">
              <motion.span
                animate={{ opacity: [0.5, 0, 0.5], scale: [1, 1.12, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="absolute inset-0 rounded-lg bg-accent"
                aria-hidden
              />
              <button
                onClick={onExport}
                disabled={selected.size === 0}
                className="relative rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-background transition-transform hover:scale-[1.03] disabled:opacity-40"
              >
                Export {selected.size} matches → Screener
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function LineBadge({
  label,
  open,
  current,
  signed,
}: {
  label: string;
  open: number;
  current: number;
  signed?: boolean;
}) {
  const fmt = (v: number) => (signed && v > 0 ? `+${v}` : `${v}`);
  const moved = open !== current;
  const up = current > open;
  return (
    <span className="rounded bg-surface-raised px-2 py-1 font-mono text-[11px] text-muted">
      <span className="text-faint">{label} </span>
      {moved && (
        <>
          <span className="text-faint line-through">{fmt(open)}</span>{" "}
          <span style={{ color: up ? POS : NEG }}>{up ? "▲" : "▼"}</span>{" "}
        </>
      )}
      <b className="text-foreground">{fmt(current)}</b>
    </span>
  );
}

// ─────────────────────────── Screener ───────────────────────────

function ScreenerTab({ onAnalyze }: { onAnalyze: () => void }) {
  const byId = useMemo(() => new Map(demoMatches.map((m) => [m.id, m])), []);

  return (
    <div>
      <p className="mb-4 text-xs text-muted">
        Upcoming matches ranked by <b className="text-foreground">model-vs-market divergence</b> in
        goals — the market&apos;s published lines are inverted back into expected-goal estimates and
        compared against the model&apos;s fair line.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left font-mono text-[10px] uppercase tracking-wider text-faint">
              <th className="py-2 pr-3 font-semibold">Match</th>
              <th className="py-2 pr-3 font-semibold">Lean</th>
              <th className="py-2 pr-3 text-right font-semibold">Market → Model</th>
              <th className="py-2 pr-3 text-right font-semibold">Edge</th>
              <th className="py-2 pr-3 text-right font-semibold">Meta</th>
              <th className="py-2 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {screenerRows.map((row, i) => {
              const m = byId.get(row.matchId)!;
              const isFeatured = m.featured;
              const sup = row.angle.startsWith("Over") || row.angle.startsWith("Under");
              return (
                <motion.tr
                  key={row.matchId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`border-b border-line ${isFeatured ? "bg-accent-soft/60" : ""}`}
                >
                  <td className="py-2.5 pr-3">
                    {m.home} <span className="text-faint">v</span> {m.away}
                    <span className="ml-2 font-mono text-[10px] text-faint">{m.kickoff}</span>
                  </td>
                  <td className="py-2.5 pr-3 font-medium text-accent">{row.angle}</td>
                  <td className="py-2.5 pr-3 text-right font-mono text-xs text-muted">
                    {sup
                      ? `${row.marketTotal.toFixed(2)} → ${row.fairTotal.toFixed(2)}`
                      : `${row.marketSup >= 0 ? "+" : ""}${row.marketSup.toFixed(2)} → ${row.fairSup >= 0 ? "+" : ""}${row.fairSup.toFixed(2)}`}
                  </td>
                  <td
                    className="py-2.5 pr-3 text-right font-mono text-xs font-semibold"
                    style={{ color: row.edge >= 0 ? POS : NEG }}
                  >
                    {row.edge >= 0 ? "▲ +" : "▼ −"}
                    {Math.abs(row.edge).toFixed(2)}
                  </td>
                  <td className="py-2.5 pr-3 text-right font-mono text-xs text-muted">
                    {row.meta}%
                  </td>
                  <td className="py-2.5 text-right">
                    {isFeatured ? (
                      <button
                        onClick={onAnalyze}
                        className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-background transition-transform hover:scale-[1.04]"
                      >
                        Analyze with AI →
                      </button>
                    ) : (
                      <span className="font-mono text-[10px] text-faint">demo: featured only</span>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ScatterChart />
    </div>
  );
}

/**
 * AH × total scatter — the real dashboard's Analysis chart. Everything in this
 * scan is upcoming, so points render as hollow neutral rings (settled matches
 * would be filled green/red by result).
 */
function ScatterChart() {
  const [hover, setHover] = useState<string | null>(null);
  const W = 560;
  const H = 280;
  const PAD = { l: 44, r: 16, t: 16, b: 44 };
  const xDom: [number, number] = [-1.75, 0.5];
  const yDom: [number, number] = [1.75, 3.5];
  const x = (v: number) => PAD.l + ((v - xDom[0]) / (xDom[1] - xDom[0])) * (W - PAD.l - PAD.r);
  const y = (v: number) => H - PAD.b - ((v - yDom[0]) / (yDom[1] - yDom[0])) * (H - PAD.t - PAD.b);
  const hovered = demoMatches.find((m) => m.id === hover);

  return (
    <div className="mt-6 rounded-lg border border-line bg-background p-4">
      <p className="mb-1 text-sm font-semibold">Scanned matches — AH × total</p>
      <p className="mb-3 text-xs text-faint">
        Where this scan&apos;s slate sits. In the real tool, settled matches fill in green/red by
        result — this scan is all upcoming.
      </p>
      <div className="relative overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[420px]" role="img" aria-label="Scatter of Asian handicap line versus total line for the eight scanned matches">
          {[-1.5, -1, -0.5, 0, 0.5].map((v) => (
            <g key={`gx${v}`}>
              <line
                x1={x(v)}
                x2={x(v)}
                y1={PAD.t}
                y2={H - PAD.b}
                stroke={v === 0 ? "var(--border-strong, var(--border))" : "var(--border)"}
                strokeWidth="1"
              />
              <text x={x(v)} y={H - PAD.b + 16} textAnchor="middle" fontSize="10" fill="var(--faint)">
                {v > 0 ? `+${v}` : v}
              </text>
            </g>
          ))}
          {[2, 2.5, 3, 3.5].map((v) => (
            <g key={`gy${v}`}>
              <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} stroke="var(--border)" strokeWidth="1" />
              <text x={PAD.l - 8} y={y(v) + 3} textAnchor="end" fontSize="10" fill="var(--faint)">
                {v}
              </text>
            </g>
          ))}
          <text x={(PAD.l + W - PAD.r) / 2} y={H - 6} textAnchor="middle" fontSize="10" fill="var(--muted)">
            Asian handicap (← home favored · away favored →)
          </text>
          <text x={12} y={(PAD.t + H - PAD.b) / 2} textAnchor="middle" fontSize="10" fill="var(--muted)" transform={`rotate(-90 12 ${(PAD.t + H - PAD.b) / 2})`}>
            Asian total (goals)
          </text>

          {demoMatches.map((m) => {
            const featured = m.featured;
            return (
              <g key={m.id}>
                {featured && (
                  <circle cx={x(m.ah)} cy={y(m.total)} r="11" fill="var(--accent)" opacity="0.15">
                    <animate attributeName="r" values="9;13;9" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* upcoming = hollow ring, like the real chart */}
                <circle
                  cx={x(m.ah)}
                  cy={y(m.total)}
                  r={featured ? 5.5 : 4.5}
                  fill="none"
                  stroke={featured ? "var(--accent)" : "var(--faint)"}
                  strokeWidth={featured ? 2 : 1.4}
                  opacity={featured ? 1 : 0.75}
                  onMouseEnter={() => setHover(m.id)}
                  onMouseLeave={() => setHover(null)}
                  style={{ cursor: "help" }}
                />
              </g>
            );
          })}
          <text
            x={x(demoMatches[0].ah) - 12}
            y={y(demoMatches[0].total) - 10}
            textAnchor="end"
            fontSize="11"
            fontWeight="600"
            fill="var(--foreground)"
          >
            France v Spain
          </text>
        </svg>
        {hovered && (
          <div
            className="pointer-events-none absolute z-10 rounded-md border border-line bg-surface px-2.5 py-1.5 text-xs shadow-lg"
            style={{
              left: `${(x(hovered.ah) / W) * 100}%`,
              top: `${(y(hovered.total) / H) * 100}%`,
              transform: "translate(-50%, -120%)",
            }}
          >
            <b>
              {hovered.home} v {hovered.away}
            </b>
            <span className="ml-2 font-mono text-faint">
              AH {hovered.ah > 0 ? `+${hovered.ah}` : hovered.ah} · O/U {hovered.total} · upcoming
            </span>
          </div>
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-faint">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full border-[1.5px] border-faint" /> upcoming
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-accent" /> featured match
        </span>
        <span className="ml-auto">hover a point for details</span>
      </div>
    </div>
  );
}

// ─────────────────────────── AI brief ───────────────────────────

function AiTab({ onRestart }: { onRestart: () => void }) {
  const [stage, setStage] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    // stages: 1 match-detail charts, 2 observations, 3 model readout, 4 conclusion, 5 verifier
    [500, 2200, 3900, 5100, 6500].forEach((t, i) => {
      timers.current.push(window.setTimeout(() => setStage(i + 1), t));
    });
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const m = demoMatches[0];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold">
          {m.home} <span className="text-faint">v</span> {m.away}
        </h3>
        <span className="rounded bg-surface-raised px-2 py-1 font-mono text-[11px] text-muted">
          {m.league} · {m.kickoff}
        </span>
        <span className="rounded bg-surface-raised px-2 py-1 font-mono text-[11px] text-muted">
          AH −0.5 · O/U 2.5
        </span>
      </div>

      {stage < 1 && (
        <p className="font-mono text-xs text-muted">
          <ThinkingDots /> loading match detail…
        </p>
      )}

      {stage >= 1 && (
        <BriefCard title="Match detail — each game vs the line it actually faced">
          <div className="grid gap-4 lg:grid-cols-2">
            <FormChart
              title="France — goal margin vs own AH line"
              form={franceForm}
              mode="margin"
              cur={{ value: currentSlot.france.ahNeed, label: currentSlot.france.label }}
            />
            <FormChart
              title="Spain — goal margin vs own AH line"
              form={spainForm}
              mode="margin"
              cur={{ value: currentSlot.spain.ahNeed, label: currentSlot.spain.label }}
            />
            <FormChart
              title="France — total goals vs own line"
              form={franceForm}
              mode="total"
              cur={{ value: currentSlot.france.totalLine, label: currentSlot.france.label }}
            />
            <FormChart
              title="Spain — total goals vs own line"
              form={spainForm}
              mode="total"
              cur={{ value: currentSlot.spain.totalLine, label: currentSlot.spain.label }}
            />
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <GoalsTrendChart title="France — goals scored vs conceded" form={franceForm} />
            <GoalsTrendChart title="Spain — goals scored vs conceded" form={spainForm} />
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {pctGroups.map((group) => (
              <PctBars key={group.title} title={group.title} rows={group.rows} />
            ))}
          </div>
        </BriefCard>
      )}

      {stage >= 2 && (
        <BriefCard title="Auto-detected observations" mono>
          {aiBrief.observations.map((obs, i) => (
            <motion.p
              key={obs}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className="flex gap-2 text-xs leading-relaxed text-muted"
            >
              <span className="text-accent">›</span>
              {obs}
            </motion.p>
          ))}
        </BriefCard>
      )}

      {stage >= 3 && (
        <BriefCard title="Model readout — market vs fair line">
          <div className="grid gap-3 sm:grid-cols-2">
            {aiBrief.modelReadout.map((r) => (
              <div key={r.label} className="rounded-lg border border-line bg-background p-3">
                <p className="font-mono text-[10px] uppercase tracking-wider text-faint">{r.label}</p>
                <p className="mt-1 font-mono text-sm">
                  <span className="text-muted">{r.market}</span>
                  <span className="mx-2 text-faint">→</span>
                  <b className="text-accent">{r.model}</b>
                </p>
                <p className="mt-1 text-xs text-faint">{r.note}</p>
              </div>
            ))}
          </div>
        </BriefCard>
      )}

      {stage >= 4 && (
        <BriefCard title="Analyst conclusion">
          {aiBrief.analystConclusion.map((c) => (
            <p key={c} className="text-sm leading-relaxed text-muted">
              {c}
            </p>
          ))}
        </BriefCard>
      )}

      {stage >= 5 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 rounded-xl border-2 border-accent/40 bg-accent-soft/50 p-4"
        >
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-accent">
            Verifier model — cross-checks every claim against the computed evidence
            <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-background">
              {aiBrief.verifier.verdict}
            </span>
          </p>
          <div className="mt-3 space-y-2">
            {aiBrief.verifier.accepted.map((a) => (
              <p key={a} className="flex gap-2 text-sm text-muted">
                <span style={{ color: POS }}>✓</span> {a}
              </p>
            ))}
            {aiBrief.verifier.rejected.map((r) => (
              <p key={r.claim} className="flex gap-2 text-sm text-muted">
                <span style={{ color: NEG }}>✕</span>
                <span>
                  <b className="text-foreground">{r.claim}</b> — {r.reason}
                </span>
              </p>
            ))}
          </div>
          <p className="mt-3 text-xs text-faint">
            This is the honesty layer: the AI is never allowed to freestyle past the data.
          </p>
        </motion.div>
      )}

      {stage >= 5 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-5 text-center">
          <button
            onClick={onRestart}
            className="rounded-full border border-line-strong px-5 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            ↺ run the demo again
          </button>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Faithful recreation of the real tool's totalChart/ahChart:
 * one bar per past game colored by its result vs THAT game's own line
 * (green = over/covered, red = under/didn't, gray = push), a gold dashed
 * polyline tracking the line each game faced, and a gold dashed "?" ghost
 * slot for this match's current line.
 */
function FormChart({
  title,
  form,
  mode,
  cur,
}: {
  title: string;
  form: FormGame[];
  mode: "margin" | "total";
  cur: { value: number; label: string };
}) {
  const games = form.map((g) => ({
    value: mode === "margin" ? g.margin : g.total,
    line: mode === "margin" ? g.ahNeed : g.totalLine,
    result: mode === "margin" ? g.ahResult : g.totalResult,
    tip: `${g.venue === "H" ? "vs" : "@"} ${g.opp} ${g.score} · line ${fmtSigned(
      mode === "margin" ? g.ahNeed : g.totalLine,
      mode === "margin"
    )} · ${g[mode === "margin" ? "ahResult" : "totalResult"] === "over" ? (mode === "margin" ? "covered" : "over") : g[mode === "margin" ? "ahResult" : "totalResult"] === "under" ? (mode === "margin" ? "didn't cover" : "under") : "push"}`,
  }));

  const n = games.length + 1; // + current "?" slot
  const bw = 20;
  const gap = 11;
  const L = 22;
  const W = Math.max(220, L + n * (bw + gap) + 10);
  const H = 190;
  const top = 14;
  const bot = 24;

  const allVals = [...games.map((g) => g.value), ...games.map((g) => g.line), cur.value];
  const lo = mode === "margin" ? Math.min(...allVals, 0) - 0.5 : 0;
  const hi = Math.max(...allVals, mode === "margin" ? 1 : 3) + 0.5;
  const Y = (v: number) => top + (1 - (v - lo) / (hi - lo)) * (H - top - bot);
  const baseY = mode === "margin" ? Y(0) : H - bot;
  const cx = (i: number) => L + i * (bw + gap) + bw / 2;

  const resColor = (r: FormGame["ahResult"]) => (r === "over" ? GREEN : r === "under" ? RED : GRAY);
  const covered = games.filter((g) => g.result !== "push");
  const hits = covered.filter((g) => g.result === "over").length;

  const linePts = [
    ...games.map((g, i) => `${cx(i).toFixed(1)},${Y(g.line).toFixed(1)}`),
    `${cx(games.length).toFixed(1)},${Y(cur.value).toFixed(1)}`,
  ];

  const gridVals: number[] = [];
  for (let v = Math.ceil(lo); v <= Math.floor(hi); v++) gridVals.push(v);

  return (
    <div className="rounded-lg border border-line bg-background p-3">
      <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
        {title}
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 190 }} role="img" aria-label={title}>
        {gridVals.map((v) => (
          <g key={v}>
            <line
              x1={L}
              x2={W - 2}
              y1={Y(v)}
              y2={Y(v)}
              stroke={v === 0 && mode === "margin" ? "var(--border-strong, var(--border))" : "var(--border)"}
              strokeWidth="1"
            />
            <text x={L - 3} y={Y(v) + 2.5} textAnchor="end" fontSize="7" fill="var(--faint)">
              {mode === "margin" && v > 0 ? `+${v}` : v}
            </text>
          </g>
        ))}

        {games.map((g, i) => {
          const xx = L + i * (bw + gap);
          const yv = Y(g.value);
          const yTop = Math.min(yv, baseY);
          const h = Math.max(3, Math.abs(yv - baseY));
          return (
            <g key={i}>
              <rect x={xx} y={yTop} width={bw} height={h} rx={2} fill={resColor(g.result)} opacity="0.85">
                <title>{g.tip}</title>
              </rect>
              <text
                x={xx + bw / 2}
                y={mode === "margin" ? (g.value >= 0 ? yv - 3 : yv + 9) : baseY + 10}
                textAnchor="middle"
                fontSize="8"
                fill="var(--faint)"
              >
                {mode === "margin" && g.value > 0 ? `+${g.value}` : g.value}
              </text>
            </g>
          );
        })}

        {/* current match: gold dashed ghost slot with "?" */}
        {(() => {
          const xx = L + games.length * (bw + gap);
          const yv = Y(cur.value);
          const yTop = Math.min(yv, baseY);
          const h = Math.max(3, Math.abs(yv - baseY));
          return (
            <g>
              <rect
                x={xx}
                y={yTop}
                width={bw}
                height={h}
                rx={2}
                fill={GOLD}
                opacity="0.12"
                stroke={GOLD}
                strokeDasharray="2 2"
              >
                <title>{`▶ this match ${cur.label} · line ${fmtSigned(cur.value, mode === "margin")}`}</title>
              </rect>
              <text x={xx + bw / 2} y={baseY + 10} textAnchor="middle" fontSize="8" fill={GOLD}>
                ?
              </text>
            </g>
          );
        })()}

        {/* gold dashed line = the line each game faced */}
        <polyline points={linePts.join(" ")} fill="none" stroke={GOLD} strokeWidth="1.4" strokeDasharray="4 3" opacity="0.9" />
        {games.map((g, i) => (
          <circle key={i} cx={cx(i)} cy={Y(g.line)} r="2.6" fill="var(--background)" stroke={GOLD} strokeWidth="1.5">
            <title>{g.tip}</title>
          </circle>
        ))}
        <circle cx={cx(games.length)} cy={Y(cur.value)} r="4" fill={GOLD} stroke="var(--background)" strokeWidth="1.5">
          <title>{`▶ this match ${cur.label}`}</title>
        </circle>

        <text x={W - 2} y={10} textAnchor="end" fontSize="8" fill="var(--faint)">
          recent →
        </text>
      </svg>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-faint">
        <span className="flex items-center gap-1">
          <i className="inline-block h-2 w-2 rounded-[2px]" style={{ background: GREEN }} />
          {mode === "margin" ? "covered" : "over"}
        </span>
        <span className="flex items-center gap-1">
          <i className="inline-block h-2 w-2 rounded-[2px]" style={{ background: RED }} />
          {mode === "margin" ? "didn't" : "under"}
        </span>
        <span style={{ color: GOLD }}>
          gold = line · ★ this match {fmtSigned(cur.value, mode === "margin")}
        </span>
        <span className="ml-auto">
          {hits}/{covered.length} ({covered.length ? Math.round((100 * hits) / covered.length) : 0}%)
        </span>
      </div>
    </div>
  );
}

function fmtSigned(v: number, signed: boolean) {
  return signed && v > 0 ? `+${v}` : `${v}`;
}

/**
 * The real tool's lineChartSVG: goals scored (green) vs conceded (red) per
 * recent game, oldest → recent. Away games render as hollow rings.
 */
function GoalsTrendChart({ title, form }: { title: string; form: FormGame[] }) {
  const games = form.map((g) => ({
    gf: (g.total + g.margin) / 2,
    ga: (g.total - g.margin) / 2,
    away: g.venue === "A",
    tip: `${g.venue === "H" ? "vs" : "@"} ${g.opp} ${g.score}`,
  }));
  const n = games.length;
  const W = Math.max(200, n * 30 + 34);
  const H = 132;
  const L = 22;
  const R = 10;
  const T = 10;
  const B = 18;
  const maxV = Math.max(2, ...games.flatMap((g) => [g.gf, g.ga]));
  const X = (i: number) => L + (i / (n - 1)) * (W - L - R);
  const Y = (v: number) => T + (1 - v / maxV) * (H - T - B);

  const seriesLine = (key: "gf" | "ga", col: string) => (
    <g>
      <polyline
        points={games.map((g, i) => `${X(i).toFixed(1)},${Y(g[key]).toFixed(1)}`).join(" ")}
        fill="none"
        stroke={col}
        strokeWidth="1.8"
      />
      {games.map((g, i) => (
        <circle
          key={i}
          cx={X(i)}
          cy={Y(g[key])}
          r="3.2"
          fill={g.away ? "var(--background)" : col}
          stroke={col}
          strokeWidth={g.away ? 1.6 : 0}
        >
          <title>{`${g.tip} · ${key === "gf" ? "scored" : "conceded"} ${g[key]}`}</title>
        </circle>
      ))}
    </g>
  );

  const gridVals: number[] = [];
  for (let v = 0; v <= maxV; v++) gridVals.push(v);

  return (
    <div className="rounded-lg border border-line bg-background p-3">
      <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
        {title}
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 132 }} role="img" aria-label={title}>
        {gridVals.map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={Y(v)} y2={Y(v)} stroke="var(--border)" strokeWidth="1" />
            <text x={L - 5} y={Y(v) + 3} textAnchor="end" fontSize="8" fill="var(--faint)">
              {v}
            </text>
          </g>
        ))}
        <text x={W - R} y={9} textAnchor="end" fontSize="8" fill="var(--faint)">
          recent →
        </text>
        {seriesLine("gf", GREEN)}
        {seriesLine("ga", RED)}
      </svg>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-faint">
        <span className="flex items-center gap-1">
          <i className="inline-block h-2 w-2 rounded-[2px]" style={{ background: GREEN }} /> scored
        </span>
        <span className="flex items-center gap-1">
          <i className="inline-block h-2 w-2 rounded-[2px]" style={{ background: RED }} /> conceded
        </span>
        <span>○ away</span>
        <span className="ml-auto">oldest → recent</span>
      </div>
    </div>
  );
}

/** The real tool's pctBars: label · track · fill · value rows */
function PctBars({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; pct: number; kind: "market" | "recent" }[];
}) {
  return (
    <div className="rounded-lg border border-line bg-background p-3">
      <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
        {title}
      </p>
      <div className="flex flex-col gap-1.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-2 text-xs">
            <span className="w-44 shrink-0 truncate text-right text-muted">{row.label}</span>
            <span className="h-3.5 flex-1 overflow-hidden rounded-full bg-surface-raised">
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: `${row.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="block h-full rounded-full"
                style={{ background: row.kind === "market" ? GOLD : "var(--accent)" }}
              />
            </span>
            <span className="w-10 font-mono text-faint">{row.pct}%</span>
          </div>
        ))}
      </div>
      <p className="mt-1.5 text-[10px] text-faint">
        <span style={{ color: GOLD }}>gold = market</span> · teal = recent reality
      </p>
    </div>
  );
}

function BriefCard({
  title,
  mono,
  children,
}: {
  title: string;
  mono?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 rounded-xl border border-line bg-surface-raised/50 p-4"
    >
      <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-faint">{title}</p>
      <div className={mono ? "space-y-1.5" : "space-y-2"}>{children}</div>
    </motion.div>
  );
}

function ThinkingDots() {
  return (
    <motion.span
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.2, repeat: Infinity }}
      className="text-accent"
    >
      ●●●
    </motion.span>
  );
}
