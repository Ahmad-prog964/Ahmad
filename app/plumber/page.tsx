import SceneGate from "@/components/plumber/SceneGate";
import ScrollOrchestrator from "@/components/plumber/ScrollOrchestrator";
import IntroSequence from "@/components/plumber/IntroSequence";
import Header from "@/components/plumber/sections/Header";
import FilmSection from "@/components/plumber/sections/FilmSection";
import GoogleReviews from "@/components/plumber/sections/GoogleReviews";
import ServicesPanels from "@/components/plumber/sections/ServicesPanels";
import WhyChooseUs from "@/components/plumber/sections/WhyChooseUs";
import HowItWorks from "@/components/plumber/sections/HowItWorks";
import ServiceArea from "@/components/plumber/sections/ServiceArea";
import About from "@/components/plumber/sections/About";
import Contact from "@/components/plumber/sections/Contact";
import FinalCTA from "@/components/plumber/sections/FinalCTA";
import { business } from "@/lib/plumber/business";

export const metadata = {
  title: `${business.name} | Plumbing & Heating`,
  description: `${business.name} — ${business.yearsInBusiness} years in the trade, 24/7 emergency plumbing and heating across ${business.serviceArea}. 5.0 stars on Google.`,
};

export default function PlumberHome() {
  return (
    <>
      <SceneGate />
      <ScrollOrchestrator />
      <IntroSequence />
      <Header />

      <main className="relative z-10">
        <FilmSection />

        <div className="relative bg-ink">
          <GoogleReviews />
          <ServicesPanels />
          <WhyChooseUs />
          <HowItWorks />
          <ServiceArea />
          <About />
        </div>

        <FinalCTA />
        <Contact />

        <footer className="border-t border-line bg-ink px-6 py-10 text-center text-xs uppercase tracking-[0.2em] text-mute">
          {business.name} — Plumbing &amp; heating across {business.serviceArea}
        </footer>
      </main>
    </>
  );
}
