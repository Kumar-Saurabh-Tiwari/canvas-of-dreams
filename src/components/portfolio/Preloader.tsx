import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const TECH = [
  "INITIALIZING_KERNEL",
  "LOADING REACT // NEXT.JS",
  "COMPILING TYPESCRIPT",
  "SPINNING UP NODE.JS",
  "CONNECTING POSTGRES",
  "RENDERING THREE.JS SCENE",
  "CALIBRATING GSAP TIMELINE",
  "READY.",
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "GOOD MORNING";
  if (h < 17) return "GOOD AFTERNOON";
  return "GOOD EVENING";
}

export default function Preloader({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const greetRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const [greeting] = useState(getGreeting());

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(rootRef.current, {
            yPercent: -100,
            duration: 1.1,
            ease: "expo.inOut",
            onComplete: onDone,
          });
        },
      });

      // Greeting reveal (no blur — keep text crisp)
      gsap.set(greetRef.current, { opacity: 0, y: 20 });
      gsap.set(".pre-greet-char", { yPercent: 100, opacity: 0 });
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left" });

      tl.to(greetRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
        .to(".pre-greet-char", { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.04, ease: "expo.out" }, "-=0.3")
        .to(lineRef.current, { scaleX: 1, duration: 0.8, ease: "expo.out" }, "-=0.4");

      // Progress with tech labels
      const obj = { v: 0 };
      tl.to(obj, {
        v: 100,
        duration: 2.6,
        ease: "power2.inOut",
        onUpdate: () => {
          const v = Math.round(obj.v);
          if (pctRef.current) pctRef.current.textContent = String(v).padStart(3, "0");
          if (barRef.current) barRef.current.style.transform = `scaleX(${v / 100})`;
          const idx = Math.min(TECH.length - 1, Math.floor((v / 100) * TECH.length));
          const el = document.getElementById("pre-tech-label");
          if (el && el.dataset.idx !== String(idx)) {
            el.dataset.idx = String(idx);
            gsap.fromTo(
              el,
              { yPercent: 100, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 0.45, ease: "expo.out" },
            );
            el.textContent = TECH[idx];
          }
        },
      });

      tl.to({}, { duration: 0.35 });
    }, rootRef);
    return () => ctx.revert();
  }, [onDone]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-background font-mono px-6 md:px-16 py-10 overflow-hidden"
    >
      {/* Top marker */}
      <div className="flex items-center justify-between text-[10px] tracking-[0.4em] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-violet-glow animate-ping opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-glow" />
          </span>
          <span className="text-violet-glow">BOOTING_SYSTEM</span>
        </div>
        <span>v1.0.0 // KST</span>
      </div>

      {/* Greeting center */}
      <div ref={greetRef} className="flex flex-col items-start gap-6">
        <div className="text-[10px] tracking-[0.5em] text-muted-foreground">[ WELCOME ]</div>
        <div className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] leading-none text-foreground">
          <span className="inline-block overflow-hidden align-bottom">
            {greeting.split("").map((c, i) => (
              <span key={i} className="pre-greet-char inline-block">
                {c === " " ? "\u00A0" : c}
              </span>
            ))}
          </span>
        </div>
        <div ref={lineRef} className="h-px w-40 bg-violet-glow" />
      </div>

      {/* Bottom progress */}
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between text-[10px] tracking-[0.4em] text-muted-foreground">
          <div className="overflow-hidden h-4">
            <div id="pre-tech-label" className="text-foreground">
              {TECH[0]}
            </div>
          </div>
          <div className="text-violet-glow">
            <span ref={pctRef}>000</span>%
          </div>
        </div>
        <div className="relative h-px w-full bg-border overflow-hidden">
          <div
            ref={barRef}
            className="absolute inset-0 origin-left bg-violet-glow"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
}