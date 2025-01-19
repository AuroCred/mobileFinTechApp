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
  const [fName, setfName] = useState("");
  const [lName, setlName] = useState("");
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
          fName: fName,
          lName: lName,
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

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F6F8" }}>
      <ScrollView style={styles.scroll}>
        <View style={styles.pageView}>
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
                  <View key={item.id} style={styles.allconteinarView}>
                    <View style={{ padding: 10 }}>
                      <Icon name="phone-iphone" color={"#12A19B"} size={30} />
                    </View>

                    <View style={styles.mobileWalletDataView}>
                      <View style={styles.firstRow}>
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

                      <View style={styles.secondRow}>
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
      </ScrollView>

      <Modal
        visible={isModelVisible}
        onRequestClose={() => setisModelVisible(false)}
        animationType="slide"
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F6F8" }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.container}
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
              <ScrollView>
                <View style={styles.closeModel}>
                  <View style={styles.bodyView}>
                    <View style={styles.ContainerView}>
                      <View style={styles.titleView}>
                        <Text style={{ fontSize: 18, color: "#888" }}>
                          {t("First name")}
                        </Text>
                      </View>

                      <View style={styles.inputTextView}>
                        <TextInput
                          value={fName}
                          onChangeText={(value) => setfName(value)}
                          style={{
                            fontSize: 16,
                            width: "100%",
                            paddingLeft: 10,
                          }}
                        />
                      </View>
                    </View>
                    <View style={styles.ContainerView}>
                      <View style={styles.titleView}>
                        <Text style={{ fontSize: 18, color: "#888" }}>
                          {t("Last name")}
                        </Text>
                      </View>

                      <View style={styles.inputTextView}>
                        <TextInput
                          value={lName}
                          onChangeText={(value) => setlName(value)}
                          style={{
                            fontSize: 16,
                            width: "100%",
                            paddingLeft: 10,
                          }}
                        />
                      </View>
                    </View>
                    <View style={styles.ContainerView}>
                      <View style={styles.titleView}>
                        <Text style={{ fontSize: 18, color: "#888" }}>
                          {t("Service type")}
                        </Text>
                      </View>

                      <View style={styles.inputView}>
                        <Text style={{ fontSize: 16, width: "auto" }}>
                          {serviceType}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.ContainerView}>
                      <View style={styles.titleView}>
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
                          style={styles.inputView}
                          textStyle={{
                            fontSize: 16,
                            padding: 10,
                          }}
                          dropDownContainerStyle={{
                            borderColor: "#DDDEE0",
                            padding: 0,
                            paddingBottom: 10,
                          }}
                        />
                      </View>
                    </View>

                    <View style={styles.ContainerAccountnumberView}>
                      <View style={styles.titleView}>
                        <Text style={{ fontSize: 18, color: "#888" }}>
                          {t("Mobile account number")}
                        </Text>
                      </View>
                      <View style={styles.phoneNumberView}>
                        <Text style={{ fontSize: 18 }}>+258</Text>
                        <TextInput
                          onChangeText={(value) => setserviceAccount(value)}
                          value={serviceAccount}
                          keyboardType="numeric"
                          maxLength={9}
                          style={{
                            fontSize: 16,
                            width: "80%",
                            paddingLeft: 5,
                            padding: 15,
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
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#DDDEE0",

    backgroundColor: "#fff",
  },

  inputTextView: {
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#DDDEE0",

    backgroundColor: "#fff",
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
    paddingLeft: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#DDDEE0",
    flexDirection: "row",
    alignItems: "center",

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
