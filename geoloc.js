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

const weatherInfo = {
  weatherID: 0,
  weather: "",
  temp: 0,
  country: "",
  town: "",
  sunrise: 0,
  sunset: 0
};

const loadLocationInfo = async () => {
  console.log("loading location information");
  const loadedLocation = localStorage.getItem(LOCINFO_LS_KEY);
  if (loadedLocation === null) {
    console.log("no saved location info found. asking...");
    await askForlatlong();
  } else {
    const parsedLocation = JSON.parse(loadedLocation);
    locationInfo.longitude = parsedLocation.longitude;
    locationInfo.latitude = parsedLocation.latitude;
    locationInfo.neighborhood = parsedLocation.neighborhood;
    console.log("location information loaded");
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
  console.log("latitude and longitude acquired. parsing");
  locationInfo.longitude = acquiredLoc.coords.longitude;
  locationInfo.latitude = acquiredLoc.coords.latitude;
  const jsonLoc = JSON.stringify(locationInfo);
  console.log(`saving to local storage: ${jsonLoc} as ${LOCINFO_LS_KEY}`);
  localStorage.setItem(LOCINFO_LS_KEY, jsonLoc);
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
  console.log("fetching weather complete");
  weatherInfo.weatherID = json.weather[0].id;
  weatherInfo.weather = json.weather[0].main;
  weatherInfo.temp = json.main.temp;
  weatherInfo.country = json.sys.country;
  weatherInfo.town = json.name;
  weatherInfo.sunrise = json.sys.sunrise * 1000;
  weatherInfo.sunset = json.sys.sunset * 1000;
  console.log(JSON.stringify(weatherInfo));
};

const kelvin2F = kelvin => {
  return Math.round(((kelvin - 273.15) * 9) / 5 + 32);
};

const kelvin2C = kelvin => {
  return Math.round(kelvin - 273.15);
};

const weatherInit = () => {
  document.getElementById("clear").style.display = "block";
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
  console.log("updating location");
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
    document.getElementById("showers-rain").style.display = "block";
  } else if (weatherCode <= 531 && weatherCode > 511) {
    document.getElementById("rain").style.display = "block";
  } else if (Math.floor(weatherCode / 700) === 1) {
    document.getElementById("shower").style.display = "block";
  } else if (Math.floor(weatherCode / 200) === 1) {
    document.getElementById("thunderstorm").style.display = "block";
  }
};

const geolocInit = async () => {
  weatherInit();
  await loadLocationInfo();
  await getWeather(locationInfo.latitude, locationInfo.longitude);
  updateTemp(weatherInfo.temp, weatherInfo.country);
  updateTown(weatherInfo.town);
  updateWeatherIcon(weatherInfo.weatherID);
};

geolocInit();
