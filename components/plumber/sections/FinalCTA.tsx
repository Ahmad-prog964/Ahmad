"use client";

import { usePlumberStore } from "@/store/usePlumberStore";
import MagneticButton from "@/components/ui/MagneticButton";
import { business } from "@/lib/plumber/business";

export default function FinalCTA() {
  const ctaProgress = usePlumberStore((s) => s.ctaProgress);

  return (
    <section id="plumber-cta-section" className="relative" style={{ height: "170vh" }}>
      <div className="sticky top-0 flex h-screen w-full items-center justify-center px-6">
        <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(circle at 50% 55%, transparent, rgba(5,5,6,${ctaProgress * 0.75}) 68%)` }} />
        <div className="relative flex flex-col items-center text-center" style={{ opacity: Math.min(1, ctaProgress * 1.6) }}>
          <p className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.5em] text-accent-2">Pipe Burst? Boiler Down?</p>
          <h2 className="text-huge text-5xl text-paper md:text-8xl">We come to you.</h2>
          <div className="pointer-events-auto mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton href={business.phoneHref}>Call Now</MagneticButton>
            <MagneticButton href="#contact" variant="secondary">
              Book An Emergency Callout
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
