import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { auth } from "../config/fireBaseConfig";
import { getDatabase, ref, get, set } from "firebase/database";
import { useNavigation } from "@react-navigation/native";

import { Picker } from '@react-native-picker/picker';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) return;

      const db = getDatabase();
      const userRef = ref(db, `users/${auth.currentUser.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        setUserData(snapshot.val());
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (!auth.currentUser) return;
    
    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${auth.currentUser.uid}`);
      await set(userRef, userData);
      setEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#023a75" />
        <Text>Loading settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Details</Text>
      <View style={styles.inputContainer}>
        <Text>Name:</Text>
        <TextInput
          style={styles.input}
          value={userData.name || ""}
          onChangeText={(text) => setUserData({ ...userData, name: text })}
          editable={editing}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Height(cm)</Text>
        <TextInput
          style={styles.input}
          value={userData.height ? String(userData.height) : ""}
          onChangeText={(text) => setUserData({ ...userData, height: text })}
          editable={editing}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Weight(KG)</Text>
        <TextInput
          style={styles.input}
          value={userData.weight ? String(userData.weight) : ""}
          onChangeText={(text) => setUserData({ ...userData, weight: text })}
          editable={editing}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>Age(yrs):</Text>
        <TextInput
          style={styles.input}
          value={userData.age ? String(userData.age) : ""}
          onChangeText={(text) => setUserData({ ...userData, age: text })}
          editable={editing}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>Contact Number:</Text>
        <TextInput
          style={styles.input}
          value={userData.contact || ""}
          onChangeText={(text) => setUserData({ ...userData, contact: text })}
          editable={editing}
          keyboardType="phone-pad"
        />
      </View>
      <View style={styles.inputContainer}>
  <Text>Gender</Text>
  <Picker
    selectedValue={userData.gender}
    onValueChange={(itemValue) => setUserData({ ...userData, gender: itemValue })}
    enabled={editing}
    style={styles.input}
  >
    <Picker.Item label="Select Gender" value="" />
    <Picker.Item label="Male" value="Male" />
    <Picker.Item label="Female" value="Female" />
    <Picker.Item label="Other" value="Other" />
  </Picker>
</View>
      <View style={styles.buttonContainer}>
        {editing ? (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
            <Text style={styles.buttonText}>Edit Info</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 , backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  inputContainer: { marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, backgroundColor: "#f9f9f9" },
  buttonContainer: { marginTop: 20, alignItems: "center" },
  editButton: { backgroundColor: "#023a75", padding: 10, borderRadius: 5, width: "50%", alignItems: "center" },
  saveButton: { backgroundColor: "#023a75", padding: 10, borderRadius: 5, width: "50%", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});