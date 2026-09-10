"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { business } from "@/lib/business";

type ServiceId = (typeof business.services)[number]["id"];

export default function ServicesPanels() {
  const [active, setActive] = useState<ServiceId>(business.services[0].id);
  const activeService = business.services.find((s) => s.id === active)!;

  return (
    <section className="relative bg-ink-2 px-6 py-28 md:px-10 md:py-36" id="services">
      <div className="mx-auto max-w-6xl">
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15%" }} transition={{ duration: 0.6 }} className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.5em] text-accent-2">
          What We Fix
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15%" }} transition={{ duration: 0.6, delay: 0.05 }} className="text-huge mb-14 text-4xl text-paper md:text-6xl">
          Every job, done right.
        </motion.h2>

        <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col gap-1">
            {business.services.map((service) => (
              <button
                key={service.id}
                onClick={() => setActive(service.id)}
                onMouseEnter={() => setActive(service.id)}
                className={`group flex items-baseline justify-between border-b border-line py-5 text-left transition-colors ${active === service.id ? "text-paper" : "text-mute hover:text-paper/70"}`}
              >
                <span className="font-display text-2xl font-bold md:text-3xl">{service.title}</span>
                <span className={`font-display text-xs uppercase tracking-widest transition-opacity ${active === service.id ? "opacity-100 text-accent-2" : "opacity-0"}`}>View</span>
              </button>
            ))}
          </div>

          <motion.div
            key={activeService.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-2xl border border-line bg-surface p-8 md:p-12"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
            <span className="mb-4 font-display text-6xl font-extrabold text-paper/10 md:text-8xl">
              {String(business.services.findIndex((s) => s.id === activeService.id) + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-3xl font-bold text-paper md:text-4xl">{activeService.title}</h3>
            <p className="mt-4 max-w-md text-mute">{activeService.copy}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.6 }}
          className="mt-16 flex flex-wrap gap-3 border-t border-line pt-10"
        >
          {business.allServices.map((s) => (
            <span key={s} className="rounded-full border border-paper/15 px-4 py-2 text-xs uppercase tracking-[0.12em] text-paper/70">
              {s}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
