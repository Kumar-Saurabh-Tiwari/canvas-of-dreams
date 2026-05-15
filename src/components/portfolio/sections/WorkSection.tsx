import TextScramble from "../TextScramble";
import Reveal from "../Reveal";
import { useSceneStore } from "../scene-store";
import { useRef } from "react";
import { gsap } from "gsap";
import { Github, ArrowUpRight, Briefcase } from "lucide-react";

const GITHUB_URL = "https://github.com/Kumar-Saurabh-Tiwari";

const projects = [
  { num: "W/01", title: "PAN ADMIN DASHBOARD", year: "2025", tag: "NEXT.JS / MONGO / STRIPE" },
  { num: "W/02", title: "MI-RECALL BUSINESS CARD VAULT", year: "2025", tag: "REACT / NODE / OPENAI" },
  { num: "W/03", title: "CURALINK AI HEALTH ASSISTANT", year: "2025", tag: "REACT / NODE / OPENAI" },
  { num: "W/04", title: "SK WEB HUB — AGENCY LANDING", year: "2024", tag: "HTML / CSS / JS" },
  { num: "W/05", title: "ROAMIFY TICKETS — TRAVEL UI", year: "2024", tag: "REACT / RESPONSIVE UI" },
  { num: "W/06", title: "FOODIE APP — ORDERING PLATFORM", year: "2024", tag: "ANGULAR / NODE / RAZORPAY" },
];

const experience = [
  {
    range: "DEC 2023 — APR 2026",
    role: "FULL STACK DEVELOPER",
    company: "CTO NINJA",
    summary:
      "Engineer scalable, high-performance web applications with focus on system architecture, reliability, and user experience.",
    bullets: [
      "Architected backend systems with optimized schemas, secure REST APIs, and cloud-ready deployment infra.",
      "Engineered performant Next.js frontends with advanced state management and responsive design patterns.",
      "Built CI/CD pipelines and enforced code quality through automated testing and reviews.",
    ],
  },
  {
    range: "FEATURED PROJECT",
    role: "FULL STACK DEVELOPER",
    company: "PAN GLOBAL NETWORK",
    summary:
      "Architected and deployed a production-scale membership platform — role-based access, real-time chat, and external integrations.",
    bullets: [
      "Enterprise-grade RBAC across multiple membership tiers with granular permissions.",
      "Real-time chat infra with moderation, structured forums, and engagement tracking.",
      "Resource management system with secure file handling and admin dashboards.",
      "Integrated Google Calendar, Eventbrite, and Luma APIs with centralized event orchestration.",
    ],
  },
  {
    range: "SEP 2023 — DEC 2023",
    role: "WEB DEVELOPER",
    company: "ROBOFLY TECHNOLOGY PVT LTD",
    summary:
      "Developed responsive web applications focused on UI/UX implementation and cross-platform compatibility.",
    bullets: [
      "Pixel-perfect UI components and responsive layouts in modern HTML5, CSS3, and JS.",
      "Resolved cross-browser compatibility issues for consistent UX across all major browsers.",
      "Optimized for performance and accessibility — measurable user satisfaction gains.",
    ],
  },
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
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="group block border-b border-border py-8 md:py-10 cursor-pointer"
      >
        <div ref={ref} className="flex items-baseline justify-between gap-6 will-change-transform">
          <div className="flex items-baseline gap-6 md:gap-10 flex-1 min-w-0">
            <span className="text-[10px] tracking-[0.3em] text-violet-glow shrink-0">{p.num}</span>
            <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight truncate group-hover:text-violet-glow transition-colors">{p.title}</h3>
          </div>
          <div className="hidden md:flex items-baseline gap-6 text-[10px] tracking-[0.3em] text-muted-foreground shrink-0">
            <span>{p.tag}</span>
            <span className="text-foreground">{p.year}</span>
            <ArrowUpRight className="text-violet-glow group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={14} />
          </div>
        </div>
      </a>
    </Reveal>
  );
}

export default function WorkSection() {
  return (
    <section id="work" className="relative min-h-screen px-6 md:px-16 py-32 font-mono">
      <Reveal><p className="text-[10px] tracking-[0.4em] text-muted-foreground mb-6">[ 03 // WORK ]</p></Reveal>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-glow">
          <TextScramble as="span" triggerOnView text="LIMITS NOT FOUND" duration={1600} />
        </h2>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3 border border-violet-glow/40 hover:border-violet-glow hover:bg-violet/10 px-5 py-3 text-[11px] tracking-[0.3em] text-foreground transition-all self-start md:self-auto"
        >
          <Github size={14} className="text-violet-glow" />
          <span>VIEW ALL ON GITHUB</span>
          <ArrowUpRight size={14} className="text-violet-glow group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </a>
      </div>

      <div className="border-t border-border max-w-7xl">
        {projects.map((p, i) => <ProjectRow key={p.num} p={p} i={i} />)}
      </div>
      <p className="mt-12 text-[10px] tracking-[0.3em] text-muted-foreground">
        [ {projects.length.toString().padStart(2, "0")} ENTRIES // CLICK ANY ROW → GITHUB ]
      </p>

      {/* Work Experience timeline */}
      <div className="mt-40 max-w-6xl">
        <Reveal>
          <div className="flex items-center gap-3 text-[10px] tracking-[0.4em] text-muted-foreground mb-6">
            <Briefcase size={12} className="text-violet-glow" />
            <span>[ 03.5 // WORK EXPERIENCE ]</span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-glow">
            BUILT IN PRODUCTION.
          </h3>
          <p className="text-sm tracking-[0.2em] text-muted-foreground mb-16 max-w-2xl">
            Hands-on experience across product builds, client work, and scalable web application delivery.
          </p>
        </Reveal>

        <div className="relative pl-6 md:pl-10 border-l border-border space-y-10">
          {experience.map((x, i) => (
            <Reveal key={x.role + x.company} delay={i * 0.1} y={24}>
              <div className="relative">
                <span className="absolute -left-[31px] md:-left-[47px] top-3 inline-flex h-3 w-3">
                  <span className="absolute inset-0 rounded-full bg-violet-glow animate-ping opacity-60" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-violet-glow ring-4 ring-background" />
                </span>
                <article className="group relative bg-background/40 backdrop-blur border border-border hover:border-violet/40 transition-colors p-6 md:p-8">
                  <p className="text-[10px] tracking-[0.4em] text-violet-glow mb-3">{x.range}</p>
                  <h4 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{x.role}</h4>
                  <p className="text-sm tracking-[0.2em] text-muted-foreground mt-1 mb-5">{x.company}</p>
                  <p className="text-sm leading-relaxed text-foreground/80 mb-5">{x.summary}</p>
                  <ul className="space-y-2">
                    {x.bullets.map((b) => (
                      <li key={b} className="flex gap-3 text-[12px] leading-relaxed text-muted-foreground">
                        <span className="text-violet-glow shrink-0">▸</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <a
            href="https://saurabh-portfolio-next.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-16 inline-flex items-center gap-3 border border-violet-glow/40 hover:border-violet-glow hover:bg-violet/10 px-6 py-4 text-[11px] tracking-[0.3em] text-foreground transition-all"
          >
            <span>KNOW MORE ABOUT ME</span>
            <ArrowUpRight size={14} className="text-violet-glow group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
