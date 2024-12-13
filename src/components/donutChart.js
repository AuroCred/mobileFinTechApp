import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon } from "react-native-elements";
import { API_URL_BALANCE } from "@env";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { PieChart } from "react-native-chart-kit";
import Svg, { G, Circle } from "react-native-svg";

export default function DonutCharts({ userId }) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [percentagePaid, setPercentagePaid] = useState(0);
  const [percentageNotPaid, setPercentageNotPaid] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [currAmount, setCurrAmount] = useState(0);
  const [showCountryCurrencyCode, setshowCountryCurrencyCode] = useState("");
  const [showCountryCurrency, setshowCountryCurrency] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL_BALANCE, {
        params: {
          param: userId,
        },
      });
      const data = response.data[0];
      setPercentagePaid(data.percentagePaid);
      setPercentageNotPaid(data.percentageNotPaid);
      setTotalAmount(data.totalAmount);
      setCurrAmount(data.balanceAmount);

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
    } catch (error) {
      alert("Error: " + error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [userId])
  );

  const isValidLanguageTag = (tag) => {
    try {
      new Intl.NumberFormat(tag);
      return true;
    } catch (e) {
      return false;
    }
  };

  const radius = 70;
  const circleCircumference = 2 * Math.PI * radius;
  const leftToDeposit = currAmount;
  const allLoanAmount = totalAmount;

  const DepositAmount = allLoanAmount - leftToDeposit;
  const percentage = (DepositAmount / allLoanAmount) * 100;
  const strokeDashoffset =
    circleCircumference - (circleCircumference * percentage) / 100;

  const data = [
    {
      name: isValidLanguageTag(showCountryCurrencyCode)
        ? new Intl.NumberFormat(showCountryCurrencyCode, {
            style: "currency",
            currency: showCountryCurrency,
          }).format(DepositAmount)
        : "Invalid language tag",
      name1: `${t("Paid")} (${percentagePaid}%)`,
      color: "#12A19A",
    },
    {
      name: isValidLanguageTag(showCountryCurrencyCode)
        ? new Intl.NumberFormat(showCountryCurrencyCode, {
            style: "currency",
            currency: showCountryCurrency,
          }).format(leftToDeposit)
        : "Invalid language tag",
      name1: `${t("Not paid")} (${percentageNotPaid}%)`,
      color: "#d3d3d3",
    },
  ];

  return (
    <View>
      <View style={styles.recentTransactioView}>
        <View style={styles.title}>
          <Text style={{ fontSize: 18, fontWeight: 600, paddingBottom: 10 }}>
            {t("Business loan")}
          </Text>
          <Text style={{ fontSize: 17, fontWeight: 500 }}>
            {isValidLanguageTag(showCountryCurrencyCode)
              ? new Intl.NumberFormat(showCountryCurrencyCode, {
                  style: "currency",
                  currency: showCountryCurrency,
                }).format(allLoanAmount)
              : "Invalid language tag"}
          </Text>
        </View>

        <View style={styles.chartComponent}>
          <Legend data={data} />
          <Svg height="160" width="160" viewBox="0 0 180 180">
            <G rotation={-90} originX="90" originY="90">
              <Circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke="#d3d3d3"
                fill="transparent"
                strokeWidth="40"
              />
              <Circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke="#12A19A"
                fill="transparent"
                strokeWidth="40"
                strokeDasharray={circleCircumference}
                strokeDashoffset={strokeDashoffset}
              />
            </G>
          </Svg>
        </View>
      </View>
    </View>
  );
}

const Legend = ({ data }) => {
  return (
    <View style={styles.legendContainer}>
      {data.map((item, index) => (
        <View key={index} style={styles.legendItem}>
          <View style={{ flexDirection: "column" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={[styles.colorBox, { backgroundColor: item.color }]}
              />
              <View>
                <Text style={styles.legendText}>{item.name}</Text>
              </View>
            </View>

            <View>
              <Text style={styles.legendText1}>{item.name1}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  recentTransactioView: {
    borderWidth: 1,
    borderColor: "#DDDEE0",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
  },

  chartComponent: {
    flexDirection: "row",
    padding: 20,
  },
  title: {
    padding: 20,
    paddingLeft: 30,
    paddingBottom: 0,
  },

  legendContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
    marginVertical: 0, // Adjust this value to reduce space
    alignContent: "center",
    justifyContent: "space-evenly",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  colorBox: {
    flexDirection: "column",
    width: 15,
    height: 15,
    marginRight: 5,
  },
  legendText: {
    fontSize: 16,
  },
  legendText1: {
    fontSize: 14,
    color: "#888",
    padding: 5,
    paddingLeft: 20,
  },
});
