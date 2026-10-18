// Time helpers. Everything is stored as minutes-of-day (0..1439).

export function pad2(n) {
  return String(n).padStart(2, '0');
}

export function minutesToHHMM(min) {
  return `${pad2(Math.floor(min / 60))}:${pad2(min % 60)}`;
}

export function hhmmToMinutes(str) {
  if (typeof str !== 'string' || !/^\d{2}:\d{2}$/.test(str)) return null;
  const [h, m] = str.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

export function overlap(aStart, aEnd, bStart, bEnd) {
  // Touching endpoints are allowed: [10..12] vs [12..14] do NOT overlap.
  return aStart < bEnd && bStart < aEnd;
}
