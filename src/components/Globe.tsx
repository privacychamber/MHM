"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float, Line } from "@react-three/drei";
import * as THREE from "three";
import { destinationsData } from "@/data/destinations";

// GLSL Noise and Shader Definitions
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
  for (int i = 0; i < 5; ++i) {
    v += a * snoise(p);
    p = p * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}
`;

const earthVertexShader = `
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const earthFragmentShader = `
uniform vec3 lightDirection;
uniform vec3 cameraDirection;
uniform float time;
varying vec3 vPosition;
varying vec3 vNormal;

${noiseGLSL}

void main() {
  // Continent noise map (scaled to match typical earth map layout)
  float n = fbm(vPosition * 0.42);
  
  vec3 color;
  float specular = 0.0;

  if (n > 0.02) {
    // Landmass coloring (lush greens, sand coastlines, mountain brown ranges)
    float landType = fbm(vPosition * 1.5 + vec3(0.0, 0.0, 50.0));
    if (landType > 0.18) {
      color = mix(vec3(0.08, 0.32, 0.12), vec3(0.05, 0.22, 0.08), (landType - 0.18) * 2.5); // Forests
    } else if (landType > -0.08) {
      color = mix(vec3(0.18, 0.42, 0.15), vec3(0.08, 0.32, 0.12), (landType + 0.08) / 0.26); // Grasslands
    } else {
      color = mix(vec3(0.48, 0.42, 0.32), vec3(0.28, 0.22, 0.18), (-landType - 0.08) * 2.0); // Rocky mountains/hills
    }
  } else if (n > -0.01) {
    // Shorelines/Sandy Beaches
    color = vec3(0.72, 0.65, 0.52);
  } else {
    // Ocean coloring (deep blues to vibrant teal coastlines)
    float depth = smoothstep(-0.35, -0.01, n);
    vec3 shallowColor = vec3(0.04, 0.32, 0.50);
    vec3 deepColor = vec3(0.01, 0.03, 0.14);
    color = mix(deepColor, shallowColor, depth);
    specular = 0.85; // oceans are highly specular (reflective)
  }

  // Lighting calculations (Blinn-Phong)
  vec3 N = normalize(vNormal);
  vec3 L = normalize(lightDirection);
  vec3 V = normalize(cameraDirection);

  float diffuse = max(dot(N, L), 0.0);
  
  // Specular reflections
  vec3 H = normalize(L + V);
  float specFactor = pow(max(dot(N, H), 0.0), 32.0) * specular;

  // Fresnel edge glow (haze bloom at the limb)
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 4.0);
  vec3 atmosGlow = vec3(0.28, 0.65, 0.95) * fresnel * 0.75;

  // Ambient lighting for the dark side
  float ambient = 0.08;

  vec3 finalColor = color * (diffuse + ambient) + vec3(0.9, 0.95, 1.0) * specFactor + atmosGlow;
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

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
uniform vec3 lightDirection;
uniform float time;
varying vec3 vPosition;
varying vec3 vNormal;

${noiseGLSL}

void main() {
  // Procedural cloud density with slow drift animation
  vec3 cloudPos = vPosition * 0.52 + vec3(time * 0.006, time * 0.003, time * 0.001);
  float cloudDensity = fbm(cloudPos);

  // Soft clouds
  cloudDensity = smoothstep(0.06, 0.36, cloudDensity);

  if (cloudDensity < 0.02) {
    discard; // discard empty cloud pixels
  }

  vec3 N = normalize(vNormal);
  vec3 L = normalize(lightDirection);
  float diffuse = max(dot(N, L), 0.0) + 0.2; // soft clouds diffuse shading

  gl_FragColor = vec4(vec3(0.96, 0.96, 1.0) * diffuse, cloudDensity * 0.68);
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
  
  // Uniform references for custom shaders
  const earthUniforms = useMemo(() => ({
    lightDirection: { value: new THREE.Vector3(5, 3, 5).normalize() },
    cameraDirection: { value: new THREE.Vector3(0, 0, 1) },
    time: { value: 0 }
  }), []);

  const cloudUniforms = useMemo(() => ({
    lightDirection: { value: new THREE.Vector3(5, 3, 5).normalize() },
    time: { value: 0 }
  }), []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    
    // Update shader uniforms
    earthUniforms.time.value = elapsed;
    cloudUniforms.time.value = elapsed;

    // Dynamically calculate camera view vector for specular/fresnel shader calculations
    state.camera.getWorldDirection(earthUniforms.cameraDirection.value);
    earthUniforms.cameraDirection.value.multiplyScalar(-1); // camera faces negative Z

    // Rotate Earth and Clouds
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

    if (cloudsRef.current) {
      // clouds drift slightly faster than planet
      cloudsRef.current.rotation.y += 0.0015;
    }
  });

  const pins = useMemo(() => {
    return Object.values(destinationsData);
  }, []);

  return (
    <group ref={earthRef}>
      {/* 1. Realistic Procedural Earth Sphere */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[2.5, 64, 64]} />
        <shaderMaterial 
          vertexShader={earthVertexShader}
          fragmentShader={earthFragmentShader}
          uniforms={earthUniforms}
        />
      </mesh>

      {/* 2. Procedural Drifting Clouds Sphere */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.52, 64, 64]} />
        <shaderMaterial 
          vertexShader={cloudVertexShader}
          fragmentShader={cloudFragmentShader}
          uniforms={cloudUniforms}
          transparent={true}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Outer Haze Layer */}
      <mesh>
        <sphereGeometry args={[2.62, 32, 32]} />
        <meshBasicMaterial 
          color="#38bdf8"
          transparent={true}
          opacity={0.05}
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
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#1e293b" />

        <Float speed={1.0} rotationIntensity={0.15} floatIntensity={0.15}>
          <Earth selectedDestination={selectedDestination} />
        </Float>

        <Stars 
          radius={90} 
          depth={40} 
          count={3000} 
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
