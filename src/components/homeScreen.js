import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomerAccount from "./customerAccount";
import RecentTransactions from "./recentTransactions";
import moment from "moment";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import DonutCharts from "./donutChart";
import colors from "./color";
import LottieView from "lottie-react-native";

export default function HomeScreen({ route }) {
  const { userId } = route.params;
  const { t } = useTranslation();

  const translation = useRef(new Animated.Value(-90)).current;
  const [headerShown, setHeaderShown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCountryCurrencyCode, setshowCountryCurrencyCode] = useState("");
  const [showCountryCurrency, setshowCountryCurrency] = useState("");

  useEffect(() => {
    Animated.timing(translation, {
      toValue: headerShown ? 0 : 34,
      duration: 0,
      useNativeDriver: true,
    }).start();
  }, [headerShown]);

  useEffect(() => {
    const getLanguageCode = async () => {
      const userLanguageCode = `${userId}`;

      try {
        const languageCode = await AsyncStorage.getItem(userLanguageCode);

        const language = languageCode || "en";
        // console.log(language);
        await i18n.changeLanguage(language);
        // setLoading(false);
      } catch (error) {
        console.error("Error retrieving language code:", error);
        // setLoading(false);
      }
    };

    getLanguageCode();
  }, []);

  const today = moment();
  const curHours = today.hours();

  let timeofday;

  if (curHours < 12) {
    timeofday = t("good morning");
  } else if (curHours < 18) {
    timeofday = t("good afternoon");
  } else {
    timeofday = t("good evening");
  }

  // useEffect(() => {
  //   // Simulate a network request

  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 3000);
  // }, []);

  // if (loading) {
  //   return (
  //     <View style={styles.container}>
  //       <LottieView
  //         style={{ width: 200, height: 200 }}
  //         source={require("../../loading/loader.json")}
  //         autoPlay
  //         loop
  //         scale={1}
  //       />
  //       <Text style={styles.text}>Sign in...</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={{ backgroundColor: "#F5F6F8", flex: 1 }}>
      <StatusBar barStyle="dark-content" />

      <Animated.View
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 40,
          height: 90,
          // borderColor: "#DDDEE0",
          // borderBottomWidth: 0.5,
          backgroundColor: "transparent",
          transform: [{ translateY: translation }],
        }}
      >
        {/* <Text style={{ fontWeight: "600", marginTop: 10 }}>
          {t("Settings")}
        </Text> */}
      </Animated.View>
      <ScrollView
        onScroll={(event) => {
          const scrolling = event.nativeEvent.contentOffset.y;
          if (scrolling > 32) {
            setHeaderShown(true);
          } else {
            setHeaderShown(false);
          }
        }}
        scrollEventThrottle={16}
        style={{ backgroundColor: "#F5F6F8" }}
      >
        <View style={styles.main}>
          <View style={styles.greeding}>
            <Text style={{ fontSize: 25, fontWeight: 600 }}>{timeofday}</Text>
            <Text style={{ fontSize: 14 }}>
              {t(moment().format("MMMM"))}
              {moment().format(" DD, YYYY")}
            </Text>
          </View>

          <View style={{ padding: 15, marginBottom: 90 }}>
            <View style={styles.conteiners}>
              <CustomerAccount userId={userId} setLoading={setLoading} />
            </View>
            <View style={styles.conteiners}>
              <RecentTransactions userId={userId} setLoading={setLoading} />
            </View>

            <View style={styles.conteiners}>
              <DonutCharts userId={userId} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  main: {
    padding: 0,
  },

  conteiners: {
    marginTop: 30,
  },

  greeding: {
    padding: 20,
    paddingBottom: 0,
    paddingTop: 0,
  },

  text: {
    top: -30,
    fontSize: 16,
    color: colors.Secundary,
  },
});
