import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import moment from "moment";
import { useTranslation } from "react-i18next";

export default function SearchBarItems({
  data,
  input,
  setImput,
  currencyCode,
}) {
  const { t } = useTranslation();
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
    <FlatList
      data={data}
      renderItem={({ item }) => {
        if (input === "") {
          return (
            <View key={item.id} style={styleSearchBarItems.transactionItem}>
              <View style={styleSearchBarItems.firstRowView}>
                <Text style={{ fontSize: 16 }}>{t(item.transaction_type)}</Text>
                <Text
                  style={[
                    changeColor(item.amount) == 0
                      ? styleSearchBarItems.negative
                      : styleSearchBarItems.positivo,
                    { fontSize: 18 },
                  ]}
                >
                  {isValidLanguageTag(currencyCode)
                    ? new Intl.NumberFormat(currencyCode, {
                        minimumFractionDigits: 2,
                      }).format(item.amount)
                    : ""}
                </Text>
              </View>
              <View style={styleSearchBarItems.secondRowView}>
                <Text style={{ fontSize: 14 }}>
                  {t(moment(item.created_at).format("MMM"))}
                  {moment().format(" DD, YYYY")}
                </Text>
                <Text style={{ fontSize: 14 }}>
                  {t(item.transaction_status)}
                </Text>
              </View>
            </View>
          );
        }

        if (
          t(item.transaction_type).toLowerCase().includes(input.toLowerCase())
        ) {
          return (
            <View key={item.id} style={styleSearchBarItems.transactionItem}>
              <View style={styleSearchBarItems.firstRowView}>
                <Text style={{ fontSize: 16 }}>{t(item.transaction_type)}</Text>
                <Text
                  style={[
                    changeColor(item.amount) == 0
                      ? styleSearchBarItems.negative
                      : styleSearchBarItems.positivo,
                    { fontSize: 18 },
                  ]}
                >
                  {isValidLanguageTag(currencyCode)
                    ? new Intl.NumberFormat(currencyCode, {
                        minimumFractionDigits: 2,
                      }).format(item.amount)
                    : ""}
                </Text>
              </View>
              <View style={styleSearchBarItems.secondRowView}>
                <Text style={{ fontSize: 14 }}>
                  {t(moment(item.created_at).format("MMM"))}
                  {moment().format(" DD, YYYY")}
                </Text>
                <Text style={{ fontSize: 14 }}>
                  {t(item.transaction_status)}
                </Text>
              </View>
            </View>
          );
        }

        if (item.amount.includes(input)) {
          return (
            <View key={item.id} style={styleSearchBarItems.transactionItem}>
              <View style={styleSearchBarItems.firstRowView}>
                <Text style={{ fontSize: 16 }}>{t(item.transaction_type)}</Text>
                <Text
                  style={[
                    changeColor(item.amount) == 0
                      ? styleSearchBarItems.negative
                      : styleSearchBarItems.positivo,
                    { fontSize: 18 },
                  ]}
                >
                  {isValidLanguageTag(currencyCode)
                    ? new Intl.NumberFormat(currencyCode, {
                        minimumFractionDigits: 2,
                      }).format(item.amount)
                    : ""}
                </Text>
              </View>
              <View style={styleSearchBarItems.secondRowView}>
                <Text style={{ fontSize: 14 }}>
                  {t(moment(item.created_at).format("MMM"))}
                  {moment().format(" DD, YYYY")}
                </Text>
                <Text style={{ fontSize: 14 }}>
                  {t(item.transaction_status)}
                </Text>
              </View>
            </View>
          );
        }
      }}
    />
  );
}

const styleSearchBarItems = StyleSheet.create({
  transactionItem: {
    borderBottomWidth: 1,
    borderColor: "#DDDEE0",
  },

  firstRowView: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    paddingBottom: 0,
    backgroundColor: "#fff",
  },

  secondRowView: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
  },

  negative: { color: "red" },
  positivo: { color: "black" },
});
