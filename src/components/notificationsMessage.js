import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

import { useNavigation, useFocusEffect } from "@react-navigation/native";

import {
  API_URL_Notification_message,
  API_URL_USER_ACCOUNT,
  API_URL_Notification_pressed_first,
  API_URL_Notification_pressed_second,
} from "@env";
import axios from "axios";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import colors from "./color";
import moment from "moment";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsMessage({ route }) {
  const { userId, MsgId, MsgType } = route.params;
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [notificationMsg, setNotificationMsg] = useState("");
  const [notificationMsg2, setNotificationMsg2] = useState("");

  const [messageOption, setMessageOption] = useState("");
  const [messageOption2, setMessageOption2] = useState("");

  const [messageRespOption, setMessageRespOption] = useState("");
  const [messageRespOption2, setMessageRespOption2] = useState("");

  const [pressStatus, setPressStatus] = useState("");
  const [pressStatus2, setPressStatus2] = useState("");

  const [firstName, setfirstName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [backgroundColorMsg, setbackgroundColorMsg] = useState(
    colors.compBackground
  );

  const [isVisibleMsgFirst, setIsVisibleMsgFirst] = useState(true);
  const [isVisibleMsgSecond, setIsVisibleMsgSecond] = useState(true);

  const [isDisableMsgFirst, setIsDisableMsgFirst] = useState(false);
  const [isDisableMsgSecond, setIsDisableMsgSecond] = useState(false);

  const [createdDate, setCreatedDate] = useState("");
  const [updatedDate, setUpdateDate] = useState("");

  const [isLoading, setIsLoading] = useState(true);

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

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL_Notification_message, {
        params: {
          param: MsgId,
        },
      });
      const Data = response.data[0];
      setNotificationMsg(Data.notification_message);
      setNotificationMsg2(Data.notification_message_2_paragraph);

      setMessageOption(Data.cust_message_option_1);
      setMessageOption2(Data.cust_message_option_2);

      setMessageRespOption(Data.resp_message_option_1);
      setMessageRespOption2(Data.resp_message_option_2);

      setPressStatus(Data.press_status_1);
      setPressStatus2(Data.press_status_2);

      setCreatedDate(Data.created_at);
      setUpdateDate(Data.updated_at);
    } catch (error) {
      alert("Error: " + error);
    }
  };

  console.log(updatedDate);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [userId])
  );

  const pressedFirst = () => {
    axios
      .put(`${API_URL_Notification_pressed_first}/${MsgId}`)
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const pressedSecond = () => {
    axios
      .put(`${API_URL_Notification_pressed_second}/${MsgId}`)
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
        setAccountNumber(response.data[0].account_number);
      })
      .catch((error) => {
        alert("Error" + error);
      });
  }, []);

  const formatNotificationDateMessage = (date) => {
    const now = moment();
    const notificationDate = moment(date);

    if (now.isSame(notificationDate, "day")) {
      return "Today";
    } else if (now.diff(notificationDate, "days") === 1) {
      return "Yesterday";
    } else if (now.diff(notificationDate, "days") < 7) {
      return notificationDate.format("dddd"); // e.g., "Wednesday"
    } else {
      return notificationDate.format(t("MM/DD/YYYY")); // e.g., "10/21/2024"
    }
  };

  const dateObject = new Date(updatedDate);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View>
          <Text>{t(MsgType)}</Text>
        </View>
      ),
    });
  }, [navigation, firstName]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  return (
    <SafeAreaView style={styles.mainView}>
      <ScrollView>
        <View style={styles.allAccountlView}>
          <View
            style={{
              alignItems: "center",
              padding: 5,
            }}
          >
            <Text style={{ color: colors.Secundary }}>
              {t(formatNotificationDateMessage(createdDate))}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              paddingLeft: 20,
              paddingTop: 5,
            }}
          >
            <View style={styles.iconMessage}>
              <Image
                source={require("../../assets/auroIcon.png")}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                }}
              />
            </View>

            <View style={[styles.messageBubbleReceiver, styles.receiver]}>
              <Text style={styles.firstText}>
                {t("Hello")} {firstName},
              </Text>
              <Text style={styles.messageText}>{t(notificationMsg)}</Text>
              <Text style={styles.messageText}>{t(notificationMsg2)}</Text>
              <Text style={styles.finalText}>{t("Thank you")}!</Text>
              <Text>Aurocred </Text>
              <View
                style={{
                  alignItems: "flex-end",
                }}
              >
                <Text> {moment(createdDate).format("hh:mm A")}</Text>
              </View>
            </View>
          </View>

          {(isDisableMsgFirst || pressStatus == 0) && (
            <View
              style={{
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <Text style={{ color: colors.Secundary }}>
                {isDisableMsgFirst
                  ? t("Today")
                  : t(formatNotificationDateMessage(updatedDate))}
              </Text>
            </View>
          )}
          {isVisibleMsgSecond && pressStatus2 == 1 && messageOption !== "" && (
            <TouchableOpacity
              onPress={() => {
                setbackgroundColorMsg(colors.pressMessage);
                pressedFirst();
                customerOptionTextFirst();
                ButtonOptionTextFirst();
              }}
              disabled={
                isDisableMsgFirst
                  ? true
                  : false || pressStatus == 1
                  ? false
                  : true
              }
              style={[
                // { backgroundColor: backgroundColorMsg },
                {
                  backgroundColor:
                    pressStatus == 1 ? backgroundColorMsg : colors.pressMessage,
                },
                styles.messageBubbleSender,
                styles.sender,
              ]}
            >
              <Text style={styles.firstText}>{t(messageOption)}</Text>
            </TouchableOpacity>
          )}

          {isDisableMsgFirst && (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  paddingLeft: 20,
                  paddingTop: 5,
                }}
              >
                <View style={styles.iconMessage}>
                  <Image
                    source={require("../../assets/auroIcon.png")}
                    resizeMode="contain"
                    style={{
                      width: 25,
                      height: 25,
                    }}
                  />
                </View>

                <View style={[styles.messageBubbleReceiver, styles.receiver]}>
                  {isLoading ? (
                    <LottieView
                      style={{ width: 30, height: 10 }}
                      source={require("../../loading/dots.json")}
                      autoPlay
                      loop
                      scale={1}
                    />
                  ) : (
                    <View>
                      <View>
                        <Text style={styles.messageText}>
                          {t(messageRespOption)}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.buttonOpt}
                        onPress={() =>
                          navigation.navigate("AccountDetail", {
                            userId: userId,
                            accountNumb: accountNumber,
                          })
                        }
                      >
                        <Text style={{ fontWeight: 600 }}>
                          {t("View account details")}
                        </Text>
                      </TouchableOpacity>

                      <View
                        style={{
                          alignItems: "flex-end",
                        }}
                      >
                        <Text> {moment(updatedDate).format("hh:mm A")}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}

          {pressStatus == 0 && (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  paddingLeft: 20,
                  paddingTop: 5,
                }}
              >
                <View style={styles.iconMessage}>
                  <Image
                    source={require("../../assets/auroIcon.png")}
                    resizeMode="contain"
                    style={{
                      width: 25,
                      height: 25,
                    }}
                  />
                </View>

                <View style={[styles.messageBubbleReceiver, styles.receiver]}>
                  <View>
                    <View>
                      <Text style={styles.messageText}>
                        {t(messageRespOption)}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.buttonOpt}
                      onPress={() =>
                        navigation.navigate("AccountDetail", {
                          userId: userId,
                          accountNumb: accountNumber,
                        })
                      }
                    >
                      <Text style={{ fontWeight: 600 }}>
                        {t("View account details")}
                      </Text>
                    </TouchableOpacity>

                    <View
                      style={{
                        alignItems: "flex-end",
                      }}
                    >
                      <Text> {moment(updatedDate).format("hh:mm A")}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}

          {(isDisableMsgSecond || pressStatus2 == 0) && (
            <View
              style={{
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <Text style={{ color: colors.Secundary }}>
                {isDisableMsgSecond
                  ? t("Today")
                  : t(formatNotificationDateMessage(updatedDate))}
              </Text>
            </View>
          )}

          {isVisibleMsgFirst && pressStatus == 1 && messageOption2 !== "" && (
            <TouchableOpacity
              onPress={() => {
                setbackgroundColorMsg(colors.pressMessage);
                pressedSecond();
                customerOptionTextSecond();
                ButtonOptionTextSecond();
              }}
              disabled={
                isDisableMsgSecond
                  ? true
                  : false || pressStatus2 == 1
                  ? false
                  : true
              }
              style={[
                {
                  backgroundColor:
                    pressStatus2 == 1
                      ? backgroundColorMsg
                      : colors.pressMessage,
                },
                styles.messageBubbleSender,
                styles.sender,
              ]}
            >
              <Text style={[styles.firstText]}>{t(messageOption2)}</Text>
            </TouchableOpacity>
          )}

          {isDisableMsgSecond && (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  paddingLeft: 20,
                  paddingTop: 5,
                }}
              >
                <View style={styles.iconMessage}>
                  <Image
                    source={require("../../assets/auroIcon.png")}
                    resizeMode="contain"
                    style={{
                      width: 25,
                      height: 25,
                    }}
                  />
                </View>

                <View style={[styles.messageBubbleReceiver, styles.receiver]}>
                  {isLoading ? (
                    <LottieView
                      style={{ width: 30, height: 10 }}
                      source={require("../../loading/dots.json")}
                      autoPlay
                      loop
                      scale={1}
                    />
                  ) : (
                    <>
                      <View>
                        <Text style={styles.messageText}>
                          {t(messageRespOption2)}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.buttonOpt}
                        onPress={() => {
                          navigation.navigate("Deposit", {
                            userId: userId,
                            serviceName: "0",
                            serviceAccountNumber: "0",
                          });
                        }}
                      >
                        <Text style={{ fontWeight: 600 }}>
                          {t("Make payment")}
                        </Text>
                      </TouchableOpacity>

                      <View
                        style={{
                          alignItems: "flex-end",
                        }}
                      >
                        <Text> {moment(updatedDate).format("hh:mm A")}</Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
            </View>
          )}

          {pressStatus2 == 0 && (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  paddingLeft: 20,
                  paddingTop: 5,
                }}
              >
                <View style={styles.iconMessage}>
                  <Image
                    source={require("../../assets/auroIcon.png")}
                    resizeMode="contain"
                    style={{
                      width: 25,
                      height: 25,
                    }}
                  />
                </View>

                <View style={[styles.messageBubbleReceiver, styles.receiver]}>
                  <View>
                    <Text style={styles.messageText}>
                      {t(messageRespOption2)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.buttonOpt}
                    onPress={() => {
                      navigation.navigate("Deposit", {
                        userId: userId,
                        serviceName: "0",
                        serviceAccountNumber: "0",
                      });
                    }}
                  >
                    <Text style={{ fontWeight: 600 }}>{t("Make payment")}</Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      alignItems: "flex-end",
                    }}
                  >
                    <Text> {moment(updatedDate).format("hh:mm A")}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },

  allAccountlView: {
    paddingTop: 50,
    marginBottom: 20,
  },

  iconMessage: {
    borderColor: colors.Primary,

    borderWidth: 1,
    width: 32,
    height: 32,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  messageBubbleReceiver: {
    maxWidth: "80%",
    padding: 15,
    borderRadius: 20,
    borderBottomLeftRadius: 0,
  },
  messageBubbleSender: {
    maxWidth: "80%",
    padding: 15,
    borderRadius: 20,
    borderBottomRightRadius: 0,
    marginVertical: 10,
  },

  receiver: {
    backgroundColor: colors.messageText,
    alignSelf: "flex-start",
    marginLeft: 5,
  },
  sender: {
    alignSelf: "flex-end",
    marginRight: 20,
    borderWidth: 1,
    borderColor: colors.BorderColor,
  },
  messageText: {
    color: colors.textColor,
    fontSize: 16,
    marginTop: 15,
  },

  buttonOpt: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 20,
    borderWidth: 1,
    padding: 12,
    alignContent: "center",
    alignItems: "center",
  },
});
