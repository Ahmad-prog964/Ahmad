"use client";

import { motion } from "framer-motion";
import { business } from "@/lib/plumber/business";

export default function ServiceArea() {
  return (
    <section className="relative overflow-hidden bg-ink px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15%" }} transition={{ duration: 0.6 }}>
          <p className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.5em] text-accent-2">Service Area</p>
          <h2 className="text-huge text-4xl text-paper md:text-6xl">{business.serviceArea}.</h2>
          <p className="mt-6 max-w-md text-mute">
            Based in {business.baseArea}, on call 24/7 — wherever the leak, the boiler, or the blockage is, that&apos;s where we work.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-15%" }} transition={{ duration: 0.7 }} className="relative flex aspect-square items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-line" />
          <div className="absolute inset-8 rounded-full border border-line" />
          <div className="absolute inset-16 rounded-full border border-line" />
          <div className="absolute inset-24 rounded-full border border-accent/40" />
          <span className="h-3 w-3 animate-pulse-glow rounded-full bg-accent shadow-[0_0_24px_6px_rgba(211,16,39,0.5)]" />
        </motion.div>
      </div>
    </section>
  );
}
