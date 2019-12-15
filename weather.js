const LOCINFO_LS_KEY = "latlong";
const WEATHER_API_KEY = "9106f7e0d0a10df6040f22a4ae561764";

const imperialList = [
  "BS",
  "PW",
  "BZ",
  "KY",
  "FM",
  "MH",
  "US",
  "UM",
  "PR",
  "VI",
  "GU"
];

const locationInfo = {
  latitude: "",
  longitude: ""
};

const loadLocationWeatherInfo = async () => {
  console.log("loading location information");
  const loadedLocation = localStorage.getItem(LOCINFO_LS_KEY);
  if (loadedLocation === null) {
    console.log("no saved location info found. asking...");
    askForlatlong();
  } else {
    const parsedLocation = JSON.parse(loadedLocation);
    console.log(
      `location information loaded lat: ${parsedLocation.latitude}, long: ${parsedLocation.longitude}`
    );
    loadUpdateWeather(parsedLocation.latitude, parsedLocation.longitude);
  }
};

const askForlatlong = async () => {
  console.log("asking for current position");
  navigator.geolocation.getCurrentPosition(
    latLongAcquireSuccess,
    latLongAcquireFail
  );
};

const latLongAcquireSuccess = async acquiredLoc => {
  console.log(
    `location information fetched. lat: ${acquiredLoc.coords.latitude}, long: ${acquiredLoc.coords.longitude}`
  );
  locationInfo.longitude = acquiredLoc.coords.longitude;
  locationInfo.latitude = acquiredLoc.coords.latitude;
  const jsonLoc = JSON.stringify(locationInfo);
  console.log(`saving to local storage: ${jsonLoc} as ${LOCINFO_LS_KEY}`);
  localStorage.setItem(LOCINFO_LS_KEY, jsonLoc);
  await loadUpdateWeather(locationInfo.latitude, locationInfo.longitude);
};

const latLongAcquireFail = () => {
  console.log("failed to get latitude and longitude");
  location = null;
};

const getWeather = async (lat, long) => {
  console.log("fetching weather info");
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${WEATHER_API_KEY}`
  );
  const json = await response.json();
  console.log("fetching weather complete", json);
  return {
    weatherID: json.weather[0].id,
    weather: json.weather[0].main,
    temp: json.main.temp,
    country: json.sys.country,
    town: json.name,
    sunrise: json.sys.sunrise * 1000,
    sunset: json.sys.sunset * 1000,
    icon: json.weather[0].icon
  };
};

const kelvin2F = kelvin => {
  return Math.round(((kelvin - 273.15) * 9) / 5 + 32);
};

const kelvin2C = kelvin => {
  return Math.round(kelvin - 273.15);
};

const updateTemp = (kelvin, country) => {
  console.log("updating temperature");
  if (imperialList.includes(country)) {
    console.log("country in imperial unit. converting to F");
    document.getElementById("temperature").innerText = `${kelvin2F(kelvin)}°`;
  } else {
    console.log("country in SI unit. converting to C");
    document.getElementById("temperature").innerText = `${kelvin2C(kelvin)}°`;
  }
};

const updateTown = town => {
  console.log("updating town name");
  document.getElementById("town").innerText = town;
};

const hideAllWeatherIcon = () => {
  Array.from(document.getElementsByClassName("weather-icon")).forEach(
    element => {
      element.style.display = "none";
    }
  );
};
const updateWeatherIcon = weatherCode => {
  console.log("updating weather icon");
  hideAllWeatherIcon();
  if (weatherCode === 800) {
    document.getElementById("clear").style.display = "block";
  } else if (weatherCode === 801) {
    document.getElementById("few-clouds").style.display = "block";
  } else if (
    weatherCode === 802 ||
    weatherCode === 803 ||
    weatherCode === 804
  ) {
    document.getElementById("clouds").style.display = "block";
  } else if (Math.floor(weatherCode / 700) === 1) {
    document.getElementById("mist").style.display = "block";
  } else if (weatherCode >= 500 && weatherCode < 511) {
    document.getElementById("shower").style.display = "block";
  } else if (weatherCode <= 531 && weatherCode > 511) {
    document.getElementById("rain").style.display = "block";
  } else if (Math.floor(weatherCode / 700) === 1) {
    document.getElementById("shower").style.display = "block";
  } else if (Math.floor(weatherCode / 200) === 1) {
    document.getElementById("thunderstorm").style.display = "block";
  }
};

const loadUpdateWeather = async (lat, long) => {
  console.log(`loading weather information at lat: ${lat}, long: ${long}`);
  const weather = await getWeather(lat, long);
  updateTemp(weather.temp, weather.country);
  updateTown(weather.town);
  updateWeatherIcon(weather.weatherID);
};
const weatherInit = async () => {
  updateWeatherIcon(800);
  loadLocationWeatherInfo();
  setInterval(loadLocationWeatherInfo, 600000);
};

weatherInit();
