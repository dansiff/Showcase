"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion-3d"; // <--- 3D motion


function SpinningCube() {
  return (
    <mesh rotation={[0.4, 0.2, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function ThreeShowcase() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ container: ref });

  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 3]), { stiffness: 200, damping: 30 });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div ref={ref} className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {/* First Section */}
      <section className="h-screen flex items-center justify-center bg-black text-white snap-start">
        <motion.div 
          style={{ opacity: opacity.get() }} // Convert MotionValue to number
          className="text-5xl font-bold"
        >
          <h1>Scroll to Explore</h1>
        </motion.div>
      </section>

      {/* 3D Section */}
      <section className="h-screen flex items-center justify-center bg-gray-900 snap-start">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 2, 2]} />
          <motion.group scale={[scale, scale, scale]}>
            <SpinningCube />
          </motion.group>
          <OrbitControls />
        </Canvas>
      </section>

      {/* Outro Section */}
      <section className="h-screen flex items-center justify-center bg-orange-500 snap-start">
        <h2 className="text-4xl font-bold text-white">Smooth. Interactive. 3D.</h2>
      </section>
    </div>
  );
}
