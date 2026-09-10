"use client";

import { motion } from "framer-motion";

const points = [
  {
    title: "We come to you",
    copy: "Home, workplace, or roadside — no workshop drop-off, no waiting around.",
  },
  {
    title: "5.0 rated, skilled work",
    copy: "36 five-star Google reviews, with repeat mentions of diagnostics and skilled mechanic work.",
  },
  {
    title: "Fast turnaround",
    copy: "Reviewers consistently call out quick work — jobs done properly, without dragging on.",
  },
  {
    title: "Straight, honest pricing",
    copy: "You see the problem, you hear the fix, you agree the price — before anything's touched.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative bg-ink px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.6 }}
          className="text-huge mb-14 text-4xl text-paper md:text-6xl"
        >
          Why people choose us.
        </motion.h2>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
          {points.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="bg-ink p-8 md:p-10"
            >
              <h3 className="font-display text-xl font-bold text-paper md:text-2xl">{p.title}</h3>
              <p className="mt-3 text-sm text-mute md:text-base">{p.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
