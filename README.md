# ARtifact — AI‑Powered Interactive Tour Guide

ARtifact is a mobile application that acts as an interactive, AI-powered tour guide. It allows tourists to point their phone's camera at a building, temple, or street to learn about its history and significance in real-time.

## The Problem

Tourists often walk past historically or culturally significant locations without realizing their importance. Traditional guidebooks can be clunky, and pre-recorded audio tours are often rigid and non-interactive.

## The Solution

ARtifact offers a seamless and interactive way to explore new places. Here's how it works:

*   **Real-time Identification:** The app uses computer vision to identify the location from your photo in real-time.
*   **Instant Information:** The AI provides a detailed story and key facts about the place. For example: "You're looking at the Man Mo Temple, one of the oldest in Hong Kong..."
*   **Interactive Q&A:** You can ask follow-up questions conversationally, such as "Why is there so much smoke inside?" or "Tell me a famous story associated with this temple." The AI provides answers in real-time, allowing for a dynamic and personalized tour.

## Quick Start

1.  **Install dependencies:**
    ```bash
    cd src
    npm install
    npx install-expo-modules@latest
    ```

2.  **Run the app:**
    ```bash
    npx expo start
    ```

    You can run the app in a development build, an Android emulator, an iOS simulator, or with Expo Go. Remember to grant camera and location permissions when prompted.