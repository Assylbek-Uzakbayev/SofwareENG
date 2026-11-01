export interface Booking {
  start: number;
  end: number;
}

export type AvailabilityResult =
  | { available: true }
  | { available: false; reason: string };

export interface AvailabilityInput {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: ReadonlyArray<Booking>;
}

const MAX_DURATION = 120;
const MINUTE_MAX = 1440;

export function checkAvailability(input: AvailabilityInput): AvailabilityResult {
  const { start, end, now, blocked, bookings } = input;

  // AC1: integer minutes, 0 <= start < end <= 1440
  if (!Number.isInteger(start)) {
    return { available: false, reason: "Start time must be a whole number of minutes." };
  }
  if (!Number.isInteger(end)) {
    return { available: false, reason: "End time must be a whole number of minutes." };
  }
  if (start < 0) {
    return { available: false, reason: "Start time cannot be before 0." };
  }
  if (end > MINUTE_MAX) {
    return { available: false, reason: "End time cannot exceed 1440 (midnight)." };
  }
  if (start >= end) {
    return { available: false, reason: "Start time must be before end time." };
  }

  // AC1: start must be strictly after now
  if (start <= now) {
    return {
      available: false,
      reason: `Start time must be strictly after the current time (now = ${now}).`,
    };
  }

  // AC2: max duration 120, exactly 120 allowed
  const duration = end - start;
  if (duration > MAX_DURATION) {
    return {
      available: false,
      reason: `Duration is ${duration} minutes; the maximum is ${MAX_DURATION} minutes.`,
    };
  }

  // AC3: reject when blocked
  if (blocked) {
    return { available: false, reason: "This room is blocked and cannot be booked." };
  }

  // AC4: reject overlap with any existing booking.
  // Touching endpoints are allowed: start < booked_end && end > booked_start
  for (const b of bookings) {
    if (start < b.end && end > b.start) {
      return {
        available: false,
        reason: `Overlaps an existing booking (${b.start}–${b.end}).`,
      };
    }
  }

  return { available: true };
}
