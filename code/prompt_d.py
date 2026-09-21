def analyze_marks(marks: list[float], pass_mark: float) -> dict:
    if not marks:
        raise ValueError("Marks list cannot be empty")

    if any(not isinstance(mark, (int, float)) for mark in marks):
        raise ValueError("All marks must be numeric")

    if any(mark < 0 or mark > 100 for mark in marks):
        raise ValueError("Marks must be between 0 and 100")

    average = sum(marks) / len(marks)
    highest = max(marks)
    lowest = min(marks)
    pass_rate = round(
        sum(mark >= pass_mark for mark in marks) / len(marks) * 100,
        2
    )

    return {
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate,
    }
