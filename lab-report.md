# Lab Report: Requirements Engineering with AI

## Section 1: Open Questions Decisions
1. **Overlap definition (R3):** A booking that ends exactly when another begins is NOT considered an overlap. Back-to-back bookings are allowed.
2. **Maximum duration (R2):** Exactly two hours IS allowed (the maximum limit is inclusive up to 120 minutes).

## Section 2: Original AI Generation (Unedited)
*(Aquí pasted the raw, unedited output from your first prompt)*
As a Student, I want to view room availability so that I know when a room is free. (Priority: High, Assumption: Rooms have fixed schedules)
As a Student, I want to book a room so that I can study. (Priority: High, Assumption: The system handles timing)
As a Student, I want to cancel a booking so that I can free up space. (Priority: Medium, Assumption: Cancellation is instant)
As an Administrator, I want to block a room so that maintenance can happen. (Priority: High, Assumption: Blocked rooms cannot be booked)
As an Administrator, I want to review usage so that I can see how rooms are used. (Priority: Medium, Assumption: Logs are saved)
As a System, I want to send a confirmation so that the user knows. (Priority: Low, Assumption: Notifications work)

## Section 3: Story Reviews and Changes
- **US-01 (View availability):** Kept with minor refinement. Added explicit scope. Reason: Clear, testable, targets the Student role.
- **US-02 (Book room):** Rewritten to specify time slot constraints under R1 and R2. Reason: Original was too vague about business rules.
- **US-03 (Cancel booking):** Kept. Reason: Valid stakeholder and actionable outcome.
- **US-04 (Block or unblock room):** Kept for Administrator. Reason: Directly addresses room management and R4.
- **US-05 (Review usage):** Kept for Administrator. Reason: Aligned with UC-05 scope.
- **US-06 (Send confirmation):** Rewritten from "As a System" to appropriate stakeholder context, as systems cannot be user story actors. Reason: Correcting actor violation (only Student and Administrator are allowed).
- **US-07 (Group booking reservation):** Added to cover group study needs within the scenario. Reason: Enhances coverage of student requirements.
- **US-08 (Unblock room management):** Added to ensure the unblocking half of UC-04 is fully articulated. Reason: Separate lifecycle state management.

## Section 4: Acceptance Criteria Review Summary
- Three stories selected (US-02, US-03, US-04).
- Reviewed against boundary conditions, invalid cases (e.g., overlapping, past time, booking blocked rooms), and Given/When/Then formatting. No UI details included.

## Section 5: Use-Case Diagram Analysis
- Modeled Student and Administrator outside the system boundary.
- Verified that all 6 use cases use verb + business goal naming convention.
- Identified that actors do not directly trigger "Send confirmation" (triggered by system events) and "Review usage" is an administrative analytical task.

## Section 6: Traceability Analysis & Gaps
- Traceability table maps use cases to revised stories and criteria.
- Identified gaps: UC-06 (Send confirmation) is triggered automatically by system logic rather than direct user action, resulting in a natural traceability gap with user stories.

## Section 7: Checker Results
- check_requirements.py: PASSED (All 23 structural checks passed)
- validate_submission.py: PASSED

## Section 8: Findings
1. **US-06:** The original AI output assigned a user story to "As a System", which violates the strict rule allowing only Student and Administrator actors.
2. **UC-05:** "Review usage" has no direct interactive trigger from a student perspective, requiring careful handling in traceability.
3. **R3:** The ambiguity regarding back-to-back booking overlaps required an explicit decision in assumptions to prevent validation failures.

## Section 9: Manual Checklist Walkthrough
- [x] Actors restricted to Student and Administrator.
- [x] Exactly 6 use cases used with exact IDs (UC-01 to UC-06).
- [x] 4 business rules addressed.
- [x] Out-of-scope items (payments, QR codes, screens) excluded.
- [x] All required files present in week-03/.