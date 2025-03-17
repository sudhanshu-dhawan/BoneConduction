import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { auth } from "../config/fireBaseConfig"; // Firebase setup
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";


const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      console.error("No user is logged in.");
      setLoading(false);
      return;
    }

    const db = getDatabase();
    const userRef = ref(db, `users/${auth.currentUser.uid}`);

    // Listen for real-time changes
    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserData(snapshot.val());
      } else {
        console.error("No user data found in database.");
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup the listener when component unmounts
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await auth.signOut();
            navigation.replace("LoginScreen"); // Redirect to login
          } catch (error) {
            console.error("Logout error:", error);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* User Avatar and Name */}
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {userData.name ? userData.name[0] : "U"}
          </Text>
        </View>
        <Text style={styles.username}>{userData.name || "User"}</Text>
      </View>

      {/* User Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>🔹 Email: {userData.email || "Not Available"}</Text>
        <Text style={styles.detailText}>🔹 Weight: {userData.weight ? `${userData.weight} kg` : "Not Provided"}</Text>
        <Text style={styles.detailText}>🔹 Age: {userData.age || "Not Provided"}</Text>
        <Text style={styles.detailText}>🔹 Contact No.: {userData.contact || "Not Provided"}</Text>
        <Text style={styles.detailText}>🔹 Gender: {userData.gender || "Not Provided"}</Text>
        <Text style={styles.detailText}>🔹 Height: {userData.height ? `${userData.height} cm` : "Not Provided"}</Text>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("EditDetailsScreen")}>
          <MaterialCommunityIcons name="account-edit" size={24} color="#023a75" />
          <Text style={styles.optionText}>Edit Details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("AccountScreen")}>
          <FontAwesome name="user-circle"size={24} color="#023a75" />
          <Text style={styles.optionText}>Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("AboutUsScreen")}>
          <MaterialCommunityIcons name="information-outline" size={24} color="#023a75" />
          <Text style={styles.optionText}>About Us</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, marginTop:40 , backgroundColor: "#fff", padding: 20 },
  header: { alignItems: "center", marginBottom: 20 },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#ddd", alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 30, fontWeight: "bold", color: "#023a75" },
  username: { fontSize: 22, fontWeight: "bold", marginTop: 10 },

  detailsContainer: { padding: 15, backgroundColor: "#f5f5f5", borderRadius: 10, marginBottom: 20 },
  detailText: { fontSize: 16, marginBottom: 5 },

  optionsContainer: { marginTop: 20 },
  option: { flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "#eee", borderRadius: 10, marginBottom: 10 },
  optionText: { fontSize: 16, marginLeft: 10, fontWeight: "600" },
});
