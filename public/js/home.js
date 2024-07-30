const weatherApiKey = '54e5fa763dd39a887729e98f2ca75202';
const city = 'Madrid'; // העיר שתרצה להציג את מזג האוויר שלה
const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherApiKey}&units=metric`;

function getShopPage() {
    window.location.assign('/products');
}

function displayWeather(data) {
    const weatherElement = $('#weather-container');
    let weatherForecast = '<h2>Weekly Weather :</h2>';
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDate = new Date();
    for (let i = 0; i < 7; i++) {
        const nextDay = new Date(currentDate);
        nextDay.setDate(currentDate.getDate() + i);
        const dayOfWeek = daysOfWeek[nextDay.getDay()];
        const weatherForDay = findWeatherForDate(data.list, nextDay);
        if (weatherForDay) {
            const weatherDescription = weatherForDay.weather[0].description;
            const temperature = Math.round(weatherForDay.main.temp);
            const iconCode = weatherForDay.weather[0].icon;
            const iconImage = `<img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${weatherDescription}" class="weather-icon">`;
            const details = `<div class="forecast-details">Weather: ${weatherDescription}, Temperature: ${temperature}°C</div>`;
            if (i === 0) {
                weatherForecast += `<div class="daily-forecast"><p class="forecast-title">Today ${iconImage}</p>${details}</div>`;
            } else {
                weatherForecast += `<div class="daily-forecast"><p class="forecast-title">${dayOfWeek} ${iconImage}</p>${details}</div>`;
            }
        }
    }
    weatherElement.html(weatherForecast);
}

function findWeatherForDate(weatherList, date) {
    const targetDate = date.toISOString().split('T')[0];
    return weatherList.find(weather => weather.dt_txt.includes(targetDate));
}

$(document).ready(function() {
    $.ajax({
        url: weatherApiUrl,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            displayWeather(data);
        },
        error: function(error) {
            console.log('An error occurred while fetching data from the OpenWeatherMap API:', error);
        }
    });
});