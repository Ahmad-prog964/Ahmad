"use client";

import { useSceneStore } from "@/store/useSceneStore";
import { getStageVisibility, STAGES, type StageId } from "@/lib/timeline";

export default function StoryText({
  stageId,
  eyebrow,
  size = "large",
}: {
  stageId: StageId;
  eyebrow?: string;
  size?: "large" | "huge";
}) {
  const progress = useSceneStore((s) => s.progress);
  const visibility = getStageVisibility(progress, stageId);
  const stage = STAGES.find((s) => s.id === stageId);
  if (!stage || !stage.label) return null;

  const lines = stage.label.split("\n");
  const translate = (1 - visibility) * 24;

  return (
    <div
      className="pointer-events-none flex h-full w-full flex-col items-center justify-center px-6 text-center"
      style={{ opacity: visibility }}
    >
      {eyebrow && (
        <p
          className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.5em] text-accent-2"
          style={{ transform: `translateY(${translate}px)` }}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className="text-huge text-paper"
        style={{ transform: `translateY(${translate}px)`, filter: `blur(${(1 - visibility) * 6}px)` }}
      >
        {lines.map((line, i) => (
          <span
            key={i}
            className={
              i === 0
                ? `block ${size === "huge" ? "text-6xl md:text-8xl" : "text-4xl md:text-6xl"}`
                : "mt-3 block font-body text-base font-normal tracking-normal text-mute md:text-xl"
            }
          >
            {line}
          </span>
        ))}
      </h2>
    </div>
  );
}
