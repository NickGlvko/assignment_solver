"""
Оптимизированный венгерский алгоритм для решения задачи о назначениях.
Использует scipy.optimize.linear_sum_assignment для быстрого решения.
Сложность: O(n³)
"""

import numpy as np
from scipy.optimize import linear_sum_assignment


def hungarian_optimized(cost_matrix):
    """
    Венгерский алгоритм с использованием scipy (оптимизированная версия).

    Args:
        cost_matrix: список списков с стоимостями

    Returns:
        (total_cost, assignments) где assignments - список кортежей (row, col)
    """
    # Преобразуем в numpy array
    cost = np.array(cost_matrix, dtype=float)

    # Используем scipy's linear_sum_assignment - это реальная оптимизированная версия
    rows, cols = linear_sum_assignment(cost)

    # Вычисляем итоговую стоимость
    total_cost = float(cost[rows, cols].sum())

    # Преобразуем в список кортежей с обычными Python int (не numpy int64)
    assignments = [(int(r), int(c)) for r, c in zip(rows, cols)]

    return int(total_cost), assignments