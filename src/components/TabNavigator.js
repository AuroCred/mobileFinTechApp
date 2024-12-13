import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Button,
  ScrollView,
} from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import HomeScreen from "./homeScreen";
import { API_URL_Notification } from "@env";
import Payments from "./payments";
import SettingProfile from "./settingProfile";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Updates from "expo-updates";
import LogoutLoading from "./logoutLoading";
import colors from "./color";

const Tab = createBottomTabNavigator();

export default function TabNavigator({ route }) {
  const { userId } = route.params;
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [user, setUser] = useState(userId);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [state, setState] = useState(initialState);

  const initialState = {
    notificationCount: 0,
    isLoggingOut: false,
    user: userId,

    // Add any other initial state values here
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL_Notification);
      const Data = response.data;

      const total = Data.reduce((acc, item) => acc + item.read_status, 0);

      setNotificationCount(total);
    } catch (error) {
      alert("Error: " + error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
      if (JSON.stringify(state) !== JSON.stringify(initialState)) {
        setState(initialState);
      }
    }, [userId, fetchData, initialState])
  );

  const removeDataLogout = async () => {
    try {
      setIsLoggingOut(true);

      setTimeout(async () => {
        await AsyncStorage.removeItem(userId);
        // await Updates.reloadAsync();

        navigation.popToTop();
      }, 3000);
      //
      // console.log(`Data with Key "${userId}" removed successfully.`);
    } catch (error) {
      console.error(`Error removing data: ${error.message}`);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {isLoggingOut ? (
        <LogoutLoading visible={isLoggingOut} />
      ) : (
        <Tab.Navigator
          screenOptions={{
            tabBarShowLabel: false,
            headerTransparent: true,

            tabBarStyle: {
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              elevation: 0,
              backgroundColor: "#fff",
              borderRadius: 0,
              height: 90,
            },
          }}
        >
          <Tab.Screen
            name="HomeScreen"
            component={HomeScreen}
            initialParams={{ userId: userId }}
            options={{
              headerTitle: () => (
                <Image
                  source={require("../../assets/auroIcon.png")}
                  resizeMode="contain"
                  style={{
                    width: 35,
                    height: 35,
                  }}
                />
              ),

              headerRight: () => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Icon name="help" color="#888" size={30} style={{}} />
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("ManageNotifications", {
                        userId: userId,
                      })
                    }
                  >
                    <Icon
                      name="notifications-none"
                      color="#888"
                      size={30}
                      style={{
                        paddingLeft: 20,
                        paddingRight: 15,
                      }}
                    />
                    {notificationCount > 0 && (
                      <View
                        style={{
                          position: "absolute",
                          right: 8,
                          top: -9,
                          backgroundColor: "red",
                          borderRadius: 10,
                          width: 20,
                          height: 20,
                          justifyContent: "center",

                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          {notificationCount}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              ),

              tabBarIcon: ({ focused }) => (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingRight: 0,
                    top: 15,
                  }}
                >
                  <Icon
                    name="home"
                    color={focused ? colors.Primary : colors.Secundary}
                    size={30}
                  />
                  <Text
                    style={{
                      color: focused ? colors.Primary : colors.Secundary,
                      fontWeight: focused ? "600" : "400",
                      fontSize: 10,
                      width: "100%",
                    }}
                    numberOfLines={1}
                  >
                    {t("Home")}
                  </Text>
                </View>
              ),
            }}
          />

          <Tab.Screen
            name={" "}
            component={Payments}
            initialParams={{ userId: userId }}
            options={{
              headerTransparent: true,
              headerRight: () => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                ></View>
              ),
              tabBarIcon: ({ focused }) => (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 0,
                    top: 15,
                  }}
                >
                  <Icon
                    name="payments"
                    color={focused ? colors.Primary : colors.Secundary}
                    size={30}
                    iconStyle={{}}
                  />

                  <Text
                    style={{
                      color: focused ? colors.Primary : colors.Secundary,
                      fontWeight: focused ? "600" : "400",
                      fontSize: 10,
                      width: "100%",
                    }}
                    numberOfLines={1}
                  >
                    {t("Payments")}
                  </Text>
                </View>
              ),
            }}
          />

          <Tab.Screen
            name="  "
            component={SettingProfile}
            initialParams={{ userId: userId }}
            options={{
              headerRight: () => (
                <TouchableOpacity onPress={() => removeDataLogout()}>
                  <View
                    style={{
                      padding: 5,
                      paddingRight: 15,
                      paddingTop: 0,
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={{
                        color: colors.Primary,
                        fontWeight: 600,
                        fontSize: 18,
                      }}
                    >
                      {t("Sign out")}
                    </Text>
                  </View>
                </TouchableOpacity>
              ),
              tabBarIcon: ({ focused }) => (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 0,
                    top: 15,
                  }}
                >
                  <Icon
                    name="settings"
                    color={focused ? colors.Primary : colors.Secundary}
                    size={30}
                    iconStyle={{}}
                  />

                  <Text
                    style={{
                      color: focused ? colors.Primary : colors.Secundary,
                      fontWeight: focused ? "600" : "400",
                      fontSize: 10,
                      width: "100%",
                    }}
                    numberOfLines={1}
                  >
                    {t("Settings")}
                  </Text>
                </View>
              ),
            }}
          />
        </Tab.Navigator>
      )}
    </View>
  );
}
