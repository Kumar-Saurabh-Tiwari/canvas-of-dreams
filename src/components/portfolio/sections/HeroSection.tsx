import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextScramble from "../TextScramble";
import { useSceneStore } from "../scene-store";
import { Github, Linkedin, ArrowUpRight } from "lucide-react";

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

      // Glitch flicker on headline every ~5s
      const glitch = gsap.timeline({ repeat: -1, repeatDelay: 4.5, delay: 3 });
      glitch
        .to(headlineRef.current, { skewX: 8, x: -4, duration: 0.05 })
        .to(headlineRef.current, { skewX: -6, x: 6, duration: 0.05 })
        .to(headlineRef.current, { skewX: 0, x: 0, duration: 0.1 });

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
      tl.to(headlineRef.current, { yPercent: -25, scale: 0.92, filter: "blur(2px)", ease: "none" }, 0)
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
      className="relative min-h-screen flex flex-col justify-between px-6 md:px-16 py-24 font-mono overflow-hidden"
    >
      {/* Cursor spotlight */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full opacity-40 blur-3xl mix-blend-screen"
        style={{ background: "radial-gradient(circle, oklch(0.82 0.22 305 / 0.5), transparent 65%)", left: 0, top: 0 }}
        aria-hidden
      />

      {/* Floating orbs */}
      <div ref={orbsRef} className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="hero-orb absolute top-[15%] left-[10%] w-32 h-32 rounded-full blur-2xl opacity-40" style={{ background: "radial-gradient(circle, oklch(0.7 0.25 320 / 0.6), transparent 70%)" }} />
        <div className="hero-orb absolute top-[60%] right-[15%] w-48 h-48 rounded-full blur-3xl opacity-30" style={{ background: "radial-gradient(circle, oklch(0.65 0.22 280 / 0.6), transparent 70%)" }} />
        <div className="hero-orb absolute bottom-[20%] left-[40%] w-24 h-24 rounded-full blur-2xl opacity-35" style={{ background: "radial-gradient(circle, oklch(0.78 0.2 200 / 0.5), transparent 70%)" }} />
      </div>

      {/* Decorative grid lines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden>
        <div className="absolute inset-y-0 left-1/4 w-px bg-foreground" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-foreground" />
        <div className="absolute inset-y-0 left-3/4 w-px bg-foreground" />
        <div className="absolute inset-x-0 top-1/3 h-px bg-foreground" />
        <div className="absolute inset-x-0 top-2/3 h-px bg-foreground" />
      </div>

      {/* Floating violet halo behind headline */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.30 305 / 0.6), transparent 60%)" }}
        aria-hidden
      />

      <div ref={markerRef} className="relative flex items-center gap-4 text-[10px] tracking-[0.4em] text-muted-foreground">
        <span className="inline-block h-px w-10 bg-violet-glow" />
        <span>[ 01 // INTRO ]</span>
        <span className="inline-flex items-center gap-2">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-violet-glow animate-ping opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-glow" />
          </span>
          <span className="text-violet-glow">LIVE_TRANSMISSION</span>
        </span>
      </div>

      <div className="relative flex-1 flex flex-col justify-center max-w-6xl">
        <h1
          ref={headlineRef}
          className="relative text-5xl md:text-7xl lg:text-[9rem] font-bold leading-[0.92] tracking-[-0.04em] text-glow will-change-transform"
          style={{ perspective: 1000 }}
        >
          <span className="block overflow-hidden">
            <span className="hero-line block">{renderChars("KUMAR SAURABH")}</span>
          </span>
          <span className="block overflow-hidden">
            <span
              className="hero-line block"
              style={{
                backgroundImage:
                  "linear-gradient(110deg, oklch(0.7 0.28 305) 0%, oklch(0.96 0.01 290) 45%, oklch(0.55 0.25 305) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {renderChars("TIWARI.")}
            </span>
          </span>
        </h1>

        <p ref={subRef} className="mt-10 text-sm md:text-base tracking-[0.25em] text-muted-foreground max-w-2xl flex items-center gap-3">
          <span className="inline-block h-px w-8 bg-muted-foreground/60" />
          <TextScramble as="span" text="FULL STACK WEB DEVELOPER // ENGINEERING THE UNSEEN." duration={2000} />
        </p>
      </div>

      <div ref={metaRef} className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-8 text-[10px] tracking-[0.3em] text-muted-foreground">
        <div className="space-y-2">
          <p>LAT 28.6139° N — LON 77.2090° E</p>
          <p>
            STATUS: <span className="text-violet-glow">AVAILABLE_FOR_HIRE</span>
          </p>
          <p>
            UPTIME: <span className="text-foreground">99.99%</span> · LATENCY: <span className="text-foreground">12ms</span>
          </p>
          <div className="flex items-center gap-3 pt-3">
            <a href="https://github.com/Kumar-Saurabh-Tiwari" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
               className="inline-flex items-center justify-center h-8 w-8 border border-border hover:border-violet-glow hover:text-violet-glow text-foreground transition-colors">
              <Github size={14} />
            </a>
            <a href="https://www.linkedin.com/in/saurabh-tiwari11/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
               className="inline-flex items-center justify-center h-8 w-8 border border-border hover:border-violet-glow hover:text-violet-glow text-foreground transition-colors">
              <Linkedin size={14} />
            </a>
            <a href="https://saurabh-portfolio-next.vercel.app/" target="_blank" rel="noopener noreferrer"
               className="group inline-flex items-center gap-2 border border-violet-glow/40 hover:border-violet-glow hover:bg-violet/10 px-3 h-8 text-[10px] tracking-[0.3em] text-foreground transition-colors">
              <span>KNOW MORE</span>
              <ArrowUpRight size={12} className="text-violet-glow group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
        <div ref={scrollRef} className="flex items-center gap-3 text-foreground">
          <span className="overflow-hidden inline-block">
            <span className="inline-block animate-[grain_3s_ease-in-out_infinite]">SCROLL TO DECRYPT</span>
          </span>
          <span className="inline-block translate-y-0 animate-bounce">↓</span>
        </div>
      </div>

      {/* Infinite marquee ribbon */}
      <div className="relative mt-12 overflow-hidden border-y border-border/40 py-3">
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