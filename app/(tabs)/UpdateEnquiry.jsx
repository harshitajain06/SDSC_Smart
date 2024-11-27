// src/components/UpdateEnquiry.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { db } from '../../config/firebase'; // Adjust the import path according to your project structure
import { addDoc, collection } from "firebase/firestore";

const UpdateEnquiry = () => {
    const [enquiry, setEnquiry] = useState('');

    const handleSubmit = async () => {
        if (!enquiry) {
            Alert.alert("Please enter an enquiry");
            return;
        }

        try {
            // Reference to the enquiries collection
            const enquiriesRef = collection(db, 'enquiries'); 

            // Add enquiry to Firestore
            await addDoc(enquiriesRef, {
                text: enquiry,
                createdAt: new Date(), // Adding a timestamp
            });

            Alert.alert("Enquiry added successfully!");
            setEnquiry(''); // Clear input after submission
        } catch (error) {
            console.error("Error adding enquiry: ", error);
            Alert.alert("Failed to add enquiry");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Update Enquiry</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your enquiry here"
                value={enquiry}
                onChangeText={setEnquiry}
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

export default UpdateEnquiry;
