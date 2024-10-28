import { getWeather } from "./weather.services.js"

const _phoneScreen = document.querySelector(".phone-screen");
const _cityContainer = document.querySelector(".city-container");
const _city = _cityContainer.querySelector("#city");
const _selectCity = document.querySelector(".select-city");
const _hoverZoneCity = document.querySelector(".hover-zone-city");
const _settings = document.querySelector(".fa-gear");
const _weatherImg = document.getElementById('weather-img');
const _msgPopup = document.querySelector(".msg-popup");
const _overlay = document.querySelector(".overlay");
const _measureContainer = document.querySelector(".measure-container")
const _measure = _measureContainer.querySelector("#measure");
const _selectMeasure = document.querySelector(".select-measure");
const _hoverZoneMeasure = document.querySelector(".hover-zone-measure");
const _Xmark = document.querySelector(".fa-xmark");
// Details
const _todayTemp = document.querySelector(".today .temperature");
const _todayDesc = document.querySelector(".today .description");
const _todayDayNight = document.querySelector(".today .day-night-temp");
const _tomorrowDayNight = document.querySelector(".tomorrow .day-night-temp");
const _tomorrowImg = document.querySelector(".tomorrow .daily-img")
const _twoDaysDayNight = document.querySelector(".two-days .day-night-temp");
const _twoDaysImg = document.querySelector(".two-days .daily-img")
const _twoDaysDay = document.querySelector(".two-days .day");
const _threeDaysNight = document.querySelector(".three-days .day-night-temp");
const _threeDaysImg = document.querySelector(".three-days .daily-img")
const _threeDaysDay = document.querySelector(".three-days .day");
// Preference
const _dailyWeather = document.getElementById('dailyWeather');
const _weeklySummary = document.getElementById('weeklySummary');
const _rainAlert = document.getElementById('rainAlert');
const _severeWeather = document.getElementById('severeWeather');
const _notificationTime = document.getElementById('notificationTime');
_weeklySummary.addEventListener('change', savePreferences);
_rainAlert.addEventListener('change', savePreferences);
_severeWeather.addEventListener('change', savePreferences);
_notificationTime.addEventListener('change', savePreferences);
_dailyWeather.addEventListener('change', savePreferences);
function loadPreferences() {
    const storedPreferences = localStorage.getItem('weatherNotificationPreferences');
    if (storedPreferences) {
        const preferences = JSON.parse(storedPreferences);
        _dailyWeather.checked = preferences.dailyWeather || false;
        _weeklySummary.checked = preferences.weeklySummary || false;
        _rainAlert.checked = preferences.rainAlert || false;
        _severeWeather.checked = preferences.severeWeather || false;
        _notificationTime.value = preferences.notificationTime || '';
    }
}
loadPreferences();
function savePreferences() {
    const preferences = {
        dailyWeather: _dailyWeather.checked,
        weeklySummary: _weeklySummary.checked,
        rainAlert: _rainAlert.checked,
        severeWeather: _severeWeather.checked,
        notificationTime: _notificationTime.value
    };
    localStorage.setItem('weatherNotificationPreferences', JSON.stringify(preferences));
}

let currMeasure = 'metric'; //imperial // standard
let currCity  = 'new york';

// Hover listeners
_cityContainer.addEventListener("mouseover", displayCityList);
_cityContainer.addEventListener("mouseout", unDisplayCityList);
_measureContainer.addEventListener("mouseover", displayMeasureList);
_measureContainer.addEventListener("mouseout", unDisplayMeasureList);
_settings.addEventListener("mouseover", (e) => e.target.classList.add("fa-spin"));
_settings.addEventListener("mouseout", (e) => e.target.classList.remove("fa-spin"));
// Other listeners
_settings.addEventListener("click", displayPopup);
_overlay.addEventListener("click", unDisplayPopup);
_selectCity.addEventListener("click", (e) => handleSelectCityClick(e));
_selectMeasure.addEventListener("click", (e) => handleSelectMeasureClick(e))
_Xmark.addEventListener("click", unDisplayPopup);

// Default Execution
changeCity("new york");
const cities = [
    "Amsterdam",
    "Antarctica",
    "Athens",
    "Bangkok",
    "Barcelona",
    "Beijing",
    "Berlin",
    "Buenos Aires",
    "Cairo",
    "Cape Town",
    "Chicago",
    "Dubai",
    "Hong Kong",
    "Istanbul",
    "Jerusalem",
    "Lisbon",
    "London",
    "Los Angeles",
    "Mexico City",
    "Moscow",
    "Mumbai",
    "Nairobi",
    "New York",
    "Paris",
    "Rio de Janeiro",
    "Rome",
    "San Francisco",
    "Seoul",
    "Shanghai",
    "Singapore",
    "Sydney",
    "Tel Aviv",
    "Tokyo",
    "Toronto",
    "Vienna",
    "Washington D.C."
];
_selectCity.innerHTML = cities.map(city => `<li class="list-item">${city}</li>`).join("");

// Display functions
function displayCityList() {
    _selectCity.classList.add("open");
    _hoverZoneCity.classList.add("open");
    _hoverZoneCity.style.maxWidth = _hoverZoneCity.style.width = _selectCity.parentElement.querySelector("h1").offsetWidth + "px";
}
function unDisplayCityList() {
    _selectCity.classList.remove("open");
    _hoverZoneCity.classList.remove("open");
    _hoverZoneCity.style.maxWidth = '0px';
}
function displayPopup() {
    _overlay.classList.add("open");
    _msgPopup.classList.add("open");
}
function unDisplayPopup() {
    _overlay.classList.remove("open");
    _msgPopup.classList.remove("open");
}
function displayMeasureList() {
    _selectMeasure.classList.add("open");
    _hoverZoneMeasure.classList.add("open");
    _hoverZoneMeasure.style.maxWidth = _hoverZoneCity.style.width = _selectMeasure.parentElement.querySelector("h2").offsetWidth + "px";

}
function unDisplayMeasureList() {
    _selectMeasure.classList.remove("open");
    _hoverZoneMeasure.classList.remove("open");
    _hoverZoneMeasure.style.maxWidth = '0px';
}

// Selects
function handleSelectMeasureClick(e) {
    if(e.target.matches("li")){
        unDisplayMeasureList();
        const text = e.target.textContent;
        _measure.textContent = text;
        currMeasure = text === "Celsius" ? "metric" : text === "Kelvin" ? "standard" : "imperial";
        changeCity();
    }
}
function handleSelectCityClick(e) {
    if(e.target.matches("li")){
        unDisplayCityList();
        const text = e.target.textContent;
        _city.textContent = text;
        currCity = text;
        changeCity();
    }
}

// Main Change City
async function changeCity() {
    const data = (await getWeather(currCity,currMeasure)).list;

    const dailyTemps = {
        today: { day: null, night: null, desc: null },
        tomorrow: { day: null, night: null, desc: null },
        in2days: { day: null, night: null, desc: null },
        in3days: { day: null, night: null, desc: null }
    };
    const today = new Date();
    const hour = today.getHours();
    // const hour = 21; //night
    const todayStr = today.toISOString().split('T')[0];
    data.forEach(entry => {
        const dateTime = new Date(entry.dt_txt);
        const dateStr = dateTime.toISOString().split('T')[0]; // (YYYY-MM-DD)
        const timeStr = dateTime.toISOString().split('T')[1].slice(0, -5); // (HH:mm:ss)

        // Determine the time difference in days between today and the current entry
        const dayDifference = (new Date(dateStr) - new Date(todayStr)) / (1000 * 60 * 60 * 24);
        if (dayDifference === 0 && isTimeInRange(timeStr, 11, 13)) {
            dailyTemps.today.day = parseInt(entry.main.temp);
            dailyTemps.today.desc = entry.weather[0].description;
        } else if (dayDifference === 0 && isTimeInRange(timeStr, 22, 2)) {
            dailyTemps.today.night = parseInt(entry.main.temp);
        } else if (dayDifference === 1 && isTimeInRange(timeStr, 11, 13)) {
            dailyTemps.tomorrow.day = parseInt(entry.main.temp);
            dailyTemps.tomorrow.desc = entry.weather[0].description;
        } else if (dayDifference === 1 && isTimeInRange(timeStr, 22, 2)) {
            dailyTemps.tomorrow.night = parseInt(entry.main.temp);
        } else if (dayDifference === 2 && isTimeInRange(timeStr, 11, 13)) {
            dailyTemps.in2days.day = parseInt(entry.main.temp);
            dailyTemps.in2days.desc = entry.weather[0].description;
            _twoDaysDay.textContent = dateTime.toLocaleString('en-US', { weekday: 'long' });
        } else if (dayDifference === 2 && isTimeInRange(timeStr, 22, 2)) {
            dailyTemps.in2days.night = parseInt(entry.main.temp);
        } else if (dayDifference === 3 && isTimeInRange(timeStr, 11, 13)) {
            dailyTemps.in3days.day = parseInt(entry.main.temp);
            dailyTemps.in3days.desc = entry.weather[0].description;
            _threeDaysDay.textContent = dateTime.toLocaleString('en-US', { weekday: 'long' });
        } else if (dayDifference === 3 && isTimeInRange(timeStr, 22, 2)) {
            dailyTemps.in3days.night = parseInt(entry.main.temp);
        }
    });
    if(!dailyTemps.today.day){
        dailyTemps.today.day = parseInt(data[0].main.temp);
        dailyTemps.today.desc = data[0].weather[0].description;
    }

    _todayTemp.textContent = parseInt(data[0].main.temp) + '°';
    _todayDesc.textContent = dailyTemps.today.desc;

    _weatherImg.style.backgroundImage = `url(./assets/${hour >= 19 ? "night-":""}${categorizeWeather(dailyTemps.today.desc)}.png)`;
    _phoneScreen.style.backgroundColor = `var(--background-${hour >= 19 ? "night" : categorizeWeather(dailyTemps.today.desc)})`;

    _tomorrowImg.style.backgroundImage = `url(./assets/${hour >= 19 ? "night-":""}${categorizeWeather(dailyTemps.tomorrow.desc)}.png)`;
    _twoDaysImg.style.backgroundImage = `url(./assets/${hour >= 19 ? "night-":""}${categorizeWeather(dailyTemps.in2days.desc)}.png)`;
    _threeDaysImg.style.backgroundImage = `url(./assets/${hour >= 19 ? "night-":""}${categorizeWeather(dailyTemps.in3days.desc)}.png)`;
    
    _todayDayNight.textContent = `${dailyTemps.today.day}°/${dailyTemps.today.night}°`;
    _tomorrowDayNight.textContent = `${dailyTemps.tomorrow.day}°/${dailyTemps.tomorrow.night}°`;
    _twoDaysDayNight.textContent = `${dailyTemps.in2days.day}°/${dailyTemps.in2days.night}°`;
    _threeDaysNight.textContent = `${dailyTemps.in3days.day}°/${dailyTemps.in3days.night}°`;
}
function isTimeInRange(timeStr, start, end) {
    const time = new Date(`1970-01-01T${timeStr}Z`).getHours();
    if (start > end)
        return time >= start || time <= end;
    return time >= start && time <= end;
}
function categorizeWeather(description) {
    if(!description) return 'unknown';
    const desc = description.toLowerCase();
    if (desc.includes('sun') || desc.includes('clear')) {
        return 'clear';
    } else if (desc.includes('cloud') || desc.includes('overcast')) {
        return 'cloudy';
    } else if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('shower')) {
        return 'rainy';
    } else if (desc.includes('snow') || desc.includes('sleet') || desc.includes('flurry')) {
        return 'snowy';
    } else if (desc.includes('thunder') || desc.includes('storm')) {
        return 'stormy';
    } else {
        return 'unknown';
    }
}

// TIME
function updateTime() {
    const timeElement = document.querySelector('.time');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;
    timeElement.textContent = currentTime;
}
setInterval(updateTime, 1000);
updateTime();