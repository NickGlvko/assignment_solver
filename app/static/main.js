// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Страница загружена');
    
    // Регистрируем обработчики событий
    document.getElementById('generate-btn').addEventListener('click', generateMatrix);
    document.getElementById('solve-btn').addEventListener('click', solveMatrix);
    document.getElementById('csv-upload').addEventListener('change', handleCSVUpload);
    
    // Генерируем первую матрицу
    generateMatrix();
});

// Генерирование случайной матрицы
function generateMatrix() {
    const size = parseInt(document.getElementById('size-input').value) || 3;
    
    if (size < 1 || size > 15) {
        alert('Размер должен быть от 1 до 15');
        return;
    }
    
    // Создаём матрицу
    const matrix = [];
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            row.push(Math.floor(Math.random() * 100) + 1);
        }
        matrix.push(row);
    }
    
    // Отображаем матрицу
    renderMatrix('matrix-container', matrix);
    
    // Скрываем результаты
    document.getElementById('results').style.display = 'none';
}

// Отображение матрицы в таблице
function renderMatrix(containerId, matrix, highlight = null) {
    const container = document.getElementById(containerId);
    const n = matrix.length;
    
    let html = '<table><thead><tr><th></th>';
    
    for (let j = 0; j < n; j++) {
        html += `<th>Задача ${j}</th>`;
    }
    html += '</tr></thead><tbody>';
    
    for (let i = 0; i < n; i++) {
        html += `<tr><th>Работник ${i}</th>`;
        
        for (let j = 0; j < n; j++) {
            const isHighlight = highlight && highlight.some(p => p.row === i && p.col === j);
            const cellClass = isHighlight ? 'class="selected-cell"' : '';
            
            if (containerId === 'matrix-container') {
                html += `<td><input type="number" class="matrix-input" value="${matrix[i][j]}" 
                         data-row="${i}" data-col="${j}" /></td>`;
            } else {
                html += `<td ${cellClass}>${matrix[i][j]}</td>`;
            }
        }
        html += '</tr>';
    }
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

// Получить матрицу из интерфейса
function getMatrixFromUI() {
    const inputs = document.querySelectorAll('.matrix-input');
    const size = parseInt(document.getElementById('size-input').value);
    const matrix = [];
    
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            const val = parseInt(inputs[i * size + j].value) || 0;
            row.push(val);
        }
        matrix.push(row);
    }
    
    return matrix;
}

// Получить выбранный метод
function getSelectedMethod() {
    const selected = document.querySelector('input[name="method"]:checked');
    return selected ? selected.value : 'hungarian';
}

// Отправить матрицу на решение
async function solveMatrix() {
    const matrix = getMatrixFromUI();
    const method = getSelectedMethod();
    
    console.log(`🔧 Решение методом: ${method}`);
    
    try {
        const response = await fetch('/solve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matrix, method })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            alert('Ошибка: ' + (data.error || 'Неизвестная ошибка'));
            return;
        }
        
        console.log('✅ Результат:', data);
        
        // Отображаем результаты
        displayResults(data, matrix);
        
    } catch (error) {
        alert('Ошибка: ' + error.message);
    }
}

// Отображение результатов
function displayResults(data, matrix) {
    document.getElementById('algorithm-name').textContent = data.algorithm;
    document.getElementById('total-cost').textContent = data.total_cost;
    document.getElementById('exec-time').textContent = data.time;
    
    // Список назначений
    let html = '';
    for (const pair of data.assignments) {
        html += `<div class="assignment-item">
            <strong>Работник ${pair.row}</strong> → <strong>Задача ${pair.col}</strong> 
            (стоимость: ${pair.cost})
        </div>`;
    }
    document.getElementById('assignments-list').innerHTML = html;
    
    // Визуализация
    renderMatrix('result-matrix-container', matrix, data.assignments);
    
    // Показываем результаты
    document.getElementById('results').style.display = 'block';
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// Загрузка CSV файла
function handleCSVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const lines = e.target.result.split('\n').filter(l => l.trim());
            const matrix = [];
            
            for (const line of lines) {
                const row = line.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
                if (row.length > 0) {
                    matrix.push(row);
                }
            }
            
            if (matrix.length === 0 || matrix.length !== matrix[0].length) {
                alert('CSV должна содержать квадратную матрицу');
                return;
            }
            
            document.getElementById('size-input').value = matrix.length;
            renderMatrix('matrix-container', matrix);
            document.getElementById('results').style.display = 'none';
            
        } catch (error) {
            alert('Ошибка CSV: ' + error.message);
        }
    };
    
    reader.readAsText(file);
}
