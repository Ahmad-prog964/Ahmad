"use client";

import { useSceneStore } from "@/store/useSceneStore";
import { getActiveService } from "@/lib/timeline";
import { business } from "@/lib/business";

export default function ServiceLabels() {
  const progress = useSceneStore((s) => s.progress);
  const activeId = getActiveService(progress);
  const service = business.services.find((s) => s.id === activeId);

  return (
    <div className="pointer-events-none flex h-full w-full items-center justify-center px-6">
      <div
        className="scene-text-scrim text-center transition-all duration-500 px-10 py-12 md:px-16 md:py-16"
        style={{ opacity: service ? 1 : 0, transform: `translateY(${service ? 0 : 16}px)` }}
      >
        <p className="text-shadow-soft mb-3 font-display text-xs font-semibold uppercase tracking-[0.5em] text-accent-2">
          Mobile Mechanic Services
        </p>
        <h3 className="text-huge text-5xl text-paper md:text-7xl">{service?.title ?? ""}</h3>
        <p className="text-shadow-soft mx-auto mt-5 max-w-md text-balance text-sm text-mute md:text-base">
          {service?.copy ?? ""}
        </p>
      </div>
    </div>
  );
}
