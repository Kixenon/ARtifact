import * as Location from 'expo-location';

class LocationService {
  static async requestLocationPermission() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  static async getCurrentPosition() {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    return {
      coords: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }
    };
  }

  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1000; // Distance in meters
  }
}

export default LocationService;