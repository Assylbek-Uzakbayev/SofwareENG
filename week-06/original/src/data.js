import { minutesToHHMM } from './timeUtils';

// Fictional sample data only.
// blocked: room is out of service (AC3).
// bookings: array of { start, end } in minutes-of-day (existing bookings).
export const ROOMS = [
  {
    id: 'r1',
    name: 'Room 101 — CS Lab',
    capacity: 30,
    blocked: false,
    bookings: [
      { start: 9 * 60, end: 10 * 60, label: 'Intro to Algorithms' },
      { start: 13 * 60, end: 14 * 60 + 30, label: 'Faculty Meeting' },
    ],
  },
  {
    id: 'r2',
    name: 'Room 142 — Lecture Hall',
    capacity: 120,
    blocked: false,
    bookings: [
      { start: 11 * 60, end: 12 * 60, label: 'Open Lecture' },
    ],
  },
  {
    id: 'r3',
    name: 'Room 205 — Seminar Room',
    capacity: 18,
    blocked: true, // AC3: blocked room
    bookings: [
      { start: 10 * 60, end: 11 * 60, label: 'Maintenance Window' },
    ],
  },
  {
    id: 'r4',
    name: 'Room 310 — Project Studio',
    capacity: 24,
    blocked: false,
    bookings: [
      { start: 15 * 60, end: 16 * 60, label: 'Capstone Workshop' },
      { start: 16 * 60, end: 17 * 60, label: 'Study Group' },
    ],
  },
];

export function describeRoom(r) {
  return `${r.name} · seats ${r.capacity}${r.blocked ? ' · blocked' : ''}`;
}

export function formatBookings(room) {
  if (room.blocked) return 'Room is currently blocked.';
  if (!room.bookings.length) return 'No existing bookings today.';
  return room.bookings
    .map((b) => `${minutesToHHMM(b.start)}–${minutesToHHMM(b.end)}${b.label ? ` (${b.label})` : ''}`)
    .join(' · ');
}
