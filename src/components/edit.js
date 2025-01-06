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
import { useTranslation } from "react-i18next";

import { Icon } from "react-native-elements";
import { color } from "react-native-elements/dist/helpers";

export default function Edit({ route, navigation }) {
  const { t } = useTranslation();

  const { id, firstName, lastName, serviceAccountName, serviceAccountNumber } =
    route.params;

  const [mobileWallet, setmobileWallet] = useState("");
  const [fName, setfName] = useState(firstName);
  const [lName, setlName] = useState(lastName);

  const [serviceAccount, setserviceAccount] = useState(serviceAccountNumber);

  const [open, setOpen] = useState(false);
  const [serviceName, setServiceName] = useState(serviceAccountName);
  const [items, setItems] = useState([
    { label: "E-Mola (Movitel)", value: "E-Mola" },
    { label: "M-Pesa (Vodacom)", value: "M-Pesa" },
  ]);

  //   const saveNewWallet = () => {
  //     if (serviceAccount == "") {
  //       alert("empty field");
  //     } else {
  //       axios
  //         .post(API_URL_CREATE_WALL_LIST, {
  //           username: userId,
  //           serviceType: serviceType,
  //           serviceName: serviceName,
  //           serviceAccount: serviceAccount,
  //         })
  //         .catch((error) => {
  //           alert("Error" + error);
  //         });

  //     }
  //   };

  const editWallet = () => {
    axios
      .put(`${API_URL_WALL_ACCOUNT_LIST}/update/${id}`, {
        serviceName: serviceName,
        serviceAccount: serviceAccount,
      })
      .then((response) => {
        console.log(response.data.message);
        navigation.goBack();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title={t("Save")}
          color="#12A19B"
          onPress={() => editWallet()}
        />
      ),
    });
  }, [navigation, serviceAccount, serviceName]);

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F6F8" }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styleDepositMethod.container}
        >
          <View style={styleDepositMethod.bodyView}>
            <View style={styleDepositMethod.ContainerView}>
              <View style={styleDepositMethod.titleView}>
                <Text style={{ fontSize: 18, color: "#888" }}>
                  {t("First name")}
                </Text>
              </View>

              <View style={styleDepositMethod.inputView}>
                <TextInput
                  value={fName}
                  onChangeText={(value) => setfName(value)}
                  style={{
                    fontSize: 16,
                    width: "100%",
                    padding: 20,
                    paddingLeft: 10,
                  }}
                />
              </View>
            </View>
            <View style={styleDepositMethod.ContainerView}>
              <View style={styleDepositMethod.titleView}>
                <Text style={{ fontSize: 18, color: "#888" }}>
                  {t("Last name")}
                </Text>
              </View>

              <View style={styleDepositMethod.inputView}>
                <TextInput
                  value={lName}
                  onChangeText={(value) => setlName(value)}
                  style={{
                    fontSize: 16,
                    width: "100%",
                    padding: 20,
                    paddingLeft: 10,
                  }}
                />
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
                    padding: 15,
                    paddingLeft: 0,
                  }}
                  dropDownContainerStyle={{
                    borderColor: "#DDDEE0",
                    padding: 0,
                    paddingBottom: 10,
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
                    padding: 20,
                  }}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* <TouchableOpacity
                    style={styleDepositMethod.saveButton}
                    onPress={() => editWallet()}
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: 500,
                          color: "#fff",
                        }}
                      >
                        Save
                      </Text>
                    </View>
                  </TouchableOpacity> */}

              {/* <TouchableOpacity
                    style={styleDepositMethod.saveButton}
                    onPress={() => deleteWallet()}
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: 500,
                          color: "#fff",
                        }}
                      >
                        Delete
                      </Text>
                    </View>
                  </TouchableOpacity> */}
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styleDepositMethod = StyleSheet.create({
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

  bodyView: {
    padding: 20,
    marginTop: 90,
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
    paddingLeft: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#DDDEE0",
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
  },

  accountNumberView: {
    flexDirection: "row",
  },

  saveButton: {
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: "#12A19A",
    borderColor: "#12A19A",
    borderRadius: 5,
    marginTop: 50,
    width: "45%",
  },
});
