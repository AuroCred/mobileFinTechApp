import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Button,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon } from "react-native-elements";
import colors from "./color";

export default function Welcome() {
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate("Home", { userId: "dercio1988" });
  };

  return (
    <View style={styles.mainContainer}>
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.Primary,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    alignItems: "center",
    margin: 20,
  },
});
