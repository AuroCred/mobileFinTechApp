import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { API_URL_USER_ACCOUNT } from "@env";
import axios from "axios";

export default function Languages({ route }) {
  const { userId, id } = route.params;
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [languageCode, setLanguageCode] = useState("");
  const [items, setItems] = useState([
    { label: t("English"), value: "en" },
    { label: t("Portuguese"), value: "pt" },
    { label: t("Macua (Mozambique)"), value: "mac-moz" },
  ]);

  useEffect(() => {
    const getLanguageCode = async () => {
      try {
        const languageCodeSelected = await AsyncStorage.getItem(userId);
        const language = languageCodeSelected || "en";

        setLanguageCode(language);

        await i18n.changeLanguage(language);
        // setLoading(false);
      } catch (error) {
        console.error("Error retrieving language code:", error);
        // setLoading(false);
      }
    };

    getLanguageCode();
  }, []);

  const upadateLanguage = async () => {
    try {
      const response = await axios.put(
        `${API_URL_USER_ACCOUNT}/update/language/${id}`,
        {
          username: userId,
          languageCode: languageCode,
        }
      );

      // const responses = response.data[0].message;
      // console.log(responses);

      Alert.alert(
        "",
        t("New language settings will apply next time you restart the app."),
        [
          {
            text: t("Close app now"),
            onPress: () => {
              AsyncStorage.removeItem(userId);
              navigation.popToTop();
            },

            style: "cancel",
          },
          {
            text: t("Ok"),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      Alert.alert("Error", error.message);
      console.log("Error:", error);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title={t("Save")}
          color="#12A19B"
          onPress={() => upadateLanguage()}
        />
      ),
    });
  }, [navigation, languageCode]);

  return (
    <View style={styles.mainView}>
      <View style={styles.title}>
        <Text style={{ fontSize: 18, color: "#888" }}>{t("Languages")}</Text>
      </View>

      <View>
        <DropDownPicker
          open={open}
          value={languageCode}
          items={items}
          setOpen={setOpen}
          setValue={setLanguageCode}
          setItems={setItems}
          defaultValue={languageCode}
          listMode="SCROLLVIEW"
          style={styles.inputView}
          textStyle={{
            fontSize: 18,
            padding: 13,
            paddingLeft: 5,
          }}
          dropDownContainerStyle={{ borderColor: "#DDDEE0" }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F6F8",
    paddingTop: 100,
  },

  inputView: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#DDDEE0",
    width: "100%",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    padding: 15,
    paddingLeft: 0,
  },
});
