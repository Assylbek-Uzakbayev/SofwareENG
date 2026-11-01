# SIS #03 — Report: Smart Campus Room Availability Checker

## 1. Setup and reuse

**Preparation status:** Python generated with Codex; fresh web v1 and final exported from Bolt.new by the student. The original and final T1 were visually observed in student screenshots. Other web cases have executed logic tests, not browser observations. Before/after repair screenshots were skipped at the student’s request. T12, the student reflection, GitHub submission remain incomplete.

| Item | Value |
| --- | --- |
| Coding assistant (tool) | ChatGPT Work / Codex |
| Coding assistant model | not displayed |
| Bolt.new model | not displayed |
| Bolt project link | not-shared |
| Language | Python |
| Path | A |
| Python v1 from | fresh |
| Web v1 from | fresh |

Student: Uzakbayev Assylbek. GitHub username: Assylbek-Uzakbayev. Student ID: 24B032082. Group: MON 16-00.

## 2. Baseline — before any new AI exchange

**Provenance:** The following is an AI-assisted technical draft produced after the student's request. It is NOT a student-authored pre-AI baseline. No earlier commit or push is claimed. Rewriting it now does not establish the original required chronology.

### 2.1 Scope in my own words

**Scope:** This draft describes a single-room availability checker using fictional existing bookings. It returns an availability decision without creating, confirming or storing a booking.

### 2.2 The acceptance criteria in my own words

| AC | Technical draft for student review |
| --- | --- |
| AC1 | Start and end are integer minutes, 0 ≤ start < end ≤ 1440, and start is strictly after now. |
| AC2 | Duration is at most 120 minutes, including exactly 120. |
| AC3 | A blocked room rejects every request. |
| AC4 | Any intersection with an existing half-open interval is rejected; touching endpoints are permitted. |
| AC5 | Show Available or Unavailable and leave existing bookings unchanged. |
| AC6 | Explain invalid requests and keep the layout usable on narrow screens. |

### 2.3 Likely failure points

| # | Failure point | AC | How to check it |
| --- | --- | --- | --- |
| 1 | Using inclusive overlap rejects adjacent bookings | AC4 | T1 and test_touching_before |
| 2 | Accepting start equal to now | AC1 | T6 |
| 3 | Showing a stale decision after editing inputs | AC5, AC6 | Submit 660–720, then edit start without submitting |

### 2.4 The contract

| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | Requested beginning | Integer minute, 0–1439; strictly after now |
| `end` | Requested exclusive end | Integer minute, start < end ≤ 1440 |
| `now` | Current minute | Valid integer 0–1439, assumed by the contract |
| `blocked` | Room unavailable flag | Boolean |
| `existing` | Existing half-open bookings | Collection of valid integer (start, end) pairs |
| returns | Whether all AC1–AC4 conditions hold | Boolean; never changes existing |

### 2.5 Initial assumptions and manual checks

**Assumptions:**

1. All intervals are on the same day; overnight requests are outside scope.
2. Existing bookings and now are valid; the Python function does not repair malformed booking data.

**Checked manually:**

- The student supplied original and final T1 screenshots showing 660–720 as Available with now=540 and booking 600–660. Other manual browser checks have not been reported. This observation occurred after AI generation, not before it.

## 3. Python v1 review

The first generated implementation is preserved unchanged. The final is identical because the observed tests found no contract defect.

| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| `type(start) is not int or type(end) is not int` | AC1 | Yes | Rejects floats, strings and booleans rather than coercing them. |
| `not (0 <= start < end <= 1440)` | AC1 | Yes | Enforces ordering and both day bounds. |
| `start <= now` | AC1 | Yes | Rejects starts-now and past starts. |
| `end - start > 120` | AC2 | Yes | Exactly 120 is accepted. |
| `blocked` | AC3 | Yes | Rejects blocked rooms before any success return. |
| `start < booked_end and end > booked_start` | AC4 | Yes | Strict inequalities allow touching endpoints; checks every booking. |

## 4. Prototype v1 in Bolt.new

**Provenance:** Fresh Bolt.new React/TypeScript/Tailwind/Vite project. The student supplied the first export as project-bolt-sb1-pmbybvcv.zip and the repaired export as project-bolt-sb1-pmbybvcv (1).zip. Both source trees are copied unchanged; original is preserved in web/original and final in web/final. No Week 06 work was reused. Bolt model and project share URL were not supplied.

The initial Bolt Plan message establishes all fixed criteria and exclusions.

**Prompt as sent:**

~~~~text
Plan a single-page “Smart Campus Room Availability Checker”.
Do not generate code yet. Give a short implementation plan,
assumptions and boundary tests for these fixed requirements:

AC1: Start and end are integer minutes:
0 <= start < end <= 1440. Start must be strictly after now.
AC2: Maximum duration is 120 minutes; exactly 120 is allowed.
AC3: Reject every request when the room is blocked.
AC4: Reject overlap with ANY existing booking.
Touching endpoints are allowed:
start < booked_end && end > booked_start means overlap.
AC5: Show “Available” or “Unavailable”.
Never modify existing bookings or create/confirm a booking.
AC6: Explain validation failures and support a usable
375px mobile layout.

One selected room, fictional data only.
Exclude login, backend, database, external APIs,
payments, storage and analytics.

Use numeric minute inputs so 1440 and 1441 can be tested.
Default now = 540, existing = [(600, 660)].
Provide fictional scenario controls for now, blocked,
and an optional second booking (700, 760).

Plan tests for touching, overlap, blocked, 120/121 minutes,
starts-now, reversed times, midnight bounds, a second booking,
repeated checks without mutation, and mobile width.
~~~~

The actual follow-up Generate message:

~~~~text
Proceed to implementation. I approve the plan with these corrections:

1. 1441 is a valid integer. Reject it in the range check because
end must be <= 1440, not in the integer check.

2. Your test 17 has an incorrect expectation:
700–760 with the second booking enabled overlaps [700,760],
so both checks must return Unavailable.
For the required repeated-check case, use start=660, end=720,
now=540, blocked=false, existing=[[600,660]], second booking OFF.
Both checks must return Available and leave bookings unchanged.

3. A check counter does not prove that bookings are unchanged.
Keep validation pure and verify the bookings contents before
and after repeated checks.

Build the first implementation now using React, TypeScript,
Tailwind and Vite. Keep AC1–AC6 and all stated exclusions.
Do not add login, backend, database, storage or booking creation.
Clear any old result when request inputs or scenario settings change.

The required cases, with now=540, blocked=false and
existing=[[600,660]] unless overridden, are:
T1: 660–720 => Available
T2: 630–690 => Unavailable
T3: 660–720, blocked=true => Unavailable
T4: 720–840 => Available
T5: 720–841 => Unavailable
T6: 540–570 => Unavailable
T7: 720–660 => Unavailable
T8: 1380–1440 => Available
T9: 1380–1441 => Unavailable
T10: 720–780, add booking [700,760] => Unavailable
T11: 660–720 checked twice => Available both times, unchanged bookings
T12: T1 at 375px width => Available, usable layout without overflow.

After building, summarize the generated files.
Only claim tests passed if you actually executed them.
~~~~

Both were consecutive messages in the same Bolt project; the complete replies are in section 11.

| Generated file or component | Path | Its role |
| --- | --- | --- |
| Pure availability checker | `src/lib/availability.ts` | Validates integer time, bounds, future start, duration, blocked state and overlap |
| Main interface | `src/App.tsx` | Scenario controls, request inputs, result, and fictional booking list |
| Logic suite | `src/lib/availability.test.ts` | T1–T11 and additional boundary cases; no rendered T12 test |

**What v1 does:**

- Displays one fictional room, Engineering Hall 204B, and checks requested minutes against in-memory bookings.
- T1 screenshot shows Available. Assistant executed its 14 logic checks successfully. Bolt reported a clean typecheck and successful build; those two commands were not independently rerun here.
- The now control silently substitutes 540 for invalid/empty text and accepts out-of-range now values. Its package manifest contains an unused backend client; result markup has no live status region. These were corrected in final.

## 5. Test cases — executed on both artifacts



| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | True | True | Available | Available |
| T2 | Overlap | 630–690 | Unavailable | False | False | Not executed in browser | Not executed in browser |
| T3 | Blocked | 660–720, blocked | Unavailable | False | False | Not executed in browser | Not executed in browser |
| T4 | Exactly 120 min | 720–840 | Available | True | True | Not executed in browser | Not executed in browser |
| T5 | 121 min | 720–841 | Unavailable | False | False | Not executed in browser | Not executed in browser |
| T6 | Starts now | 540–570 | Unavailable | False | False | Not executed in browser | Not executed in browser |
| T7 | Reversed | 720–660 | Unavailable | False | False | Not executed in browser | Not executed in browser |
| T8 | Ends at midnight | 1380–1440 | Available | True | True | Not executed in browser | Not executed in browser |
| T9 | Past midnight | 1380–1441 | Unavailable | False | False | Not executed in browser | Not executed in browser |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | False | False | Not executed in browser | Not executed in browser |
| T11 | Same check twice | 660–720, twice | Available | True | True | Not executed in browser | Not executed in browser |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | Not executed | Not executed |


Python T1–T11 were executed by the supplied checker. The assistant separately executed the actual Bolt TypeScript logic suites with Node 24: v1 14/14; final 22/22. Only extensionless relative imports in temporary test copies were changed to .ts so Node could load them; exported source was not edited. These are function tests, not page/browser tests. The student screenshots confirm T1 in both versions; T2–T12 page observations are missing. No mobile or screen-reader test is claimed.

**Screenshot observation:** T1 was visually observed in both versions: the original capture `evidence/web-v1.png` and the final capture `evidence/final-t1.png` show 660–720, now=540, blocked=No, booking 600–660, and Available. These captures do not establish a 375px viewport. Before/after screenshots for the now-validation repair were skipped at the student's request.

## 6. Traceability

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | code/booking.py; src/lib/availability.ts; final nowValidation.ts | T6–T9; now invalid/boundaries | Reject invalid candidate; allow end=1440; valid scenario now 0–1439 | Core cases match; invalid now silently defaults or falls outside contract | Core cases match; now helper rejects blank, abc, -1 and 1440 |
| AC2 | duration guard in both core functions | T4–T5 | Allow 120; reject 121 | Python and TS: True / False | Python and TS: True / False |
| AC3 | blocked guard in both core functions | T3 | Reject | Python False; TS available=false | Python False; TS available=false |
| AC4 | strict interval intersection in both core functions | T1, T2, T10 | Allow touching; reject overlap | Logic matches; T1 screenshot Available | Logic matches; T1 screenshot Available |
| AC5 | pure core; App result text | T11; unchanged-input suite | Repeat same result and preserve data | Repeated core calls pass, unchanged bookings | Repeated core calls pass, unchanged bookings |
| AC6 | App.tsx; nowValidation.ts; responsive Tailwind classes | invalid now, T12 | Clear feedback, accessible result, usable at 375px | Source: silent now fallback and no live-region attributes; T12 not run | Invalid helper inputs rejected; source adds status/live attributes; T12 not run |

## 7. Issue log

Findings were independently checked against the exported v1. Repair instructions were sent to Bolt; the student supplied the resulting final ZIP and complete reply. Full focused prompt is in exchange B4.

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | Invalid scenario now is silently replaced or accepted | AC6: blank/abc becomes 540; -1 and 1440 pass parseInput; actual extracted v1 parser run reproduced these values | Medium | Reject invalid now before calling core; enforce 0–1439; remove silent fallback; display Invalid in scenario readout | Final 22/22 suite passes, including blank/abc/-1/1440 helper rejection and valid 0/1439 boundaries; App source checks validity first; browser invalid-now test not run |
| 2 | Unused backend client in dependency manifests | AC5/scope audit: package.json lists @supabase/supabase-js; source imports do not use it or perform booking writes | Low | Remove that exact unused dependency and update the lockfile, without a replacement | No matching client dependency/reference remains in final package.json or package-lock.json; runtime integration was absent already |
| 3 | Dynamic result has no live status semantics | AC6: conditionally rendered result section has no role=status or aria-live | Medium | Keep a status container persistently mounted with role=status, aria-live=polite, aria-atomic=true; preserve reset behavior | Confirmed final source attributes and persistent container; screen-reader behavior not tested |

**Before / after:** Issue 1 repair screenshots `evidence/before-1.png` and `evidence/after-1.png` were intentionally skipped at the student’s request. No replacements or fabricated screenshots are supplied. The T1 captures show original/final behavior but do not illustrate the invalid-now repair.

## 8. Critique decisions

The complete Bolt critique is in B3 and the corrected repair instructions are in B4. Decisions below are evidenced by those repair instructions; the assistant helped formulate them. They are not presented as unaided student review.

| # | AI claim or recommendation | How verified | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | Validate now using 0–1440 inclusive | Compared with README assumption now=0–1439 and actual v1 parser output | modify | Repair uses 0–1439; scenario guard supports AC6 without changing the core contract |
| 2 | Unused client necessarily adds about 152 KB to the bundle | Confirmed unused manifest entry and no source integration; no bundle measurement supports that size claim | reject | Remove unused dependency for scope/dependency hygiene; do not assert unmeasured bundle overhead |
| 3 | Add status/live attributes directly to conditional result | Source inspection showed the container was conditionally mounted | modify | Persistently mounted role=status, polite and atomic region; source-level AC6 improvement; screen-reader test still missing |
| 4 | Plan repeat case 700–760 with second booking enabled is Available | Compared overlap formula with existing interval 700–760 | reject | AC4: it overlaps; required T11 instead uses 660–720 and second booking disabled |

The critique and repair reply incorrectly name the dependency @supabase/Bolt Database-js. That text is preserved in the transcript as received; the actual original package was @supabase/supabase-js, confirmed in the ZIP. The final manifests remove the actual package.

## 9. Coding-agent analysis

### 9.1 The loop

| Step | What happened in this assignment |
| --- | --- |
| User goal | Build and verify one fictional campus room availability checker |
| Model / plan | Bolt proposed validation order and boundaries; assistant identified an incorrect overlap expectation and integer/range distinction |
| Tool call | Student prompted Bolt to generate, downloaded v1, sent critique and focused repair instructions, then exported final; assistant inspected files and ran actual TS suites |
| Observation | V1 had 14/14 green core tests yet its now control accepted invalid scenario state; critique proposed the wrong upper bound 1440 |
| Next step | Repair kept the core unchanged, validated scenario now in 0–1439, removed unused client, and added a persistent status region; final suite 22/22 |
| Human review | Student preserved both exports and supplied T1 screenshots; personally reviewing remaining cases, reflection and submission is still pending |

### 9.2 Context, tools and permissions

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| Codex | Attached brief, starter files, exported Bolt source, student-pasted transcripts | Local file reads/writes, Python and Node execution | Observed |
| Bolt.new | Project and requested AC1–AC6, critique and repair prompts | File edits, dependency removal, test/typecheck/build actions reported in pasted replies | Observed through student-provided replies and resulting exports; individual terminal logs not supplied |
| Python and Node | Actual source and fixed test cases | Local processes; no application network connection required for logic tests | Observed |
| Bolt internals | Conversation and project state | Internal model reasoning, sandbox isolation and hidden services cannot be inspected from an export | Assumed |
| Browser | Student T1 screenshots in original and final | Screenshot captures are observed; exact viewport width and other page cases are unknown | Observed |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** Before accepting a repair, compare its boundary values with the fixed contract and inspect source imports and manifests. Preserve the first export unchanged. Confirm that removing a package introduces no replacement backend, and distinguish source-level accessibility improvements from screen-reader tests that have not been performed.

**Reliability, security, responsibility:** Green core tests did not reveal the scenario-control gap; the additional now validator and boundary tests improve reliability. Removing an unused client simplifies dependency scope, but no vulnerability or bundle-size reduction was measured. The application remains local, fictional and read-only. Human responsibility includes checking AI recommendations against the brief, refusing incorrect bounds and unsupported assertions, managing tool permissions, testing the actual interface and disclosing incomplete evidence. Screenshot gaps, the unverified mobile viewport, missing pre-AI baseline chronology and unfinished personal reflection cannot be replaced by checker success.

## 10. Reflection

**Student-authored reflection pending.** Write 100–200 words after performing the remaining work. Cover: Python assistance versus Bolt vibe coding; one reliability risk; one availability/usability risk; one security risk; human responsibility for review, permissions and tests; one recommendation you personally rejected or modified; one improvement that stays within scope. This package does not claim that the assistant's words are your personal reflection.

## 11. Appendix A — AI exchanges

The initial Codex request/reply is preserved as preparation context; the generated Python v1 was written by the assistant through a tool action, not pasted into its prose reply. B1–B4 record the Bolt Plan, Generate, Critique and Repair sequence supplied by the student. Prompts are those provided in this conversation for the Bolt workflow; the student pasted the full Plan/Generate/Critique/Repair responses. UI action counters are retained as pasted; tabular whitespace was normalized. No hidden file-edit transcripts or terminal outputs have been invented.

### Coding assistant preparation context

- **Tool:** ChatGPT Work / Codex
- **Model:** not displayed
- **Date:** 2026-11-01
- **Stage:** Generate
- **Source:** this SIS

**Prompt:**

~~~~text
жок маган 100 пайыз дайын кылып жасап бершы мен гитхабка сала салайын
~~~~

**Response:**

~~~~text
Бро, кодын, сайтты, тесттерін және есептің техникалық бөлімдерін дайындап, ZIP қылып беремін. Тесттерді өзім іске қосамын.

Бірақ «100% талапқа сай» деу үшін Bolt.new-дан шыққан жоба керек: жергілікті жасаған сайтты Bolt жасады деп көрсете алмаймын. Baseline мен reflection да тапсырма бойынша өз сөзіңмен жазылуы тиіс — сол жерлерді анық белгілеймін.
~~~~

The first generated Python source below was written by the assistant in its tool action during this same exchange; it was not part of the prose reply.

~~~~python
"""Pure availability check using half-open minute intervals."""


def can_book(start, end, now, blocked, existing):
    """Return availability without modifying existing bookings."""
    if type(start) is not int or type(end) is not int:
        return False
    if not (0 <= start < end <= 1440):
        return False
    if start <= now:
        return False
    if end - start > 120:
        return False
    if blocked:
        return False
    for booked_start, booked_end in existing:
        if start < booked_end and end > booked_start:
            return False
    return True
~~~~

### B1

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 2026-11-01
- **Stage:** Plan
- **Source:** this SIS

**Prompt:**

~~~~text
Plan a single-page “Smart Campus Room Availability Checker”.
Do not generate code yet. Give a short implementation plan,
assumptions and boundary tests for these fixed requirements:

AC1: Start and end are integer minutes:
0 <= start < end <= 1440. Start must be strictly after now.
AC2: Maximum duration is 120 minutes; exactly 120 is allowed.
AC3: Reject every request when the room is blocked.
AC4: Reject overlap with ANY existing booking.
Touching endpoints are allowed:
start < booked_end && end > booked_start means overlap.
AC5: Show “Available” or “Unavailable”.
Never modify existing bookings or create/confirm a booking.
AC6: Explain validation failures and support a usable
375px mobile layout.

One selected room, fictional data only.
Exclude login, backend, database, external APIs,
payments, storage and analytics.

Use numeric minute inputs so 1440 and 1441 can be tested.
Default now = 540, existing = [(600, 660)].
Provide fictional scenario controls for now, blocked,
and an optional second booking (700, 760).

Plan tests for touching, overlap, blocked, 120/121 minutes,
starts-now, reversed times, midnight bounds, a second booking,
repeated checks without mutation, and mobile width.
~~~~

**Response:**

~~~~text
Smart Campus Room Availability Checker — Implementation Plan
Overview
A single-page React app (TypeScript + Tailwind + Vite) that lets a user check whether one fictional campus room is available for a requested time window expressed in integer minutes. It performs pure in-memory validation against a fictional dataset and reports Available or Unavailable with a reason. No booking is ever created, persisted, or confirmed.

Architecture (single component, pure logic)
State (all in-memory, ephemeral):

now (number, default 540)
start / end (string inputs → parsed to numbers; strings so 1441, blanks, leading zeros are testable)
existingBookings (array of [start, end] tuples, default [[600, 660]])
blocked (boolean, default false)
optional second booking toggle (adds [700, 760])
result ({ available: boolean, reason: string } | null)
checkCount (proves no mutation: increments on each check, bookings array stays identical)
Validation pipeline (returns first failure, short-circuits):

Integer check — start/end parse to integers (reject 1441, blanks, non-numeric).
Range check — 0 <= start < end <= 1440.
Future check — start > now (strictly after now).
Duration check — end - start <= 120 (exactly 120 passes).
Blocked check — if blocked === true, reject unconditionally.
Overlap check — for each [bs, be] in bookings: overlap if start < be && end > bs. Touching (start === be or end === bs) is not overlap.
Only if all pass → { available: true }.

Assumptions
No persistence. Reloading resets everything to defaults. Bolt Database is intentionally excluded per requirements.
Fictional data only. Room name is a constant (e.g., "Room: Engineering Hall 204B"). No real rooms, users, or schedules.
now is a controllable scenario variable, not wall-clock time. This keeps "start must be strictly after now" deterministic and testable.
Touching endpoints allowed. A request ending exactly when a booking starts (or vice versa) is Available.
Inputs are raw minute integers (0–1440), not clock strings, so boundary values like 1440 and 1441 are directly testable.
Validation failures are explained in plain language ("End time must be after start time", "Duration exceeds the 120-minute maximum", "Room is blocked for maintenance", "Overlaps an existing booking from 600–660").
No booking mutation. The check is read-only; the bookings list is never modified by a check. A counter + snapshot display prove this.
UI Layout (mobile-first, 375px usable)
Stacked single column, max-width ~480px, centered. All controls full-width.
Scenario controls card: numeric now input, "Block room" toggle, "Add second booking (700–760)" toggle.
Request card: numeric start and end inputs (raw integers), "Check availability" button.
Result banner: green "Available" / red "Unavailable" + reason text. Empty state until first check.
Current state readout: shows now, blocked, bookings list, and check count — so users see nothing mutates.
All labels, inputs, and buttons sized for touch; no horizontal scroll at 375px; font ≥16px to prevent iOS zoom.
Boundary / Test Cases
# Scenario now start end blocked 2nd booking Expected
1 Touching start of booking 540 540 invalid→ use 541 600 no no Available (ends at booking start)
2 Touching end of booking 540 660 700 no no Available (starts at booking end)
3 Overlap inside booking 540 610 620 no no Unavailable: overlaps
4 Overlap partial 540 590 630 no no Unavailable: overlaps
5 Blocked room 540 700 760 yes no Unavailable: blocked
6 Blocked + otherwise valid 540 800 900 yes no Unavailable: blocked (blocked checked before overlap)
7 Exactly 120 min 540 700 820 no no Available
8 121 min 540 700 821 no no Unavailable: duration > 120
9 Start equals now (not strictly after) 540 540 600 no no Unavailable: must be after now
10 Start before now 540 500 600 no no Unavailable: must be after now
11 Reversed times (end < start) 540 700 650 no no Unavailable: end must exceed start
12 Midnight lower bound (start=0) 540 0 60 no no Unavailable: must be after now (0 < 540)
13 Midnight upper bound (end=1440) 540 1380 1440 no no Available (duration 60)
14 Beyond midnight (end=1441) 540 1380 1441 no no Unavailable: end > 1440
15 Second booking overlap 540 750 770 no yes Unavailable: overlaps 700–760
16 Between two bookings 540 661 699 no yes Available (fits gap)
17 Repeat checks, no mutation 540 700 760 no yes Available both times; bookings array unchanged; checkCount increments
18 Mobile width 375px — — — — — No horizontal scroll; all controls usable; result readable
Out of scope (explicitly excluded)
Login, backend, database, Bolt Database, external APIs, payments, storage, analytics, real time, multiple rooms, booking creation/confirmation/modification.

This is a pure in-memory single-component checker with deterministic fictional scenarios. Want me to proceed to implementation, or adjust any assumptions (e.g., blocked-before-overlap ordering, room name, default values) first?
~~~~

### B2

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 2026-11-01
- **Stage:** Generate
- **Source:** this SIS

**Prompt:**

~~~~text
Proceed to implementation. I approve the plan with these corrections:

1. 1441 is a valid integer. Reject it in the range check because
end must be <= 1440, not in the integer check.

2. Your test 17 has an incorrect expectation:
700–760 with the second booking enabled overlaps [700,760],
so both checks must return Unavailable.
For the required repeated-check case, use start=660, end=720,
now=540, blocked=false, existing=[[600,660]], second booking OFF.
Both checks must return Available and leave bookings unchanged.

3. A check counter does not prove that bookings are unchanged.
Keep validation pure and verify the bookings contents before
and after repeated checks.

Build the first implementation now using React, TypeScript,
Tailwind and Vite. Keep AC1–AC6 and all stated exclusions.
Do not add login, backend, database, storage or booking creation.
Clear any old result when request inputs or scenario settings change.

The required cases, with now=540, blocked=false and
existing=[[600,660]] unless overridden, are:
T1: 660–720 => Available
T2: 630–690 => Unavailable
T3: 660–720, blocked=true => Unavailable
T4: 720–840 => Available
T5: 720–841 => Unavailable
T6: 540–570 => Unavailable
T7: 720–660 => Unavailable
T8: 1380–1440 => Available
T9: 1380–1441 => Unavailable
T10: 720–780, add booking [700,760] => Unavailable
T11: 660–720 checked twice => Available both times, unchanged bookings
T12: T1 at 375px width => Available, usable layout without overflow.

After building, summarize the generated files.
Only claim tests passed if you actually executed them.
~~~~

**Response:**

~~~~text
Thoughts
I'll start by reading the existing project files to match conventions, then implement the checker.


0123456789
files read
Now I have the conventions. I'll set up the validation logic, component, and tests. Let me create the pure validation module, the App component, and a test file.


0123456789
actions taken
Now the main App component:


Wrote
src/App.tsx
Now let me run the test suite and build to verify.


0123456789
commands executed
All tests pass and typecheck is clean. Let me run the build.


Built the project
Build succeeds. Here's a summary of what was built.

Summary
Your Smart Campus Room Availability Checker is built and verified. Three files were generated:

src/lib/availability.ts — Pure validation logic (no React, no side effects). Enforces AC1–AC4 in order: integer check, range (0 ≤ start < end ≤ 1440), start strictly after now, max duration 120 (exactly 120 allowed), blocked rejection, then overlap detection using start < booked_end && end > booked_start so touching endpoints pass. 1441 is rejected by the range check, not the integer check.
src/lib/availability.test.ts — Runnable test suite covering all 12 required cases plus extras (touching-start, start-before-now, midnight-lower). T11 verifies the bookings array is unchanged by comparing a snapshot before and after two checks.
src/App.tsx — Single-page UI: header, fictional room card, scenario controls (numeric now input, block toggle, second-booking toggle), numeric start/end inputs, a check button, and a result banner showing "Available" or "Unavailable" with a plain-language reason. A readout shows the current scenario state. Old results clear automatically when any input or scenario setting changes. No booking is ever created or modified.
Verification (all executed):

Test suite: 14/14 checks passed, 0 failed — including all T1–T11 logic cases.
Typecheck: clean.
Production build: succeeded.
T12 (375px mobile layout) was not executed because this environment has no browser — the layout uses a 480px max-width centered column, full-width stacked controls, 16px font on inputs (prevents iOS zoom), and a 2-column grid that stays within 375px. The markup is structured to avoid horizontal overflow at that width.
~~~~

### B3

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 2026-11-01
- **Stage:** Critique
- **Source:** this SIS

**Prompt:**

~~~~text
Review the current implementation against AC1–AC6 and the
scope exclusions. Do not edit any files yet.
Independently verify these findings:

App.tsx uses parseInput(nowInput) ?? DEFAULT_NOW, so blank or invalid now silently becomes 540, while -1 and 1440 are accepted. The core contract assumes valid now, but the UI allows users to violate this assumption.
package.json includes @supabase/supabase-js although the checker must have no backend or database integration. Determine whether it is actually used.
The dynamic result section has no role="status" or aria-live announcement. Assess this as an AC6 accessibility improvement, without claiming a screen-reader test was run. For each finding, give the exact code evidence, its impact, and a minimal recommended change. Distinguish confirmed findings from assumptions. Keep the existing acceptance criteria unchanged and do not add features.
~~~~

**Response:**

~~~~text
Thoughts
I'll verify each finding against the actual code.


0123456789
actions taken
All three findings independently verified. Here are the results.

Finding 1 — Invalid now silently coerced to 540
Confirmed.

Code evidence (src/App.tsx:32):


const now = parseInput(nowInput) ?? DEFAULT_NOW;
parseInput (line 10–16) returns null only for empty or non-numeric strings. A negative like -1 or an out-of-range value like 1440 passes the regex /^-?\d+$/ and returns a valid integer, so ?? DEFAULT_NOW never triggers for them. Meanwhile checkAvailability's signature (availability.ts:10–16) types now as a bare number with no constraint, and the only place now is used is the future check at line 42 (start <= now). An invalid now produces a misleading result: e.g. now = -1 makes almost any start "after now," and now = 1440 makes nearly everything "not after now."

Impact: Users can set now to values that violate the implicit contract (a realistic current minute). The checker still runs but gives answers that don't match the displayed scenario, undermining AC6's "explain validation failures" for the scenario itself. This is a UI-layer gap, not a core-logic bug — the validation function is correct for valid now.

Minimal recommended change: In handleCheck, validate now before calling checkAvailability. If now is not an integer or falls outside [0, 1440], set an "Unavailable" result with a clear reason (e.g. "Current time must be a whole number from 0 to 1440.") and skip the check. This mirrors how start/end are already guarded at lines 46–52. No change to availability.ts or the acceptance criteria is needed.

Finding 2 — @supabase/Bolt Database-js in package.json but unused
Confirmed unused.

Code evidence:

package.json:14 lists "@supabase/Bolt Database-js": "^2.57.4" as a dependency.
Grep across all *.{ts,tsx,js,json,html} for supabase returned no matches in source files. The only occurrence is the package.json declaration itself.
src/main.tsx imports only React and App.tsx; src/App.tsx imports only React hooks, lucide-react, and @/lib/availability. Neither the library nor any Bolt Database client is instantiated anywhere.
Impact: The dependency is dead weight. It does not violate AC5 (no booking creation) or the exclusions functionally — no Bolt Database code runs — but its presence in the manifest contradicts the "no backend or database integration" exclusion at the project-configuration level, and it ships ~152 KB into the bundle whether or not it's imported (Vite tree-shakes unused exports, but the package remains installed and appears in the dependency tree).

Minimal recommended change: Remove "@supabase/Bolt Database-js" from the dependencies block in package.json, then run npm install to update the lockfile. No source changes are required since nothing imports it.

Finding 3 — Result section lacks aria-live / role="status"
Confirmed.

Code evidence (src/App.tsx:175–196): The result <section> is conditionally rendered when result is non-null, but carries no role="status", no aria-live attribute, and no aria-atomic. It is a plain section:


{result && (
  <section className="mb-4 rounded-2xl border p-4 shadow-sm"
    style={...}>
When the user clicks "Check availability," the result appears visually but screen readers receive no announcement that new content arrived.

Impact: AC6 requires a "usable" layout and that the app "explain validation failures." A sighted user sees the banner appear; a screen-reader user may not be notified that an answer was rendered, which weakens the "explain failures" requirement for that audience. This is an accessibility gap, not a functional bug. I am not claiming a screen-reader test was run — this assessment is based on the absence of standard ARIA live-region attributes in the source.

Minimal recommended change: Add role="status" and aria-live="polite" to the result <section> (or to the inner text container). aria-live="polite" announces the result when the user is idle, which is appropriate here since the user triggers the check manually. A single-attribute addition — no structural change:


<section role="status" aria-live="polite" className="...">
This also announces the "Available" case, which is currently only visible. No new features are added.

Summary
# Finding Status Layer
1 Invalid now silently coerced to 540 Confirmed UI input handling
2 @supabase/Bolt Database-js dependency unused Confirmed unused package.json only
3 No aria-live/role="status" on result Confirmed (no SR test run) Accessibility / AC6
All three are confirmed from the source. None require changing AC1–AC6 or adding features — each fix is a minimal, targeted correction to existing code. I did not edit any files, as requested.
~~~~

### B4

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 2026-11-01
- **Stage:** Repair
- **Source:** this SIS

**Prompt:**

~~~~text
Apply these focused repairs. Preserve AC1–AC6 and the scope.

1. Fix invalid scenario now in App.tsx.
I modify your recommendation: valid now is an integer from
0 through 1439 inclusive, NOT through 1440.
Do not silently substitute 540 for blank or invalid input.
Before checking availability, reject blank, non-integer,
negative or >1439 now with:
“Current time must be a whole number from 0 to 1439.”
Show Unavailable and do not call the core checker.
The scenario readout must not present invalid input as 540.
Keep availability.ts unchanged: its contract assumes valid now.

2. Remove the unused dependency @supabase/supabase-js
(the actual name in the exported package.json).
Update package-lock.json using npm uninstall.
Verify there are no source imports before removal.
I reject the unsupported claim that an unimported dependency
necessarily adds 152 KB to the production bundle.
Do not add any backend or database replacement.

3. Improve result announcements.
Use a persistently mounted status container with
role="status", aria-live="polite" and aria-atomic="true".
Update its content after checking. Preserve result reset
when inputs change. Do not claim screen-reader testing.

Retest T1–T11 and add checks for now:
blank, abc, -1, 1440 => Unavailable with a clear reason.
now=0 with start=1,end=60 => Available.
now=1439 with start=1440,end=1440 => Unavailable:
there is no valid later interval within that day.
Check that invalid now is not displayed as 540.

Run tests, typecheck and production build.
Report exact executed results and changed files.
Do not claim T12 or browser tests unless actually executed.
~~~~

**Response:**

~~~~text
Thoughts
I'll apply the three repairs: extract now-validation into a testable pure function, rewrite App.tsx, update tests, and remove the unused dependency. Let me start by creating the new validation helper and verifying no Bolt Database imports exist.


Searched
supabase
No source imports of Bolt Database — confirmed safe to remove. Now I'll create the now-validation helper, rewrite App.tsx, update the test file, and remove the dependency in parallel where possible.


0123456789
actions taken
Now update the test file to add the new now-validation cases:


Wrote
src/lib/availability.test.ts
Now run the tests, typecheck, remove the dependency, and build.


0123456789
commands executed
All tests pass and typecheck is clean. Now remove the unused Bolt Database dependency and build.


0123456789
commands executed
Let me verify the dependency was fully removed from both manifests.


0123456789
actions taken
All three repairs are applied and verified. Here's the summary.

Summary
Three focused repairs applied, preserving AC1–AC6 and all scope exclusions.

1. Invalid scenario now rejection — New src/lib/nowValidation.ts validates now as an integer from 0–1439 inclusive. Blank, non-integer, negative, and 1440 inputs all return invalid with "Current time must be a whole number from 0 to 1439." App.tsx rejects invalid now before calling the core checker (shows Unavailable, never calls checkAvailability), and the scenario readout displays "Invalid" instead of 540. availability.ts is unchanged.

2. Unused dependency removed — Verified zero source imports of Bolt Database, then ran npm uninstall @supabase/Bolt Database-js. Removed 13 packages; both package.json and package-lock.json now have zero Bolt Database references. No backend or database replacement added.

3. Accessible result announcements — The result section is now a persistently mounted container with role="status", aria-live="polite", and aria-atomic="true". It shows placeholder text until a check runs, updates content after checking, and still resets when inputs change. No screen-reader testing was performed.

Changed files: src/lib/nowValidation.ts (new), src/App.tsx, src/lib/availability.test.ts, package.json, package-lock.json.

Executed results:

Tests: 22/22 passed, 0 failed — includes all T1–T11, plus now-blank, now-abc, now-(-1), now-1440 (all Unavailable), now=0/start=1/end=60 (Available), and now=1439/start=1440/end=1440 (Unavailable: "Start time must be before end time").
Typecheck: clean.
Production build: succeeded.
T12 (375px mobile layout) and browser/screen-reader tests were not executed — this environment has no browser. The layout uses a 480px max-width centered column with full-width stacked controls and is structured to avoid horizontal overflow at 375px, but I'm not claiming that as verified.
~~~~

## 12. Appendix B — Test output

### 12.1 Your suite

Python suite executed by the assistant:

~~~~text
test_121 (test_booking.BookingTests.test_121) ... ok
test_blocked (test_booking.BookingTests.test_blocked) ... ok
test_blocked_empty (test_booking.BookingTests.test_blocked_empty) ... ok
test_boolean (test_booking.BookingTests.test_boolean) ... ok
test_contained (test_booking.BookingTests.test_contained) ... ok
test_empty (test_booking.BookingTests.test_empty) ... ok
test_enclosing (test_booking.BookingTests.test_enclosing) ... ok
test_equal (test_booking.BookingTests.test_equal) ... ok
test_exact_120 (test_booking.BookingTests.test_exact_120) ... ok
test_exact_overlap (test_booking.BookingTests.test_exact_overlap) ... ok
test_float (test_booking.BookingTests.test_float) ... ok
test_midnight_end (test_booking.BookingTests.test_midnight_end) ... ok
test_negative (test_booking.BookingTests.test_negative) ... ok
test_overlap (test_booking.BookingTests.test_overlap) ... ok
test_past_midnight (test_booking.BookingTests.test_past_midnight) ... ok
test_repeat_unchanged (test_booking.BookingTests.test_repeat_unchanged) ... ok
test_reversed (test_booking.BookingTests.test_reversed) ... ok
test_second_booking (test_booking.BookingTests.test_second_booking) ... ok
test_starts_now (test_booking.BookingTests.test_starts_now) ... ok
test_starts_past (test_booking.BookingTests.test_starts_past) ... ok
test_string (test_booking.BookingTests.test_string) ... ok
test_touching_after (test_booking.BookingTests.test_touching_after) ... ok
test_touching_before (test_booking.BookingTests.test_touching_before) ... ok
test_unsorted_accepted_unchanged (test_booking.BookingTests.test_unsorted_accepted_unchanged) ... ok
test_unsorted_rejected_unchanged (test_booking.BookingTests.test_unsorted_rejected_unchanged) ... ok

----------------------------------------------------------------------
Ran 25 tests in 0.001s

OK
~~~~

Bolt v1 logic suite, independently rerun by the assistant:

~~~~text
PASS T1 touching-end available: available=true
PASS T2 overlap unavailable: available=false reason="Overlaps an existing booking (600–660)."
PASS T3 blocked unavailable: available=false reason="This room is blocked and cannot be booked."
PASS T4 120min available: available=true
PASS T5 121min unavailable: available=false reason="Duration is 121 minutes; the maximum is 120 minutes."
PASS T6 start-equals-now unavailable: available=false reason="Start time must be strictly after the current time (now = 540)."
PASS T7 reversed unavailable: available=false reason="Start time must be before end time."
PASS T8 midnight-upper available: available=true
PASS T9 beyond-midnight unavailable: available=false reason="End time cannot exceed 1440 (midnight)."
PASS T10 second-booking overlap unavailable: available=false reason="Overlaps an existing booking (700–760)."
PASS T11 repeated-check: available both times, bookings unchanged ([[600,660]])
PASS Extra touching-start available: available=true
PASS Extra start-before-now unavailable: available=false reason="Start time must be strictly after the current time (now = 540)."
PASS Extra midnight-lower unavailable: available=false reason="Start time must be strictly after the current time (now = 540)."

14/14 checks passed, 0 failed.
~~~~

Bolt final logic suite, independently rerun by the assistant:

~~~~text
PASS T1 touching-end available: available=true
PASS T2 overlap unavailable: available=false reason="Overlaps an existing booking (600–660)."
PASS T3 blocked unavailable: available=false reason="This room is blocked and cannot be booked."
PASS T4 120min available: available=true
PASS T5 121min unavailable: available=false reason="Duration is 121 minutes; the maximum is 120 minutes."
PASS T6 start-equals-now unavailable: available=false reason="Start time must be strictly after the current time (now = 540)."
PASS T7 reversed unavailable: available=false reason="Start time must be before end time."
PASS T8 midnight-upper available: available=true
PASS T9 beyond-midnight unavailable: available=false reason="End time cannot exceed 1440 (midnight)."
PASS T10 second-booking overlap unavailable: available=false reason="Overlaps an existing booking (700–760)."
PASS T11 repeated-check: available both times, bookings unchanged ([[600,660]])
PASS now-blank invalid: valid=false value=null | input=""
PASS now-abc invalid: valid=false value=null | input="abc"
PASS now-negative invalid: valid=false value=null | input="-1"
PASS now-1440 invalid: valid=false value=null | input="1440"
PASS now0 available: available=true
PASS now1439 no-valid-interval unavailable: available=false reason="Start time must be before end time."
PASS now-1439 valid: valid=true value=1439 | input="1439"
PASS now-0 valid: valid=true value=0 | input="0"
PASS Extra touching-start available: available=true
PASS Extra start-before-now unavailable: available=false reason="Start time must be strictly after the current time (now = 540)."
PASS Extra midnight-lower unavailable: available=false reason="Start time must be strictly after the current time (now = 540)."

22/22 checks passed, 0 failed.
~~~~

Node 24 executes TypeScript directly. Temporary test copies use explicit .ts relative imports; exported files remain unchanged. The runner is tools/run_bolt_tests.py. These outputs are not browser/UI observations. Bolt reported successful typecheck and production build; those commands were not independently rerun in the assistant environment.

### 12.2 Path B only — three faults you planted

Not applicable: Path A.

| # | Line you broke | AC | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 13. Remaining limitations and known fails

| Check ID or limitation | Why it stays | What to do next |
| --- | --- | --- |
| Baseline chronology | Section 2 is an AI-assisted draft after the first request; no pre-AI student commit exists | Disclose the actual chronology; do not backdate or reconstruct fictitious earlier work |
| Browser coverage | T1 screenshots are observed; T2–T12 page observations were not provided | Run both versions in a browser and record actual results, including 375px T12 |
| Repair screenshots | Student explicitly requested skipping before/after screenshots | Keep this limitation disclosed; genuine original exports remain available |
| Personal reflection | Student has not supplied a 100–200-word reflection | Write a personal comparison, three risks, responsibility, rejected advice and an in-scope next step |
| Git and declaration | No GitHub workflow was executed here; Student ID and group are supplied; a real commit is not available | Enter actual metadata, commit honest work on sis-03, rerun declarations, open PR and submit its link |
| Python generation evidence | Python v1 is preserved from a real tool write, but the initial prose response did not paste that source | Disclose this evidence-format limitation instead of inventing an earlier Python exchange |
| Accessibility | Live-region attributes confirmed in source, with no screen-reader test | Perform assistive-technology testing if available |


<!-- measured-checker-limitations -->

| Check ID | Current checker observation | Required next step |
| --- | --- | --- |
| E2 | evidence/before-1.png (or .jpg) not found; evidence/after-1.png (or .jpg) not found | Complete the genuine missing evidence described above, then rerun. |
| E3 | evidence/final-narrow.png (or .jpg) not found | Complete the genuine missing evidence described above, then rerun. |
| C1 | T2 page v1: write Available, Unavailable or Not testable; T2 page final: write Available, Unavailable or Not testable; T3 page v1: write Available, Unavailable or Not testable; T3 page final: write Available, Unavailable or Not testable; T4 page v1: write Available, Unavailable or Not testable (+17 more) | Complete the genuine missing evidence described above, then rerun. |
| C4 | page final differs from expected - T2: empty, T3: empty, T4: empty, T5: empty, T6: empty, T7: empty, T8: empty, T9: empty, T10: empty, T11: empty, T12: empty | Complete the genuine missing evidence described above, then rerun. |
| X5 | only 0% of code/original/ is in a Generate response - v1 is the assistant's answer, unedited, and its exchange is pasted in section 11 | Complete the genuine missing evidence described above, then rerun. |
| Q1 | 60 words, range 100-200 | Complete the genuine missing evidence described above, then rerun. |
