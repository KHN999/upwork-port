import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { WorkflowDiagram } from "@/components/workflow-diagram";
import { PhoneVideo } from "@/components/phone-video";

export function generateStaticParams() {
  return projects.filter((p) => p.caseStudy).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${site.name}`,
    description: project.summary,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project?.caseStudy) notFound();
  const cs = project.caseStudy;

  return (
    <>
      <Header />
      <main className="px-6 pb-24 pt-32">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <Link
              href="/#work"
              className="font-mono text-sm text-muted transition-colors hover:text-accent"
            >
              ← back to all work
            </Link>

            <div className="mt-8 flex items-center gap-3">
              <span className="rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-muted">
                {project.kind === "work" ? "Client work" : "Personal project"}
              </span>
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              {project.title}
              <span className="text-accent">.</span>
            </h1>
            <p className="mt-4 text-lg text-muted">{project.summary}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10 grid gap-6 rounded-2xl border border-line bg-surface p-6 sm:grid-cols-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-faint">Role</p>
                <p className="mt-1 text-sm font-medium">{cs.role}</p>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-faint">Timeline</p>
                <p className="mt-1 text-sm font-medium">{cs.timeline}</p>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-faint">Links</p>
                <div className="mt-1 flex gap-3 text-sm font-medium">
                  {cs.demoUrl && (
                    <Link href={cs.demoUrl} className="text-accent hover:underline">
                      Demo →
                    </Link>
                  )}
                  {project.links?.live && (
                    <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                      Live ↗
                    </a>
                  )}
                  {project.links?.github && (
                    <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                      Code ↗
                    </a>
                  )}
                  {!project.links?.live && !project.links?.github && !cs.demoUrl && (
                    <span className="text-sm text-faint">Private codebase</span>
                  )}
                </div>
              </div>
              <div className="sm:col-span-3">
                <p className="font-mono text-[11px] uppercase tracking-wider text-faint">Stack</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span key={tech} className="rounded-md bg-surface-raised px-2 py-1 font-mono text-[11px] text-muted">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {cs.stats && (
            <Reveal delay={0.15}>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {cs.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-line bg-surface p-4 text-center"
                  >
                    <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
                      {stat.value}
                      <span className="text-accent">.</span>
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-faint">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          <CaseSection title="Context">
            <p className="leading-relaxed text-muted">{cs.context}</p>
          </CaseSection>

          <CaseSection title="What I built">
            {cs.features && (
              <div className="grid gap-3 sm:grid-cols-2">
                {cs.features.map((feature, i) => (
                  <div key={feature.title} className="rounded-xl border border-line bg-surface p-5">
                    <p className="font-mono text-xs text-accent">0{i + 1}</p>
                    <h3 className="mt-1 font-semibold">{feature.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{feature.description}</p>
                  </div>
                ))}
              </div>
            )}
            <details className="group mt-4">
              <summary className="cursor-pointer select-none list-none font-mono text-sm text-accent hover:underline [&::-webkit-details-marker]:hidden">
                <span className="group-open:hidden">▸ read the full write-up</span>
                <span className="hidden group-open:inline">▾ hide the full write-up</span>
              </summary>
              <div className="mt-4 space-y-4 border-l-2 border-line pl-5">
                {cs.solution.map((para) => (
                  <p key={para.slice(0, 32)} className="leading-relaxed text-muted">
                    {para}
                  </p>
                ))}
              </div>
            </details>
          </CaseSection>

          <CaseSection title="How it works">
            <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
              <WorkflowDiagram steps={cs.workflow} />
            </div>
          </CaseSection>

          {cs.demoUrl ? (
            <Reveal>
              <Link
                href={cs.demoUrl}
                className="group mt-14 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-accent/40 bg-accent-soft/50 p-6 transition-colors hover:border-accent sm:p-8"
              >
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-accent">
                    Interactive demo
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">
                    Don&apos;t take my word for it — run the flow yourself
                  </h2>
                  <p className="mt-1 max-w-lg text-sm text-muted">
                    Scan a match window, screen the slate, and read the AI&apos;s verified brief — a
                    faithful simulation of the real tool.
                  </p>
                </div>
                <span className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition-transform group-hover:scale-[1.05]">
                  Launch demo →
                </span>
              </Link>
            </Reveal>
          ) : project.links?.live ? (
            <Reveal>
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-14 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-accent/40 bg-accent-soft/50 p-6 transition-colors hover:border-accent sm:p-8"
              >
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-accent">
                    Live & public
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">
                    Don&apos;t take my word for it — try it yourself
                  </h2>
                  <p className="mt-1 max-w-lg text-sm text-muted">
                    {project.links.live.replace("https://", "")} — no signup, nothing to install.
                  </p>
                </div>
                <span className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition-transform group-hover:scale-[1.05]">
                  Open the live site ↗
                </span>
              </a>
            </Reveal>
          ) : null}

          {cs.video && (
            <CaseSection title="See it in action">
              <div className="grid items-center gap-8 lg:grid-cols-[auto_1fr]">
                <div className="mx-auto w-[240px] sm:w-[270px]">
                  <div className="rounded-[2.6rem] border-[6px] border-line-strong bg-surface p-1.5 shadow-2xl">
                    <PhoneVideo src={cs.video.src} poster={cs.video.poster} />
                  </div>
                </div>
                {cs.video.caption && (
                  <p className="text-sm leading-relaxed text-muted lg:max-w-sm">{cs.video.caption}</p>
                )}
              </div>
            </CaseSection>
          )}

          {cs.gallery && cs.gallery.length > 0 && (
            <CaseSection title="In pictures">
              <Gallery shots={cs.gallery} />
            </CaseSection>
          )}

          {cs.sample && (
            <CaseSection title={cs.sample.title}>
              <p className="mb-4 text-sm text-muted">{cs.sample.note}</p>
              <details className="group overflow-hidden rounded-xl border border-line bg-surface">
                <summary className="cursor-pointer select-none list-none px-5 py-3 font-mono text-sm text-accent transition-colors hover:bg-accent-soft [&::-webkit-details-marker]:hidden">
                  <span className="group-open:hidden">▸ show raw JSON</span>
                  <span className="hidden group-open:inline">▾ hide raw JSON</span>
                </summary>
                <pre className="max-h-[420px] overflow-auto border-t border-line bg-background p-5 font-mono text-xs leading-relaxed text-muted">
                  {cs.sample.code}
                </pre>
              </details>
            </CaseSection>
          )}

          <CaseSection title="Challenges & decisions">
            <div className="space-y-4">
              {cs.challenges.map((challenge) => (
                <div key={challenge.problem} className="rounded-xl border border-line bg-surface p-5">
                  <p className="text-sm font-semibold">
                    <span className="mr-2 text-accent">▸</span>
                    {challenge.problem}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{challenge.approach}</p>
                </div>
              ))}
            </div>
          </CaseSection>

          <CaseSection title="Results">
            <div className="grid gap-3 sm:grid-cols-2">
              {cs.results.map((result) => (
                <div
                  key={result}
                  className="flex gap-3 rounded-xl border border-line bg-surface p-4 text-sm text-muted"
                >
                  <span className="mt-0.5 font-semibold text-accent">✓</span>
                  {result}
                </div>
              ))}
            </div>
          </CaseSection>

          <Reveal>
            <div className="mt-16 rounded-2xl border border-line bg-surface p-8 text-center">
              <h2 className="text-xl font-semibold">Have a similar project in mind?</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                I can build data pipelines, dashboards, and analysis tools like this one — end to end.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a
                  href={`mailto:${site.email}`}
                  className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.03]"
                >
                  Email me
                </a>
                <a
                  href={site.links.upwork}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-line-strong px-6 py-3 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
                >
                  Hire me on Upwork ↗
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}

type GalleryShot = { src: string; caption: string; portrait?: boolean };

function Gallery({ shots }: { shots: GalleryShot[] }) {
  const landscape = shots.filter((s) => !s.portrait);
  const portrait = shots.filter((s) => s.portrait);

  // Mixed orientations: wide column of stacked desktop shots + a full-height
  // phone column beside them.
  if (landscape.length > 0 && portrait.length > 0) {
    return (
      <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="grid content-start gap-4">
          {landscape.map((shot) => (
            <LandscapeFigure key={shot.src} shot={shot} />
          ))}
        </div>
        <div className="grid gap-4">
          {portrait.map((shot) => (
            <PortraitFigure key={shot.src} shot={shot} fill />
          ))}
        </div>
      </div>
    );
  }

  // Uniform orientation: hero first shot, then a 2-col grid.
  return (
    <div className="grid items-start gap-4 sm:grid-cols-2">
      {shots.map((shot, i) =>
        shot.portrait ? (
          <PortraitFigure key={shot.src} shot={shot} />
        ) : (
          <figure
            key={shot.src}
            className={`overflow-hidden rounded-xl border border-line bg-surface ${
              i === 0 ? "sm:col-span-2" : ""
            }`}
          >
            <Image src={shot.src} alt={shot.caption} width={1280} height={800} className="h-auto w-full" />
            <figcaption className="p-3 text-xs text-faint">{shot.caption}</figcaption>
          </figure>
        )
      )}
    </div>
  );
}

function LandscapeFigure({ shot }: { shot: GalleryShot }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-surface">
      <Image src={shot.src} alt={shot.caption} width={1280} height={800} className="h-auto w-full" />
      <figcaption className="p-3 text-xs text-faint">{shot.caption}</figcaption>
    </figure>
  );
}

function PortraitFigure({ shot, fill }: { shot: GalleryShot; fill?: boolean }) {
  return (
    <figure
      className={`flex flex-col overflow-hidden rounded-xl border border-line bg-surface ${
        fill ? "h-full" : ""
      }`}
    >
      <div className="flex flex-1 justify-center overflow-hidden">
        <Image
          src={shot.src}
          alt={shot.caption}
          width={400}
          height={800}
          className={
            fill
              ? "h-auto max-h-[440px] w-auto lg:h-full lg:max-h-none lg:w-full lg:object-cover lg:object-top"
              : "h-auto max-h-[440px] w-auto"
          }
        />
      </div>
      <figcaption className="p-3 text-xs text-faint">{shot.caption}</figcaption>
    </figure>
  );
}

function CaseSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <section className="mt-14">
        <h2 className="mb-5 text-xl font-semibold">
          <span className="mr-2 inline-block h-px w-6 translate-y-[-4px] bg-accent align-middle" />
          {title}
        </h2>
        {children}
      </section>
    </Reveal>
  );
}
