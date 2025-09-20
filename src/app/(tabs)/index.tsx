import { CameraMode, CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, View, Text, Image } from "react-native";
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import {readAsStringAsync, EncodingType} from "expo-file-system/legacy"


export default function Tab() {
  const router = useRouter();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();

  const cameraRef = useRef<CameraView>(null);
  const [mode] = useState<CameraMode>("picture");
  const [facing] = useState<CameraType>("back");
  const [loading, setLoading] = useState(false);
  const [snapshotUri, setSnapshotUri] = useState<string | null>(null);
  const isAnalyzingRef = useRef(false);

  const AI_API_KEY = process.env.EXPO_PUBLIC_OPEN_ROUTER_API_KEY;

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

  const withTimeout = async <T,>(promise: Promise<T>, ms: number, onTimeout?: () => void): Promise<T> => {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => setTimeout(() => { onTimeout?.(); reject(new Error('timeout')); }, ms))
    ]) as T;
  };

  const getLocation = async (): Promise<Location.LocationObject | null> => {
    try {
      // 1) Try last known location (fast, may be stale but good enough for context)
      const last = await Location.getLastKnownPositionAsync();
      if (last) return last;
    } catch {}
    try {
      // 2) Fall back to a fresh read with a slightly longer timeout
      return await withTimeout(Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }), 7000);
    } catch (e) {
      console.warn('Fresh location read failed/timed out');
      return null;
    }
  };

  const reverseGeocode = async (coords: Location.LocationObjectCoords) => {
    try {
      const [place] = await withTimeout(Location.reverseGeocodeAsync({ latitude: coords.latitude, longitude: coords.longitude }), 3000);
      if (!place) return null;
      const parts = [place.name, place.street, place.city, place.region, place.postalCode, place.country].filter(Boolean);
      return parts.join(', ');
    } catch (e) {
      console.warn('Reverse geocoding failed or timed out');
      return null;
    }
  };

  const analyzeImage = async (photoUri: string, location: Location.LocationObject | null) => {
    try {
      const place = location ? await reverseGeocode(location.coords) : null;
      let analysis = "None";
      await withTimeout(new Promise(resolve => setTimeout(resolve, 1800)), 5000);
      let coordsPart = location ? `${location.coords.latitude.toFixed(5)}, ${location.coords.longitude.toFixed(5)}` : 'Unknown coordinates';

      // Ask AI
      const base64 = await readAsStringAsync(photoUri, {
        encoding: EncodingType.Base64,
      });
      if (place) {
        coordsPart += ` (${place})`;
      }
      const userMessageContent = [
        {
          type: "text",
          text: `You are a experienced tour guide. Carefully examine this image taken at ${coordsPart}. Introduce the location including its history, architecture, and what;s so special about this place. Also, you dont need to include the coordinates in your response`,
        },
        {
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${base64}`,
          },
        },
      ];
      const payload = {
        model: "x-ai/grok-4-fast:free",
        messages: [
          {
            role: "user",
            content: userMessageContent,
          },
        ],
        max_tokens: 1024,
      };
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`OpenRouter API Error ${response.status}: ${errorBody}`);
      }
      const data = await response.json();

      analysis = data.choices?.[0]?.message?.content;

      if (!analysis) {
        throw new Error("No content returned from AI model");
      }
      // const analysis = `Image analysis at ${coordsPart}${place ? ` (${place})` : ''}`;
      router.push({ pathname: '/result', params: { analysis, place: place ?? '' } });
    } catch (err) {
      console.warn('Analysis failed or timed out', err);
      const analysis = 'Image analysis unavailable (timeout)';
      router.push({ pathname: '/result', params: { analysis, place: '' } });
    } finally {
      setLoading(false);
      setSnapshotUri(null);
      isAnalyzingRef.current = false;
    }
  };

  const takePicture = async () => {
    if (isAnalyzingRef.current) return;
    const photo = await cameraRef.current?.takePictureAsync();
    if (photo?.uri) {
      isAnalyzingRef.current = true;
      setSnapshotUri(photo.uri);
      setLoading(true);
      const loc = await getLocation();
      await analyzeImage(photo.uri, loc);
    }
  };

  return (
    <View style={styles.root}>
      {!snapshotUri && (
        <CameraView
          style={styles.camera}
          ref={cameraRef}
          mode={mode}
          facing={facing}
          mute={false}
          responsiveOrientationWhenOrientationLocked
        />
      )}
      {snapshotUri && (
        <Image source={{ uri: snapshotUri }} style={styles.camera} resizeMode="cover" />
      )}

      <View style={styles.shutterContainer}>
        <Pressable onPress={takePicture} disabled={loading || isAnalyzingRef.current}>
          {({ pressed }) => (
            <View
              style={[
                styles.shutterBtn,
                { opacity: (loading || isAnalyzingRef.current) ? 0.3 : pressed ? 0.5 : 1 },
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