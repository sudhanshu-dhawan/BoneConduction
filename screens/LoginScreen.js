import React, { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import { auth } from "../config/fireBaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const LoginScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleLogin = () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Email and Password are required!");
      return;
    }

    signInWithEmailAndPassword(auth, form.email, form.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User signed in:", user);
        Alert.alert("Success", "Logged in successfully!");
        navigation.navigate("HomeScreen");
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert("Invalid credentials or user does not exist");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Welcome back to BoneTune!</Text>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>E-MAIL</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="at" size={18} color="#023a75" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Your E-Mail"
            value={form.email}
            onChangeText={(text) => handleChange("email", text)}
          />
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>PASSWORD</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={18} color="#023a75" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Your Password"
            secureTextEntry={!passwordVisible}
            value={form.password}
            onChangeText={(text) => handleChange("password", text)}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <FontAwesome name={passwordVisible ? "eye" : "eye-slash"} size={18} color="#023a75" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignupScreen")}>
        <Text style={styles.signUpLink}>
          Don’t have an account? <Text style={styles.bold}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#023a75",
    fontWeight: "600",
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#023a75",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#023a75",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpLink: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  bold: {
    color: "#023a75",
    fontWeight: "bold",
  },
});

export default LoginScreen;
