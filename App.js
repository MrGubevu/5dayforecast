import React from "react";
import { View, StyleSheet } from "react-native";
import WeatherComponent from "./Weather.js";
import WeatherBar from "./weatherBar.js";

const App = () => {
  return (
    <View style={styles.container}>
      <WeatherBar />
      <WeatherComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4a90e2",
  },
});

export default App;
