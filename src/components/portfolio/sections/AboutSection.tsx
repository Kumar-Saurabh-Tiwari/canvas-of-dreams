import TextScramble from "../TextScramble";
import Reveal from "../Reveal";

export default function AboutSection() {
  return (
    <section id="about" className="relative min-h-screen px-6 md:px-16 py-32 font-mono flex flex-col justify-center">
      <Reveal><p className="text-[10px] tracking-[0.4em] text-muted-foreground mb-6">[ 01.5 // SIGNAL ]</p></Reveal>
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight max-w-5xl text-glow">
        <TextScramble as="span" triggerOnView text="A BRUTALIST APPROACH TO MODERN JAVASCRIPT. ARCHITECTING SCALABLE SYSTEMS WITH REACT, NEXT.JS, AND NODE.JS." duration={2400} />
      </h2>
      <Reveal delay={0.3}>
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl text-[10px] tracking-[0.25em] text-muted-foreground">
          <div><p className="text-violet-glow mb-2">YEARS</p><p className="text-foreground text-2xl">04+</p></div>
          <div><p className="text-violet-glow mb-2">SHIPPED</p><p className="text-foreground text-2xl">30+</p></div>
          <div><p className="text-violet-glow mb-2">STACK</p><p className="text-foreground text-2xl">FULL</p></div>
          <div><p className="text-violet-glow mb-2">MODE</p><p className="text-foreground text-2xl">DEEP</p></div>
        </div>
      </Reveal>
    </section>
  );
}
