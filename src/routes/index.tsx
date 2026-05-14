import { createFileRoute } from "@tanstack/react-router";
import HeroSection from "@/components/portfolio/sections/HeroSection";
import AboutSection from "@/components/portfolio/sections/AboutSection";
import ServicesSection from "@/components/portfolio/sections/ServicesSection";
import WorkSection from "@/components/portfolio/sections/WorkSection";
import ContactSection from "@/components/portfolio/sections/ContactSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kumar Saurabh Tiwari — Full Stack Web Developer" },
      { name: "description", content: "Engineering the unseen. Full Stack Web Developer building scalable systems with React, Next.js, Node.js." },
      { property: "og:title", content: "Kumar Saurabh Tiwari — Full Stack Web Developer" },
      { property: "og:description", content: "A brutalist approach to modern JavaScript." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <WorkSection />
      <ContactSection />
    </>
  );
}
