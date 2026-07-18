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
              I&apos;m a software engineer based in Bangkok, working at Puraido Co., Ltd. Day to
              day I build across the whole stack — Go and Node.js backends, React and Remix on the
              web, React Native on mobile — and outside work I take on freelance projects for real
              businesses.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <p>
              My path into software wasn&apos;t the usual one: I studied medicine for a few years
              before switching to technology and completing an ICT degree in Bangkok. The medical
              background still comes in useful when I work on health-related products, where
              understanding the domain matters as much as the code.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <p>
              I try to keep things simple: understandable code, honest timelines, and clear
              communication. When I take on a project, I stay with it — from the first
              conversation through deployment and support.
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
