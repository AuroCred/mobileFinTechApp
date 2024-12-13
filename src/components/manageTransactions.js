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
  Pressable,
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

export default function ManageTransactions({ route }) {
  const { userId } = route.params;
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [headerShown, setHeaderShown] = useState(false);

  return (
    <View style={{ backgroundColor: "#F5F6F8", flex: 1 }}>
      <View style={styles.mainView}>
        <View style={{ paddingLeft: 20 }}>
          <Text style={{ fontSize: 25, fontWeight: 600 }}>
            {t("Manage transactions")}
          </Text>
        </View>
        <View style={{ paddingTop: 20 }}>
          <Pressable
            onPress={() =>
              navigation.navigate("MobileWalletService", { userId: userId })
            }
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "#ccc" : "#F5F6F8",
              },
            ]}
          >
            <View style={styles.lineComponent}>
              <View style={{ flexDirection: "row" }}>
                <Icon name="phone-iphone" size={25} />
                <Text style={{ fontSize: 16, left: 15 }}>
                  {t("Mobile wallet")}
                </Text>
              </View>
              <Icon name="chevron-right" size={25} />
            </View>
          </Pressable>

          <Pressable
          //   onPress={() => navigation.navigate("CusContact", { userId: userId })}
          //   style={({ pressed }) => [
          //     {
          //       backgroundColor: pressed ? "#ccc" : "#F5F6F8",
          //     },
          //   ]}
          >
            <View style={styles.lineComponent}>
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "space-between",
                }}
              >
                <Icon name="credit-card" size={25} />
                <Text style={{ fontSize: 16, left: 15 }}>
                  {t("Card service")}
                </Text>
              </View>

              <Icon name="chevron-right" size={25} />
            </View>
          </Pressable>

          <Pressable
          //   onPress={() => navigation.navigate("CusLocation", { userId: userId })}
          //   style={({ pressed }) => [
          //     {
          //       backgroundColor: pressed ? "#ccc" : "#F5F6F8",
          //     },
          //   ]}
          >
            <View style={styles.lineComponent}>
              <View style={{ flexDirection: "row" }}>
                <Icon name="account-balance" size={25} />
                <Text style={{ fontSize: 16, left: 15 }}>
                  {t("Bank tranfer")}
                </Text>
              </View>
              <Icon name="chevron-right" size={25} />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: { padding: 10, paddingTop: 100 },

  lineComponent: {
    padding: 20,
    borderBottomWidth: 0.5,
    borderColor: "#E4E4E4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
