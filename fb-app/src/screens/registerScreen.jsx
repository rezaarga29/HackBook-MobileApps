import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { gql, useMutation } from "@apollo/client";

const MUTATION_REGISTER = gql`
  mutation RegisterUser($newUser: NewUser) {
    registerUser(newUser: $newUser) {
      username
      name
      email
    }
  }
`;

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [registerUser, { loading, error, data }] =
    useMutation(MUTATION_REGISTER);

  const handleRegister = () => {
    // Lakukan validasi data registrasi
    if (!name || !username || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    const newUser = {
      name: name,
      username: username, // Pisahkan tag dengan koma, dan hapus spasi di awal dan akhir
      email: email,
      password: password,
    };

    // Panggil createPost
    registerUser({
      variables: { newUser: newUser },
    })
      .then((result) => {
        // Setelah berhasil, kosongkan form
        setName("");
        setUsername("");
        setEmail("");
        setPassword("");

        alert("Register Success");
        navigation.navigate("Login");
      })
      .catch((error) => {
        console.error("Error Register user:", error);
        // Handle error
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HackBook</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
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
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <Text style={styles.loginText}>
        If you have an account, please{" "}
        <Text
          style={styles.loginLink}
          onPress={() => navigation.navigate("Login")}
        >
          Login here
        </Text>
        .
      </Text>
    </View>
  );
};

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
  loginText: {
    marginTop: 10,
  },
  loginLink: {
    color: "blue",
  },
});

export default RegisterScreen;
