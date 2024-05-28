const apiKey = '43f60bd188c6b30ba67f95d06ddf4f24';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

//погда для Києва при завантаженні сторінки 
window.addEventListener('load', () => {
    fetchWeather('Kyiv');
});

const locationInput = document.querySelector('#locationInput');
const searchBtn = document.querySelector('#search');
const locationEl = document.querySelector('#location');
const temperatureEl = document.querySelector('#temperature');
const descriptionEl = document.querySelector('#description');
const windEl = document.querySelector('#wind');
const forecast5div = document.querySelector('.fivedays');

let currentUnits = 'metric';

// визначення активних метричних одиниць (°C або °F)
const unitsBtnContainer = document.querySelector('.units-container');
const celsBtn = document.querySelector('#cels-btn');
const fahrBtn = document.querySelector('#fahr-btn');
unitsBtnContainer.addEventListener('click', (e) => {
    addActiveClass(e.target);
    fetchWeather(locationEl.innerHTML);
});

function addActiveClass(el) {
    if (el.id === 'cels-btn') {
        currentUnits = 'metric';
        fahrBtn.classList.remove('active');
    } else if (el.id === 'fahr-btn') {
        currentUnits = 'imperial';
        celsBtn.classList.remove('active');
    }
    el.classList.add('active');
}

searchBtn.addEventListener('click', () => {
    if (locationInput.value) {
        fetchWeather(locationInput.value);
    }
});

locationInput.addEventListener('keydown', function (e) {
    if (locationInput.value && (e.key === 'Enter')) {
        fetchWeather(locationInput.value);
    }
});

function fetchWeather(location) {

    let currentLocation = location;

    let url = `${apiUrl}?q=${currentLocation}&appid=${apiKey}&units=${currentUnits}&lang=ua&date=ua`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let weatherIcon = data.weather[0].icon;
            locationEl.textContent = data.name;
            temperatureEl.innerHTML = `<span>${Math.round(data.main.temp)}°</span> <img src= "https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="Weather icon">`;
            descriptionEl.innerHTML = `<span>відч. як ${Math.round(data.main.feels_like)}°</span> <span>${data.weather[0].description}</span>`;
            windEl.innerHTML = `<p>Швидкість вітру - ${data.wind.speed}м/с</p>`;
        })
        .catch(error => {
            console.error('Error fetching weather data: ', error);
        });

    url = `https://api.openweathermap.org/data/2.5/forecast?q=${currentLocation}&appid=${apiKey}&units=${currentUnits}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let forecastHtml = "";

            // Loop through the forecast data and create HTML for each day
            for (let i = 0; i < data.list.length; i += 8) {
                const day = data.list[i];
                const date = new Date(day.dt * 1000);
                const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
                const description = day.weather[0].description;
                const temp = Math.round(day.main.temp); // Convert temperature to Celsius

                forecastHtml += `
                        <div class="weather-day">
                            <div class="weather-date">${date.toLocaleDateString()}</div>
                            <div class="weather-icon"><img src="${iconUrl}" alt="${description}" /></div>
                            <div class="weather-description">${description}</div>
                            <div class="weather-temp">${temp}°</div>
                        </div>
                    `;
            }
            // Add the HTML to the widget
            forecast5div.innerHTML = forecastHtml;
        })
        .catch(error => console.error(error.message));

    locationInput.value = '';
}
