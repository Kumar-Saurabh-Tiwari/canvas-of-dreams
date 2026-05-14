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
    <Sphere ref={ref} args={[1.4, 128, 128]}>
      <MeshDistortMaterial
        ref={matRef}
        color="#3a0a5c"
        roughness={0.05}
        metalness={0.6}
        distort={0.4}
        speed={1.5}
        emissive="#6b1fb3"
        emissiveIntensity={0.4}
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
          <ambientLight intensity={0.2} />
          <pointLight position={[5, 5, 5]} intensity={1.2} color="#a855f7" />
          <pointLight position={[-5, -3, -2]} intensity={0.8} color="#5b21b6" />
          <LiquidSphere />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
