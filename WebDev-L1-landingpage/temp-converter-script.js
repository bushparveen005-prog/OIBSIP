const tempValueInput = document.getElementById('tempValue');
const inputUnitSelect = document.getElementById('inputUnit');
const convertBtn = document.getElementById('convertBtn');
const errorText = document.getElementById('errorText');
const resultsContainer = document.getElementById('resultsContainer');

const resultCelsius = document.getElementById('resultCelsius');
const resultFahrenheit = document.getElementById('resultFahrenheit');
const resultKelvin = document.getElementById('resultKelvin');

convertBtn.addEventListener('click', () => {
  const rawValue = tempValueInput.value.trim();

  // Validate numeric input
  if (rawValue === '' || isNaN(rawValue)) {
    showError('Please enter a valid number.');
    return;
  }

  const value = parseFloat(rawValue);
  const unit = inputUnitSelect.value;

  // Convert input to Celsius as a common base
  let celsius;
  switch (unit) {
    case 'celsius':
      celsius = value;
      break;
    case 'fahrenheit':
      celsius = (value - 32) * (5 / 9);
      break;
    case 'kelvin':
      celsius = value - 273.15;
      break;
  }

  // Edge case: absolute zero violation
  if (celsius < -273.15) {
    showError('Temperature cannot be below absolute zero (-273.15°C).');
    return;
  }

  hideError();

  const fahrenheit = celsius * (9 / 5) + 32;
  const kelvin = celsius + 273.15;

  resultCelsius.textContent = `Celsius: ${celsius.toFixed(2)} °C`;
  resultFahrenheit.textContent = `Fahrenheit: ${fahrenheit.toFixed(2)} °F`;
  resultKelvin.textContent = `Kelvin: ${kelvin.toFixed(2)} K`;

  resultsContainer.style.display = 'block';
});

function showError(message) {
  errorText.textContent = message;
  errorText.style.display = 'block';
  resultsContainer.style.display = 'none';
}

function hideError() {
  errorText.style.display = 'none';
}
