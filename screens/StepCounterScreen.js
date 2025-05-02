// StepCounterScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Pedometer } from 'expo-sensors';

const StepCounterScreen = () => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  useEffect(() => {
    Pedometer.isAvailableAsync().then(
      (result) => {
        setIsPedometerAvailable(String(result));
      },
      (error) => {
        setIsPedometerAvailable('Could not get isPedometerAvailable: ' + error);
      }
    );

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1); // 24 hours

    Pedometer.getStepCountAsync(start, end).then(
      (result) => {
        setPastStepCount(result.steps);
      },
      (error) => {
        console.log('Could not get stepCount: ', error);
      }
    );

    const subscription = Pedometer.watchStepCount(result => {
      setCurrentStepCount(result.steps);
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Step Counter page</Text>
      <Text>Pedometer available: {isPedometerAvailable}</Text>
      <Text>Steps taken in last 24 hours: {pastStepCount}</Text>
      <Text>Live Steps: {currentStepCount}</Text>
    </View>
  );
};

export default StepCounterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
