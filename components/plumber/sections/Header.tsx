"use client";

import { business } from "@/lib/plumber/business";

export default function Header() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-6 md:px-10">
      <div className="pointer-events-auto font-display text-sm font-extrabold tracking-[0.3em] text-paper">
        {business.initials}
      </div>
      <a
        href={business.phoneHref}
        className="pointer-events-auto rounded-full border border-paper/25 px-5 py-2 font-display text-xs font-semibold uppercase tracking-[0.2em] text-paper backdrop-blur-sm transition-colors hover:border-accent hover:text-accent-2"
      >
        {business.phone}
      </a>
    </header>
  );
}
