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
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon } from "react-native-elements";
import { API_URL_USER_ACCOUNT } from "@env";
import axios from "axios";
import moment from "moment";
import { useTranslation } from "react-i18next";
import * as Updates from "expo-updates";

export default function CusCredentials({ route, navigation }) {
  const { userId } = route.params;
  const [userName, setuserName] = useState("");
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
        setuserName(response.data[0].username);
      })
      .catch((error) => {
        console.error(
          "Error fetching user account:",
          error.response || error.message
        );
        alert(
          "Error: " +
            (error.response ? error.response.data.message : error.message)
        );
      });
  }, [userId]);

  const restartApp = async () => {
    if (Platform.OS === "web") {
      window.location.reload();
    } else {
      await Updates.reloadAsync();
    }
  };

  const updateCredentials = () => {
    restartApp();
    console.log("Updating credentials for ID:", id);
    console.log("New username:", userName);

    axios
      .put(`${API_URL_USER_ACCOUNT}/update/credentials/${id}`, {
        userName: userName,
      })
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error(
          "Error updating credentials:",
          error.response || error.message
        );
      });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title={t("Save")}
          color="#12A19B"
          onPress={() => updateCredentials()}
        />
      ),
    });
  }, [navigation, userName]);

  return (
    <View style={styles.mainView}>
      <View style={styles.components}>
        <Text style={{ fontSize: 16, fontWeight: 500 }}>{t("Username")}</Text>
      </View>
      <View style={styles.componentsWithBorder}>
        <TextInput
          onChangeText={(value) => setuserName(value)}
          value={userName}
          style={{ fontSize: 16, width: "100%" }}
        />
      </View>

      <View style={styles.components}></View>
      <View>
        <TouchableOpacity>
          <View style={styles.passView}>
            <Text style={{ fontSize: 16, color: "#fff" }}>
              {t("Change password")}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: "#F5F6F8",
    padding: 25,
    paddingTop: 100,
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

  passView: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 5,

    backgroundColor: "#12A19B",
    borderColor: "#12A19B",
  },
});
