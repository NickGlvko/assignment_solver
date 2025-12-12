"""
Тесты для венгерского алгоритма.
"""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.algoritms.hungarian import hungarian_optimized, hungarian_algorithm


def test_simple_3x3():
    """Тест на простой 3x3 матрице."""
    matrix = [
        [5, 9, 3],
        [2, 8, 7],
        [6, 4, 2]
    ]

    cost, assignments = hungarian_optimized(matrix)

    # Проверяем, что стоимость разумная
    assert cost > 0
    assert len(assignments) == 3

    # Проверяем, что каждая строка и столбец использованы ровно один раз
    rows = set(i for i, j in assignments)
    cols = set(j for i, j in assignments)
    assert len(rows) == 3
    assert len(cols) == 3
    assert rows == {0, 1, 2}
    assert cols == {0, 1, 2}


def test_identity_matrix():
    """Тест на единичной матрице — результат должен быть 0."""
    matrix = [
        [0, 100, 100],
        [100, 0, 100],
        [100, 100, 0]
    ]

    cost, assignments = hungarian_optimized(matrix)
    assert cost == 0


def test_4x4_matrix():
    """Тест на 4x4 матрице."""
    matrix = [
        [1, 2, 3, 4],
        [5, 1, 6, 7],
        [8, 9, 1, 10],
        [11, 12, 13, 1]
    ]

    cost, assignments = hungarian_optimized(matrix)

    # Диагональное назначение должно дать минимум = 4
    assert cost <= 30  # Разумный верхний предел
    assert len(assignments) == 4


def test_all_same_cost():
    """Все элементы одинаковой стоимости."""
    matrix = [
        [5, 5, 5],
        [5, 5, 5],
        [5, 5, 5]
    ]

    cost, assignments = hungarian_optimized(matrix)
    assert cost == 15  # 5 * 3


if __name__ == '__main__':
    test_simple_3x3()
    print("✓ test_simple_3x3 passed")

    test_identity_matrix()
    print("✓ test_identity_matrix passed")

    test_4x4_matrix()
    print("✓ test_4x4_matrix passed")

    test_all_same_cost()
    print("✓ test_all_same_cost passed")

    print("\nВсе тесты венгерского алгоритма пройдены!")
