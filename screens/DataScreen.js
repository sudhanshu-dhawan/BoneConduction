import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import { ref, onValue, off } from 'firebase/database';
import { db, auth } from '../config/fireBaseConfig';
import { useFocusEffect } from '@react-navigation/native';

const DataScreen = () => {
  const [heartRate, setHeartRate] = useState(null);
  const [spo2, setSpO2] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const user = auth.currentUser;

      if (!user) {
        setError("Please login to view health data");
        setLoading(false);
        return;
      }

      const uid = user.uid;
      let sensorDataRef;

      try {
        // Reference to the user's sensor data
        sensorDataRef = ref(db, `sensorData/${uid}/readings`);
        
        // Listen for real-time updates
        const unsubscribe = onValue(sensorDataRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            // Get all reading keys and sort them to get the latest
            const readingKeys = Object.keys(data).sort();
            const latestReadingKey = readingKeys[readingKeys.length - 1];
            const latestReading = data[latestReadingKey];
            
            if (latestReading) {
              setHeartRate(latestReading.heartRate ?? null);
              setSpO2(latestReading.spo2 ?? null);
              // Use the timestamp from Firebase if available, otherwise use current time
              setLastUpdated(
                latestReading.timestamp 
                  ? new Date(latestReading.timestamp).toLocaleTimeString() 
                  : new Date().toLocaleTimeString()
              );
            }
          }
          setLoading(false);
        }, (error) => {
          setError("Failed to load health data");
          console.error(error);
          setLoading(false);
        });

        return () => {
          off(sensorDataRef);
        };
      } catch (err) {
        setError("Connection error. Please try again.");
        console.error(err);
        setLoading(false);
      }
    }, [])
  );

  const getStatusColor = (value, type) => {
    if (value === null || value === undefined) return '#007AFF';
    
    if (type === 'hr') {
      if (value < 60) return '#FFA500'; // Orange for low
      if (value > 100) return '#FF4500'; // Red for high
      return '#2E8B57'; // Green for normal
    } else if (type === 'spo2') {
      if (value < 90) return '#FF4500'; // Red for low
      if (value < 95) return '#FFA500'; // Orange for borderline
      return '#2E8B57'; // Green for normal
    }
    return '#007AFF';
  };

  const getStatusText = (value, type) => {
    if (value === null || value === undefined) return 'No data';
    
    if (type === 'hr') {
      if (value < 60) return 'Low';
      if (value > 100) return 'High';
      return 'Normal';
    } else if (type === 'spo2') {
      if (value < 90) return 'Low';
      if (value < 95) return 'Borderline';
      return 'Normal';
    }
    return '';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>📊 Live Health Data</Text>
        
        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <View style={styles.card}>
            <View style={styles.dataRow}>
              <Text style={styles.label}>💓 Heart Rate:</Text>
              <Text style={[styles.value, { color: getStatusColor(heartRate, 'hr') }]}>
                {heartRate !== null ? `${heartRate} BPM` : '--'}
              </Text>
              <Text style={[styles.statusText, { color: getStatusColor(heartRate, 'hr') }]}>
                {getStatusText(heartRate, 'hr')}
              </Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.label}>🩸 SpO₂ Level:</Text>
              <Text style={[styles.value, { color: getStatusColor(spo2, 'spo2') }]}>
                {spo2 !== null ? `${spo2.toFixed(1)}%` : '--'}
              </Text>
              <Text style={[styles.statusText, { color: getStatusColor(spo2, 'spo2') }]}>
                {getStatusText(spo2, 'spo2')}
              </Text>
            </View>

            {lastUpdated && (
              <Text style={styles.updateText}>
                Last updated: {lastUpdated}
              </Text>
            )}
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Normal Ranges:</Text>
          <Text style={styles.infoText}>• Heart Rate: 60-100 BPM</Text>
          <Text style={styles.infoText}>• SpO₂: 95-100%</Text>
          <Text style={styles.infoText}>• Values update automatically</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DataScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dataRow: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    color: '#555',
    marginBottom: 4,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  updateText: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
    textAlign: 'right',
  },
  errorCard: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 16,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 15,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1976D2',
  },
  infoText: {
    color: '#555',
    marginLeft: 10,
    marginBottom: 4,
  },
});