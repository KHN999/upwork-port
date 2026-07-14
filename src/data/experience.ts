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
      // TODO: replace with 2–3 concrete things you own/shipped at Puraido
      "Building and shipping full-stack features across web and backend systems.",
      "Working with TypeScript, Go, and PostgreSQL in a production environment.",
    ],
  },
  {
    company: "Puraido Co., Ltd.",
    role: "Software Engineer Intern",
    period: "Jun 2025 — Nov 2025",
    location: "Bangkok, Thailand",
    points: [
      "Contributed production code from week one across frontend and backend.",
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
