let city = 'Madrid'; // The city to display weather for
let weatherApiKey = ''; // API key for OpenWeatherMap
let weatherApiUrl = '';

// Fetch the weather data when the document is ready
$(document).ready(async function() {
    const res = await getWeatherApi()
    if(res){
        $.ajax({
            url: weatherApiUrl,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                displayWeather(data); // Display the weather data on success
            },
            error: function(error) {
                console.log('An error occurred while fetching data from the OpenWeatherMap API:', error);
            }
        });
    }
});

async function getWeatherApi(){
    try{
        const key = await $.ajax({
            url: '/weatherAPI', 
            method: 'GET',
            contentType: 'application/json'
        })
        weatherApiKey = key
        weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherApiKey}&units=metric`
        return true
    } catch(error){
        console.error('Error:', error);
        return false
    }
}

function getShopPage() {
    window.location.assign('/products'); // Redirect to the products page
}

function displayWeather(data) {
    const weatherElement = $('#weather-container');
    let weatherForecast = '<h2>Weekly Weather :</h2>'; // Header for weather forecast
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDate = new Date(); // Get the current date

    for (let i = 0; i < 7; i++) { // Loop for 7 days forecast
        const nextDay = new Date(currentDate);
        nextDay.setDate(currentDate.getDate() + i);
        const dayOfWeek = daysOfWeek[nextDay.getDay()];
        const weatherForDay = findWeatherForDate(data.list, nextDay);

        if (weatherForDay) { // If weather data is found for the day
            const weatherDescription = weatherForDay.weather[0].description;
            const temperature = Math.round(weatherForDay.main.temp);
            const iconCode = weatherForDay.weather[0].icon;
            const iconImage = `<img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${weatherDescription}" class="weather-icon">`;
            const details = `<div class="forecast-details">Weather: ${weatherDescription}, Temperature: ${temperature}°C</div>`;
            
            // Add today's weather or the weather for other days
            if (i === 0) {
                weatherForecast += `<div class="daily-forecast"><p class="forecast-title">Today ${iconImage}</p>${details}</div>`;
            } else {
                weatherForecast += `<div class="daily-forecast"><p class="forecast-title">${dayOfWeek} ${iconImage}</p>${details}</div>`;
            }
        }
    }
    weatherElement.html(weatherForecast); // Display the weather forecast
}

function findWeatherForDate(weatherList, date) {
    const targetDate = date.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
    return weatherList.find(weather => weather.dt_txt.includes(targetDate)); // Find the weather data for the specific date
}


