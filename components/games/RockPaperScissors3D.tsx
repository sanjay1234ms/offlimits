"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { Bot, RotateCcw, Trophy, Users } from "lucide-react";
import type { CatalogGame } from "@/data/catalog";
import { rpsSfx } from "@/lib/audio";
import { haptic, HAPTIC } from "@/lib/haptics";
import { track, trackGameFinished } from "@/lib/analytics";
import { confettiBurst } from "@/lib/confetti";
import {
  aiLearn,
  aiThrow,
  judge,
  newAi,
  type AiState,
  type Move,
  type Outcome,
} from "@/lib/rpsAi";

/* ------------------------------------------------------------------ */
/* Timing                                                              */
/* ------------------------------------------------------------------ */

const BEAT = 0.42; // seconds per "Rock… Paper… Scissors…"
const COUNT_S = BEAT * 3 + 0.2;
const CLASH_S = 1.5;

type Phase = "pick" | "pass" | "countdown" | "clash" | "result";

const LABEL: Record<Move, string> = { rock: "Rock", paper: "Paper", scissors: "Scissors" };
const EMOJI: Record<Move, string> = { rock: "🪨", paper: "📄", scissors: "✂️" };

/* ------------------------------------------------------------------ */
/* Characters                                                          */
/* ------------------------------------------------------------------ */

/** Googly eyes that look at a point and react to winning or losing. */
function Eyes({ y, z, spread = 0.17, mood }: { y: number; z: number; spread?: number; mood: "idle" | "happy" | "sad" }) {
  const pupils = useRef<THREE.Group[]>([]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    pupils.current.forEach((p, i) => {
      if (!p) return;
      const look = mood === "happy" ? 0.03 : mood === "sad" ? -0.035 : Math.sin(t * 1.3 + i) * 0.015;
      p.position.set(state.pointer.x * 0.025, look + state.pointer.y * 0.015, 0.06);
      p.scale.y = mood === "sad" ? 0.55 : 1;
    });
  });
  return (
    <group position={[0, y, z]}>
      {[-spread, spread].map((x, i) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
          <group
            ref={(el) => {
              if (el) pupils.current[i] = el;
            }}
          >
            <mesh>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshStandardMaterial color="#0f172a" roughness={0.2} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

const rockGeo = (() => {
  const g = new THREE.IcosahedronGeometry(0.55, 2);
  const pos = g.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n = 1 + 0.12 * Math.sin(v.x * 7) * Math.cos(v.y * 6) + 0.06 * Math.sin(v.z * 11);
    v.multiplyScalar(n);
    v.y *= 0.85;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
})();

function Rock({ mood }: { mood: "idle" | "happy" | "sad" }) {
  return (
    <group>
      <mesh geometry={rockGeo} castShadow>
        <meshStandardMaterial color="#8b8f9a" roughness={0.95} flatShading />
      </mesh>
      <Eyes y={0.12} z={0.48} mood={mood} />
    </group>
  );
}

/** Notebook paper: two halves so scissors can cut it. */
function makePaperTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 320;
  const g = c.getContext("2d")!;
  g.fillStyle = "#fffdf5";
  g.fillRect(0, 0, c.width, c.height);
  g.strokeStyle = "rgba(59,130,246,0.45)";
  g.lineWidth = 2;
  for (let y = 40; y < c.height; y += 24) {
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(c.width, y);
    g.stroke();
  }
  g.strokeStyle = "rgba(244,63,94,0.6)";
  g.beginPath();
  g.moveTo(36, 0);
  g.lineTo(36, c.height);
  g.stroke();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function PaperHalf({ side, tex }: { side: -1 | 1; tex: THREE.Texture }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.5, 1.2, 8, 12);
    const pos = g.attributes.position;
    const uv = g.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Gentle curl so it reads as a sheet, not a card.
      pos.setZ(i, 0.06 * Math.sin((x + side * 0.25) * 3) + 0.03 * Math.sin(y * 4));
      uv.setX(i, side < 0 ? uv.getX(i) * 0.5 : 0.5 + uv.getX(i) * 0.5);
    }
    g.translate(side * 0.25, 0, 0);
    g.computeVertexNormals();
    return g;
  }, [side]);
  return (
    <mesh geometry={geo} castShadow>
      <meshStandardMaterial map={tex} roughness={0.8} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Paper({ mood, cut, tex }: { mood: "idle" | "happy" | "sad"; cut: number; tex: THREE.Texture }) {
  // cut: 0 = whole, 1 = halves fully drifted apart.
  return (
    <group>
      <group position={[-cut * 0.45, -cut * cut * 0.9, 0]} rotation={[0, 0, cut * 0.6]}>
        <PaperHalf side={-1} tex={tex} />
      </group>
      <group position={[cut * 0.45, -cut * cut * 0.9, 0]} rotation={[0, 0, -cut * 0.6]}>
        <PaperHalf side={1} tex={tex} />
      </group>
      {cut < 0.2 ? <Eyes y={0.2} z={0.08} spread={0.15} mood={mood} /> : null}
    </group>
  );
}

const bladeGeo = (() => {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.quadraticCurveTo(0.07, 0.35, 0.02, 0.75);
  s.lineTo(-0.02, 0.75);
  s.quadraticCurveTo(-0.03, 0.35, -0.05, 0);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: false });
  g.translate(0, 0, -0.015);
  return g;
})();

function Scissors({ mood, snip }: { mood: "idle" | "happy" | "sad"; snip: number }) {
  // snip: blade opening angle in radians.
  return (
    <group rotation={[0, 0, 0]}>
      {[1, -1].map((s) => (
        <group key={s} rotation={[0, 0, s * snip]}>
          <mesh geometry={bladeGeo} castShadow>
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[s * 0.14, -0.28, 0]} rotation={[0, 0, 0]} castShadow>
            <torusGeometry args={[0.13, 0.045, 10, 24]} />
            <meshStandardMaterial color={s > 0 ? "#ef4444" : "#f97316"} roughness={0.4} />
          </mesh>
          <mesh position={[s * 0.05, -0.1, 0]} rotation={[0, 0, s * 0.35]}>
            <boxGeometry args={[0.06, 0.24, 0.035]} />
            <meshStandardMaterial color={s > 0 ? "#ef4444" : "#f97316"} roughness={0.4} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0, 0.03]}>
        <cylinderGeometry args={[0.04, 0.04, 0.08, 12]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
      </mesh>
      <Eyes y={-0.28} z={0.1} spread={0.14} mood={mood} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Particles                                                           */
/* ------------------------------------------------------------------ */

interface Burst {
  id: number;
  origin: THREE.Vector3;
  count: number;
  power: number;
  colors: string[];
}

function Shards({ burst, onDone }: { burst: Burst; onDone: (id: number) => void }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const start = useRef<number | null>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const parts = useMemo(
    () =>
      Array.from({ length: burst.count }, () => ({
        v: new THREE.Vector3((Math.random() - 0.5) * 2, 0.6 + Math.random() * 1.4, (Math.random() - 0.5) * 2)
          .normalize()
          .multiplyScalar(burst.power * (0.4 + Math.random() * 0.8)),
        spin: new THREE.Vector3(Math.random() * 14, Math.random() * 14, Math.random() * 14),
        s: 0.5 + Math.random(),
      })),
    [burst],
  );
  useEffect(() => {
    const m = ref.current;
    if (!m) return;
    const c = new THREE.Color();
    for (let i = 0; i < burst.count; i++) m.setColorAt(i, c.set(burst.colors[i % burst.colors.length]));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [burst]);
  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    if (start.current === null) start.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - start.current;
    if (t > 1.6) {
      onDone(burst.id);
      return;
    }
    parts.forEach((p, i) => {
      dummy.position.set(
        burst.origin.x + p.v.x * t,
        Math.max(0.03, burst.origin.y + p.v.y * t - 4.9 * t * t),
        burst.origin.z + p.v.z * t,
      );
      dummy.rotation.set(p.spin.x * t, p.spin.y * t, p.spin.z * t);
      dummy.scale.setScalar(p.s * Math.max(0, 1 - t / 1.6));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, burst.count]} castShadow>
      <tetrahedronGeometry args={[0.06]} />
      <meshStandardMaterial roughness={0.5} metalness={0.3} />
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------ */
/* Arena                                                               */
/* ------------------------------------------------------------------ */

interface ArenaProps {
  phase: Phase;
  phaseAt: number;
  left: Move | null;
  right: Move | null;
  hoverLeft: Move | null;
}

const LX = -1.25;
const RX = 1.25;
const BASE_Y = 0.75;

function Fighter({
  move,
  side,
  mood,
  groupRef,
  cut,
  snip,
  tex,
}: {
  move: Move;
  side: -1 | 1;
  mood: "idle" | "happy" | "sad";
  groupRef: React.RefObject<THREE.Group>;
  cut: number;
  snip: number;
  tex: THREE.Texture;
}) {
  return (
    <group ref={groupRef} position={[side < 0 ? LX : RX, BASE_Y, 0]} rotation={[0, -side * 0.35, 0]}>
      {move === "rock" ? <Rock mood={mood} /> : move === "paper" ? <Paper mood={mood} cut={cut} tex={tex} /> : <Scissors mood={mood} snip={snip} />}
    </group>
  );
}

function Arena({ phase, phaseAt, left, right, hoverLeft }: ArenaProps) {
  const paperTex = useMemo(() => makePaperTexture(), []);
  const leftRef = useRef<THREE.Group>(null);
  const rightRef = useRef<THREE.Group>(null);
  const spot = useRef<THREE.SpotLight>(null);
  const [cut, setCut] = useState<[number, number]>([0, 0]);
  const [snip, setSnip] = useState<[number, number]>([0.35, 0.35]);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const burstId = useRef(0);
  const fired = useRef<number | null>(null);
  const sounded = useRef<number | null>(null);

  const outcome: Outcome | null = left && right ? judge(left, right) : null;
  const shown = (side: -1 | 1): Move => {
    if (phase === "countdown") return "rock"; // both shake fists
    const m = side < 0 ? left ?? hoverLeft : right;
    return m ?? "rock";
  };
  const mood = (side: -1 | 1): "idle" | "happy" | "sad" => {
    if ((phase !== "clash" && phase !== "result") || !outcome || outcome === "draw") return "idle";
    const leftWon = outcome === "win";
    return (side < 0) === leftWon ? "happy" : "sad";
  };

  const addBurst = useCallback((b: Omit<Burst, "id">) => {
    burstId.current += 1;
    setBursts((l) => [...l, { ...b, id: burstId.current }]);
  }, []);

  useEffect(() => {
    if (phase === "pick" || phase === "pass") {
      setCut([0, 0]);
      setSnip([0.35, 0.35]);
      fired.current = null;
    }
  }, [phase]);

  useFrame((state) => {
    const t = state.clock.elapsedTime - phaseAt;
    const L = leftRef.current;
    const R = rightRef.current;
    if (!L || !R) return;

    // Gentle camera parallax.
    state.camera.position.x += (state.pointer.x * 0.5 - state.camera.position.x) * 0.04;
    state.camera.lookAt(0, 0.7, 0);

    const idle = (g: THREE.Group, x: number, k: number) => {
      g.position.set(x, BASE_Y + Math.sin(state.clock.elapsedTime * 2 + k) * 0.06, 0);
      g.scale.setScalar(1);
      g.rotation.set(0, g.position.x < 0 ? 0.35 : -0.35, Math.sin(state.clock.elapsedTime * 1.5 + k) * 0.05);
    };

    if (phase === "pick" || phase === "pass") {
      idle(L, LX, 0);
      idle(R, RX, 1.5);
      if (spot.current) spot.current.intensity = 30;
      return;
    }

    if (phase === "countdown") {
      // Three shakes in time with "Rock… Paper… Scissors…"
      const beat = Math.min(t / BEAT, 3);
      const bounce = Math.abs(Math.sin(beat * Math.PI)) * 0.55;
      [L, R].forEach((g, i) => {
        g.position.set(i ? RX : LX, BASE_Y + bounce, 0);
        g.rotation.set(0, i ? -0.35 : 0.35, (i ? 1 : -1) * bounce * 0.4);
        g.scale.setScalar(1);
      });
      return;
    }

    // Clash / result: animate from the moment of SHOOT.
    // The result phase holds the final pose; effects only fire during the clash.
    const c = phase === "result" ? 1 : Math.min(t / CLASH_S, 1);
    const live = phase === "clash";
    const pop = c < 0.12 ? 0.4 + (c / 0.12) * 0.85 : 1.25 - Math.min(1, (c - 0.12) / 0.1) * 0.25;
    L.scale.setScalar(pop);
    R.scale.setScalar(pop);
    if (spot.current) spot.current.intensity = 30 + Math.max(0, 1 - c * 3) * 60;

    if (!left || !right || !outcome) return;
    const winner = outcome === "win" ? L : outcome === "lose" ? R : null;
    const loser = outcome === "win" ? R : outcome === "lose" ? L : null;
    const wMove = outcome === "win" ? left : right;
    const wSide = outcome === "win" ? -1 : 1;
    const lx = wSide < 0 ? RX : LX;

    if (!winner || !loser) {
      // Draw: both charge in, bump, bounce back.
      const k = c < 0.4 ? c / 0.4 : Math.max(0, 1 - (c - 0.4) / 0.35);
      L.position.set(LX + k * 0.85, BASE_Y + Math.sin(k * Math.PI) * 0.2, 0);
      R.position.set(RX - k * 0.85, BASE_Y + Math.sin(k * Math.PI) * 0.2, 0);
      if (c > 0.4 && fired.current !== phaseAt && live) {
        fired.current = phaseAt;
        rpsSfx.boing();
        addBurst({ origin: new THREE.Vector3(0, BASE_Y + 0.2, 0), count: 18, power: 2, colors: ["#fde047", "#ffffff"] });
      }
      return;
    }

    loser.position.set(lx, BASE_Y, 0);
    const approach = Math.min(1, c / 0.4);
    const ease = 1 - Math.pow(1 - approach, 3);

    if (wMove === "rock") {
      // Rock leaps and SMASHES the scissors.
      const startX = wSide < 0 ? LX : RX;
      winner.position.set(
        startX + (lx - startX) * ease,
        BASE_Y + Math.sin(ease * Math.PI) * 1.4 + (c > 0.4 ? Math.abs(Math.sin((c - 0.4) * 12)) * 0.25 * (1 - c) : 0),
        0,
      );
      winner.rotation.z = -wSide * ease * Math.PI * 2;
      if (c > 0.38) {
        loser.scale.setScalar(Math.max(0.001, 1 - (c - 0.38) * 6));
        if (fired.current !== phaseAt && live) {
          fired.current = phaseAt;
          rpsSfx.smash();
          addBurst({ origin: new THREE.Vector3(lx, BASE_Y, 0), count: 36, power: 3.4, colors: ["#e2e8f0", "#ef4444", "#f97316", "#94a3b8"] });
        }
      }
    } else if (wMove === "scissors") {
      // Scissors slide over and SNIP the paper in half.
      const startX = wSide < 0 ? LX : RX;
      winner.position.set(startX + (lx - startX) * ease * 0.85, BASE_Y + 0.15, 0.35 * ease);
      winner.rotation.z = -wSide * Math.PI / 2 * ease;
      if (c > 0.33 && live && sounded.current !== phaseAt) {
        sounded.current = phaseAt;
        rpsSfx.snip();
      }
      const snipping = c > 0.35 && c < 0.75;
      const s = snipping ? 0.05 + Math.abs(Math.sin((c - 0.35) * 30)) * 0.4 : 0.35;
      setSnip((prev) => (wSide < 0 ? [s, prev[1]] : [prev[0], s]));
      const k = Math.max(0, Math.min(1, (c - 0.6) / 0.4));
      setCut((prev) => (wSide < 0 ? [prev[0], k] : [k, prev[1]]));
      if (c > 0.6 && fired.current !== phaseAt && live) {
        fired.current = phaseAt;
        addBurst({ origin: new THREE.Vector3(lx, BASE_Y, 0.1), count: 20, power: 1.6, colors: ["#fffdf5", "#93c5fd"] });
      }
    } else {
      // Paper flies over and WRAPS the rock.
      const startX = wSide < 0 ? LX : RX;
      winner.position.set(startX + (lx - startX) * ease, BASE_Y + Math.sin(ease * Math.PI) * 0.6, 0.45 * ease);
      winner.rotation.set(-ease * 0.5, 0, -wSide * ease * Math.PI * 2);
      winner.scale.setScalar(pop * (1 + ease * 0.35));
      if (c > 0.45) {
        loser.scale.setScalar(Math.max(0.55, 1 - (c - 0.45) * 0.9));
        loser.position.x = lx + Math.sin(c * 60) * 0.03; // trembling
        if (fired.current !== phaseAt && live) {
          fired.current = phaseAt;
          rpsSfx.wrap();
          addBurst({ origin: new THREE.Vector3(lx, BASE_Y + 0.5, 0.3), count: 16, power: 1.4, colors: ["#fffdf5", "#fde047"] });
        }
      }
    }
  });

  return (
    <>
      <hemisphereLight args={["#e0e7ff", "#3b0764", 0.7]} />
      <directionalLight position={[2, 6, 4]} intensity={1.3} castShadow shadow-mapSize={[1024, 1024]} />
      <spotLight ref={spot} position={[0, 5, 2]} angle={0.6} penumbra={0.6} intensity={30} color="#fff7ed" castShadow />
      <pointLight position={[-3, 1.5, 2]} color="#38bdf8" intensity={8} distance={8} />
      <pointLight position={[3, 1.5, 2]} color="#f472b6" intensity={8} distance={8} />

      {/* Stage */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3.2, 64]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[2.9, 3.05, 64]} />
        <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
        <planeGeometry args={[0.06, 3.6]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} transparent opacity={0.5} />
      </mesh>
      <ContactShadows position={[0, 0.01, 0]} opacity={0.6} scale={7} blur={2.2} far={2.5} />

      <Fighter move={shown(-1)} side={-1} mood={mood(-1)} groupRef={leftRef} cut={cut[0]} snip={snip[0]} tex={paperTex} />
      <Fighter move={shown(1)} side={1} mood={mood(1)} groupRef={rightRef} cut={cut[1]} snip={snip[1]} tex={paperTex} />

      {bursts.map((b) => (
        <Shards key={b.id} burst={b} onDone={(id) => setBursts((l) => l.filter((x) => x.id !== id))} />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Game shell                                                          */
/* ------------------------------------------------------------------ */

type Mode = "cpu" | "duo";

export function RockPaperScissors3DGame({ game }: { game: CatalogGame }) {
  const [mode, setMode] = useState<Mode>("cpu");
  const [bestOf, setBestOf] = useState<3 | 5>(3);
  const [phase, setPhase] = useState<Phase>("pick");
  const [phaseAt, setPhaseAt] = useState(0);
  const [left, setLeft] = useState<Move | null>(null);
  const [right, setRight] = useState<Move | null>(null);
  const [hover, setHover] = useState<Move | null>(null);
  const [score, setScore] = useState<[number, number]>([0, 0]);
  const [streak, setStreak] = useState(0);
  const [banner, setBanner] = useState<string>("");
  const [beatWord, setBeatWord] = useState("");
  const [ai, setAi] = useState<AiState>(() => newAi());
  const clockRef = useRef<() => number>(() => performance.now() / 1000);
  const timers = useRef<number[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);

  const need = Math.ceil(bestOf / 2);
  const matchOver = score[0] >= need || score[1] >= need;
  const names: [string, string] = mode === "cpu" ? ["You", "Computer"] : ["Player 1", "Player 2"];
  const readRate = ai.attempts ? Math.round((ai.reads / ai.attempts) * 100) : 0;

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
  const go = (p: Phase) => {
    setPhase(p);
    setPhaseAt(clockRef.current());
  };

  const reset = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setScore([0, 0]);
    setLeft(null);
    setRight(null);
    setBanner("");
    setBeatWord("");
    setStreak(0);
    go("pick");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    reset();
  }, [mode, bestOf, reset]);

  function shoot(l: Move, r: Move) {
    setLeft(l);
    setRight(r);
    go("countdown");
    ["Rock…", "Paper…", "Scissors…"].forEach((w, i) =>
      later(i * BEAT * 1000, () => {
        setBeatWord(w);
        rpsSfx.beat(i);
        haptic(HAPTIC.advance);
      }),
    );
    later(COUNT_S * 1000, () => {
      setBeatWord("SHOOT!");
      rpsSfx.shoot();
      go("clash");
    });
    later((COUNT_S + CLASH_S) * 1000, () => {
      setBeatWord("");
      const o = judge(l, r);
      const next: [number, number] = [score[0] + (o === "win" ? 1 : 0), score[1] + (o === "lose" ? 1 : 0)];
      setScore(next);
      if (mode === "cpu") setAi((s) => aiLearn(s, { player: l, ai: r }));
      const verb = (w: Move, lo: Move) => (w === "rock" ? "smashes" : w === "scissors" ? "cut" : "covers") + ` ${LABEL[lo].toLowerCase()}`;
      if (o === "draw") {
        setBanner(`Draw! Both threw ${LABEL[l].toLowerCase()}. Throw again.`);
        setStreak(0);
      } else {
        const winnerName = o === "win" ? names[0] : names[1];
        const w = o === "win" ? l : r;
        const lo = o === "win" ? r : l;
        setBanner(`${LABEL[w]} ${verb(w, lo)}. ${winnerName} ${mode === "cpu" && o === "win" ? "win" : "wins"} the round!`);
        setStreak((s) => (o === "win" ? Math.max(1, s + 1) : Math.min(-1, s - 1)));
      }
      const over = next[0] >= need || next[1] >= need;
      if (over) {
        const r0 = stageRef.current?.getBoundingClientRect();
        if (r0 && (next[0] > next[1] || mode === "duo")) confettiBurst(r0.left + r0.width / 2, r0.top + r0.height / 3, 90);
        // In 2-player mode somebody always wins, so it's always a fanfare.
        if (mode === "cpu" && next[1] > next[0]) rpsSfx.matchLose();
        else rpsSfx.matchWin();
        haptic(HAPTIC.buzzer);
      } else if (o !== "draw") {
        if (mode === "cpu" && o === "lose") rpsSfx.roundLose();
        else rpsSfx.roundWin();
        trackGameFinished(game.slug);
        track("rps_match", { mode, bestOf, won: next[0] > next[1] ? 1 : 0 });
      }
      go("result");
    });
  }

  function pick(m: Move) {
    if (phase !== "pick" && phase !== "pass") return;
    rpsSfx.pop();
    if (mode === "cpu") {
      const t = aiThrow(ai);
      setAi(t.state);
      shoot(m, t.move);
      return;
    }
    if (phase === "pick") {
      setLeft(m);
      setHover(null);
      go("pass");
    } else if (left) {
      shoot(left, m);
    }
  }

  function nextRound() {
    setLeft(null);
    setRight(null);
    setBanner("");
    go("pick");
  }

  // Keyboard: 1/2/3 or R/P/S.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const m: Move | null = k === "1" || k === "r" ? "rock" : k === "2" || k === "p" ? "paper" : k === "3" || k === "s" ? "scissors" : null;
      if (m) pick(m);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const picking = phase === "pick" || phase === "pass";
  const prompt =
    mode === "cpu"
      ? "Pick your throw"
      : phase === "pick"
        ? "Player 1, pick in secret"
        : "Player 2, pick in secret";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Mode and length */}
      <div className="flex w-full flex-wrap items-center justify-between gap-3 text-sm font-bold">
        <div className="flex gap-1.5" role="group" aria-label="Mode">
          {([
            { id: "cpu", label: "vs Computer", Icon: Bot },
            { id: "duo", label: "2 Players", Icon: Users },
          ] as const).map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              aria-pressed={mode === id}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                mode === id ? `${game.border} ${game.text} bg-white/5` : "border-white/10 text-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5" role="group" aria-label="Match length">
          {([3, 5] as const).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setBestOf(n)}
              aria-pressed={bestOf === n}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                bestOf === n ? `${game.border} ${game.text} bg-white/5` : "border-white/10 text-muted hover:text-foreground"
              }`}
            >
              Best of {n}
            </button>
          ))}
        </div>
      </div>

      {/* Stage */}
      <div
        ref={stageRef}
        className={`relative w-full overflow-hidden rounded-3xl border-2 ${game.border}`}
        style={{ background: "radial-gradient(ellipse at 50% 20%, #4c1d95 0%, #1e1b4b 55%, #0b0a1f 100%)" }}
      >
        {/* Scoreboard */}
        <div className="absolute inset-x-0 top-3 z-10 flex items-start justify-between px-4">
          {[0, 1].map((i) => (
            <div key={i} className={`flex flex-col ${i ? "items-end" : "items-start"}`}>
              <span className="text-[11px] font-black uppercase tracking-wider text-white/70">{names[i]}</span>
              <span key={score[i]} className="text-4xl font-black tabular-nums text-white motion-safe:animate-pop-in">
                {score[i]}
              </span>
              <span className="flex gap-1">
                {Array.from({ length: need }, (_, k) => (
                  <span key={k} className={`h-1.5 w-4 rounded-full ${k < score[i] ? (i ? "bg-pink-400" : "bg-sky-400") : "bg-white/15"}`} />
                ))}
              </span>
            </div>
          ))}
        </div>
        <p className="absolute inset-x-0 top-4 z-10 text-center text-xs font-black uppercase tracking-[0.2em] text-yellow-300">VS</p>

        <div className="h-[22rem] w-full sm:h-[26rem]">
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 2.2, 5.2], fov: 42 }}
            gl={{ antialias: true, alpha: true }}
            onCreated={(s) => {
              clockRef.current = () => s.clock.elapsedTime;
            }}
          >
            <Arena phase={phase} phaseAt={phaseAt} left={phase === "pass" ? null : left} right={right} hoverLeft={hover} />
          </Canvas>
        </div>

        {/* Countdown word */}
        {beatWord ? (
          <p
            key={beatWord}
            className={`pointer-events-none absolute inset-x-0 top-1/3 z-10 text-center font-black text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.4)] motion-safe:animate-pop-in ${
              beatWord === "SHOOT!" ? "text-6xl text-yellow-300" : "text-4xl"
            }`}
          >
            {beatWord}
          </p>
        ) : null}

        {/* Result banner */}
        <div className="absolute inset-x-0 bottom-3 z-10 px-4 text-center">
          {phase === "result" && banner ? (
            <p className="inline-block rounded-2xl bg-white/95 px-4 py-2 text-sm font-extrabold text-slate-900 shadow-lg motion-safe:animate-pop-in sm:text-base">
              {matchOver ? (
                <>
                  <Trophy className="mr-1 inline h-4 w-4 text-amber-500" aria-hidden />
                  {score[0] > score[1] ? names[0] : names[1]} {mode === "cpu" && score[0] > score[1] ? "win" : "wins"} the match {Math.max(...score)}–{Math.min(...score)}!
                </>
              ) : (
                banner
              )}
            </p>
          ) : phase === "pass" ? (
            <p className="inline-block rounded-full bg-slate-900/70 px-4 py-1.5 text-sm font-bold text-white motion-safe:animate-pop-in">
              🔒 Player 1 locked in. Pass the phone to Player 2.
            </p>
          ) : null}
        </div>
      </div>

      {/* Controls */}
      {picking ? (
        <div className="w-full">
          <p className="mb-2 text-center text-xs font-black uppercase tracking-[0.15em] text-muted">{prompt}</p>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {(["rock", "paper", "scissors"] as Move[]).map((m, i) => (
              <button
                key={m}
                type="button"
                onClick={() => pick(m)}
                onPointerEnter={() => mode === "cpu" && setHover(m)}
                onPointerLeave={() => setHover(null)}
                className="group flex flex-col items-center gap-1 rounded-2xl border-2 border-white/10 bg-white/5 px-2 py-3 font-extrabold text-foreground transition-all hover:-translate-y-1 hover:border-accent hover:bg-white/10 active:translate-y-0.5 sm:py-4"
              >
                <span className="text-4xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-[-8deg] sm:text-5xl" aria-hidden>
                  {EMOJI[m]}
                </span>
                <span className="text-sm">{LABEL[m]}</span>
                <span className="hidden text-[10px] font-bold text-muted sm:block">press {i + 1}</span>
              </button>
            ))}
          </div>
        </div>
      ) : phase === "result" ? (
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          {matchOver ? (
            <button type="button" onClick={reset} className="btn-primary w-full py-4 text-base sm:w-auto sm:min-w-[12rem]">
              <RotateCcw className="h-5 w-5" aria-hidden />
              Play again
            </button>
          ) : (
            <button type="button" onClick={nextRound} className="btn-primary w-full py-4 text-base sm:w-auto sm:min-w-[12rem]">
              Next round
            </button>
          )}
        </div>
      ) : (
        <div className="h-[5.5rem]" aria-hidden />
      )}

      {/* Computer brain meter */}
      {mode === "cpu" ? (
        <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 font-bold text-foreground">
              <Bot className="h-4 w-4 text-accent" aria-hidden />
              {ai.history.length < 2
                ? "The computer is still learning your habits…"
                : `The computer has read your throw ${readRate}% of the time`}
            </span>
            {streak !== 0 ? (
              <span className={`text-xs font-black ${streak > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {streak > 0 ? `🔥 ${streak} win streak` : `${-streak} in a row to the computer`}
              </span>
            ) : null}
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 via-violet-400 to-pink-500 transition-[width] duration-700"
              style={{ width: `${ai.history.length < 2 ? 4 : Math.max(4, readRate)}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-muted">
            Above 33% means it&apos;s spotted a pattern. Break your habits to beat it.
          </p>
        </div>
      ) : null}
    </div>
  );
}
