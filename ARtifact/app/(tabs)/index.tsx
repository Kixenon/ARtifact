import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import * as Location from 'expo-location';

export default function Tab() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();

  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [mode, setMode] = useState<CameraMode>("picture");
  const [facing, setFacing] = useState<CameraType>("back");
  const [recording, setRecording] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!cameraPermission || !locationPermission) {
    return null;
  }

  // ask for permission to use camera
  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestCameraPermission} title="Grant camera permission" />
      </View>
    );
  }

  // ask for permission to use location
  if (!locationPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to access your location
        </Text>
        <Button onPress={requestLocationPermission} title="Grant location permission" />
      </View>
    );
  }

  const analyzeImage = async (photoUri: string, location: Location.LocationObject) => {
    setLoading(true);
    setAnalysis(null);
    console.log('Analyzing image:', photoUri, 'at location:', location.coords);

    // TODO: Implement the API call to AI service.
    // Likely use FormData to send the image and location.
    // For example:
    // const formData = new FormData();
    // formData.append('image', { uri: photoUri, name: 'photo.jpg', type: 'image/jpeg' });
    // formData.append('latitude', location.coords.latitude.toString());
    // formData.append('longitude', location.coords.longitude.toString());
    //
    // const response = await fetch('YOUR_AI_API_ENDPOINT', {
    //   method: 'POST',
    //   body: formData,
    // });
    // const result = await response.json();
    // setAnalysis(result.analysis);

    // Placeholder for demonstration
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAnalysis(`Analysis for image at lat: ${location.coords.latitude}, lon: ${location.coords.longitude}`);
    setLoading(false);
  };

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    if (photo?.uri) {
      setUri(photo.uri);
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        analyzeImage(photo.uri, location);
      }
    }
  };

  const recordVideo = async () => {
    if (recording) {
      setRecording(false);
      ref.current?.stopRecording();
      return;
    }
    setRecording(true);
    const video = await ref.current?.recordAsync();
    console.log({ video });
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "picture" ? "video" : "picture"));
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const renderPicture = (uri: string) => {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri }}
          contentFit="contain"
          style={{ width: 300, aspectRatio: 1 }}
        />
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {analysis && <Text style={styles.analysisText}>{analysis}</Text>}
        <Button onPress={() => { setUri(null); setAnalysis(null); }} title="Take another picture" />
      </View>
    );
  };

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          ref={ref}
          mode={mode}
          facing={facing}
          mute={false}
          responsiveOrientationWhenOrientationLocked
        />
        <View style={styles.shutterContainer}>
          <Pressable onPress={toggleMode}>
            {mode === "picture" ? (
              <AntDesign name="picture" size={32} color="white" />
            ) : (
              <Feather name="video" size={32} color="white" />
            )}
          </Pressable>
          <Pressable onPress={mode === "picture" ? takePicture : recordVideo}>
            {({ pressed }) => (
              <View
                style={[
                  styles.shutterBtn,
                  {
                    opacity: pressed ? 0.5 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.shutterBtnInner,
                    {
                      backgroundColor: mode === "picture" ? "white" : "red",
                    },
                  ]}
                />
              </View>
            )}
          </Pressable>
          <Pressable onPress={toggleFacing}>
            <FontAwesome6 name="rotate-left" size={32} color="white" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {uri ? renderPicture(uri) : renderCamera()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraContainer: StyleSheet.absoluteFillObject,
  camera: StyleSheet.absoluteFillObject,
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
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
  },
  analysisText: {
    margin: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});