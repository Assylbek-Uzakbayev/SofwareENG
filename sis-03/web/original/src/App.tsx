import { useEffect, useState } from "react";
import { Building2, Clock, CheckCircle2, XCircle, Ban, CalendarDays } from "lucide-react";
import { checkAvailability, type AvailabilityResult, type Booking } from "@/lib/availability";

const DEFAULT_NOW = 540;
const DEFAULT_BOOKINGS: Booking[] = [{ start: 600, end: 660 }];
const SECOND_BOOKING: Booking = { start: 700, end: 760 };
const ROOM_NAME = "Engineering Hall 204B";

function parseInput(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  // integer only (optional leading sign)
  if (!/^-?\d+$/.test(trimmed)) return null;
  return Number.parseInt(trimmed, 10);
}

function formatMinutes(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
}

function App() {
  const [nowInput, setNowInput] = useState("540");
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [addSecondBooking, setAddSecondBooking] = useState(false);
  const [result, setResult] = useState<AvailabilityResult | null>(null);

  const now = parseInput(nowInput) ?? DEFAULT_NOW;
  const bookings: Booking[] = addSecondBooking
    ? [...DEFAULT_BOOKINGS, SECOND_BOOKING]
    : [...DEFAULT_BOOKINGS];

  // AC6: clear any old result when inputs or scenario settings change
  useEffect(() => {
    setResult(null);
  }, [nowInput, startInput, endInput, blocked, addSecondBooking]);

  function handleCheck(): void {
    const start = parseInput(startInput);
    const end = parseInput(endInput);

    if (start === null || end === null) {
      setResult({
        available: false,
        reason: "Please enter whole numbers for start and end minutes.",
      });
      return;
    }

    const res = checkAvailability({ start, end, now, blocked, bookings });
    setResult(res);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-[480px] px-4 py-6 sm:py-10">
        {/* Header */}
        <header className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <Building2 className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">Room Availability Checker</h1>
            <p className="text-sm text-slate-500">Check a time window — no booking is created.</p>
          </div>
        </header>

        {/* Room card */}
        <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-700">
            <CalendarDays className="h-5 w-5 text-emerald-600" aria-hidden />
            <span className="text-sm font-medium">Selected room</span>
          </div>
          <p className="mt-1 text-base font-semibold text-slate-900">{ROOM_NAME}</p>
        </section>

        {/* Scenario controls */}
        <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Clock className="h-4 w-4 text-slate-400" aria-hidden />
            Scenario controls
          </h2>

          <label htmlFor="now" className="mb-1 block text-sm font-medium text-slate-700">
            Current time (now, in minutes)
          </label>
          <input
            id="now"
            type="text"
            inputMode="numeric"
            value={nowInput}
            onChange={(e) => setNowInput(e.target.value)}
            className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            placeholder="540"
            aria-label="Current time in minutes"
          />

          <div className="flex items-center gap-2">
            <input
              id="blocked"
              type="checkbox"
              checked={blocked}
              onChange={(e) => setBlocked(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="blocked" className="text-sm text-slate-700">
              Block the room (maintenance)
            </label>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              id="second"
              type="checkbox"
              checked={addSecondBooking}
              onChange={(e) => setAddSecondBooking(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="second" className="text-sm text-slate-700">
              Add a second booking (700–760)
            </label>
          </div>
        </section>

        {/* Request */}
        <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Check a time window</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="start" className="mb-1 block text-sm font-medium text-slate-700">
                Start (min)
              </label>
              <input
                id="start"
                type="text"
                inputMode="numeric"
                value={startInput}
                onChange={(e) => setStartInput(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                placeholder="660"
                aria-label="Start time in minutes"
              />
            </div>
            <div>
              <label htmlFor="end" className="mb-1 block text-sm font-medium text-slate-700">
                End (min)
              </label>
              <input
                id="end"
                type="text"
                inputMode="numeric"
                value={endInput}
                onChange={(e) => setEndInput(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                placeholder="720"
                aria-label="End time in minutes"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleCheck}
            className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            Check availability
          </button>
        </section>

        {/* Result */}
        {result && (
          <section className="mb-4 rounded-2xl border p-4 shadow-sm" 
            style={result.available
              ? { borderColor: "#a7f3d0", backgroundColor: "#ecfdf5" }
              : { borderColor: "#fecaca", backgroundColor: "#fef2f2" }}>
            <div className="flex items-start gap-3">
              {result.available ? (
                <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-emerald-600" aria-hidden />
              ) : (
                <XCircle className="h-6 w-6 flex-shrink-0 text-red-600" aria-hidden />
              )}
              <div>
                <p className={result.available ? "text-base font-semibold text-emerald-800" : "text-base font-semibold text-red-800"}>
                  {result.available ? "Available" : "Unavailable"}
                </p>
                {!result.available && (
                  <p className="mt-1 text-sm text-red-700">{result.reason}</p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Current state readout */}
        <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Current scenario</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Now</dt>
              <dd className="font-medium text-slate-900">{now} ({formatMinutes(now)})</dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-slate-500">Blocked</dt>
              <dd className="font-medium text-slate-900">{blocked ? "Yes" : "No"}</dd>
            </div>
            <div>
              <dt className="mb-1 flex items-center gap-1.5 text-slate-500">
                <Ban className="h-3.5 w-3.5" aria-hidden />
                Existing bookings
              </dt>
              <dd>
                <ul className="space-y-1">
                  {bookings.map((b, i) => (
                    <li key={i} className="rounded-md bg-slate-50 px-2.5 py-1.5 font-medium text-slate-800">
                      {b.start}–{b.end} <span className="text-slate-400">({formatMinutes(b.start)}–{formatMinutes(b.end)})</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </section>

        <p className="px-1 text-center text-xs text-slate-400">
          Fictional data only. Checking never creates or modifies a booking.
        </p>
      </div>
    </div>
  );
}

export default App;
