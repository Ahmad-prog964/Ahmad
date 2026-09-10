import SceneGate from "@/components/lte/SceneGate";
import ScrollOrchestrator from "@/components/plumber/ScrollOrchestrator";
import IntroSequence from "@/components/lte/IntroSequence";
import Header from "@/components/lte/sections/Header";
import FilmSection from "@/components/lte/sections/FilmSection";
import GoogleReviews from "@/components/lte/sections/GoogleReviews";
import ServicesPanels from "@/components/lte/sections/ServicesPanels";
import WhyChooseUs from "@/components/lte/sections/WhyChooseUs";
import HowItWorks from "@/components/lte/sections/HowItWorks";
import ServiceArea from "@/components/lte/sections/ServiceArea";
import About from "@/components/lte/sections/About";
import Contact from "@/components/lte/sections/Contact";
import FinalCTA from "@/components/lte/sections/FinalCTA";
import { business } from "@/lib/lte/business";

export const metadata = {
  title: `${business.name} | Plumbing & Heating`,
  description: `${business.name} — 24-hour emergency plumbing, heating, bathroom renovation and hot tub servicing. 5.0 stars, ${business.reviewCount} Google reviews.`,
};

export default function LtePlumbingHome() {
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
          {business.name} — Plumbing, heating &amp; property maintenance
        </footer>
      </main>
    </>
  );
}
