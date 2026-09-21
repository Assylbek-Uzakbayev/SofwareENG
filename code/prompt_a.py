def analyze_marks(marks, pass_mark):
    if not marks:
        raise ValueError("marks must not be empty")

    average = sum(marks) / len(marks)
    highest = max(marks)
    lowest = min(marks)
    pass_rate = sum(mark >= pass_mark for mark in marks) / len(marks) * 100

    return average, highest, lowest, pass_rate
