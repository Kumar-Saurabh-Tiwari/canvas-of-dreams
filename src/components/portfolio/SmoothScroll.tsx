import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useMemo, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

function LenisGsapBridge() {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
    };
  }, [lenis]);
  return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisOptions = useMemo(() => {
    if (typeof window === "undefined") {
      return { lerp: 0.08, smoothWheel: true, syncTouch: false, autoRaf: false };
    }
    const nav = navigator as Navigator & { deviceMemory?: number };
    const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
    const lowCores = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const lowPower = lowMemory || lowCores || reduceMotion;
    return { lerp: lowPower ? 0.12 : 0.08, smoothWheel: true, syncTouch: false, autoRaf: false };
  }, []);

  return (
    <ReactLenis root options={lenisOptions}>
      <LenisGsapBridge />
      {children}
    </ReactLenis>
  );
}
