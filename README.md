# Vidyank Mobile Examination Application 📱

> **Secure, cross-platform mobile examination platform with AI proctoring, face detection, and exam integrity verification.**

[![Expo](https://img.shields.io/badge/Expo-SDK%2054-black?style=flat&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=flat&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)

---

## 📌 Overview

**Vidyank Exam Application** is an enterprise-grade mobile testing suite engineered for secure, remote online assessments. Built with **Expo SDK 54** and **React Native**, it incorporates hardware camera integration and real-time facial tracking to ensure academic honesty while providing students with an intuitive, lag-free test-taking interface.

---

## ✨ Core Highlights

- 👁️ **AI Proctoring:** Continuous face verification via `expo-face-detector` and camera feeds (`expo-camera`) to identify candidate presence and disallow unauthorized assistance.
- 🛡️ **Anti-Cheating Navigation Guards:** Strict back-button overrides and multi-screen state locks preventing accidental or deliberate exit during active tests.
- 📊 **Performance Analytics:** Comprehensive score visualization using `react-native-chart-kit` and SVG graphs.
- 📲 **Two-Factor Candidate Verification:** Identity validation supported via Twilio SMS and SendGrid email notifications.
- 🌐 **Cross-Platform:** Native builds for Android and iOS, with web export capabilities.

---

## 🏗️ Repository Architecture
```
VIDYANK-EXAM-APPLICATION/
├── backend/                  # API server for exam scheduling, user auth, and test results
├── frontend/                 # Expo & React Native cross-platform application
│   ├── index.ts              # Entrypoint
│   └── package.json          # Expo SDK 54 & React Native dependencies
├── BACK_BUTTON_GUIDE.md      # Navigation lock & exam integrity protocols
├── MOBILE_UX_IMPROVEMENTS.md # Mobile UX heuristics & performance optimizations
├── NAVIGATION_IMPROVEMENTS.md
├── QUICK_REFERENCE_GUIDE.md
└── TESTING_GUIDE.md          # Test execution runbook
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20.x
- Expo CLI (`npm install -g expo-cli`)
- Expo Go mobile app on iOS or Android

### Setup
```bash
cd frontend
npm install
npx expo start
```
Scan the QR code with your mobile device using Expo Go.
