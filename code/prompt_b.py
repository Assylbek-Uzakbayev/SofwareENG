def analyze_marks(marks: list[float], pass_mark: float) -> dict:
    """Analyze a list of student marks.

    Args:
        marks: A list of student marks as floating-point numbers.
        pass_mark: The minimum mark required to pass.

    Returns:
        A dictionary containing:
            - 'average': The average mark.
            - 'highest': The highest mark.
            - 'lowest': The lowest mark.
            - 'pass_rate': The percentage of students who passed.

    Raises:
        ValueError: If marks is empty.
    """
    if not marks:
        raise ValueError("marks must not be empty")

    return {
        "average": sum(marks) / len(marks),
        "highest": max(marks),
        "lowest": min(marks),
        "pass_rate": sum(mark >= pass_mark for mark in marks) / len(marks) * 100,
    }
