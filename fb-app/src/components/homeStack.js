import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Button } from "react-native";
import RegisterScreen from "../screens/registerScreen";
import LoginScreen from "../screens/loginScreen";
import AuthContext from "../context/auth";
import * as SecureStore from "expo-secure-store";
import HomeTabs from "./homeTabs";
const Stack = createNativeStackNavigator();

export default function HomeStack() {
  const [isSignedIn, setIsSignedIn] = useState(false); // Ganti dengan cara Anda mengecek apakah pengguna telah masuk atau belum
  useEffect(() => {
    SecureStore.getItemAsync("access_token")
      .then((result) => {
        if (result) {
          setIsSignedIn(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        setIsSignedIn,
      }}
    >
      <Stack.Navigator>
        {!isSignedIn && (
          <>
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
        {isSignedIn && (
          <>
            <Stack.Screen
              name="HackBook"
              component={HomeTabs}
              options={{
                headerTintColor: "#007bff",
                headerTitleStyle: {
                  fontSize: 30,
                  fontWeight: "bold",
                },
                headerRight: () => (
                  <Button
                    onPress={async () => {
                      const token = await SecureStore.deleteItemAsync(
                        "access_token"
                      );
                      setIsSignedIn(false);
                    }}
                    title="Log Out"
                    color="#007bff"
                  />
                ),
                headerRightContainerStyle: { paddingRight: 10 },
                headerShown: true,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </AuthContext.Provider>
  );
}
