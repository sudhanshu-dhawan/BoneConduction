import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { auth, db } from "../config/fireBaseConfig"; // Firebase setup
import { getDatabase, ref, get } from "firebase/database";

import ProfileScreen from "./ProfileScreen";
import MonthlyStatusScreen from "./MonthlyStatusScreen";
import ReportScreen from "./ReportScreen";
import ChatBotScreen from "./ChatBotScreen";

export const HomeScreen = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState("Temperature");
  const [userName, setUserName] = useState("User");
  const [userData, setUserData] = useState({ temperature: 36, oxygen: 98, heartRate: 72 });
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    console.log("Fetching user data...");

    const fetchUserData = async () => {
      try {
        if (!auth.currentUser) {
          console.error("No user is logged in.");
          setLoading(false);
          return;
        }

        const db = getDatabase();
        const userRef = ref(db, `users/${auth.currentUser.uid}`);

        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log("User Data:", data);
          setUserName(data.name || "User"); // Update userName state
        } else {
          console.error("No user data found in database.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
    generateDates(); // Generate dates dynamically
  }, []);

  const generateDates = () => {
    const today = new Date();
    let dateArray = [];
  
    for (let i = 0; i < 7; i++) {
      let nextDate = new Date();
      nextDate.setDate(today.getDate() + i);
  
      let dayName = nextDate.toLocaleDateString("en-IN", { weekday: "short" }); // Corrected for Indian locale
      let formattedDate = `${nextDate.getDate()}-${nextDate.getMonth() + 1}-${nextDate.getFullYear()} (${dayName})`;
  
      dateArray.push(formattedDate);
    }
  
    setDates(dateArray);
  };
  
  const renderHealthData = () => {
    let value = 0;
    let label = "";
    switch (selectedTab) {
      case "Temperature":
        value = userData.temperature;
        label = "Body Temperature";
        break;
      case "Oxygen Level":
        value = userData.oxygen;
        label = "Oxygen Level";
        break;
      case "Heart Rate":
        value = userData.heartRate;
        label = "Heart Rate";
        break;
    }

    return (
      <View style={styles.healthContainer}>
        <Text style={styles.healthLabel}>{label}</Text>
        <Text style={styles.healthValue}>{value}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{userName[0]}</Text>
        </View>
        <Text style={styles.username}>Welcome back, {userName}!</Text>
      </View>

      {/* Calendar with dynamically generated dates */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendar}>
        {dates.map((day, index) => (
          <TouchableOpacity key={index} style={styles.dateBox}>
            <Text style={styles.dateText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Health Data Tabs */}
      <View style={styles.tabContainer}>
        {["Temperature", "Oxygen Level", "Heart Rate"].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            onPress={() => setSelectedTab(tab)}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
          > 
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {renderHealthData()}

      {/* Services Section */}
      <View style={styles.servicesContainer}>
        <TouchableOpacity style={styles.serviceBox} onPress={() => navigation.navigate("ReportScreen")}> 
          <FontAwesome name="file-text-o" size={24} color="#023a75" />
          <Text style={styles.serviceText}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.serviceBox} onPress={() => navigation.navigate("ChatBotScreen")}> 
          <FontAwesome name="comments" size={24} color="#023a75" />
          <Text style={styles.serviceText}>ChatBot</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="home" color={color} size={size} />)
        }} 
      />
      <Tab.Screen 
        name="Monthly Status" 
        component={MonthlyStatusScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="chart-line" color={color} size={size} />)
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="account" color={color} size={size} />)
        }} 
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatarPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#ddd", alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 20, fontWeight: "bold", color: "#023a75" },
  username: { fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  calendar: { flexDirection: "row", marginBottom: 20 },
  dateBox: { padding: 10, marginRight: 10, backgroundColor: "#eee", borderRadius: 10 },
  tabContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderBottomWidth: 2, borderBottomColor: "#ccc" },
  activeTab: { borderBottomColor: "#023a75" },
  healthContainer: { alignItems: "center", padding: 20 },
  healthLabel: { fontSize: 16, fontWeight: "600", marginTop: 10 },
  healthValue: { fontSize: 22, fontWeight: "bold", color: "#023a75" },
  servicesContainer: { flexDirection: "row", justifyContent: "space-around", marginTop: 20 },
  serviceBox: { alignItems: "center", padding: 15, backgroundColor: "#eee", borderRadius: 10, width: 120 },
  serviceText: { marginTop: 5, fontSize: 14, fontWeight: "600" },
});