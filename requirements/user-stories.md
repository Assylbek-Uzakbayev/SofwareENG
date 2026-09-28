# User Stories

- **US-01**: As a Student, I want to view room availability by date and time slot, so that I can find a free study room.
  - Priority: High
  - Assumption: Room schedules are updated in real-time.

- **US-02**: As a Student, I want to book a free study room for a specific time slot, so that I can secure a space for my studies.
  - Priority: High
  - Assumption: Bookings cannot exceed two hours and must start in the future (R1, R2).

- **US-03**: As a Student, I want to cancel my existing booking, so that the room becomes available for other students when my plans change.
  - Priority: Medium
  - Assumption: Cancellations can be performed at any time before the booking starts.

- **US-04**: As an Administrator, I want to block a study room out of service, so that users cannot reserve rooms undergoing checks.
  - Priority: High
  - Assumption: Blocked rooms immediately reject new booking attempts (R4).

- **US-05**: As an Administrator, I want to review room usage statistics over a specified period, so that I can monitor utilization trends.
  - Priority: Medium
  - Assumption: Usage data is compiled from historical booking records.

- **US-06**: As a Student, I want to receive a confirmation message upon successfully booking or cancelling a room, so that I have proof of my reservation status.
  - Priority: Medium
  - Assumption: Confirmation is handled programmatically via system triggers (UC-06).

- **US-07**: As a Student, I want to book a room for group study sessions, so that my team can collaborate effectively.
  - Priority: Low
  - Assumption: Group size fits within standard small study room capacity.

- **US-08**: As an Administrator, I want to unblock a previously blocked room, so that it becomes available for student reservations again.
  - Priority: High
  - Assumption: Unblocking restores standard booking capabilities immediately.