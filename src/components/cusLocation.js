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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon } from "react-native-elements";
import { API_URL_USER_ACCOUNT } from "@env";
import axios from "axios";
import moment from "moment";
import { useTranslation } from "react-i18next";

export default function CusLocation({ route, navigation }) {
  const { userId } = route.params;
  const [country, setcountry] = useState("");
  const [provinceorstate, setprovinceorstate] = useState("");
  const [city, setcity] = useState("");
  const [address, setaddress] = useState("");
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
        setcountry(response.data[0].country);
        setprovinceorstate(response.data[0].province_or_state);
        setcity(response.data[0].city);
        setaddress(response.data[0].address);
      })
      .catch((error) => {
        alert("Error" + error);
      });
  }, []);

  const updateLocation = () => {
    axios
      .put(`${API_URL_USER_ACCOUNT}/update/location/${id}`, {
        country: country,
        provinceorstate: provinceorstate,
        city: city,
        address: address,
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
          onPress={() => updateLocation()}
        />
      ),
    });
  }, [navigation, country, provinceorstate, city, address]);

  return (
    <View style={styles.mainView}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <View style={{ padding: 15 }}>
            <View style={styles.components}>
              <Text style={{ fontSize: 16, fontWeight: 500 }}>
                {t("Country")}
              </Text>
            </View>
            <View style={styles.componentsWithBorder}>
              <TextInput
                value={country}
                onChangeText={(value) => setcountry(value)}
                style={styles.textImput}
              />
            </View>

            <View style={styles.components}>
              <Text style={{ fontSize: 16, fontWeight: 500 }}>
                {t("Province / State")}
              </Text>
            </View>
            <View style={styles.componentsWithBorder}>
              <TextInput
                onChangeText={(value) => setprovinceorstate(value)}
                value={provinceorstate}
                style={styles.textImput}
              />
            </View>

            <View style={styles.components}>
              <Text style={{ fontSize: 16, fontWeight: 500 }}>{t("City")}</Text>
            </View>
            <View style={styles.componentsWithBorder}>
              <TextInput
                onChangeText={(value) => setcity(value)}
                value={city}
                style={styles.textImput}
              />
            </View>

            <View style={styles.components}>
              <Text style={{ fontSize: 16, fontWeight: 500 }}>
                {t("Address")}
              </Text>
            </View>
            <View style={styles.componentsWithBorder}>
              <TextInput
                onChangeText={(value) => setaddress(value)}
                value={address}
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
  },
  textImput: {
    fontSize: 16,
    width: "100%",
    padding: 12,
    paddingLeft: 10,
  },
});
