"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float, Line } from "@react-three/drei";
import * as THREE from "three";
import { destinationsData } from "@/data/destinations";

function DestinationPin({ lat, lng, isSelected }: { lat: number; lng: number; isSelected: boolean }) {
  const pos = useMemo(() => {
    const r = 2.5;
    const phi = (lat * Math.PI) / 180;
    const theta = (lng * Math.PI) / 180;
    return new THREE.Vector3(
      -r * Math.cos(phi) * Math.sin(theta),
      r * Math.sin(phi),
      r * Math.cos(phi) * Math.cos(theta)
    );
  }, [lat, lng]);

  const pulseRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (pulseRef.current) {
      const s = 1 + Math.sin(state.clock.getElapsedTime() * 6) * 0.3;
      pulseRef.current.scale.set(s, s, s);
      const mat = pulseRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = 0.6 - (s - 0.7) * 0.5;
    }
  });

  return (
    <group position={pos}>
      {/* Center dot */}
      <mesh>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial color={isSelected ? "#facc15" : "#38bdf8"} />
      </mesh>
      {/* Pulsing ring */}
      <mesh ref={pulseRef}>
        <ringGeometry args={[0.04, 0.09, 16]} />
        <meshBasicMaterial 
          color={isSelected ? "#facc15" : "#38bdf8"} 
          transparent 
          opacity={0.5} 
          side={THREE.DoubleSide} 
        />
      </mesh>
    </group>
  );
}

function FlightPath({ startLat, startLng, endLat, endLng }: { startLat: number; startLng: number; endLat: number; endLng: number }) {
  const linePoints = useMemo(() => {
    const r = 2.5;
    const getVector = (lat: number, lng: number, radius: number) => {
      const phi = (lat * Math.PI) / 180;
      const theta = (lng * Math.PI) / 180;
      return new THREE.Vector3(
        -radius * Math.cos(phi) * Math.sin(theta),
        radius * Math.sin(phi),
        radius * Math.cos(phi) * Math.cos(theta)
      );
    };

    const pStart = getVector(startLat, startLng, r);
    const pEnd = getVector(endLat, endLng, r);
    
    const mid = new THREE.Vector3().addVectors(pStart, pEnd).multiplyScalar(0.5);
    const distance = pStart.distanceTo(pEnd);
    const height = Math.max(0.4, distance * 0.3);
    const pControl = mid.clone().normalize().multiplyScalar(r + height);

    return new THREE.QuadraticBezierCurve3(pStart, pControl, pEnd);
  }, [startLat, startLng, endLat, endLng]);

  const progressRef = useRef(0);
  const photonRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    progressRef.current = (progressRef.current + 0.015) % 1.0;
    if (photonRef.current) {
      const pos = linePoints.getPointAt(progressRef.current);
      photonRef.current.position.copy(pos);
    }
  });

  const curvePoints = useMemo(() => linePoints.getPoints(40), [linePoints]);

  return (
    <group>
      <Line
        points={curvePoints}
        color="#facc15"
        lineWidth={1.2}
        transparent
        opacity={0.7}
      />
      <mesh ref={photonRef}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function Earth({ selectedDestination }: { selectedDestination: string | null }) {
  const earthRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (earthRef.current) {
      if (selectedDestination && destinationsData[selectedDestination]) {
        const dest = destinationsData[selectedDestination];
        // Target Y rotation matches negative longitude in radians
        const targetY = -(dest.lng * Math.PI) / 180;
        // Target X rotation matches negative latitude in radians
        const targetX = -(dest.lat * Math.PI) / 180;
        
        earthRef.current.rotation.y = THREE.MathUtils.lerp(earthRef.current.rotation.y, targetY, 0.05);
        earthRef.current.rotation.x = THREE.MathUtils.lerp(earthRef.current.rotation.x, targetX, 0.05);
      } else {
        // Slow auto-rotation when idle
        earthRef.current.rotation.y += 0.001;
        earthRef.current.rotation.x = THREE.MathUtils.lerp(earthRef.current.rotation.x, 0, 0.05);
      }
    }
  });

  const pins = useMemo(() => {
    return Object.values(destinationsData);
  }, []);

  return (
    <group ref={earthRef}>
      {/* Main Earth Sphere */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[2.5, 48, 48]} />
        <meshStandardMaterial 
          color="#0f172a"
          roughness={0.6}
          metalness={0.5}
          emissive="#020617"
          emissiveIntensity={0.3}
          wireframe={true}
          wireframeLinewidth={0.4}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Atmospheric Glow */}
      <mesh>
        <sphereGeometry args={[2.53, 32, 32]} />
        <meshBasicMaterial 
          color="#38bdf8"
          transparent={true}
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Outer Halo */}
      <mesh>
        <sphereGeometry args={[2.65, 32, 32]} />
        <meshBasicMaterial 
          color="#facc15"
          transparent={true}
          opacity={0.03}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Render Destination Pins */}
      {pins.map((dest) => (
        <DestinationPin 
          key={dest.id}
          lat={dest.lat}
          lng={dest.lng}
          isSelected={selectedDestination === dest.id}
        />
      ))}

      {/* Render Flight path from India to Selected Destination */}
      {selectedDestination && selectedDestination !== "india" && destinationsData[selectedDestination] && (
        <FlightPath 
          startLat={destinationsData["india"].lat}
          startLng={destinationsData["india"].lng}
          endLat={destinationsData[selectedDestination].lat}
          endLng={destinationsData[selectedDestination].lng}
        />
      )}
    </group>
  );
}

export default function Globe({ selectedDestination }: { selectedDestination: string | null }) {
  return (
    <div className="w-full h-[60vh] md:h-[80vh] cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 6.2], fov: 45 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#38bdf8" />
        <pointLight position={[5, 0, 5]} intensity={1} color="#facc15" />

        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.2}>
          <Earth selectedDestination={selectedDestination} />
        </Float>

        <Stars 
          radius={90} 
          depth={40} 
          count={2500} 
          factor={4} 
          saturation={0} 
          fade 
          speed={0.8} 
        />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
