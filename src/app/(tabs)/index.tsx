import { CameraMode, CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, View, Text, Image } from "react-native";
import { Colors } from "../../ui/colors";
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import {readAsStringAsync, EncodingType} from "expo-file-system/legacy"
import { readBestEffortLocation, reverseGeocode } from '../../services/location';
import { fetchNearbyFirstTitle } from '../../services/wiki';
import { withTimeout } from '../../utils/async';


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
      const nearbyTitle = location ? await fetchNearbyFirstTitle(location.coords.latitude, location.coords.longitude) : null;

      const userMessageContent = [
        {
          type: "text",
          text: `You are an experienced tour guide. Carefully examine this image taken at ${coordsPart}. If relevant, the nearby landmark could be: ${nearbyTitle ?? 'unknown'}. Introduce the place including history, architecture, and what is special. Do not include raw coordinates in your response.`,
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
      const loc = await readBestEffortLocation();
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
            <Text style={styles.loadingText}>Analyzing…</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
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
    borderWidth: 4,
    borderColor: Colors.text,
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
    backgroundColor: Colors.text,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingSign: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#0b0b0bcc',
    borderWidth: 1,
    borderColor: '#333',
  },
  loadingText: {
    color: Colors.text,
    fontSize: 16,
  },
});