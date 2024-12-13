import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import colors from "./color";

function CustomHeader({ title }) {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 45,
    backgroundColor: colors.appBackground,

    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default CustomHeader;
