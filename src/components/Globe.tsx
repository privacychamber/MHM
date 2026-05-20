"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float, Line } from "@react-three/drei";
import * as THREE from "three";
import { destinationsData } from "@/data/destinations";

// Atmospheric Glow Shader (Fresnel effect)
const atmosphereVertexShader = `
varying vec3 vNormal;
void main() {
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const atmosphereFragmentShader = `
varying vec3 vNormal;
void main() {
  // Glow is strongest at the edges (perpendicular to view vector)
  float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
  gl_FragColor = vec4(0.35, 0.65, 1.0, 1.0) * intensity * 0.8;
}
`;

// Procedural drifting clouds shader
const cloudVertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const cloudFragmentShader = `
uniform sampler2D cloudTexture;
uniform float time;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  // Move cloud texture coordinates slowly over time
  vec2 movingUv = vUv + vec2(time * 0.003, time * 0.001);
  vec4 cloudCol = texture2D(cloudTexture, movingUv);
  
  // Make clouds slightly transparent and responsive to lighting
  float intensity = max(dot(vNormal, vec3(0.5, 0.5, 0.7)), 0.0) + 0.2;
  
  if (cloudCol.r < 0.1) {
    discard; // discard transparent pixels
  }
  
  gl_FragColor = vec4(cloudCol.rgb * intensity, cloudCol.r * 0.6);
}
`;

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
        <sphereGeometry args={[0.038, 16, 16]} />
        <meshBasicMaterial color={isSelected ? "#facc15" : "#38bdf8"} />
      </mesh>
      {/* Pulsing ring */}
      <mesh ref={pulseRef}>
        <ringGeometry args={[0.045, 0.095, 16]} />
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
    const r = 2.51; // slightly above surface
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
    const height = Math.max(0.4, distance * 0.35);
    const pControl = mid.clone().normalize().multiplyScalar(r + height);

    return new THREE.QuadraticBezierCurve3(pStart, pControl, pEnd);
  }, [startLat, startLng, endLat, endLng]);

  const progressRef = useRef(0);
  const photonRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    progressRef.current = (progressRef.current + 0.012) % 1.0;
    if (photonRef.current) {
      const pos = linePoints.getPointAt(progressRef.current);
      photonRef.current.position.copy(pos);
    }
  });

  const curvePoints = useMemo(() => linePoints.getPoints(50), [linePoints]);

  return (
    <group>
      <Line
        points={curvePoints}
        color="#facc15"
        lineWidth={1.5}
        transparent
        opacity={0.8}
      />
      <mesh ref={photonRef}>
        <sphereGeometry args={[0.048, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function Earth({ selectedDestination }: { selectedDestination: string | null }) {
  const earthRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // States to manage satellite and cloud textures safely
  const [textures, setTextures] = useState<{
    map: THREE.Texture | null;
    bump: THREE.Texture | null;
    specular: THREE.Texture | null;
    clouds: THREE.Texture | null;
  }>({
    map: null,
    bump: null,
    specular: null,
    clouds: null
  });

  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    
    // Load satellite textures with automatic callback hierarchy
    loader.load(
      "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
      (mapTex) => {
        loader.load(
          "https://unpkg.com/three-globe/example/img/earth-topology.png",
          (bumpTex) => {
            loader.load(
              "https://unpkg.com/three-globe/example/img/earth-water.png",
              (specTex) => {
                loader.load(
                  "https://unpkg.com/three-globe/example/img/earth-dark.jpg", // can act as fallback clouds representation
                  (cloudTex) => {
                    setTextures({
                      map: mapTex,
                      bump: bumpTex,
                      specular: specTex,
                      clouds: cloudTex
                    });
                  },
                  undefined,
                  () => {
                    setTextures({
                      map: mapTex,
                      bump: bumpTex,
                      specular: specTex,
                      clouds: null
                    });
                  }
                );
              },
              undefined,
              () => {
                setTextures({
                  map: mapTex,
                  bump: bumpTex,
                  specular: null,
                  clouds: null
                });
              }
            );
          },
          undefined,
          () => {
            setTextures({
              map: mapTex,
              bump: null,
              specular: null,
              clouds: null
            });
          }
        );
      },
      undefined,
      () => {
        setFailed(true);
      }
    );
  }, []);

  // Uniform variables for the drifting cloud shader
  const cloudUniforms = useMemo(() => ({
    cloudTexture: { value: null as THREE.Texture | null },
    time: { value: 0 }
  }), []);

  // Set the texture once it loads
  if (textures.clouds && !cloudUniforms.cloudTexture.value) {
    cloudUniforms.cloudTexture.value = textures.clouds;
  }

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    cloudUniforms.time.value = elapsed;

    // Smooth centering camera animation on search/select
    if (earthRef.current) {
      if (selectedDestination && destinationsData[selectedDestination]) {
        const dest = destinationsData[selectedDestination];
        const targetY = -(dest.lng * Math.PI) / 180;
        const targetX = -(dest.lat * Math.PI) / 180;
        
        earthRef.current.rotation.y = THREE.MathUtils.lerp(earthRef.current.rotation.y, targetY, 0.05);
        earthRef.current.rotation.x = THREE.MathUtils.lerp(earthRef.current.rotation.x, targetX, 0.05);
      } else {
        // Slow auto-rotation when idle
        earthRef.current.rotation.y += 0.0015;
        earthRef.current.rotation.x = THREE.MathUtils.lerp(earthRef.current.rotation.x, 0, 0.05);
      }
    }

    if (cloudsRef.current) {
      // Rotate clouds slightly faster than earth
      cloudsRef.current.rotation.y += 0.0022;
    }
  });

  const pins = useMemo(() => {
    return Object.values(destinationsData);
  }, []);

  return (
    <group ref={earthRef}>
      {/* 1. Realistic Earth Globe with NASA satellite imagery */}
      {failed ? (
        // High fidelity procedural fallback color globe
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[2.5, 64, 64]} />
          <meshStandardMaterial 
            color="#0b1329"
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>
      ) : textures.map ? (
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[2.5, 64, 64]} />
          <meshStandardMaterial 
            map={textures.map}
            bumpMap={textures.bump || undefined}
            bumpScale={0.08}
            roughnessMap={textures.specular || undefined}
            roughness={0.45}
            metalness={0.05}
          />
        </mesh>
      ) : (
        // Loading state placeholder sphere
        <mesh>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshStandardMaterial 
            color="#020617" 
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      )}

      {/* 2. Drifting cloud layer using texture-based shader */}
      {!failed && textures.clouds && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[2.518, 64, 64]} />
          <shaderMaterial 
            vertexShader={cloudVertexShader}
            fragmentShader={cloudFragmentShader}
            uniforms={cloudUniforms}
            transparent={true}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* 3. Real Atmospheric Glow (Fresnel Halo) */}
      <mesh>
        <sphereGeometry args={[2.58, 32, 32]} />
        <shaderMaterial
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent={true}
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
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.8} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#1e293b" />

        <Float speed={1.0} rotationIntensity={0.15} floatIntensity={0.15}>
          <Earth selectedDestination={selectedDestination} />
        </Float>

        <Stars 
          radius={90} 
          depth={40} 
          count={3200} 
          factor={4.5} 
          saturation={0.5} 
          fade 
          speed={1.0} 
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
