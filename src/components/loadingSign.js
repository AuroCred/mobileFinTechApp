import React from "react";
import { View, StyleSheet, Text } from "react-native";
import AnimatedLoader from "react-native-animated-loader";
import colors from "./color";
import PropTypes from "prop-types";

const LoadingSign = ({ visible }) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <AnimatedLoader
        visible={visible}
        overlayColor={colors.appBackground}
        source={require("../../loading/loader.json")}
        animationStyle={styles.lottie}
        speed={1}
      >
        <Text style={styles.text}>Sign in...</Text>
      </AnimatedLoader>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: 200,
    height: 200,
  },
  text: {
    top: -30,
    fontSize: 16,
    color: colors.Secundary,
  },
});

LoadingSign.propTypes = {
  visible: PropTypes.bool.isRequired,
};

export default LoadingSign;