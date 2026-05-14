import TextScramble from "../TextScramble";
import Reveal from "../Reveal";

const services = [
  { num: "S/01", title: "FRONTEND DEVELOPMENT", body: "Pixel-tight interfaces in React, Next.js, and TypeScript. Motion, WebGL, and design systems that scale beyond the demo.", stack: ["REACT", "NEXT.JS", "TYPESCRIPT", "GSAP", "THREE.JS"] },
  { num: "S/02", title: "BACKEND ARCHITECTURE", body: "Scalable APIs and data models in Node.js. Postgres, Redis, queues, auth — boring infrastructure that refuses to break.", stack: ["NODE.JS", "POSTGRES", "REDIS", "DOCKER", "REST/GRAPHQL"] },
  { num: "S/03", title: "AI-DRIVEN WORKFLOWS", body: "LLM pipelines, RAG, agents, and tool-use orchestrations wired into product surfaces — not chatbot toys.", stack: ["OPENAI", "LANGCHAIN", "VECTOR DB", "STREAMING", "EVALS"] },
];

export default function ServicesSection() {
  return (
    <section id="services" className="relative min-h-screen px-6 md:px-16 py-32 font-mono">
      <Reveal><p className="text-[10px] tracking-[0.4em] text-muted-foreground mb-6">[ 02 // SERVICES ]</p></Reveal>
      <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-20 text-glow max-w-4xl">
        <TextScramble as="span" triggerOnView text="MY EXPERTISE." />
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border max-w-7xl">
        {services.map((s, i) => (
          <Reveal key={s.num} delay={i * 0.12} as="article" className="group bg-background/60 backdrop-blur p-8 md:p-10 hover:bg-violet/10 transition-colors duration-500 border border-transparent hover:border-violet/30">
            <div className="flex justify-between items-start mb-12">
              <span className="text-[10px] tracking-[0.3em] text-violet-glow">{s.num}</span>
              <span className="text-[10px] tracking-widest text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold tracking-wide mb-6 text-foreground">{s.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground mb-8">{s.body}</p>
            <ul className="flex flex-wrap gap-2 text-[9px] tracking-widest text-muted-foreground">
              {s.stack.map((t) => <li key={t} className="border border-border px-2 py-1">{t}</li>)}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
