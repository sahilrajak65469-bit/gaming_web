let display = document.getElementById('display');
let expression = '';

function appendNumber(num) {
    expression += num;
    updateDisplay();
}

function appendOperator(op) {
    // Prevent multiple operators in a row
    if (expression === '' || /[+\-*/]$/.test(expression)) {
        if (expression === '') return;
        // Replace the last operator
        expression = expression.slice(0, -1) + op;
    } else {
        expression += op;
    }
    updateDisplay();
}

function appendDecimal() {
    // Check if decimal already exists in the current number
    const parts = expression.split(/[+\-*/]/);
    const lastNumber = parts[parts.length - 1];
    
    if (!lastNumber.includes('.')) {
        if (expression === '' || /[+\-*/]$/.test(expression)) {
            expression += '0.';
        } else {
            expression += '.';
        }
        updateDisplay();
    }
}

function clearDisplay() {
    expression = '';
    updateDisplay();
}

function backspace() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

function updateDisplay() {
    display.value = expression || '0';
}

function calculate() {
    if (expression === '') return;
    
    try {
        // Evaluate the expression safely
        const result = Function('"use strict"; return (' + expression + ')')();
        
        // Round to avoid floating point errors
        expression = Math.round(result * 100000000) / 100000000;
        updateDisplay();
    } catch (error) {
        display.value = 'Error';
        expression = '';
        setTimeout(() => {
            display.value = '0';
        }, 1500);
    }
}

// Allow keyboard input
document.addEventListener('keydown', (e) => {
    const key = e.key;
    
    if (/[0-9.]/.test(key)) {
        appendNumber(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
        e.preventDefault();
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
    } else if (key === 'Backspace') {
        e.preventDefault();
        backspace();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        e.preventDefault();
        clearDisplay();
    }
});

// Initialize display
updateDisplay();
