import React from "react";
import { View, StyleSheet } from "react-native";
import WeatherComponent from "./Weather.js";
import WeatherBar from "./weatherBar.js";

const App = () => {
  return (
    <View style={styles.container}>
      <WeatherComponent />
      <WeatherBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
