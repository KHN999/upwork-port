import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-sm text-faint sm:flex-row">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p className="font-mono text-xs">
          Built with Next.js, TypeScript & Tailwind — yes, the same stack I&apos;ll use for you.
        </p>
      </div>
    </footer>
  );
}
