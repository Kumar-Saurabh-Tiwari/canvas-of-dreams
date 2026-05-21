import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Environment } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import type { Mesh } from "three";
import { useSceneStore } from "./scene-store";

function LiquidSphere({ lowPower, segments }: { lowPower: boolean; segments: number }) {
  const ref = useRef<Mesh>(null);
  const matRef = useRef<any>(null);
  const intensity = useSceneStore((s) => s.intensity);
  const frameBudget = useRef(0);

  useFrame((state, delta) => {
    if (!ref.current) return;
    if (lowPower) {
      frameBudget.current += delta;
      if (frameBudget.current < 1 / 30) return;
      frameBudget.current = 0;
    }
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.15;
    ref.current.rotation.y = t * 0.2;
    ref.current.position.y = Math.sin(t * 0.6) * 0.15;
    if (matRef.current) {
      const target = 0.35 + intensity * 0.35;
      matRef.current.distort += (target - matRef.current.distort) * 0.05;
      matRef.current.speed = 1.2 + intensity * 1.5;
    }
  });

  return (
    <Sphere ref={ref} args={[1.4, segments, segments]}>
      <MeshDistortMaterial
        ref={matRef}
        color="#ffffff"
        roughness={0.0}
        metalness={0.9}
        distort={0.4}
        speed={1.5}
        clearcoat={1}
        clearcoatRoughness={0.0}
        transmission={0.9}
        ior={1.5}
        thickness={1.5}
        envMapIntensity={2.5}
      />
    </Sphere>
  );
}

export default function Scene() {
  const { lowPower, dpr, segments, powerPreference } = useMemo(() => {
    if (typeof window === "undefined") {
      return { lowPower: false, dpr: 1, segments: 192, powerPreference: "high-performance" as const };
    }
    const nav = navigator as Navigator & { deviceMemory?: number };
    const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
    const lowCores = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const lowPower = lowMemory || lowCores || reduceMotion;
    const deviceDpr = Math.min(2, window.devicePixelRatio || 1);
    return {
      lowPower,
      dpr: lowPower ? 1 : deviceDpr,
      segments: lowPower ? 128 : 192,
      powerPreference: lowPower ? "low-power" as const : "high-performance" as const,
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        dpr={dpr}
        gl={{ antialias: !lowPower, alpha: true, powerPreference }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.5} color="#ffffff" />
          <directionalLight position={[0, 5, 2]} intensity={2} color="#ffffff" />
          <pointLight position={[5, 0, -5]} intensity={3} color="#e2e8f0" />
          <LiquidSphere lowPower={lowPower} segments={segments} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
