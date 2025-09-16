import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Camera} from 'expo-camera';
import LocationService from '../services/LocationService';
import buildingsData from '../data/buildings.json';

const ARScene = ({onBuildingSelect}) => {
  const [nearbyBuildings, setNearbyBuildings] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    initializeCamera();
    initializeLocation();
  }, []);

  const initializeCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const initializeLocation = async () => {
    try {
      const hasLocationPermission = await LocationService.requestLocationPermission();
      if (hasLocationPermission) {
        const position = await LocationService.getCurrentPosition();
        setUserLocation(position.coords);
        findNearbyBuildings(position.coords);
      }
    } catch (error) {
      console.log('Location error:', error);
    }
  };

  const findNearbyBuildings = (coords) => {
    const nearby = buildingsData.filter(building => {
      const distance = LocationService.calculateDistance(
        coords.latitude,
        coords.longitude,
        building.latitude,
        building.longitude
      );
      return distance <= 500;
    });
    setNearbyBuildings(nearby);
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={Camera.Constants.Type.back}>
        <View style={styles.overlay}>
          {nearbyBuildings.map((building, index) => (
            <TouchableOpacity
              key={building.id}
              style={[styles.buildingMarker, {top: 100 + index * 80}]}
              onPress={() => onBuildingSelect(building)}
            >
              <Text style={styles.buildingText}>{building.name}</Text>
              <Text style={styles.yearText}>Built: {building.year}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  buildingMarker: {
    position: 'absolute',
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  buildingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  yearText: {
    color: '#ccc',
    fontSize: 12,
  },
});

export default ARScene;