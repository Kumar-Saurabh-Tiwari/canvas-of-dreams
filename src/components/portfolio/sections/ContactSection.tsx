import TextScramble from "../TextScramble";
import Reveal from "../Reveal";
import { useState } from "react";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  subject: z.string().trim().min(1, "Required").max(150),
  message: z.string().trim().min(10, "Min 10 chars").max(2000),
});

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    console.log("[CONTACT_SUBMIT]", r.data);
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const field = (k: keyof typeof form) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value })),
  });

  return (
    <section id="contact" className="relative min-h-screen px-6 md:px-16 py-32 font-mono">
      <Reveal><p className="text-[10px] tracking-[0.4em] text-muted-foreground mb-6">[ 04 // CONTACT ]</p></Reveal>
      <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-16 text-glow max-w-4xl">
        <TextScramble as="span" triggerOnView text="OPEN A CHANNEL." duration={1400} />
      </h2>
      <div className="grid md:grid-cols-[1fr_2fr] gap-16 max-w-6xl">
        <Reveal as="div" className="space-y-8 text-[11px] tracking-[0.25em] text-muted-foreground">
          <div><p className="text-violet-glow mb-2">// PROTOCOL</p><p className="text-foreground leading-relaxed">Drop your details. Expect a reply within 48h — usually faster.</p></div>
          <div><p className="text-violet-glow mb-2">// AVAILABILITY</p><p className="text-foreground">Q3–Q4 2026</p></div>
          <div><p className="text-violet-glow mb-2">// SCOPE</p><p className="text-foreground">FREELANCE / CONTRACT / FULL-TIME</p></div>
        </Reveal>
        <Reveal delay={0.15} as="div">
          <form onSubmit={onSubmit} className="space-y-8" noValidate>
            {sent && <div className="border border-violet-glow/50 bg-violet/10 px-4 py-3 text-xs tracking-widest text-violet-glow">[ TRANSMISSION_RECEIVED // I'LL BE IN TOUCH ]</div>}
            {(["name", "email", "subject"] as const).map((k) => (
              <div key={k}>
                <label className="block text-[10px] tracking-[0.3em] text-muted-foreground mb-2">/ {k.toUpperCase()}</label>
                <input {...field(k)} type={k === "email" ? "email" : "text"} maxLength={k === "subject" ? 150 : k === "email" ? 255 : 100}
                  className="w-full bg-transparent border-b border-border focus:border-violet-glow outline-none py-3 text-base md:text-lg text-foreground placeholder:text-muted-foreground/40 transition-colors"
                  placeholder={k === "email" ? "you@domain.com" : k === "name" ? "Your name" : "What's this about"} />
                {errors[k] && <p className="mt-2 text-[10px] tracking-widest text-destructive">! {errors[k]}</p>}
              </div>
            ))}
            <div>
              <label className="block text-[10px] tracking-[0.3em] text-muted-foreground mb-2">/ MESSAGE</label>
              <textarea {...field("message")} rows={5} maxLength={2000}
                className="w-full bg-transparent border-b border-border focus:border-violet-glow outline-none py-3 text-base text-foreground placeholder:text-muted-foreground/40 resize-none transition-colors"
                placeholder="Project, scope, timeline…" />
              {errors.message && <p className="mt-2 text-[10px] tracking-widest text-destructive">! {errors.message}</p>}
            </div>
            <button type="submit" className="group inline-flex items-center gap-4 border border-violet-glow/50 hover:border-violet-glow hover:bg-violet/10 px-6 py-4 text-[11px] tracking-[0.3em] text-foreground transition-all">
              <span>TRANSMIT MESSAGE</span><span className="inline-block group-hover:translate-x-2 transition-transform text-violet-glow">→</span>
            </button>
          </form>
        </Reveal>
      </div>
      <footer className="mt-32 pt-8 border-t border-border flex flex-col md:flex-row justify-between gap-4 text-[10px] tracking-[0.3em] text-muted-foreground">
        <p>© 2026 KUMAR SAURABH TIWARI</p><p>END_OF_TRANSMISSION ///</p>
      </footer>
    </section>
  );
}
