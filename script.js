// Элементы
const passwordField = document.getElementById('password');
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const complexitySlider = document.getElementById('complexitySlider');
const complexityValue = document.getElementById('complexityValue');
const uppercaseChk = document.getElementById('uppercase');
const lowercaseChk = document.getElementById('lowercase');
const numbersChk = document.getElementById('numbers');
const symbolsChk = document.getElementById('symbols');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const strengthFill = document.getElementById('strengthFill');
const strengthLabel = document.getElementById('strengthLabel');
const strengthHint = document.getElementById('strengthHint');
const toast = document.getElementById('toast');

// Наборы символов
const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const lowercase = 'abcdefghijkmnopqrstuvwxyz';
const numbers = '0123456789';
const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Уведомление
function showToast(message) {
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) scale(1)';
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) scale(0.9)';
    }, 2000);
}

// Установка уровня сложности
function applyComplexityLevel(level) {
    if (level === 1) {
        uppercaseChk.checked = false;
        lowercaseChk.checked = true;
        numbersChk.checked = false;
        symbolsChk.checked = false;
        complexityValue.innerText = 'Простой';
    } else if (level === 2) {
        uppercaseChk.checked = true;
        lowercaseChk.checked = true;
        numbersChk.checked = true;
        symbolsChk.checked = false;
        complexityValue.innerText = 'Средний';
    } else if (level === 3) {
        uppercaseChk.checked = true;
        lowercaseChk.checked = true;
        numbersChk.checked = true;
        symbolsChk.checked = true;
        complexityValue.innerText = 'Сложный';
    } else if (level === 4) {
        uppercaseChk.checked = true;
        lowercaseChk.checked = true;
        numbersChk.checked = true;
        symbolsChk.checked = true;
        complexityValue.innerText = 'Максимум';
    }
    updatePassword();
}

// Синхронизация ползунка сложности
function syncComplexitySlider() {
    const up = uppercaseChk.checked;
    const low = lowercaseChk.checked;
    const num = numbersChk.checked;
    const sym = symbolsChk.checked;
    
    if (!up && low && !num && !sym) {
        complexitySlider.value = 1;
        complexityValue.innerText = 'Простой';
    } else if (up && low && num && !sym) {
        complexitySlider.value = 2;
        complexityValue.innerText = 'Средний';
    } else if (up && low && num && sym) {
        complexitySlider.value = 3;
        complexityValue.innerText = 'Сложный';
    } else {
        const count = (up ? 1 : 0) + (low ? 1 : 0) + (num ? 1 : 0) + (sym ? 1 : 0);
        if (count >= 3) {
            complexitySlider.value = 3;
            complexityValue.innerText = 'Сложный';
        } else if (count === 2) {
            complexitySlider.value = 2;
            complexityValue.innerText = 'Средний';
        } else {
            complexitySlider.value = 1;
            complexityValue.innerText = 'Простой';
        }
    }
}

// Генерация пароля
function generatePasswordFromOptions() {
    let chars = '';
    if (uppercaseChk.checked) chars += uppercase;
    if (lowercaseChk.checked) chars += lowercase;
    if (numbersChk.checked) chars += numbers;
    if (symbolsChk.checked) chars += symbols;
    
    const length = parseInt(lengthSlider.value);
    
    if (chars === '') {
        chars = lowercase;
        lowercaseChk.checked = true;
        showToast('Выбраны строчные буквы');
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
    }
    
    let required = [];
    if (uppercaseChk.checked) required.push(uppercase[Math.floor(Math.random() * uppercase.length)]);
    if (lowercaseChk.checked) required.push(lowercase[Math.floor(Math.random() * lowercase.length)]);
    if (numbersChk.checked) required.push(numbers[Math.floor(Math.random() * numbers.length)]);
    if (symbolsChk.checked) required.push(symbols[Math.floor(Math.random() * symbols.length)]);
    
    let passArr = password.split('');
    for (let i = 0; i < required.length && i < passArr.length; i++) {
        passArr[i] = required[i];
    }
    
    for (let i = passArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [passArr[i], passArr[j]] = [passArr[j], passArr[i]];
    }
    
    return passArr.join('');
}

// Оценка надежности
function updateStrengthMeter(password) {
    let score = 0;
    
    if (password.length >= 16) score += 30;
    else if (password.length >= 12) score += 20;
    else if (password.length >= 8) score += 12;
    
    if (/[A-Z]/.test(password)) score += 18;
    if (/[a-z]/.test(password)) score += 18;
    if (/[0-9]/.test(password)) score += 18;
    if (/[^A-Za-z0-9]/.test(password)) score += 22;
    
    let percent = Math.min(100, score);
    let label = '';
    let hint = '';
    let color = '';
    
    if (percent < 30) {
        label = 'Очень слабый';
        hint = 'Увеличьте длину или добавьте больше типов символов';
        color = '#c44';
    } else if (percent < 55) {
        label = 'Слабый';
        hint = 'Попробуйте добавить цифры или символы';
        color = '#e88';
    } else if (percent < 75) {
        label = 'Средний';
        hint = 'Неплохо, но можно усилить спецсимволами';
        color = '#eb6';
    } else if (percent < 90) {
        label = 'Хороший';
        hint = 'Надежный пароль для большинства сайтов';
        color = '#6b8';
    } else {
        label = 'Отличный!';
        hint = 'Максимальная защита!';
        color = '#4a8';
    }
    
    strengthFill.style.width = percent + '%';
    strengthFill.style.backgroundColor = color;
    strengthLabel.textContent = label;
    strengthHint.textContent = hint;
}

// Обновление пароля
function updatePassword() {
    const newPassword = generatePasswordFromOptions();
    passwordField.value = newPassword;
    updateStrengthMeter(newPassword);
}

// События
lengthSlider.addEventListener('input', (e) => {
    lengthValue.textContent = e.target.value;
    updatePassword();
});

complexitySlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    applyComplexityLevel(val);
});

generateBtn.addEventListener('click', () => {
    updatePassword();
    showToast('Новый пароль создан');
});

copyBtn.addEventListener('click', async () => {
    if (!passwordField.value) return;
    try {
        await navigator.clipboard.writeText(passwordField.value);
        showToast('Пароль скопирован!');
        copyBtn.style.transform = 'scale(0.95)';
        setTimeout(() => { copyBtn.style.transform = ''; }, 150);
    } catch {
        passwordField.select();
        document.execCommand('copy');
        showToast('Пароль скопирован!');
    }
});

const allCheckboxes = [uppercaseChk, lowercaseChk, numbersChk, symbolsChk];
allCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
        if (!uppercaseChk.checked && !lowercaseChk.checked && !numbersChk.checked && !symbolsChk.checked) {
            lowercaseChk.checked = true;
            showToast('Выберите хотя бы один тип символов');
        }
        syncComplexitySlider();
        updatePassword();
    });
});

// Запуск
applyComplexityLevel(3);
syncComplexitySlider();
updatePassword();
