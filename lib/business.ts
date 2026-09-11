/**
 * Single source of truth for real business data.
 * Sourced from the verified Google Business Profile / Google Maps listing.
 * NEVER invent ratings, review counts, or testimonial text here or elsewhere —
 * only add data once it has been supplied and verified.
 */
export const business = {
  name: "Hakhamanesh Mobile Mechanic",
  shortName: "Hakhamanesh",
  initials: "HM",
  phone: "07397 378189",
  phoneHref: "tel:+447397378189",
  category: "Auto repair shop",
  baseArea: "Hendon, North West London",
  serviceArea: "Across London",
  rating: 5.0,
  reviewCount: 36,
  reviewTags: [
    { label: "Diagnostics", count: 6 },
    { label: "Quick work", count: 4 },
    { label: "Clutch", count: 2 },
    { label: "Skilled mechanic", count: 2 },
  ],
  description:
    "Hakhamanesh Mobile Mechanic is a mobile vehicle repair business based in Hendon, north-west London. It brings professional repair and servicing directly to customers' locations rather than operating from a traditional workshop.",
  services: [
    {
      id: "diagnostics",
      title: "Diagnostics",
      copy: "Full computerised fault-finding, on-site, before a single tool is picked up.",
      image: "/images/generated/service-diagnostics.webp",
    },
    {
      id: "servicing",
      title: "Servicing",
      copy: "Interim and full servicing carried out to manufacturer schedules, wherever you're parked.",
      image: "/images/generated/service-servicing.webp",
    },
    {
      id: "brakes",
      title: "Brakes",
      copy: "Professional brake inspection, pad and disc replacement, torque-checked and road-tested.",
      image: "/images/generated/service-brakes.webp",
    },
    {
      id: "battery",
      title: "Battery",
      copy: "Battery health testing, replacement, and charging-system checks — no more cold-morning surprises.",
      image: "/images/generated/service-battery.webp",
    },
    {
      id: "engine-repairs",
      title: "Engine Repairs",
      copy: "From minor faults to major mechanical work, handled with the same precision as a workshop.",
      image: "/images/generated/service-engine-repairs.webp",
    },
    {
      id: "electrical",
      title: "Electrical",
      copy: "Wiring, sensors, lighting and on-board electronics diagnosed and repaired correctly the first time.",
      image: "/images/generated/service-electrical.webp",
    },
  ],
} as const;
