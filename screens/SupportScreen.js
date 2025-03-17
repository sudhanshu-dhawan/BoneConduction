import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Ensure you have this installed

const SupportScreen = ({ navigation }) => {
  const faqs = [
    { question: "How can I reset my password?", answer: "Go to Settings > Account > Reset Password." },
    { question: "How do I contact customer support?", answer: "You can email us at sakshig2004@gmail.com or call 8146711900." },
    { question: "Can I update my profile details?", answer: "Yes, tap the three dots in your profile and select 'Edit Details'." },
    { question: "How do I logout?", answer: "Go to the Profile screen and tap 'Logout'." },
  ];

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#023a75" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Support</Text>
        </View>

        {/* Contact Section */}
        <View style={styles.contactContainer}>
          <Ionicons name="mail" size={20} color="#023a75" />
          <Text style={styles.contactText}>Email: sakshig2004@gmail.com</Text>
        </View>

        <View style={styles.contactContainer}>
          <Ionicons name="call" size={20} color="#023a75" />
          <Text style={styles.contactText}>Contact: 8146711900</Text>
        </View>

        {/* FAQ Section */}
        <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqCard}>
            <Text style={styles.question}>{faq.question}</Text>
            <Text style={styles.answer}>{faq.answer}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    marginTop: 40, // Ensures spacing from top navigation
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 10, 
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#023a75",
    marginLeft: 15,
  },
  contactContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f0f4f8",
    padding: 12,
    borderRadius: 8,
  },
  contactText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#023a75",
    fontWeight: "600",
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#023a75",
  },
  faqCard: {
    backgroundColor: "#f9fbfc",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#d0dbe8",
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#023a75",
  },
  answer: {
    fontSize: 14,
    color: "#444",
    marginTop: 5,
  },
});

export default SupportScreen;