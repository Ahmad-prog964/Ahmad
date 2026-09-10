"use client";

import { motion } from "framer-motion";
import { business } from "@/lib/business";

const steps = [
  { n: "01", title: "Call, text or WhatsApp", copy: `Tell us what's wrong. ${business.phone}.` },
  { n: "02", title: "Rapid response", copy: "We get moving fast — especially for emergency call-outs." },
  { n: "03", title: "Diagnosed on-site", copy: "We find the fault and explain it before any work starts." },
  { n: "04", title: "Fixed properly", copy: "From a dripping tap to a full renovation, done right the first time." },
];

export default function HowItWorks() {
  return (
    <section className="relative bg-ink-2 px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15%" }} transition={{ duration: 0.6 }} className="text-huge mb-14 text-4xl text-paper md:text-6xl">
          How it works.
        </motion.h2>
        <div className="grid gap-10 md:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div key={s.n} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.5, delay: i * 0.08 }}>
              <span className="font-display text-sm font-bold text-accent-2">{s.n}</span>
              <h3 className="mt-3 font-display text-xl font-bold text-paper">{s.title}</h3>
              <p className="mt-2 text-sm text-mute">{s.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
