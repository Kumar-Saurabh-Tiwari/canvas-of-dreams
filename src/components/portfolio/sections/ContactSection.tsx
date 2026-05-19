import TextScramble from "../TextScramble";
import Reveal from "../Reveal";
import { Github, Linkedin, ArrowUpRight, Mail } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="relative min-h-screen px-6 md:px-16 py-32 font-mono flex flex-col">
      <Reveal>
        <p className="text-[10px] tracking-[0.4em] text-muted-foreground mb-6">[ 04 // CONTACT ]</p>
      </Reveal>

      <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-10 text-glow max-w-4xl">
        <TextScramble as="span" triggerOnView text="OPEN A CHANNEL." duration={1400} />
      </h2>

      <Reveal delay={0.1}>
        <p className="max-w-2xl text-sm md:text-base tracking-[0.15em] text-muted-foreground leading-relaxed mb-12">
          Have a project, role, or idea in mind? Let's talk. Replies usually within 48 hours.
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4">
          <a
            href="https://portfolio.skumar.space/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-4 overflow-hidden border border-foreground bg-foreground text-background px-8 py-5 text-[12px] tracking-[0.35em] font-semibold transition-all duration-300 hover:bg-transparent hover:text-foreground hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(15,23,42,0.4)]"
          >
            <span className="relative z-10">GET IN TOUCH</span>
            <ArrowUpRight
              size={16}
              className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </a>

          <a
            href="mailto:hello@skumar.space"
            className="group inline-flex items-center gap-3 border border-border hover:border-foreground px-6 py-5 text-[11px] tracking-[0.3em] text-foreground transition-colors"
          >
            <Mail size={14} className="text-violet-glow" />
            <span>EMAIL DIRECTLY</span>
          </a>
        </div>
      </Reveal>

      <Reveal delay={0.3}>
        <div className="mt-16 flex flex-wrap items-center gap-6 text-[10px] tracking-[0.3em] text-muted-foreground">
          <span className="text-violet-glow">// FIND ME ON</span>
          <a
            href="https://github.com/Kumar-Saurabh-Tiwari"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Github size={14} /> GITHUB
          </a>
          <a
            href="https://www.linkedin.com/in/saurabh-tiwari11/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Linkedin size={14} /> LINKEDIN
          </a>
        </div>
      </Reveal>

      <footer className="mt-auto pt-24 border-t border-border flex flex-col md:flex-row justify-between gap-4 text-[10px] tracking-[0.3em] text-muted-foreground">
        <p>© 2026 KUMAR SAURABH TIWARI</p>
        <a
          href="mailto:hello@skumar.space"
          className="hover:text-foreground transition-colors"
        >
          hello@skumar.space
        </a>
        <p>END_OF_TRANSMISSION ///</p>
      </footer>
    </section>
  );
}
