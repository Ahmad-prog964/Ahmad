"use client";

import { STAGES } from "@/lib/plumber/timeline";
import StoryText from "@/components/plumber/sections/StoryText";
import ServiceLabels from "@/components/plumber/sections/ServiceLabels";

const TOTAL_VH = 3000;

export default function FilmSection() {
  return (
    <div id="plumber-film-section" className="relative">
      {STAGES.map((stage) => {
        const minHeight = stage.id === "services" ? 100 : 60;
        return (
          <div key={stage.id} style={{ height: `max(${(stage.end - stage.start) * TOTAL_VH}vh, ${minHeight}vh)` }}>
            <div className="sticky top-0 h-screen w-full">
              {stage.id === "services" ? (
                <ServiceLabels />
              ) : stage.label ? (
                <StoryText stageId={stage.id} size={stage.id === "hero" || stage.id === "area" ? "huge" : "large"} />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
