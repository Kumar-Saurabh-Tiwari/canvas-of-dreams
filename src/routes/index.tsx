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
      { title: "Saurav Kumar Portfolio | skumar.space" },
      { name: "description", content: "Saurav Kumar portfolio (skumar.space). Full stack web developer building scalable systems with React, Next.js, Node.js." },
      { property: "og:title", content: "Saurav Kumar Portfolio | skumar.space" },
      { property: "og:description", content: "Saurav Kumar portfolio (skumar.space). Full stack web developer." },
    ],
  }),
  component: Index,
});

function Index() {
  const [loaded, setLoaded] = useState(false);
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {!loaded ? (
        <Preloader onDone={() => setLoaded(true)} />
      ) : (
        <>
          <HeroSection />
          <AboutSection />
          <ServicesSection />
          <WorkSection />
          <ContactSection />
        </>
      )}
    </ClientOnly>
  );
}
