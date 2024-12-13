import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./src/components/TabNavigator";
import AllTransactions from "./src/components/allTransactions";
import DepositPage from "./src/components/depositPage";
import ManageAccount from "./src/components/manageAccount";
import ManageTransactions from "./src/components/manageTransactions";
import MobileWalletService from "./src/components/mobileWalletService";
import ManageNotifications from "./src/components/manageNotifications";
import Languages from "./src/components/Languages";
import DepositMethod from "./src/components/depositMethod";
import ContactUs from "./src/components/contactUs";
import TermPolicy from "./src/components/termPolicy";
import ConfirmDeposit from "./src/components/confirmDeposit";
import Login from "./src/components/login";
import AccountDetail from "./src/components/accountDetail";
import ChangeDepositMethod from "./src/components/changeDepositMethod";
import CusProfile from "./src/components/cusProfile";
import CusContact from "./src/components/custContact";
import CusLocation from "./src/components/cusLocation";
import CusCredentials from "./src/components/cusCredentials";
import CusBusiness from "./src/components/cusBusiness";
import Edit from "./src/components/edit";
import i18n from "./i18n";
import { useTranslation } from "react-i18next";
import NotificationsMessage from "./src/components/notificationsMessage";
import colors from "./src/components/color";

const Stack = createNativeStackNavigator();

export default function App() {
  const { t } = useTranslation();
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerBackLabel: () => null,
          headerTransparent: true,
          headerShown: true,
        }}
      >
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

        {/* <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{
            headerShown: false,
          }}
        /> */}

        <Stack.Screen
          name="AllTransactions"
          component={AllTransactions}
          options={{
            headerShown: true,
            headerTransparent: false,
            headerTitle: t("All transactions"),
            headerTintColor: "#12A19B",
            headerTitleStyle: {
              color: "black",
            },
          }}
        />

        <Stack.Screen
          name="Deposit"
          component={DepositPage}
          options={{
            headerTitle: "",

            headerTintColor: "#12A19B",
            headerTitleStyle: {
              color: "black",
            },
          }}
        />

        <Stack.Screen
          name="ManageAccount"
          component={ManageAccount}
          options={{
            headerTitle: "",

            headerTintColor: "#12A19B",
            headerTitleStyle: {
              color: "black",
            },
          }}
        />

        <Stack.Screen
          name="ManageTransactions"
          component={ManageTransactions}
          options={{
            headerTitle: "",
            headerTintColor: "#12A19B",
            headerTitleStyle: {
              color: "black",
            },
          }}
        />

        <Stack.Screen
          name="MobileWalletService"
          component={MobileWalletService}
          options={{
            headerTitle: t("Mobile wallet"),
            headerTintColor: "#12A19B",
            headerTitleStyle: {
              color: "black",
            },
          }}
        />

        <Stack.Screen
          name="ManageNotifications"
          component={ManageNotifications}
          options={{
            headerTitle: "",

            headerTintColor: "#12A19B",
            headerTitleStyle: {
              color: "black",
            },
          }}
        />

        <Stack.Screen
          name="NotificationsMessage"
          component={NotificationsMessage}
          options={{
            headerTitle: t(""),

            headerStyle: {
              backgroundColor: colors.appBackground,
            },

            headerTintColor: colors.Primary,
            headerTitleStyle: {
              color: "black",
            },
          }}
        />

        <Stack.Screen
          name="Languages"
          component={Languages}
          options={{
            headerTitle: t("Change language"),

            headerTintColor: "#12A19B",
            headerTitleStyle: {
              color: "black",
            },
          }}
        />

        <Stack.Screen
          name="DepositMethod"
          component={DepositMethod}
          options={{
            headerTitle: t("Deposit Method"),

            headerTintColor: "#12A19B",
            headerTitleStyle: {
              color: "black",
            },
          }}
        />

        <Stack.Screen
          name="ChangeDepositMethod"
          component={ChangeDepositMethod}
          options={{
            headerTitle: t("Select service"),
            headerTintColor: "#12A19B",
            headerTitleStyle: {
              color: "black",
            },
          }}
        />

        <Stack.Screen
          name="Edit"
          component={Edit}
          options={{
            headerTitle: t("Edit"),
            headerTintColor: "#12A19B",
            headerTitleStyle: {
              color: "black",
            },
          }}
        />

        <Stack.Screen
          name="TermPolicy"
          component={TermPolicy}
          options={{
            headerTitle: t("Terms and policy"),

            headerTintColor: "#12A19B",
            headerTitleStyle: {
              color: "black",
            },
          }}
        />

        <Stack.Screen
          name="ContactUs"
          component={ContactUs}
          options={{
            headerTitle: "Contact us",

            headerTintColor: "#12A19B",
            headerTitleStyle: {
              color: "black",
            },
          }}
        />

        <Stack.Screen
          name="ConfirmDeposit"
          component={ConfirmDeposit}
          options={({ navigation, route }) => ({
            headerTitle: "",

            headerRight: () => (
              <Button
                onPress={() =>
                  navigation.navigate("Home", { userId: route.params.username })
                }
                title={t("Cancel")}
                color="#12A19B"
              />
            ),

            headerTintColor: "#12A19B",
            headerTitleStyle: {
              color: "black",
            },
          })}
        />

        <Stack.Screen
          name="AccountDetail"
          component={AccountDetail}
          options={{
            headerTitle: "",

            headerTintColor: "#12A19B",
            headerTitleStyle: {
              color: "black",
            },
          }}
        />

        <Stack.Screen
          name="CusProfile"
          component={CusProfile}
          options={{
            headerTitle: t("Profile"),
            headerTintColor: "#12A19B",
            headerTitleStyle: {
              color: "black",
            },
          }}
        />

        <Stack.Screen
          name="CusContact"
          component={CusContact}
          options={{
            headerTitle: t("Contact"),

            headerTintColor: "#12A19B",
            headerTitleStyle: {
              color: "black",
            },
          }}
        />

        <Stack.Screen
          name="CusLocation"
          component={CusLocation}
          options={{
            headerTitle: t("Location"),

            headerTintColor: "#12A19B",
            headerTitleStyle: {
              color: "black",
            },
            headerStyle: {
              backgroundColor: "#F5F6F8",
            },
          }}
        />
        <Stack.Screen
          name="CusBusiness"
          component={CusBusiness}
          options={{
            headerTitle: t("Company profile"),

            headerTintColor: "#12A19B",
            headerTitleStyle: {
              color: "black",
            },
          }}
        />

        <Stack.Screen
          name="CusCredentials"
          component={CusCredentials}
          options={{
            headerTitle: t("Credentials"),

            headerTintColor: "#12A19B",
            headerTitleStyle: {
              color: "black",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
