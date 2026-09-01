document.getElementById('convertBtn').addEventListener('click', performConversion);

function performConversion() {
    const inputVal = document.getElementById('tempInput').value.trim();
    const unit = document.getElementById('unitSelect').value;
    const errorMsg = document.getElementById('errorMessage');
    
    const celsiusRes = document.getElementById('celsiusResult');
    const fahrenheitRes = document.getElementById('fahrenheitResult');
    const kelvinRes = document.getElementById('kelvinResult');

    if (inputVal === '' || isNaN(inputVal)) {
        errorMsg.textContent = 'Please enter a valid numeric value.';
        errorMsg.style.display = 'block';
        return;
    }
    
    const numValue = parseFloat(inputVal);

    if ((unit === 'celsius' && numValue < -273.15) ||
        (unit === 'fahrenheit' && numValue < -459.67) ||
        (unit === 'kelvin' && numValue < 0)) {
        errorMsg.textContent = 'Temperature below absolute zero is not possible.';
        errorMsg.style.display = 'block';
        return;
    }

    errorMsg.style.display = 'none';

    let celsius, fahrenheit, kelvin;

    if (unit === 'celsius') {
        celsius = numValue;
        fahrenheit = (numValue * 9 / 5) + 32;
        kelvin = numValue + 273.15;
    } else if (unit === 'fahrenheit') {
        celsius = (numValue - 32) * 5 / 9;
        fahrenheit = numValue;
        kelvin = celsius + 273.15;
    } else if (unit === 'kelvin') {
        celsius = numValue - 273.15;
        fahrenheit = (celsius * 9 / 5) + 32;
        kelvin = numValue;
    }

    celsiusRes.textContent = `Celsius: ${celsius.toFixed(2)} °C`;
    fahrenheitRes.textContent = `Fahrenheit: ${fahrenheit.toFixed(2)} °F`;
    kelvinRes.textContent = `Kelvin: ${kelvin.toFixed(2)} K`;
}
