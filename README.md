# ARtifact — AI Tour Guide

![ARtifact Logo](src/assets/images/logo.png)

ARtifact transforms your smartphone camera into a personal AI tour guide. Simply capture a photo of any landmark to instantly receive rich contextual information, discover nearby points of interest, and access quick translation tools—all designed to enhance your travel experience.

## Features
- **Lens (Camera AI):** Identify landmarks and get instant information.
- **Planner:** Organize your itinerary with ease.
- **Translation:** Break down language barriers on the go.

## Setup
1) **Install Dependencies:**
```bash
npm install
npx install-expo-modules@latest
```

2) **Configure Local Environment:**
Create a `src/.env.local` file (this file is gitignored):
```bash
EXPO_PUBLIC_OPEN_ROUTER_API_KEY=sk-or-...
# Optional but recommended for translation reliability:
EXPO_PUBLIC_GOOGLE_TRANSLATE_API_KEY=your-google-key
# Or point at a reliable LibreTranslate instance (optional)
EXPO_PUBLIC_LIBRE_TRANSLATE_URL=https://libretranslate.com/translate
```

3) **Run the Application:**
```bash
npx expo start
```
Grant camera and location permissions when prompted.

## Notes
-   Environment keys prefixed with `EXPO_PUBLIC_` are accessible within client-side code