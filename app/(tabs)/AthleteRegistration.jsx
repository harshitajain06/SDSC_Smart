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
      };

      // Add user data to Firestore
      await setDoc(doc(usersRef, user.uid), userData);

      Alert.alert('Success', 'Registration submitted successfully!');
      navigation.navigate('AthleteDashboard');; // Navigate back or to another screen
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

      <Text style={styles.title}>Athlete Registration</Text>

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

      <View style={styles.inputWithIcon}>
        <TextInput
          style={styles.inputField}
          placeholder="Primary Sport"
          placeholderTextColor="#888"
          value={sport}
          onChangeText={setSport}
        />
      </View>

      <View style={styles.inputWithIcon}>
        <TextInput
          style={styles.inputField}
          placeholder="If more than one sport, list them here"
          placeholderTextColor="#888"
          value={additionalSports}
          onChangeText={setAdditionalSports}
        />
        <TouchableOpacity style={styles.iconContainer}>
          <Icon name="list-alt" size={24} color="#19235E" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputWithIcon}>
        <TextInput
          style={styles.inputField}
          placeholder="Nearest MTR Station"
          placeholderTextColor="#888"
          value={nearestMTR}
          onChangeText={setNearestMTR}
        />
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="train-outline" size={24} color="#19235E" />
        </TouchableOpacity>
      </View>

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
