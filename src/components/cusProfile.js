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
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon } from "react-native-elements";
import { API_URL_USER_ACCOUNT } from "@env";
import axios from "axios";
import moment from "moment";
import { useTranslation } from "react-i18next";

export default function CusProfile({ route, navigation }) {
  const { userId } = route.params;
  const [firstName, setfirstName] = useState("");
  const [middleName, setmiddleName] = useState("");
  const [lastName, setlastName] = useState("");
  const [DOB, setDOB] = useState("");
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
        setfirstName(response.data[0].first_name);
        setmiddleName(response.data[0].middle_name);
        setlastName(response.data[0].last_name);
        setDOB(response.data[0].DOB);
      })
      .catch((error) => {
        alert("Error" + error);
      });
  }, []);

  const updateProfile = () => {
    axios
      .put(`${API_URL_USER_ACCOUNT}/update/profile/${id}`, {
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        DOB: DOB,
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
          onPress={() => updateProfile()}
        />
      ),
    });
  }, [navigation, firstName, middleName, lastName, DOB]);

  return (
    <View style={styles.mainView}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <View style={{ padding: 15 }}>
            <View style={styles.components}>
              <Text style={{ fontSize: 16, fontWeight: 500 }}>
                {t("First name")}
              </Text>
            </View>
            <View style={styles.componentsWithBorder}>
              <TextInput
                onChangeText={(value) => setfirstName(value)}
                value={firstName}
                style={styles.textImput}
              />
            </View>
            <View style={styles.components}>
              <Text style={{ fontSize: 16, fontWeight: 500 }}>
                {t("Middle name")}
              </Text>
            </View>
            <View style={styles.componentsWithBorder}>
              <TextInput
                onChangeText={(value) => setmiddleName(value)}
                value={middleName}
                style={styles.textImput}
              />
            </View>
            <View style={styles.components}>
              <Text style={{ fontSize: 16, fontWeight: 500 }}>
                {t("Last name")}
              </Text>
            </View>
            <View style={styles.componentsWithBorder}>
              <TextInput
                onChangeText={(value) => setlastName(value)}
                value={lastName}
                style={styles.textImput}
              />
            </View>
            <View style={styles.components}>
              <Text style={{ fontSize: 16, fontWeight: 500 }}>
                {t("Date of birth")}
              </Text>
            </View>

            <View style={styles.componentsWithBorder}>
              <TextInput
                onChangeText={(value) => setDOB(value)}
                value={moment(DOB).format(t("YYYY-MM-DD"))}
                placeholder={t("Year-Month-Day")}
                editable={false}
                style={styles.textImput}
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
  textImput: {
    fontSize: 16,
    width: "100%",
    padding: 12,
    paddingLeft: 10,
  },

  components: {
    padding: 20,
    paddingLeft: 0,
  },

  componentsWithBorder: {
    padding: 0,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#DDDEE0",
    width: "auto",
    backgroundColor: "#fff",
  },
});
