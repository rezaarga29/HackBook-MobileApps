import { gql, useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import AuthContext from "../context/auth";

const MUTATION_LOGIN = gql`
  mutation LoginUser($email: String, $password: String) {
    loginUser(email: $email, password: $password) {
      access_token
      email
    }
  }
`;

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = useContext(AuthContext);

  const [loginHandler, { loading, error, data }] = useMutation(MUTATION_LOGIN, {
    onCompleted: async (mutationResult) => {
      if (mutationResult?.loginUser?.access_token) {
        await SecureStore.setItemAsync(
          "access_token",
          mutationResult?.loginUser?.access_token
        );
        auth.setIsSignedIn(true);
      }
    },
  });

  const handleLogin = () => {
    // Lakukan validasi email dan password
    if (!email || !password) {
      alert("Email and Password is required");
      return;
    }
    loginHandler({
      variables: {
        email: email,
        password: password,
      },
    })
      .then(() => {
        alert("Login Success");
      })
      .catch((error) => {
        alert(error.message);
      });

    // navigation.navigate("HackBook");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HackBook</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.registerText}>
        If you don't have an account, please{" "}
        <Text
          style={styles.registerLink}
          onPress={() => navigation.navigate("Register")}
        >
          Register here
        </Text>
        .
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#007bff", // Ubah warna teks menjadi biru
    fontStyle: "italic", // Ubah gaya font menjadi italic
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  registerText: {
    marginTop: 10,
  },
  registerLink: {
    color: "blue",
  },
});
