import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, usersRef } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const AthleteRegistration = () => {
  const navigation = useNavigation();

  // State for form inputs
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sport, setSport] = useState('');
  const [additionalSports, setAdditionalSports] = useState('');
  const [nearestMTR, setNearestMTR] = useState('');
  const [userType, setUserType] = useState('Athlete'); // Default user type

  useEffect(() => {
    if (user) {
      navigation.replace('AthleteDashboard');
    }
  }, [user]);

  // Form submission handler
  const handleSubmit = async () => {
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // User data to store in Firestore
      const userData = {
        uid: user.uid,
        name,
        email,
        sport,
        additionalSports,
        nearestMTR,
        userType, // Save user type in Firestore
      };

      // Add user data to Firestore
      await setDoc(doc(usersRef, user.uid), userData);

      Alert.alert('Success', 'Registration submitted successfully!');
      navigation.navigate(`${userType}Dashboard`); // Navigate to the appropriate dashboard
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

      <Text style={styles.title}>User Registration</Text>

      <Text style={styles.label}>Select User Type:</Text>
      <View style={styles.userTypeContainer}>
        <TouchableOpacity
          style={[styles.userTypeButton, userType === 'Volunteer' && styles.activeButton]}
          onPress={() => setUserType('Volunteer')}
        >
          <Text
            style={[
              styles.userTypeText,
              userType === 'Volunteer' && styles.activeTextColor,
            ]}
          >
            Volunteer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.userTypeButton, userType === 'Management' && styles.activeButton]}
          onPress={() => setUserType('Management')}
        >
          <Text
            style={[
              styles.userTypeText,
              userType === 'Management' && styles.activeTextColor,
            ]}
          >
            Management
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.userTypeButton, userType === 'Athlete' && styles.activeButton]}
          onPress={() => setUserType('Athlete')}
        >
          <Text
            style={[
              styles.userTypeText,
              userType === 'Athlete' && styles.activeTextColor,
            ]}
          >
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
        secureTextEntry // Secure password input
      />

      <TextInput
        style={styles.input}
        placeholder="Primary Sport"
        placeholderTextColor="#888"
        value={sport}
        onChangeText={setSport}
      />

      <TextInput
        style={styles.input}
        placeholder="If more than one sport, list them here"
        placeholderTextColor="#888"
        value={additionalSports}
        onChangeText={setAdditionalSports}
      />

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

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#DDE4CB', // Background color
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
    marginBottom: 15,
    color: '#19235E',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#19235E',
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  userTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#19235E',
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#19235E',
  },
  userTypeText: {
    color: '#19235E',
    fontWeight: '600',
  },
  activeTextColor: {
    color: '#fff',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#19235E',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#19235E',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AthleteRegistration;
