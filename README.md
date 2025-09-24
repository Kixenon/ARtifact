# ARtifact — AI Tour Guide

ARtifact is a minimal mobile app that turns your camera into a tour guide. Snap a photo of a landmark to get context, nearby points of interest, and quick translation tools while traveling.

## Features
- Lens (Camera AI)
- Planner
- Translation

## Setup
1) Install:
```bash
npm install
npx install-expo-modules@latest
```

2) Local env (gitignored). Create `src/.env.local`:
```bash
EXPO_PUBLIC_OPEN_ROUTER_API_KEY=sk-or-...
# Optional but recommended for translation reliability:
EXPO_PUBLIC_GOOGLE_TRANSLATE_API_KEY=your-google-key
# Or point at a reliable LibreTranslate instance (optional)
EXPO_PUBLIC_LIBRE_TRANSLATE_URL=https://libretranslate.com/translate
```

3) Run:
```bash
npx expo start
```

Grant camera and location permissions when prompted.

## Tech
- Expo Router, React Native
- Camera: `expo-camera`
- Location: `expo-location`
- AI: OpenRouter chat completions
- Data helpers: Wikipedia REST & Geosearch
- Translate: Google Translate API or LibreTranslate fallback

## Notes
- Env keys prefixed with `EXPO_PUBLIC_` are available to client code.
- Clipboard: on web we use `navigator.clipboard`. On native, system share/copy can be added later if needed.