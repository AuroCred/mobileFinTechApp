import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { API_URL_BALANCE, API_URL_ALL_TRANS } from "@env";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";

import colors from "./color";

export default function CustomerAccount({ userId, setLoading }) {
  const navigation = useNavigation();
  const [balanceSummary, setbalanceSummary] = useState("");
  const [accountNumber, setaccountNumber] = useState("");

  const [status, setstatus] = useState("");
  const { t } = useTranslation();
  const [showCountryCurrencyCode, setshowCountryCurrencyCode] = useState("");
  const [showCountryCurrency, setshowCountryCurrency] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(API_URL_BALANCE, {
        params: {
          param: userId,
        },
      });
      const data = response.data[0];
      setbalanceSummary(data.balanceAmount);
      setaccountNumber(data.accountNumber);

      setstatus(data.status);

      const userCountryCurrencyCode = `${userId}${userId}`;
      const userCountryCurrency = `${userId}${userId}${userId}`;

      const accountCountryCurrencyCode = await AsyncStorage.getItem(
        userCountryCurrencyCode
      );
      const accountCountryCurrency = await AsyncStorage.getItem(
        userCountryCurrency
      );

      setshowCountryCurrencyCode(accountCountryCurrencyCode);
      setshowCountryCurrency(accountCountryCurrency);

      // const Countrylanguage = acctlanguageCode || "en";
      // const Countrycode = acctCountryCode || "US";
      // const Countrycurrency = acctCountryCurrency || "USD";

      setLoading(false);
    } catch (error) {
      alert("Error: " + error);
      setLoading(false);
    }
  }, [userId, setLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const swipeableRef = useRef(null);
  const renderRightActions = () => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          navigation.navigate("Deposit", {
            userId: userId,
            serviceName: "0",
            serviceAccountNumber: "0",
          });
          swipeableRef.current.close();
        }}
      >
        <Text style={styles.actionText}>{t("Pay loan")}</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={styles.actionButton}
        onPress={() => alert("Button 2 pressed")}
      >
        <Text style={styles.actionText}>Button 2</Text>
      </TouchableOpacity> */}
    </View>
  );

  const isValidLanguageTag = (tag) => {
    try {
      new Intl.NumberFormat(tag);

      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <>
      <View style={styles.accountCustomerNumberView}>
        <Text
          style={{
            color: colors.compBackground,
            fontWeight: 500,
            fontSize: 17,
          }}
        >
          {t("Accounts")}
        </Text>
      </View>

      <GestureHandlerRootView style={{ flex: 1 }}>
        <Swipeable
          ref={swipeableRef}
          renderRightActions={renderRightActions}
          overshootRight={false}
          gestureEnabled={false}
          //renderLeftActions={() => null} // Prevent swipe from left
          //onSwipeableLeftOpen={() => null} // Prevent swipe from left
          onSwipeableRightOpen={() => null}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AccountDetail", {
                userId: userId,
                accountNumb: accountNumber,
              })
            }
          >
            <View style={styles.accountInfoView}>
              <View style={styles.accountNumber}>
                <Text Text style={{ fontSize: 16 }}>
                  {t("Credit")} (...{accountNumber.substr(-4)})
                </Text>
                <Icon name="chevron-right" color={""} size={20} />
              </View>
              <View style={styles.accountBalanceView}>
                <Text style={{ fontSize: 25, fontWeight: 500 }}>
                  {isValidLanguageTag(showCountryCurrencyCode)
                    ? new Intl.NumberFormat(showCountryCurrencyCode, {
                        minimumFractionDigits: 2,
                      }).format(balanceSummary)
                    : ""}
                </Text>
                <Icon
                  name="drag-indicator"
                  size={25}
                  color={colors.Secundary}
                />
              </View>

              <View style={styles.accountStatusView}>
                <Text style={{ fontSize: 14 }}>{t(status)}</Text>

                <Text style={{ fontSize: 14, paddingRight: 25 }}>
                  {t("Amount to be paid")}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Swipeable>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  accountInfoView: {
    borderWidth: 1,
    borderColor: colors.BorderColor,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: colors.compBackground,
    padding: 10,
  },

  accountCustomerNumberView: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.Primary,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.Primary,
  },
  accountNumber: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  accountBalanceView: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  accountStatusView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  actionsContainer: {
    flexDirection: "row",
  },
  actionButton: {
    backgroundColor: colors.Secundary,
    justifyContent: "center",
    alignItems: "center",
    width: 112,
    height: "100%",
    marginLeft: -2,

    borderBottomRightRadius: 5,
  },
  actionText: {
    color: colors.compBackground,
    fontWeight: 800,
    fontSize: 15,
  },
});
