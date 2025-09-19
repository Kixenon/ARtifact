import { CameraMode, CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

export default function Tab() {
  const router = useRouter();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();

  const cameraRef = useRef<CameraView>(null);
  const [mode] = useState<CameraMode>("picture");
  const [facing] = useState<CameraType>("back");
  const [loading, setLoading] = useState(false);

  if (!cameraPermission || !locationPermission) {
    return null;
  }

  if (!cameraPermission.granted) {
    requestCameraPermission();
    return null;
  }

  if (!locationPermission.granted) {
    requestLocationPermission();
    return null;
  }

  const reverseGeocode = async (coords: Location.LocationObjectCoords) => {
    try {
      const [place] = await Location.reverseGeocodeAsync({ latitude: coords.latitude, longitude: coords.longitude });
      if (!place) return null;
      const parts = [place.name, place.street, place.city, place.region, place.postalCode, place.country].filter(Boolean);
      return parts.join(', ');
    } catch (e) {
      console.warn('Reverse geocoding failed', e);
      return null;
    }
  };

  const analyzeImage = async (photoUri: string, location: Location.LocationObject) => {
    setLoading(true);
    try {
      const place = await reverseGeocode(location.coords);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1800));
      const analysis = `Image analysis at ${location.coords.latitude.toFixed(5)}, ${location.coords.longitude.toFixed(5)}${place ? ` (${place})` : ''}`;
      router.push({ pathname: '/result', params: { analysis, place: place ?? '' } });
    } catch (err) {
      console.warn('Analysis failed', err);
    } finally {
      setLoading(false);
    }
  };

  const takePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync();
    if (photo?.uri) {
      try {
        const location = await Location.getCurrentPositionAsync({});
        await analyzeImage(photo.uri, location);
      } catch (err) {
        console.warn('Failed getting location or analyzing', err);
      }
    }
  };

  return (
    <View style={styles.root}>
      <CameraView
        style={styles.camera}
        ref={cameraRef}
        mode={mode}
        facing={facing}
        mute={false}
        responsiveOrientationWhenOrientationLocked
      />
      <View style={styles.shutterContainer}>
        <Pressable onPress={takePicture}>
          {({ pressed }) => (
            <View
              style={[
                styles.shutterBtn,
                { opacity: pressed ? 0.5 : 1 },
              ]}
            >
              <View style={styles.shutterBtnInner} />
            </View>
          )}
        </Pressable>
      </View>
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingSign}>
            <Text style={styles.loadingText}>Analyzing...</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: StyleSheet.absoluteFillObject,
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "white",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingSign: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    borderColor: '#444',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
});