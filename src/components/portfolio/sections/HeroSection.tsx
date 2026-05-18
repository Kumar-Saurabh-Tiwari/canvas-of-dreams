import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextScramble from "../TextScramble";
import { useSceneStore } from "../scene-store";
import { Github, Linkedin, ArrowUpRight, Coffee, Atom, Server, FileJson } from "lucide-react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const floatIconsRef = useRef<HTMLDivElement>(null);
  const setIntensity = useSceneStore((s) => s.setIntensity);

  // Intro entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([markerRef.current, subRef.current, metaRef.current, scrollRef.current], { opacity: 0, y: 30, filter: "blur(12px)" });
      gsap.set(".hero-line", { yPercent: 110, opacity: 0, skewY: 6 });
      gsap.set(".hero-char", { opacity: 0, y: 40, rotateX: -90 });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.to(markerRef.current, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 })
        .to(".hero-line", { yPercent: 0, opacity: 1, skewY: 0, duration: 1.4, stagger: 0.12 }, "-=0.5")
        .to(".hero-char", { opacity: 1, y: 0, rotateX: 0, duration: 0.6, stagger: { each: 0.018, from: "random" }, ease: "back.out(1.4)" }, "-=1.0")
        .to([subRef.current, metaRef.current, scrollRef.current], { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.15 }, "-=0.6");

      // Floating orbs continuous drift
      const orbs = orbsRef.current?.querySelectorAll(".hero-orb");
      orbs?.forEach((orb, i) => {
        gsap.to(orb, {
          x: `+=${30 + i * 10}`,
          y: `+=${-40 + i * 15}`,
          duration: 6 + i * 1.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      // Marquee infinite scroll
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, { xPercent: -50, duration: 30, ease: "none", repeat: -1 });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Scroll-driven parallax + sphere intensity
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
          onUpdate: (self) => setIntensity(1 + self.progress * 2.2),
        },
      });
      tl.to(headlineRef.current, { yPercent: -25, scale: 0.92, ease: "none" }, 0)
        .to(markerRef.current, { yPercent: -120, opacity: 0, ease: "none" }, 0)
        .to(subRef.current, { yPercent: -60, opacity: 0.2, ease: "none" }, 0)
        .to(metaRef.current, { yPercent: -40, opacity: 0.3, ease: "none" }, 0);
    }, sectionRef);
    return () => {
      ctx.revert();
      setIntensity(1);
    };
  }, [setIntensity]);

  // Magnetic cursor + spotlight follow
  useEffect(() => {
    const el = headlineRef.current;
    const spot = spotlightRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / r.width;
      const y = (e.clientY - (r.top + r.height / 2)) / r.height;
      gsap.to(el, { x: x * 18, y: y * 10, rotateX: -y * 4, rotateY: x * 6, duration: 0.8, ease: "power3.out" });
      if (spot && sectionRef.current) {
        const sr = sectionRef.current.getBoundingClientRect();
        gsap.to(spot, {
          x: e.clientX - sr.left,
          y: e.clientY - sr.top,
          duration: 0.6,
          ease: "power3.out",
        });
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const renderChars = (text: string) =>
    text.split("").map((c, i) => (
      <span key={i} className="hero-char inline-block" style={{ transformOrigin: "50% 100%" }}>
        {c === " " ? "\u00A0" : c}
      </span>
    ));

  return (
    <section
      ref={sectionRef}
      id="intro"
      className="relative min-h-screen flex flex-col px-6 md:px-16 pt-8 pb-6 font-mono overflow-hidden"
    >
      {/* Cursor spotlight */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full opacity-60 blur-3xl mix-blend-multiply"
        style={{ background: "radial-gradient(circle, rgba(15, 23, 42, 0.06), transparent 65%)", left: 0, top: 0 }}
        aria-hidden
      />

      {/* Background Image from user */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
        <picture>
          <source media="(max-width: 767px)" srcSet="/assets/bg-img-sm.webp" type="image/webp" />
          <source srcSet="/assets/bg-img.webp" type="image/webp" />
          <img
            src="/assets/bg-img.webp"
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onLoad={(e) => e.currentTarget.classList.add("hero-bg-loaded")}
            className="hero-bg absolute inset-0 w-full h-full object-cover object-center md:object-right opacity-0 transition-opacity duration-[1400ms] ease-out will-change-[opacity,transform]"
          />
        </picture>
        {/* Soft gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/40 to-transparent md:via-background/30" />
        {/* Header legibility scrim — stronger on mobile, tapered on desktop */}
        <div className="absolute inset-x-0 top-0 h-40 md:h-56 bg-gradient-to-b from-background via-background/85 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-20 md:h-24 bg-background/70 backdrop-blur-[2px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      </div>

      {/* Decorative grid lines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden>
        <div className="absolute inset-y-0 left-1/4 w-px bg-foreground" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-foreground" />
        <div className="absolute inset-y-0 left-3/4 w-px bg-foreground" />
        <div className="absolute inset-x-0 top-1/3 h-px bg-foreground" />
        <div className="absolute inset-x-0 top-2/3 h-px bg-foreground" />
      </div>

      {/* Floating violet halo behind headline */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full opacity-20 blur-3xl mix-blend-multiply"
        style={{ background: "radial-gradient(circle, rgba(15, 23, 42, 0.08), transparent 60%)" }}
        aria-hidden
      />

      {/* Top bar: section marker + live status */}
      <div ref={markerRef} className="relative z-10 flex items-center justify-between gap-4 text-[10px] tracking-[0.4em] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="inline-block h-px w-10 bg-violet-glow" />
          <span>[ 01 // INTRO ]</span>
        </div>
        <span className="inline-flex items-center gap-2">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-violet-glow animate-ping opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-glow" />
          </span>
          <span className="text-violet-glow">LIVE_TRANSMISSION</span>
        </span>
      </div>

      {/* Main headline block */}
      <div className="relative flex-1 flex flex-col justify-center max-w-4xl z-10 py-16 md:py-20 pointer-events-auto">
        <h1
          ref={headlineRef}
          className="relative text-4xl md:text-6xl lg:text-[6rem] xl:text-[7rem] font-bold leading-[0.92] tracking-[-0.04em] text-glow will-change-transform"
          style={{ perspective: 1000 }}
        >
          <span className="block overflow-hidden pb-2">
            <span className="hero-line block text-[#0f172a] drop-shadow-sm">{renderChars("KUMAR SAURABH")}</span>
          </span>
          <span className="block overflow-hidden -mt-4 lg:-mt-6">
            <span
              className="hero-line block opacity-20 mix-blend-multiply blur-[1px]"
              style={{
                backgroundImage:
                  "linear-gradient(110deg, #94a3b8 0%, #cbd5e1 45%, #e2e8f0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {renderChars("TIWARI.")}
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p ref={subRef} className="mt-8 text-sm md:text-base tracking-[0.25em] text-[#334155] max-w-2xl flex flex-col gap-2 font-medium">
          <span className="flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-slate-400" />
            <TextScramble as="span" text="FULL STACK WEB DEVELOPER" duration={1500} />
          </span>
          <span className="pl-11 text-muted-foreground">
            <TextScramble as="span" text="ENGINEERING THE UNSEEN" duration={2000} />
          </span>
        </p>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-2 mt-8 md:pl-11 max-w-2xl">
          {["MERN STACK", "NEXT.JS", "LLM & AI", "GCP", "PERFORMANCE"].map((tech, i) => (
            <div
              key={tech}
              className="px-3 py-1.5 rounded-md border border-slate-300 bg-white/70 backdrop-blur-sm text-[10px] tracking-[0.15em] font-semibold text-slate-800 shadow-sm transition-all hover:bg-white hover:-translate-y-0.5"
              style={{ animation: `fade-in 1s ease-out ${1.5 + i * 0.12}s both` }}
            >
              {tech}
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div className="flex flex-wrap items-center gap-3 mt-8 md:pl-11">
          <a
            href="https://saurabh-portfolio-next.vercel.app/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 bg-foreground text-background px-5 h-10 text-[11px] tracking-[0.25em] font-semibold rounded-md shadow-sm hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(15,23,42,0.4)] transition-all"
          >
            <span>GET IN TOUCH</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <a
            href="https://saurabh-portfolio-next.vercel.app/projects"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 border border-border hover:border-foreground px-5 h-10 text-[11px] tracking-[0.25em] font-semibold rounded-md text-foreground transition-colors"
          >
            <span>VIEW WORK</span>
            <ArrowUpRight size={14} className="text-violet-glow group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Footer meta row */}
      <div ref={metaRef} className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-[10px] tracking-[0.3em] text-muted-foreground">
        {/* Location + status */}
        <div className="space-y-1.5">
          <p className="text-foreground/60">LOCATION</p>
          <p>28.6139° N — 77.2090° E</p>
          <p>
            <span className="text-foreground/60">STATUS // </span>
            <span className="text-violet-glow">AVAILABLE_FOR_HIRE</span>
          </p>
        </div>

        {/* Socials */}
        <div className="space-y-2 md:justify-self-center">
          <p className="text-foreground/60">CONNECT</p>
          <div className="flex items-center gap-2">
            <a href="https://github.com/Kumar-Saurabh-Tiwari" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
               className="inline-flex items-center justify-center h-8 w-8 border border-border hover:border-violet-glow hover:text-violet-glow text-foreground transition-colors rounded-sm">
              <Github size={14} />
            </a>
            <a href="https://www.linkedin.com/in/saurabh-tiwari11/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
               className="inline-flex items-center justify-center h-8 w-8 border border-border hover:border-violet-glow hover:text-violet-glow text-foreground transition-colors rounded-sm">
              <Linkedin size={14} />
            </a>
          </div>
        </div>

        {/* Scroll cue */}
        <div ref={scrollRef} className="flex md:justify-end items-end gap-3 text-foreground">
          <span className="overflow-hidden inline-block">
            <span className="inline-block animate-[grain_3s_ease-in-out_infinite]">SCROLL TO DECRYPT</span>
          </span>
          <span className="inline-block animate-bounce">↓</span>
        </div>
      </div>

      {/* Infinite marquee ribbon */}
      <div className="relative mt-8 overflow-hidden border-y border-border/40 py-3">
        <div ref={marqueeRef} className="flex whitespace-nowrap gap-12 text-[11px] tracking-[0.4em] text-muted-foreground will-change-transform">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-12 shrink-0">
              <span>REACT</span><span className="text-violet-glow">✦</span>
              <span>NEXT.JS</span><span className="text-violet-glow">✦</span>
              <span>NODE.JS</span><span className="text-violet-glow">✦</span>
              <span>TYPESCRIPT</span><span className="text-violet-glow">✦</span>
              <span>POSTGRES</span><span className="text-violet-glow">✦</span>
              <span>THREE.JS</span><span className="text-violet-glow">✦</span>
              <span>GSAP</span><span className="text-violet-glow">✦</span>
              <span>TAILWIND</span><span className="text-violet-glow">✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}