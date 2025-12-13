"""
Главный файл Flask приложения.
Решение задачи о назначениях венгерским алгоритмом.

Запуск: python app.py
Запуск: `python app.py`
Приложение: http://127.0.0.1:5000
"""

import os
from flask import Flask
from app.routes import register_routes

# Абсолютный путь к корню проекта
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Создаём Flask приложение
app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, 'app', 'templates'),
    static_folder=os.path.join(BASE_DIR, 'app', 'static')
)

# Регистрируем маршруты
register_routes(app)

if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("🚀 Assignment Problem Solver")
    print("=" * 60)
    print("📱 Откройте: http://127.0.0.1:5000")
    print("🛑 Остановка: Ctrl+C")
    print("=" * 60 + "\n")

    app.run(debug=True, host='127.0.0.1', port=5000)