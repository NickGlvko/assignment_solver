"""
Жадный алгоритм (Greedy) для решения задачи о назначениях.
Сложность: O(n²log n)
Примечание: работает быстро, но НЕ гарантирует оптимальное решение
"""

import time
import numpy as np


def greedy_algorithm(cost_matrix: list[list[int]]) -> tuple[int, list[tuple[int, int]]]:
    """
    Жадный алгоритм для решения задачи о назначениях.

    Процесс:
    1. Создаём список всех пар (стоимость, строка, столбец)
    2. Сортируем по возрастанию стоимости
    3. Жадно выбираем минимальные стоимости, пропуская уже использованные

    Args:
        cost_matrix: список списков с стоимостями (n×n)

    Returns:
        (total_cost, assignments) где assignments - список кортежей (row, col)
    """

    # Проверка на пустую матрицу
    if not cost_matrix or not cost_matrix[0]:
        return 0, []

    n = len(cost_matrix)
    m = len(cost_matrix[0])

    # Проверка, что матрица квадратная
    if n != m:
        raise ValueError(f"Матрица должна быть квадратной, получена {n}×{m}")

    # Проверка, что все строки имеют одинаковую длину
    for i in range(1, n):
        if len(cost_matrix[i]) != m:
            raise ValueError(f"Несоответствие размеров: строка {i} имеет {len(cost_matrix[i])} столбцов вместо {m}")

    start_time = time.perf_counter()

    # Создаём список всех пар (стоимость, строка, столбец)
    cost_pairs = []
    for i in range(n):
        for j in range(n):
            cost = cost_matrix[i][j]
            cost_pairs.append((cost, i, j))

    # Сортируем по стоимости (жадный выбор минимальных)
    cost_pairs.sort(key=lambda x: x[0])

    # Отслеживаем использованные строки и столбцы
    worker_assigned = [False] * n
    task_assigned = [False] * n
    result_assignment = []
    total_cost = 0

    # Жадно выбираем минимальные стоимости
    for cost, i, j in cost_pairs:
        # Проверяем, не использована ли уже эта строка или столбец
        if not worker_assigned[i] and not task_assigned[j]:
            result_assignment.append((i, j))
            total_cost += cost
            worker_assigned[i] = True
            task_assigned[j] = True

            # Если назначили всех, выходим
            if len(result_assignment) == n:
                break

    end_time = time.perf_counter()
    elapsed_time = end_time - start_time

    return total_cost, result_assignment


def solve_assignment(cost_matrix: list[list[int]]) -> dict:
    """
    API функция для решения задачи о назначениях жадным методом.

    Args:
        cost_matrix: матрица стоимостей (список списков)

    Returns:
        dict с ключами:
            - "assignment": список кортежей (worker, task)
            - "total_cost": итоговая стоимость
            - "time_ms": время выполнения в миллисекундах
    """

    if not cost_matrix or not cost_matrix[0]:
        return {
            "assignment": [],
            "total_cost": 0,
            "time_ms": 0.0
        }

    try:
        total_cost, assignment = greedy_algorithm(cost_matrix)

        return {
            "assignment": assignment,
            "total_cost": total_cost,
            "time_ms": 0.0
        }
    except Exception as e:
        print(f"Ошибка: {e}")
        return {
            "assignment": [],
            "total_cost": 0,
            "time_ms": 0.0
        }


# Тестирование
if __name__ == "__main__":
    test_matrix_1 = [[4, 2, 8], [2, 4, 6], [8, 6, 4]]
    print("Матрица 1:")
    print(test_matrix_1)
    result = solve_assignment(test_matrix_1)
    print(f"Результат: {result}")
    print()

    test_matrix_2 = [[5, 9, 3], [2, 8, 7], [6, 4, 2]]
    print("Матрица 2:")
    print(test_matrix_2)
    result = solve_assignment(test_matrix_2)
    print(f"Результат: {result}")
    print()

    test_matrix_3 = [
        [10, 12, 15, 20],
        [8, 9, 11, 16],
        [14, 13, 10, 12],
        [11, 10, 9, 8]
    ]
    print("Матрица 3 (4×4):")
    print(test_matrix_3)
    result = solve_assignment(test_matrix_3)
    print(f"Результат: {result}")
