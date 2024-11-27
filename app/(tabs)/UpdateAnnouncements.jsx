// src/components/UpdateAnnouncements.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { db, usersRef } from '../../config/firebase'; // Adjust the import path according to your project structure
import { addDoc, collection } from "firebase/firestore";

const UpdateAnnouncements = () => {
    const [announcement, setAnnouncement] = useState('');

    const handleSubmit = async () => {
        if (!announcement) {
            Alert.alert("Please enter an announcement");
            return;
        }

        try {
            // Reference to the announcements collection
            const announcementsRef = collection(db, 'announcements'); 

            // Add announcement to Firestore
            await addDoc(announcementsRef, {
                text: announcement,
                createdAt: new Date(), // Adding a timestamp
            });

            Alert.alert("Announcement added successfully!");
            setAnnouncement(''); // Clear input after submission
        } catch (error) {
            console.error("Error adding announcement: ", error);
            Alert.alert("Failed to add announcement");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Update Announcements</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your announcement here"
                value={announcement}
                onChangeText={setAnnouncement}
                multiline
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#DDE4CB',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 20,
        color: '#19235E',
        textAlign: 'center',
    },
    input: {
        height: 100,
        borderColor: '#19235E',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#19235E',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default UpdateAnnouncements;
