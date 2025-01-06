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
  Image,
} from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  API_URL_Notification,
  API_URL_USER_ACCOUNT,
  API_URL_Notification_pressed_first,
  API_URL_Notification_pressed_second,
} from "@env";
import axios from "axios";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import colors from "./color";
import moment from "moment";

export default function ManageNotifications({ route }) {
  const { userId } = route.params;
  const { t } = useTranslation();
  const navigation = useNavigation();
  const translation = useRef(new Animated.Value(-90)).current;
  const [headerShown, setHeaderShown] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [firstName, setfirstName] = useState("");
  const [sum, setSum] = useState(0);
  const [backgroundColorMsg, setbackgroundColorMsg] = useState(
    colors.compBackground
  );
  const [textMsg, setTextMsg] = useState();
  const [isVisibleMsgFirst, setIsVisibleMsgFirst] = useState(true);
  const [isVisibleMsgSecond, setIsVisibleMsgSecond] = useState(true);
  const [isDisableMsgFirst, setIsDisableMsgFirst] = useState(false);
  const [isDisableMsgSecond, setIsDisableMsgSecond] = useState(false);

  const customerOptionTextFirst = () => {
    setIsVisibleMsgFirst(!isVisibleMsgFirst);
  };

  const customerOptionTextSecond = () => {
    setIsVisibleMsgSecond(!isVisibleMsgSecond);
  };

  const ButtonOptionTextFirst = () => {
    setIsDisableMsgFirst(!isDisableMsgFirst);
  };

  const ButtonOptionTextSecond = () => {
    setIsDisableMsgSecond(!isDisableMsgSecond);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View>
          {headerShown ? <Text>{t("Notifications")}</Text> : <Text></Text>}
        </View>
      ),
    });
  }, [navigation, headerShown]);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL_Notification);
      const Data = response.data;
      setNotificationList(Data);
    } catch (error) {
      alert("Error: " + error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [userId])
  );

  const updateStatus = (item) => {
    axios
      .put(`${API_URL_Notification}/${item.id}`)
      .then((response) => {
        console.log(response.data.message);
        fetchData();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const pressedFirst = (item) => {
    axios
      .put(`${API_URL_Notification_pressed_first}/${item.id}`)
      .then((response) => {
        console.log(response.data.message);

        updateStatus();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const pressedSecond = (item) => {
    axios
      .put(`${API_URL_Notification_pressed_second}/${item.id}`)
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    axios
      .get(API_URL_USER_ACCOUNT, {
        params: {
          param: userId,
        },
      })

      .then((response) => {
        setfirstName(response.data[0].first_name);
      })
      .catch((error) => {
        alert("Error" + error);
      });
  }, []);

  // useEffect(() => {
  //   Animated.timing(translation, {
  //     toValue: headerShown ? 0 : 34,
  //     duration: 0,
  //     useNativeDriver: true,
  //   }).start();
  // }, [headerShown]);

  const formatNotificationDate = (date) => {
    const now = moment();
    const notificationDate = moment(date);

    if (now.isSame(notificationDate, "day")) {
      return notificationDate.format("hh:mm A");
    } else if (now.diff(notificationDate, "days") === 1) {
      return "Yesterday";
    } else if (now.diff(notificationDate, "days") < 7) {
      return notificationDate.format("dddd"); // e.g., "Wednesday"
    } else {
      return notificationDate.format(t("MM/DD/YY")); // e.g., "10/21/2024"
    }
  };

  const changeColor = (c) => {
    if (c == 1) {
      return 0;
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
          // transform: [{ translateY: translation }],
        }}
      >
        {/* <Text style={{ fontWeight: "600", marginTop: 10 }}>
          {t("Notifications")}
        </Text> */}
      </Animated.View>
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
          <View style={{ paddingLeft: 15 }}>
            <Text style={{ fontSize: 25, fontWeight: "600" }}>
              {t("Notifications")}
            </Text>
          </View>
          <View style={styles.allAccountlView}>
            <FlatList
              data={notificationList}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View>
                  <Pressable
                    onPress={() => {
                      updateStatus(item);
                      setSelectedNotification(item);
                      // setModalVisible(true);
                      navigation.navigate("NotificationsMessage", {
                        userId: userId,
                        MsgId: item.id,
                        MsgType: item.notification_type,
                      });
                    }}
                    style={({ pressed }) => [
                      {
                        backgroundColor: pressed ? "#ccc" : "#F5F6F8",
                      },
                    ]}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <View style={styles.icon}>
                        <Icon
                          name={item.notification_icon}
                          color={colors.compBackground}
                          size={25}
                        />
                      </View>

                      <View style={styles.notificationItem}>
                        <View style={styles.firstRow}>
                          <View>
                            <Text style={styles.type}>
                              {t(item.notification_type)}
                            </Text>
                          </View>
                          <View style={styles.rightContent}>
                            <Text style={styles.date}>
                              {formatNotificationDate(item.created_at)}
                            </Text>
                            <Icon name="chevron-right" size={25} />
                          </View>
                        </View>

                        <Text
                          style={
                            ([
                              changeColor(item.read_status) === 0
                                ? styles.messageBold
                                : styles.message,
                            ],
                            styles.width)
                          }
                          //IOS
                          numberOfLines={1}
                          // ellipsizeMode="tail"
                          //
                          // maxLines={1}
                          ellipsize="end"
                        >
                          {t(item.notification_message)}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                </View>
              )}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  notificationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: colors.BorderColor,
    width: "91%",
  },
  firstRow: {
    paddingBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  date: {
    fontSize: 14,
    color: colors.Secundary,
  },
  message: {
    fontSize: 15,
    color: colors.Secundary,
  },
  messageBold: {
    fontSize: 15,
    fontWeight: 500,
  },
  type: {
    fontSize: 16,
    fontWeight: "500",
  },
  allAccountlView: {
    paddingLeft: 10,
    paddingBottom: 100,
  },
  rightContent: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
  },

  icon: {
    backgroundColor: colors.Primary,
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: "center",
  },
});
