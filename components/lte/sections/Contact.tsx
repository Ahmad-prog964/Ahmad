"use client";

import { motion } from "framer-motion";
import { business } from "@/lib/lte/business";
import MagneticButton from "@/components/ui/MagneticButton";

export default function Contact() {
  return (
    <section className="relative bg-ink px-6 py-28 md:px-10 md:py-36" id="contact">
      <div className="mx-auto max-w-3xl text-center">
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15%" }} transition={{ duration: 0.6 }} className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.5em] text-accent-2">
          Get In Touch
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15%" }} transition={{ duration: 0.6, delay: 0.05 }} className="text-huge mb-10 text-4xl text-paper md:text-6xl">
          {business.phone}
        </motion.h2>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15%" }} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-wrap items-center justify-center gap-4">
          <MagneticButton href={business.phoneHref}>Call Now</MagneticButton>
          <MagneticButton href={business.whatsappHref} variant="secondary">
            WhatsApp Us
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
