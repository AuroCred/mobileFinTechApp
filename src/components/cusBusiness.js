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
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon } from "react-native-elements";
import { API_URL_USER_ACCOUNT } from "@env";
import axios from "axios";
import moment from "moment";
import { useTranslation } from "react-i18next";

export default function CusBusiness({ route, navigation }) {
  const { userId } = route.params;
  const [companyName, setcompanyName] = useState("");
  const [startYear, setstartYear] = useState("");
  const [businessType, setbusinessType] = useState("");
  const [id, setid] = useState("");
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
        setcompanyName(response.data[0].company_name);
        setstartYear(response.data[0].company_start_year);
        setbusinessType(response.data[0].company_business_type);
      })
      .catch((error) => {
        alert("Error" + error);
      });
  }, []);

  const updateBusinessProfile = () => {
    axios
      .put(`${API_URL_USER_ACCOUNT}/update/businessProfile/${id}`, {
        companyName: companyName,
        startYear: startYear,
        businessType: businessType,
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
          onPress={() => updateBusinessProfile()}
        />
      ),
    });
  }, [navigation, companyName, startYear, businessType]);

  return (
    <View style={styles.mainView}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <View style={{ padding: 15 }}>
            <View style={styles.components}>
              <Text style={{ fontSize: 16, fontWeight: 500 }}>
                {t("Company name")}
              </Text>
            </View>
            <View style={styles.componentsWithBorder}>
              <TextInput
                value={companyName}
                onChangeText={(value) => setcompanyName(value)}
                style={{ fontSize: 16, width: "100%" }}
              />
            </View>

            <View style={styles.components}>
              <Text style={{ fontSize: 16, fontWeight: 500 }}>
                {t("Year of starting")}
              </Text>
            </View>
            <View style={styles.componentsWithBorder}>
              <TextInput
                onChangeText={(value) => setstartYear(value)}
                value={startYear}
                style={{ fontSize: 16, width: "100%" }}
              />
            </View>

            <View style={styles.components}>
              <Text style={{ fontSize: 16, fontWeight: 500 }}>
                {t("Business type")}
              </Text>
            </View>
            <View style={styles.componentsWithBorder}>
              <TextInput
                onChangeText={(value) => setbusinessType(value)}
                value={t(businessType)}
                style={{ fontSize: 16, width: "100%" }}
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
    padding: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#DDDEE0",
    width: "auto",
    backgroundColor: "#fff",
    flexDirection: "row",
  },
});
