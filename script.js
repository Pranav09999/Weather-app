const apiKey = '8fa87ecdadb9ca5260f8f3bfd792c607'; // Replace with your OpenWeatherMap API key
const fetchDataButton = document.getElementById('fetch-data');
const cityInput = document.getElementById('city-input');
const dataDisplay = document.getElementById('data-display');

fetchDataButton.addEventListener('click', handleWeatherRequest);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleWeatherRequest();
    }
});

function handleWeatherRequest() {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    } else {
        showError('Please enter a city name');
    }
}

async function fetchWeatherData(city) {
    showLoading();
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
            throw new Error(response.status === 404 ? 'City not found' : 'Failed to fetch weather data');
        }

        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        showError(error.message);
    }
}

function showLoading() {
    dataDisplay.innerHTML = `<div class="loading">Loading weather data...</div>`;
}

function showError(message) {
    dataDisplay.innerHTML = `<p class="error-message">${message}</p>`;
}

function displayWeatherData(data) {
    const { main, weather, name, sys, wind } = data;
    const weatherCard = `
        <div class="weather-card">
            <h2>${name}, ${sys.country}</h2>
            <div class="weather-info">
                <div class="temperature">${Math.round(main.temp)}°C</div>
                <div class="description">${weather[0].description}</div>
            </div>
            <div class="details">
                <div class="detail-item">
                    <strong>Feels like:</strong> ${Math.round(main.feels_like)}°C
                </div>
                <div class="detail-item">
                    <strong>Humidity:</strong> ${main.humidity}%
                </div>
                <div class="detail-item">
                    <strong>Pressure:</strong> ${main.pressure} hPa
                </div>
                <div class="detail-item">
                    <strong>Wind Speed:</strong> ${wind.speed} m/s
                </div>
            </div>
        </div>
    `;
    dataDisplay.innerHTML = weatherCard;
}
