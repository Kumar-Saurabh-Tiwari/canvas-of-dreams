import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import HeroSection from "@/components/portfolio/sections/HeroSection";
import AboutSection from "@/components/portfolio/sections/AboutSection";
import ServicesSection from "@/components/portfolio/sections/ServicesSection";
import WorkSection from "@/components/portfolio/sections/WorkSection";
import ContactSection from "@/components/portfolio/sections/ContactSection";
import Preloader from "@/components/portfolio/Preloader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Saurab Kumar — Full Stack Web Developer Portfolio" },
      { name: "description", content: "Portfolio of Saurab Kumar (Saurav), full stack web developer building scalable systems with React, Next.js, Node.js." },
      { property: "og:title", content: "Saurab Kumar — Full Stack Web Developer Portfolio" },
      { property: "og:description", content: "Portfolio of Saurab Kumar, full stack web developer." },
    ],
  }),
  component: Index,
});

function Index() {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      <ClientOnly fallback={null}>
        {!loaded && <Preloader onDone={() => setLoaded(true)} />}
      </ClientOnly>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <WorkSection />
      <ContactSection />
    </>
  );
}
