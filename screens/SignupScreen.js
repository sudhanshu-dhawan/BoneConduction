import React, { useState } from "react";
import {
  View, TextInput, TouchableOpacity, Alert, Text,
  StyleSheet, ScrollView
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/fireBaseConfig";
import { ref, set } from "firebase/database";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [disease, setDisease] = useState(""); // 👈 New disease state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !contact || !age || !weight || !height || !gender || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await set(ref(db, `users/${user.uid}`), {
        name,
        email,
        contact,
        age,
        weight,
        height,
        gender,
        disease, // 👈 Save disease
      });

      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("LoginScreen");
    } catch (error) {
      Alert.alert("Signup Error", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign <Text style={styles.bold}>Up</Text></Text>
        <Text style={styles.subtitle}>
          Register with your mobile number to start using BoneTune!
        </Text>

        {/* Name */}
        <Text style={styles.label}>Name</Text>
        <TextInput placeholder="Your Name" value={name} onChangeText={setName} style={styles.input} />

        {/* Email */}
        <Text style={styles.label}>E-Mail</Text>
        <TextInput placeholder="Your E-Mail" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />

        {/* Contact */}
        <Text style={styles.label}>Contact</Text>
        <TextInput placeholder="Your Contact" value={contact} onChangeText={setContact} style={styles.input} keyboardType="phone-pad" />

        {/* Age */}
        <Text style={styles.label}>Age</Text>
        <TextInput placeholder="Your Age" value={age} onChangeText={setAge} style={styles.input} keyboardType="numeric" />

        {/* Weight */}
        <Text style={styles.label}>Weight (In Kgs)</Text>
        <TextInput placeholder="Your Weight" value={weight} onChangeText={setWeight} style={styles.input} keyboardType="numeric" />

        {/* Height */}
        <Text style={styles.label}>Height (In cm)</Text>
        <TextInput placeholder="Your Height" value={height} onChangeText={setHeight} style={styles.input} keyboardType="numeric" />

        {/* Gender Dropdown */}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={gender} onValueChange={(itemValue) => setGender(itemValue)} style={styles.picker}>
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        {/* Disease Dropdown */}
        <Text style={styles.label}>Select Disease (if any)</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={disease} onValueChange={(itemValue) => setDisease(itemValue)} style={styles.picker}>
            <Picker.Item label="None" value="" />
            <Picker.Item label="Diabetes" value="Diabetes" />
            <Picker.Item label="Hypertension" value="Hypertension" />
            <Picker.Item label="Asthma" value="Asthma" />
            <Picker.Item label="Heart Disease" value="Heart Disease" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        {/* Password */}
        <Text style={styles.label}>Enter Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Your Password"
            value={password}
            onChangeText={setPassword}
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="gray"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password */}
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.passwordInput}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons
              name={showConfirmPassword ? "eye-off" : "eye"}
              size={24}
              color="gray"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Signup Button */}
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <Text style={styles.linkText} onPress={() => navigation.navigate("LoginScreen")}>
          Already have an account? <Text style={styles.link}>Login</Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "300",
    textAlign: "left",
    marginBottom: 5,
  },
  bold: {
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#002E5D",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  button: {
    backgroundColor: "#002E5D",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  linkText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
  },
  link: {
    color: "#002E5D",
    fontWeight: "600",
  },
});

export default SignupScreen;
