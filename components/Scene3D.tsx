"use client";

import {
  Environment,
  Float,
  MeshDistortMaterial,
  MeshTransmissionMaterial,
  Sparkles,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
} from "@react-three/postprocessing";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { BlendFunction } from "postprocessing";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// ─── GOLDEN TORUS ──────────────────────────────────────────────
function GoldenTorus({ scrollProgress }: { scrollProgress: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x =
      state.clock.elapsedTime * 0.15 + scrollProgress * 2;
    ref.current.rotation.y = state.clock.elapsedTime * 0.2;
    ref.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.5) * 0.15 - scrollProgress * 3;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={ref} scale={1.4}>
        <torusGeometry args={[1, 0.38, 64, 128]} />
        <MeshDistortMaterial
          color="#C9A84C"
          metalness={0.95}
          roughness={0.08}
          distort={0.15}
          speed={1.5}
          envMapIntensity={2}
        />
      </mesh>
    </Float>
  );
}

// ─── GLASS SPHERE ──────────────────────────────────────────────
function GlassSphere({ scrollProgress }: { scrollProgress: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.x =
      2.5 + Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    ref.current.position.y =
      -0.5 + Math.cos(state.clock.elapsedTime * 0.4) * 0.2 - scrollProgress * 2;
    ref.current.rotation.y = state.clock.elapsedTime * 0.1;
  });
  return (
    <mesh ref={ref} scale={0.8}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshTransmissionMaterial
        backside
        thickness={0.4}
        chromaticAberration={0.3}
        anisotropy={0.5}
        distortion={0.2}
        distortionScale={0.3}
        temporalDistortion={0.1}
        color="#C9A84C"
        transmission={0.95}
        roughness={0.05}
        ior={1.5}
      />
    </mesh>
  );
}

// ─── FLOATING OCTAHEDRON ───────────────────────────────────────
function FloatingOcta({ scrollProgress }: { scrollProgress: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.25;
    ref.current.rotation.z = state.clock.elapsedTime * 0.15;
    ref.current.position.y =
      1.5 + Math.sin(state.clock.elapsedTime * 0.6) * 0.3 - scrollProgress * 4;
    ref.current.position.x =
      -2.2 + Math.cos(state.clock.elapsedTime * 0.4) * 0.2;
  });
  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8}>
      <mesh ref={ref} scale={0.55}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#DAA520"
          metalness={1}
          roughness={0.1}
          emissive="#B8860B"
          emissiveIntensity={0.15}
          wireframe
        />
      </mesh>
    </Float>
  );
}

// ─── PARTICLE FIELD ────────────────────────────────────────────
function ParticleField({ scrollProgress }: { scrollProgress: number }) {
  const ref = useRef<THREE.Points>(null!);
  const count = 800;

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      sz[i] = Math.random() * 2 + 0.5;
    }
    return [pos, sz];
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.rotation.x = scrollProgress * 0.3;
    ref.current.position.y = -scrollProgress * 2;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#C9A84C"
        size={0.025}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── RINGS ─────────────────────────────────────────────────────
function GoldenRings({ scrollProgress }: { scrollProgress: number }) {
  const group = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.z = state.clock.elapsedTime * 0.05;
    group.current.position.y = -scrollProgress * 2;
  });
  return (
    <group ref={group}>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          rotation={[Math.PI / 2 + i * 0.3, i * 0.5, 0]}
          scale={2.5 + i * 0.7}
        >
          <torusGeometry args={[1, 0.005, 16, 100]} />
          <meshStandardMaterial
            color="#C9A84C"
            transparent
            opacity={0.15 - i * 0.04}
            emissive="#C9A84C"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── CAMERA CONTROLLER ─────────────────────────────────────────
function CameraController({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();
  useFrame((state) => {
    camera.position.z = 5 + scrollProgress * 2;
    camera.position.y = scrollProgress * -1;
    camera.lookAt(0, -scrollProgress * 0.5, 0);
  });
  return null;
}

// ─── MAIN 3D SCENE ─────────────────────────────────────────────
export default function Scene3D() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setScrollProgress(v);
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <CameraController scrollProgress={scrollProgress} />

          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.2}
            color="#FFF8DC"
          />
          <pointLight position={[-3, 2, 4]} intensity={0.8} color="#C9A84C" />
          <pointLight position={[3, -2, -3]} intensity={0.4} color="#DAA520" />
          <spotLight
            position={[0, 5, 0]}
            angle={0.4}
            penumbra={1}
            intensity={0.5}
            color="#F5C842"
          />

          {/* Environment for reflections */}
          <Environment preset="city" environmentIntensity={0.5} />

          {/* 3D Objects */}
          <GoldenTorus scrollProgress={scrollProgress} />
          <GlassSphere scrollProgress={scrollProgress} />
          <FloatingOcta scrollProgress={scrollProgress} />
          <ParticleField scrollProgress={scrollProgress} />
          <GoldenRings scrollProgress={scrollProgress} />

          {/* Sparkles */}
          <Sparkles
            count={100}
            scale={10}
            size={2}
            speed={0.4}
            color="#C9A84C"
            opacity={0.3}
          />

          {/* Post-processing */}
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.6}
              luminanceSmoothing={0.4}
              intensity={0.6}
              mipmapBlur
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={new THREE.Vector2(0.0005, 0.0005)}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
