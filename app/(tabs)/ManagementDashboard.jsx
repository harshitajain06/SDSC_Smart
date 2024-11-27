// src/components/ManagementDashboard.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // For icons

const ManagementDashboard = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.headerText}>SCDC SMART</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>Management Dashboard</Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {/* Update Session Timings Button */}
        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('UpdateSessionTimings')}
          accessibilityLabel="Navigate to Update Session Timings"
          accessibilityHint="Allows you to update the timings of upcoming sessions"
        >
          <Ionicons name="time-outline" size={30} color="#fff" />
          <Text style={styles.buttonText}>Update Session Timings</Text>
        </TouchableOpacity> */}

        {/* Edit Session Timings Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('UpcomingSessions')}
          accessibilityLabel="Navigate to Edit Session Timings"
          accessibilityHint="Allows you to edit the timings of existing sessions"
        >
          <Ionicons name="create-outline" size={30} color="#fff" />
          <Text style={styles.buttonText}>Edit Session Timings</Text>
        </TouchableOpacity>

        {/* Update Announcements Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('UpdateAnnouncements')}
          accessibilityLabel="Navigate to Update Announcements"
          accessibilityHint="Allows you to post new announcements for volunteers"
        >
          <Ionicons name="megaphone-outline" size={30} color="#fff" />
          <Text style={styles.buttonText}>Update Announcements</Text>
        </TouchableOpacity>

        {/* Data and Analytics Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('DataAndAnalytics')}
          accessibilityLabel="Navigate to Data and Analytics"
          accessibilityHint="Provides data insights and analytics for management"
        >
          <Ionicons name="stats-chart-outline" size={30} color="#fff" />
          <Text style={styles.buttonText}>Data and Analytics</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#DDE4CB', // Background color
  },
  headerContainer: {
    flexDirection: 'row', // Align header elements in a row
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  logo: {
    width: 40, // Adjusted logo size
    height: 40,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19235E',
    marginLeft: 10, // Space between logo and text
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 30,
    color: '#19235E',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#19235E',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    marginBottom: 20,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    // Elevation for Android
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 15,
  },
});

export default ManagementDashboard;
