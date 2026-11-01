import unittest
from copy import deepcopy
from booking import can_book


class BookingTests(unittest.TestCase):
    def check(self, start, end, expected, now=540, blocked=False, existing=None):
        bookings = [(600, 660)] if existing is None else existing
        before = deepcopy(bookings)
        self.assertIs(can_book(start, end, now, blocked, bookings), expected)
        self.assertEqual(bookings, before)

    def test_touching_after(self): self.check(660, 720, True)
    def test_touching_before(self): self.check(550, 600, True)
    def test_overlap(self): self.check(630, 690, False)
    def test_blocked(self): self.check(660, 720, False, blocked=True)
    def test_exact_120(self): self.check(720, 840, True)
    def test_121(self): self.check(720, 841, False)
    def test_starts_now(self): self.check(540, 570, False)
    def test_starts_past(self): self.check(530, 560, False)
    def test_reversed(self): self.check(720, 660, False)
    def test_equal(self): self.check(720, 720, False)
    def test_midnight_end(self): self.check(1380, 1440, True)
    def test_past_midnight(self): self.check(1380, 1441, False)
    def test_negative(self): self.check(-1, 30, False, now=0, existing=[])
    def test_second_booking(self): self.check(720, 780, False, existing=[(600,660),(700,760)])
    def test_repeat_unchanged(self):
        bookings = [[600, 660]]
        self.check(660, 720, True, existing=bookings)
        self.check(660, 720, True, existing=bookings)
    def test_unsorted_accepted_unchanged(self):
        self.check(780, 840, True, existing=[(900,960),(600,660),(700,760)])
    def test_unsorted_rejected_unchanged(self):
        self.check(610, 650, False, existing=[(900,960),(600,660),(700,760)])
    def test_empty(self): self.check(660, 720, True, existing=[])
    def test_exact_overlap(self): self.check(600, 660, False)
    def test_contained(self): self.check(610, 620, False)
    def test_enclosing(self): self.check(590, 670, False)
    def test_float(self): self.check(660.5, 720, False)
    def test_string(self): self.check('660', 720, False)
    def test_boolean(self): self.check(True, 20, False, now=0, existing=[])
    def test_blocked_empty(self): self.check(660, 720, False, blocked=True, existing=[])


if __name__ == '__main__':
    unittest.main(verbosity=2)
