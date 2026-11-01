export const NOW_MIN = 0;
export const NOW_MAX = 1439;
export const NOW_INVALID_REASON = "Current time must be a whole number from 0 to 1439.";

export interface NowValidation {
  valid: boolean;
  value: number | null;
  reason?: string;
}

export function validateNow(raw: string): NowValidation {
  const trimmed = raw.trim();
  if (trimmed === "" || !/^-?\d+$/.test(trimmed)) {
    return { valid: false, value: null, reason: NOW_INVALID_REASON };
  }
  const n = Number.parseInt(trimmed, 10);
  if (!Number.isInteger(n) || n < NOW_MIN || n > NOW_MAX) {
    return { valid: false, value: null, reason: NOW_INVALID_REASON };
  }
  return { valid: true, value: n };
}
