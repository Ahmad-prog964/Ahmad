"use client";

import { motion } from "framer-motion";
import { business } from "@/lib/plumber/business";

const points = [
  { title: `${business.yearsInBusiness} years in the trade`, copy: "A family-owned business with over half a century of plumbing and heating experience behind it." },
  { title: "24/7 emergency service", copy: "Burst pipe, no heating, blocked drain — we answer, day or night." },
  { title: "5.0 rated, locally owned", copy: `${business.reviewCount} five-star Google reviews from customers in and around ${business.baseArea}.` },
  { title: "On-time guarantee", copy: "We turn up when we say we will — no waiting around all day." },
];

export default function WhyChooseUs() {
  return (
    <section className="relative bg-ink px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15%" }} transition={{ duration: 0.6 }} className="text-huge mb-14 text-4xl text-paper md:text-6xl">
          Why people choose us.
        </motion.h2>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
          {points.map((p, i) => (
            <motion.div key={p.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.5, delay: i * 0.06 }} className="bg-ink p-8 md:p-10">
              <h3 className="font-display text-xl font-bold text-paper md:text-2xl">{p.title}</h3>
              <p className="mt-3 text-sm text-mute md:text-base">{p.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
