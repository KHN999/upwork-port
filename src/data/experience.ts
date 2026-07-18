export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  location: string;
  points: string[];
};

export const experience: ExperienceItem[] = [
  {
    company: "Puraido Co., Ltd.",
    role: "Software Engineer",
    period: "Dec 2025 — Present",
    location: "Bangkok, Thailand",
    points: [
      "Building and operating a chat platform serving 1,000,000+ users with ~400 new signups a day — Go backend services, Remix web apps, and React Native mobile.",
      "Owning features end-to-end across the product monorepo: database schema, APIs, dashboards, and the AgentHQ Chat mobile app.",
    ],
  },
  {
    company: "Puraido Co., Ltd.",
    role: "Software Engineer Intern",
    period: "Jun 2025 — Nov 2025",
    location: "Bangkok, Thailand",
    points: [
      "Built two production mobile apps adopted by all employees — shipped, not shelved.",
      "Promoted to full-time Software Engineer after 6 months.",
    ],
  },
];

export type EducationItem = {
  school: string;
  degree: string;
  period: string;
  note?: string;
};

export const education: EducationItem[] = [
  {
    school: "Rangsit University",
    degree: "B.Sc. Information & Communication Technology",
    period: "2023 — 2025",
    note: "50% academic excellence scholarship",
  },
  {
    school: "University of Medicine 1, Yangon",
    degree: "MBBS (3.5 years, preclinical completed)",
    period: "2016 — 2020",
    note: "Medical background — useful context for healthtech products",
  },
];
