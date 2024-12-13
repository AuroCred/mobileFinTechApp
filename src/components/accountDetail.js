import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  SafeAreaView,
} from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import RecentTransactions from "./recentTransactions";
import { API_URL_BALANCE, API_URL_ALL_TRANS } from "@env";
import axios from "axios";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomHeader from "./customHeader";
import colors from "./color";

export default function AccountDetail({ route }) {
  const { userId, accountNumb } = route.params;
  const navigation = useNavigation();

  const [showHideDetail, setshowHideDetail] = useState(false);
  const [balanceSummary, setbalanceSummary] = useState("");
  const [accountNumber, setaccountNumber] = useState("");
  const [minimundeposit, setminimundeposit] = useState("");
  const [totalInstallment, settotalInstallment] = useState("");
  const [depositAgreement, setdepositAgreement] = useState("");
  const [interestRate, setinterestRate] = useState("");
  const [weeksPaid, setweeksPaid] = useState("");
  const [weeksPaidStatus, setweeksPaidStatus] = useState("");
  const [remainWeeks, setremainWeeks] = useState("");
  const [status, setstatus] = useState("");
  const [countryCurrencyCode, setcountryCurrencyCode] = useState("");
  const { t } = useTranslation();
  const [showCountryCurrencyCode, setshowCountryCurrencyCode] = useState("");
  const [showCountryCurrency, setshowCountryCurrency] = useState("");
  const translation = useRef(new Animated.Value(-90)).current;
  const [headerShown, setHeaderShown] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View>
          {headerShown ? (
            <Text>
              {t("Credit account") + " (..." + accountNumb.substr(-4) + ")"}
            </Text>
          ) : (
            <Text></Text>
          )}
        </View>
      ),
    });
  }, [navigation, headerShown]);

  useEffect(() => {
    axios
      .get(API_URL_BALANCE, {
        params: {
          param: userId,
        },
      })

      .then((response) => {
        const data = response.data[0];
        setbalanceSummary(data.balanceAmount);
        setaccountNumber(data.accountNumber);
        setminimundeposit(data.minimundeposit);
        settotalInstallment(data.totalInstallment);
        setdepositAgreement(data.depositAgreement);
        setinterestRate(data.interestRate);
        setweeksPaid(data.weeksPaid);
        setweeksPaidStatus(data.weeksPaidStatus);
        setremainWeeks(data.remainWeeks);

        if (balanceSummary <= 0) {
          setstatus("complete");
        } else {
          setstatus("active");
        }
      })

      .catch((error) => {
        alert("Error" + error);
      });
  }, [userId]);

  const isValidLanguageTag = (tag) => {
    try {
      new Intl.NumberFormat(tag);
      return true;
    } catch (e) {
      return false;
    }
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

  const weekStatus = () => {
    if (weeksPaidStatus == 1) {
      return (
        <View style={styles.accountDetail}>
          <Text style={{ fontWeight: "600", color: "red" }}>
            {t("Week past due")}
          </Text>
          <Text style={{ fontWeight: "600", color: "red" }}>
            {weeksPaidStatus}
          </Text>
        </View>
      );
    } else if (weeksPaidStatus > 1) {
      return (
        <View style={styles.accountDetail}>
          <Text style={{ fontWeight: "600", color: "red" }}>
            {t("Weeks past due")}
          </Text>
          <Text style={{ fontWeight: "600", color: "red" }}>
            {weeksPaidStatus}
          </Text>
        </View>
      );
    } else if (weeksPaidStatus == 0 || weeksPaidStatus == -1) {
      return (
        <View style={styles.accountDetail}>
          <Text>{t("Week paid ahead")}</Text>
          <Text>{weeksPaidStatus * -1}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.accountDetail}>
          <Text>{t("Weeks paid ahead")}</Text>
          <Text>{weeksPaidStatus * -1}</Text>
        </View>
      );
    }
  };

  return (
    <View style={{ backgroundColor: colors.appBackground, flex: 1 }}>
      <Animated.View
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 40,
          height: 90,
          // borderColor: colors.BorderColor,
          // borderBottomWidth: 0.5,
          backgroundColor: "transparent",
        }}
      ></Animated.View>
      <ScrollView
        onScroll={(event) => {
          const scrolling = event.nativeEvent.contentOffset.y;
          if (scrolling > 32) {
            setHeaderShown(true);
          } else {
            setHeaderShown(false);
          }
        }}
        scrollEventThrottle={16}
        style={{ backgroundColor: colors.appBackground }}
      >
        <View style={styles.mainView}>
          <View style={{ padding: 30, paddingTop: 0, paddingLeft: 0 }}>
            <Text style={{ fontSize: 25, fontWeight: 600 }}>
              {t("Credit account")} (...{accountNumber.substr(-4)})
            </Text>
          </View>
          <View
            style={[
              showHideDetail ? styles.components : styles.reduceComponent,
            ]}
          >
            <View
              style={{
                flexDirection: "column",

                alignItems: "flex-end",
                padding: 10,
              }}
            >
              <Text style={{ fontWeight: "600", fontSize: 25 }}>
                {isValidLanguageTag(showCountryCurrencyCode)
                  ? new Intl.NumberFormat(showCountryCurrencyCode, {
                      minimumFractionDigits: 2,
                    }).format(balanceSummary)
                  : "Invalid language tag"}
              </Text>
              <Text>{t("Balance")}</Text>
            </View>

            <View style={styles.accountDetail}>
              <Text style={{ fontWeight: "600" }}>{t("Account details")}</Text>
            </View>

            <View style={styles.accountDetail}>
              <Text>{t("Amount to be paid")}</Text>
              <Text>
                {isValidLanguageTag(showCountryCurrencyCode)
                  ? new Intl.NumberFormat(showCountryCurrencyCode, {
                      minimumFractionDigits: 2,
                    }).format(balanceSummary)
                  : "Invalid language tag"}
              </Text>
            </View>
            <View style={styles.accountDetail}>
              <Text>{t("Minimum deposit")}</Text>
              <Text>
                {isValidLanguageTag(showCountryCurrencyCode)
                  ? new Intl.NumberFormat(showCountryCurrencyCode, {
                      minimumFractionDigits: 2,
                    }).format(minimundeposit)
                  : "Invalid language tag"}
              </Text>
            </View>
            <View style={styles.accountDetail}>
              <Text>{t("Next deposit date")}</Text>
              <Text>
                {moment(
                  new Date().setDate(
                    new Date().getDate() +
                      ((2 + 7 - new Date().getDay()) % 7 || 7)
                  )
                ).format(t("YYYY-MM-DD"))}
              </Text>
            </View>
            <View style={styles.accountDetail}>
              <Text>{t("Deposit terms")}</Text>
              <Text>{depositAgreement}</Text>
            </View>
            <View style={styles.accountDetail}>
              <Text>{t("Total weeks")}</Text>
              <Text>{totalInstallment}</Text>
            </View>
            <View style={styles.accountDetail}>
              <Text>{t("Weeks deposited")}</Text>
              <Text>{weeksPaid}</Text>
            </View>
            <View style={styles.accountDetail}>
              <Text>{t("Weeks to be paid")}</Text>
              <Text>{remainWeeks}</Text>
            </View>
            {weekStatus()}
            <View style={styles.accountDetail}>
              <Text>{t("Account number")}</Text>
              <Text>{accountNumber}</Text>
            </View>
          </View>
          <View style={{ alignItems: "center", top: -20 }}>
            <TouchableOpacity
              style={styles.showAndHideButton}
              onPress={() => setshowHideDetail(!showHideDetail)}
            >
              <Icon
                name={showHideDetail ? "expand-less" : "expand-more"}
                color={"#12A19A"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.comandButton}>
            <TouchableOpacity
              style={styles.touchButton}
              onPress={() =>
                navigation.navigate("Deposit", {
                  userId: userId,
                  serviceName: "0",
                  serviceAccountNumber: "0",
                })
              }
            >
              <View style={styles.icon}>
                <Icon name="assured-workload" color={"#12A19A"} />
              </View>
              <View style={styles.iconTitle}>
                <Text>{t("Pay")}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.touchButton}>
              <View style={styles.icon}>
                <Icon name="question-mark" color={"#12A19A"} />
              </View>
              <View style={styles.iconTitle}>
                <Text>{t("Help")}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <RecentTransactions userId={userId} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: { padding: 20, paddingTop: 0 },

  components: {
    borderWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderColor: "#DDDEE0",
    paddingBottom: 10,
    overflow: "hidden",
  },

  reduceComponent: {
    borderWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderColor: "#DDDEE0",
    height: 240,
    overflow: "hidden",
  },

  showAndHideButton: {
    justifyContent: "center",
    borderWidth: 1,

    backgroundColor: "#fff",
    borderColor: "#DDDEE0",
    width: 35,
    height: 35,
    borderRadius: 50,
  },

  accountDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },

  comandButton: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 0,
    paddingBottom: 20,
    top: -7,
  },

  touchButton: {
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    backgroundColor: "#fff",
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#12A19A",
  },
});
