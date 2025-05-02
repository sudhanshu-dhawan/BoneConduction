// WaterReminderScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";

const WaterReminderScreen = () => {
  const [goal, setGoal] = useState("");
  const [consumed, setConsumed] = useState(0);

  const handleSaveGoal = () => {
    if (!goal || isNaN(goal)) {
      Alert.alert("Please enter a valid number for goal.");
      return;
    }
    Alert.alert("Water Goal Set!", `Your goal is ${goal} liters.`);
  };

  const handleDrinkWater = () => {
    const numericGoal = parseFloat(goal);
    if (!numericGoal || consumed >= numericGoal) {
      Alert.alert("Goal reached or not set.");
      return;
    }
    setConsumed(prev => prev + 0.25); // Each tap adds 250ml
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>💧 Water Reminder</Text>
      
      <TextInput
        placeholder="Enter your daily goal (liters)"
        value={goal}
        onChangeText={setGoal}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button title="Save Goal" onPress={handleSaveGoal} />

      <View style={{ marginVertical: 20 }}>
        <Text style={styles.status}>
          Drank: {consumed} L / {goal || 0} L
        </Text>
        <Button title="I Drank Water (250ml)" onPress={handleDrinkWater} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 20, backgroundColor: "#fff", justifyContent: "center"
  },
  heading: {
    fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center"
  },
  input: {
    borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 10
  },
  status: {
    fontSize: 20, marginBottom: 10, textAlign: "center"
  }
});

export default WaterReminderScreen;
