import Image from "next/image";
import { Section } from "./section";
import { Reveal } from "./reveal";
import { Parallax } from "./parallax";

export function About() {
  return (
    <Section id="about" eyebrow="Beyond the code" title="About me">
      <div className="grid items-start gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4 text-muted">
          <Reveal>
            <p>
              I&apos;m a software engineer based in Bangkok, currently building products at Puraido
              Co., Ltd. — where I started as an intern and was brought on full-time within six
              months. Day to day I work across the whole stack: React and Next.js frontends, Go and
              Node.js backends, PostgreSQL, and the AI and automation layers that tie them together.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <p>
              My path here wasn&apos;t the usual one. I spent 3.5 years studying medicine before
              switching to technology — a background that still pays off when I work on healthtech
              and clinical products, where understanding the domain matters as much as the code.
              I then earned a 50% academic scholarship studying ICT at Rangsit University while
              building real projects on the side.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <p>
              I care about clean code, practical solutions, and clear communication. When I take on
              a project, I own it end-to-end: architecture, implementation, testing, deployment,
              and honest updates along the way.
            </p>
          </Reveal>
        </div>

        <Reveal from="right">
          <Parallax amount={28} className="relative mx-auto max-w-xs">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-accent/30 to-transparent blur-lg" aria-hidden />
            <Image
              src="/images/profile.jpg"
              alt="Kaung Htet Naing"
              width={400}
              height={500}
              className="relative rounded-2xl border border-line object-cover"
            />
          </Parallax>
        </Reveal>
      </div>
    </Section>
  );
}
