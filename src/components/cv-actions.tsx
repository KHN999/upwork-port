"use client";

export function CvActions() {
  return (
    <div className="mx-auto mb-6 flex max-w-[210mm] flex-wrap items-center justify-between gap-3 print:hidden">
      <p className="text-sm text-muted">
        Curriculum vitae — <span className="text-foreground">Kaung Htet Naing</span>
      </p>
      <div className="flex flex-wrap gap-2">
        <a
          href="/resume.pdf"
          download="KaungHtetNaing-CV.pdf"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition-transform hover:scale-[1.03]"
        >
          Download PDF
        </a>
        <a
          href="/resume.jpg"
          download="KaungHtetNaing-CV.jpg"
          className="rounded-full border border-line-strong px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
        >
          Download JPEG
        </a>
        <button
          onClick={() => window.print()}
          className="rounded-full border border-line-strong px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
        >
          Print
        </button>
      </div>
    </div>
  );
}
