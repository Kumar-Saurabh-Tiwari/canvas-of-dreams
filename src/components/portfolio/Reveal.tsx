import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "article" | "header";
}

export default function Reveal({ children, className = "", delay = 0, y = 40, as: Tag = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    gsap.set(el, { opacity: 0, y, filter: "blur(8px)" });
    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1.1,
      delay,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, y]);

  return <Tag ref={ref as any} className={className}>{children}</Tag>;
}
