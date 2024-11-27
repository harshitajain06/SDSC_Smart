import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';

const SelectSport = () => {
  const [selectedSport, setSelectedSport] = useState('');
  const navigation = useNavigation();

  const handleNavigation = (type) => {
    if (selectedSport) {
      navigation.navigate('SportVideos', { sport: selectedSport, type });
    } else {
      alert('Please select a sport!');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo and Heading */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://your-logo-url.com/logo.png' }}
          style={styles.logo}
        />
        <Text style={styles.title}>Volunteer Learning System</Text>
      </View>

      {/* Dropdown to Select Sport */}
      <Text style={styles.label}>Select the Sport</Text>
      <RNPickerSelect
        onValueChange={(value) => setSelectedSport(value)}
        items={[
          { label: 'Football', value: 'Football' },
          { label: 'Basketball', value: 'Basketball' },
          { label: 'Tennis', value: 'Tennis' },
          { label: 'Cricket', value: 'Cricket' },
        ]}
        placeholder={{ label: 'Choose a sport...', value: null }}
        style={{
          inputIOS: styles.picker,
          inputAndroid: styles.picker,
        }}
      />

      {/* Navigation Buttons */}
      <TouchableOpacity style={styles.button} onPress={() => handleNavigation('howToPlay')}>
        <Text style={styles.buttonText}>How to Play + Rules</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleNavigation('howToAssist')}>
        <Text style={styles.buttonText}>How to Assist</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#DDE4CB',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 50,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#19235E',
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    color: '#19235E',
    marginBottom: 10,
  },
  picker: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#000',
    paddingRight: 30,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#19235E',
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SelectSport;
