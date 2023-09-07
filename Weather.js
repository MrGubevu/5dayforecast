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
    // Declaring varibles for the API key & the API url
    const apiKey = "ea746b888533cc57dee30c0998719314";
    const apiUrl =
      "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}";

    // Getting user's location using geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Replacing placeholders in the URL with actual latitude, longitude, and API key
        const url = apiUrl
          .replace("{lat}", latitude)
          .replace("{lon}", longitude)
          .replace("{API key}", apiKey);

        // Fetching the 5-day weather forecast data
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
          }) //Error handlers to handle bad requests
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

  //Creating variables to be used in the User Interface
  const renderForecastItem = ({ item }) => {
    const timestamp = item.dt;
    const date = new Date(timestamp * 1000);
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    const kelvinTemperature = item.main.temp;
    const celsiusTemperature = (kelvinTemperature - 273.15).toFixed(0); // Round to two decimal places
    return (
      <View style={styles.forecastItem}>
        <View>
          <Text style={styles.textFont}>{dayOfWeek}</Text>
        </View>

        <Image
          source={require("./assets/partlysunny@2x.png")}
          style={styles.weatherIcon}
        />

        <View>
          <Text style={styles.textFont}>{celsiusTemperature}°C</Text>
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
    paddingBottom: 30,
  },

  forecastItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "space-between",
    width: "340px",
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  weatherIcon: {
    width: "30px",
  },
  textStyle: {
    color: "#fff",
  },
  textFont: {
    color: "white",
    fontSize: 20,
  },
});

export default WeatherComponent;
