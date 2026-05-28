"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import * as THREE from "three";
import { destinationsData } from "@/data/destinations";

// Helper: look up destination by its lowercase id field (keys in data are capitalized names)
const getDestById = (id: string | null) => {
  if (!id) return null;
  const targetId = id.toLowerCase();
  return Object.values(destinationsData).find(d => d.id.toLowerCase() === targetId) ?? null;
};

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
    const r = 2.55; // slightly above Earth atmosphere (2.532) to avoid z-fighting or clipping
    const phi = (lat * Math.PI) / 180;
    const lambda = (lng * Math.PI) / 180;
    return new THREE.Vector3(
      r * Math.cos(phi) * Math.cos(lambda),
      r * Math.sin(phi),
      -r * Math.cos(phi) * Math.sin(lambda)
    );
  }, [lat, lng]);

  const auraRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (auraRef.current) {
      // Create a smooth pulsing glow effect (pulsing scale between 0.85 and 1.35)
      const t = state.clock.getElapsedTime();
      const s = 1.1 + Math.sin(t * 5.0) * 0.25;
      auraRef.current.scale.set(s, s, s);
      const mat = auraRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = 0.45 - Math.sin(t * 5.0) * 0.15;
      }
    }
  });

  return (
    <group position={pos}>
      {/* 1. Core Bright Dot */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial 
          color={isSelected ? "#fef08a" : "#60a5fa"} // very bright center (yellow-200 / blue-400)
          depthWrite={false}
        />
      </mesh>
      
      {/* 2. Middle Glow Sphere */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial 
          color={isSelected ? "#eab308" : "#3b82f6"} 
          transparent 
          opacity={0.7}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Pulsing Outer Aura */}
      <mesh ref={auraRef}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshBasicMaterial 
          color={isSelected ? "#eab308" : "#3b82f6"} 
          transparent 
          opacity={0.4}
          depthWrite={false}
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
      const lambda = (lng * Math.PI) / 180;
      return new THREE.Vector3(
        radius * Math.cos(phi) * Math.cos(lambda),
        radius * Math.sin(phi),
        -radius * Math.cos(phi) * Math.sin(lambda)
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

// ─── Earth day / night composite shader ───────────────────────────────────────
// Uses world-space normals so the shader works correctly as the Earth group rotates.
const earthVertexShader = `
varying vec2 vUv;
varying vec3 vWorldNormal;
void main() {
  vUv = uv;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const earthFragmentShader = `
uniform sampler2D uDay;
uniform sampler2D uNight;
uniform vec3 uSunDir;
uniform float uHasNight;
uniform float uIsDark;
varying vec2 vUv;
varying vec3 vWorldNormal;
void main() {
  vec3 N = normalize(vWorldNormal);
  float cosTheta = dot(N, normalize(uSunDir));
  // Smooth terminator: -0.18 = full night, 0.28 = full day
  float dayFactor = smoothstep(-0.18, 0.28, cosTheta);
  vec4 dayCol  = texture2D(uDay, vUv);
  // Sun diffuse on day side (small ambient so oceans aren't pitch-black)
  float sunDiff = max(cosTheta, 0.06);
  vec3 dayLit  = dayCol.rgb * (0.06 + sunDiff * 0.94);
  // City-lights glow on night side
  vec3 cityLights = vec3(0.0);
  if (uHasNight > 0.5) {
    vec4 nightCol = texture2D(uNight, vUv);
    cityLights = nightCol.rgb * 2.8;
  }
  // Soft, beautifully shaded day texture on night side in light mode
  vec3 nightColor = mix(dayCol.rgb * 0.55, cityLights, uIsDark);
  // Blend night → day across the terminator
  vec3 color = mix(nightColor, dayLit, dayFactor);
  gl_FragColor = vec4(color, 1.0);
}
`;

function Earth({ selectedDestination, lightPos, isDark }: { selectedDestination: string | null; lightPos: THREE.Vector3; isDark: boolean }) {
  const earthRef   = useRef<THREE.Group>(null);
  const cloudsRef  = useRef<THREE.Mesh>(null);
  const prevDestRef = useRef<string | null>(null);

  const [textures, setTextures] = useState<{
    day:    THREE.Texture | null;
    night:  THREE.Texture | null;
    clouds: THREE.Texture | null;
  }>({ day: null, night: null, clouds: null });

  const [failed, setFailed] = useState(false);

  // Set rotation order to ZXY for proper longitude/latitude camera targeting
  useEffect(() => {
    if (earthRef.current) {
      earthRef.current.rotation.reorder("ZXY");
    }
  }, []);

  // Day/night shader material — created once, uniforms patched when textures arrive
  const earthMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uDay:      { value: null },
      uNight:    { value: null },
      // Pre-normalised world-space direction toward the sun (light at [12,5,8])
      uSunDir:   { value: new THREE.Vector3(0.786, 0.328, 0.524) },
      uHasNight: { value: 0.0 },
      uIsDark:   { value: 1.0 },
    },
    vertexShader:   earthVertexShader,
    fragmentShader: earthFragmentShader,
  }), []);

  // Push textures into shader uniforms whenever they change
  useEffect(() => {
    if (textures.day)   earthMat.uniforms.uDay.value   = textures.day;
    if (textures.night) {
      earthMat.uniforms.uNight.value    = textures.night;
      earthMat.uniforms.uHasNight.value = 1.0;
    }
    earthMat.uniforms.uIsDark.value = isDark ? 1.0 : 0.0;
    earthMat.needsUpdate = true;
  }, [textures, earthMat, isDark]);

  // Texture loading: day → night (with fallback) → clouds
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    loader.load(
      "https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/earth-blue-marble.jpg",
      (dayTex) => {
        // Night lights — try three.js repo first, then vasturiano fallback
        const loadNight = (onDone: (t: THREE.Texture | null) => void) => {
          loader.load(
            "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png",
            onDone,
            undefined,
            () => loader.load(
              "https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/earth-night.jpg",
              onDone,
              undefined,
              () => onDone(null)
            )
          );
        };

        loadNight((nightTex) => {
          loader.load(
            "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png",
            (cloudTex) => setTextures({ day: dayTex, night: nightTex, clouds: cloudTex }),
            undefined,
            ()         => setTextures({ day: dayTex, night: nightTex, clouds: null })
          );
        });
      },
      undefined,
      (err) => {
        console.error("Earth day texture failed:", err);
        setFailed(true);
      }
    );
  }, []);

  useFrame(() => {
    if (earthRef.current) {
      const dest = getDestById(selectedDestination);
      if (dest) {
        // Calculate correct rotation targets under ZXY order matching SphereGeometry coordinate mapping
        const phi = (dest.lat * Math.PI) / 180;
        const lambda = (dest.lng * Math.PI) / 180;
        const pinX = 2.55 * Math.cos(phi) * Math.cos(lambda);
        const pinY = 2.55 * Math.sin(phi);
        const pinZ = -2.55 * Math.cos(phi) * Math.sin(lambda);

        const targetY = Math.atan2(-pinX, pinZ);
        const vz = -pinX * Math.sin(targetY) + pinZ * Math.cos(targetY);
        const targetX = Math.atan2(pinY, vz);

        // Normalize rotation.y to [-PI, PI] on transition to prevent wrap-around spins
        if (prevDestRef.current !== selectedDestination) {
          prevDestRef.current = selectedDestination;
          const cur = earthRef.current.rotation.y;
          earthRef.current.rotation.y = ((cur % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
        }

        // Calculate shortest path angular difference for Y rotation
        let diffY = targetY - earthRef.current.rotation.y;
        diffY = Math.atan2(Math.sin(diffY), Math.cos(diffY));

        earthRef.current.rotation.y += diffY * 0.12;
        earthRef.current.rotation.x = THREE.MathUtils.lerp(earthRef.current.rotation.x, targetX, 0.12);
      } else {
        prevDestRef.current = null;
        earthRef.current.rotation.y += 0.0015;
        earthRef.current.rotation.x = THREE.MathUtils.lerp(earthRef.current.rotation.x, 0, 0.05);
      }
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0022;
      cloudsRef.current.rotation.x += 0.0004;
    }
  });

  return (
    <group ref={earthRef}>
      {/* Earth body — day/night composite */}
      {failed ? (
        <mesh>
          <sphereGeometry args={[2.5, 64, 64]} />
          <meshStandardMaterial color="#0b1329" roughness={0.4} metalness={0.6} />
        </mesh>
      ) : textures.day ? (
        <mesh>
          <sphereGeometry args={[2.5, 64, 64]} />
          <primitive object={earthMat} />
        </mesh>
      ) : (
        <mesh>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.1} />
        </mesh>
      )}

      {/* Cloud layer — drifts independently */}
      {!failed && textures.clouds && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[2.516, 64, 64]} />
          <meshStandardMaterial
            map={textures.clouds}
            transparent={true}
            opacity={0.55}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Destination pin */}
      {(() => {
        const dest = getDestById(selectedDestination);
        return dest ? (
          <DestinationPin lat={dest.lat} lng={dest.lng} isSelected={true} />
        ) : null;
      })()}

      {/* Flight path from India → selected destination */}
      {(() => {
        const dest  = getDestById(selectedDestination);
        const india = getDestById("india");
        return (dest && dest.id !== "india" && india) ? (
          <FlightPath
            startLat={india.lat}
            startLng={india.lng}
            endLat={dest.lat}
            endLng={dest.lng}
          />
        ) : null;
      })()}
    </group>
  );
}


export default function Globe({
  selectedDestination,
  className,
  forceDark,
}: {
  selectedDestination: string | null;
  className?: string;
  forceDark?: boolean;
}) {
  const lightPosition = useMemo(() => new THREE.Vector3(12, 5, 8), []);
  const [isDark, setIsDark] = useState(true);
  const controlsRef = useRef<any>(null);

  // Auto-reset OrbitControls to standard front-center view whenever a search/destination is selected
  useEffect(() => {
    if (selectedDestination && controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [selectedDestination]);

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

  // forceDark overrides theme detection (used for always-dark hero sections)
  const effectiveDark = forceDark !== undefined ? forceDark : isDark;

  return (
    <div className={`cursor-grab active:cursor-grabbing ${className ?? "w-full h-[60vh] md:h-[80vh]"}`}>
      <Canvas camera={{ position: [0, 0, 7.8], fov: 45 }} gl={{ alpha: true }}>
        {/* Ambient fill */}
        <ambientLight intensity={effectiveDark ? 0.12 : 0.5} />
        {/* Sun directional light */}
        <directionalLight position={lightPosition} intensity={effectiveDark ? 2.6 : 2.2} color="#ffffff" />
        {/* Back-fill */}
        <directionalLight position={[-12, -5, -8]} intensity={effectiveDark ? 0.18 : 0.35} color={effectiveDark ? "#38bdf8" : "#b0ccff"} />
        {/* Space background — only in dark mode */}
        {effectiveDark && <SpaceBackground isDark={effectiveDark} />}
        {/* Atmosphere halo */}
        <EarthAtmosphere lightPos={lightPosition} isDark={effectiveDark} />
        <Earth selectedDestination={selectedDestination} lightPos={lightPosition} isDark={effectiveDark} />
        <OrbitControls
          ref={controlsRef}
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
