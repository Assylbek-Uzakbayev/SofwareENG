import { overlap } from './timeUtils';

const MAX_BOOKING_MINUTES = 120; // AC2
const DAY_END = 1440; // AC1

// Returns { available: boolean, reasons: string[] }.
// `currentMinutes` is the supplied current time in minutes-of-day.
// AC5: never mutates state — this is a pure check.
export function checkAvailability({ room, start, end, currentMinutes }) {
  const reasons = [];

  if (!room) {
    return { available: false, reasons: ['Please choose a room.'] };
  }

  // AC1: 0 <= start < end <= 1440 and start must be after the supplied current time.
  if (start == null || end == null) {
    return { available: false, reasons: ['Provide both a start and an end time.'] };
  }
  if (start < 0 || end > DAY_END) {
    reasons.push('Times must be within 00:00–24:00 (0–1440 minutes).');
  }
  if (!(start < end)) {
    reasons.push('Start time must be earlier than end time.');
  }
  if (start <= currentMinutes) {
    reasons.push('Start time must be after the current time.');
  }

  // AC3: room blocked.
  if (room.blocked) {
    reasons.push('This room is blocked and cannot be booked.');
  }

  // AC2: booking longer than 120 minutes.
  if (end - start > MAX_BOOKING_MINUTES) {
    reasons.push('Bookings cannot be longer than 120 minutes.');
  }

  // AC4: overlap with existing bookings (touching endpoints allowed).
  const overlapping = (room.bookings || []).filter((b) => overlap(start, end, b.start, b.end));
  if (overlapping.length) {
    reasons.push(
      'This interval overlaps an existing booking' +
        (overlapping[0].label ? ` (${overlapping[0].label})` : '') +
        '.',
    );
  }

  return { available: reasons.length === 0, reasons };
}
