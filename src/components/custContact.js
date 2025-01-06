import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Button,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon } from "react-native-elements";
import { API_URL_USER_ACCOUNT } from "@env";
import axios from "axios";
import moment from "moment";
import { useTranslation } from "react-i18next";

export default function CusContact({ route, navigation }) {
  const { userId } = route.params;
  const [primaryPhoneNumber, setprimaryPhoneNumber] = useState("");
  const [secondaryPhoneNumber, setsecondaryPhoneNumber] = useState("");
  const [otherPhoneNumber, setotherPhoneNumber] = useState("");
  const [id, setid] = useState("");
  const [countryPhoneCode, setcountryPhoneCode] = useState("");
  const [email, setemail] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    axios
      .get(API_URL_USER_ACCOUNT, {
        params: {
          param: userId,
        },
      })

      .then((response) => {
        setid(response.data[0].id);
        setprimaryPhoneNumber(response.data[0].primary_phone_number);
        setsecondaryPhoneNumber(response.data[0].secondary_phone_number);
        setotherPhoneNumber(response.data[0].other_phone_number);
        setcountryPhoneCode(response.data[0].country_phone_code);
        setemail(response.data[0].email);
      })
      .catch((error) => {
        alert("Error" + error);
      });
  }, []);

  const updateContact = () => {
    axios
      .put(`${API_URL_USER_ACCOUNT}/update/contact/${id}`, {
        primaryPhoneNumber: primaryPhoneNumber,
        secondaryPhoneNumber: secondaryPhoneNumber,
        otherPhoneNumber: otherPhoneNumber,
        email: email,
      })
      .then((response) => {
        console.log(response.data.message);
        navigation.goBack();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // console.log(primaryPhoneNumber);
  // console.log(secondaryPhoneNumber);
  // console.log(otherPhoneNumber);
  // console.log(email);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title={t("Save")}
          color="#12A19B"
          onPress={() => updateContact()}
        />
      ),
    });
  }, [
    navigation,
    primaryPhoneNumber,
    secondaryPhoneNumber,
    otherPhoneNumber,
    email,
  ]);

  return (
    <View style={styles.mainView}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <View style={{ padding: 15 }}>
            <View style={styles.components}>
              <Text style={{ fontSize: 16, fontWeight: 500 }}>
                {t("Primary phone number")}
              </Text>
            </View>
            <View style={styles.componentsWithBorder}>
              <Text style={{ fontSize: 16 }}>{countryPhoneCode}</Text>
              <TextInput
                value={primaryPhoneNumber}
                onChangeText={(value) => setprimaryPhoneNumber(value)}
                style={[styles.textImput, { paddingLeft: 5 }]}
              />
            </View>

            <View style={styles.components}>
              <Text style={{ fontSize: 16, fontWeight: 500 }}>
                {t("Secondary phone number")}
              </Text>
            </View>
            <View style={styles.componentsWithBorder}>
              <Text style={{ fontSize: 16 }}>{countryPhoneCode}</Text>
              <TextInput
                onChangeText={(value) => setsecondaryPhoneNumber(value)}
                value={secondaryPhoneNumber}
                style={[styles.textImput, { paddingLeft: 5 }]}
              />
            </View>

            <View style={styles.components}>
              <Text style={{ fontSize: 16, fontWeight: 500 }}>
                {t("Other phone number")}
              </Text>
            </View>
            <View style={styles.componentsWithBorder}>
              <Text style={{ fontSize: 16 }}>{countryPhoneCode}</Text>
              <TextInput
                onChangeText={(value) => setotherPhoneNumber(value)}
                value={otherPhoneNumber}
                style={[styles.textImput, { paddingLeft: 5 }]}
              />
            </View>

            <View style={styles.components}>
              <Text style={{ fontSize: 16, fontWeight: 500 }}>
                {t("Email")}
              </Text>
            </View>
            <View style={styles.componentsWithBorderEmail}>
              <TextInput
                onChangeText={(value) => setemail(value)}
                value={email}
                style={[styles.textImput, { paddingLeft: 10 }]}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: "#F5F6F8",
    padding: 10,
    paddingTop: 70,
  },

  components: {
    padding: 20,
    paddingLeft: 0,
  },

  componentsWithBorder: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#DDDEE0",
    width: "auto",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    paddingLeft: 10,
  },
  componentsWithBorderEmail: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#DDDEE0",
    width: "auto",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
  },
  textImput: {
    fontSize: 16,
    width: "100%",
    padding: 12,
  },
});
