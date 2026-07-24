"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  phrases: readonly string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  holdDelay?: number;
  className?: string;
};

export function Typewriter({
  phrases,
  typingSpeed = 55,
  deletingSpeed = 28,
  holdDelay = 1900,
  className = "",
}: Props) {
  // Start with the first phrase fully shown so server-rendered HTML (and
  // screen readers / SEO) always have meaningful text.
  const [text, setText] = useState(phrases[0] ?? "");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    // Respect users who prefer reduced motion — leave the static first phrase.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let phraseIndex = 0;
    let charIndex = phrases[0]?.length ?? 0;
    let deleting = false;

    const tick = () => {
      const current = phrases[phraseIndex] ?? "";

      if (!deleting) {
        charIndex++;
        setText(current.slice(0, charIndex));
        if (charIndex >= current.length) {
          deleting = true;
          timer.current = setTimeout(tick, holdDelay);
          return;
        }
        timer.current = setTimeout(tick, typingSpeed);
      } else {
        charIndex--;
        setText(current.slice(0, Math.max(0, charIndex)));
        if (charIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          timer.current = setTimeout(tick, typingSpeed);
          return;
        }
        timer.current = setTimeout(tick, deletingSpeed);
      }
    };

    // Hold the initial phrase, then begin deleting it and cycle onward.
    timer.current = setTimeout(() => {
      deleting = true;
      tick();
    }, holdDelay);

    return () => clearTimeout(timer.current);
  }, [phrases, typingSpeed, deletingSpeed, holdDelay]);

  return (
    // Grid stacks every phrase in the same cell so the box always reserves the
    // height of the tallest one — the live text overlays it with zero layout
    // shift, so buttons below never move.
    <span className="grid grid-cols-1">
      {phrases.map((phrase, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="invisible [grid-area:1/1]"
        >
          {phrase}
        </span>
      ))}
      <span className={`[grid-area:1/1] ${className}`}>
        {text}
        <span
          aria-hidden="true"
          className="typewriter-cursor ml-0.5 inline-block w-[2px] -translate-y-[2px] self-stretch"
        />
      </span>
    </span>
  );
}
