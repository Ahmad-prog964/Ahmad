"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSceneStore } from "@/store/useSceneStore";
import { getStage } from "@/lib/timeline";

export default function ScrollOrchestrator() {
  const introDone = useSceneStore((s) => s.introDone);

  useEffect(() => {
    if (!introDone) return;
    gsap.registerPlugin(ScrollTrigger);

    const film = document.getElementById("film-section");
    const cta = document.getElementById("cta-section");
    const triggers: ScrollTrigger[] = [];

    if (film) {
      const t = ScrollTrigger.create({
        trigger: film,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          const { setProgress, setStageId } = useSceneStore.getState();
          setProgress(self.progress);
          setStageId(getStage(self.progress).id);
        },
      });
      triggers.push(t);
    }

    if (cta) {
      const t = ScrollTrigger.create({
        trigger: cta,
        start: "top bottom",
        end: "top 20%",
        scrub: 0.6,
        onUpdate: (self) => useSceneStore.getState().setCtaProgress(self.progress),
      });
      triggers.push(t);
    }

    return () => triggers.forEach((t) => t.kill());
  }, [introDone]);

  return null;
}
