import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Audio} from 'expo-av';

const BuildingInfo = ({building, onClose}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = async () => {
    if (!building.audioFile) return;
    
    try {
      setIsPlaying(true);
      const { sound } = await Audio.Sound.createAsync(
        { uri: building.audioFile }
      );
      
      await sound.playAsync();
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log('Audio error:', error);
      setIsPlaying(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>{building.name}</Text>
      <Text style={styles.year}>Built in {building.year}</Text>
      
      <Text style={styles.description}>{building.description}</Text>
      
      <Text style={styles.factsTitle}>Historical Facts:</Text>
      {building.historicalFacts.map((fact, index) => (
        <Text key={index} style={styles.fact}>• {fact}</Text>
      ))}
      
      <TouchableOpacity 
        style={styles.audioButton} 
        onPress={playAudio}
        disabled={isPlaying}
      >
        <Text style={styles.audioText}>
          {isPlaying ? 'Playing...' : '🔊 Play Audio Guide'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  year: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 15,
  },
  description: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 15,
  },
  factsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fact: {
    color: '#ddd',
    fontSize: 14,
    marginBottom: 5,
  },
  audioButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  audioText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BuildingInfo;