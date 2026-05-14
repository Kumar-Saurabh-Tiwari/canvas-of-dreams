import { useEffect, useRef, useState } from "react";

const CHARS = "_*+$^}#£<[%&@!?/\\";

interface Props {
  text: string;
  className?: string;
  duration?: number;
  trigger?: boolean;
  triggerOnView?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

export default function TextScramble({
  text,
  className = "",
  duration = 1200,
  trigger = true,
  triggerOnView = false,
  as: Tag = "span",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(!triggerOnView);

  // IntersectionObserver to arm the scramble when in view
  useEffect(() => {
    if (!triggerOnView || !ref.current || armed) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setArmed(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [triggerOnView, armed]);

  useEffect(() => {
    if (!trigger || !armed || !ref.current) return;
    const el = ref.current;
    let raf = 0;
    const start = performance.now();
    const len = text.length;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const reveal = Math.floor(p * len);
      let out = "";
      for (let i = 0; i < len; i++) {
        if (i < reveal) out += text[i];
        else if (text[i] === " ") out += " ";
        else out += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      el.textContent = out;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, duration, trigger, armed]);

  return (
    <Tag ref={ref as any} className={className}>
      {triggerOnView ? "" : text}
    </Tag>
  );
}
