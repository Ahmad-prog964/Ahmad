import SceneGate from "@/components/canvas/SceneGate";
import ScrollOrchestrator from "@/components/canvas/ScrollOrchestrator";
import IntroSequence from "@/components/canvas/IntroSequence";
import Header from "@/components/sections/Header";
import FilmSection from "@/components/sections/FilmSection";
import GoogleReviews from "@/components/sections/GoogleReviews";
import ServicesPanels from "@/components/sections/ServicesPanels";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import HowItWorks from "@/components/sections/HowItWorks";
import ServiceArea from "@/components/sections/ServiceArea";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import FinalCTA from "@/components/sections/FinalCTA";
import { business } from "@/lib/business";

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
