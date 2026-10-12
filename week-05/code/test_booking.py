import unittest
from booking import can_book


class BookingTests(unittest.TestCase):
    def test_touching_end_is_allowed(self):
        # AC4
        self.assertIs(can_book(660, 720, 540, False, [(600, 660)]), True)

    def test_partial_overlap_is_rejected(self):
        # AC4
        self.assertIs(can_book(630, 690, 540, False, [(600, 660)]), False)

    def test_blocked_room_is_rejected(self):
        # AC3
        self.assertIs(can_book(660, 720, 540, True, [(600, 660)]), False)

    def test_exactly_two_hours_is_allowed(self):
        # AC2
        self.assertIs(can_book(720, 840, 540, False, [(600, 660)]), True)

    def test_over_two_hours_is_rejected(self):
        # AC2
        self.assertIs(can_book(720, 841, 540, False, [(600, 660)]), False)

    def test_starts_now_is_rejected(self):
        # AC1
        self.assertIs(can_book(540, 570, 540, False, [(600, 660)]), False)

    def test_zero_length_is_rejected(self):
        # AC1
        self.assertIs(can_book(720, 720, 540, False, [(600, 660)]), False)

    def test_reversed_interval_is_rejected(self):
        # AC1
        self.assertIs(can_book(750, 720, 540, False, [(600, 660)]), False)

    def test_ends_at_day_boundary_is_allowed(self):
        # AC1
        self.assertIs(can_book(1380, 1440, 540, False, []), True)

    def test_ends_beyond_day_is_rejected(self):
        # AC1
        self.assertIs(can_book(1380, 1441, 540, False, []), False)

    def test_starts_before_now_is_rejected(self):
        # AC1
        self.assertIs(can_book(539, 569, 540, False, [(600, 660)]), False)

    def test_negative_start_is_rejected(self):
        # AC1; lower bound and starts-before-now cannot be isolated
        self.assertIs(can_book(-1, 59, 0, False, []), False)

    def test_empty_existing_is_allowed(self):
        # AC4
        self.assertIs(can_book(720, 780, 540, False, []), True)

    def test_later_booking_conflict_is_rejected(self):
        # AC4
        self.assertIs(can_book(720, 780, 540, False, [(600, 660), (750, 810)]), False)

    def test_multiple_nonconflicting_bookings_are_allowed(self):
        # AC4
        self.assertIs(can_book(720, 780, 540, False, [(810, 870), (600, 660)]), True)

    def test_touching_start_is_allowed(self):
        # AC4
        self.assertIs(can_book(570, 600, 540, False, [(600, 660)]), True)

    def test_inside_existing_is_rejected(self):
        # AC4
        self.assertIs(can_book(615, 645, 540, False, [(600, 660)]), False)

    def test_contains_existing_is_rejected(self):
        # AC4
        self.assertIs(can_book(570, 690, 540, False, [(600, 660)]), False)

    def test_identical_interval_is_rejected(self):
        # AC4
        self.assertIs(can_book(600, 660, 540, False, [(600, 660)]), False)

    def test_left_partial_overlap_is_rejected(self):
        # AC4
        self.assertIs(can_book(570, 630, 540, False, [(600, 660)]), False)

    def test_accepted_call_keeps_unsorted_input(self):
        # AC5: preserve values and order, even when the call succeeds.
        existing = [(810, 870), (600, 660)]
        before = existing.copy()
        self.assertIs(can_book(720, 780, 540, False, existing), True)
        self.assertEqual(existing, before)

    def test_rejected_call_keeps_input(self):
        # AC5: preserve inputs even when a conflict rejects the request.
        existing = [(750, 810), (600, 660)]
        before = existing.copy()
        self.assertIs(can_book(720, 780, 540, False, existing), False)
        self.assertEqual(existing, before)

    def test_non_integer_behavior_is_not_handled(self):
        # Outside the contract; records the declared choice, not an AC.
        self.assertIs(can_book(720.5, 780, 540, False, []), True)
        with self.assertRaises(TypeError):
            can_book("720", 780, 540, False, [])


    def test_one_minute_after_now_is_allowed(self):
        # Added after the initial full suite: AC1 and AC2 smallest future interval.
        self.assertIs(can_book(541, 542, 540, False, []), True)


if __name__ == "__main__":
    unittest.main()
