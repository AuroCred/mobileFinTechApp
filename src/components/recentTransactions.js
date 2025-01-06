import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon } from "react-native-elements";
import { API_URL_RECENT } from "@env";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function RecentTransactions({ userId }) {
  const navigation = useNavigation();
  const [rectransaction, setrectransaction] = useState("");
  const { t } = useTranslation();
  const [showCountryCurrencyCode, setshowCountryCurrencyCode] = useState("");
  const [showCountryCurrency, setshowCountryCurrency] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios
        .get(API_URL_RECENT, {
          params: {
            param: userId,
          },
        })
        .then((response) => {
          setrectransaction(response.data);
        });

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

  const currtransaction = rectransaction;

  const changeColor = (c) => {
    if (c < 0) {
      return 0;
    }
  };

  const isValidLanguageTag = (tag) => {
    try {
      new Intl.NumberFormat(tag);

      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <View>
      <View style={styles.recentTransactioView}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("AllTransactions", {
              userId: userId,
            })
          }
          style={styles.titleButton}
        >
          <View>
            <Text style={{ color: "#fff", fontWeight: 500, fontSize: 17 }}>
              {t("See all transactions")}
            </Text>
          </View>

          <View>
            <Icon name="chevron-right" color={"#fff"} size={25} />
          </View>
        </TouchableOpacity>

        <FlatList
          data={currtransaction}
          renderItem={({ item }) => {
            return (
              <View key={item.id} style={styles.transactionItem}>
                <View style={styles.firstRowView}>
                  <Text style={{ fontSize: 16 }}>
                    {t(item.transaction_type)}
                  </Text>
                  <Text
                    style={[
                      changeColor(item.amount) == 0
                        ? styles.negative
                        : styles.positivo,
                      { fontSize: 18 },
                    ]}
                  >
                    {isValidLanguageTag(showCountryCurrencyCode)
                      ? new Intl.NumberFormat(showCountryCurrencyCode, {
                          minimumFractionDigits: 2,
                        }).format(item.amount)
                      : ""}
                  </Text>
                </View>
                <View style={styles.secondRowView}>
                  <Text style={{ fontSize: 14 }}>
                    {t(moment(item.created_at).format("MMM"))}
                    {moment(item.created_at).format(" DD, YYYY")}
                  </Text>
                  <Text style={{ fontSize: 14 }}>
                    {t(item.transaction_status)}
                  </Text>
                </View>
              </View>
            );
          }}
          style={styles.FlatlistItem}
          scrollEnabled={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleButton: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    backgroundColor: "#12A19A",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderColor: "#12A19A",
  },

  transactionItem: {
    borderBottomWidth: 0.5,
    borderColor: "#DDDEE0",
  },

  firstRowView: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    paddingBottom: 0,
  },

  secondRowView: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },

  FlatlistItem: {
    borderWidth: 1,
    borderColor: "#DDDEE0",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,

    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
  },
  negative: { color: "red" },
  positivo: { color: "black" },
});
