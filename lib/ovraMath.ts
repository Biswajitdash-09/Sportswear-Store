export type SheetName = 'collage' | 'marquee';

export interface CellSpec {
  sheet: SheetName;
  cx: number;
  cy: number;
  cw: number;
  ch: number;
  fx: number;
  fy: number;
}

export interface CropResult {
  backgroundSize: string;
  backgroundPositionX: string;
  backgroundPositionY: string;
  scale: number;
}

export const HERO_ATHLETE_URL =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261114_120532_a504ce9e-4820-4193-8b7c-9b1abb1f45b9.png&w=1528&q=85';

export const COLLAGE_INNER_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261114_120327_e42374b9-471e-4799-9dca-07fe8b4d6536.png';

export const MARQUEE_INNER_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261114_120324_90c4bb35-2fb2-47a8-aa6e-14a7c92e2214.png';

export const SHEET_DIMENSIONS: Record<SheetName, { w: number; h: number }> = {
  collage: { w: 2048, h: 2048 },
  marquee: { w: 1744, h: 2336 },
};

export const CELLS: Record<string, CellSpec> = {
  collageCentre: { sheet: 'collage', cx: 29, cy: 28, cw: 982, ch: 982, fx: 0.5, fy: 0.2 },
  collageLeft: { sheet: 'collage', cx: 1036, cy: 28, cw: 982, ch: 982, fx: 0.5, fy: 0.3 },
  collageRight: { sheet: 'collage', cx: 29, cy: 1036, cw: 982, ch: 982, fx: 0.5, fy: 0.45 },
  heroVideo: { sheet: 'collage', cx: 1036, cy: 1036, cw: 982, ch: 983, fx: 0.5, fy: 0.62 },
  avatar1: { sheet: 'collage', cx: 1452, cy: 1186, cw: 130, ch: 130, fx: 0.5, fy: 0.5 },
  avatar2: { sheet: 'collage', cx: 1200, cy: 1146, cw: 135, ch: 135, fx: 0.5, fy: 0.5 },
  avatar3: { sheet: 'collage', cx: 1690, cy: 1150, cw: 135, ch: 135, fx: 0.5, fy: 0.5 },
  marquee1: { sheet: 'marquee', cx: 0, cy: 0, cw: 866, ch: 1159, fx: 0.5, fy: 1 },
  marquee2: { sheet: 'marquee', cx: 878, cy: 0, cw: 866, ch: 1159, fx: 0.5, fy: 1 },
  marquee3: { sheet: 'marquee', cx: 0, cy: 1172, cw: 866, ch: 1164, fx: 0.5, fy: 1 },
  marquee4: { sheet: 'marquee', cx: 878, cy: 1172, cw: 866, ch: 1164, fx: 0.5, fy: 1 },
};

export const STENCIL_CUTS: Record<string, { dir: '90deg' | '180deg'; pct: number }> = {
  W: { dir: '90deg', pct: 50 },
  O: { dir: '90deg', pct: 50 },
  R: { dir: '90deg', pct: 29 },
  K: { dir: '90deg', pct: 27 },
  U: { dir: '90deg', pct: 50 },
  T: { dir: '180deg', pct: 21 },
  F: { dir: '90deg', pct: 29 },
  E: { dir: '90deg', pct: 29 },
  S: { dir: '90deg', pct: 50 },
  H: { dir: '90deg', pct: 29 },
  I: { dir: '180deg', pct: 52 },
  Y: { dir: '180deg', pct: 50 },
  N: { dir: '90deg', pct: 29 },
  X: { dir: '180deg', pct: 50 },
  C: { dir: '90deg', pct: 52 },
  A: { dir: '180deg', pct: 62 },
};

export function buildSheetUrl(innerUrl: string, nativeWidth: number): string {
  return (
    'https://images.higgs.ai/?default=1&output=webp&url=' +
    encodeURIComponent(innerUrl) +
    '&w=' +
    nativeWidth +
    '&q=85'
  );
}

export function computeCropStyle(
  ew: number,
  eh: number,
  sheetW: number,
  sheetH: number,
  cell: Pick<CellSpec, 'cx' | 'cy' | 'cw' | 'ch' | 'fx' | 'fy'>
): CropResult {
  const s = Math.max(ew / cell.cw, eh / cell.ch);
  const bgW = sheetW * s;
  const bgH = sheetH * s;
  const posX = -(cell.cx * s) - (cell.cw * s - ew) * cell.fx;
  const posY = -(cell.cy * s) - (cell.ch * s - eh) * cell.fy;
  return {
    backgroundSize: `${bgW}px ${bgH}px`,
    backgroundPositionX: `${posX}px`,
    backgroundPositionY: `${posY}px`,
    scale: s,
  };
}

export function computeStencilMask(char: string): string | null {
  const spec = STENCIL_CUTS[char.toUpperCase()];
  if (!spec) return null;
  const c = `${spec.pct}%`;
  return `linear-gradient(${spec.dir}, #000 0, #000 calc(${c} - 0.034em), transparent calc(${c} - 0.034em), transparent calc(${c} + 0.034em), #000 calc(${c} + 0.034em), #000 100%)`;
}

export function computeWordSpacing(
  targetWidth: number,
  naturalWidth: number,
  gapCount = 6
): number {
  return (targetWidth - naturalWidth) / gapCount;
}

export function positiveMod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

export function computeMarqueeOffsets(
  sectionTop: number,
  drift: number,
  repWidth: number,
  u: number
): { row1X: number; row2X: number } {
  const d = -sectionTop * 0.45 + drift;
  const o = -6 * u;
  const m = positiveMod(d, repWidth);
  return {
    row1X: m - repWidth + o,
    row2X: o - m,
  };
}

export function cubicBezier(x1: number, y1: number, x2: number, y2: number): (x: number) => number {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleDX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const err = sampleX(t) - x;
      if (Math.abs(err) < 1e-6) return sampleY(t);
      const dx = sampleDX(t);
      if (Math.abs(dx) < 1e-6) break;
      t -= err / dx;
    }
    let lo = 0;
    let hi = 1;
    t = x;
    while (lo < hi) {
      const mid = sampleX(t);
      if (Math.abs(mid - x) < 1e-6) return sampleY(t);
      if (x > mid) lo = t;
      else hi = t;
      t = 0.5 * (lo + hi);
      if (hi - lo < 1e-6) break;
    }
    return sampleY(t);
  };
}
