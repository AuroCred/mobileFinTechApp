import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon } from "react-native-elements";
import { API_URL_BALANCE } from "@env";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { PieChart } from "react-native-chart-kit";

export default function PieCharts({ userId }) {
  const navigation = useNavigation();

  const { t } = useTranslation();

  const [paid, setpaid] = useState(0);
  const [notPaid, setnotPaid] = useState(0);

  axios
    .get(API_URL_BALANCE, {
      params: {
        param: userId,
      },
    })

    .then((response) => {
      setpaid(response.data[0].percentagePaid);
      setnotPaid(response.data[0].percentageNotPaid);
    })
    .catch((error) => {
      alert("Error" + error);
    });

  const percentagePaid = paid;
  const percentageNotPaid = notPaid;

  const data = [
    {
      name: `${t("Paid")} (${percentagePaid}%)`,
      percentage: percentagePaid,
      color: "#12A19A",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: `${t("Not paid")} (${percentageNotPaid}%)`,
      percentage: percentageNotPaid,
      color: "#d3d3d3",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  return (
    <View>
      <View style={styles.recentTransactioView}>
        {/* <View>
          <Text style={{ color: "#fff", fontWeight: 500, fontSize: 17 }}>
            {t("See all transactions")}
          </Text>
        </View> */}

        <View style={styles.chartComponent}>
          <PieChart
            data={data}
            width={Dimensions.get("window").width}
            height={220}
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor="percentage"
            backgroundColor="transparent"
            paddingLeft="75"
            hasLegend={false}
            absolute
          />
          <Legend data={data} />
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
          <View style={[styles.colorBox, { backgroundColor: item.color }]} />
          <Text style={styles.legendText}>{item.name}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  chartComponent: {
    borderWidth: 1,
    borderColor: "#DDDEE0",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,

    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
  },

  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 0, // Adjust this value to reduce space
    padding: 10,
    alignContent: "center",
    justifyContent: "space-around",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 5,
  },
  colorBox: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  legendText: {
    fontSize: 15,
  },
});
