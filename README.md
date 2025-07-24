# AI Styler - React Native App

A React Native application for AI-powered outfit styling and wardrobe management.

## Project Structure

```
AIStyler/
├── .cursor/                     # Cursor IDE configuration
│   └── rules/                   # AI rules for Cursor
├── src/                         # Main source code
│   ├── assets/                  # Static assets
│   │   ├── images/              # Image assets (icons, logos, etc.)
│   │   └── fonts/               # Font assets
│   ├── components/              # Reusable UI components
│   │   ├── ErrorBoundary.tsx
│   │   └── LoadingScreen.tsx
│   ├── config/                  # Configuration files
│   │   └── index.ts
│   ├── constants/               # App constants
│   │   └── index.ts
│   ├── contexts/                # React Context providers
│   │   ├── AppContext.tsx
│   │   ├── AuthContext.tsx
│   │   └── PreferencesContext.tsx
│   ├── hooks/                   # Custom React hooks
│   │   ├── index.ts
│   │   ├── useAnimation.ts
│   │   ├── useAppState.ts
│   │   └── useImageUpload.ts
│   ├── navigation/              # Navigation configuration
│   │   ├── Navigation.tsx
│   │   └── types.ts
│   ├── screens/                 # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── OutfitPreviewScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── UploadScreen.tsx
│   │   └── WardrobeScreen.tsx
│   ├── services/                # API services and business logic
│   │   └── AIService.ts
│   ├── theme/                   # Global styling and theme
│   │   └── index.ts
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts
│   └── utils/                   # Utility functions
│       ├── index.ts
│       ├── colors.ts
│       ├── dates.ts
│       ├── storage.ts
│       └── validation.ts
├── .eslintrc.js                 # ESLint configuration
├── .prettierrc                  # Prettier configuration
├── App.tsx                      # Main app component
├── app.json                     # Expo app configuration
├── babel.config.js              # Babel configuration
├── jest.config.js               # Jest testing configuration
├── jest.setup.js                # Jest setup file
├── package.json                 # Project dependencies
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation
```

## Features

- **AI-Powered Outfit Suggestions**: Get personalized outfit recommendations
- **Wardrobe Management**: Organize and manage your clothing items
- **Image Upload & Processing**: Upload and process clothing images
- **Background Removal**: AI-powered background removal for clothing items
- **Outfit Collages**: Create and save outfit combinations
- **User Profiles**: Manage user preferences and settings

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for navigation
- **React Native Elements** for UI components
- **Expo Image Picker** for image selection
- **React Native View Shot** for capturing views
- **AsyncStorage** for local data persistence

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd AIStyler
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your device

## Development

### Project Organization

The project follows a modular architecture with clear separation of concerns:

- **Components**: Reusable UI components
- **Screens**: Main app views and pages
- **Services**: API calls and business logic
- **Hooks**: Custom React hooks for shared logic
- **Contexts**: Global state management
- **Utils**: Helper functions and utilities
- **Theme**: Global styling and design system

### Code Style

- TypeScript for type safety
- ESLint and Prettier for code formatting
- Consistent naming conventions
- Component-based architecture
- Custom hooks for reusable logic

## Contributing

1. Follow the established code style and project structure
2. Write meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed

## License

This project is licensed under the MIT License - see the LICENSE file for details. 