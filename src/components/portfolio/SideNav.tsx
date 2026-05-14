import { Link } from "@tanstack/react-router";

const items = [
  { to: "/", label: "INTRO", num: "01" },
  { to: "/services", label: "SERVICES", num: "02" },
  { to: "/work", label: "WORK", num: "03" },
  { to: "/contact", label: "CONTACT", num: "04" },
] as const;

export default function SideNav() {
  return (
    <>
      {/* Top brand */}
      <div className="fixed top-6 left-6 z-50 font-mono text-xs tracking-widest text-foreground/80 mix-blend-difference">
        <Link to="/" className="hover:text-violet-glow transition-colors">
          KST<span className="text-violet">_</span>///
        </Link>
      </div>
      <div className="fixed top-6 right-6 z-50 font-mono text-[10px] tracking-[0.3em] text-muted-foreground mix-blend-difference">
        v.2026 — ENGINEERING THE UNSEEN
      </div>

      {/* Side nav */}
      <nav className="fixed top-1/2 right-6 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3 font-mono text-[11px] tracking-[0.25em]">
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            activeOptions={{ exact: true }}
            className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
            activeProps={{ className: "!text-foreground" }}
          >
            {({ isActive }) => (
              <>
                <span className="opacity-50">{it.num}</span>
                <span className={`transition-all ${isActive ? "text-glow" : ""}`}>
                  [ {it.label} ]
                </span>
                <span
                  className={`h-px bg-violet-glow transition-all ${
                    isActive ? "w-8 opacity-100" : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-60"
                  }`}
                />
              </>
            )}
          </Link>
        ))}
      </nav>

      {/* Mobile nav bottom */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex md:hidden gap-4 font-mono text-[10px] tracking-widest bg-background/60 backdrop-blur px-4 py-2 rounded-full border border-border">
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            activeOptions={{ exact: true }}
            className="text-muted-foreground"
            activeProps={{ className: "!text-foreground text-glow" }}
          >
            {it.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
