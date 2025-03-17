
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert , TouchableOpacity } from "react-native";
import { auth, db } from "../config/fireBaseConfig";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { collection, getDoc, doc } from "firebase/firestore";
import { StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";


const LoginScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleLogin = () => {
    // Basic validation
    if (!form.email || !form.password) {
      Alert.alert("Error", "Email and Password are required!");
      return;
    }

    // Sign in with Firebase Authentication
    signInWithEmailAndPassword(auth, form.email, form.password)
      .then((userCredential) => {
        // User signed in successfully
        const user = userCredential.user;
        console.log("User signed in:", user);
        Alert.alert("Success", "Logged in successfully!");
        // Navigate to the Home screen (or wherever you want to go after login)
        navigation.navigate("HomeScreen");
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert("Error", errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Welcome back to BoneTune!</Text>

      {/* Email Input */}
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

      {/* Password Input */}
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>PASSWORD</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={18} color="#023a75" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Your Password"
            secureTextEntry
            value={form.password}
            onChangeText={(text) => handleChange("password", text)}
          />
        </View>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Go to Sign Up */}
      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
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