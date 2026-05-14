import { useEffect, useRef } from "react";

const CHARS = "_*+$^}#£<[%&@!?/\\";

interface Props {
  text: string;
  className?: string;
  duration?: number;
  trigger?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

export default function TextScramble({
  text,
  className = "",
  duration = 1200,
  trigger = true,
  as: Tag = "span",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!trigger || !ref.current) return;
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
  }, [text, duration, trigger]);

  return <Tag ref={ref as any} className={className}>{text}</Tag>;
}
