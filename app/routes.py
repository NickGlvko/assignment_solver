"""
Flask маршруты для решения задачи о назначениях.
Только венгерский алгоритм (без перебора).
"""

from flask import render_template, request, jsonify
import time
from app.algoritms.hungarian import hungarian_optimized


def register_routes(app):
    """Регистрируем маршруты приложения."""

    @app.route('/')
    def index():
        """Главная страница."""
        return render_template('index.html')

    @app.route('/solve', methods=['POST'])
    def solve():
        """Решить задачу венгерским алгоритмом."""
        try:
            data = request.json
            matrix = data.get('matrix')

            if not matrix or len(matrix) == 0:
                return jsonify({'error': 'Пустая матрица'}), 400

            n = len(matrix)
            if any(len(row) != n for row in matrix):
                return jsonify({'error': 'Матрица должна быть квадратной'}), 400

            # Решаем венгерским алгоритмом
            start_time = time.perf_counter()
            total_cost, assignments = hungarian_optimized(matrix)
            elapsed = time.perf_counter() - start_time

            # Преобразуем в понятный формат
            result_pairs = [
                {'row': i, 'col': j, 'cost': matrix[i][j]}
                for i, j in assignments
            ]

            return jsonify({
                'total_cost': round(total_cost, 2),
                'assignments': result_pairs,
                'time': f'{elapsed:.6f}',
                'n': n
            })

        except Exception as e:
            return jsonify({'error': str(e)}), 500