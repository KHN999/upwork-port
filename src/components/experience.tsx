import { experience, education } from "@/data/experience";
import { Section } from "./section";
import { Reveal } from "./reveal";

export function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="Track record"
      title="Experience"
      description="Where I've worked and what I studied along the way."
    >
      <div className="grid gap-12 lg:grid-cols-[3fr_2fr]">
        <div className="relative space-y-8 border-l border-line pl-8">
          {experience.map((item, i) => (
            <Reveal key={`${item.role}-${item.period}`} delay={i * 0.1} from="left">
              <div className="relative">
                <span className="absolute -left-[37px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-accent" />
                <p className="font-mono text-xs text-faint">{item.period}</p>
                <h3 className="mt-1 font-semibold">
                  {item.role} <span className="font-normal text-muted">· {item.company}</span>
                </h3>
                <p className="text-sm text-faint">{item.location}</p>
                <ul className="mt-3 space-y-1.5">
                  {item.points.map((point) => (
                    <li key={point} className="flex gap-2 text-sm text-muted">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="space-y-4">
          <Reveal from="right">
            <h3 className="font-mono text-xs uppercase tracking-wider text-faint">Education</h3>
          </Reveal>
          {education.map((item, i) => (
            <Reveal key={item.school} delay={i * 0.1} from="right">
              <div className="rounded-2xl border border-line bg-surface p-5">
                <p className="font-mono text-xs text-faint">{item.period}</p>
                <h4 className="mt-1 text-sm font-semibold">{item.school}</h4>
                <p className="mt-0.5 text-sm text-muted">{item.degree}</p>
                {item.note && <p className="mt-2 text-xs text-accent">{item.note}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
