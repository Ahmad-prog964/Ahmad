"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useSceneStore } from "@/store/useSceneStore";
import { business } from "@/lib/business";

export default function IntroSequence() {
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const setIntroDone = useSceneStore((s) => s.setIntroDone);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("skipintro")) {
      setIntroDone(true);
      setHidden(true);
      return;
    }

    document.body.classList.add("noscroll-lock");
    window.scrollTo(0, 0);

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => {
        document.body.classList.remove("noscroll-lock");
        setIntroDone(true);
        setHidden(true);
      },
    });

    tl.set([logoRef.current, brandRef.current], { opacity: 0 })
      .to(logoRef.current, { opacity: 1, duration: 0.9 }, 0.3)
      .to(logoRef.current, { opacity: 1, duration: 0.6 }, 1.1)
      .to(logoRef.current, { opacity: 0, y: -12, duration: 0.5 }, 1.7)
      .to(brandRef.current, { opacity: 1, duration: 0.9 }, 1.9)
      .to(brandRef.current, { opacity: 1, duration: 0.5 }, 2.6)
      .to(rootRef.current, { opacity: 0, duration: 0.7 }, 3.1);

    return () => {
      tl.kill();
      document.body.classList.remove("noscroll-lock");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink"
      aria-hidden
    >
      <div ref={logoRef} className="absolute font-display text-4xl font-extrabold tracking-[0.35em] text-paper">
        {business.initials}
      </div>
      <div ref={brandRef} className="absolute text-center opacity-0">
        <p className="font-display text-2xl font-bold uppercase tracking-[0.3em] text-paper md:text-4xl">
          Hakhamanesh
        </p>
        <p className="mt-2 font-display text-lg font-semibold uppercase tracking-[0.5em] text-mute md:text-xl">
          Mobile Mechanic
        </p>
      </div>
    </div>
  );
}
