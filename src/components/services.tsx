import { services } from "@/data/skills";
import { Section } from "./section";
import { Reveal } from "./reveal";

export function Services() {
  return (
    <Section
      id="services"
      eyebrow="What I do"
      title="Services"
      description="The kinds of problems clients bring me — and what I deliver."
    >
      {/* Mobile: lean numbered list — lighter to scan than six stacked cards */}
      <div className="divide-y divide-line border-y border-line sm:hidden">
        {services.map((service, i) => (
          <Reveal key={service.title} delay={i * 0.05}>
            <div className="flex gap-4 py-5">
              <span className="mt-0.5 font-mono text-xs text-accent">0{i + 1}</span>
              <div>
                <h3 className="font-semibold">{service.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{service.description}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Desktop: card grid */}
      <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <Reveal key={service.title} delay={(i % 3) * 0.08}>
            <div className="group h-full rounded-2xl border border-line bg-surface p-6 transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_8px_30px_-12px_var(--accent-glow)]">
              <span className="font-mono text-xs text-faint">0{i + 1}</span>
              <h3 className="mt-2 font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{service.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
