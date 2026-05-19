"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Environment, Float } from "@react-three/drei";
import * as THREE from "three";

function Earth({ selectedDestination }: { selectedDestination: string | null }) {
  const earthRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      {/* Main Earth Sphere */}
      <mesh ref={earthRef} castShadow receiveShadow>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial 
          color="#0f172a"
          roughness={0.4}
          metalness={0.6}
          emissive="#030712"
          emissiveIntensity={0.2}
          wireframe={true}
          wireframeLinewidth={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Atmospheric Glow */}
      <mesh>
        <sphereGeometry args={[2.55, 64, 64]} />
        <meshBasicMaterial 
          color="#38bdf8"
          transparent={true}
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Outer Halo */}
      <mesh>
        <sphereGeometry args={[2.7, 32, 32]} />
        <meshBasicMaterial 
          color="#facc15"
          transparent={true}
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

export default function Globe({ selectedDestination }: { selectedDestination: string | null }) {
  return (
    <div className="w-full h-[60vh] md:h-[80vh] cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ alpha: true }}>
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#38bdf8" />
        <pointLight position={[5, 0, 5]} intensity={1} color="#facc15" />

        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <Earth selectedDestination={selectedDestination} />
        </Float>

        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={1} 
        />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
