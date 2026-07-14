"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Looping phone-frame demo video that behaves itself:
 * - plays only while visible in the viewport (saves battery/CPU)
 * - doesn't autoplay for users with reduced-motion preferences
 * - tap/click toggles play & pause
 */
export function PhoneVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setPaused(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={paused ? "Play demo video" : "Pause demo video"}
      className="group relative block w-full cursor-pointer"
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full rounded-[2rem]"
      />
      <span
        className={`absolute inset-0 flex items-center justify-center rounded-[2rem] bg-black/30 transition-opacity ${
          paused ? "opacity-100" : "pointer-events-none opacity-0 group-hover:opacity-60"
        }`}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-xl text-black shadow-lg">
          {paused ? "▶" : "❚❚"}
        </span>
      </span>
    </button>
  );
}
