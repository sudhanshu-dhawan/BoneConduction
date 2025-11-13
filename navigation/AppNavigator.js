// src/navigation/AppNavigator.js
import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, ActivityIndicator } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, db } from "../config/fireBaseConfig"; // Direct import

// Import all screens
import SupportScreen from "../screens/SupportScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import SignupScreen from "../screens/SignupScreen";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ReportScreen from "../screens/ReportScreen";
import ChatBotScreen from "../screens/ChatBotScreen";
import MonthlyStatusScreen from "../screens/MonthlyStatusScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingScreen from "../screens/SettingScreen";
import EditDetailsScreen from "../screens/EditDetailsScreen";
import AccountScreen from "../screens/AccountScreen";
import AboutUsScreen from "../screens/AboutUsScreen";
import StepCounterScreen from "../screens/StepCounterScreen";
import WaterReminderScreen from "../screens/WaterReminderScreen";
import DataScreen from "../screens/DataScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;

    const setupAuthListener = async () => {
      try {
        console.log("Setting up auth listener...");
        
        unsubscribe = onAuthStateChanged(auth, 
          async (authUser) => {
            console.log("Auth state changed:", authUser ? "User logged in" : "No user");
            
            if (authUser) {
              try {
                // Check if user exists in database
                const userRef = ref(db, `users/${authUser.uid}`);
                const snapshot = await get(userRef);

                if (snapshot.exists()) {
                  console.log("User found in database");
                  setUser(authUser);
                } else {
                  console.log("User not found in database");
                  setUser(null);
                }
              } catch (dbError) {
                console.error("Database error:", dbError);
                setUser(null);
              }
            } else {
              setUser(null);
            }
            setLoading(false);
          },
          (authError) => {
            console.error("Auth state change error:", authError);
            setError(authError);
            setLoading(false);
          }
        );

      } catch (setupError) {
        console.error("Setup error:", setupError);
        setError(setupError);
        setLoading(false);
      }
    };

    setupAuthListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Show loading indicator
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  // Show error screen if Firebase failed
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error initializing app</Text>
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Authenticated users
          <>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="ChatBotScreen" component={ChatBotScreen} />
            <Stack.Screen name="MonthlyStatusScreen" component={MonthlyStatusScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="ReportScreen" component={ReportScreen} />
            <Stack.Screen name="SettingScreen" component={SettingScreen} />
            <Stack.Screen name="EditDetailsScreen" component={EditDetailsScreen} />
            <Stack.Screen name="SupportScreen" component={SupportScreen} />
            <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} />
            <Stack.Screen name="AccountScreen" component={AccountScreen} />
            <Stack.Screen name="StepCounterScreen" component={StepCounterScreen} />
            <Stack.Screen name="WaterReminderScreen" component={WaterReminderScreen} />
            <Stack.Screen name="DataScreen" component={DataScreen} />
          </>
        ) : (
          // Unauthenticated users
          <>
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="SignupScreen" component={SignupScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;