"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import * as THREE from "three";
import { destinationsData } from "@/data/destinations";

// Ashima Arts 3D Simplex Noise for procedural Space Background
const simplexNoiseGLSL = `
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

// Space background shader rendering stars and Milky Way galaxy dust lane
const spaceVertexShader = `
varying vec3 vPosition;
void main() {
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const spaceFragmentShader = `
varying vec3 vPosition;
uniform float uIsDark;

${simplexNoiseGLSL}

void main() {
  vec3 dir = normalize(vPosition);
  
  // Stars (High frequency noise thresholding)
  float starNoise1 = snoise(dir * 180.0);
  float starNoise2 = snoise(dir * 300.0);
  float starPattern = (smoothstep(0.91, 0.99, starNoise1) * 0.7 + smoothstep(0.93, 0.99, starNoise2) * 0.4) * uIsDark;
  vec3 stars = vec3(starPattern);

  // Milky Way dust lane structure (low frequency noise)
  vec3 nebulaPos = dir * 1.8;
  float nebulaCloud = fbm(nebulaPos);
  
  float bandWidth = abs(dir.x + dir.y + dir.z) * 0.4;
  float bandMask = smoothstep(0.7, 0.0, bandWidth);
  
  float finalNebula = smoothstep(0.12, 0.55, nebulaCloud) * bandMask * uIsDark;
  
  vec3 darkSky = mix(vec3(0.005, 0.003, 0.012), vec3(0.065, 0.045, 0.038), finalNebula);
  darkSky += vec3(0.008, 0.018, 0.038) * smoothstep(0.1, 0.6, fbm(nebulaPos * 3.0)) * uIsDark;

  // Premium, clean soft sky color for light mode (stone/slate gradient-matching)
  vec3 lightSky = vec3(0.96, 0.97, 0.98);

  vec3 finalSky = mix(lightSky, darkSky, uIsDark);
  gl_FragColor = vec4(finalSky, 1.0);
}
`;

function SpaceBackground({ isDark }: { isDark: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      // Very slow background cosmic drift
      meshRef.current.rotation.y += 0.00012;
    }
  });

  const spaceMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uIsDark: { value: 1.0 }
      },
      vertexShader: spaceVertexShader,
      fragmentShader: spaceFragmentShader,
      side: THREE.BackSide,
      depthWrite: false
    });
  }, []);

  useEffect(() => {
    spaceMat.uniforms.uIsDark.value = isDark ? 1.0 : 0.0;
  }, [isDark, spaceMat]);

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[85, 32, 32]} />
      <primitive object={spaceMat} />
    </mesh>
  );
}

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
        <meshBasicMaterial color={isSelected ? "#eab308" : "#3b82f6"} />
      </mesh>
      {/* Pulsing ring */}
      <mesh ref={pulseRef}>
        <ringGeometry args={[0.042, 0.09, 16]} />
        <meshBasicMaterial 
          color={isSelected ? "#eab308" : "#3b82f6"} 
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
        color="#eab308"
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

// Illuminated Atmosphere Halo Shader reflecting solar vectors & active theme mode
const atmosphereVertexShader = `
varying vec3 vNormal;
varying vec3 vViewPosition;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const atmosphereFragmentShader = `
varying vec3 vNormal;
varying vec3 vViewPosition;
uniform vec3 uLightDirection;
uniform float uIsDark;
void main() {
  // Edge glowing intensity (Fresnel effect)
  float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
  
  // Illuminate only the day side facing the light source
  float dayLight = max(dot(vNormal, uLightDirection), 0.0);
  
  // Clean Google Earth sky-blue haze scattering color
  vec3 glowColor = mix(vec3(0.22, 0.52, 0.95), vec3(0.35, 0.65, 1.0), uIsDark);
  
  // Final alpha maps atmosphere brightness
  float alphaScale = mix(0.55, 0.85, uIsDark);
  float finalAlpha = intensity * (dayLight * 0.94 + 0.06) * alphaScale;
  
  gl_FragColor = vec4(glowColor, finalAlpha);
}
`;

function EarthAtmosphere({ lightPos, isDark }: { lightPos: THREE.Vector3; isDark: boolean }) {
  const atmosMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uLightDirection: { value: new THREE.Vector3() },
        uIsDark: { value: 1.0 }
      },
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });
  }, []);

  useEffect(() => {
    atmosMat.uniforms.uIsDark.value = isDark ? 1.0 : 0.0;
  }, [isDark, atmosMat]);

  useFrame((state) => {
    // Calculate light vector relative to camera position (view space transformation)
    const viewLightDir = lightPos.clone().applyMatrix4(state.camera.matrixWorldInverse).normalize();
    atmosMat.uniforms.uLightDirection.value.copy(viewLightDir);
  });

  return (
    <mesh>
      <sphereGeometry args={[2.532, 64, 64]} />
      <primitive object={atmosMat} />
    </mesh>
  );
}

function Earth({ selectedDestination, lightPos }: { selectedDestination: string | null; lightPos: THREE.Vector3 }) {
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
    loader.setCrossOrigin("anonymous");
    
    // Load satellite textures from raw github content for 100% reliable CORS header support
    loader.load(
      "https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/earth-blue-marble.jpg",
      (mapTex) => {
        loader.load(
          "https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/earth-topology.png",
          (bumpTex) => {
            loader.load(
              "https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/earth-water.png",
              (specTex) => {
                loader.load(
                  "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png",
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
      (err) => {
        console.error("CORS load failed for Earth map:", err);
        setFailed(true);
      }
    );
  }, []);

  useFrame(() => {
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
      // Cloud layer drifts slowly over time
      cloudsRef.current.rotation.y += 0.0022;
      cloudsRef.current.rotation.x += 0.0004;
    }
  });

  return (
    <group ref={earthRef}>
      {/* 1. Earth Body Mesh */}
      {failed ? (
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
            bumpScale={0.075}
            roughnessMap={textures.specular || undefined}
            roughness={0.45}
            metalness={0.06}
          />
        </mesh>
      ) : (
        <mesh>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshStandardMaterial 
            color="#0f172a" 
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      )}

      {/* 2. Realistic Weather Clouds Layer */}
      {!failed && textures.clouds && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[2.516, 64, 64]} />
          <meshStandardMaterial
            map={textures.clouds}
            transparent={true}
            opacity={0.7}
            blending={THREE.NormalBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Render Destination Pin only for the active searched/selected destination */}
      {selectedDestination && destinationsData[selectedDestination] && (
        <DestinationPin 
          lat={destinationsData[selectedDestination].lat}
          lng={destinationsData[selectedDestination].lng}
          isSelected={true}
        />
      )}

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
  const lightPosition = useMemo(() => new THREE.Vector3(12, 5, 8), []);
  const [isDark, setIsDark] = useState(true);

  // Monitor class changes on <html> to update uniforms on the fly
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    checkTheme();

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full h-[60vh] md:h-[80vh] cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 6.2], fov: 45 }} gl={{ alpha: true }}>
        {/* Deep space ambient fill */}
        <ambientLight intensity={0.06} />
        
        {/* Strong Sun direction to form day/night shadow curves */}
        <directionalLight position={lightPosition} intensity={2.6} color="#ffffff" />
        
        {/* Extremely faint back light to highlight ocean edges slightly on dark side */}
        <directionalLight position={[-12, -5, -8]} intensity={0.08} color="#38bdf8" />

        {/* Space dust lane and stellar background skybox */}
        <SpaceBackground isDark={isDark} />

        {/* Illuminated Atmosphere Halo */}
        <EarthAtmosphere lightPos={lightPosition} isDark={isDark} />

        <Earth selectedDestination={selectedDestination} lightPos={lightPosition} />

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
