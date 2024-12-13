import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Button,
  KeyboardAvoidingView,
  Platform,
  Vibration,
  Pressable,
  Alert,
} from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Haptics from "expo-haptics";
import { API_URL_DEPOSIT_METHOD_DEFAULT, API_URL_RECENT } from "@env";
import axios from "axios";

export default function DepositPage({ route }) {
  const { userId, serviceName, serviceAccountNumber } = route.params;
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [depositAmount, setdepositAmount] = useState("");
  const [depositDefaultFrom, setdepositDefaultFrom] = useState("");

  const [depositServiceNameDefault, setdepositServiceNameDefault] =
    useState("");

  const [showCountryCurrencyCode, setshowCountryCurrencyCode] = useState("");
  const [showCountryCurrency, setshowCountryCurrency] = useState("");

  // Function to handle number inputs
  const handleNumberInput = (num) => {
    if (depositAmount === "" || depositAmount === "0") {
      setdepositAmount(num.toString());
    } else if (depositAmount.length == 6) {
      setdepositAmount(depositAmount);
    } else {
      setdepositAmount(depositAmount + num);
    }
  };

  const handlePointInput = (point) => {
    const specialCharater = /[.]/;

    if (specialCharater.test(depositAmount)) {
      setdepositAmount(depositAmount);
    } else if (depositAmount === "") {
      setdepositAmount(0 + point);
    } else {
      setdepositAmount(depositAmount + point);
    }
  };

  // Function to handle clear button press

  const backspace = () => {
    if (depositAmount !== "") {
      const deletedNumber = depositAmount.slice(0, depositAmount.length - 1);
      setdepositAmount(deletedNumber);
    }
  };

  function impactAsync(style) {
    switch (style) {
      case "light":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "medium":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      default:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
    }
  }

  const nextpage = () => {
    if (depositAmount == "" || depositAmount == "0") {
      Vibration.vibrate();
      Alert.alert(t("Insert deposit amount!", ""));
    } else if (depositDefaultFrom == "" && serviceAccountNumber == "0") {
      navigation.navigate("DepositMethod", {
        depositAmount: depositAmount,
        userId: userId,
      });
    } else if (serviceAccountNumber == "0") {
      navigation.navigate("ConfirmDeposit", {
        username: userId,
        serviceName: depositServiceNameDefault,
        serviceAccountNumber: depositDefaultFrom,
        depositAmount: depositAmount,
      });
    } else {
      navigation.navigate("ConfirmDeposit", {
        username: userId,
        serviceName: serviceName,
        serviceAccountNumber: serviceAccountNumber,
        depositAmount: depositAmount,
      });
    }
  };
  useEffect(() => {
    axios

      .get(API_URL_DEPOSIT_METHOD_DEFAULT, {
        params: {
          param: userId,
        },
      })

      .then((response) => {
        setdepositServiceNameDefault(response.data[0].transaction_service_name);
        setdepositDefaultFrom(
          response.data[0].transaction_service_account_number
        );
      })

      .catch((error) => {
        alert("Error" + error);
      });
  }, [userId]);

  useEffect(() => {
    const getCurrencyCode = async () => {
      const userCountryCurrencyCode = `${userId}${userId}`;
      const userCountryCurrency = `${userId}${userId}${userId}`;
      try {
        const countryCurrencyCode = await AsyncStorage.getItem(
          userCountryCurrencyCode
        );
        const countryCurrency = await AsyncStorage.getItem(userCountryCurrency);

        setshowCountryCurrencyCode(countryCurrencyCode);
        setshowCountryCurrency(countryCurrency);
      } catch (error) {
        console.error("Error retrieving language code:", error);
        // setLoading(false);
      }
    };

    getCurrencyCode();
  }, []);

  const isValidLanguageTag = (tag) => {
    try {
      new Intl.NumberFormat(tag);

      return true;
    } catch (e) {
      return false;
    }
  };

  const depositDefault = () => {
    if (depositDefaultFrom == "" && serviceAccountNumber == "0") {
      return (
        <Pressable
          onPress={() =>
            navigation.navigate("ChangeDepositMethod", { userId: userId })
          }
        >
          <View style={styles.depositDefaultFrom}>
            <View>
              <View>
                <Text>{t("Select")}</Text>
              </View>
              <View>
                <TextInput
                  onChangeText={setdepositDefaultFrom}
                  value=""
                  placeholder="Mobile wallet"
                  placeholderTextColor={"black"}
                  showSoftInputOnFocus={false}
                  editable={false}
                  style={{ fontSize: 18, fontWeight: "500" }}
                ></TextInput>
              </View>
            </View>

            <View>
              <Icon name="chevron-right" size={25} />
            </View>
          </View>
        </Pressable>
      );
    } else if (serviceAccountNumber == "0") {
      return (
        <Pressable
          onPress={() =>
            navigation.navigate("ChangeDepositMethod", { userId: userId })
          }
        >
          <View style={styles.depositDefaultFrom}>
            <View>
              <Icon name="phone-iphone" color={"#12A19B"} size={30} />
            </View>
            <View>
              <View>
                <Text>{t("Default")}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 18, fontWeight: 500 }}>
                  {depositServiceNameDefault} . {depositDefaultFrom.substr(-4)}
                </Text>
              </View>
            </View>
            <View>
              <Icon name="chevron-right" size={25} />
            </View>
          </View>
        </Pressable>
      );
    } else {
      return (
        <Pressable
          onPress={() =>
            navigation.navigate("ChangeDepositMethod", { userId: userId })
          }
        >
          <View style={styles.depositDefaultFrom}>
            <View>
              <Icon name="phone-iphone" color={"#12A19B"} size={30} />
            </View>
            <View>
              <View>
                <Text>{t("Default")}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 18, fontWeight: 500 }}>
                  {serviceName} . {serviceAccountNumber.substr(-4)}
                </Text>
              </View>
            </View>
            <View>
              <Icon name="chevron-right" size={25} />
            </View>
          </View>
        </Pressable>
      );
    }
  };

  return (
    <View style={styles.mainView}>
      <View style={styles.amountView}>
        <Text style={{ fontSize: 16 }}>{showCountryCurrency}</Text>

        <TextInput
          onChangeText={setdepositAmount}
          value={
            isValidLanguageTag(showCountryCurrencyCode)
              ? new Intl.NumberFormat(showCountryCurrencyCode, {
                  minimumFractionDigits: 0,
                }).format(depositAmount)
              : ""
          }
          placeholder="0"
          placeholderTextColor={"black"}
          showSoftInputOnFocus={false}
          editable={false}
          style={[
            depositAmount.length > 3 ? styles.mediunSize : styles.largeSize,
          ]}
        />
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {depositDefault()}
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleNumberInput(1);
              impactAsync("medium");
            }}
          >
            <Text style={styles.buttonText}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleNumberInput(2);
              impactAsync("medium");
            }}
          >
            <Text style={styles.buttonText}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleNumberInput(3);
              impactAsync("medium");
            }}
          >
            <Text style={styles.buttonText}>3</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleNumberInput(4);
              impactAsync("medium");
            }}
          >
            <Text style={styles.buttonText}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleNumberInput(5);
              impactAsync("medium");
            }}
          >
            <Text style={styles.buttonText}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleNumberInput(6);
              impactAsync("medium");
            }}
          >
            <Text style={styles.buttonText}>6</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleNumberInput(7);
              impactAsync("medium");
            }}
          >
            <Text style={styles.buttonText}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleNumberInput(8);
              impactAsync("medium");
            }}
          >
            <Text style={styles.buttonText}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleNumberInput(9);
              impactAsync("medium");
            }}
          >
            <Text style={styles.buttonText}>9</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handlePointInput(".");
              impactAsync("medium");
            }}
          >
            <Text style={styles.buttonText}>.</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleNumberInput(0);
              impactAsync("medium");
            }}
          >
            <Text style={styles.buttonText}>0</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              backspace();
              impactAsync("medium");
            }}
          >
            <Icon name="backspace" style={styles.buttonText} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.buttonTouchOpacity}
        onPress={() => nextpage()}
      >
        <View style={styles.buttonView}>
          <Text style={{ fontSize: 18, color: "#fff", fontWeight: "600" }}>
            {t("Next")}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: "space-evenly",
    backgroundColor: "#F5F6F8",
    paddingTop: 50,
  },

  amountView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F6F8",
  },
  depositDefaultFrom: {
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: "#DDDEE0",
    width: "auto",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  buttonTouchOpacity: {
    paddingLeft: 35,
    paddingRight: 35,
  },

  buttonView: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#12A19B",
    borderRadius: 5,
  },

  buttonContainer: {
    width: "auto",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },

  buttonText: {
    fontSize: 25,
    color: "#333",
  },

  largeSize: {
    width: "auto",
    fontSize: 70,
    fontWeight: "600",
    textAlign: "center",
  },
  mediunSize: {
    width: "auto",
    fontSize: 60,
    fontWeight: "600",
    textAlign: "center",
  },
});
