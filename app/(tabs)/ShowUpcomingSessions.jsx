// src/components/ShowUpcomingSessions.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Modal from 'react-native-modal';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Legend from './Legend'; // Import the Legend component

const SESSION_TYPES = [
  { label: 'ROUTINE VOLUNTEERING STILL AVAILABLE', value: 'ROUTINE_AVAILABLE' },
  { label: 'Change in schedule', value: 'CHANGE_SCHEDULE' },
  { label: 'New Competitions', value: 'NEW_COMPETITIONS' },
  { label: 'Other Volunteering', value: 'OTHER_VOLUNTEERING' },
  { label: 'ROUTINE VOLUNTEERING OVERBOOKED', value: 'ROUTINE_OVERBOOKED' },
];

const SESSION_COLORS = {
  ROUTINE_AVAILABLE: 'blue',
  CHANGE_SCHEDULE: 'red',
  NEW_COMPETITIONS: 'green',
  OTHER_VOLUNTEERING: 'yellow',
  ROUTINE_OVERBOOKED: 'orange',
};

const ShowUpcomingSessions = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  // Fetch sessions from Firestore
  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const sessionsCol = collection(db, 'sessions');
      const sessionsSnapshot = await getDocs(sessionsCol);
      let marks = {};

      sessionsSnapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.date; // Expected format: 'YYYY-MM-DD'
        const type = data.sessionType;

        marks[date] = {
          selected: true,
          marked: true,
          selectedColor: SESSION_COLORS[type],
          dots: [
            {
              key: type,
              color: SESSION_COLORS[type],
            },
          ],
          sessionData: data, // Store session data for this date
        };
      });

      setMarkedDates(marks);
    } catch (error) {
      console.log('Error fetching sessions:', error);
      Alert.alert('Error', 'Unable to fetch sessions.');
    }
    setIsLoading(false);
  };

  // Handle day press
  const onDayPress = (day) => {
    const selectedDateData = markedDates[day.dateString];
    if (selectedDateData && selectedDateData.sessionData) {
      setSelectedSession(selectedDateData.sessionData);
      setModalVisible(true);
    } else {
      Alert.alert('No session', 'No sessions scheduled on this date.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.headerText}>SCDC SMART</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>Upcoming Sessions</Text>

      {/* Loading Indicator */}
      {isLoading && <ActivityIndicator size="large" color="#19235E" />}

      {/* Calendar */}
      <Calendar
        onDayPress={onDayPress}
        markedDates={markedDates}
        markingType={'multi-dot'}
        theme={{
          selectedDayBackgroundColor: '#19235E',
          todayTextColor: '#19235E',
          arrowColor: '#19235E',
          dotColor: '#19235E',
          selectedDotColor: '#fff',
          selectedDayTextColor: '#fff',
          calendarBackground: '#DDE4CB',
          textSectionTitleColor: '#19235E',
          dayTextColor: '#000',
          monthTextColor: '#19235E',
          textDisabledColor: '#d9e1e8',
        }}
      />

      {/* Legend */}
      <Legend sessionTypes={SESSION_TYPES} sessionColors={SESSION_COLORS} />

      {/* Modal for showing session description */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Session Details</Text>

          {selectedSession ? (
            <>
              <Text style={styles.sessionType}>Type: {selectedSession.sessionType}</Text>
              <Text style={styles.sessionDescription}>
                Description: {selectedSession.description || 'No description provided'}
              </Text>
            </>
          ) : (
            <Text>No session data available</Text>
          )}

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#DDE4CB',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19235E',
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 30,
    color: '#19235E',
    textAlign: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#19235E',
    textAlign: 'center',
  },
  sessionType: {
    fontSize: 16,
    color: '#19235E',
    marginBottom: 10,
  },
  sessionDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#19235E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ShowUpcomingSessions;
