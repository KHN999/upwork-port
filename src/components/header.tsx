"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { site } from "@/data/site";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { label: "Work", href: "/#work" },
  { label: "Services", href: "/#services" },
  { label: "Experience", href: "/#experience" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  // Scrollspy: highlight the nav item whose section crosses the viewport's middle band
  useEffect(() => {
    const ids = ["top", "work", "services", "experience", "about", "contact"];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return; // subpage — no sections to spy on
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Close the menu first, then scroll once its collapse animation is done —
  // scrolling while the panel is animating gets cancelled by the layout shift.
  const navigateFromMenu = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const hash = "#" + href.split("#")[1];
    const target = document.querySelector(hash);
    // On a subpage the section doesn't exist — let the browser navigate normally
    if (!target) {
      setMenuOpen(false);
      return;
    }
    e.preventDefault();
    setMenuOpen(false);
    window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", hash);
    }, 320);
  };
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "border-b border-line bg-background/80 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <motion.div
        style={{ scaleX: progress }}
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-accent"
      />
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <a href="/#top" className="font-mono text-sm font-semibold tracking-widest text-foreground">
          {site.initials}
          <span className="text-accent">.</span>
        </a>
        <nav className="hidden items-center gap-1 sm:flex">
          {navItems.map((item) => {
            const isActive = activeSection && item.href === `/#${activeSection}`;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "text-accent"
                    : "text-muted hover:bg-accent-soft hover:text-foreground"
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-accent-soft"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="/#contact"
            className="hidden rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition-transform hover:scale-[1.03] sm:block"
          >
            Hire me
          </a>
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-foreground sm:hidden"
          >
            <span className="relative block h-3 w-4">
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                className="absolute left-0 top-0 block h-[1.5px] w-4 bg-current"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="absolute left-0 top-[5px] block h-[1.5px] w-4 bg-current"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                className="absolute left-0 top-[10px] block h-[1.5px] w-4 bg-current"
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="overflow-hidden border-t border-line bg-background/95 backdrop-blur-md sm:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                  onClick={(e) => navigateFromMenu(e, item.href)}
                  className="rounded-lg px-3 py-2.5 text-base text-muted transition-colors hover:bg-accent-soft hover:text-foreground"
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.a
                href="/#contact"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + navItems.length * 0.05 }}
                onClick={(e) => navigateFromMenu(e, "/#contact")}
                className="mt-2 rounded-full bg-foreground px-4 py-2.5 text-center text-sm font-medium text-background"
              >
                Hire me
              </motion.a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
