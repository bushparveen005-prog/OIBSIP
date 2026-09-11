// State variables to keep track of the arithmetic inputs
let currentInput = '0';
let previousInput = '';
let activeOperator = null;
let shouldResetDisplay = false;

// DOM Elements
const currentDisplayElement = document.getElementById('current-operand');
const previousDisplayElement = document.getElementById('previous-operand');
const buttonsGrid = document.querySelector('.buttons-grid');

// Universal Event Listener on parent container (Event Delegation)
buttonsGrid.addEventListener('click', (event) => {
    const target = event.target;

    // Exit early if a gap or non-button layout piece is clicked
    if (!target.matches('button')) return;

    const value = target.textContent;
    const action = target.dataset.action;
    const operator = target.dataset.operator;

    if (target.classList.contains('number')) {
        if (action === 'decimal') {
            appendDecimal();
        } else {
            appendNumber(value);
        }
    } else if (target.classList.contains('operator')) {
        handleOperator(operator, value);
    } else if (target.classList.contains('control')) {
        if (action === 'clear') resetCalculator();
        if (action === 'backspace') deleteLastInput();
    } else if (target.id === 'equals-btn') {
        computeExpression();
    }

    updateDisplay();
});

function appendNumber(number) {
    // Prevent multiple leading zeroes
    if (currentInput === '0' && number === '0') return;
    
    // Clear initial 0 or replace input if a previous calculation just ended
    if (currentInput === '0' || shouldResetDisplay) {
        currentInput = number;
        shouldResetDisplay = false;
    } else {
        currentInput += number;
    }
}

function appendDecimal() {
    if (shouldResetDisplay) {
        currentInput = '0.';
        shouldResetDisplay = false;
        return;
    }
    // Prevent typing multiple dots in one number string
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
}

function handleOperator(nextOperator, operatorSymbol) {
    const parsedCurrent = parseFloat(currentInput);

    // If an error is on screen, clear it before performing operations
    if (isNaN(parsedCurrent) && currentInput === "Error") {
        resetCalculator();
        return;
    }

    // Allow operator chaining seamlessly
    if (activeOperator && !shouldResetDisplay) {
        computeExpression();
    }

    previousInput = currentInput;
    activeOperator = nextOperator;
    shouldResetDisplay = true;
}

function computeExpression() {
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    // Verify both numbers exist prior to math operations
    if (isNaN(prev) || isNaN(current)) return;

    // Safe math operational logic block replacing dangerous eval() execution
    switch (activeOperator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            // Handle division-by-zero runtime error smoothly
            if (current === 0) {
                currentInput = 'Error';
                previousInput = '';
                activeOperator = null;
                shouldResetDisplay = true;
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }

    // Convert output safely back to a readable base string
    currentInput = result.toString();
    activeOperator = null;
    previousInput = '';
    shouldResetDisplay = true;
}

function deleteLastInput() {
    if (currentInput === 'Error' || currentInput.length === 1) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
}

function resetCalculator() {
    currentInput = '0';
    previousInput = '';
    activeOperator = null;
    shouldResetDisplay = false;
}

function updateDisplay() {
    currentDisplayElement.textContent = currentInput;
    
    // Map internal variable codes (* and /) back to user-friendly operators (× and ÷)
    if (activeOperator != null) {
        let displaySymbol = activeOperator;
        if (activeOperator === '*') displaySymbol = '×';
        if (activeOperator === '/') displaySymbol = '÷';
        previousDisplayElement.textContent = `${previousInput} ${displaySymbol}`;
    } else {
        previousDisplayElement.textContent = '';
    }
}
