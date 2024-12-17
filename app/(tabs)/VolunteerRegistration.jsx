import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth, usersRef } from '../../config/firebase'; // Import Firebase auth and Firestore reference
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const VolunteerRegistration = () => {
  const navigation = useNavigation();

  // State for form inputs
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [nearestMTR, setNearestMTR] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userType, setUserType] = useState('Volunteer'); // Default user type

  useEffect(() => {
    if (user) {
      navigation.replace(`${userType}Dashboard`);
    }
  }, [user]);

  // Date picker change handler
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(Platform.OS === 'ios');
    setStartDate(currentDate);
  };

  // Show date picker
  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  // Fetch location using Expo Location API
  const fetchLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }

      let locationResult = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = locationResult.coords;
      let [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (address) {
        const formattedAddress = `${address.name || ''}, ${address.street || ''}, ${address.city || ''}, ${address.region || ''}, ${address.country || ''}`.trim();
        setLocation(formattedAddress);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch location. Please try again.');
      console.log(error);
    }
  };

  // Form submission handler
  const handleSubmit = async () => {
    try {
      if (!name.trim() || !email.trim() || !password.trim() || !nearestMTR.trim()) {
        Alert.alert('Validation Error', 'Please fill in all fields.');
        return;
      }

      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // User data to store in Firestore
      const userData = {
        uid: user.uid,
        name,
        email,
        location,
        startDate: startDate.toISOString(),
        nearestMTR,
        userType, // Save user type in Firestore
      };

      // Add user data to Firestore
      await setDoc(doc(usersRef, user.uid), userData);

      Alert.alert('Success', 'Registration submitted successfully!');
      navigation.navigate(`${userType}Dashboard`);
    } catch (error) {
      Alert.alert('Error', error.message);
      console.log(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.headerText}>SCDC SMART</Text>
      </View>

      <Text style={styles.title}>Volunteer Registration</Text>

      <Text style={styles.label}>Select User Type:</Text>
      <View style={styles.userTypeContainer}>
        <TouchableOpacity
          style={[styles.userTypeButton, userType === 'Volunteer' && styles.activeButton]}
          onPress={() => setUserType('Volunteer')}
        >
          <Text style={[styles.userTypeText, userType === 'Volunteer' && styles.activeText]}>
            Volunteer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.userTypeButton, userType === 'Management' && styles.activeButton]}
          onPress={() => setUserType('Management')}
        >
          <Text style={[styles.userTypeText, userType === 'Management' && styles.activeText]}>
            Management
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.userTypeButton, userType === 'Athlete' && styles.activeButton]}
          onPress={() => setUserType('Athlete')}
        >
          <Text style={[styles.userTypeText, userType === 'Athlete' && styles.activeText]}>
            Athlete
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.inputWithIcon}>
        <TextInput
          style={styles.inputField}
          placeholder="Location of Volunteering"
          placeholderTextColor="#888"
          value={location}
          onChangeText={setLocation}
        />
        <TouchableOpacity onPress={fetchLocation} style={styles.iconContainer}>
          <Ionicons name="location-outline" size={24} color="#19235E" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputWithIcon}>
        <TextInput
          style={styles.inputField}
          placeholder="When did you start volunteering?"
          placeholderTextColor="#888"
          value={startDate.toLocaleDateString()}
          editable={false}
        />
        <TouchableOpacity onPress={showDatepicker} style={styles.iconContainer}>
          <Icon name="calendar" size={24} color="#19235E" />
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
          maximumDate={new Date()}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Nearest MTR Station"
        placeholderTextColor="#888"
        value={nearestMTR}
        onChangeText={setNearestMTR}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0056b3',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0056b3',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userTypeButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#0056b3',
    borderRadius: 8,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#0056b3',
  },
  userTypeText: {
    fontSize: 14,
    color: '#0056b3',
    fontWeight: '500',
  },
  activeText: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  inputField: {
    flex: 1,
    fontSize: 16,
  },
  iconContainer: {
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: '#0056b3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#0056b3',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VolunteerRegistration;
