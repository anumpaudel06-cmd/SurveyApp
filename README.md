# Surveying Traverse & Land Area Calculator

[![Download APK](https://img.shields.io/badge/Download-APK%20v1.0.0-10B981?style=for-the-badge&logo=android&logoColor=white)](https://github.com/anumpaudel06-cmd/SurveyApp/releases/download/v1.0.0/SurveyApp-v1.0.0.apk)
[![Latest Release](https://img.shields.io/github/v/release/anumpaudel06-cmd/SurveyApp?style=for-the-badge&color=10B981)](https://github.com/anumpaudel06-cmd/SurveyApp/releases/latest)

A high-precision GIS, surveying, and cadastral computation application built with cross-platform architecture (Android Jetpack Compose & Flutter).

---

## 📲 Download & Install (.apk)

Directly download and install the latest Android application:

- 🚀 **[Download SurveyApp-v1.0.0.apk (Direct Download)](https://github.com/anumpaudel06-cmd/SurveyApp/releases/download/v1.0.0/SurveyApp-v1.0.0.apk)**
- 📦 **[View All Releases on GitHub](https://github.com/anumpaudel06-cmd/SurveyApp/releases/latest)**

### How to Install:
1. Download the `.apk` file above directly to your Android device.
2. Open the downloaded file from your notifications or file manager.
3. If prompted, allow "Install from Unknown Sources" for your browser / file manager.
4. Tap **Install** and launch **SurveyApp**!

---

## 🌟 Core Modules

### 1. Module A: Traverse Computation Engine
- **Manual Input**: Supports entering `Station`, `Line`, `Corrected Angles (DMS)`, `Distance (m)`, and initial `Bearing (DMS)` for the first station.
- **Bearing Auto-Propagation**: Automatically computes forward whole circle bearings for each subsequent station.
- **Balancing Adjustments**:
  - **Bowditch (Compass) Rule**: Corrections proportional to line length / perimeter.
  - **Transit Rule**: Corrections proportional to latitude and departure components.
- **Dynamic Table Output**:
  - Exact ordered columns: `S.N.`, `STATION`, `CORRECTED ANGLES`, `LINE`, `BEARING`, `DISTANCE (m)`, `ΔE`, `ΔN`, `Corrected ΔE`, `Corrected ΔN`, `Corrected Easting`, `Corrected Northing`.
- **Misclosure & Accuracy Analysis**: Total perimeter, raw departure misclosure ($\Sigma\Delta E$), raw latitude misclosure ($\Sigma\Delta N$), linear misclosure ($e = \sqrt{\Delta E^2 + \Delta N^2}$), error bearing, and relative precision ratio (e.g. $1 : 12,450$).
- **Direct Pipe to Area Calculator**: One-tap transfer of computed adjusted Easting/Northing coordinates to the Area Calculator.

---

### 2. Module B: Cadastral Unit Converter
- **Exact Nepal Cadastral Standards**:
  - **Bigha System (Terai)**:
    - 1 Bigha = 20 Kattha = 6,772.63 sq.m = 72,900 sq.ft.
    - 1 Kattha = 20 Dhur = 338.63 sq.m = 3,645 sq.ft.
    - 1 Dhur = 16.93 sq.m = 182.25 sq.ft.
  - **Ropani System (Hilly)**:
    - 1 Ropani = 16 Aana = 508.72 sq.m = 5,476 sq.ft.
    - 1 Aana = 4 Paisa = 31.80 sq.m = 342.25 sq.ft.
    - 1 Paisa = 4 Daam = 7.95 sq.m = 85.56 sq.ft.
    - 1 Daam = 1.99 sq.m = 21.39 sq.ft.
  - **General Interconversions**:
    - 1 Ropani $\approx$ 0.0752 Bigha | 1 Bigha $\approx$ 13.31 Ropani | 1 sq.m $\approx$ 10.7639 sq.ft.
    - 1 Hectare = 10,000 sq.m | 1 Acre = 43,560 sq.ft.
    - Angular: $400^g = 360^\circ = 24\text{ hrs} = 2\pi\text{ rad} = 6400\text{ mils}$.
- **Dashboard Layout**:
  - **Top Section**: Horizontal input cards for "Ropani System Input", "Bigha System Input", and "Sq.Ft/M Input".
  - **Middle Section**: Large bordered "Conversion Results" container displaying values in high-contrast red text alongside unit labels.
  - **Bottom Section**: Expandable "Conversion Rates" reference card with exact cadastral equivalents.

---

### 3. Module C: Area Calculator & Interactive Plotter
- **Shoelace Formula**: Computes exact polygon area:
  $$A = \frac{1}{2} \left| \sum_{i=0}^{n-1} (x_i y_{i+1} - x_{i+1} y_i) \right|$$
- **Interactive 2D Canvas (Tap-to-Plot)**:
  - Tap or click on the screen to drop vertex pins.
  - Automatic line connections with distance labels.
  - Control buttons: **Undo Last Point**, **Close Polygon**, and **Clear Canvas**.
  - Surveying technical grid background and auto-bounding box scaling.
- **Coordinate Table**: Manual table entry for vertex coordinates (X, Y) with edit and delete controls.
- **Instant Dynamic Output**: Displays area simultaneously in Sq.m, Sq.ft, Hectares, Acres, Bigha-Kattha-Dhur, and Ropani-Aana-Paisa-Daam.

---

## 🛠️ Build & Compilation Instructions

### Prerequisites
- [Flutter SDK](https://docs.flutter.dev/get-started/install) ($\ge 3.0.0$)
- For Android: Android Studio & Android SDK
- For Windows: Visual Studio with "Desktop development with C++" workload
- For Web: Chrome or any modern HTML5 browser

---

### Terminal Commands

Navigate into the Flutter project folder:
```bash
cd flutter_app
```

#### 1. Fetch Dependencies
```bash
flutter pub get
```

#### 2. Run Locally in Development Mode
```bash
# Run on connected Android device / emulator
flutter run -d android

# Run on Windows Desktop
flutter run -d windows

# Run in Chrome web browser
flutter run -d chrome
```

#### 3. Compile for Android (.apk)
```bash
# Release APK (universal)
flutter build apk --release

# Split per ABI (smaller APKs)
flutter build apk --split-per-abi

# Output location:
# build/app/outputs/flutter-apk/app-release.apk
```

#### 4. Compile for Windows Desktop (.exe)
```bash
# Ensure Windows desktop support is enabled
flutter config --enable-windows-desktop

# Build Windows executable
flutter build windows --release

# Output location:
# build/windows/x64/runner/Release/
# Contains surveying_traverse_area_calc.exe along with required DLLs
```

#### 5. Compile for Web
```bash
# Ensure Web support is enabled
flutter config --enable-web

# Build static web deployment bundle
flutter build web --release

# Output location:
# build/web/
```

---

## 📁 Codebase Directory Layout

```
├── app/                                       # Native Android Jetpack Compose App (Running in AI Studio)
│   ├── src/main/java/com/example/
│   │   ├── MainActivity.kt                    # Top-level Navigation Bar (3 Tabs)
│   │   ├── data/SurveyConstants.kt            # High-precision cadastral constants
│   │   ├── model/                             # DmsAngle, TraverseModels, AreaPoint
│   │   ├── service/                           # TraverseEngine (Bowditch/Transit), AreaEngine (Shoelace)
│   │   └── ui/screens/                        # TraverseScreen, UnitConverterScreen, AreaCalculatorScreen
├── flutter_app/                               # Cross-Platform Flutter Codebase (Web, Windows, Android)
│   ├── pubspec.yaml
│   └── lib/
│       ├── main.dart                          # Multi-tab Navigation Shell
│       ├── constants/survey_constants.dart    # Centralized conversion constants
│       ├── models/                            # DMS angle, Traverse, and Area data models
│       ├── services/                          # Shoelace & Traverse adjustment engines
│       └── screens/                           # Traverse, Unit Converter & Area Plotter screens
└── README.md                                  # Complete build & user documentation
```
