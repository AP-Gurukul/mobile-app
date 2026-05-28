# APPSC Pandit - Student Practice App

Welcome to the **APPSC Pandit** student application! This is a modern, premium mobile application built with React Native and Expo to help students practice, analyze their performance, and excel in their exams.

## Features

- **Auth & Profiles**: Secure email/password and Google Sign-in via Firebase.
- **Practice Engine**: Dynamic question generation for specific subjects and topics.
- **Review Center**: Smart algorithms to track "Wrong Answers", "Bookmarked", "Flagged", and "Weak Topics".
- **Test Series**: Mock exams with varying difficulty and durations.
- **Analytics**: Detailed subject-wise performance analysis.

## Tech Stack

- **Framework**: React Native 0.81.x
- **Environment**: Expo SDK 54
- **Language**: TypeScript
- **Routing**: Expo Router (file-based navigation)
- **UI Framework**: React Native Paper (Material Design 3)
- **State Management**: Zustand
- **Backend**: Firebase (Auth, Firestore)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AP-Gurukul/mobile-app.git
   cd mobile-app
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

4. Press `i` to open in iOS Simulator, `a` for Android Emulator, or scan the QR code with the Expo Go app on your physical device.

## Project Structure

```
├── app/                  # Expo Router file-based routes
│   ├── (auth)/           # Authentication screens
│   ├── (tabs)/           # Main bottom tab navigation
│   └── practice/         # Practice session flows
├── src/                  # Source files
│   ├── components/       # Reusable UI components
│   ├── services/         # Firebase and API logic
│   ├── store/            # Zustand state management
│   └── theme/            # React Native Paper theme
├── assets/               # Images, fonts, etc.
└── app.json              # Expo configuration
```

## Contributing

We welcome contributions! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to get started.

## License

All rights reserved to AP Gurukul.
