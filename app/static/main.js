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
let currentMatrix = null;

// Ждём загрузку документа
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // Документ уже загружен
    initApp();
}

function initApp() {
    console.log('✅ App initialized');

    // Проверяем, что элементы существуют
    const generateBtn = document.getElementById('generate-btn');
    const solveBtn = document.getElementById('solve-btn');
    const csvUpload = document.getElementById('csv-upload');

    if (!generateBtn) {
        console.error('❌ generate-btn не найдена');
        return;
    }
    if (!solveBtn) {
        console.error('❌ solve-btn не найдена');
        return;
    }

    console.log('✅ Все элементы найдены');

    // Регистрируем обработчики событий
    generateBtn.addEventListener('click', generateMatrix);
    solveBtn.addEventListener('click', solveMatrix);

    if (csvUpload) {
        csvUpload.addEventListener('change', handleCSVUpload);
    }

    // Генерируем первую матрицу автоматически
    generateMatrix();
}

function generateMatrix() {
    console.log('🔄 Генерирование матрицы...');

    const sizeInput = document.getElementById('size-input');
    const size = parseInt(sizeInput.value) || 3;

    console.log(`📊 Размер матрицы: ${size}x${size}`);

    if (size < 1 || size > 15) {
        showError('Размер матрицы должен быть от 1 до 15');
        return;
    }

    // Создаём матрицу со случайными числами
    currentMatrix = [];
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
        currentMatrix.push(row);
    }

    console.log('📝 Матрица создана:', currentMatrix);

    // Рендерим матрицу
    renderMatrix('matrix-container', currentMatrix);

    // Скрываем результаты предыдущего решения
    const resultsSection = document.getElementById('results');
    if (resultsSection) {
        resultsSection.style.display = 'none';
    }

    hideError();
    console.log('✅ Матрица отрисована');
}

function renderMatrix(containerId, matrix, highlightPairs = null) {
    console.log(`🎨 Рендеринг матрицы в ${containerId}`);

    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`❌ Контейнер ${containerId} не найден`);
        return;
    }

    const n = matrix.length;

    let html = '<table class="data-table">';

    // Заголовок таблицы
    html += '<thead><tr><th></th>';
    for (let j = 0; j < n; j++) {
        html += `<th>Задача ${j}</th>`;
    }
    html += '</tr></thead>';

    // Тело таблицы
    html += '<tbody>';
    for (let i = 0; i < n; i++) {
        html += `<tr><th>Работник ${i}</th>`;
        for (let j = 0; j < n; j++) {
            const isHighlighted = highlightPairs && highlightPairs.some(p => p.row === i && p.col === j);
            const cellClass = isHighlighted ? 'class="selected-cell"' : '';

            if (containerId === 'matrix-container') {
                // Input для редактирования
                html += `<td><input type="number" class="matrix-input" value="${matrix[i][j]}"
                         data-row="${i}" data-col="${j}" /></td>`;
            } else {
                // Только для просмотра результатов
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
    html += '</tbody></table>';

    container.innerHTML = html;
    console.log('✅ Таблица отрисована');
}

function getMatrixFromUI() {
    console.log('📥 Считываем матрицу с UI');

    const inputs = document.querySelectorAll('.matrix-input');
    console.log(`   Найдено ${inputs.length} input элементов`);

    const values = Array.from(inputs).map(input => {
        const val = parseFloat(input.value);
        return isNaN(val) ? 0 : val;
    });

    const size = parseInt(document.getElementById('size-input').value) || 3;
    const matrix = [];

    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            row.push(values[i * size + j]);
        }
        matrix.push(row);
    }

    console.log('✅ Матрица прочитана:', matrix);
    return matrix;
}

async function solveMatrix() {
    console.log('🚀 Отправляем матрицу на решение...');

    try {
        hideError();
        const matrix = getMatrixFromUI();

        if (!matrix || matrix.length === 0) {
            showError('Введите матрицу');
            return;
        }

        console.log('📤 Отправляем POST запрос к /solve');
        console.log('   Данные:', { matrix });

        const response = await fetch('/solve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ matrix })
        });

        console.log(`📩 Ответ получен со статусом: ${response.status}`);

        const data = await response.json();
        console.log('   Данные ответа:', data);

        if (!response.ok) {
            showError(data.error || `Ошибка: ${response.status}`);
            console.error('❌ Ошибка от сервера:', data);
            return;
        }

        displayResults(data);
    } catch (err) {
        showError(`Ошибка: ${err.message}`);
        console.error('❌ Критическая ошибка:', err);
    }
}

function displayResults(data) {
    console.log('📊 Отображаем результаты');
    console.log('   Данные:', data);

    const resultsSection = document.getElementById('results');
    if (!resultsSection) {
        console.error('❌ results section не найдена');
        return;
    }

    // Заполняем данные результатов
    const totalCostEl = document.getElementById('total-cost');
    const execTimeEl = document.getElementById('exec-time');
    const assignmentsListEl = document.getElementById('assignments-list');

    if (totalCostEl) totalCostEl.textContent = data.total_cost;
    if (execTimeEl) execTimeEl.textContent = data.time;

    // Список назначений
    let assignmentsHTML = '';
    for (const pair of data.assignments) {
        assignmentsHTML += `
            <div class="assignment-item">
                <strong>Работник ${pair.row}</strong> → <strong>Задача ${pair.col}</strong>
                (стоимость: <span style="color: #D62828;">${pair.cost}</span>)
            </div>
        `;
    }
    if (assignmentsListEl) {
        assignmentsListEl.innerHTML = assignmentsHTML;
    }

    // Визуализация результатов на матрице
    const matrix = getMatrixFromUI();
    renderMatrix('result-matrix-container', matrix, data.assignments);

    // Показываем результаты
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });

    console.log('✅ Результаты отображены');
}

function handleCSVUpload(event) {
    console.log('📁 CSV загрузка...');

    const file = event.target.files[0];
    if (!file) {
        console.log('   Файл не выбран');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const content = e.target.result;
            const lines = content.split('\n').filter(line => line.trim());
            const matrix = [];

            for (const line of lines) {
                const row = line.split(',').map(val => parseFloat(val.trim())).filter(val => !isNaN(val));
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

            if (matrix.length === 0 || matrix.length !== matrix[0].length) {
                showError('CSV должен содержать квадратную матрицу (n×n)');
                return;
            }

            currentMatrix = matrix;
            document.getElementById('size-input').value = matrix.length;
            renderMatrix('matrix-container', matrix);
            hideError();

            console.log('✅ CSV загружена:', matrix);
        } catch (err) {
            showError(`Ошибка при чтении CSV: ${err.message}`);
            console.error('❌ CSV ошибка:', err);
        }
    };
    reader.readAsText(file);
}

function showError(message) {
    console.error('⚠️  Ошибка:', message);

    let errorDiv = document.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        const main = document.querySelector('main');
        if (main) {
            main.insertBefore(errorDiv, main.firstChild);
        }
    }

    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.classList.add('active');
}

function hideError() {
    const errorDiv = document.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.style.display = 'none';
        errorDiv.classList.remove('active');
    }
}

console.log('✅ main.js загружен');
