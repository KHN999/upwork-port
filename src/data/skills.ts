export type SkillGroup = {
  label: string;
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    label: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "TanStack Query"],
  },
  {
    label: "Mobile",
    skills: ["React Native", "Expo", "Firebase"],
  },
  {
    label: "Backend",
    skills: ["Node.js", "Go", "Python", "REST APIs", "WebSockets"],
  },
  {
    label: "Data & Storage",
    skills: ["PostgreSQL", "Supabase", "MongoDB", "Redis", "Data Analytics"],
  },
  {
    label: "AI & Automation",
    skills: ["AI Agents", "LLM Integration", "Prompt Engineering", "n8n", "Workflow Automation"],
  },
];

export const services = [
  {
    title: "Full-Stack Development",
    description: "Web apps end-to-end — frontend, APIs, database, deployment.",
  },
  {
    title: "AI Agents & LLM Integration",
    description: "Custom agents, structured outputs, and LLM features that actually ship.",
  },
  {
    title: "Dashboards & Data Analytics",
    description: "Turn raw data into dashboards and reports people act on.",
  },
  {
    title: "Mobile Apps",
    description: "Cross-platform apps with React Native, from prototype to store.",
  },
  {
    title: "Workflow Automation",
    description: "Connect your tools and remove repetitive manual work with n8n and code.",
  },
  {
    title: "Performance & Bug Fixing",
    description: "Find the bottleneck or the bug, fix it, and leave the code cleaner.",
  },
];
