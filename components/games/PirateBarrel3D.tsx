"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Hand, Minus, Plus, RotateCcw, Swords } from "lucide-react";
import type { CatalogGame } from "@/data/catalog";
import { sfx } from "@/lib/audio";
import { haptic, HAPTIC } from "@/lib/haptics";
import { track, trackCardNext, trackGameFinished } from "@/lib/analytics";

/* ------------------------------------------------------------------ */
/* Geometry                                                            */
/* ------------------------------------------------------------------ */

const SLOT_OPTIONS = [12, 16, 24] as const;
const H = 2.2; // barrel height
const R = 0.95; // end radius
const BULGE = 0.16;
const FLIGHT_S = 0.55;
const SUSPENSE_MS = 520;

function radiusAt(y: number): number {
  return R + BULGE * Math.sin((Math.PI * (y + H / 2)) / H);
}

interface Slot {
  pos: THREE.Vector3;
  normal: THREE.Vector3;
  phi: number;
}

/** Slots wrap all the way round the barrel, in staggered rows. */
function layoutSlots(count: number): Slot[] {
  const rows = count === 24 ? 3 : 2;
  const cols = count / rows;
  const ys = rows === 3 ? [-0.5, -0.05, 0.4] : [-0.32, 0.28];
  const out: Slot[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const phi = ((c + (r % 2) * 0.5) / cols) * Math.PI * 2;
      const y = ys[r];
      const rr = radiusAt(y);
      const normal = new THREE.Vector3(Math.sin(phi), 0, Math.cos(phi));
      out.push({ pos: normal.clone().multiplyScalar(rr).setY(y), normal, phi });
    }
  }
  return out;
}

/** Procedural wood: staves with grain, so there are no image downloads. */
function makeWoodTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 256;
  const g = c.getContext("2d")!;
  const staves = 18;
  const w = c.width / staves;
  for (let i = 0; i < staves; i++) {
    const tone = 0.85 + Math.random() * 0.3;
    const grad = g.createLinearGradient(i * w, 0, (i + 1) * w, 0);
    grad.addColorStop(0, `rgb(${110 * tone},${60 * tone},${24 * tone})`);
    grad.addColorStop(0.5, `rgb(${190 * tone},${118 * tone},${58 * tone})`);
    grad.addColorStop(1, `rgb(${110 * tone},${60 * tone},${24 * tone})`);
    g.fillStyle = grad;
    g.fillRect(i * w, 0, w, c.height);
    g.strokeStyle = "rgba(60,30,10,0.35)";
    for (let k = 0; k < 6; k++) {
      g.lineWidth = 0.8 + Math.random();
      g.beginPath();
      const x0 = i * w + Math.random() * w;
      for (let y = 0; y <= c.height; y += 8) {
        g.lineTo(x0 + Math.sin(y / 18 + k) * 3, y);
      }
      g.stroke();
    }
    g.fillStyle = "rgba(40,18,6,0.9)";
    g.fillRect(i * w, 0, 3, c.height);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function makeDeckTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d")!;
  const planks = 8;
  for (let i = 0; i < planks; i++) {
    const tone = 0.8 + Math.random() * 0.25;
    g.fillStyle = `rgb(${150 * tone},${102 * tone},${60 * tone})`;
    g.fillRect(0, (i * c.height) / planks, c.width, c.height / planks);
    g.fillStyle = "rgba(50,25,10,0.6)";
    g.fillRect(0, (i * c.height) / planks, c.width, 3);
    g.fillStyle = "rgba(40,20,8,0.7)";
    g.beginPath();
    g.arc(Math.random() * c.width, ((i + 0.5) * c.height) / planks, 3, 0, Math.PI * 2);
    g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ------------------------------------------------------------------ */
/* Knife                                                               */
/* ------------------------------------------------------------------ */

const bladeGeo = (() => {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.lineTo(0.038, 0.09);
  s.lineTo(0.034, 0.4);
  s.lineTo(-0.034, 0.4);
  s.lineTo(-0.038, 0.09);
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: false });
  geo.translate(0, 0, -0.006);
  geo.rotateX(Math.PI / 2); // length now runs along +z
  return geo;
})();

/** A throwing knife with its tip at the origin, pointing down -z. */
function Knife() {
  return (
    <group>
      <mesh geometry={bladeGeo} castShadow>
        <meshStandardMaterial color="#e5e7eb" metalness={0.9} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0, 0.41]} castShadow>
        <boxGeometry args={[0.17, 0.03, 0.035]} />
        <meshStandardMaterial color="#d4a017" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.51]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.026, 0.18, 12]} />
        <meshStandardMaterial color="#7c2d12" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.62]}>
        <sphereGeometry args={[0.042, 12, 12]} />
        <meshStandardMaterial color="#d4a017" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

const Z = new THREE.Vector3(0, 0, 1);
function quatFor(normal: THREE.Vector3) {
  return new THREE.Quaternion().setFromUnitVectors(Z, normal);
}

/* ------------------------------------------------------------------ */
/* Particles                                                           */
/* ------------------------------------------------------------------ */

interface Burst {
  id: number;
  origin: THREE.Vector3;
  dir: THREE.Vector3;
  count: number;
  power: number;
  colors: string[];
}

function ChipBurst({ burst, onDone }: { burst: Burst; onDone: (id: number) => void }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const start = useRef<number | null>(null);
  const parts = useMemo(
    () =>
      Array.from({ length: burst.count }, () => {
        const v = burst.dir
          .clone()
          .add(new THREE.Vector3((Math.random() - 0.5) * 1.6, Math.random() * 1.2, (Math.random() - 0.5) * 1.6))
          .normalize()
          .multiplyScalar(burst.power * (0.5 + Math.random() * 0.8));
        return { v, spin: new THREE.Vector3(Math.random() * 12, Math.random() * 12, Math.random() * 12), s: 0.6 + Math.random() * 0.8 };
      }),
    [burst],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const color = new THREE.Color();
    for (let i = 0; i < burst.count; i++) {
      mesh.setColorAt(i, color.set(burst.colors[i % burst.colors.length]));
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [burst]);

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    if (start.current === null) start.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - start.current;
    if (t > 1.4) {
      onDone(burst.id);
      return;
    }
    parts.forEach((p, i) => {
      dummy.position.set(
        burst.origin.x + p.v.x * t,
        Math.max(-1.1, burst.origin.y + p.v.y * t - 4.9 * t * t),
        burst.origin.z + p.v.z * t,
      );
      dummy.rotation.set(p.spin.x * t, p.spin.y * t, p.spin.z * t);
      dummy.scale.setScalar(p.s * Math.max(0, 1 - t / 1.4));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, burst.count]} castShadow>
      <boxGeometry args={[0.05, 0.02, 0.03]} />
      <meshStandardMaterial roughness={0.6} />
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------ */
/* Pirate                                                              */
/* ------------------------------------------------------------------ */

const SKIN = "#f2c094";

function Pirate({ popped, launchAt }: { popped: boolean; launchAt: number | null }) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const eye = useRef<THREE.Mesh>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const nextBlink = useRef(2);
  const drift = useMemo(() => (Math.random() < 0.5 ? -1 : 1), [launchAt]); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = root.current;
    if (!g) return;

    if (launchAt !== null) {
      const s = t - launchAt;
      // Real projectile: shoots up, tumbles, gravity brings it back down.
      g.position.set(drift * 1.4 * s, H - 0.15 + 9 * s - 6.5 * s * s, 0.6 * s);
      g.rotation.set(-2.5 * s, 0, -drift * 6 * s);
      g.visible = s < 3;
    } else {
      g.visible = true;
      g.position.set(0, H - 0.15 + Math.sin(t * 2.2) * 0.025, 0);
      g.rotation.set(0, 0, Math.sin(t * 1.6) * 0.06);
    }

    // Head follows the pointer; arms flail when launched.
    if (head.current) {
      const px = launchAt === null ? state.pointer.x : 0;
      const py = launchAt === null ? state.pointer.y : 0;
      head.current.rotation.y += (px * 0.4 - head.current.rotation.y) * 0.08;
      head.current.rotation.x += (-py * 0.35 - head.current.rotation.x) * 0.08;
    }
    const flail = popped ? Math.sin(t * 22) * 0.5 : 0;
    if (leftArm.current) leftArm.current.rotation.z = popped ? 2.6 + flail : 1.35 + Math.sin(t * 1.6) * 0.05;
    if (rightArm.current) rightArm.current.rotation.z = popped ? -2.6 - flail : -1.35 - Math.sin(t * 1.6) * 0.05;

    // Blink every few seconds.
    if (eye.current) {
      if (t > nextBlink.current) nextBlink.current = t + 2 + Math.random() * 3;
      eye.current.scale.y = nextBlink.current - t < 0.12 ? 0.15 : 1;
    }
  });

  const red = <meshStandardMaterial color="#dc2626" roughness={0.6} />;

  return (
    <group ref={root} scale={1.2}>
      {/* Torso with stripes */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.35, 8, 20]} />
        {red}
      </mesh>
      {[0.18, 0.33, 0.48].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.302, 0.028, 8, 32]} />
          <meshStandardMaterial color="#fef2f2" roughness={0.6} />
        </mesh>
      ))}
      {/* Arms (pivot at the shoulder) */}
      {[
        { ref: leftArm, x: -0.28 },
        { ref: rightArm, x: 0.28 },
      ].map(({ ref, x }) => (
        <group key={x} ref={ref} position={[x, 0.55, 0]}>
          <mesh position={[0, -0.25, 0]} castShadow>
            <capsuleGeometry args={[0.085, 0.32, 6, 12]} />
            {red}
          </mesh>
          <mesh position={[0, -0.5, 0]} castShadow>
            <sphereGeometry args={[0.09, 14, 14]} />
            <meshStandardMaterial color={SKIN} roughness={0.7} />
          </mesh>
        </group>
      ))}
      {/* Head */}
      <group ref={head} position={[0, 0.88, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.27, 28, 28]} />
          <meshStandardMaterial color={SKIN} roughness={0.75} />
        </mesh>
        {/* Beard: lower half-sphere */}
        <mesh position={[0, -0.03, 0.03]} scale={[1.02, 1, 1]}>
          <sphereGeometry args={[0.27, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          <meshStandardMaterial color="#5b3412" roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.0, 0.27]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#e8a979" roughness={0.7} />
        </mesh>
        {/* Eye and eye patch */}
        <mesh ref={eye} position={[-0.1, 0.07, 0.24]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color="#111827" roughness={0.2} />
        </mesh>
        <mesh position={[0.1, 0.07, 0.245]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.065, 0.065, 0.02, 20]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
        <mesh rotation={[0.3, 0, 0.35]}>
          <torusGeometry args={[0.272, 0.012, 6, 40]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
        {/* Mouth: a grin, or an O when launched */}
        <mesh position={[0, -0.09, 0.26]} scale={popped ? [0.6, 1, 0.5] : [1.2, 0.35, 0.5]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
        {/* Tricorn hat */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.05, 3]} />
          <meshStandardMaterial color="#111827" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.34, 0]} castShadow>
          <cylinderGeometry args={[0.19, 0.25, 0.2, 24]} />
          <meshStandardMaterial color="#111827" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.36, 0.21]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#f9fafb" />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

interface Flight {
  id: number;
  slot: number;
}

interface SceneProps {
  slots: Slot[];
  stuck: number[];
  trap: number;
  popped: boolean;
  busy: boolean;
  flight: Flight | null;
  onLand: (slot: number, id: number) => void;
  onAim: (slot: number) => void;
  azimuthRef: React.MutableRefObject<number>;
  reduceMotion: boolean;
}

function Scene({ slots, stuck, trap, popped, busy, flight, onLand, onAim, azimuthRef, reduceMotion }: SceneProps) {
  const { camera } = useThree();
  const wood = useMemo(() => makeWoodTexture(), []);
  const deck = useMemo(() => makeDeckTexture(), []);
  const barrelGeo = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 32; i++) {
      const y = -H / 2 + (i / 32) * H;
      pts.push(new THREE.Vector2(radiusAt(y), y));
    }
    return new THREE.LatheGeometry(pts, 64);
  }, []);

  const tilt = useRef<THREE.Group>(null);
  const shake = useRef<THREE.Group>(null);
  const flyer = useRef<THREE.Group>(null);
  const wobble = useRef({ at: -10, amp: 0, dir: 1 });
  const shakeAt = useRef(-10);
  const flightStart = useRef<number | null>(null);
  const flightFrom = useRef(new THREE.Vector3());
  const landed = useRef<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [launchAt, setLaunchAt] = useState<number | null>(null);
  const clock = useThree((s) => s.clock);
  const burstId = useRef(0);

  const used = useMemo(() => new Set(stuck), [stuck]);

  const addBurst = useCallback((b: Omit<Burst, "id">) => {
    burstId.current += 1;
    setBursts((list) => [...list, { ...b, id: burstId.current }]);
  }, []);

  // New barrel: pirate back in place.
  useEffect(() => {
    if (!popped) setLaunchAt(null);
  }, [popped]);

  // Trap hit: launch the pirate, confetti, camera shake.
  useEffect(() => {
    if (!popped || trap < 0) return;
    const now = clock.elapsedTime;
    setLaunchAt(now);
    shakeAt.current = now;
    wobble.current = { at: now, amp: 0.12, dir: Math.random() < 0.5 ? -1 : 1 };
    addBurst({
      origin: new THREE.Vector3(0, H + 0.1, 0),
      dir: new THREE.Vector3(0, 1.4, 0),
      count: 70,
      power: 4.2,
      colors: ["#f97316", "#facc15", "#22c55e", "#3b82f6", "#ec4899", "#a855f7"],
    });
  }, [popped, trap, clock, addBurst]);

  useEffect(() => {
    if (flight) {
      flightStart.current = null;
      landed.current = null;
    }
  }, [flight]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    azimuthRef.current = Math.atan2(camera.position.x, camera.position.z);

    // Barrel wobble, pivoting on its base.
    const w = wobble.current;
    const wt = t - w.at;
    if (tilt.current) {
      const a = w.amp * Math.exp(-5 * wt) * Math.sin(wt * 28);
      tilt.current.rotation.z = wt < 2 ? a * w.dir : 0;
      tilt.current.rotation.x = wt < 2 ? a * 0.4 : 0;
    }
    // Screen shake when the pirate launches.
    if (shake.current) {
      const st = t - shakeAt.current;
      const k = st < 0.45 && !reduceMotion ? 0.06 * (1 - st / 0.45) : 0;
      shake.current.position.set((Math.random() - 0.5) * k, (Math.random() - 0.5) * k, 0);
    }

    // Knife in flight: arcs in from the camera, tumbling end over end.
    const g = flyer.current;
    if (!g) return;
    if (!flight) {
      g.visible = false;
      return;
    }
    const slot = slots[flight.slot];
    if (flightStart.current === null) {
      flightStart.current = t;
      const from = camera.position.clone().add(new THREE.Vector3((Math.random() - 0.5) * 1.5, -0.9, 0));
      flightFrom.current = from.sub(new THREE.Vector3(0, H / 2, 0)); // barrel-local
    }
    const p = Math.min(1, (t - flightStart.current) / FLIGHT_S);
    const e = 1 - Math.pow(1 - p, 1.6);
    const to = slot.pos.clone().addScaledVector(slot.normal, -0.17);
    g.visible = true;
    g.position.lerpVectors(flightFrom.current, to, e);
    g.position.y += Math.sin(Math.PI * e) * 0.6;
    const spins = 2;
    const q = quatFor(slot.normal);
    const tumble = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI * 2 * spins * (1 - e));
    g.quaternion.copy(q).multiply(tumble);
    const sc = 2.6 - 0.9 * e;
    g.scale.setScalar(sc);

    if (p >= 1 && landed.current !== flight.id) {
      landed.current = flight.id;
      g.visible = false;
      wobble.current = { at: t, amp: 0.05, dir: slot.normal.x >= 0 ? 1 : -1 };
      addBurst({
        origin: slot.pos.clone().add(new THREE.Vector3(0, H / 2, 0)).addScaledVector(slot.normal, 0.05),
        dir: slot.normal.clone().multiplyScalar(1.2),
        count: 14,
        power: 2.2,
        colors: ["#c98a4b", "#7c4a1e", "#a16207"],
      });
      onLand(flight.slot, flight.id);
    }
  });

  const canAim = !busy && !popped;

  return (
    <group ref={shake}>
      <hemisphereLight args={["#cfe9ff", "#8a5a2b", 0.8]} />
      <directionalLight
        position={[3.5, 7, 4]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      <pointLight position={[-3, 2, 2]} intensity={6} color="#ffb366" distance={10} />

      {/* Ship deck */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <circleGeometry args={[7, 48]} />
        <meshStandardMaterial map={deck} roughness={0.9} />
      </mesh>
      <ContactShadows position={[0, 0.002, 0]} opacity={0.5} scale={6} blur={2.4} far={3} />

      {/* Barrel pivots on its base so hits rock it */}
      <group ref={tilt}>
        <group position={[0, H / 2, 0]}>
          <mesh geometry={barrelGeo} castShadow receiveShadow>
            <meshStandardMaterial map={wood} roughness={0.75} side={THREE.DoubleSide} />
          </mesh>
          {/* Iron hoops */}
          {[-H / 2 + 0.12, -0.72, 0.72, H / 2 - 0.12].map((y) => (
            <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <torusGeometry args={[radiusAt(y) + 0.012, 0.045, 10, 64]} />
              <meshStandardMaterial color="#3f4652" metalness={0.85} roughness={0.35} />
            </mesh>
          ))}
          {/* Lid rim and dark opening */}
          <mesh position={[0, H / 2 - 0.02, 0]}>
            <cylinderGeometry args={[R - 0.05, R - 0.05, 0.05, 48]} />
            <meshStandardMaterial color="#2a1305" roughness={1} />
          </mesh>
          <mesh position={[0, -H / 2 + 0.03, 0]}>
            <cylinderGeometry args={[R, R, 0.05, 48]} />
            <meshStandardMaterial map={wood} roughness={0.8} />
          </mesh>

          {/* Slots */}
          {slots.map((s, i) => {
            const open = !used.has(i);
            const isTrap = popped && i === trap;
            const lit = hover === i && open && canAim;
            return (
              <group key={i} position={s.pos} quaternion={quatFor(s.normal)}>
                <mesh position={[0, 0, 0.004]} scale={[1.35, 1, 1]}>
                  <circleGeometry args={[0.1, 24]} />
                  <meshStandardMaterial
                    color={isTrap ? "#7f1d1d" : "#1c0d04"}
                    emissive={isTrap ? "#f97316" : lit ? "#fb923c" : "#000000"}
                    emissiveIntensity={isTrap ? 1.4 : lit ? 0.9 : 0}
                    roughness={1}
                  />
                </mesh>
                {/* Bigger invisible hit area for fingers */}
                <mesh
                  position={[0, 0, 0.01]}
                  onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                    e.stopPropagation();
                    setHover(i);
                    if (open && canAim) document.body.style.cursor = "crosshair";
                  }}
                  onPointerOut={() => {
                    setHover((h) => (h === i ? null : h));
                    document.body.style.cursor = "";
                  }}
                  onClick={(e: ThreeEvent<MouseEvent>) => {
                    e.stopPropagation();
                    if (e.delta > 8) return; // was a drag, not a tap
                    if (open && canAim) onAim(i);
                  }}
                >
                  <circleGeometry args={[0.18, 16]} />
                  <meshBasicMaterial transparent opacity={0} depthWrite={false} />
                </mesh>
              </group>
            );
          })}

          {/* Knives already in */}
          {stuck.map((i) => {
            const s = slots[i];
            return (
              <StuckKnife key={i} slot={s} />
            );
          })}

          {/* Knife in flight */}
          <group ref={flyer} visible={false}>
            <Knife />
          </group>
        </group>

        <Pirate popped={popped} launchAt={launchAt} />
      </group>

      {bursts.map((b) => (
        <ChipBurst key={b.id} burst={b} onDone={(id) => setBursts((l) => l.filter((x) => x.id !== id))} />
      ))}
    </group>
  );
}

/** A knife stuck in the barrel, quivering for a moment after it lands. */
function StuckKnife({ slot }: { slot: Slot }) {
  const ref = useRef<THREE.Group>(null);
  const born = useRef<number | null>(null);
  const base = useMemo(() => quatFor(slot.normal), [slot]);
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    if (born.current === null) born.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - born.current;
    const q = Math.exp(-6 * t) * Math.sin(t * 45) * 0.18;
    g.quaternion.copy(base).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(q, q * 0.4, 0)));
  });
  return (
    <group ref={ref} scale={1.7} position={slot.pos.clone().addScaledVector(slot.normal, -0.17)}>
      <Knife />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Game shell                                                          */
/* ------------------------------------------------------------------ */

/** Pirate Barrel in real 3D: drag to spin the barrel, tap a slot (or the
 * button) to throw. One random slot launches the pirate. */
export function PirateBarrel3DGame({ game }: { game: CatalogGame }) {
  const [slotCount, setSlotCount] = useState<number>(16);
  const [playerCount, setPlayerCount] = useState(4);
  const [trap, setTrap] = useState(-1);
  const [stuck, setStuck] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [popped, setPopped] = useState(false);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [interacted, setInteracted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const timers = useRef<number[]>([]);
  const azimuthRef = useRef(0);
  const flightId = useRef(0);
  const landedIds = useRef(new Set<number>());

  const slots = useMemo(() => layoutSlots(slotCount), [slotCount]);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, []);

  const newBarrel = useCallback((count: number) => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setTrap(Math.floor(Math.random() * count));
    setStuck([]);
    setBusy(false);
    setPopped(false);
    setFlight(null);
  }, []);

  useEffect(() => {
    newBarrel(slotCount);
  }, [slotCount, newBarrel]);

  const used = new Set(stuck);
  const turn = stuck.length % playerCount;
  const loser = (stuck.length - 1) % playerCount;
  const safeLeft = slotCount - stuck.length - (popped ? 0 : 1);

  function throwAt(target?: number) {
    if (busy || popped) return;
    const open = slots.map((_, i) => i).filter((i) => !used.has(i));
    if (!open.length) return;
    let slot = target;
    if (slot === undefined || used.has(slot)) {
      // Aim at a slot facing the camera so the throw is visible.
      const az = azimuthRef.current;
      const facing = open.filter((i) => Math.cos(slots[i].phi - az) > 0.45);
      const pool = facing.length ? facing : open;
      slot = pool[Math.floor(Math.random() * pool.length)];
    }
    setInteracted(true);
    setBusy(true);
    flightId.current += 1;
    const id = flightId.current;
    setFlight({ id, slot });
    // Safety net: if animation frames are paused (background tab), land anyway.
    timers.current.push(window.setTimeout(() => onLand(slot, id), FLIGHT_S * 1000 + 1500));
    sfx.spin();
  }

  function onLand(slot: number, id: number) {
    if (landedIds.current.has(id)) return;
    landedIds.current.add(id);
    const knives = stuck.length + 1;
    setFlight(null);
    setStuck((s) => [...s, slot]);
    sfx.tick(2);
    haptic(HAPTIC.advance);
    timers.current.push(
      window.setTimeout(() => {
        if (slot === trap) {
          setPopped(true);
          setBusy(false);
          sfx.buzzer();
          haptic(HAPTIC.buzzer);
          track("pirate_popped", { game: game.slug, knives, slots: slotCount, mode: "3d" });
          trackGameFinished(game.slug);
        } else {
          setBusy(false);
          sfx.flip();
          trackCardNext(game.slug, knives);
        }
      }, SUSPENSE_MS),
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex w-full flex-wrap items-center justify-between gap-3 text-sm font-bold">
        <div className="flex items-center gap-2">
          <span className="text-muted">Players</span>
          <button
            type="button"
            aria-label="Fewer players"
            onClick={() => setPlayerCount((n) => Math.max(1, n - 1))}
            disabled={stuck.length > 0 && !popped}
            className="btn-ghost h-8 w-8 p-0 disabled:opacity-40"
          >
            <Minus className="h-4 w-4" aria-hidden />
          </button>
          <span className={`w-6 text-center tabular-nums ${game.text}`}>{playerCount}</span>
          <button
            type="button"
            aria-label="More players"
            onClick={() => setPlayerCount((n) => Math.min(20, n + 1))}
            disabled={stuck.length > 0 && !popped}
            className="btn-ghost h-8 w-8 p-0 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <div className="flex items-center gap-1.5" role="group" aria-label="Barrel size">
          {SLOT_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setSlotCount(n)}
              aria-pressed={slotCount === n}
              className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                slotCount === n ? `${game.border} ${game.text} bg-white/5` : "border-white/10 text-muted hover:text-foreground"
              }`}
            >
              {n} slots
            </button>
          ))}
        </div>
      </div>

      <div
        className={`relative w-full overflow-hidden rounded-3xl border-2 ${game.border}`}
        style={{ background: "linear-gradient(180deg,#38bdf8 0%,#7dd3fc 38%,#0ea5e9 58%,#075985 100%)" }}
      >
        {/* Sun and drifting clouds behind the canvas */}
        <div aria-hidden className="pointer-events-none absolute right-8 top-6 h-14 w-14 rounded-full bg-yellow-200 shadow-[0_0_60px_20px_rgba(254,240,138,0.6)]" />
        <div aria-hidden className="pointer-events-none absolute left-[8%] top-10 h-6 w-24 rounded-full bg-white/80 blur-[1px] motion-safe:animate-float-slow" />
        <div aria-hidden className="pointer-events-none absolute left-[55%] top-16 h-5 w-16 rounded-full bg-white/70 blur-[1px] motion-safe:animate-float-slow [animation-delay:-3s]" />

        <p className="absolute inset-x-0 top-3 z-10 text-center text-xs font-black uppercase tracking-[0.15em] text-slate-900/80">
          {popped ? "The pirate is out!" : playerCount > 1 ? `Player ${turn + 1}, throw a knife` : "Throw a knife"}
        </p>

        <div className="relative h-[24rem] w-full touch-pan-y sm:h-[28rem]">
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 2.9, 6.8], fov: 40 }}
            gl={{ antialias: true, alpha: true }}
            onPointerMissed={() => (document.body.style.cursor = "")}
          >
            <Scene
              slots={slots}
              stuck={stuck}
              trap={trap}
              popped={popped}
              busy={busy}
              flight={flight}
              onLand={onLand}
              onAim={throwAt}
              azimuthRef={azimuthRef}
              reduceMotion={reduceMotion}
            />
            <OrbitControls
              target={[0, 1.7, 0]}
              enablePan={false}
              enableZoom={false}
              minPolarAngle={0.95}
              maxPolarAngle={1.45}
              autoRotate={!busy && !interacted && !reduceMotion}
              autoRotateSpeed={1.2}
              enableDamping
              onStart={() => setInteracted(true)}
            />
          </Canvas>
        </div>

        {!interacted ? (
          <p className="pointer-events-none absolute inset-x-0 bottom-16 z-10 flex items-center justify-center gap-1.5 text-xs font-bold text-white drop-shadow motion-safe:animate-pulse">
            <Hand className="h-4 w-4" aria-hidden />
            Drag to spin the barrel · tap a slot to throw
          </p>
        ) : null}

        <div className="absolute inset-x-0 bottom-3 z-10 text-center">
          {popped ? (
            <p className="inline-block rounded-full bg-white/90 px-4 py-1.5 text-lg font-extrabold text-red-600 shadow motion-safe:animate-pop-in">
              {playerCount > 1 ? `Player ${loser + 1} launched the pirate!` : "You launched the pirate!"}
            </p>
          ) : (
            <p className="inline-block rounded-full bg-slate-900/60 px-3 py-1 text-xs font-bold text-white">
              {stuck.length} {stuck.length === 1 ? "knife" : "knives"} in · {safeLeft} safe slot{safeLeft === 1 ? "" : "s"} left
            </p>
          )}
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        {popped ? (
          <button type="button" onClick={() => newBarrel(slotCount)} className="btn-primary w-full py-4 text-base sm:w-auto sm:min-w-[12rem]">
            <RotateCcw className="h-5 w-5" aria-hidden />
            New barrel
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => throwAt()}
              disabled={busy}
              className="btn-primary w-full py-4 text-base disabled:opacity-60 sm:w-auto sm:min-w-[12rem]"
            >
              <Swords className="h-5 w-5" aria-hidden />
              Throw a knife
            </button>
            <button type="button" onClick={() => newBarrel(slotCount)} className="btn-ghost w-full sm:w-auto">
              <RotateCcw className="h-4 w-4" aria-hidden />
              New barrel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
