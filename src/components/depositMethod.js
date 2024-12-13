import React, { useState, useRef, useEffect } from "react";

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
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import {
  API_URL_WALL_ACCOUNT_LIST,
  API_URL_CREATE_WALL_LIST,
  API_URL_WALL_LIMIT,
} from "@env";
import axios from "axios";

import { Icon } from "react-native-elements";
import { useTranslation } from "react-i18next";

export default function DepositMethod({ route }) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { depositAmount, userId } = route.params;

  const [mobileWallet, setmobileWallet] = useState("");
  const [isModelVisible, setisModelVisible] = useState(false);

  const [serviceType, setserviceType] = useState(t("Mobile wallet"));
  const [serviceAccount, setserviceAccount] = useState("");

  const [open, setOpen] = useState(false);
  const [serviceName, setServiceName] = useState("E-Mola");
  const [items, setItems] = useState([
    { label: "E-Mola (Movitel)", value: "E-Mola" },
    { label: "M-Pesa (Vodacom)", value: "M-Pesa" },
    { label: "M-Cash (Mcel)", value: "M-Cash" },
  ]);

  const [limit, setlimit] = useState();

  axios

    .get(API_URL_WALL_ACCOUNT_LIST, {
      params: {
        param: userId,
      },
    })

    .then((response) => {
      setmobileWallet(response.data[0]);
      //setlimit(response[1].count);
    })
    .catch((error) => {
      alert("Error" + error);
    });

  const mobileWalletData = mobileWallet;

  const saveNewWallet = () => {
    if (serviceAccount == "") {
      Alert.alert(t("Insert mobile account number!"));
    } else {
      axios
        .post(API_URL_CREATE_WALL_LIST, {
          username: userId,
          serviceType: serviceType,
          serviceName: serviceName,
          serviceAccount: serviceAccount,
        })
        .catch((error) => {
          alert("Error" + error);
        });

      setisModelVisible(false);
    }
  };

  useEffect(() => {
    axios

      .get(API_URL_WALL_LIMIT, {
        params: {
          param: userId,
        },
      })

      .then((response) => {
        setlimit(response.data);
      })
      .catch((error) => {
        alert("Error" + error);
      });
  }, [isModelVisible]);

  const addNewButton = () => {
    if (limit < 3) {
      return (
        <TouchableOpacity
          onPress={() => setisModelVisible(true)}
          style={{
            marginTop: 10,
            paddingLeft: 5,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Icon name="add" color={"#12A19B"}></Icon>
          <Text style={{ color: "#12A19B", fontWeight: "500", fontSize: 16 }}>
            {t("Add new account")}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  console.log(limit);
  return (
    <View style={{ flex: 1, backgroundColor: "#F5F6F8" }}>
      <View style={styleDepositMethod.pageView}>
        <FlatList
          data={mobileWalletData}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ConfirmDeposit", {
                    username: userId,
                    serviceName: item.service_name,
                    serviceAccountNumber: item.service_account_number,
                    depositAmount: depositAmount,
                  })
                }
              >
                <View key={item.id} style={styleDepositMethod.allconteinarView}>
                  <View style={{ padding: 10 }}>
                    <Icon name="phone-iphone" color={"#12A19B"} size={30} />
                  </View>

                  <View style={styleDepositMethod.mobileWalletDataView}>
                    <View style={styleDepositMethod.firstRow}>
                      <Text style={{ fontSize: 18, fontWeight: 500 }}>
                        {item.service_name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: 500,
                          paddingLeft: 5,
                        }}
                      >
                        . {item.service_account_number.substr(-4)}
                      </Text>
                    </View>

                    <View style={styleDepositMethod.secondRow}>
                      <Text style={{ fontSize: 16, color: "#888" }}>
                        {item.first_name} {item.last_name}
                      </Text>
                    </View>
                  </View>

                  <View style={{ padding: 10 }}>
                    <Icon name="navigate-next" />
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          scrollEnabled={false}
        />

        {addNewButton()}

        <View
          style={{
            paddingTop: 20,
            borderBottomColor: "black",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <View style={{ paddingTop: 20 }}>
          <Text>
            <Text style={{ fontWeight: 600 }}>{t("Notice")} : </Text>
            {t(
              "You can only add up to 3 different accounts. Use settings to edit or delete."
            )}
          </Text>
        </View>
      </View>

      <Modal
        visible={isModelVisible}
        onRequestClose={() => setisModelVisible(false)}
        animationType="slide"
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F6F8" }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styleDepositMethod.container}
            >
              <View
                style={{
                  alignItems: "flex-start",
                  padding: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Icon
                  name="close"
                  color={"#12A19B"}
                  size={35}
                  onPress={() => setisModelVisible(false)}
                ></Icon>

                <TouchableOpacity onPress={() => saveNewWallet()}>
                  <View>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 500,
                        color: "#12A19B",
                      }}
                    >
                      {t("Save")}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styleDepositMethod.closeModel}>
                <ScrollView>
                  <View style={styleDepositMethod.bodyView}>
                    <View style={styleDepositMethod.ContainerView}>
                      <View style={styleDepositMethod.titleView}>
                        <Text style={{ fontSize: 18, color: "#888" }}>
                          {t("Service type")}
                        </Text>
                      </View>

                      <View style={styleDepositMethod.inputView}>
                        <Text style={{ fontSize: 18, width: "auto" }}>
                          {serviceType}
                        </Text>
                      </View>
                    </View>

                    <View style={styleDepositMethod.ContainerView}>
                      <View style={styleDepositMethod.titleView}>
                        <Text style={{ fontSize: 18, color: "#888" }}>
                          {t("Service name")}
                        </Text>
                      </View>

                      <View>
                        <DropDownPicker
                          open={open}
                          value={serviceName}
                          items={items}
                          setOpen={setOpen}
                          setValue={setServiceName}
                          setItems={setItems}
                          defaultValue={serviceName}
                          listMode="SCROLLVIEW"
                          style={styleDepositMethod.inputView}
                          textStyle={{
                            fontSize: 18,
                            padding: 20,
                          }}
                          dropDownContainerStyle={{
                            borderColor: "#DDDEE0",
                            padding: 0,
                            paddingBottom: 20,
                          }}
                        />
                      </View>
                    </View>

                    <View style={styleDepositMethod.ContainerAccountnumberView}>
                      <View style={styleDepositMethod.titleView}>
                        <Text style={{ fontSize: 18, color: "#888" }}>
                          {t("Mobile account number")}
                        </Text>
                      </View>
                      <View style={styleDepositMethod.phoneNumberView}>
                        <Text style={{ fontSize: 18 }}>+258</Text>
                        <TextInput
                          onChangeText={(value) => setserviceAccount(value)}
                          value={serviceAccount}
                          keyboardType="numeric"
                          maxLength={9}
                          style={{
                            fontSize: 18,

                            width: "80%",
                            paddingLeft: 5,
                          }}
                        />
                      </View>
                    </View>

                    {/* <TouchableOpacity
                      style={styleDepositMethod.saveButton}
                      onPress={() => saveNewWallet()}
                    >
                      <View>
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: 500,
                            color: "#fff",
                          }}
                        >
                          {t("Save")}
                        </Text>
                      </View>
                    </TouchableOpacity> */}
                  </View>
                </ScrollView>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styleDepositMethod = StyleSheet.create({
  scroll: {
    flex: 1,
    padding: 20,
    marginTop: 100,
  },

  container: {
    flex: 1,
  },

  pageTitleView: {
    marginBottom: 25,
  },

  allconteinarView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#DDDEE0",
    margin: 7,
    marginLeft: 0,
    backgroundColor: "#fff",
  },
  pageView: {
    marginBottom: 50,
  },

  firstRow: {
    padding: 10,
    flexDirection: "row",
    paddingLeft: 0,
  },

  secondRow: {
    padding: 10,
    paddingTop: 0,
    paddingLeft: 0,
  },

  closeModel: {
    alignItems: "center",
    padding: 20,
    paddingTop: 0,
    paddingBottom: 50,
  },

  bodyView: {
    marginTop: 0,
  },

  ContainerView: {
    padding: 0,
    paddingLeft: 0,
    zIndex: 1000,
  },
  titleView: {
    padding: 20,
    paddingLeft: 0,
  },

  inputView: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#DDDEE0",
    width: "100%",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  countryCodeView: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#DDDEE0",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  phoneNumberView: {
    padding: 20,

    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#DDDEE0",
    flexDirection: "row",

    backgroundColor: "#fff",
  },

  accountNumberView: {
    flexDirection: "row",
  },

  saveButton: {
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: "#12A19A",
    borderColor: "#12A19A",
    borderRadius: 5,
    marginTop: 50,
  },
});