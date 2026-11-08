"use client";

import { memo, useCallback, useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react";
import { Minus, Plus } from "lucide-react";
import { MAP_CITIES } from "@/data/daily/mapCities";

/** Map geometry, matching /public/daily/world.svg and countries.json
 * (equirectangular, 84°N to 58°S, 1000 units wide). */
export const MAP_W = 1000;
export const MAP_H = 394.4;
const TOP = 84;
const BOTTOM = -58;
const MAX_K = 24;

export function project(lat: number, lng: number): [number, number] {
  return [((lng + 180) / 360) * MAP_W, ((TOP - lat) / (TOP - BOTTOM)) * MAP_H];
}

export function unproject(x: number, y: number): MapPoint {
  return { lng: (x / MAP_W) * 360 - 180, lat: TOP - (y / MAP_H) * (TOP - BOTTOM) };
}

export interface MapPoint {
  lat: number;
  lng: number;
}

/** Great-circle distance in km. */
export function distanceKm(a: MapPoint, b: MapPoint): number {
  const R = 6371;
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/* -------------------------------------------------------------------------- */
/* Map data (two small static files, loaded once)                              */
/* -------------------------------------------------------------------------- */

interface Country {
  n: string;
  d: string;
  l: [number, number] | null;
  a: number;
}
interface MapData {
  land: string;
  countries: Country[];
}

let dataPromise: Promise<MapData> | null = null;
function loadMapData(): Promise<MapData> {
  dataPromise ??= Promise.all([
    fetch("/daily/world.svg").then((r) => r.text()),
    fetch("/daily/countries.json").then((r) => r.json() as Promise<Country[]>),
  ]).then(([svg, countries]) => ({ land: /\sd="([^"]+)"/.exec(svg)?.[1] ?? "", countries }));
  return dataPromise;
}

/** True when a map point falls inside the named country's outline. */
export async function isInCountry(country: string, p: MapPoint): Promise<boolean> {
  const data = await loadMapData();
  const c = data.countries.find((x) => x.n === country);
  if (!c || typeof document === "undefined") return false;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", c.d);
  svg.appendChild(path);
  svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
  document.body.appendChild(svg);
  try {
    const [x, y] = project(p.lat, p.lng);
    return path.isPointInFill(new DOMPoint(x, y));
  } catch {
    return false;
  } finally {
    svg.remove();
  }
}

/* -------------------------------------------------------------------------- */

interface View {
  x: number;
  y: number;
  k: number;
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Land and borders never change, so they're memoised apart from the camera. */
const Base = memo(function Base({ data, highlight, unit }: { data: MapData | null; highlight?: string; unit: number }) {
  return (
    <>
      <rect x={-MAP_W} y={-MAP_H} width={MAP_W * 3} height={MAP_H * 3} fill="#bfe6f7" />
      {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lng) => {
        const [x] = project(0, lng);
        return <line key={lng} x1={x} x2={x} y1={0} y2={MAP_H} stroke="#a3d6ee" strokeWidth={unit} />;
      })}
      {[60, 30, 0, -30].map((lat) => {
        const [, y] = project(lat, 0);
        return <line key={lat} x1={0} x2={MAP_W} y1={y} y2={y} stroke="#a3d6ee" strokeWidth={unit} />;
      })}
      {data ? (
        <>
          <path d={data.land} fill="#fdf3d7" stroke="#1e293b" strokeWidth={1.4 * unit} strokeLinejoin="round" />
          <g fill="none" stroke="#a8977a" strokeWidth={0.9 * unit} strokeDasharray={`${3 * unit} ${2 * unit}`}>
            {data.countries.map((c) => (
              <path key={c.n} d={c.d} />
            ))}
          </g>
          {highlight
            ? data.countries
                .filter((c) => c.n === highlight)
                .map((c) => (
                  <path
                    key={c.n}
                    d={c.d}
                    fill="#fb7185"
                    fillOpacity={0.75}
                    stroke="#be123c"
                    strokeWidth={1.4 * unit}
                    className="motion-safe:animate-pulse"
                  />
                ))
            : null}
        </>
      ) : null}
    </>
  );
});

export interface WorldMapHandle {
  /** Animate the camera back to the whole world. */
  reset(): void;
}

interface WorldMapProps {
  pin: MapPoint | null;
  onPin?: (p: MapPoint) => void;
  locked?: boolean;
  /** Hide every country and city name (country and city cards). */
  namesOff?: boolean;
  /** The reveal: true spot, its label and (for country cards) the outline. */
  answer?: (MapPoint & { label: string; country?: string }) | null;
  /** Shorter map while the result panel is showing. */
  compact?: boolean;
  /** Called when the reveal camera flight lands. */
  onRevealed?: () => void;
}

/** Pan-and-zoom world map with country borders and names that appear as you
 * zoom. Drag to pan, pinch or scroll to zoom, tap to drop the pin, drag the
 * pin to move it. Drawn from two small static files, no map service. */
export const WorldMap = forwardRef<WorldMapHandle, WorldMapProps>(function WorldMap(
  { pin, onPin, locked, namesOff, answer, compact, onRevealed },
  ref,
) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 600, h: 300 });
  const [view, setView] = useState<View>({ x: 0, y: 0, k: 1 });
  const viewRef = useRef(view);
  viewRef.current = view;
  const [data, setData] = useState<MapData | null>(null);
  const [touched, setTouched] = useState(false);
  const [arc, setArc] = useState(false);
  const [dropKey, setDropKey] = useState(0);
  const anim = useRef<number>();
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ moved: number; startDist: number; startK: number; pin: boolean } | null>(null);

  const aspect = size.w / size.h;
  const minK = Math.max(1, MAP_W / (aspect * MAP_H));

  useEffect(() => {
    loadMapData().then(setData).catch(() => {});
  }, []);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const clamp = useCallback(
    (v: View): View => {
      const k = Math.min(MAX_K, Math.max(minK, v.k));
      const w = MAP_W / k;
      const h = w / aspect;
      return {
        k,
        x: Math.min(MAP_W - w, Math.max(0, v.x)),
        y: h >= MAP_H ? (MAP_H - h) / 2 : Math.min(MAP_H - h, Math.max(0, v.y)),
      };
    },
    [aspect, minK],
  );

  const worldView = useCallback(() => {
    const w = MAP_W / minK;
    return clamp({ k: minK, x: MAP_W * 0.5 - w / 2, y: 0 });
  }, [minK, clamp]);

  const stop = () => {
    if (anim.current) cancelAnimationFrame(anim.current);
    anim.current = undefined;
  };

  /** Smooth camera move; zoom is eased on a log scale so it feels like a flight. */
  const flyTo = useCallback(
    (target: View, ms = 1100, done?: () => void) => {
      stop();
      const from = viewRef.current;
      const to = clamp(target);
      const t0 = performance.now();
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      const step = (now: number) => {
        const t = reduce ? 1 : Math.min(1, (now - t0) / ms);
        const e = ease(t);
        const k = Math.exp(Math.log(from.k) + (Math.log(to.k) - Math.log(from.k)) * e);
        // Pan in centre space so the zoom doesn't drift sideways.
        const fcx = from.x + MAP_W / from.k / 2;
        const fcy = from.y + MAP_W / from.k / aspect / 2;
        const tcx = to.x + MAP_W / to.k / 2;
        const tcy = to.y + MAP_W / to.k / aspect / 2;
        const cx = fcx + (tcx - fcx) * e;
        const cy = fcy + (tcy - fcy) * e;
        setView(clamp({ k, x: cx - MAP_W / k / 2, y: cy - MAP_W / k / aspect / 2 }));
        if (t < 1) anim.current = requestAnimationFrame(step);
        else {
          anim.current = undefined;
          done?.();
        }
      };
      anim.current = requestAnimationFrame(step);
    },
    [aspect, clamp],
  );

  useImperativeHandle(ref, () => ({ reset: () => flyTo(worldView(), 700) }), [flyTo, worldView]);

  // Whole world once the size is known.
  const sized = useRef(false);
  useEffect(() => {
    if (!sized.current && size.w !== 600) {
      sized.current = true;
      setView(worldView());
    } else {
      setView((v) => clamp(v));
    }
  }, [size, worldView, clamp]);

  // Latest values for timers and animation callbacks.
  const live = useRef({ aspect, flyTo, onRevealed, pin, answer });
  live.current = { aspect, flyTo, onRevealed, pin, answer };

  // Reveal: fly to frame the pin and the answer, then draw the arc.
  const answerKey = answer ? `${answer.lat},${answer.lng}` : "";
  useEffect(() => {
    if (!answer) {
      setArc(false);
      return;
    }
    // Wait for the map to shrink to its compact size, then frame both points
    // using the new shape.
    const timer = window.setTimeout(() => {
      const { aspect: a, flyTo: fly, pin: pn, answer: ans } = live.current;
      if (!ans) return;
      const pts = [ans, ...(pn ? [pn] : [])].map((pt) => project(pt.lat, pt.lng));
      const xs = pts.map((pt) => pt[0]);
      const ys = pts.map((pt) => pt[1]);
      const spanX = Math.max(...xs) - Math.min(...xs);
      const spanY = Math.max(...ys) - Math.min(...ys);
      // Leave room around the points: the pin sticks up, the label hangs down.
      const k = Math.min(9, MAP_W / Math.max(spanX * 1.35 + 70, (spanY * 1.35 + 80) * a));
      const cx = (Math.max(...xs) + Math.min(...xs)) / 2;
      const cy = (Math.max(...ys) + Math.min(...ys)) / 2;
      const w = MAP_W / k;
      fly({ k, x: cx - w / 2, y: cy - w / a / 2 }, 1200, () => {
        setArc(true);
        live.current.onRevealed?.();
      });
    }, 320);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerKey]);

  const vw = MAP_W / view.k;
  const vh = vw / aspect;
  const unit = vw / size.w; // map units per screen pixel

  const toMap = useCallback(
    (clientX: number, clientY: number): MapPoint => {
      const rect = boxRef.current!.getBoundingClientRect();
      const x = view.x + ((clientX - rect.left) / rect.width) * vw;
      const y = view.y + ((clientY - rect.top) / rect.height) * vh;
      return unproject(Math.max(0, Math.min(MAP_W, x)), Math.max(0, Math.min(MAP_H, y)));
    },
    [view, vw, vh],
  );

  const zoomAt = useCallback(
    (factor: number, clientX?: number, clientY?: number, animate = false) => {
      const rect = boxRef.current!.getBoundingClientRect();
      const fx = clientX === undefined ? 0.5 : (clientX - rect.left) / rect.width;
      const fy = clientY === undefined ? 0.5 : (clientY - rect.top) / rect.height;
      const v = viewRef.current;
      const w = MAP_W / v.k;
      const mx = v.x + fx * w;
      const my = v.y + fy * (w / aspect);
      const k = Math.min(MAX_K, Math.max(minK, v.k * factor));
      const nw = MAP_W / k;
      const next = { k, x: mx - fx * nw, y: my - fy * (nw / aspect) };
      if (animate) flyTo(next, 350);
      else setView(clamp(next));
    },
    [aspect, minK, clamp, flyTo],
  );

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      stop();
      setTouched(true);
      zoomAt(Math.exp(-e.deltaY * 0.0025), e.clientX, e.clientY);
    }
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  function onPointerDown(e: React.PointerEvent) {
    stop();
    setTouched(true);
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = Array.from(pointers.current.values());
    const onPinEl = Boolean((e.target as Element).closest?.("[data-pin]")) && !locked;
    gesture.current = {
      moved: pts.length === 1 ? 0 : (gesture.current?.moved ?? 99),
      startDist: pts.length === 2 ? Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) : 0,
      startK: viewRef.current.k,
      pin: pts.length === 1 && onPinEl,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    const prev = pointers.current.get(e.pointerId);
    const g = gesture.current;
    if (!prev || !g) return;
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    g.moved += Math.abs(dx) + Math.abs(dy);
    const pts = Array.from(pointers.current.values());
    if (pts.length === 2) {
      g.pin = false;
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const target = g.startK * (dist / (g.startDist || dist));
      zoomAt(target / viewRef.current.k, (pts[0].x + pts[1].x) / 2, (pts[0].y + pts[1].y) / 2);
      return;
    }
    if (g.pin && onPin) {
      // Pin tip sits under the finger, a little above it so it stays visible.
      onPin(toMap(e.clientX, e.clientY));
      return;
    }
    const rect = boxRef.current!.getBoundingClientRect();
    setView((v) => {
      const w = MAP_W / v.k;
      return clamp({ ...v, x: v.x - (dx / rect.width) * w, y: v.y - (dy / rect.height) * (w / aspect) });
    });
  }

  function onPointerUp(e: React.PointerEvent) {
    const g = gesture.current;
    const wasTap = pointers.current.size === 1 && (g?.moved ?? 99) < 8 && !g?.pin;
    pointers.current.delete(e.pointerId);
    if (wasTap && !locked && onPin) {
      onPin(toMap(e.clientX, e.clientY));
      setDropKey((k) => k + 1);
    }
    if (pointers.current.size === 0) gesture.current = null;
  }

  const pinXY = pin ? project(pin.lat, pin.lng) : null;
  const ansXY = answer ? project(answer.lat, answer.lng) : null;

  // Curved flight path from the pin to the answer.
  let arcD = "";
  if (pinXY && ansXY) {
    const [x1, y1] = pinXY;
    const [x2, y2] = ansXY;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const len = Math.hypot(x2 - x1, y2 - y1);
    const nx = -(y2 - y1) / (len || 1);
    const ny = (x2 - x1) / (len || 1);
    const bend = len * 0.18 * (ny > 0 ? -1 : 1);
    arcD = `M${x1} ${y1} Q${mx + nx * bend} ${my + ny * bend} ${x2} ${y2}`;
  }

  // Names that fit at this zoom.
  const labels =
    data && !namesOff
      ? data.countries.filter((c) => c.l && (Math.sqrt(c.a) / unit) * 0.8 > c.n.length * 7 + 8 && c.n !== answer?.country)
      : [];
  const cities = !namesOff ? MAP_CITIES.filter((c) => view.k >= c.z) : [];
  const inView = (x: number, y: number) => x > view.x - 20 * unit && x < view.x + vw + 20 * unit && y > view.y && y < view.y + vh;

  return (
    <div className="relative">
      <div
        ref={boxRef}
        className={`relative w-full touch-none select-none overflow-hidden rounded-2xl border-[3px] border-slate-900 bg-[#bfe6f7] transition-[height] duration-300 ${
          compact ? "h-[13rem] sm:h-[15rem]" : "h-[20rem] sm:h-[22rem]"
        } ${locked ? "cursor-grab" : "cursor-crosshair"}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <svg viewBox={`${view.x} ${view.y} ${vw} ${vh}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <Base data={data} unit={unit} highlight={answer?.country} />

          <g
            fontFamily="inherit"
            fontWeight={800}
            textAnchor="middle"
            fill="#475569"
            style={{ pointerEvents: "none" }}
            fontSize={10 * unit}
            letterSpacing={0.8 * unit}
          >
            {labels.map((c) =>
              inView(c.l![0], c.l![1]) ? (
                <text key={c.n} x={c.l![0]} y={c.l![1]} paintOrder="stroke" stroke="#fdf3d7" strokeWidth={3 * unit}>
                  {c.n.toUpperCase()}
                </text>
              ) : null,
            )}
          </g>
          <g style={{ pointerEvents: "none" }} fontSize={10.5 * unit} fontWeight={600} fill="#334155">
            {cities.map((c) => {
              const [x, y] = project(c.lat, c.lng);
              if (!inView(x, y)) return null;
              return (
                <g key={c.n}>
                  <circle cx={x} cy={y} r={2.6 * unit} fill={c.cap ? "#0f172a" : "#fff"} stroke="#0f172a" strokeWidth={1.2 * unit} />
                  <text x={x + 5 * unit} y={y + 3.5 * unit} paintOrder="stroke" stroke="#fdf3d7" strokeWidth={3 * unit}>
                    {c.n}
                  </text>
                </g>
              );
            })}
          </g>

          {arcD ? (
            <>
              <mask id="otm-arc-mask" maskUnits="userSpaceOnUse" x={-MAP_W} y={-MAP_H} width={MAP_W * 3} height={MAP_H * 3}>
                <path
                  d={arcD}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={8 * unit}
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={arc ? 0 : 1}
                  style={{ transition: "stroke-dashoffset 900ms cubic-bezier(.6,0,.2,1)" }}
                />
              </mask>
              <path
                d={arcD}
                fill="none"
                stroke="#0f172a"
                strokeWidth={2.4 * unit}
                strokeLinecap="round"
                strokeDasharray={`${7 * unit} ${5 * unit}`}
                mask="url(#otm-arc-mask)"
              />
            </>
          ) : null}

          {ansXY && arc ? (
            <g transform={`translate(${ansXY[0]} ${ansXY[1]}) scale(${unit})`}>
              <g className="otm-stamp">
                <circle r={17} fill="#f97316" stroke="#0f172a" strokeWidth={3} />
                <circle r={11} fill="none" stroke="#0f172a" strokeWidth={1.5} strokeDasharray="2.5 2.5" />
                <path d="M0 -7 L2.1 -2.2 L7 -2 L3.2 1.2 L4.4 6.2 L0 3.4 L-4.4 6.2 L-3.2 1.2 L-7 -2 L-2.1 -2.2 Z" fill="#0f172a" />
              </g>
              <g className="otm-tag">
                <rect
                  x={-(answer!.label.length * 3.6 + 10)}
                  y={22}
                  width={answer!.label.length * 7.2 + 20}
                  height={20}
                  rx={6}
                  fill="#fde047"
                  stroke="#0f172a"
                  strokeWidth={2}
                />
                <text y={36} textAnchor="middle" fontSize={11.5} fontWeight={900} fill="#0f172a">
                  {answer!.label}
                </text>
              </g>
            </g>
          ) : null}

          {pinXY ? (
            <g transform={`translate(${pinXY[0]} ${pinXY[1]}) scale(${unit})`} data-pin style={{ cursor: locked ? undefined : "grab" }}>
              <g key={dropKey} className="otm-pin">
                <ellipse cx={0} cy={1} rx={6} ry={2.2} fill="#0f172a" opacity={0.25} />
                <path
                  d="M0 0 C -4 -8 -15 -17 -15 -29 A 15 15 0 1 1 15 -29 C 15 -17 4 -8 0 0 Z"
                  fill="#ffffff"
                  stroke="#0f172a"
                  strokeWidth={3}
                />
                <circle cy={-29} r={5} fill="#0f172a" opacity={0.12} />
                {/* Bigger invisible grab area for fingers */}
                <circle cy={-24} r={26} fill="transparent" />
              </g>
            </g>
          ) : null}
        </svg>

        {!touched && !locked ? (
          <span className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-900/85 px-3 py-1 text-[11px] font-bold text-white">
            Drag to move · pinch to zoom
          </span>
        ) : null}
        {namesOff && !answer ? (
          <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border-2 border-slate-900 bg-yellow-300 px-2.5 py-0.5 text-[11px] font-black text-slate-900">
            Names are off
          </span>
        ) : null}
        <span className="pointer-events-none absolute bottom-1 right-2 text-[9px] font-semibold text-slate-500">
          Map: Natural Earth
        </span>
      </div>

      <div className="absolute right-2.5 top-2.5 flex flex-col gap-1.5">
        {[
          { label: "Zoom in", icon: Plus, f: () => zoomAt(1.8, undefined, undefined, true) },
          { label: "Zoom out", icon: Minus, f: () => zoomAt(1 / 1.8, undefined, undefined, true) },
        ].map(({ label, icon: Icon, f }) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              setTouched(true);
              f();
            }}
            aria-label={label}
            className="grid h-9 w-9 place-items-center rounded-xl border-2 border-slate-900 bg-white text-slate-900 shadow-[2px_2px_0_#0f172a] active:translate-y-0.5 active:shadow-none"
          >
            <Icon className="h-4 w-4" aria-hidden />
          </button>
        ))}
      </div>
    </div>
  );
});
