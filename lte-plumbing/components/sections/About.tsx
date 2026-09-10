"use client";

import { motion } from "framer-motion";
import { business } from "@/lib/business";

export default function About() {
  return (
    <section className="relative bg-ink-2 px-6 py-28 md:px-10 md:py-36" id="about">
      <div className="mx-auto max-w-3xl text-center">
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15%" }} transition={{ duration: 0.6 }} className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.5em] text-accent-2">
          About
        </motion.p>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15%" }} transition={{ duration: 0.6, delay: 0.05 }} className="text-balance font-display text-2xl font-medium leading-snug text-paper md:text-4xl">
          {business.description}
        </motion.p>
      </div>
    </section>
  );
}
