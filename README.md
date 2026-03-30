# PDF Reader App — React Native CLI

A mobile PDF reader built with **React Native CLI** (TypeScript). It lets users:

- 📂 **Pick local PDF files** from device storage via the system document picker
- 🌐 **Open PDFs from a URL** by pasting a remote link
- 📄 **Browse sample PDFs** with one tap
- View PDFs with **pinch-to-zoom**, **scroll**, and a **page counter** badge
- Shows a **loading progress bar** and a friendly **error / retry** screen

---

## Tech Stack

| Library | Purpose |
|---|---|
| `react-native` 0.73 | Core framework |
| `react-native-pdf` | PDF rendering (iOS: PDFKit, Android: PdfRenderer) |
| `react-native-blob-util` | File I/O backing for react-native-pdf |
| `react-native-document-picker` | System file picker |
| `@react-navigation/native-stack` | Screen navigation |
| `react-native-safe-area-context` | Safe-area insets |
| `react-native-screens` | Native screen containers |

---

## Project Structure

```
PdfReaderApp/
├── App.tsx                        # Root component (NavigationContainer)
├── index.js                       # Entry point
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx         # File picker + URL input + samples
│   │   └── PdfViewerScreen.tsx    # Full-screen PDF viewer
│   └── types/
│       └── navigation.ts          # Navigation param types
├── android/                       # Android project
├── ios/                           # iOS project (Podfile)
├── package.json
└── tsconfig.json
```

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | ≥ 18 |
| React Native CLI | latest (`npx react-native`) |
| Android Studio + SDK | API 23+ |
| Xcode | 14+ (iOS only) |
| CocoaPods | latest (iOS only) |
| JDK | 17 |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Android

```bash
# Link native modules (auto-linking handles most, but run pod install on iOS)
npx react-native run-android
```

> **Android permissions** are already declared in `AndroidManifest.xml`:
> - `INTERNET` — for remote PDFs
> - `READ_EXTERNAL_STORAGE` (≤ API 32) / `READ_MEDIA_IMAGES` (API 33+) — for local files

### 3. iOS

```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

> On iOS 14+ add the following to your `Info.plist` to allow local file access from the document picker (already handled by `react-native-document-picker`):
> ```xml
> <key>UIFileSharingEnabled</key><true/>
> <key>LSSupportsOpeningDocumentsInPlace</key><true/>
> ```

---

## Running the Metro Bundler

```bash
npm start
```

---

## Screens

### Home Screen
- **Open Local PDF** — opens the OS file picker filtered to PDF files
- **Open PDF from URL** — accepts any `http/https` URL pointing to a PDF
- **Sample PDFs** — two pre-loaded remote PDFs for quick testing

### PDF Viewer Screen
- Full-screen PDF rendered natively
- Pinch-to-zoom and pan (built into `react-native-pdf`)
- Page counter badge (current page / total pages)
- Loading spinner with percentage progress
- Error card with **Retry** button

---

## Linting

```bash
npm run lint
```

## Tests

```bash
npm test
```

---

## License

MIT
