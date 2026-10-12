# Week 05 — Lab report

**Name:** Assylbek Uzakbayev
**Group:** Monday, 16:00–19:00
**Date:** 2026-10-12

> AI-assisted draft. Code, tests, review tables and explanatory prose were prepared by the assistant. The student must review expected values and write the personal conclusion before submission. Verification outputs below were produced in the assistant's environment until refreshed locally. Setup began on 2026-10-11. The specification and Prompt 1 were supplied in this chat; implementation and review were subsequently requested together rather than with the prescribed unchanged Prompts 2 and 4.

## 1. Setup

| | |
| --- | --- |
| Assistant (tool) | ChatGPT / Codex |
| **Exact** model name | GPT 6.1 sol (name provided by student) |
| Language and version | Python 3.9.0 on student's computer; Python 3.12.14 for assistant verification |
| Path | A |
| My Week 04 declaration for touching bookings | did not submit |

## 2. Task 1 — the plan

**The assistant's plan:** The following consolidated plan was returned with this package. The earlier full plan is in the conversation. This is not claimed to be an unedited copy of that earlier response.

```text
Implementation plan for Python 3:

1. Check 0 <= start < end <= 1440. Return False if it fails. AC1
2. Check start > now. Return False if it fails. AC1
3. Check end - start <= 120. Exactly 120 minutes is allowed. AC2
4. If blocked is True, return False. AC3
5. For each existing (a, b), reject if start < b and end > a. AC4
6. Return True after all checks pass. Never change inputs. AC5 and contract

Assumptions: integer times on one date; valid now, Boolean blocked, and
valid active bookings for the selected room are supplied by the contract.
Non-integer behavior is unspecified; no validation is added. Saving and
confirmation are outside the function.

Boundary cases: touching at either endpoint; partial, contained, enclosing
and identical overlaps; 120 versus 121 minutes; starts now or before now;
zero or reversed intervals; end 1440 versus 1441; blocked room; empty and
multiple bookings; Boolean results and unchanged input values and order.
```

| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 | Steps 1–6 add no invented rule. | Steps 1–2: AC1; step 3: AC2; step 4: AC3; step 5: AC4; step 6: AC5 and contract. | Assistant checked the mapping; student review is still required. |

**Boundary cases suggested and kept as tests:**

- Both touching endpoints; overlap relationships; duration and day boundaries; empty/multiple bookings; unchanged inputs and Boolean results.

## 3. Task 2 — the first version (v1), read before it was run

v1 is saved as `code/original/booking_v1.py`, exactly as returned in this package: yes. The assistant mapped it before executing it; the student has not yet confirmed personal review.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | `if not (0 <= start < end <= 1440):` | AC1 | Correct: day bounds and strictly positive interval. |
| 2 | `if start <= now:` | AC1 | Correct: start must be strictly after now. |
| 3 | `if end - start > 120:` | AC2 | Correct: 120 is accepted; 121 is rejected. |
| 4 | `if blocked:` | AC3 | Correct under supplied Boolean contract. |
| 5 | `if start < b and end > a:` | AC4 | Correct: strict comparisons permit touching. |
| 6 | `return True` after the loop | AC5 and contract | Correct: all checks complete; literal Boolean returned. |
| 7 | `for a, b in existing:` | AC5 and contract | Reads every booking without modifying the list. |

**Anything in v1 that no AC asks for:** None. No saving, buffer, sorting, logging, or additional validation.

## 4. Task 3 — my tests

Tests were written by the assistant and disclosed. Expected values were derived from the ACs before execution. Student review of every expected value is still needed. Both accepted and rejected calls use `assertIs` to check Boolean identity. The negative-start test necessarily checks two AC1 requirements: a valid nonnegative now means a negative start is also not after now.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | test_touching_end_is_allowed | (660, 720) | now=540; blocked=False; existing=[(600, 660)] | True | AC4 | PASS | PASS |
| 2 | test_partial_overlap_is_rejected | (630, 690) | now=540; blocked=False; existing=[(600, 660)] | False | AC4 | PASS | PASS |
| 3 | test_blocked_room_is_rejected | (660, 720) | now=540; blocked=True; existing=[(600, 660)] | False | AC3 | PASS | PASS |
| 4 | test_exactly_two_hours_is_allowed | (720, 840) | now=540; blocked=False; existing=[(600, 660)] | True | AC2 | PASS | PASS |
| 5 | test_over_two_hours_is_rejected | (720, 841) | now=540; blocked=False; existing=[(600, 660)] | False | AC2 | PASS | PASS |
| 6 | test_starts_now_is_rejected | (540, 570) | now=540; blocked=False; existing=[(600, 660)] | False | AC1 | PASS | PASS |
| 7 | test_zero_length_is_rejected | (720, 720) | now=540; blocked=False; existing=[(600, 660)] | False | AC1 | PASS | PASS |
| 8 | test_reversed_interval_is_rejected | (750, 720) | now=540; blocked=False; existing=[(600, 660)] | False | AC1 | PASS | PASS |
| 9 | test_ends_at_day_boundary_is_allowed | (1380, 1440) | now=540; blocked=False; existing=[] | True | AC1 | PASS | PASS |
| 10 | test_ends_beyond_day_is_rejected | (1380, 1441) | now=540; blocked=False; existing=[] | False | AC1 | PASS | PASS |
| 11 | test_starts_before_now_is_rejected | (539, 569) | now=540; blocked=False; existing=[(600, 660)] | False | AC1 | PASS | PASS |
| 12 | test_negative_start_is_rejected | (-1, 59) | now=0; blocked=False; existing=[] | False | AC1; lower bound and starts-before-now cannot be isolated | PASS | PASS |
| 13 | test_empty_existing_is_allowed | (720, 780) | now=540; blocked=False; existing=[] | True | AC4 | PASS | PASS |
| 14 | test_later_booking_conflict_is_rejected | (720, 780) | now=540; blocked=False; existing=[(600, 660), (750, 810)] | False | AC4 | PASS | PASS |
| 15 | test_multiple_nonconflicting_bookings_are_allowed | (720, 780) | now=540; blocked=False; existing=[(810, 870), (600, 660)] | True | AC4 | PASS | PASS |
| 16 | test_touching_start_is_allowed | (570, 600) | now=540; blocked=False; existing=[(600, 660)] | True | AC4 | PASS | PASS |
| 17 | test_inside_existing_is_rejected | (615, 645) | now=540; blocked=False; existing=[(600, 660)] | False | AC4 | PASS | PASS |
| 18 | test_contains_existing_is_rejected | (570, 690) | now=540; blocked=False; existing=[(600, 660)] | False | AC4 | PASS | PASS |
| 19 | test_identical_interval_is_rejected | (600, 660) | now=540; blocked=False; existing=[(600, 660)] | False | AC4 | PASS | PASS |
| 20 | test_left_partial_overlap_is_rejected | (570, 630) | now=540; blocked=False; existing=[(600, 660)] | False | AC4 | PASS | PASS |
| 21 | test_accepted_call_keeps_unsorted_input | (720, 780) | existing=[(810,870),(600,660)]; compare list before/after | True and unchanged | AC5 | PASS | PASS |
| 22 | test_rejected_call_keeps_input | (720, 780) | existing=[(750,810),(600,660)]; compare list before/after | False and unchanged | AC5 | PASS | PASS |
| 23 | test_non_integer_behavior_is_not_handled | (720.5, 780), then ("720", 780) | existing=[] | True for float; TypeError for string | Outside contract | PASS | PASS |
| 24 | test_one_minute_after_now_is_allowed | (541, 542) | existing=[] | True | AC1, AC2 | PASS | PASS |

## 5. Task 4 — debugging with evidence

No implementation failure was observed. The new edge case below was added after the first full suite. Mutation coverage development is recorded below from real checker runs; no implementation defect or repair is invented.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `can_book(541, 542, 540, False, [])` | True | True | `if start <= now:` correctly accepts 541; duration is one minute. | No function fix; added test_one_minute_after_now_is_allowed. | Assistant |

The initial six-case suite passed 6/6 tests. Initial surviving mutation checks: M2, M3, M7, M8, M9, M10. Boundary and unchanged-input tests were added; final outcomes are in section 8.2. The initial run also had incomplete report evidence, which is not an implementation defect.

**The debug prompt and answer:** Not used; no failing F check or implementation test needed a fix.

```text
```

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited from this package:**

```text
No defect was found within the supplied contract and AC1-AC5.
1. Review concern: "if start < b and end > a:" must use strict comparisons.
   AC4 allows touching endpoints. Both comparisons are strict, so no fix is needed.
2. Review concern: "return True" must be outside the loop and all checks.
   AC5 requires every booking to be checked. Its indentation is correct.
3. Review concern: "for a, b in existing:" must not modify the supplied list.
   The unchanged-input contract and AC5 are satisfied; no sorting or append occurs.
4. Review concern: "if not (0 <= start < end <= 1440):" does not validate types.
   The contract already supplies integer times. Additional validation is not required.
```

The following judgments are proposed by the assistant for student review; they are not claimed to be independent student decisions.

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | Retain strict `start < b and end > a`. | accept | AC4 permits touching, so <= or >= would be wrong. | No change; final suite green. |
| 2 | Retain `return True` outside the loop. | accept | AC5 requires checking all bookings; later-conflict test covers this. | No change; final suite green. |
| 3 | Retain read-only iteration without sorting. | accept | Contract and AC5 prohibit changing inputs. | No change; two preservation tests green. |
| 4 | Add validation of non-integer times. | reject | Not requested by the integer-input contract; declared not-handled in section 9.2. | No change; behavior documented by dedicated test. |

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | No line changed in can_book; v1 and final are identical. Test suite expanded from six cases to boundary/input tests and the new one-minute edge case. | All observed implementation tests and F checks passed; test coverage needed broader evidence. | Full suite passes; checker reports identical v1 and final. |

## 8. Evidence — real output

### 8.1 My suite, final run

Environment: current computer, Python 3.12.14.

```text
test_accepted_call_keeps_unsorted_input (test_booking.BookingTests) ... ok
test_blocked_room_is_rejected (test_booking.BookingTests) ... ok
test_contains_existing_is_rejected (test_booking.BookingTests) ... ok
test_empty_existing_is_allowed (test_booking.BookingTests) ... ok
test_ends_at_day_boundary_is_allowed (test_booking.BookingTests) ... ok
test_ends_beyond_day_is_rejected (test_booking.BookingTests) ... ok
test_exactly_two_hours_is_allowed (test_booking.BookingTests) ... ok
test_identical_interval_is_rejected (test_booking.BookingTests) ... ok
test_inside_existing_is_rejected (test_booking.BookingTests) ... ok
test_later_booking_conflict_is_rejected (test_booking.BookingTests) ... ok
test_left_partial_overlap_is_rejected (test_booking.BookingTests) ... ok
test_multiple_nonconflicting_bookings_are_allowed (test_booking.BookingTests) ... ok
test_negative_start_is_rejected (test_booking.BookingTests) ... ok
test_non_integer_behavior_is_not_handled (test_booking.BookingTests) ... ok
test_one_minute_after_now_is_allowed (test_booking.BookingTests) ... ok
test_over_two_hours_is_rejected (test_booking.BookingTests) ... ok
test_partial_overlap_is_rejected (test_booking.BookingTests) ... ok
test_rejected_call_keeps_input (test_booking.BookingTests) ... ok
test_reversed_interval_is_rejected (test_booking.BookingTests) ... ok
test_starts_before_now_is_rejected (test_booking.BookingTests) ... ok
test_starts_now_is_rejected (test_booking.BookingTests) ... ok
test_touching_end_is_allowed (test_booking.BookingTests) ... ok
test_touching_start_is_allowed (test_booking.BookingTests) ... ok
test_zero_length_is_rejected (test_booking.BookingTests) ... ok

----------------------------------------------------------------------
Ran 24 tests in 0.001s

OK
```

### 8.2 The checker, final run

```text
Week 05 - can_book: the function, your tests, the evidence   (Path A)

PASS   F1   the six cases from the task table           6 of 6 cases
PASS   F2   AC1 time order and day bounds               5 of 5 cases
PASS   F3   AC1 the start is in the future              5 of 5 cases
PASS   F4   AC2 at most 120 minutes                     3 of 3 cases
PASS   F5   AC3 a blocked room accepts nothing          2 of 2 cases
PASS   F6   AC4 every kind of overlap is rejected       5 of 5 cases
PASS   F7   AC4 touching endpoints are allowed          3 of 3 cases
PASS   F8   AC4 every existing booking is checked       4 of 4 cases
PASS   F9   AC5 the result is a real Boolean            3 of 3 cases
PASS   F10  AC5 the inputs are left unchanged           2 of 2 cases
PASS   O1   the assistant's first version is kept       v1 kept (13 lines)
PASS   S1   your suite has at least 11 tests            24 tests
PASS   S2   your suite is green on your own code        24 tests, OK
PASS   M1   your tests catch a fault in AC1             caught by test_starts_now_is_rejected
PASS   M2   your tests catch a fault in AC1             caught by test_ends_beyond_day_is_rejected
PASS   M3   your tests catch a fault in AC1             caught by test_zero_length_is_rejected
PASS   M4   your tests catch a fault in AC2             caught by test_exactly_two_hours_is_allowed
PASS   M5   your tests catch a fault in AC3             caught by test_blocked_room_is_rejected
PASS   M6   your tests catch a fault in AC4             caught by test_touching_end_is_allowed, test_touching_start_is_allowed
PASS   M7   your tests catch a fault in AC4             caught by test_later_booking_conflict_is_rejected
PASS   M8   your tests catch a fault in AC4             caught by test_contains_existing_is_rejected
PASS   M9   your tests catch a fault in AC5             caught by test_accepted_call_keeps_unsorted_input
PASS   M10  your tests catch a fault in AC5             caught by test_accepted_call_keeps_unsorted_input, test_rejected_call_keeps_input
PASS   L1   report 1: tool, model and language          tool, model and language recorded
PASS   L2   report 2: the plan, and what you corrected  plan pasted, 1 row(s) on what you corrected or verified
PASS   L3   report 3: v1 mapped to AC1-AC4              7 conditions mapped, AC1-AC4 all present
PASS   L4   report 4: at least 11 of your tests listed  24 tests listed
PASS   L5   report 5: debugging evidence                1 row(s) of input / expected / actual
PASS   L6   report 6: the critique, each point judged   critique pasted, 4 points judged
PASS   L7   report 7: change log                        1 change-log row(s)
PASS   L8   report 8.1: real output of your suite       suite output pasted
PASS   L9   report 10: conclusion of 120-180 words      160 words
------------------------------------------------------------------------------
v1 (code/original/booking_v1.py): passes F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 - fails nothing - identical to your final: yes
SUMMARY pass=32 fail=0 error=0   (32 checks)
Behaviour and shape are clean. This says nothing about the quality of your review.
```

### 8.3 Path B only — three faults I planted myself

Not applicable: Python Path A uses the provided M checks.

| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |

```text
```

## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

| Check | Why it stays |
| --- | --- |
| none | Final behavioral and report-shape checker run is clean. Draft status and student review requirements are disclosed separately. |

### 9.2 Outside the contract

The declared choice is `not-handled`. `can_book(720.5, 780, 540, False, [])` returns True, while `can_book("720", 780, 540, False, [])` raises TypeError. Integer inputs are guaranteed by the contract, so no new rejection rule was added. The dedicated test records this behavior and does not establish an additional AC. This explanation is AI-assisted and needs student agreement.

### 9.3 A bound that never decides

The bound is `0 <= start`. If start is negative, then it cannot be greater than a valid now, because now is at least zero. Thus start > now already rejects every negative start. Negative-start rejection cannot isolate the lower-bound comparison as its only deciding rule. This reasoning is AI-assisted and needs student review.

## 10. Conclusion (120–180 words)

> AI-generated example, not an independent student conclusion. Replace the following paragraphs with your own 120–180 words before submission.

The function rejects a booking when its start is before an existing booking ends and its end is after that booking starts. Both comparisons must be true. Strict comparisons allow touching endpoints, so one booking can begin exactly when another ends. A duration of 120 minutes is allowed, but 121 minutes is rejected.

The initial six tests missed several faults, including M9, which concerns unchanged inputs. The original examples checked decisions without comparing the booking list before and after a call. Adding a test with an unsorted list checked both its values and order. The final suite passed all 24 tests and caught all ten faulty versions. The first implementation remained unchanged because no implementation failure was observed.

Non-integer times were left outside the supported contract. A float may pass, while a string raises TypeError. This behavior is declared explicitly. The exercise shows why correct-looking code still needs boundary tests, checks for input changes, and honest reporting of AI assistance.