"use client";

import { OrbitControls, PerspectiveCamera, Text } from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { TextureLoader, Vector3 } from "three";

// Import your image
import localImage from "../assets/img2.png";

const StoryPoint = ({ position, content, isActive, textureUrl }) => {
  const mesh = useRef();
  const texture = useLoader(TextureLoader, textureUrl);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.01;
      mesh.current.scale.setScalar(isActive ? 1.2 : 1);
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        map={texture}
        emissive="#ffffff"
        emissiveIntensity={isActive ? 0.5 : 0.2}
      />
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {content.title}
      </Text>
    </mesh>
  );
};

const CameraController = ({ target, setCurrentPoint }) => {
  const { camera } = useThree();
  const vec = new Vector3();

  useFrame(() => {
    vec.set(target.x, target.y + 2, target.z + 5);
    camera.position.lerp(vec, 0.05);
    camera.lookAt(target);
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentPoint((prev) => (prev + 1) % storyPoints.length);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [target, setCurrentPoint]);

  return null;
};

const storyPoints = [
  {
    position: [0, 0, 0],
    content: {
      title: "The Beginning",
      description:
        "My journey in tech started with a passion for problem-solving...",
    },
  },
  {
    position: [5, 2, -5],
    content: {
      title: "Learning & Growth",
      description:
        "Through countless hours of coding and learning, I honed my skills...",
    },
  },
  {
    position: [-3, -1, -10],
    content: {
      title: "Professional Journey",
      description:
        "My career has been filled with exciting projects and challenges...",
    },
  },
  {
    position: [8, 3, -15],
    content: {
      title: "Future Aspirations",
      description:
        "Looking ahead, I'm excited about the possibilities in AI and blockchain...",
    },
  },
];

const StorytellingSection = () => {
  const [currentPoint, setCurrentPoint] = useState(0);
  const [textureUrl, setTextureUrl] = useState("");

  useEffect(() => {
    // Convert the imported image to a data URL
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      setTextureUrl(canvas.toDataURL());
    };
    img.src = localImage.src;
  }, []);

  return (
    <section id="storytelling" className="py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center text-4xl font-bold text-white"
      >
        My Journey in Tech
      </motion.h2>
      <div className="relative h-[80vh] w-full">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 2, 10]} />
          <OrbitControls enableZoom={false} enablePan={false} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />

          {textureUrl &&
            storyPoints.map((point, index) => (
              <StoryPoint
                key={index}
                position={point.position}
                content={point.content}
                isActive={index === currentPoint}
                textureUrl={textureUrl}
              />
            ))}

          <CameraController
            target={new Vector3(...storyPoints[currentPoint].position)}
            setCurrentPoint={setCurrentPoint}
          />

          <EffectComposer>
            <Bloom
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              height={300}
            />
            <Vignette eskil={false} offset={0.1} darkness={0.5} />
          </EffectComposer>
        </Canvas>
      </div>
      <div className="mt-8 text-center">
        <h3 className="mb-4 text-2xl font-bold text-white">
          {storyPoints[currentPoint].content.title}
        </h3>
        <p className="mx-auto max-w-2xl text-gray-300">
          {storyPoints[currentPoint].content.description}
        </p>
      </div>
    </section>
  );
};

export default StorytellingSection;
