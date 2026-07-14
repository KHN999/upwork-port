// ─────────────────────────────────────────────────────────────────────────────
// Hardcoded data for the Football Analysis interactive demo.
// Everything here is a frozen snapshot shaped like the real tool's output —
// no live API calls, purely a simulation of the actual flow.
// ─────────────────────────────────────────────────────────────────────────────

export type DemoMatch = {
  id: string;
  league: string;
  kickoff: string;
  home: string;
  away: string;
  /** Asian handicap line (home-relative): open → current */
  ahOpen: number;
  ah: number;
  /** Hong Kong odds for each AH side */
  ahHome: number;
  ahAway: number;
  /** Total (over/under) line: open → current */
  totalOpen: number;
  total: number;
  over: number;
  under: number;
  featured?: boolean;
};

export const demoMatches: DemoMatch[] = [
  {
    id: "fra-esp",
    league: "FIFA World Cup — Semi-final",
    kickoff: "21:00",
    home: "France",
    away: "Spain",
    ahOpen: -0.25,
    ah: -0.5,
    ahHome: 0.92,
    ahAway: 0.96,
    totalOpen: 2.25,
    total: 2.5,
    over: 0.88,
    under: 1.0,
    featured: true,
  },
  {
    id: "fla-pal",
    league: "Brazil — Série A",
    kickoff: "02:30",
    home: "Flamengo",
    away: "Palmeiras",
    ahOpen: -0.5,
    ah: -0.5,
    ahHome: 0.98,
    ahAway: 0.9,
    totalOpen: 2.25,
    total: 2.25,
    over: 0.95,
    under: 0.93,
  },
  {
    id: "gre-int",
    league: "Brazil — Série A",
    kickoff: "04:00",
    home: "Grêmio",
    away: "Internacional",
    ahOpen: 0,
    ah: 0.25,
    ahHome: 0.93,
    ahAway: 0.95,
    totalOpen: 2.0,
    total: 2.0,
    over: 0.9,
    under: 0.98,
  },
  {
    id: "rac-lan",
    league: "Argentina — Liga Profesional",
    kickoff: "05:15",
    home: "Racing Club",
    away: "Lanús",
    ahOpen: -0.75,
    ah: -0.75,
    ahHome: 0.88,
    ahAway: 1.0,
    totalOpen: 2.25,
    total: 2.25,
    over: 0.92,
    under: 0.96,
  },
  {
    id: "mia-lag",
    league: "USA — MLS",
    kickoff: "07:30",
    home: "Inter Miami",
    away: "LA Galaxy",
    ahOpen: -1.0,
    ah: -0.75,
    ahHome: 0.97,
    ahAway: 0.91,
    totalOpen: 3.0,
    total: 3.0,
    over: 0.94,
    under: 0.94,
  },
  {
    id: "kaw-ura",
    league: "Japan — J1 League",
    kickoff: "17:00",
    home: "Kawasaki Frontale",
    away: "Urawa Reds",
    ahOpen: -0.25,
    ah: -0.25,
    ahHome: 0.9,
    ahAway: 0.98,
    totalOpen: 2.75,
    total: 2.5,
    over: 1.0,
    under: 0.88,
  },
  {
    id: "mal-aik",
    league: "Sweden — Allsvenskan",
    kickoff: "23:00",
    home: "Malmö FF",
    away: "AIK",
    ahOpen: -1.0,
    ah: -1.0,
    ahHome: 0.94,
    ahAway: 0.94,
    totalOpen: 2.75,
    total: 2.75,
    over: 0.91,
    under: 0.97,
  },
  {
    id: "bod-ros",
    league: "Norway — Eliteserien",
    kickoff: "00:00",
    home: "Bodø/Glimt",
    away: "Rosenborg",
    ahOpen: -1.25,
    ah: -1.5,
    ahHome: 0.95,
    ahAway: 0.93,
    totalOpen: 3.25,
    total: 3.25,
    over: 0.96,
    under: 0.92,
  },
];

export type ScreenerRow = {
  matchId: string;
  /** Market-implied supremacy (λ home − λ away) after de-vigging */
  marketSup: number;
  /** Model's fair supremacy */
  fairSup: number;
  /** Market-implied total vs model's fair total */
  marketTotal: number;
  fairTotal: number;
  /** The larger divergence, in goals, and the resulting lean */
  edge: number;
  angle: string;
  detail: string;
  /** Meta-model score — ranking aid, not a promise */
  meta: number;
};

export const screenerRows: ScreenerRow[] = [
  {
    matchId: "fra-esp",
    marketSup: 0.5,
    fairSup: 0.78,
    marketTotal: 2.5,
    fairTotal: 2.71,
    edge: 0.28,
    angle: "France −0.5",
    detail: "beats own AH line 64% vs market 52%",
    meta: 61,
  },
  {
    matchId: "kaw-ura",
    marketSup: 0.24,
    fairSup: 0.05,
    marketTotal: 2.5,
    fairTotal: 2.74,
    edge: 0.24,
    angle: "Over 2.5",
    detail: "beats own total line 61% vs market 47%",
    meta: 57,
  },
  {
    matchId: "mia-lag",
    marketSup: 0.71,
    fairSup: 0.92,
    marketTotal: 3.0,
    fairTotal: 3.12,
    edge: 0.21,
    angle: "Inter Miami −0.75",
    detail: "beats own AH line 60% vs market 51%",
    meta: 55,
  },
  {
    matchId: "gre-int",
    marketSup: -0.22,
    fairSup: -0.05,
    marketTotal: 2.0,
    fairTotal: 2.14,
    edge: 0.17,
    angle: "Grêmio +0.25",
    detail: "beats own AH line 58% vs market 49%",
    meta: 53,
  },
  {
    matchId: "bod-ros",
    marketSup: 1.42,
    fairSup: 1.28,
    marketTotal: 3.25,
    fairTotal: 3.11,
    edge: -0.14,
    angle: "Rosenborg +1.5",
    detail: "beats own AH line 55% vs market 48%",
    meta: 52,
  },
  {
    matchId: "fla-pal",
    marketSup: 0.48,
    fairSup: 0.39,
    marketTotal: 2.25,
    fairTotal: 2.13,
    edge: -0.12,
    angle: "Under 2.25",
    detail: "beats own total line 54% vs market 49%",
    meta: 51,
  },
  {
    matchId: "rac-lan",
    marketSup: 0.69,
    fairSup: 0.61,
    marketTotal: 2.25,
    fairTotal: 2.2,
    edge: -0.08,
    angle: "Lanús +0.75",
    detail: "beats own AH line 52% vs market 50%",
    meta: 50,
  },
  {
    matchId: "mal-aik",
    marketSup: 0.95,
    fairSup: 0.99,
    marketTotal: 2.75,
    fairTotal: 2.78,
    edge: 0.04,
    angle: "Malmö −1.0",
    detail: "beats own AH line 51% vs market 50%",
    meta: 50,
  },
];

export type AiBrief = {
  matchId: string;
  observations: string[];
  modelReadout: { label: string; market: string; model: string; note: string }[];
  analystConclusion: string[];
  verifier: {
    verdict: "confirmed" | "partially confirmed" | "rejected";
    accepted: string[];
    rejected: { claim: string; reason: string }[];
  };
};

export const aiBrief: AiBrief = {
  matchId: "fra-esp",
  observations: [
    "AH line moved −0.25 → −0.5 toward France in the last 24h; the total held at 2.5.",
    "France covered their line in 5 of their last 7 — opponent-adjusted cover rate 64% vs the market's implied 52%.",
    "Spain are unbeaten in 9, but faced much softer lines over that run (avg −1.25 vs today's +0.5) — streak discounted.",
    "3 of the last 4 head-to-head meetings stayed under 2.5 goals — oldest is >2 years, weight reduced.",
    "Knockout context: both sides' last 3 tournament games averaged 2.0 goals, below their league-season baselines.",
  ],
  modelReadout: [
    {
      label: "Supremacy",
      market: "+0.50",
      model: "+0.78",
      note: "model rates France ~0.3 goals stronger than the line implies",
    },
    {
      label: "Total",
      market: "2.50",
      model: "2.71",
      note: "mild lean to more goals — inside noise range",
    },
  ],
  analystConclusion: [
    "Primary read: France −0.5 — the line move, opponent-adjusted cover rates, and the model's supremacy gap all point the same direction.",
    "Secondary read: Over 2.5 — the model leans over, but the margin (+0.21) is thin.",
  ],
  verifier: {
    verdict: "partially confirmed",
    accepted: [
      "France −0.5 — supported by three independent signals: line movement, 64% vs 52% cover gap, and model supremacy +0.28.",
    ],
    rejected: [
      {
        claim: "Over 2.5",
        reason:
          "Contradicted by knockout tempo (2.0 goals avg) and the H2H under-pattern; the +0.21 model edge is below the evidence threshold. Discarded.",
      },
    ],
  },
};

// Recent-form data for the featured match's detail charts — mirrors the real
// tool's totalChart/ahChart: each past game vs the line THAT game faced.
export type FormGame = {
  opp: string;
  venue: "H" | "A";
  score: string;
  /** goal margin for the team (gf − ga) */
  margin: number;
  /** margin needed to cover that game's own AH line (−team handicap) */
  ahNeed: number;
  ahResult: "over" | "under" | "push";
  /** total goals in that game */
  total: number;
  /** that game's own total line */
  totalLine: number;
  totalResult: "over" | "under" | "push";
};

/** oldest → newest */
export const franceForm: FormGame[] = [
  { opp: "Ukraine", venue: "H", score: "2-1", margin: 1, ahNeed: 0.5, ahResult: "over", total: 3, totalLine: 2.5, totalResult: "over" },
  { opp: "Senegal", venue: "A", score: "2-0", margin: 2, ahNeed: 1, ahResult: "over", total: 2, totalLine: 2.75, totalResult: "under" },
  { opp: "Croatia", venue: "H", score: "1-1", margin: 0, ahNeed: 0.75, ahResult: "under", total: 2, totalLine: 2.25, totalResult: "under" },
  { opp: "Mexico", venue: "H", score: "2-1", margin: 1, ahNeed: 0.5, ahResult: "over", total: 3, totalLine: 2.5, totalResult: "over" },
  { opp: "Uruguay", venue: "A", score: "1-1", margin: 0, ahNeed: 0.25, ahResult: "under", total: 2, totalLine: 2.5, totalResult: "under" },
  { opp: "Austria", venue: "H", score: "3-1", margin: 2, ahNeed: 1.25, ahResult: "over", total: 4, totalLine: 3, totalResult: "over" },
  { opp: "Brazil", venue: "H", score: "2-1", margin: 1, ahNeed: 0.5, ahResult: "over", total: 3, totalLine: 2.25, totalResult: "over" },
];

export const spainForm: FormGame[] = [
  { opp: "Norway", venue: "H", score: "3-1", margin: 2, ahNeed: 1.5, ahResult: "over", total: 4, totalLine: 2.75, totalResult: "over" },
  { opp: "Poland", venue: "A", score: "2-1", margin: 1, ahNeed: 1.25, ahResult: "under", total: 3, totalLine: 2.5, totalResult: "over" },
  { opp: "Serbia", venue: "H", score: "2-1", margin: 1, ahNeed: 1, ahResult: "push", total: 3, totalLine: 2.75, totalResult: "over" },
  { opp: "Canada", venue: "H", score: "3-1", margin: 2, ahNeed: 1.75, ahResult: "over", total: 4, totalLine: 3, totalResult: "over" },
  { opp: "Morocco", venue: "A", score: "1-0", margin: 1, ahNeed: 0.75, ahResult: "over", total: 1, totalLine: 2.25, totalResult: "under" },
  { opp: "Italy", venue: "H", score: "2-0", margin: 2, ahNeed: 1.25, ahResult: "over", total: 2, totalLine: 2.5, totalResult: "under" },
  { opp: "Germany", venue: "A", score: "1-0", margin: 1, ahNeed: 1.5, ahResult: "under", total: 1, totalLine: 2.5, totalResult: "under" },
];

/** This match, from each team's perspective (gold "?" slot in the charts) */
export const currentSlot = {
  france: { ahNeed: 0.5, totalLine: 2.5, label: "vs Spain" },
  spain: { ahNeed: -0.5, totalLine: 2.5, label: "@ France" },
};

/** Market-vs-recent percent bars, like the real tool's pctBars */
export const pctGroups: { title: string; rows: { label: string; pct: number; kind: "market" | "recent" }[] }[] = [
  {
    title: "Over 2.5 — market vs recent (Asian total)",
    rows: [
      { label: "market (de-vig)", pct: 47, kind: "market" },
      { label: "France recent", pct: 43, kind: "recent" },
      { label: "Spain recent", pct: 43, kind: "recent" },
      { label: "head-to-head", pct: 25, kind: "recent" },
    ],
  },
  {
    title: "Asian handicap cover — market vs recent",
    rows: [
      { label: "market implied (France)", pct: 52, kind: "market" },
      { label: "France cover (opp-adjusted)", pct: 64, kind: "recent" },
      { label: "Spain cover (opp-adjusted)", pct: 57, kind: "recent" },
    ],
  },
];

/** Simulated scan-log lines shown while the fake scan runs */
export const scanLog = [
  "querying fixtures 14 Jul 21:00 → 15 Jul 13:00 (UTC+7)…",
  "8 fixtures found across 7 competitions",
  "fetching AH lines, total lines & match data from public API…",
  "parsing standings · recent form · head-to-head…",
  "writing 8 immutable JSON snapshots → exports/2026-07-14_2100/",
  "done in 3.4s",
];
