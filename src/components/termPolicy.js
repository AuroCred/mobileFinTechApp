import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CheckBox } from "react-native-elements";
import { Swipeable } from "react-native-gesture-handler";

export default function TermPolicy() {
  return (
    <View style={styles.container}>
      <Text>Swipe me!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  container: {
    padding: 100,
    backgroundColor: "white",
  },
  actionsContainer: {
    flexDirection: "row",
  },
  actionButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 75,
    height: "100%",
  },
  actionText: {
    color: "white",
  },
});
