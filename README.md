# Hong Kong Historic Buildings AR App

An augmented reality mobile app that introduces users to historic buildings in Hong Kong through location-based AR experiences with text and audio guides.

Note: None of the code in here actually works lmao
But you can install the shit i guess

## Features

- **Location-based AR**: Detects nearby historic buildings within 500m
- **Text Information**: Displays building names, construction years, and detailed descriptions
- **Audio Guides**: Voice narration for each building (when audio files are available)
- **Historical Facts**: Key historical information for each location
- **Cross-platform**: Works on both iOS and Android

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Install dependencies:
```bash
npm install expo
npx expo install expo-gl expo-camera expo-location expo-av expo-gl-cpp
```


2. For iOS:
```bash
cd ios && pod install && cd ..
npm run ios
```

3. For Android:
```bash
npm run android
```

## Project Structure

```
src/
├── components/
│   ├── ARScene.js          # Main AR scene with building detection
│   └── BuildingInfo.js     # Building information display
├── data/
│   └── buildings.json      # Historic buildings database
└── services/
    └── LocationService.js  # GPS and location utilities
```

## Adding New Buildings

Edit `src/data/buildings.json` to add new historic buildings:

```json
{
  "id": "unique_building_id",
  "name": "Building Name",
  "latitude": 22.xxxx,
  "longitude": 114.xxxx,
  "year": 1900,
  "description": "Building description...",
  "audioFile": "audio_file.mp3",
  "historicalFacts": ["Fact 1", "Fact 2"]
}
```

## Current Buildings Included

- Hong Kong City Hall (1962)
- Former Legislative Council Building (1912)
- Man Mo Temple (1847)

## Next Steps

1. Add audio files to `android/app/src/main/res/raw/` and `ios/[AppName]/`
2. Test on physical devices (AR requires camera access)
3. Add more Hong Kong historic buildings to the database
4. Implement building selection in AR view
5. Add photos and 3D models for enhanced experience