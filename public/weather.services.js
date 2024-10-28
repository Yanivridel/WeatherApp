let WEATHER_API;

async function initialize() {
    try {
        const response = await fetch('/api/key');
        const data = await response.json();
        WEATHER_API = data.WEATHER_API;
    } catch (error) {
        console.error('Error fetching api key:', error);
    }
}
await initialize();

const baseUrl = 'https://api.openweathermap.org/data/2.5';

export function getWeather(country, measure) {
    return fetch(`${baseUrl}/forecast?q=${country}&units=${measure}&appid=${WEATHER_API}`)
    .then(response => response.json())
    .catch(err => console.log("Error fetching weather: " + err));
}
