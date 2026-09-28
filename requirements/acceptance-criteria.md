# Acceptance Criteria

## US-02: Book Room

### Assumptions
- A booking must start in the future (R1).
- Maximum duration is two hours (inclusive up to 120 minutes, R2).
- Two bookings for the same room may not overlap, but back-to-back bookings ending when another begins are allowed (R3).
- A blocked room cannot be booked (R4).

### AC-02-01
- Given room 101 is completely free and available at 14:00 tomorrow,
- When a student requests to book room 101 from 14:00 to 15:30 tomorrow,
- Then the booking is successfully confirmed and saved in the system.

### AC-02-02
- Given room 101 is free,
- When a student attempts to book room 101 for 3 hours (e.g., 14:00 to 17:00),
- Then the system rejects the booking due to exceeding the 2-hour maximum duration limit (R2).

### AC-02-03
- Given room 101 is already booked from 13:00 to 15:00,
- When a student attempts to book room 101 from 14:00 to 16:00,
- Then the system rejects the booking due to time slot overlap (R3).


## US-03: Cancel Booking

### Assumptions
- A student can only cancel their own active future bookings.

### AC-03-01
- Given a student has an active future booking for room 102,
- When the student selects to cancel the booking,
- Then the reservation is cancelled and the slot becomes free.

### AC-03-02
- Given a booking has already passed or does not exist,
- When a student attempts to cancel it,
- Then the system displays an error indicating no active booking was found.


## US-04: Block or Unblock Room

### Assumptions
- Administrators have full rights to toggle room availability status (R4).

### AC-04-01
- Given room 103 is currently active and unbooked,
- When the administrator blocks room 103,
- Then the room status changes to blocked and cannot be reserved by students (R4).

### AC-04-02
- Given room 103 is blocked by an administrator,
- When a student attempts to book room 103,
- Then the system blocks the request and displays an error message stating the room is out of service.