// src/components/UpcomingSessions.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Modal from 'react-native-modal';
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
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

const UpcomingSessions = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedSessionType, setSelectedSessionType] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    setSelectedDate(day.dateString);
    setSelectedSessionType('');
    setDescription('');
    setModalVisible(true);
  };

  // Handle session type selection
  const handleSessionTypeSelect = (type) => {
    setSelectedSessionType(type);
  };

  // Handle saving session
  const handleSaveSession = async () => {
    if (!selectedSessionType) {
      Alert.alert('Validation Error', 'Please select a session type.');
      return;
    }

    setIsLoading(true);
    try {
      // Add a new document with a generated ID
      await addDoc(collection(db, 'sessions'), {
        date: selectedDate,
        sessionType: selectedSessionType,
        description: description.trim(),
        createdAt: serverTimestamp(),
      });

      // Update markedDates
      setMarkedDates((prev) => ({
        ...prev,
        [selectedDate]: {
          selected: true,
          marked: true,
          selectedColor: SESSION_COLORS[selectedSessionType],
          dots: [
            {
              key: selectedSessionType,
              color: SESSION_COLORS[selectedSessionType],
            },
          ],
        },
      }));

      Alert.alert('Success', 'Session added successfully!');
      setModalVisible(false);
    } catch (error) {
      console.log('Error saving session:', error);
      Alert.alert('Error', 'Unable to save the session. Please try again.');
    }
    setIsLoading(false);
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

      {/* Modal for session type selection */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Session Type</Text>

          <RNPickerSelect
            onValueChange={(value) => handleSessionTypeSelect(value)}
            items={SESSION_TYPES}
            placeholder={{ label: 'Select a session type...', value: null }}
            style={{
              inputIOS: styles.picker,
              inputAndroid: styles.picker,
            }}
          />

          {/* Description Input */}
          {selectedSessionType && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionLabel}>Description:</Text>
              <TextInput
                style={styles.descriptionInput}
                placeholder="Add a description..."
                placeholderTextColor="#888"
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>
          )}

          {/* Buttons */}
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveSession}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
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
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#19235E',
    textAlign: 'center',
  },
  picker: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    color: '#000',
    paddingRight: 30, // To ensure the text is never behind the icon
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#19235E',
    marginBottom: 5,
  },
  descriptionInput: {
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    color: '#000',
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#19235E',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UpcomingSessions;
