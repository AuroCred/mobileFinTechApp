import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { Icon } from "react-native-elements";
import SearchBarItems from "./searchBarItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL_BALANCE, API_URL_ALL_TRANS } from "@env";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function AllTransactions({ route }) {
  const { userId } = route.params;
  const [seeAll, setseeAll] = useState("");
  const [input, setImput] = useState("");
  const [accountUser, setaccountUser] = useState("");
  const { t } = useTranslation();
  const [showCountryCurrencyCode, setshowCountryCurrencyCode] = useState("");
  const [showCountryCurrency, setshowCountryCurrency] = useState("");

  useEffect(() => {
    axios
      .get(API_URL_ALL_TRANS, {
        params: {
          param: userId,
        },
      })

      .then((response) => {
        setseeAll(response.data);
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

  const alltransaction = seeAll;

  const isValidLanguageTag = (tag) => {
    try {
      new Intl.NumberFormat(tag);

      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={stylesAllTransaction.conteiner}
    >
      <View style={stylesAllTransaction.mainView}>
        <SafeAreaView>
          <View style={stylesAllTransaction.searchBarView}>
            <Icon name="search" />

            <TextInput
              value={input}
              onChangeText={(Text) => setImput(Text)}
              placeholder={t("Search")}
              style={{ width: "100%", fontSize: 18 }}
            />
          </View>

          <SearchBarItems
            data={alltransaction}
            input={input}
            setImput={setImput}
            currencyCode={showCountryCurrencyCode}
          />
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
}

const stylesAllTransaction = StyleSheet.create({
  conteiner: {
    flex: 1,
  },

  mainView: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#F5F6F8",
    paddingBottom: 50,
  },
  searchBarView: {
    padding: 15,
    flexDirection: "row",
    width: "100%",
    alignContent: "center",
    backgroundColor: "#FFF",
    marginBottom: 0,
    borderWidth: 0.5,
    borderColor: "#DDDEE0",
  },
});
