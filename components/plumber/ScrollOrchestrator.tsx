"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePlumberStore } from "@/store/usePlumberStore";
import { getStage } from "@/lib/plumber/timeline";

export default function ScrollOrchestrator() {
  const introDone = usePlumberStore((s) => s.introDone);

  useEffect(() => {
    if (!introDone) return;
    gsap.registerPlugin(ScrollTrigger);

    const film = document.getElementById("plumber-film-section");
    const cta = document.getElementById("plumber-cta-section");
    const triggers: ScrollTrigger[] = [];

    if (film) {
      triggers.push(
        ScrollTrigger.create({
          trigger: film,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: (self) => {
            const { setProgress, setStageId } = usePlumberStore.getState();
            setProgress(self.progress);
            setStageId(getStage(self.progress).id);
          },
        })
      );
    }

    if (cta) {
      triggers.push(
        ScrollTrigger.create({
          trigger: cta,
          start: "top bottom",
          end: "top 20%",
          scrub: 0.6,
          onUpdate: (self) => usePlumberStore.getState().setCtaProgress(self.progress),
        })
      );
    }

    return () => triggers.forEach((t) => t.kill());
  }, [introDone]);

  return null;
}
