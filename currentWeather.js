import axios from "axios";
import Geolocation from "react-native-geolocation-service";

//Declaring variables for the Google geolocation & OpenWeather API key
const GOOGLE_GEOLOCATION_API_KEY = "AIzaSyB-UnGYL8sCsOxbEmzVRi-L-WSnFSoyvGI";
const OPENWEATHERMAP_API_KEY = "7345747c2481a6ee0beb4b799895892c";
const GEOLOCATION_API_URL =
  "https://www.googleapis.com/geolocation/v1/geolocate";
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

//Creating a function that will fetch the current location of the user
function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
}

// Below will be a function to get the current weather in the respective geolocation
const getCurrentWeather = async () => {
  try {
    const { latitude, longitude } = await getCurrentLocation();

    // Call Google Geolocation API to get the user's location details
    const geolocationResponse = await axios.post(
      `${GEOLOCATION_API_URL}?key=${GOOGLE_GEOLOCATION_API_KEY}`,
      {}
    );

    if (geolocationResponse.data && geolocationResponse.data.location) {
      const { lat, lng } = geolocationResponse.data.location;

      // Call OpenWeatherMap API to get the current weather based on latitude and longitude
      const weatherResponse = await axios.get(
        `${WEATHER_API_URL}?lat=${lat}&lon=${lng}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`
      );

      //Decalre variables we will use to push data into the User Interface
      if (weatherResponse.status === 200) {
        const weatherData = weatherResponse.data;
        const temperature = Math.round(weatherData.main.temp);
        const description = weatherData.weather[0].description;
        const tempLow = Math.round(weatherData.main.temp_min);
        const tempMax = Math.round(weatherData.main.temp_max);

        return { temperature, description, tempLow, tempMax };
      } else {
        throw new Error("Failed to fetch weather data");
      }
    } else {
      throw new Error("Failed to fetch location data");
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

export default getCurrentWeather;
