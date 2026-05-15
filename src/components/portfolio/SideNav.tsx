import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";

const items = [
  { id: "intro", label: "INTRO", num: "01" },
  { id: "services", label: "SERVICES", num: "02" },
  { id: "work", label: "WORK", num: "03" },
  { id: "contact", label: "CONTACT", num: "04" },
] as const;

export default function SideNav() {
  const lenis = useLenis();
  const [active, setActive] = useState<string>("intro");

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
      <button onClick={go("intro")} className="fixed top-6 left-6 z-50 font-mono text-xs tracking-widest text-foreground/80 mix-blend-difference hover:text-violet-glow transition-colors">
        KST<span className="text-violet">_</span>///
      </button>
      <div className="fixed top-6 right-6 z-50 font-mono text-[10px] tracking-[0.3em] text-muted-foreground mix-blend-difference">
        v.2026 — ENGINEERING THE UNSEEN
      </div>

      <nav className="fixed top-1/2 right-6 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3 font-mono text-[11px] tracking-[0.25em]">
        {items.map((it) => {
          const isActive = active === it.id;
          return (
            <button key={it.id} onClick={go(it.id)} className={`group flex items-center gap-3 transition-colors ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <span className="opacity-50">{it.num}</span>
              <span className={isActive ? "text-glow" : ""}>[ {it.label} ]</span>
              <span className={`h-px bg-violet-glow transition-all ${isActive ? "w-8 opacity-100" : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-60"}`} />
            </button>
          );
        })}
      </nav>

      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex md:hidden gap-4 font-mono text-[10px] tracking-widest bg-background/60 backdrop-blur px-4 py-2 rounded-full border border-border">
        {items.map((it) => (
          <button key={it.id} onClick={go(it.id)} className={active === it.id ? "text-foreground text-glow" : "text-muted-foreground"}>{it.label}</button>
        ))}
      </nav>
    </>
  );
}
