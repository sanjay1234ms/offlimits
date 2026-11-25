/**
 * Ink-splash theme reveal, rebuilt from the reference reel frame by frame:
 *  - the new theme bursts out of the toggle as a small spiky ink splat,
 *  - floods outward with a turbulent, marbled edge (tendrils, spray dots ahead of the front),
 *  - leaves islands/streaks of the old theme behind that break up and dissolve last,
 *  - edges are pin-sharp (no blur, no cross-fade); nothing else on the page moves.
 *
 * How: a noise field (distance from the toggle + domain-warped fractal noise) is sampled on a grid once.
 * Each frame we raise a threshold and trace the exact contour with marching squares into an SVG path,
 * which clips ::view-transition-new(root). Holes (old-theme islands) use the even-odd rule.
 */

type Field = { cols: number; rows: number; cs: number; v: Float32Array; ox: number; oy: number };

// ---------- noise ----------
function hash(x: number, y: number, s: number) {
  let h = (x * 374761393 + y * 668265263 + s * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
function vnoise(x: number, y: number, s: number) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), w = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
  return (a + (b - a) * u + (c - a) * w + (a - b - c + d) * u * w) * 2 - 1; // -1..1
}
function fbm(x: number, y: number, s: number, oct = 5) {
  let sum = 0, amp = 0.5, f = 1, norm = 0;
  for (let i = 0; i < oct; i++) { sum += amp * vnoise(x * f, y * f, s + i * 17); norm += amp; amp *= 0.55; f *= 2.07; }
  return sum / norm; // ~ -1..1
}

/** Sample the ink field: low values flood first. Padded by one cell of "never" so every contour closes. */
export function buildField(W: number, H: number, ox: number, oy: number, seed: number): Field {
  const cols = W < 700 ? 96 : 150;
  const cs = W / cols;
  const rows = Math.ceil(H / cs);
  const C = cols + 3, R = rows + 3; // one padding ring on each side (+1 for the far corner)
  const v = new Float32Array(C * R);
  const far = Math.max(Math.hypot(ox, oy), Math.hypot(W - ox, oy), Math.hypot(ox, H - oy), Math.hypot(W - ox, H - oy));
  const sc = 1 / 230; // noise scale in px
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      const i = r * C + c;
      if (r === 0 || c === 0 || r === R - 1 || c === C - 1) { v[i] = 99; continue; } // padding: never inside
      const x = (c - 1) * cs, y = (r - 1) * cs;
      const nx = x * sc, ny = y * sc;
      // domain warp → fluid, marbled ink
      const wx = fbm(nx + 3.1, ny - 1.7, seed, 3), wy = fbm(nx - 5.2, ny + 2.3, seed + 7, 3);
      const n = fbm(nx * 1.6 + wx * 1.8, ny * 1.6 + wy * 1.8, seed + 13, 5);
      // streaks that run along the front (as in the reel): slow along the tangent, fast along the radius
      const dist = Math.hypot(x - ox, y - oy), ang = Math.atan2(y - oy, x - ox);
      const streak = fbm(dist / 34 + wx * 1.2, ang * (far / 260), seed + 31, 4);
      const spray = vnoise(x / 9, y / 9, seed + 99); // fine spatter just ahead of the front
      const fine = fbm(x / 38 + wx * 2, y / 38 + wy * 2, seed + 57, 3); // ragged tendrils on the edge
      const d = dist / far;
      // one coherent flood: distance dominates; turbulence only roughens the band around the front
      v[i] = d + n * 0.11 + streak * 0.07 + fine * 0.035 + spray * 0.018;
    }
  }
  return { cols, rows, cs, v, ox, oy };
}

/** Marching squares → closed loops → SVG path (even-odd) for cells with value < t. */
export function contourPath(F: Field, t: number) {
  const { cols, rows, cs, v } = F;
  const C = cols + 3;
  const X = (c: number) => ((c - 1) * cs).toFixed(1), Y = (r: number) => ((r - 1) * cs).toFixed(1);
  // edge ids: horizontal edge (r,c)-(r,c+1) → 2*(r*C+c); vertical edge (r,c)-(r+1,c) → 2*(r*C+c)+1
  const next = new Map<number, number>(); const pt = new Map<number, string>();
  const cross = (a: number, b: number) => { const d = b - a; return d === 0 ? 0.5 : Math.min(1, Math.max(0, (t - a) / d)); };
  const hPt = (r: number, c: number) => { const k = 2 * (r * C + c); if (!pt.has(k)) { const f = cross(v[r * C + c], v[r * C + c + 1]); pt.set(k, `${(((c - 1) + f) * cs).toFixed(1)} ${Y(r)}`); } return k; };
  const vPt = (r: number, c: number) => { const k = 2 * (r * C + c) + 1; if (!pt.has(k)) { const f = cross(v[r * C + c], v[(r + 1) * C + c]); pt.set(k, `${X(c)} ${(((r - 1) + f) * cs).toFixed(1)}`); } return k; };
  for (let r = 0; r < rows + 2; r++) {
    for (let c = 0; c < cols + 2; c++) {
      const a = v[r * C + c] < t ? 1 : 0, b = v[r * C + c + 1] < t ? 1 : 0, cc = v[(r + 1) * C + c + 1] < t ? 1 : 0, d = v[(r + 1) * C + c] < t ? 1 : 0;
      const k = a * 8 + b * 4 + cc * 2 + d;
      if (k === 0 || k === 15) continue;
      const top = () => hPt(r, c), right = () => vPt(r, c + 1), bottom = () => hPt(r + 1, c), left = () => vPt(r, c);
      const seg = (p: number, q: number) => next.set(p, q);
      switch (k) {
        case 1: seg(left(), bottom()); break;       case 14: seg(bottom(), left()); break;
        case 2: seg(bottom(), right()); break;      case 13: seg(right(), bottom()); break;
        case 3: seg(left(), right()); break;        case 12: seg(right(), left()); break;
        case 4: seg(right(), top()); break;         case 11: seg(top(), right()); break;
        case 6: seg(bottom(), top()); break;        case 9: seg(top(), bottom()); break;
        case 7: seg(left(), top()); break;          case 8: seg(top(), left()); break;
        case 5: seg(left(), top()); seg(right(), bottom()); break;
        case 10: seg(top(), right()); seg(bottom(), left()); break;
      }
    }
  }
  let d = '';
  const seen = new Set<number>();
  for (const start of Array.from(next.keys())) {
    if (seen.has(start)) continue;
    let k: number | undefined = start, s = '';
    for (let guard = 0; k !== undefined && !seen.has(k) && guard < 200000; guard++) { seen.add(k); s += (s ? 'L' : 'M') + pt.get(k); k = next.get(k); }
    d += s + 'Z';
  }
  return d;
}

/**
 * Share of the screen that has switched, over time, measured frame-by-frame from the reference reel
 * (seconds since the tap → fraction covered). Dark→light is slow with a long dissolving tail;
 * light→dark is a quick splash.
 */
const CURVE_TO_LIGHT: [number, number][] = [
  [0, 0], [0.067, 0.013], [0.133, 0.056], [0.2, 0.125], [0.267, 0.16], [0.333, 0.211], [0.4, 0.255], [0.467, 0.325],
  [0.533, 0.365], [0.6, 0.41], [0.667, 0.453], [0.733, 0.515], [0.8, 0.565], [0.867, 0.6], [0.933, 0.62], [1.0, 0.642],
  [1.067, 0.663], [1.133, 0.693], [1.2, 0.706], [1.267, 0.715], [1.333, 0.743], [1.4, 0.793], [1.467, 0.805], [1.533, 0.842],
  [1.6, 0.883], [1.667, 0.891], [1.733, 0.896], [1.8, 0.911], [1.867, 0.919], [1.933, 0.938], [2.0, 0.951], [2.067, 0.963],
  [2.133, 0.984], [2.2, 0.991], [2.267, 0.994], [2.333, 0.997], [2.4, 1],
];
const CURVE_TO_DARK: [number, number][] = [
  [0, 0], [0.067, 0.192], [0.133, 0.292], [0.2, 0.395], [0.267, 0.544], [0.333, 0.717], [0.4, 0.77], [0.467, 0.843], [0.533, 0.901], [0.6, 0.989], [0.667, 1],
];
const sample = (curve: [number, number][], s: number) => {
  if (s <= 0) return 0;
  for (let i = 1; i < curve.length; i++) {
    const [t1, c1] = curve[i]; if (s <= t1) { const [t0, c0] = curve[i - 1]; return c0 + ((c1 - c0) * (s - t0)) / (t1 - t0); }
  }
  return 1;
};

/**
 * Run the ink reveal on ::view-transition-new(root). Resolves when done.
 * The threshold each frame is chosen so the covered share of the screen follows the reel's measured curve.
 */
export function runInkReveal(origin: { x: number; y: number }, toLight: boolean) {
  const W = innerWidth, H = innerHeight;
  const F = buildField(W, H, origin.x, origin.y, Math.floor(Math.random() * 1e6));
  const style = document.createElement('style'); style.id = 'ink-reveal';
  document.head.appendChild(style);
  const curve = toLight ? CURVE_TO_LIGHT : CURVE_TO_DARK;
  const duration = curve[curve.length - 1][0] * 1000;
  // sorted on-screen field values: coverage c ↔ threshold sorted[c·n]
  const vals: number[] = []; F.v.forEach((x) => { if (x < 50) vals.push(x); });
  const sorted = Float32Array.from(vals).sort();
  const thresholdFor = (c: number) => (c <= 0 ? -1 : c >= 1 ? sorted[sorted.length - 1] + 0.01 : sorted[Math.min(sorted.length - 1, Math.floor(c * (sorted.length - 1)))] + 1e-4);
  // keep the view transition alive for the whole reveal (it ends when this animation ends)
  document.documentElement.animate({ opacity: [1, 1] }, { duration, pseudoElement: '::view-transition-new(root)' } as KeyframeAnimationOptions);
  const t0 = performance.now();
  return new Promise<void>((resolve) => {
    const frame = (now: number) => {
      // +0.1s: the browser spends a moment snapshotting the page after the tap; start the curve a touch ahead
      const s = (now - t0) / 1000 + 0.18;
      const done = s * 1000 >= duration + 180;
      const c = sample(curve, s);
      // a tiny splat appears at the toggle on the very first frame, like the reel's first drop of ink
      const t = thresholdFor(Math.max(c, 0.0015));
      style.textContent = done ? '' : `::view-transition-new(root){clip-path:path(evenodd,"${contourPath(F, t) || 'M0 0Z'}")}`;
      if (!done) requestAnimationFrame(frame); else { style.remove(); resolve(); }
    };
    requestAnimationFrame(frame);
  });
}
