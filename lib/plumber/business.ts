/**
 * Real data sourced from the verified Google Business Profile screenshot supplied by the user.
 * Never add testimonial quotes that weren't actually supplied.
 */
export const business = {
  name: "James Plumbing",
  initials: "JP",
  phone: "07700 117489",
  phoneHref: "tel:+447700117489",
  category: "Plumber",
  yearsInBusiness: "50+",
  baseArea: "Romford",
  serviceArea: "Romford & Nearby Areas",
  rating: 5.0,
  reviewCount: 7,
  verifiedByGoogle: true,
  familyOwned: true,
  emergency247: true,
  onTimeGuarantee: true,
  highlights: [
    "24/7 emergency service",
    "Family-owned & operated",
    "Locally owned & operated",
    "On-time guarantee",
    "Professional service",
  ],
  description:
    "A family-owned plumbing business with over 50 years in the trade, serving Romford and the surrounding area — from same-day repairs to full installations, with a 24/7 emergency call-out.",
  services: [
    { id: "boiler-install", title: "Boiler Install", copy: "Full boiler installation, sized and fitted right the first time." },
    { id: "boiler-repair", title: "Boiler Repair", copy: "Fast diagnosis and repair to get your heating and hot water back on." },
    { id: "bathroom-install", title: "Bathroom Install", copy: "Complete bathroom installations, from first fix to final finish." },
    { id: "hot-water-cylinder", title: "Hot Water Cylinder", copy: "Installation and repair of hot-water cylinders, done properly." },
    { id: "leak-repair", title: "Water Leak Repair", copy: "Located and fixed fast — before a small leak becomes a big bill." },
    { id: "boiler-emergency", title: "Emergency Call-Out", copy: "Burst pipe or no heating? We're on call 24 hours a day." },
  ],
  /** Every service line item from the Google listing, for the full services section. */
  allServices: [
    "Bathroom installation",
    "Install hot-water cylinder",
    "Install shower",
    "Install toilet",
    "Install boiler",
    "Repair tap",
    "Repair hot water cylinder",
    "Repair pipe",
    "Repair shower",
    "Repair sink",
    "Repair toilet",
    "Repair boiler",
    "Repair water leak",
    "Water removal",
  ],
} as const;
