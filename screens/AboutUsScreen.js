import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const AboutUs = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About BoneTune</Text>
      
      <Text style={styles.description}>
        BoneTune is a next-generation app designed for music lovers and health enthusiasts. 
        With BoneTune, you can enjoy high-quality music while seamlessly tracking your health activity. 
        Our smart headphone integration ensures that you stay entertained and informed about your wellness.
      </Text>
      
      <Text style={styles.sectionTitle}>Key Features:</Text>
      <Text style={styles.featureItem}>🎧 High-Quality Music Streaming</Text>
      <Text style={styles.featureItem}>📊 Real-Time Health Activity Tracking</Text>
      <Text style={styles.featureItem}>🔊 Smart Sound Optimization</Text>
      <Text style={styles.featureItem}>📡 Bluetooth & App Integration</Text>
      <Text style={styles.featureItem}>📅 Personalized Listening & Wellness Plans</Text>

      <Text style={styles.sectionTitle}>Why Choose BoneTune?</Text>
      <Text style={styles.description}>
        BoneTune is more than just a music app—it’s your personal health companion.
        Whether you're working out, meditating, or just relaxing, BoneTune adapts to your lifestyle.
      </Text>
      
      <Text style={styles.sectionTitle}>Get in Touch:</Text>
      <Text style={styles.contact}>📧 Email: support@bonetune.com</Text>
      <Text style={styles.contact}>🌐 Website: www.bonetune.com</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 40,
    marginTop: 40,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#023a75",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
    marginBottom: 15,
    textAlign: "justify",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#023a75",
    marginTop: 15,
  },
  featureItem: {
    fontSize: 16,
    color: "#555",
    marginVertical: 3,
  },
  contact: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
});

export default AboutUs;