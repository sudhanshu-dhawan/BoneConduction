import React, { useState } from "react";
import { 
  View, TextInput, TouchableOpacity, Alert, Text, 
  StyleSheet, ScrollView 
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/fireBaseConfig";
import { ref, set } from "firebase/database";
import { Picker } from "@react-native-picker/picker";

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

        {/* Password */}
        <Text style={styles.label}>Enter Password</Text>
        <TextInput placeholder="Your Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

        {/* Confirm Password */}
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} style={styles.input} secureTextEntry />

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
    paddingVertical: 20,
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
    color: "#002E5D", // Blue color for labels
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
