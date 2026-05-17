import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Environment } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";
import { useSceneStore } from "./scene-store";

function LiquidSphere() {
  const ref = useRef<Mesh>(null);
  const matRef = useRef<any>(null);
  const intensity = useSceneStore((s) => s.intensity);

  useFrame((state) => {
    if (!ref.current) return;
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
    <Sphere ref={ref} args={[1.4, 256, 256]}>
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
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.5} color="#ffffff" />
          <directionalLight position={[0, 5, 2]} intensity={2} color="#ffffff" />
          <pointLight position={[5, 0, -5]} intensity={3} color="#e2e8f0" />
          <LiquidSphere />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
