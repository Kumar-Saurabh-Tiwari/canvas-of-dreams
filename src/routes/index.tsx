import { createFileRoute, Link } from "@tanstack/react-router";
import TextScramble from "@/components/portfolio/TextScramble";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kumar Saurabh Tiwari — Full Stack Web Developer" },
      { name: "description", content: "Engineering the unseen. Full Stack Web Developer building scalable systems with React, Next.js, Node.js." },
      { property: "og:title", content: "Kumar Saurabh Tiwari — Full Stack Web Developer" },
      { property: "og:description", content: "Engineering the unseen. A brutalist approach to modern JavaScript." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <section className="min-h-screen flex flex-col justify-between px-6 md:px-16 py-24 font-mono">
      <div className="flex-1 flex flex-col justify-center max-w-6xl">
        <p className="text-[10px] tracking-[0.4em] text-muted-foreground mb-8">
          [ 01 // INTRO ]
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight text-glow">
          <TextScramble as="span" text="KUMAR SAURABH" duration={1400} />
          <br />
          <span className="text-violet-glow">
            <TextScramble as="span" text="TIWARI." duration={1600} />
          </span>
        </h1>
        <p className="mt-10 text-sm md:text-base tracking-[0.2em] text-muted-foreground max-w-2xl">
          <TextScramble as="span" text="FULL STACK WEB DEVELOPER // ENGINEERING THE UNSEEN." duration={1800} />
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 text-[10px] tracking-[0.3em] text-muted-foreground">
        <div className="space-y-2">
          <p>LAT 28.6139° N — LON 77.2090° E</p>
          <p>STATUS: <span className="text-violet-glow">AVAILABLE_FOR_HIRE</span></p>
        </div>
        <Link to="/services" className="group flex items-center gap-3 text-foreground hover:text-violet-glow transition-colors">
          <span>SCROLL TO ENTER</span>
          <span className="inline-block group-hover:translate-x-2 transition-transform">↓</span>
        </Link>
      </div>
    </section>
  );
}
