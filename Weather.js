import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  SafeAreaView,
} from "react-native";

const WeatherComponent = () => {
  const [forecastData, setForecastData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Define the API key and URL template
    const apiKey = "ea746b888533cc57dee30c0998719314";
    const apiUrl =
      "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}";

    // Get user's location using geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Replace placeholders in the URL with actual latitude, longitude, and API key
        const url = apiUrl
          .replace("{lat}", latitude)
          .replace("{lon}", longitude)
          .replace("{API key}", apiKey);

        // Fetch the 5-day weather forecast data
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            // Filter the data to get one reading per day
            const uniqueDays = {};
            const filteredData = data.list.filter((item) => {
              const date = new Date(item.dt * 1000).toLocaleDateString("en-US");
              if (!uniqueDays[date]) {
                uniqueDays[date] = true;
                return true;
              }
              return false;
            });

            setForecastData(filteredData);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching weather data:", error);
            setIsLoading(false);
          });
      },
      (error) => {
        console.error("Error getting user's location:", error);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  const renderForecastItem = ({ item }) => {
    const timestamp = item.dt;
    const date = new Date(timestamp * 1000);
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    const kelvinTemperature = item.main.temp;
    const celsiusTemperature = (kelvinTemperature - 273.15).toFixed(0); // Round to two decimal places
    return (
      <View style={styles.forecastItem}>
        <View>
          <Text>{dayOfWeek}</Text>
        </View>

        <Image
          source={require("./assets/partlysunny@2x.png")}
          style={styles.weatherIcon}
        />

        <View>
          <Text>{celsiusTemperature}°C</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {isLoading ? (
          <Text>Loading forecast data...</Text>
        ) : (
          <FlatList data={forecastData} renderItem={renderForecastItem} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  forecastItem: {
    backgroundColor: "#54717a",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "space-between",
    width: "300px",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  weatherIcon: {
    width: "20px",
  },
  textStyle: {
    color: "#fff",
  },
});

export default WeatherComponent;
