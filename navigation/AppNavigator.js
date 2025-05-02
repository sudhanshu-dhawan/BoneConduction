import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { getAuth, onAuthStateChanged } from "firebase/auth"; 
import { getDatabase, ref, get } from "firebase/database"; // Import Realtime Database methods
import SupportScreen from "../screens/SupportScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import SignupScreen from "../screens/SignupScreen";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen  from "../screens/HomeScreen";
import ReportScreen from "../screens/ReportScreen";
import ChatBotScreen from "../screens/ChatBotScreen";
import MonthlyStatusScreen from "../screens/MonthlyStatusScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingScreen from "../screens/SettingScreen";
import EditDetailsScreen from "../screens/EditDetailsScreen"
import AccountScreen from "../screens/AccountScreen";
import AboutUsScreen from "../screens/AboutUsScreen";
import StepCounterScreen from "../screens/StepCounterScreen";
import WaterReminderScreen from "../screens/WaterReminderScreen";
import DataScreen from "../screens/DataScreen"
const Stack = createStackNavigator();

const AppNavigator = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          // Reference to the user's data in Realtime Database
          const userRef = ref(db, `users/${authUser.uid}`);
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            setUser(authUser); // Set user only if they exist in DB
          } else {
            console.log("User not found in database!");
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) return null; // Prevent UI flickering while checking auth state

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
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
      ):(
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
