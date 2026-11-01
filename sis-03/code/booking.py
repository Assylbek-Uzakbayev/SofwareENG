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
