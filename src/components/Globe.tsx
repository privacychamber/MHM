"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float, Line } from "@react-three/drei";
import * as THREE from "three";
import { destinationsData } from "@/data/destinations";

// Simplex Noise GLSL helper for procedural clouds
const noiseGLSL = `
// Ashima Arts Simplex 3D Noise
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - D.yyy;

  i = mod(i, 289.0 );
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}

float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  vec3 shift = vec3(100.0);
  for (int i = 0; i < 4; ++i) {
    v += a * snoise(p);
    p = p * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}
`;

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
  float intensity = pow(0.72 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
  gl_FragColor = vec4(0.35, 0.65, 1.0, 1.0) * intensity * 0.85;
}
`;

// Procedural clouds shaders
const cloudVertexShader = `
varying vec3 vPosition;
varying vec3 vNormal;
void main() {
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const cloudFragmentShader = `
uniform float time;
varying vec3 vPosition;
varying vec3 vNormal;

${noiseGLSL}

void main() {
  // Procedural drift
  vec3 cloudPos = vPosition * 0.62 + vec3(time * 0.008, time * 0.004, time * 0.002);
  float cloudDensity = fbm(cloudPos);

  // Soft edge cloud masking
  cloudDensity = smoothstep(0.08, 0.38, cloudDensity);

  if (cloudDensity < 0.02) {
    discard;
  }

  vec3 N = normalize(vNormal);
  float diffuse = max(dot(N, vec3(0.5, 0.5, 0.7)), 0.0) + 0.25;

  gl_FragColor = vec4(vec3(0.98, 0.98, 1.0) * diffuse, cloudDensity * 0.72);
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

  // States to manage satellite textures safely with CORS set
  const [textures, setTextures] = useState<{
    map: THREE.Texture | null;
    bump: THREE.Texture | null;
    specular: THREE.Texture | null;
  }>({
    map: null,
    bump: null,
    specular: null
  });

  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    // CRITICAL: Explicitly request cross-origin credentials/anonymous access
    loader.setCrossOrigin("anonymous");
    
    // Load satellite textures
    loader.load(
      "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
      (mapTex) => {
        loader.load(
          "https://unpkg.com/three-globe/example/img/earth-topology.png",
          (bumpTex) => {
            loader.load(
              "https://unpkg.com/three-globe/example/img/earth-water.png",
              (specTex) => {
                setTextures({
                  map: mapTex,
                  bump: bumpTex,
                  specular: specTex
                });
              },
              undefined,
              () => {
                setTextures({
                  map: mapTex,
                  bump: bumpTex,
                  specular: null
                });
              }
            );
          },
          undefined,
          () => {
            setTextures({
              map: mapTex,
              bump: null,
              specular: null
            });
          }
        );
      },
      undefined,
      (err) => {
        console.error("CORS / Texture Load failed for Earth:", err);
        setFailed(true);
      }
    );
  }, []);

  // Uniform variables for the drifting cloud shader
  const cloudUniforms = useMemo(() => ({
    time: { value: 0 }
  }), []);

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
        // High fidelity procedural fallback color globe if network blocks unpkg
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[2.5, 64, 64]} />
          <meshStandardMaterial 
            color="#0b1329"
            roughness={0.4}
            metalness={0.6}
            wireframe={false}
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

      {/* 2. Drifting cloud layer using procedural noise (doesn't need texture download) */}
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
