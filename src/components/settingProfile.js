import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Modal,
  Button,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Pressable,
} from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL_USER_ACCOUNT } from "@env";
import axios, { Axios } from "axios";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import CustomHeader from "./customHeader";

export default function SettingProfile({ route }) {
  const { userId } = route.params;
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [id, setId] = useState("");
  const { t } = useTranslation();
  const [headerShown, setHeaderShown] = useState(true);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, []);

  useEffect(() => {
    axios
      .get(API_URL_USER_ACCOUNT, {
        params: {
          param: userId,
        },
      })
      .then((response) => {
        setId(response.data[0].id);
        setFirstName(response.data[0].first_name);
        setLastName(response.data[0].last_name);
      })
      .catch((error) => {
        alert("Error" + error);
      });
  }, [userId]);

  return (
    <View style={{ backgroundColor: "#F5F6F8", flex: 1 }}>
      <SafeAreaView>
        {headerShown ? (
          <CustomHeader title="" />
        ) : (
          <CustomHeader title={t("Settings")} />
        )}

        {/* <ScrollView
          ref={scrollViewRef}
          onScroll={(event) => {
            const scrolling = event.nativeEvent.contentOffset.y;
            if (scrolling < 32) {
              setHeaderShown(true);
            } else {
              setHeaderShown(false);
            }
          }}
        > */}

        <View style={stylesSettings.mainView}>
          <View style={{ paddingLeft: 25 }}>
            <Text style={{ fontSize: 25, fontWeight: 600 }}>
              {t("Settings")}
            </Text>
          </View>
          <View style={stylesSettings.iniNameView}>
            <View style={stylesSettings.inicialVIEW}>
              <Text style={stylesSettings.inicialText}>
                {firstName.slice(0, 1)}
                {lastName.slice(0, 1)}
              </Text>
            </View>

            <View style={stylesSettings.fullnameView}>
              <Text style={stylesSettings.fullnameText}>
                {firstName} {lastName}
              </Text>
            </View>
          </View>

          <View style={stylesSettings.allAccountlView}>
            <Pressable
              onPress={() =>
                navigation.navigate("ManageAccount", { userId: userId })
              }
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "#ccc" : "#F5F6F8",
                },
              ]}
            >
              <View style={stylesSettings.myAccountView}>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="manage-accounts" size={25} />
                  <Text style={{ fontSize: 16, left: 15 }}>
                    {t("Manage account")}
                  </Text>
                </View>
                <Icon name="chevron-right" size={25} />
              </View>
            </Pressable>

            <Pressable
              onPress={() =>
                navigation.navigate("ManageTransactions", {
                  userId: userId,
                })
              }
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "#ccc" : "#F5F6F8",
                },
              ]}
            >
              <View style={stylesSettings.myAccountView}>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="assured-workload" size={25} />
                  <Text style={{ fontSize: 16, left: 15 }}>
                    {t("Manage transactions")}
                  </Text>
                </View>
                <Icon name="chevron-right" size={25} />
              </View>
            </Pressable>

            <Pressable
              onPress={() =>
                navigation.navigate("Languages", { userId: userId, id: id })
              }
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "#ccc" : "#F5F6F8",
                },
              ]}
            >
              <View style={stylesSettings.myAccountView}>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="translate" size={25} />
                  <Text style={{ fontSize: 16, left: 15 }}>
                    {t("Change language")}
                  </Text>
                </View>
                <Icon name="chevron-right" size={25} />
              </View>
            </Pressable>

            <Pressable
              onPress={() =>
                navigation.navigate("TermPolicy", { userId: userId })
              }
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "#ccc" : "#F5F6F8",
                },
              ]}
            >
              <View style={stylesSettings.myAccountView}>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="gavel" size={25} />
                  <Text style={{ fontSize: 16, left: 15 }}>
                    {t("Terms and policy")}
                  </Text>
                </View>
                <Icon name="chevron-right" size={25} />
              </View>
            </Pressable>

            <Pressable
              onPress={() =>
                navigation.navigate("ContactUs", { userId: userId })
              }
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "#ccc" : "#F5F6F8",
                },
              ]}
            >
              <View style={stylesSettings.myAccountView}>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="support-agent" size={25} />
                  <Text style={{ fontSize: 16, left: 15 }}>
                    {t("Contact us")}
                  </Text>
                </View>
                <Icon name="chevron-right" size={25} />
              </View>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate("Help", { userId: userId })}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "#ccc" : "#F5F6F8",
                },
              ]}
            >
              <View style={stylesSettings.myAccountView}>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="contact-support" size={25} />
                  <Text style={{ fontSize: 16, left: 15 }}>
                    {t("I need help")}?
                  </Text>
                </View>
                <Icon name="chevron-right" size={25} />
              </View>
            </Pressable>
          </View>
        </View>
        {/* </ScrollView> */}
      </SafeAreaView>
    </View>
  );
}

const stylesSettings = StyleSheet.create({
  mainView: {
    ...Platform.select({
      ios: {
        paddingTop: 0,
      },
      android: {
        paddingTop: 50,
      },
    }),
  },

  iniNameView: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  inicialVIEW: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderColor: "#12A19A",
    backgroundColor: "#12A19A",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inicialText: {
    fontSize: 30,
    fontWeight: 600,
    color: "#fff",
  },
  fullnameView: {
    paddingLeft: 10,
  },
  fullnameText: {
    fontSize: 25,
    fontWeight: 600,
  },
  allAccountlView: {
    padding: 10,
    paddingTop: 20,
    paddingBottom: 200,
  },

  myAccountView: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#DDDEE0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  helpView: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  versionView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  copyrightView: {
    flexDirection: "row",
  },
});
