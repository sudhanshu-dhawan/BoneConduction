import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/BoneTune.png")} style={styles.image} />
      <Text style={styles.title}>Welcome to</Text>
      <Text style={styles.highlight}>BONE TUNE </Text>
      <Text style={styles.subtitle}>
      Experience the future of sound and health! 🎧💙 Stay connected, track your vitals in real-time, and enjoy music like never before with our smart bone conduction headphones.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("SignupScreen")}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  image: { width: 200, height: 200, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#333" },
  highlight: { fontSize: 26, fontWeight: "bold", color: "#023a75" },
  subtitle: { fontSize: 16, textAlign: "center", color: "#666", marginVertical: 10 },
  button: { backgroundColor: "#023a75", padding: 15, borderRadius: 10, marginTop: 20 },
  buttonText: { color: "#fff", fontSize: 18 },
});

export default WelcomeScreen;
