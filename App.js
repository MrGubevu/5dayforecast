import React from "react";
import { View, StyleSheet } from "react-native";
import WeatherComponent from "./Weather.js";

const App = () => {
  return (
    <View style={styles.container}>
      <WeatherComponent />
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
