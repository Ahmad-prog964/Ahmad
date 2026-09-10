"use client";

import { motion, type Variants } from "framer-motion";
import { business } from "@/lib/lte/business";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function GoogleReviews() {
  return (
    <section className="relative bg-ink px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-4xl text-center">
        <motion.p initial="hidden" whileInView="show" viewport={{ once: true, margin: "-15%" }} variants={fadeUp} className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.5em] text-accent-2">
          Verified on Google
        </motion.p>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-15%" }} variants={fadeUp} className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-accent">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} />
            ))}
          </div>
          <p className="mt-4 font-display text-5xl font-extrabold text-paper md:text-7xl">{business.rating.toFixed(1)}</p>
          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-mute">{business.reviewCount} Google reviews</p>
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-15%" }} variants={fadeUp} className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {business.highlights.map((h) => (
            <span key={h} className="rounded-full border border-paper/15 px-4 py-2 text-xs uppercase tracking-[0.15em] text-paper/80">
              {h}
            </span>
          ))}
        </motion.div>

        <motion.a
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-15%" }}
          variants={fadeUp}
          href={`https://www.google.com/search?q=${encodeURIComponent(business.name + " reviews")}`}
          target="_blank"
          rel="noreferrer"
          className="mt-10 inline-block text-sm uppercase tracking-[0.2em] text-mute underline-offset-4 hover:text-paper hover:underline"
        >
          See all reviews on Google →
        </motion.a>
      </div>
    </section>
  );
}

function StarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8L5.7 21l1.7-7L2 9.2l7.1-.6L12 2z" />
    </svg>
  );
}
