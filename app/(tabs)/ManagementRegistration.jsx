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
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth, usersRef } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const ManagementRegistration = () => {
  const navigation = useNavigation();

  // State for form inputs
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sdscteam, setSdscteam] = useState('');
  const [nearestMTR, setNearestMTR] = useState('');

  useEffect(() => {
    if (user) {
      navigation.replace('ManagementDashboard');
    }
  }, [user]);

  // Form submission handler
  const handleSubmit = async () => {
    try {
      // Input Validation (Optional but recommended)
      if (!name.trim() || !email.trim() || !password.trim() || !sdscteam.trim() || !nearestMTR.trim()) {
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
        sdscteam,
        nearestMTR,
      };

      // Add user data to Firestore
      await setDoc(doc(usersRef, user.uid), userData);

      Alert.alert('Success', 'Registration submitted successfully!');
      navigation.navigate('ManagementDashboard'); // Navigate back or to another screen
    } catch (error) {
      Alert.alert('Error', error.message);
      console.log(error);
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
      <Text style={styles.title}>Management Registration</Text>

      {/* Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
        accessibilityLabel="Name Input"
      />

      {/* Email Address Input */}
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        accessibilityLabel="Email Address Input"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry // Secure password input
        accessibilityLabel="Password Input"
      />

      {/* SDSC Team Input with Icon */}
      <View style={styles.inputWithIcon}>
        <TextInput
          style={styles.inputField}
          placeholder="SDSC Team"
          placeholderTextColor="#888"
          value={sdscteam}
          onChangeText={setSdscteam}
          accessibilityLabel="SDSC Team Input"
        />
        <TouchableOpacity style={styles.iconContainer} accessible={false}>
          <Ionicons name="people-outline" size={24} color="#19235E" />
        </TouchableOpacity>
      </View>

      {/* Nearest MTR Station Input with Icon */}
      <View style={styles.inputWithIcon}>
        <TextInput
          style={styles.inputField}
          placeholder="Nearest MTR Station"
          placeholderTextColor="#888"
          value={nearestMTR}
          onChangeText={setNearestMTR}
          accessibilityLabel="Nearest MTR Station Input"
        />
        <TouchableOpacity style={styles.iconContainer} accessible={false}>
          <Ionicons name="train-outline" size={24} color="#19235E" />
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} accessibilityLabel="Submit Button">
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} accessibilityLabel="Back Button">
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
    marginBottom: 15,
    color: '#19235E',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: '#000',
    backgroundColor: '#fff',
    fontSize: 16,
  },
  inputWithIcon: {
    position: 'relative', // To position the icon inside the input
    marginBottom: 15,
  },
  inputField: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingRight: 40, // Space for the icon
    color: '#000',
    backgroundColor: '#fff',
    fontSize: 16,
  },
  iconContainer: {
    position: 'absolute',
    right: 10, // Position icon to the right inside the input field
    top: 13, // Vertically center the icon
  },
  submitButton: {
    backgroundColor: '#19235E',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
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

export default ManagementRegistration;
