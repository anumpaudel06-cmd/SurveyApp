# Land Survey Pro 🌐📐

Professional Cadastral Land Surveying, Traditional Nepali Measurement Converter, and GNSS RTK Engineering Suite.

---

## ⚡ 3 Commands to Build Your Android APK

To build the downloadable release APK using GitHub Actions:

```bash
git init && git add . && git commit -m "Initial Land Survey Pro release"
git remote add origin https://github.com/<YOUR_USERNAME>/land-survey-pro.git
git push -u origin main
```

### Then simply:
1. **Create GitHub repo** (if not already created)
2. **Push code** using the 3 commands above
3. **Go to Actions tab → download "app-release.apk"**

---

## 📱 Features

- **Traditional Nepali Land Calculation**:
  - Triangle Heron's method $(a, b, c)$, Right Triangle $(0.5 \times \text{base} \times \text{height})$, Rectangle $(L \times W)$, and Cadastral 4-Corner irregular quadrilateral method (two triangles + diagonal).
  - Building footprint deductions with real-time net usable area.
- **Fixed Exact Survey Conversions**:
  - $1\text{ sq ft} = 0.092903\text{ sq m}$
  - $1\text{ acre} = 43,560\text{ sq ft}$
  - $1\text{ hectare} = 107,639\text{ sq ft}$
  - $1\text{ ropani} = 5,476\text{ sq ft}$, $1\text{ aana} = 342.25\text{ sq ft}$, $1\text{ paisa} = 85.56\text{ sq ft}$, $1\text{ daam} = 21.39\text{ sq ft}$
  - $1\text{ bigha} = 72,900\text{ sq ft}$, $1\text{ kattha} = 3,645\text{ sq ft}$, $1\text{ dhur} = 182.25\text{ sq ft}$
- **2D CAD Shoelace Plotter**:
  - Interactive touch/click vertex drafting, snap-to-grid, live edge dimension tags, internal angles, building footprint subtraction, local storage and DXF export.
- **Satellite Geo-Plotter**:
  - WGS84 geodesic spherical polygon computation, GPS field tracking ("record current waypoint"), perimeter, KML & GeoJSON export.
- **Precision Converter**:
  - Area converter across 11 units.
  - Length converter (feet, meters, inches, yards, chains, links).
- **Area Arithmetic Engine**:
  - Add, subtract, multiply, and partition parcels with multi-unit input (R-A-P-D, B-K-D, Sq Ft) and immediate cross-unit results.
- **Survey & Geodesy Tools**:
  - UTM, MGRS, and DMS coordinate systems.
  - EPSG datum conversions (EPSG:4326, EPSG:3857, EPSG:32644, EPSG:32645, EPSG:6207 Nagarkot).
  - Earthwork Cut/Fill calculation (Grid cell method & Prismoidal end-area method).
  - Contour & cross-section elevation profiles.
  - Stakeout navigation with target bearing compass & distance countdown.
  - Traverse loop closure error & Bowditch precision balance ($1 : N$).
  - GNSS health monitor: PDOP, HDOP, VDOP, RTK Fixed/Float indicators.
- **Settings & Peripherals**:
  - Bluetooth GNSS receiver & NTRIP RTK caster client with live NMEA-0183 GGA feed.
  - AR boundary optical viewfinder camera overlay.
  - Offline map caching manager.
  - Cadastral GIS layer toggles.
  - Field survey guide & tips.

---

## 🛠 Local Development

```bash
# Install dependencies
npm install

# Run the live interactive survey suite
npm run dev
```

Build APK locally using EAS:
```bash
npx eas-cli build --platform android --profile preview --local
```
