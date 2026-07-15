import { testimonials } from "@/data/testimonials";
import { Section } from "./section";
import { Reveal } from "./reveal";

export function Testimonials() {
  return (
    <Section
      id="testimonials"
      eyebrow="Kind words"
      title="What people say"
      description="From a colleague at Puraido — and a client whose business runs on my work."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.1}>
            <figure className="flex h-full flex-col rounded-2xl border border-line bg-surface p-6 sm:p-8">
              <span className="font-serif text-5xl leading-none text-accent" aria-hidden>
                &ldquo;
              </span>
              <blockquote className="mt-2 flex-1 leading-relaxed text-muted">{t.quote}</blockquote>
              <figcaption className="mt-6 border-t border-line pt-4">
                <p className="font-semibold">{t.name}</p>
                <p className="mt-0.5 text-sm text-faint">{t.role}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
