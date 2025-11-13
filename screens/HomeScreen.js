import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { auth } from "../config/fireBaseConfig";
import { getDatabase, ref, get, onValue, off } from "firebase/database";
import AnimatedProgressWheel from "react-native-progress-wheel";
import ProfileScreen from "./ProfileScreen";
import MonthlyStatusScreen from "./MonthlyStatusScreen";
import ReportScreen from "./ReportScreen";
import ChatBotScreen from "./ChatBotScreen";
import StepCounterScreen from "./StepCounterScreen";
import DataScreen from "./DataScreen";

export const HomeScreen = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState("Heart Rate");
  const [userName, setUserName] = useState("User");
  const [liveData, setLiveData] = useState({
    heartRate: null,
    spo2: null,
    temperature: null,
    lastUpdated: null
  });
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!auth.currentUser) return;

        const db = getDatabase();
        const userRef = ref(db, `users/${auth.currentUser.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserName(data.name || "User");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
    generateDates();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const uid = user.uid;
      let sensorDataRef;

      try {
        sensorDataRef = ref(getDatabase(), `sensorData/${uid}/readings`);
        
        const unsubscribe = onValue(sensorDataRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const readingKeys = Object.keys(data).sort();
            const latestReadingKey = readingKeys[readingKeys.length - 1];
            const latestReading = data[latestReadingKey];
            
            if (latestReading) {
              setLiveData({
                heartRate: latestReading.heartRate ?? null,
                spo2: latestReading.spo2 ?? null,
                temperature: latestReading.temperature ?? null,
                lastUpdated: latestReading.timestamp 
                  ? new Date(latestReading.timestamp).toLocaleTimeString() 
                  : new Date().toLocaleTimeString()
              });
            }
          }
          setLoading(false);
        }, (error) => {
          console.error("Live data error:", error);
          setLoading(false);
        });

        return () => {
          off(sensorDataRef);
        };
      } catch (err) {
        console.error("Live data connection error:", err);
        setLoading(false);
      }
    }, [])
  );

  const generateDates = () => {
    const today = new Date();
    let dateArray = [];

    for (let i = 0; i < 7; i++) {
      let nextDate = new Date();
      nextDate.setDate(today.getDate() + i);
      let dayName = nextDate.toLocaleDateString("en-IN", { weekday: "short" });
      let formattedDate = `${nextDate.getDate()}-${nextDate.getMonth() + 1}-${nextDate.getFullYear()} (${dayName})`;
      dateArray.push(formattedDate);
    }

    setDates(dateArray);
  };

  const getProgressData = () => {
    switch (selectedTab) {
      case "Temperature":
        return {
          value: liveData.temperature || 0,
          max: 42,
          color: liveData.temperature 
            ? liveData.temperature > 99.5
              ? "#FF4500" // Red for fever
              : liveData.temperature < 94 
                ? "#FFA500" // Orange for low
                : "#2E8B57" // Green for normal
            : "#023a75",
          unit: "°F",
          label: "Body Temperature",
          status: liveData.temperature 
            ? liveData.temperature > 99.5 
              ? "High"
              : liveData.temperature < 94 
                ? "Low"
                : "Normal"
            : "--"
        };
      case "Oxygen Level":
        return {
          value: liveData.spo2 || 0,
          max: 100,
          color: liveData.spo2 
            ? liveData.spo2 < 90 
              ? "#FF4500" // Red for low
              : liveData.spo2 < 95 
                ? "#FFA500" // Orange for borderline
                : "#2E8B57" // Green for normal
            : "#023a75",
          unit: "%",
          label: "Oxygen Level",
          status: liveData.spo2 
            ? liveData.spo2 < 90 
              ? "Low"
              : liveData.spo2 < 95 
                ? "Borderline"
                : "Normal"
            : "--"
        };
      case "Heart Rate":
        return {
          value: liveData.heartRate || 0,
          max: 150,
          color: liveData.heartRate 
            ? liveData.heartRate < 60 
              ? "#FFA500" // Orange for low
              : liveData.heartRate > 100 
                ? "#FF4500" // Red for high
                : "#2E8B57" // Green for normal
            : "#023a75",
          unit: "BPM",
          label: "Heart Rate",
          status: liveData.heartRate 
            ? liveData.heartRate < 60 
              ? "Low"
              : liveData.heartRate > 100 
                ? "High"
                : "Normal"
            : "--"
        };
      default:
        return {
          value: 0,
          max: 100,
          color: "#023a75",
          unit: "",
          label: "",
          status: "--"
        };
    }
  };

  const renderHealthData = () => {
    const { value, max, color, unit, label, status } = getProgressData();
    const displayValue = value !== null ? `${value}${unit}` : "--";

    return (
      <View style={styles.healthContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#023a75" />
        ) : (
          <>
            <AnimatedProgressWheel
              size={120}
              width={15}
              color={color}
              progress={(value / max) * 100}
              backgroundColor={"#f0f0f0"}
            />
            <Text style={styles.healthLabel}>{label}</Text>
            <Text style={[styles.healthValue, { color }]}>{displayValue}</Text>
            <Text style={[styles.healthStatus, { color }]}>{status}</Text>
            {liveData.lastUpdated && (
              <Text style={styles.updateText}>Last updated: {liveData.lastUpdated}</Text>
            )}
          </>
        )}
      </View>
    );
  };

  const handleDropdownSelect = (mode) => {
    setShowDropdown(false);
    navigation.navigate("StepCounterScreen", { mode });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{userName[0]}</Text>
        </View>
        <Text style={styles.username}>Welcome, {userName}!</Text>
      </View>

      {/* Calendar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendar}>
        {dates.map((day, index) => (
          <TouchableOpacity key={index} style={styles.dateBox}>
            <Text style={styles.dateText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Health Tabs */}
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

      {/* Services */}
      <View style={styles.servicesContainer}>
        <TouchableOpacity
          style={styles.serviceBox}
          onPress={() => navigation.navigate("ReportScreen")}
        >
          <FontAwesome name="file-text-o" size={24} color="#023a75" />
          <Text style={styles.serviceText}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.serviceBox}
          onPress={() => navigation.navigate("ChatBotScreen")}
        >
          <FontAwesome name="comments" size={24} color="#023a75" />
          <Text style={styles.serviceText}>ChatBot</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.serviceBox}
          onPress={() => navigation.navigate("Sensor Data")}
        >
          <MaterialCommunityIcons name="heart-pulse" size={24} color="#023a75" />
          <Text style={styles.serviceText}>Live Data</Text>
        </TouchableOpacity>
      </View>

      {/* Dropdown */}
      <View style={styles.dropdownWrapper}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text style={styles.dropdownButtonText}>Choose Activity ▼</Text>
        </TouchableOpacity>

        {showDropdown && (
          <View style={styles.dropdownOptions}>
            <TouchableOpacity
              style={styles.dropdownOption}
              onPress={() => handleDropdownSelect("walking")}
            >
              <Text>Walking</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownOption}
              onPress={() => handleDropdownSelect("running")}
            >
              <Text>Running</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#023a75",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Monthly Status"
        component={MonthlyStatusScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-line" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Sensor Data"
        component={DataScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart-pulse" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 20, fontWeight: "bold", color: "#023a75" },
  username: { fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  calendar: { flexDirection: "row", marginBottom: 20 },
  dateBox: {
    padding: 10,
    marginRight: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
  dateText: { fontSize: 12 },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
  },
  activeTab: { borderBottomColor: "#023a75" },
  tabText: { fontWeight: "bold", fontSize: 12 },
  healthContainer: { alignItems: "center", padding: 20 },
  healthLabel: { fontSize: 16, fontWeight: "600", marginTop: 10 },
  healthValue: { fontSize: 28, fontWeight: "bold", marginBottom: 4 },
  healthStatus: { fontSize: 16, fontStyle: "italic", marginBottom: 8 },
  updateText: {
    fontSize: 12,
    color: "#888",
    marginTop: 10,
    textAlign: "center",
  },
  servicesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    flexWrap: "wrap",
  },
  serviceBox: {
    alignItems: "center",
    padding: 15,
    backgroundColor: "#eee",
    borderRadius: 10,
    width: 100,
    marginBottom: 10,
  },
  serviceText: { marginTop: 5, fontSize: 12, fontWeight: "600" },
  dropdownWrapper: { marginTop: 10, marginBottom: 20 },
  dropdownButton: {
    backgroundColor: "#023a75",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  dropdownButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  dropdownOptions: {
    backgroundColor: "#f0f0f0",
    marginTop: 8,
    borderRadius: 6,
    overflow: "hidden",
  },
  dropdownOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});