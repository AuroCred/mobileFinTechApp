import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Animated,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Platform,
  Dimensions,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Icon } from "react-native-elements";
import CustomHeader from "./customHeader";
import colors from "./color";

export default function Payments({ route }) {
  const { userId } = route.params;
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [headerShown, setHeaderShown] = useState(true);
  const scrollViewRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.appBackground }}>
      {headerShown ? (
        <CustomHeader title="" />
      ) : (
        <CustomHeader title="Payments" />
      )}
      {/* <ScrollView
        onScroll={(event) => {
          const scrolling = event.nativeEvent.contentOffset.y;
          if (scrolling < 32) {
            setHeaderShown(true);
          } else {
            setHeaderShown(false);
          }
        }} 
      ref={scrollViewRef}>*/}
      <View style={[styles.mainView]}>
        <View style={{ paddingLeft: 20 }}>
          <Text style={{ fontSize: 25, fontWeight: "600" }}>
            {t("Payments")}
          </Text>
        </View>
        <View style={{ alignItems: "flex-start" }}>
          <TouchableOpacity
            style={styles.touchButton}
            onPress={() =>
              navigation.navigate("Deposit", {
                userId: userId,
                serviceName: "0",
                serviceAccountNumber: "0",
              })
            }
          >
            <View style={styles.icon}>
              <Icon name="assured-workload" color={colors.Primary} size={35} />
            </View>
            <View style={{ padding: 10 }}>
              <Text>{t("Pay loan")}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Pressable
          onPress={() =>
            navigation.navigate("AccountDetail", { userId: userId })
          }
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#ccc" : colors.appBackground,
            },
          ]}
        >
          <View style={styles.lineComponent}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 16 }}>{t("Check balance")}</Text>
            </View>
            <Icon name="chevron-right" size={25} />
          </View>
        </Pressable>

        <Pressable
          onPress={() =>
            navigation.navigate("AllTransactions", { userId: userId })
          }
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#ccc" : "#F5F6F8",
            },
          ]}
        >
          <View style={styles.lineComponent}>
            <View
              style={{
                flexDirection: "row",
                alignContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 16 }}>{t("See all payments")}</Text>
            </View>
            <Icon name="chevron-right" size={25} />
          </View>
        </Pressable>
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    padding: 10,
    paddingTop: 0,
    width: "100%",
    height: "100%",
  },

  lineComponent: {
    padding: 20,
    borderBottomWidth: 0.5,
    borderColor: colors.BorderColor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  touchButton: {
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 60,
    marginLeft: 10,
  },

  icon: {
    backgroundColor: "transparent",
    width: 80,
    height: 80,
    borderRadius: 50,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.Primary,
  },
});
