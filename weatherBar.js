import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import getCurrentWeather from "./currentWeather";
import getCurrentLocation from "./currentWeather";

export default function WeatherBar() {
  const [weatherData, setWeatherData] = useState({ description: "clear" });
  const [loading, setLoading] = useState(true);

  // You may fetch weatherData from an API and update it in useEffect

  useEffect(() => {
    // Simulate fetching weather data
    setTimeout(() => {
      setWeatherData({ description: "cloudy" });
      setLoading(false);
    }, 2000);
  }, []);

  const condition = weatherData.description;
  const backgroundImage = getImageSource(condition);
  const backgroundColor = getBackgroundColor(condition);

  function getBackgroundColor(condition) {
    if (condition === "clear") {
      return "#4a90e2"; // Light Yellow
    } else if (condition.includes("cloud")) {
      return "#54717a"; // Light Sky Blue
    } else if (condition.includes("rain")) {
      return "#57575d"; // Steel Blue
    } else {
      return "#4a90e2"; // Light Yellow (default)
    }
  }

  function getImageSource(condition) {
    if (condition === "clear") {
      return require("./Assets/Images/sea_sunnypng.png");
    } else if (condition.includes("cloud")) {
      return require("./Assets/Images/sea_cloudy.png");
    } else if (condition.includes("rain")) {
      return require("./Assets/Images/sea_rainy.png");
    } else {
      return require("./Assets/Images/sea_sunnypng.png");
    }
  }

  useEffect(() => {
    // Get the user's current location
    getCurrentLocation()
      .then(({ latitude, longitude }) => {
        // Call the weather API based on the obtained location
        return getCurrentWeather(latitude, longitude);
      })
      .then((data) => {
        if (data) {
          setWeatherData(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const fecthWeatherData = async () => {
      const { lattitude, longitude } = await getCurrentLocation();
      const weather = await getCurrentWeather();
      setWeatherData(weather);
    };

    fecthWeatherData();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Image source={backgroundImage} style={styles.backgroundImage} />

      {weatherData ? ( // Check if weatherData is not null
        <View style={styles.temperatureColumn}>
          <Text style={styles.tempDegree}>{weatherData.temperature}°</Text>
          <Text style={styles.conditionText}>{weatherData.description}</Text>
        </View>
      ) : (
        <Text style={styles.value}>Loading...</Text> // Show a loading message while data is being fetched
      )}

      <View style={styles.temperatureDiv}>
        {weatherData !== null ? (
          <View style={styles.column}>
            <Text style={styles.value}>{weatherData.tempLow}°C</Text>
            <Text style={styles.label}>min</Text>
          </View>
        ) : (
          <Text style={styles.value}>Loading...</Text>
        )}

        {weatherData !== null ? (
          <View style={styles.column}>
            <Text style={styles.value}>{weatherData.temperature}°C</Text>
            <Text style={styles.label}>Current</Text>
          </View>
        ) : (
          <Text style={styles.value}>Loading...</Text>
        )}

        {weatherData !== null ? (
          <View style={styles.column}>
            <Text style={styles.value}>{weatherData.tempMax}°C</Text>
            <Text style={styles.label}>max</Text>
          </View>
        ) : (
          <Text style={styles.value}>Loading...</Text>
        )}
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 100,
    top: 0,
  },
  flexItemImage: {
    display: "flex",
  },
  temperatureDiv: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    top: 250,
  },

  WeekForecastDiv: {
    width: "100%",
    flexDirection: "column", // Stack columns vertically
  },
  column: {
    alignItems: "center",
    textAlign: "center",
    width: "70%",
  },
  dayContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20, // Add spacing between stacked days
  },
  dayDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  tempDegree: {
    fontSize: 90,
    color: "white",
    fontWeight: "600",
  },
  conditionText: {
    fontSize: 40,
    color: "white",
    fontWeight: "600",
  },
  temperatureColumn: {
    position: "absolute",
    alignItems: "center",
    top: 50,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
  },
  label: {
    color: "white",
    fontSize: 20,
  },
  value: {
    color: "white",
    fontSize: 25,
    fontWeight: "600",
  },
  icons: {
    width: 25,
    height: 25,
  },
  weatherBar: {
    flex: 1,
  },
});
