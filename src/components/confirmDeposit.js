import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from "react-native";

import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon } from "react-native-elements";
import axios from "axios";
import { API_URL_DEPOSIT } from "@env";
import { useTranslation } from "react-i18next";

export default function ConfirmDeposit({ route }) {
  const { username, serviceName, serviceAccountNumber, depositAmount } =
    route.params;
  const { t } = useTranslation();
  const navigation = useNavigation();
  const userId = username;
  const [isModelVisible, setisModelVisible] = useState(false);
  const [showCountryCurrencyCode, setshowCountryCurrencyCode] = useState("");
  const [showCountryCurrency, setshowCountryCurrency] = useState("");

  const makeDeposit = () => {
    axios
      .post(API_URL_DEPOSIT, {
        username: username,
        serviceName: serviceName,
        serviceAccountNumber: serviceAccountNumber,
        depositAmount: -depositAmount,
      })
      .catch((error) => {
        alert("Error" + error);
      });

    setisModelVisible(true);
  };

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

  return (
    <View style={styles.main}>
      <SafeAreaView>
        <View style={styles.allcontaines}>
          <View style={styles.title}>
            <Text
              style={{
                fontSize: 25,
                fontWeight: 600,
              }}
            >
              {t("Deposit details")}
            </Text>
          </View>

          <View style={styles.container}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 400,
              }}
            >
              {t("Amount")}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              {isValidLanguageTag(showCountryCurrencyCode)
                ? new Intl.NumberFormat(showCountryCurrencyCode, {
                    style: "currency",
                    currency: showCountryCurrency,
                  }).format(depositAmount)
                : ""}
            </Text>
          </View>

          <View style={styles.container}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 400,
              }}
            >
              {t("Service")}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              {serviceName} . {serviceAccountNumber.substr(-4)}
            </Text>
          </View>

          <View style={styles.container}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 400,
              }}
            >
              {t("Date")}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              {t(moment().format("MMMM"))}
              {moment().format(" DD, YYYY")}
            </Text>
          </View>

          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <View style={{ paddingTop: 20 }}>
            <Text style={{ color: "#888" }}>
              <Text style={{ fontWeight: 600, color: "#888" }}>
                {t("Notice")} :{" "}
              </Text>
              {t(
                "You will receive a text message from your mobile wallet service to confirm the transacrion in order for the deposit to be completed."
              )}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.depositButton}
            onPress={() => makeDeposit()}
          >
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: "#fff",
                }}
              >
                {t("Make deposit")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Modal
        visible={isModelVisible}
        onRequestClose={() => setisModelVisible(false)}
        animationType="slide"
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F6F8" }}>
          <View style={styles.modelView}>
            <View style={styles.statusContainer}>
              <Icon name="watch-later" color={"#12A19B"} size={25} />
              <Text style={{ fontSize: 20, padding: 5, fontWeight: 500 }}>
                {t("Processing...")}
              </Text>
            </View>

            <View style={styles.amountContainer}>
              <Text style={{ fontSize: 35, fontWeight: 600 }}>
                {t("Your")}{" "}
                {isValidLanguageTag(showCountryCurrencyCode)
                  ? new Intl.NumberFormat(showCountryCurrencyCode, {
                      style: "currency",
                      currency: showCountryCurrency,
                    }).format(depositAmount)
                  : ""}{" "}
                {t("is now being deposit")}.
              </Text>
            </View>

            <View>
              <Icon name="assured-workload" size={60} color={"#12A19B"} />
            </View>

            <View style={styles.depositmethodContainer}>
              <Text style={{ fontSize: 16, fontWeight: 500 }}>
                {t("Deposited from")}
              </Text>
              <Text style={{ fontSize: 18, fontWeight: 500 }}>
                {serviceName} . {serviceAccountNumber.substr(-4)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => navigation.popTo("Home", { userId: username })}
            >
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: "#fff",
                  }}
                >
                  {t("Done")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 25,
    justifyContent: "flex-start",
  },
  title: {
    marginBottom: 50,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingBottom: 15,
  },

  allcontaines: {
    paddingTop: 75,
  },

  depositButton: {
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: "#12A19A",
    borderColor: "#12A19A",
    borderRadius: 5,
    marginTop: 60,
  },

  modelView: {
    padding: 20,
    paddingTop: 30,
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  amountContainer: {
    padding: 30,
    paddingBottom: 60,
    paddingTop: 60,
  },
  depositmethodContainer: {
    padding: 30,
    paddingTop: 60,
  },

  saveButton: {
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: "#12A19A",
    borderColor: "#12A19A",
    borderRadius: 5,
    marginTop: 30,
  },
});
