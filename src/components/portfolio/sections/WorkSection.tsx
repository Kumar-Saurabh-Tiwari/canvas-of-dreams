import TextScramble from "../TextScramble";
import Reveal from "../Reveal";
import { useSceneStore } from "../scene-store";
import { useRef } from "react";
import { gsap } from "gsap";

const projects = [
  { num: "W/01", title: "CLIENT MANAGEMENT FRONTEND", year: "2025", tag: "REACT / TANSTACK" },
  { num: "W/02", title: "ED-TECH SAAS PLATFORM", year: "2024", tag: "NEXT.JS / POSTGRES" },
  { num: "W/03", title: "OPEN SOURCE INITIATIVES", year: "ONGOING", tag: "TYPESCRIPT / OSS" },
  { num: "W/04", title: "AI AGENT ORCHESTRATOR", year: "2025", tag: "NODE / LLM" },
  { num: "W/05", title: "REALTIME COLLAB ENGINE", year: "2024", tag: "WS / CRDT" },
];

function ProjectRow({ p, i }: { p: typeof projects[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const setIntensity = useSceneStore((s) => s.setIntensity);
  const onEnter = () => {
    setIntensity(2.4);
    if (ref.current) gsap.to(ref.current, { skewX: -8, x: 24, duration: 0.5, ease: "power3.out" });
  };
  const onLeave = () => {
    setIntensity(1);
    if (ref.current) gsap.to(ref.current, { skewX: 0, x: 0, duration: 0.6, ease: "power3.out" });
  };
  return (
    <Reveal delay={i * 0.08} y={20}>
      <div onMouseEnter={onEnter} onMouseLeave={onLeave} className="group border-b border-border py-8 md:py-10 cursor-pointer">
        <div ref={ref} className="flex items-baseline justify-between gap-6 will-change-transform">
          <div className="flex items-baseline gap-6 md:gap-10 flex-1 min-w-0">
            <span className="text-[10px] tracking-[0.3em] text-violet-glow shrink-0">{p.num}</span>
            <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight truncate group-hover:text-violet-glow transition-colors">{p.title}</h3>
          </div>
          <div className="hidden md:flex items-baseline gap-6 text-[10px] tracking-[0.3em] text-muted-foreground shrink-0">
            <span>{p.tag}</span><span className="text-foreground">{p.year}</span><span className="text-violet-glow">→</span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function WorkSection() {
  return (
    <section id="work" className="relative min-h-screen px-6 md:px-16 py-32 font-mono">
      <Reveal><p className="text-[10px] tracking-[0.4em] text-muted-foreground mb-6">[ 03 // WORK ]</p></Reveal>
      <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-24 text-glow">
        <TextScramble as="span" triggerOnView text="LIMITS NOT FOUND" duration={1600} />
      </h2>
      <div className="border-t border-border max-w-7xl">
        {projects.map((p, i) => <ProjectRow key={p.num} p={p} i={i} />)}
      </div>
      <p className="mt-12 text-[10px] tracking-[0.3em] text-muted-foreground">[ {projects.length.toString().padStart(2, "0")} ENTRIES // MORE ON REQUEST ]</p>
    </section>
  );
}
