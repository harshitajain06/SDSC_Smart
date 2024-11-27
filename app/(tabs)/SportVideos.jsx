import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { WebView } from 'react-native-webview';

const SportVideos = () => {
  const route = useRoute();
  const { sport, type } = route.params;
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const q = query(collection(db, 'sportsVideos'), where('sport', '==', sport), where('type', '==', type));
        const querySnapshot = await getDocs(q);
        const fetchedVideos = [];
        querySnapshot.forEach((doc) => {
          fetchedVideos.push({ id: doc.id, ...doc.data() });
        });
        console.log('Fetched Videos: ', fetchedVideos);
        setVideos(fetchedVideos);
      } catch (error) {
        console.error('Error fetching videos: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [sport, type]);

  const handleTitlePress = (videoUrl) => {
    setSelectedVideoUrl(videoUrl);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedVideoUrl('');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#19235E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{type === 'howToPlay' ? 'How to Play' : 'How to Assist'}: {sport}</Text>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.videoContainer}>
            <TouchableOpacity onPress={() => handleTitlePress(item.videoUrl)}>
              <Text style={styles.videoTitle}>{item.title}</Text>
            </TouchableOpacity>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <WebView
            source={{ uri: selectedVideoUrl }}
            style={styles.video}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            allowsInlineMediaPlayback
          />
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#DDE4CB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#19235E',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  videoContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19235E',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  video: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
  },
  closeButton: {
    padding: 15,
    backgroundColor: '#19235E',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SportVideos;
