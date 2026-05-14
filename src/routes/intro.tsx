import { createFileRoute } from "@tanstack/react-router";
import TextScramble from "@/components/portfolio/TextScramble";

export const Route = createFileRoute("/intro")({
  head: () => ({
    meta: [
      { title: "Intro — Kumar Saurabh Tiwari" },
      { name: "description", content: "A brutalist approach to modern JavaScript. Architecting scalable systems with React, Next.js, and Node.js." },
    ],
  }),
  component: IntroPage,
});

function IntroPage() {
  return (
    <section className="min-h-screen px-6 md:px-16 py-32 font-mono flex flex-col justify-center">
      <p className="text-[10px] tracking-[0.4em] text-muted-foreground mb-6">[ 01 // INTRO ]</p>
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight max-w-5xl text-glow">
        <TextScramble
          as="span"
          text="A BRUTALIST APPROACH TO MODERN JAVASCRIPT. ARCHITECTING SCALABLE SYSTEMS WITH REACT, NEXT.JS, AND NODE.JS."
          duration={2400}
        />
      </h2>
      <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl text-[10px] tracking-[0.25em] text-muted-foreground">
        <div><p className="text-violet-glow mb-2">YEARS</p><p className="text-foreground text-2xl">04+</p></div>
        <div><p className="text-violet-glow mb-2">SHIPPED</p><p className="text-foreground text-2xl">30+</p></div>
        <div><p className="text-violet-glow mb-2">STACK</p><p className="text-foreground text-2xl">FULL</p></div>
        <div><p className="text-violet-glow mb-2">MODE</p><p className="text-foreground text-2xl">DEEP</p></div>
      </div>
    </section>
  );
}
