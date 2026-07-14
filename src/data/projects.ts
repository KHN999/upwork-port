export type Project = {
  slug: string;
  title: string;
  /** One-line hook shown on the card */
  summary: string;
  /** 2–3 sentences: what it does, your role, and the outcome */
  description: string;
  stack: string[];
  /** Bullet points of concrete things you built / results ("Reduced X by Y%") */
  highlights: string[];
  /** "work" = professional (case study, no code), "personal" = side project */
  kind: "work" | "personal";
  links?: {
    live?: string;
    github?: string;
  };
  /** Path under /public, e.g. "/images/projects/foo.png". Omit for a generated placeholder. */
  image?: string;
  featured?: boolean;
  /** Set when the project has a full case-study page at /work/[slug] */
  caseStudy?: CaseStudy;
};

export type CaseStudy = {
  role: string;
  timeline: string;
  /** Path to an interactive demo page, if the project has one */
  demoUrl?: string;
  /** Big at-a-glance numbers shown right under the header */
  stats?: { value: string; label: string }[];
  /** 2–3 sentences setting the scene: who it's for, what problem existed */
  context: string;
  /** Scannable feature cards — the quick visual version of the build story */
  features?: { title: string; description: string }[];
  /** The main build story, split into paragraphs (collapsed behind "full write-up") */
  solution: string[];
  /** Animated pipeline shown on the page: step label + short description */
  workflow: { step: string; detail: string }[];
  /** "Hard problem → how I solved it" pairs */
  challenges: { problem: string; approach: string }[];
  /** Outcomes / results bullets */
  results: string[];
  /** Screenshot paths under /public — add later as photos arrive */
  gallery?: { src: string; caption: string; portrait?: boolean }[];
  /** Optional code/data sample rendered in a collapsible block */
  sample?: { title: string; note: string; code: string };
  /** Screen recording shown in a phone frame (autoplay, muted, looped) */
  video?: { src: string; poster: string; caption?: string };
};

// ─────────────────────────────────────────────────────────────────────────────
// PLACEHOLDER PROJECTS — replace each entry with your real projects.
// Keep the same fields; the UI adapts automatically (missing links/images are fine).
// ─────────────────────────────────────────────────────────────────────────────
export const projects: Project[] = [
  {
    slug: "football-analysis",
    title: "Football Analysis",
    summary: "End-to-end football match analytics: data pipeline, statistical & ML models, and AI-written match briefs.",
    description:
      "A personal analytics platform that collects match data, Asian handicap lines, and total lines from a public API, models each fixture with statistical and machine-learning methods, and generates AI match briefs that are cross-checked against the computed evidence — all served from a six-tab dashboard.",
    stack: ["Python", "DuckDB", "pandas", "scikit-learn", "LLM APIs", "Vanilla JS + SVG"],
    highlights: [
      "2,700+ matches collected and analyzed through an automated JSON → DuckDB pipeline",
      "Poisson and gradient-boosting models estimate a fair line for every fixture",
      "Three-stage LLM pipeline writes match briefs, then a verifier model audits them against the data",
    ],
    kind: "personal",
    featured: true,
    image: "/images/projects/football-analysis/cover.png",
    caseStudy: {
      role: "Solo developer — data collection, modeling, ML, LLM integration, and UI",
      timeline: "2025 — present · in daily use",
      demoUrl: "/work/football-analysis/demo",
      stats: [
        { value: "2,700+", label: "match snapshots" },
        { value: "60+", label: "automated scan runs" },
        { value: "~6,000", label: "lines of code" },
        { value: "0", label: "core dependencies" },
      ],
      features: [
        {
          title: "Replayable data pipeline",
          description: "Scan → immutable JSON snapshots → DuckDB. The database can always be rebuilt from raw data.",
        },
        {
          title: "Fair-line models",
          description: "Poisson goal model + scikit-learn gradient boosting, trained on leakage-free chronological features.",
        },
        {
          title: "AI briefs with a verifier",
          description: "Analyst LLMs write the brief; a verifier model rejects any claim the data doesn't support.",
        },
        {
          title: "Zero-dependency dashboard",
          description: "Python stdlib server + hand-written vanilla JS with pure-SVG charts. One command to run.",
        },
      ],
      context:
        "I wanted a single place to study football matches with real rigor: how a match's Asian handicap and total lines relate to team form, standings, and history — and whether a model can estimate those lines better than intuition. Nothing off the shelf did this, so I built it end to end. It's not a shelf project — it's the tool I open every match day: scan the upcoming window, screen the slate, read the AI briefs.",
      solution: [
        "The platform scans a rolling window of upcoming fixtures and exports each match as an immutable JSON snapshot from a public API: Asian handicap line, total (over/under) line, league standings, each team's recent results with per-game lines, and head-to-head history. Snapshots are the source of truth; a DuckDB analytics database is rebuilt from them, so the pipeline can always be replayed from raw data.",
        "On top of the data sits a modeling layer: a hand-rolled Poisson goal model blended with Elo-style team ratings and squad-strength priors, plus gradient-boosted models (scikit-learn) trained on strictly chronological, leakage-free features. The system inverts the market's published lines back into expected-goals estimates and compares them against its own fair line — surfacing the fixtures where they disagree most.",
        "An LLM layer turns the numbers into readable match briefs. It runs as a three-stage pipeline: a general analyzer, a specialist analyzer, and a final verifier model that cross-checks every conclusion against the computed evidence and rejects claims the data doesn't support. The whole thing is served by a zero-dependency Python standard-library web server with a single-file vanilla JS dashboard — including charts drawn in pure SVG.",
      ],
      workflow: [
        {
          step: "Scan",
          detail: "A scheduler sweeps a rolling time window for upcoming fixtures via a public API, handling timezone bucket edges so late kickoffs are never missed.",
        },
        {
          step: "Export",
          detail: "Each selected match becomes one immutable JSON snapshot: AH line, total line, standings, recent form with per-game lines, and head-to-head.",
        },
        {
          step: "Ingest & settle",
          detail: "Snapshots are normalized into DuckDB; once matches finish, final scores are fetched and every record is settled and scored.",
        },
        {
          step: "Model",
          detail: "Poisson + gradient-boosting models estimate a fair line per fixture and flag where it diverges from the published market line.",
        },
        {
          step: "AI briefs",
          detail: "LLMs write structured match briefs from auto-detected observations; a verifier model audits each brief against the computed evidence.",
        },
        {
          step: "Dashboard",
          detail: "A six-tab web UI shows line movement, bucket analytics, an SVG scatter of handicap × total, and the model-vs-market screener.",
        },
      ],
      challenges: [
        {
          problem: "The API's responses are compact binary payloads, not JSON",
          approach:
            "I wrote a generic, schema-free binary decoder that walks the wire format recursively and distinguishes strings from nested messages heuristically — no schema files needed — plus the request-signing scheme the API expects. Packed score arrays are decoded byte by byte.",
        },
        {
          problem: "ML that doesn't cheat: avoiding data leakage",
          approach:
            "All features are built strictly chronologically — a match only ever sees information available before kickoff. The meta-model uses expanding-window out-of-fold predictions, and every model is benchmarked honestly against both the market line and a naive baseline before it earns a place in the pipeline.",
        },
        {
          problem: "Keeping LLM output trustworthy",
          approach:
            "LLM calls retry with backoff, salvage JSON from truncated replies, and reject responses that merely echo the prompt schema. The final verifier stage re-derives each claim from the brief's computed observations and discards anything unsupported — the model is never allowed to freestyle past the data.",
        },
      ],
      sample: {
        title: "Sample export snapshot — one match, trimmed",
        note: "The exact JSON shape the scanner writes per match (form arrays trimmed to 2 of 15 entries for display). Immutable snapshots like this are the pipeline's source of truth.",
        code: `{
  "matchId": "fra-esp-20260714",
  "league": "FIFA World Cup — Semi-final",
  "kickoffAt": 1784037600000,
  "homeTeam": "France",
  "awayTeam": "Spain",
  "odds": {
    "ahLine": -0.5,
    "ahOpen": -0.25,
    "ahHome": 0.92,
    "ahAway": 0.96,
    "asianTotal": { "line": 2.5, "open": 2.25, "over": 0.88, "under": 1.0 }
  },
  "homeForm": [
    {
      "opponent": "Brazil",
      "isHome": true,
      "goalsFor": 2,
      "goalsAgainst": 1,
      "odds": { "ahLine": -0.5, "totalLine": 2.25 }
    },
    {
      "opponent": "Austria",
      "isHome": true,
      "goalsFor": 3,
      "goalsAgainst": 1,
      "odds": { "ahLine": -1.25, "totalLine": 3.0 }
    }
  ],
  "awayForm": [
    {
      "opponent": "Germany",
      "isHome": false,
      "goalsFor": 1,
      "goalsAgainst": 0,
      "odds": { "ahLine": -1.5, "totalLine": 2.5 }
    }
  ],
  "h2h": [
    { "date": "2025-10-12", "homeTeam": "Spain", "awayTeam": "France", "homeScore": 2, "awayScore": 1 },
    { "date": "2024-07-09", "homeTeam": "Spain", "awayTeam": "France", "homeScore": 2, "awayScore": 1 }
  ]
}`,
      },
      results: [
        "In daily use since 2025 — scanning fixtures and generating briefs is part of my match-day routine",
        "2,700+ match snapshots collected across 60+ automated scan runs, all replayable from immutable JSON",
        "~6,000 lines of hand-written code; the core server and scanner run on pure Python stdlib with zero dependencies to install",
        "Model estimates benchmarked transparently against market lines and naive baselines — honest evaluation built in",
      ],
    },
  },
  {
    slug: "se-map",
    title: "SE-Map",
    summary: "An interactive map of software engineering — 157 topics, 23 areas, and 7 story-driven flows that show how it all connects.",
    description:
      "A learning platform I built from scratch, with content generated by an AI pipeline I designed. Instead of teaching topics in isolation, it follows real things that happen — a web request, a login, a chat message — stop by stop, and links every stop to deep-dive topic pages, neighborhood graphs, and guided learning paths.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    highlights: [
      "157 topic pages across 23 color-coded areas, each answering the same seven questions",
      "7 interactive step-through flows (URL → page, login, deploy, real-time chat, search…)",
      "⌘K command palette, per-topic graphs, progress tracking — fully static, nothing to install",
    ],
    kind: "personal",
    featured: true,
    image: "/images/projects/se-map/home.png",
    links: {
      live: "https://se-learn.vercel.app",
    },
    caseStudy: {
      role: "Solo developer — architecture, UI, and the AI content pipeline",
      timeline: "Ongoing — structure complete, content still growing",
      stats: [
        { value: "157", label: "topic pages" },
        { value: "23", label: "color-coded areas" },
        { value: "7", label: "interactive flows" },
        { value: "13k+", label: "lines of typed content" },
      ],
      features: [
        {
          title: "Story-driven flows",
          description: "Step through a real event — a URL hit, a login, a deploy — stop by stop across the whole stack.",
        },
        {
          title: "Seven-question topics",
          description: "Every topic answers the same seven questions, so 157 pages read as one coherent map.",
        },
        {
          title: "Navigation everywhere",
          description: "⌘K palette over everything, per-topic neighborhood graphs, five guided paths with saved progress.",
        },
        {
          title: "Compile-checked content",
          description: "All content is typed TypeScript — a broken cross-link is a build error, not a dead link.",
        },
      ],
      gallery: [
        { src: "/images/projects/se-map/home.png", caption: "The map's front door — 23 areas, 157 topics, ⌘K to jump anywhere" },
        { src: "/images/projects/se-map/flow.png", caption: "A flow in action: each stop is timed, clickable, and links to its deep-dive topic" },
        { src: "/images/projects/se-map/paths.png", caption: "Guided learning paths with progress saved in the browser" },
      ],
      context:
        "Software engineering is usually taught as disconnected islands: a database course here, a networking article there. What beginners actually lack is the map — how a login, a deploy, or a chat message moves through all of those pieces at once. Coming from a non-CS background myself, that missing map was the hardest part of learning, so I built it.",
      solution: [
        "SE-Map organizes the field into 23 color-coded areas holding 157 topic pages, and every topic answers the same seven questions: where it fits, what happens, why it exists, how it works, what goes in and out, the tradeoff, and what connects to it. That uniform template is what makes the map browsable — you always know what you're looking at.",
        "The signature feature is the flows: seven end-to-end stories ('what happens when you type a URL and press Enter?', 'where does your password go?') that you step through stop by stop, with each stop linking into the relevant deep-dive topic. Navigation is everywhere-at-once: a ⌘K command palette over every flow, area, topic, and path; per-topic neighborhood graphs; five guided learning paths with progress saved in the browser; and interactive demos like an index-vs-full-table-scan simulator.",
        "The content itself is AI-generated at scale: I designed the seven-question template and the area/topic structure, then used LLMs to draft all 157 topics and the flows against that template — 13,000+ lines of output that I organize, review, and refine. Everything lives as typed TypeScript data, so a broken cross-link between topics is a compile error, not a dead link a user finds. Technically it's a fully static Next.js App Router site — no database, no auth, no external services — with four themes that persist locally.",
      ],
      workflow: [
        {
          step: "Pick an entry point",
          detail: "A guided path, a story flow, the area directory, or straight to any topic via the ⌘K palette.",
        },
        {
          step: "Step through a flow",
          detail: "Follow one real event — a request, a login, a message — stop by stop through the whole stack.",
        },
        {
          step: "Dive into a topic",
          detail: "Every stop links to a deep-dive page answering the same seven questions, so nothing floats in isolation.",
        },
        {
          step: "Explore the neighborhood",
          detail: "Each topic renders a small graph of what it connects to — the map is the curriculum.",
        },
        {
          step: "Track progress",
          detail: "Learning paths remember where you are, saved in the browser — no account needed.",
        },
      ],
      challenges: [
        {
          problem: "Making 157 topics feel like one map, not 157 articles",
          approach:
            "A strict seven-question template per topic plus typed cross-references between them. The connections live in the data model — TypeScript refuses to compile if a topic links to something that doesn't exist — which is what keeps a content base this size coherent.",
        },
        {
          problem: "Text-heavy material that still feels interactive",
          approach:
            "Every major concept gets a non-text way in: step-through flow explorers, per-topic graphs, an index-vs-table-scan simulator, animated transitions. The text is there when you want depth; the interactions carry the intuition.",
        },
        {
          problem: "Keeping it fast and free to run",
          approach:
            "Fully static architecture — no backend, no database, no auth. Progress lives in localStorage. The whole platform deploys as static pages, loads instantly, and costs nothing to host.",
        },
      ],
      results: [
        "Live and public at se-learn.vercel.app — 23 areas · 157 topics · 7 flows · 5 learning paths",
        "13,000+ lines of typed content — AI-drafted against my template, cross-links validated at compile time",
        "Fully static: no signup, nothing to install, instant loads",
      ],
    },
  },
  {
    slug: "project-two",
    title: "Placeholder: AI Agent / LLM Workflow",
    summary: "Custom AI agent automating a real business workflow.",
    description:
      "Explain what the agent does, which models/APIs it uses, and how it plugs into the client's existing tools.",
    stack: ["Python", "Node.js", "Claude API", "n8n"],
    highlights: [
      "The workflow it automates and for whom",
      "How you handled reliability (retries, structured outputs, evals)",
      "Impact — hours saved, error rate reduced, etc.",
    ],
    kind: "work",
    featured: true,
  },
  {
    slug: "agenthq-chat",
    title: "AgentHQ Chat (Mobile)",
    summary: "Production React Native chat app for a distributed agent workforce — realtime messaging, voice notes, and shift tools.",
    description:
      "A production mobile chat platform I work on at Puraido: Slack-style channels and threads for a team of agents who work in shifts. Realtime presence and read receipts, voice messages, push notifications, and workforce features like shift status and schedules — backed by an on-device database that keeps the UI instant.",
    stack: ["React Native", "Expo", "TypeScript", "WatermelonDB", "Supabase", "Sentry"],
    highlights: [
      "Realtime layer: live messages, typing, presence, and read receipts over broadcast channels + WebSockets",
      "Rich messaging: threads, reactions, file uploads with thumbnails, voice recording & playback",
      "Built for shift work: schedules, shift status, announcements, activity feed, and role-based permissions",
      "Native polish: iOS 26 Liquid Glass design — translucent, blurred materials throughout the UI",
    ],
    kind: "work",
    image: "/images/projects/agenthq-cover.jpg",
    caseStudy: {
      role: "Software Engineer at Puraido — mobile app inside a product monorepo (Go backend · web dashboards)",
      timeline: "2025 — present",
      video: {
        src: "/videos/agent-chat-demo.mp4",
        poster: "/videos/agent-chat-demo-poster.jpg",
        caption:
          "Real screen recording from a test environment: channels, live messaging with read receipts, media viewer, and the shift schedule.",
      },
      stats: [
        { value: "48k+", label: "lines of TypeScript" },
        { value: "14", label: "screens" },
        { value: "24/7", label: "shift operations" },
        { value: "6", label: "local data models" },
      ],
      context:
        "At Puraido, a distributed team of chat agents works around the clock in shifts. They needed more than a group chat: an internal tool with the polish of Slack, plus the operational layer around it — who's on shift, schedules, announcements — all fast enough on a phone to be the thing agents actually live in during a workday.",
      features: [
        {
          title: "Realtime everything",
          description:
            "Broadcast channels plus a custom WebSocket layer drive live messages, typing indicators, online presence, and read receipts.",
        },
        {
          title: "Rich messaging",
          description:
            "Channels, threads, reactions, file uploads with thumbnail generation, and voice notes with dedicated recording and playback managers.",
        },
        {
          title: "Built for shift work",
          description:
            "Shift status and schedule screens, an activity feed, announcements, and role-based permissions — plus push notifications and Sentry monitoring.",
        },
        {
          title: "Instant by architecture",
          description:
            "An on-device WatermelonDB database backs every screen — lists render from local data immediately while a sync service keeps it fresh.",
        },
        {
          title: "iOS 26 Liquid Glass UI",
          description:
            "Adopts Apple's latest design language — translucent, blurred glass materials — so the app feels native, not embedded.",
        },
        {
          title: "Production scaffolding",
          description:
            "Push notifications, role-based permissions, a central error-handling service, and Sentry crash reporting.",
        },
      ],
      solution: [
        "The app is built with React Native and Expo on a strict TypeScript codebase (~48,000 lines across 143 files). At its heart is the realtime layer: broadcast channel subscriptions for room-level events and a custom WebSocket client for the chat protocol — typing indicators, online status, and read receipts each have dedicated managers that batch and debounce updates to stay battery-friendly.",
        "Under the UI sits a WatermelonDB on-device database holding agents, threads, messages, reactions, and room members. Screens render from local data immediately — no spinners on every navigation — while a sync service keeps the cache consistent with the backend, and user actions write optimistically so the interface never waits on the network.",
        "Messaging is full-featured: channel and thread conversations, emoji reactions, document and image uploads with client-side thumbnail generation, and voice messages with a recording service and a playback manager that handles audio focus. Around the chat core sit the workforce features — shift status, schedules, announcements, an activity feed, member and permission management — and the production scaffolding: push notifications, error-handling service, and Sentry crash reporting. Visually, the app adopts iOS 26's Liquid Glass design language — translucent, blurred materials on navigation and surfaces — so it feels native to the OS rather than like a web view in a shell.",
      ],
      workflow: [
        {
          step: "Compose",
          detail: "A message writes optimistically to the on-device database — the UI updates instantly.",
        },
        {
          step: "Deliver",
          detail: "The realtime layer pushes it out; the backend fans it to every room member's device.",
        },
        {
          step: "Merge",
          detail: "Peers store the event in their own local databases — every screen reads from local data.",
        },
        {
          step: "Confirm",
          detail: "Read receipts and presence flow back, batched and debounced to protect battery life.",
        },
        {
          step: "Coordinate",
          detail: "Around the chat core: shift status, schedules, announcements, and the activity feed.",
        },
      ],
      challenges: [
        {
          problem: "A chat UI that feels instant on mid-range phones",
          approach:
            "Every screen reads from the on-device database instead of waiting on the network, long lists are virtualized with FlashList, and images render from client-generated thumbnails. The data layer has its own test suite covering the message, thread, and sync services.",
        },
        {
          problem: "Realtime features that don't drain the battery",
          approach:
            "Presence, typing, and read receipts are handled by dedicated managers that batch and debounce over the WebSocket connection instead of firing per-event — chat feels instant without keeping the radio hot.",
        },
        {
          problem: "Media on mobile networks",
          approach:
            "Voice notes get a dedicated recording service and playback manager; images and documents upload with client-side thumbnails so lists render instantly and full files load lazily.",
        },
      ],
      results: [
        "In production as the daily communication tool for a distributed agent team",
        "48,000+ lines of strictly typed code — 14 screens, 6 local data models",
        "Instant-feeling UI — every screen renders from the on-device database, no per-navigation spinners",
        "Part of a larger monorepo I work across: Go backend, web dashboards, and this app",
      ],
    },
  },
  {
    slug: "lgy-shop-system",
    title: "LGY — Shop Management & POS",
    summary: "Full business-control system for a real textile shop in Yangon — POS, inventory, supply chain, debts, and daily cash close.",
    description:
      "My father runs a longyi (Burmese textile) wholesale & retail shop in Theingyi Market, Yangon. I built the system that runs it: point-of-sale, inventory, suppliers and tailors, customer credit ledgers, expenses, and an end-of-day cash reconciliation — with a Burmese-only UI designed for non-technical shop staff.",
    stack: ["Next.js", "NestJS", "TypeScript", "Prisma", "PostgreSQL", "Cloudflare R2"],
    highlights: [
      "26 database models covering the entire business: sales, stock, suppliers, tailors, drivers, debts, expenses",
      "Two role-based apps in one: a 22-screen admin back office and a mobile-first staff POS",
      "100% Burmese UI built for non-technical users — my dad's staff, not developers",
    ],
    kind: "work",
    image: "/images/projects/lgy/admin-dashboard.png",
    caseStudy: {
      role: "Solo developer — my first real client was my dad: requirements, build, deploy, support",
      timeline: "2025 — ongoing",
      stats: [
        { value: "26", label: "database models" },
        { value: "30+", label: "screens (admin + staff)" },
        { value: "38k+", label: "lines of TypeScript" },
        { value: "မြန်မာ", label: "100% Burmese UI" },
      ],
      context:
        "My father's shop in Theingyi Market ran on paper: notebooks for credit customers, memory for stock, and an evening of mental math to close the till. Textile wholesale is genuinely complex — bulk fabric goes out to tailors and comes back as finished longyis, customers buy on credit, stock moves between the shop and the warehouse. I built the system that holds all of it.",
      features: [
        {
          title: "Point of sale & credit",
          description:
            "A fast staff sell screen with per-customer credit ledgers — partial payments, outstanding debts, and returns all tracked.",
        },
        {
          title: "Real inventory control",
          description:
            "Opening stock, goods received, shop↔warehouse transfers, stock counts, and an exceptions system for when the count doesn't match.",
        },
        {
          title: "The whole supply chain",
          description:
            "Suppliers with orders, receipts, and payment tracking; tailors with charges and payments; drivers and employees.",
        },
        {
          title: "Daily close",
          description:
            "End-of-day reconciliation: expected vs actual cash, expenses, and the day's numbers — replacing an evening of mental math.",
        },
        {
          title: "Mobile-first staff POS",
          description:
            "The staff app is designed phone-first — big color-coded tiles, large tap targets, one-handed use at the counter — while admin gets a full desktop back office.",
        },
        {
          title: "Production deployment",
          description:
            "Turborepo monorepo — Next.js on Vercel, NestJS + Postgres on Railway, product photos on Cloudflare R2, JWT auth, audit log.",
        },
      ],
      solution: [
        "LGY is a Turborepo monorepo with a Next.js App Router frontend, a NestJS API where all business logic lives, and a shared Prisma package defining 26 models — everything from sales lines and inventory events to tailor charges and stock-exception records. The web app splits into two role-based experiences: /admin (22 screens of back office: suppliers, tailors, expenses, exports, audit, settings) and /staff (a focused POS: sell, receive, transfer, debts, daily close).",
        "The domain modeling is the heart of it. A longyi business isn't a generic retail template: fabric goes to tailors and returns as finished goods with charges to settle; wholesale customers carry running credit balances paid down over months; stock lives in two places and moves between them. Inventory is event-sourced — every movement is an InventoryEvent with lines — so current stock is always derivable and auditable, and mismatches at count time become tracked StockExceptions instead of silent shrinkage.",
        "Because the users are non-technical shop staff, the UI is Burmese-only with every string centralized in one labels file. The two roles got two different design philosophies: admin is a desktop back office, but the staff POS is mobile-first — a home screen of six big color-coded tiles, large forgiving tap targets, and flows built for one-handed use on a phone at the counter, hiding everything that isn't a daily task. Money integrity gets special care: a DailyClose model reconciles expected against counted cash, every sensitive action lands in an AuditLog, and admin can export the books. It runs in production on Vercel and Railway with product photos on Cloudflare R2.",
      ],
      workflow: [
        {
          step: "Open the day",
          detail: "Staff confirm opening stock; yesterday's close is the baseline.",
        },
        {
          step: "Sell",
          detail: "POS sales in cash or on credit — customer ledgers update instantly, returns handled in place.",
        },
        {
          step: "Move stock",
          detail: "Goods received from suppliers and tailors, transfers between shop and warehouse — every movement is an event.",
        },
        {
          step: "Settle",
          detail: "Customer debt payments, supplier and tailor payments, and the day's expenses get recorded as they happen.",
        },
        {
          step: "Close the till",
          detail: "Daily close compares expected cash against the drawer — differences are visible, not mysterious.",
        },
      ],
      challenges: [
        {
          problem: "Users who have never used business software",
          approach:
            "Burmese-only interface with all strings in one reviewed labels file, a staff app stripped to daily tasks only, big mobile-friendly controls, and flows that mirror how the shop already works — the software adapted to the shop, not the other way around.",
        },
        {
          problem: "Modeling a real textile business, not a template",
          approach:
            "Tailor send-outs and charges, wholesale credit ledgers, two stock locations, and returns don't fit an off-the-shelf POS. I designed 26 models around the actual flows, with event-sourced inventory so stock is always explainable.",
        },
        {
          problem: "Numbers the family can trust",
          approach:
            "Daily cash reconciliation, stock-count exceptions that must be resolved rather than ignored, an audit log on sensitive actions, and exportable books — when it's your family's money, 'roughly right' isn't good enough.",
        },
      ],
      gallery: [
        {
          src: "/images/projects/lgy/admin-dashboard.png",
          caption:
            "The admin dashboard (shown in sandbox mode with practice data): revenue, cash in/out, and sales-vs-expenses — entirely in Burmese for the shop's staff",
        },
        {
          src: "/images/projects/lgy/admin-customers.png",
          caption:
            "Customer management with a top-debtors chart — wholesale buyers carry running credit balances, so debt visibility matters",
        },
        {
          src: "/images/projects/lgy/staff-pos-home.png",
          caption:
            "The staff POS home — mobile-first by design: six big color-coded tiles for the day's tasks, used one-handed at the counter",
          portrait: true,
        },
      ],
      results: [
        "Runs a real shop's daily operations — sales, stock, debts, and the evening close",
        "26 Prisma models, 25+ NestJS modules, 38,000+ lines of TypeScript in a Turborepo monorepo",
        "Deployed and maintained in production: Vercel, Railway (Singapore), Cloudflare R2",
        "Replaced paper notebooks and mental math with auditable, exportable records",
      ],
    },
  },
];
