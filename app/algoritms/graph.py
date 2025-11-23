def solve_assignment(cost_matrix: list[list[int]]) -> dict:
    """
    Заглушка для Венгерского алгоритма.
    Всегда возвращает единичное диагональное назначение.
    """
    n = len(cost_matrix)
    assignment = [(i, i) for i in range(n)]
    return {
        "assignment": assignment,
        "total_cost": 1,
        "time_ms": 1.0
    }