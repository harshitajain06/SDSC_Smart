import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // For icons

const VolunteerDashboard = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.headerText}>SCDC SMART</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>Volunteer Dashboard</Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {/* Upcoming Sessions Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ShowUpcomingSessions')}
          accessibilityLabel="Navigate to Upcoming Sessions"
          accessibilityHint="Shows a list of your upcoming volunteering sessions"
        >
          <Ionicons name="calendar-outline" size={30} color="#fff" />
          <Text style={styles.buttonText}>Upcoming Sessions</Text>
        </TouchableOpacity>

        {/* Upcoming Announcements Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('UpcomingAnnouncements')}
          accessibilityLabel="Navigate to Upcoming Announcements"
          accessibilityHint="Shows the latest announcements for volunteers"
        >
          <Ionicons name="megaphone-outline" size={30} color="#fff" />
          <Text style={styles.buttonText}>Upcoming Announcements</Text>
        </TouchableOpacity>

        {/* Upcoming Tournaments Button */}
        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('UpcomingTournaments')}
          accessibilityLabel="Navigate to Upcoming Tournaments"
          accessibilityHint="Shows information about upcoming tournaments"
        >
          <Ionicons name="trophy-outline" size={30} color="#fff" />
          <Text style={styles.buttonText}>Upcoming Tournaments</Text>
        </TouchableOpacity> */}

        {/* Game Tutorials Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SelectSport')}
          accessibilityLabel="Navigate to Game Tutorials"
          accessibilityHint="Provides tutorials to improve your game skills"
        >
          <Ionicons name="game-controller-outline" size={30} color="#fff" />
          <Text style={styles.buttonText}>Game Tutorials</Text>
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

export default VolunteerDashboard;
