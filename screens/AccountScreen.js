import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { auth } from "../config/fireBaseConfig";
import {
  getDatabase,
  ref,
  update,
  remove,
} from "firebase/database";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  deleteUser,
} from "firebase/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const AccountScreen = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "No user found.");
      return;
    }

    // Re-authenticate the user
    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      // Update password in Realtime Database
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, { password: newPassword });

      Alert.alert("Success", "Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      Alert.alert("Error , please enter correct old password");
      
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action is irreversible.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const user = auth.currentUser;

            if (!user) {
              Alert.alert("Error", "No user found.");
              return;
            }

            try {
              const db = getDatabase();
              const userRef = ref(db, `users/${user.uid}`);

              // Delete user data from Realtime Database
              await remove(userRef);

              // Delete user from Firebase Authentication
              await deleteUser(user);

              Alert.alert("Account Deleted", "Your account has been successfully deleted.");
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Account Settings</Text>

      {/* Reset Password Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Reset Password</Text>

        {/* Old Password Input */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Old Password"
            secureTextEntry={!showOldPassword}
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}>
            <MaterialCommunityIcons
              name={showOldPassword ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {/* New Password Input */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter New Password"
            secureTextEntry={!showNewPassword}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
            <MaterialCommunityIcons
              name={showNewPassword ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password Input */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <MaterialCommunityIcons
              name={showConfirmPassword ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>
      </View>

      {/* Delete Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Delete Account</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteButtonText}>Delete My Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    marginTop:60,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#023a75",
    textAlign: "center",
  },
  section: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#023a75",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 10,
  },
  button: {
    backgroundColor: "#023a75",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
