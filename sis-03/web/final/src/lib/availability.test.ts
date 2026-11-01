import { checkAvailability, type Booking } from "./availability";
import { validateNow, NOW_INVALID_REASON } from "./nowValidation";

let failures = 0;
let runs = 0;

function formatBookings(bs: Booking[]): string {
  return "[" + bs.map((b) => `[${b.start},${b.end}]`).join(",") + "]";
}

function caseEq(
  name: string,
  input: { start: number; end: number; now: number; blocked: boolean; bookings: Booking[] },
  expectedAvailable: boolean,
  expectedReasonContains?: string
) {
  runs++;
  const result = checkAvailability(input);
  const ok =
    result.available === expectedAvailable &&
    (!expectedReasonContains ||
      (!result.available && result.reason.includes(expectedReasonContains)));
  if (!ok) {
    failures++;
    console.error(
      `FAIL ${name}: got available=${result.available}` +
        (!result.available ? ` reason="${result.reason}"` : "") +
        ` | input now=${input.now} start=${input.start} end=${input.end}` +
        ` blocked=${input.blocked} bookings=${formatBookings(input.bookings)}`
    );
  } else {
    console.log(
      `PASS ${name}: available=${result.available}` +
        (!result.available ? ` reason="${result.reason}"` : "")
    );
  }
}

function caseNow(
  name: string,
  raw: string,
  expectedValid: boolean,
  expectedValue: number | null
) {
  runs++;
  const r = validateNow(raw);
  const ok = r.valid === expectedValid && r.value === expectedValue &&
    (!expectedValid || r.reason === undefined) &&
    (expectedValid || r.reason === NOW_INVALID_REASON);
  if (!ok) {
    failures++;
    console.error(
      `FAIL ${name}: got valid=${r.valid} value=${r.value} reason="${r.reason ?? ""}" | input="${raw}"`
    );
  } else {
    console.log(`PASS ${name}: valid=${r.valid} value=${r.value} | input="${raw}"`);
  }
}

const BASE_BOOKINGS: Booking[] = [{ start: 600, end: 660 }];

// T1: 660–720 => Available (touching end of booking 600–660)
caseEq("T1 touching-end available", { start: 660, end: 720, now: 540, blocked: false, bookings: BASE_BOOKINGS }, true);

// T2: 630–690 => Unavailable (overlaps 600–660)
caseEq("T2 overlap unavailable", { start: 630, end: 690, now: 540, blocked: false, bookings: BASE_BOOKINGS }, false, "Overlaps");

// T3: 660–720, blocked => Unavailable (blocked)
caseEq("T3 blocked unavailable", { start: 660, end: 720, now: 540, blocked: true, bookings: BASE_BOOKINGS }, false, "blocked");

// T4: 720–840 => Available (exactly 120 min)
caseEq("T4 120min available", { start: 720, end: 840, now: 540, blocked: false, bookings: BASE_BOOKINGS }, true);

// T5: 720–841 => Unavailable (121 min)
caseEq("T5 121min unavailable", { start: 720, end: 841, now: 540, blocked: false, bookings: BASE_BOOKINGS }, false, "Duration");

// T6: 540–570 => Unavailable (start not strictly after now)
caseEq("T6 start-equals-now unavailable", { start: 540, end: 570, now: 540, blocked: false, bookings: BASE_BOOKINGS }, false, "strictly after");

// T7: 720–660 => Unavailable (reversed)
caseEq("T7 reversed unavailable", { start: 720, end: 660, now: 540, blocked: false, bookings: BASE_BOOKINGS }, false, "before");

// T8: 1380–1440 => Available (midnight upper bound)
caseEq("T8 midnight-upper available", { start: 1380, end: 1440, now: 540, blocked: false, bookings: BASE_BOOKINGS }, true);

// T9: 1380–1441 => Unavailable (end > 1440, still a valid integer)
caseEq("T9 beyond-midnight unavailable", { start: 1380, end: 1441, now: 540, blocked: false, bookings: BASE_BOOKINGS }, false, "1440");

// T10: 720–780, add booking [700,760] => Unavailable
caseEq("T10 second-booking overlap unavailable", { start: 720, end: 780, now: 540, blocked: false, bookings: [BASE_BOOKINGS[0], { start: 700, end: 760 }] }, false, "Overlaps");

// T11: 660–720 checked twice => Available both times, bookings unchanged
(function () {
  runs++;
  const bookings: Booking[] = [{ start: 600, end: 660 }];
  const snapshot: string = formatBookings(bookings);
  const r1 = checkAvailability({ start: 660, end: 720, now: 540, blocked: false, bookings });
  const r2 = checkAvailability({ start: 660, end: 720, now: 540, blocked: false, bookings });
  const ok = r1.available && r2.available && formatBookings(bookings) === snapshot;
  if (!ok) {
    failures++;
    console.error(
      `FAIL T11 repeated-check: r1=${r1.available} r2=${r2.available} bookings=${formatBookings(bookings)} snapshot=${snapshot}`
    );
  } else {
    console.log(`PASS T11 repeated-check: available both times, bookings unchanged (${snapshot})`);
  }
})();

// --- now validation tests ---
caseNow("now-blank invalid", "", false, null);
caseNow("now-abc invalid", "abc", false, null);
caseNow("now-negative invalid", "-1", false, null);
caseNow("now-1440 invalid", "1440", false, null);

// now=0 with start=1, end=60 => Available
caseEq("now0 available", { start: 1, end: 60, now: 0, blocked: false, bookings: BASE_BOOKINGS }, true);

// now=1439 with start=1440, end=1440 => Unavailable (start >= end, no valid later interval)
caseEq("now1439 no-valid-interval unavailable", { start: 1440, end: 1440, now: 1439, blocked: false, bookings: BASE_BOOKINGS }, false, "before");

// now=1439 valid boundary
caseNow("now-1439 valid", "1439", true, 1439);
// now=0 valid boundary
caseNow("now-0 valid", "0", true, 0);

// --- extra coverage ---
caseEq("Extra touching-start available", { start: 500, end: 600, now: 400, blocked: false, bookings: BASE_BOOKINGS }, true);
caseEq("Extra start-before-now unavailable", { start: 500, end: 570, now: 540, blocked: false, bookings: BASE_BOOKINGS }, false, "strictly after");
caseEq("Extra midnight-lower unavailable", { start: 0, end: 60, now: 540, blocked: false, bookings: BASE_BOOKINGS }, false, "strictly after");

console.log(`\n${runs - failures}/${runs} checks passed, ${failures} failed.`);
if (failures > 0) {
  process.exit(1);
}
