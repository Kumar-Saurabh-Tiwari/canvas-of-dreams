import { createFileRoute } from "@tanstack/react-router";
import HeroSection from "@/components/portfolio/sections/HeroSection";
import AboutSection from "@/components/portfolio/sections/AboutSection";
import ServicesSection from "@/components/portfolio/sections/ServicesSection";
import WorkSection from "@/components/portfolio/sections/WorkSection";
import ContactSection from "@/components/portfolio/sections/ContactSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Saurav Kumar — Full Stack Web Developer Portfolio" },
      { name: "description", content: "Portfolio of Saurav Kumar, full stack web developer building scalable systems with React, Next.js, Node.js." },
      { property: "og:title", content: "Saurav Kumar — Full Stack Web Developer Portfolio" },
      { property: "og:description", content: "Portfolio of Saurav Kumar, full stack web developer." },
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
