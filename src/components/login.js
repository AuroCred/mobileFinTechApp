import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon } from "react-native-elements";
import { API_URL_LOGIN, API_URL_USER_ACCOUNT } from "@env";
import axios from "axios";
import LottieView from "lottie-react-native";
import colors from "./color";

export default function Login() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [responses, setResponses] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  const loginUrl = API_URL_LOGIN;
  const userAccountUrl = API_URL_USER_ACCOUNT;

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (username && password) {
      axios
        .get(loginUrl, { params: { username, password } })
        .then((response) => {
          if (isMounted.current) {
            setResponses(response.data);
          }
        })
        .catch((error) => {
          alert("Error: " + error);
        });
    }
  }, [username, password]);

  const userLogin = useCallback(async () => {
    if (!username || !password) {
      Alert.alert("", "Please insert username and password.");
    } else if (responses === "error") {
      Alert.alert("", "Username or password is incorrect.");
    } else {
      // setLoading(true);
      try {
        const response = await axios.get(userAccountUrl, {
          params: { param: username },
          timeout: 10000, // 10s timeout
        });
        const LanguageCode = response.data[0].language_code;
        const CountryCurrencyCode = response.data[0].currency_code;
        const CountryCurrency = response.data[0].country_currency;

        const userLanguageCode = `${username}`;
        const userCountryCurrencyCode = `${username}${username}`;
        const userCountryCurrency = `${username}${username}${username}`;

        setTimeout(async () => {
          await AsyncStorage.setItem(userLanguageCode, LanguageCode);
          await AsyncStorage.setItem(
            userCountryCurrencyCode,
            CountryCurrencyCode
          );
          await AsyncStorage.setItem(userCountryCurrency, CountryCurrency);

          navigation.navigate("Home", { userId: username });

          setPassword("");
          setShowPassword(false);
          setLoading(false);
        }, 3000);
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(true);
      }
    }
  }, [username, password, responses]);

  return (
    <>
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1, zIndex: 1000, backgroundColor: colors.appBackground }}
      >
        <View style={styles.mainContainer}>
          <View style={styles.childContainer1}>
            <View style={styles.logo}>
              <Image
                source={require("../../assets/auroLogo.png")}
                resizeMode="contain"
                style={{
                  width: 180,
                  height: 180,
                }}
              />
            </View>
          </View>
          <ScrollView>
            <View style={styles.childContainer2}>
              <View>
                <View style={styles.title}>
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>
                    Username
                  </Text>
                </View>
                <View style={styles.inputuser}>
                  <TextInput
                    onChangeText={(value) => setUsername(value)}
                    style={{
                      fontSize: 16,
                      padding: 12,
                    }}
                  />
                </View>
              </View>

              <View>
                <View style={styles.title}>
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>
                    Password
                  </Text>
                </View>
                <View style={styles.inputpass}>
                  <TextInput
                    onChangeText={(value) => setPassword(value)}
                    value={password}
                    secureTextEntry={!showPassword}
                    style={{
                      fontSize: 16,
                      width: "90%",
                      padding: 12,
                    }}
                  />
                  <Icon
                    name={showPassword ? "visibility" : "visibility-off"}
                    size={24}
                    color={colors.Primary}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.signin}
                onPress={() => userLogin()}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.compBackground,
                    fontWeight: "500",
                  }}
                >
                  Sign in
                </Text>
              </TouchableOpacity>

              <View style={styles.loginRecover}>
                <TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: colors.Primary,
                    }}
                  >
                    Forgot username
                  </Text>
                </TouchableOpacity>

                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.Secundary,
                      fontWeight: 500,
                    }}
                  >
                    or
                  </Text>
                </View>

                <TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: colors.Primary,
                    }}
                  >
                    password?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <Modal visible={loading} animationType="fade" transparent={true}>
            <View style={styles.container}>
              <View>
                <LottieView
                  style={{ width: 200, height: 200 }}
                  source={require("../../loading/loader.json")}
                  autoPlay
                  loop
                  scale={1}
                />
                {/* <Text style={styles.text}>Sign in...</Text> */}
              </View>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  mainContainer: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: colors.appBackground,
    justifyContent: "space-around",
  },

  childContainer1: {
    flex: 5,
    backgroundColor: colors.Primary,
  },

  childContainer2: {
    flex: 5,
    justifyContent: "flex-start",
    alignContent: "center",
    backgroundColor: colors.appBackground,
    padding: 20,
    paddingBottom: 0,
  },

  logo: {
    alignItems: "center",
    margin: 20,
  },

  title: {
    padding: 10,
    paddingLeft: 0,
  },
  inputuser: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.Secundary,
  },
  inputpass: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.Secundary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  signin: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 15,
    backgroundColor: colors.Primary,
    borderColor: colors.Primary,
    alignItems: "center",
  },

  loginRecover: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
