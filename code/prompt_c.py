def analyze_marks(marks: list[float], pass_mark: float) -> dict:
    if not marks:
        raise ValueError("marks list cannot be empty")

    average = sum(marks) / len(marks)
    highest = max(marks)
    lowest = min(marks)
    pass_rate = round(sum(mark >= pass_mark for mark in marks) / len(marks), 2)

    return {
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate,
    }
