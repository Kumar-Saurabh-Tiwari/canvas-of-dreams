import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const items = [
  { id: "intro", label: "INTRO", num: "01" },
  { id: "services", label: "SERVICES", num: "02" },
  { id: "work", label: "WORK", num: "03" },
  { id: "contact", label: "CONTACT", num: "04" },
] as const;

export default function SideNav() {
  const lenis = useLenis();
  const [active, setActive] = useState<string>("intro");
  const logoRef = useRef<HTMLButtonElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      gsap.set([logoRef.current, tagRef.current], { opacity: 0, y: -12, filter: "blur(8px)" });
      gsap.set(navRef.current?.querySelectorAll("button") ?? [], { opacity: 0, x: 30, filter: "blur(6px)" });
      gsap.set(mobileNavRef.current, { opacity: 0, y: 20 });

      tl.to(logoRef.current, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, delay: 0.2 })
        .to(tagRef.current, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1 }, "<0.1")
        .to(
          navRef.current?.querySelectorAll("button") ?? [],
          { opacity: 1, x: 0, filter: "blur(0px)", duration: 1, stagger: 0.09 },
          "<0.05"
        )
        .to(mobileNavRef.current, { opacity: 1, y: 0, duration: 0.9 }, "<0.2");
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ids = items.map((i) => i.id);
    const getSections = () =>
      ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => !!el);

    const compute = () => {
      const sections = getSections();
      if (!sections.length) return;
      const probe = window.innerHeight * 0.35;
      let current = sections[0].id;
      for (const s of sections) {
        const rect = s.getBoundingClientRect();
        if (rect.top - probe <= 0) current = s.id;
        else break;
      }
      setActive(current);
    };

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  const go = (id: string) => () => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.6 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <button ref={logoRef} onClick={go("intro")} className="fixed top-6 left-6 z-50 font-mono text-xs tracking-widest text-foreground/80 mix-blend-difference hover:text-violet-glow transition-colors will-change-transform">
        KST<span className="text-violet">_</span>///
      </button>
      <div ref={tagRef} className="fixed top-6 right-6 z-50 font-mono text-[10px] tracking-[0.3em] text-muted-foreground mix-blend-difference will-change-transform">
        v.2026 — ENGINEERING THE UNSEEN
      </div>

      <nav ref={navRef} className="fixed top-1/2 right-6 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3 font-mono text-[11px] tracking-[0.25em]">
        {items.map((it) => {
          const isActive = active === it.id;
          return (
            <button key={it.id} onClick={go(it.id)} className={`group relative flex items-center gap-3 transition-all duration-500 will-change-transform ${isActive ? "text-foreground translate-x-[-6px]" : "text-muted-foreground hover:text-foreground hover:translate-x-[-3px]"}`}>
              <span className={`transition-opacity duration-500 ${isActive ? "opacity-100 text-violet-glow" : "opacity-50"}`}>{it.num}</span>
              <span className={`relative transition-all duration-500 ${isActive ? "text-glow" : ""}`}>
                <span className="relative z-10">[ {it.label} ]</span>
                {isActive && (
                  <span className="absolute inset-0 -z-10 blur-md bg-violet-glow/20 rounded" />
                )}
              </span>
              <span className={`h-px bg-violet-glow transition-all duration-500 ${isActive ? "w-10 opacity-100 shadow-[0_0_8px_var(--violet-glow,#a78bfa)]" : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-60"}`} />
              {isActive && <span className="absolute -right-2 h-1.5 w-1.5 rounded-full bg-violet-glow animate-pulse" />}
            </button>
          );
        })}
      </nav>

      <nav ref={mobileNavRef} className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex md:hidden gap-4 font-mono text-[10px] tracking-widest bg-background/60 backdrop-blur-xl px-4 py-2 rounded-full border border-border shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {items.map((it) => (
          <button key={it.id} onClick={go(it.id)} className={`transition-all duration-300 ${active === it.id ? "text-foreground text-glow scale-110" : "text-muted-foreground hover:text-foreground"}`}>{it.label}</button>
        ))}
      </nav>
    </>
  );
}
