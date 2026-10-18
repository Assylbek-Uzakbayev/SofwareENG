import { useMemo, useState } from 'react';
import { ROOMS, describeRoom, formatBookings } from './data';
import { checkAvailability } from './checker';
import { hhmmToMinutes, minutesToHHMM } from './timeUtils';

const DEFAULT_CURRENT = 9 * 60 + 15; // 09:15 — fictional "now"

export default function App() {
  const [currentStr, setCurrentStr] = useState(minutesToHHMM(DEFAULT_CURRENT));
  const [roomId, setRoomId] = useState('');
  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState([]);

  const currentMinutes = useMemo(() => {
    const m = hhmmToMinutes(currentStr);
    return m == null ? DEFAULT_CURRENT : m;
  }, [currentStr]);

  const selectedRoom = ROOMS.find((r) => r.id === roomId) || null;

  function handleCheck(e) {
    e.preventDefault();
    const start = hhmmToMinutes(startStr);
    const end = hhmmToMinutes(endStr);
    const decision = checkAvailability({
      room: selectedRoom,
      start,
      end,
      currentMinutes,
    });
    setErrors(decision.available ? [] : decision.reasons);
    setResult(decision); // AC5: decision only, existing booking data untouched.
  }

  function handleReset() {
    setRoomId('');
    setStartStr('');
    setEndStr('');
    setResult(null);
    setErrors([]);
  }

  return (
    <main className="page">
      <header className="page-header">
        <h1 className="page-title">Smart Campus Room Availability Checker</h1>
        <p className="page-subtitle">
          Pick a room and a time range to see whether it&apos;s available. Uses fictional sample
          data for today. Checks never modify existing bookings.
        </p>
      </header>

      <section className="card" aria-label="Room availability check">
        <h2 className="section-title">Check a room</h2>

        <div className="current-time">
          Current time: <strong>{currentStr}</strong>
          <span className="field-hint"> (used to enforce &quot;start must be after now&quot;)</span>
        </div>

        <form className="form-grid" onSubmit={handleCheck} noValidate>
          <div className="field full-row">
            <label className="field-label" htmlFor="room">Room</label>
            <select
              id="room"
              value={roomId}
              onChange={(e) => {
                setRoomId(e.target.value);
                setResult(null);
                setErrors([]);
              }}
            >
              <option value="">Select a room…</option>
              {ROOMS.map((r) => (
                <option key={r.id} value={r.id}>
                  {describeRoom(r)}
                </option>
              ))}
            </select>
            {selectedRoom && (
              <span className="field-hint">Bookings: {formatBookings(selectedRoom)}</span>
            )}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="start">Start time</label>
            <input
              id="start"
              type="time"
              value={startStr}
              onChange={(e) => {
                setStartStr(e.target.value);
                setResult(null);
                setErrors([]);
              }}
            />
            <span className="field-hint">Must be after the current time.</span>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="end">End time</label>
            <input
              id="end"
              type="time"
              value={endStr}
              onChange={(e) => {
                setEndStr(e.target.value);
                setResult(null);
                setErrors([]);
              }}
            />
            <span className="field-hint">Max 120 minutes after start.</span>
          </div>

          <div className="actions full-row">
            <button type="submit" className="btn btn-primary">
              Check availability
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>

        {errors.length > 0 && (
          <ul className="errors" aria-live="polite">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        )}

        {result && errors.length === 0 && (
          <div
            className={`result ${result.available ? 'result-available' : 'result-unavailable'}`}
            role="status"
            aria-live="polite"
          >
            <div className="result-icon" aria-hidden="true">
              {result.available ? '✓' : '!'}
            </div>
            <div>
              <p className="result-title">
                {result.available ? 'Available' : 'Unavailable'}
              </p>
              <p className="result-detail">
                {selectedRoom ? selectedRoom.name : 'This room'}{' '}
                {startStr && endStr ? `from ${startStr} to ${endStr}` : ''}
                {result.available
                  ? ' is available for that interval.'
                  : ' cannot be booked for that interval.'}
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="card" aria-label="Rooms and current bookings">
        <h2 className="section-title">Rooms &amp; current bookings</h2>
        <ul className="room-list">
          {ROOMS.map((r) => (
            <li key={r.id} className={`room-item${r.blocked ? ' blocked' : ''}`}>
              <div>
                <div className="room-name">{r.name}</div>
                <div className="room-meta">
                  Seats {r.capacity} · {formatBookings(r)}
                </div>
              </div>
              <span className={`room-badge ${r.blocked ? 'blocked' : 'open'}`}>
                {r.blocked ? 'Blocked' : 'Open'}
              </span>
            </li>
          ))}
        </ul>
        <p className="note">
          Touching endpoints are allowed: a booking ending at 12:00 does not conflict with one
          starting at 12:00.
        </p>
      </section>
    </main>
  );
}
