/**
 * Land Survey Pro - Surveying & Unit Conversion Mathematics
 * Pure functions with exact conversions as defined:
 * 
 * 1 sq ft = 0.092903 sq m
 * 1 acre = 43560 sq ft
 * 1 hectare = 107639 sq ft
 * 1 ropani = 5476 sq ft, 1 aana = 342.25 sq ft, 1 paisa = 85.56 sq ft, 1 daam = 21.39 sq ft
 * 1 bigha = 72900 sq ft, 1 kattha = 3645 sq ft, 1 dhur = 182.25 sq ft
 */

// EXACT CONVERSION CONSTANTS
export const SQFT_TO_SQM = 0.092903;
export const SQM_TO_SQFT = 1 / SQFT_TO_SQM;

export const ACRE_TO_SQFT = 43560;
export const HECTARE_TO_SQFT = 107639;

export const ROPANI_SQFT = 5476;
export const AANA_SQFT = 342.25;
export const PAISA_SQFT = 85.56;
export const DAAM_SQFT = 21.39;

export const BIGHA_SQFT = 72900;
export const KATTHA_SQFT = 3645;
export const DHUR_SQFT = 182.25;

export const FT_TO_M = 0.3048;
export const M_TO_FT = 1 / FT_TO_M;

export interface RopaniBreakdown {
  ropani: number;
  aana: number;
  paisa: number;
  daam: number;
  formatted: string;
}

export interface BighaBreakdown {
  bigha: number;
  kattha: number;
  dhur: number;
  formatted: string;
}

export interface MultiUnitAreaResult {
  sqFt: number;
  sqM: number;
  acres: number;
  hectares: number;
  ropani: RopaniBreakdown;
  bigha: BighaBreakdown;
}

/**
 * Breakdown square feet into Ropani-Aana-Paisa-Daam (R-A-P-D)
 */
export function sqFtToRopani(sqft: number): RopaniBreakdown {
  if (sqft <= 0 || isNaN(sqft)) {
    return { ropani: 0, aana: 0, paisa: 0, daam: 0, formatted: '0-0-0-0' };
  }
  const ropani = Math.floor(sqft / ROPANI_SQFT);
  let rem = sqft % ROPANI_SQFT;

  const aana = Math.floor(rem / AANA_SQFT);
  rem = rem % AANA_SQFT;

  const paisa = Math.floor(rem / PAISA_SQFT);
  rem = rem % PAISA_SQFT;

  const daam = parseFloat((rem / DAAM_SQFT).toFixed(2));

  return {
    ropani,
    aana,
    paisa,
    daam,
    formatted: `${ropani}-${aana}-${paisa}-${daam}`,
  };
}

/**
 * Convert Ropani-Aana-Paisa-Daam to Square Feet
 */
export function ropaniToSqFt(r: number, a: number, p: number, d: number): number {
  return (
    (Number(r) || 0) * ROPANI_SQFT +
    (Number(a) || 0) * AANA_SQFT +
    (Number(p) || 0) * PAISA_SQFT +
    (Number(d) || 0) * DAAM_SQFT
  );
}

/**
 * Breakdown square feet into Bigha-Kattha-Dhur (B-K-D)
 */
export function sqFtToBigha(sqft: number): BighaBreakdown {
  if (sqft <= 0 || isNaN(sqft)) {
    return { bigha: 0, kattha: 0, dhur: 0, formatted: '0-0-0' };
  }
  const bigha = Math.floor(sqft / BIGHA_SQFT);
  let rem = sqft % BIGHA_SQFT;

  const kattha = Math.floor(rem / KATTHA_SQFT);
  rem = rem % KATTHA_SQFT;

  const dhur = parseFloat((rem / DHUR_SQFT).toFixed(2));

  return {
    bigha,
    kattha,
    dhur,
    formatted: `${bigha}-${kattha}-${dhur}`,
  };
}

/**
 * Convert Bigha-Kattha-Dhur to Square Feet
 */
export function bighaToSqFt(b: number, k: number, dh: number): number {
  return (
    (Number(b) || 0) * BIGHA_SQFT +
    (Number(k) || 0) * KATTHA_SQFT +
    (Number(dh) || 0) * DHUR_SQFT
  );
}

/**
 * Convert a square feet value into all supported unit representations
 */
export function getAllUnitsFromSqFt(sqFt: number): MultiUnitAreaResult {
  const safeSqFt = Math.max(0, Number(sqFt) || 0);
  const sqM = safeSqFt * SQFT_TO_SQM;
  const acres = safeSqFt / ACRE_TO_SQFT;
  const hectares = safeSqFt / HECTARE_TO_SQFT;
  const ropani = sqFtToRopani(safeSqFt);
  const bigha = sqFtToBigha(safeSqFt);

  return {
    sqFt: safeSqFt,
    sqM,
    acres,
    hectares,
    ropani,
    bigha,
  };
}

/**
 * Convert from square meters to all units
 */
export function getAllUnitsFromSqM(sqM: number): MultiUnitAreaResult {
  const sqFt = (Number(sqM) || 0) * SQM_TO_SQFT;
  return getAllUnitsFromSqFt(sqFt);
}

// ----------------- GEOMETRIC CALCULATIONS -----------------

/**
 * Heron's formula for triangle area given 3 sides a, b, c
 */
export function triangleAreaHeron(a: number, b: number, c: number): number {
  if (a <= 0 || b <= 0 || c <= 0) return 0;
  if (a + b <= c || a + c <= b || b + c <= a) return 0; // Triangle inequality check
  const s = (a + b + c) / 2;
  const areaSq = s * (s - a) * (s - b) * (s - c);
  return areaSq > 0 ? Math.sqrt(areaSq) : 0;
}

/**
 * Rectangle area
 */
export function rectangleArea(length: number, width: number): number {
  return Math.max(0, length) * Math.max(0, width);
}

/**
 * Right triangle area
 */
export function rightTriangleArea(base: number, height: number): number {
  return 0.5 * Math.max(0, base) * Math.max(0, height);
}

/**
 * Triangle by SAS (Side-Angle-Side): 0.5 * a * b * sin(C in degrees)
 */
export function triangleAreaSAS(a: number, b: number, angleDeg: number): number {
  const rad = (angleDeg * Math.PI) / 180;
  return 0.5 * a * b * Math.sin(rad);
}

/**
 * Deduct building footprint(s) from gross land area
 */
export function deductFootprint(grossArea: number, buildingFootprints: number[]): {
  grossArea: number;
  totalFootprint: number;
  netArea: number;
} {
  const totalFootprint = buildingFootprints.reduce((acc, curr) => acc + Math.max(0, curr || 0), 0);
  const netArea = Math.max(0, grossArea - totalFootprint);
  return {
    grossArea,
    totalFootprint,
    netArea,
  };
}

export interface Point2D {
  x: number;
  y: number;
}

/**
 * Shoelace formula for polygon area (coordinates in feet or meters)
 */
export function shoelaceArea(points: Point2D[]): number {
  if (points.length < 3) return 0;
  let sum1 = 0;
  let sum2 = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const next = (i + 1) % n;
    sum1 += points[i].x * points[next].y;
    sum2 += points[i].y * points[next].x;
  }

  return Math.abs(sum1 - sum2) / 2;
}

/**
 * Polygon perimeter
 */
export function polygonPerimeter(points: Point2D[]): number {
  if (points.length < 2) return 0;
  let perimeter = 0;
  for (let i = 0; i < points.length; i++) {
    const next = (i + 1) % points.length;
    const dx = points[next].x - points[i].x;
    const dy = points[next].y - points[i].y;
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }
  return perimeter;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

/**
 * Geodesic distance between two WGS84 lat/lng points using Haversine formula (in meters)
 */
export function haversineDistanceMeters(p1: GeoPoint, p2: GeoPoint): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const lat1 = (p1.lat * Math.PI) / 180;
  const lat2 = (p2.lat * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Geodesic polygon area on sphere (in square meters)
 * Uses spherical excess algorithm
 */
export function geodesicPolygonAreaSqM(coords: GeoPoint[]): number {
  if (coords.length < 3) return 0;
  const R = 6378137; // WGS84 major radius
  let area = 0;
  const n = coords.length;

  for (let i = 0; i < n; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % n];

    const lat1 = (p1.lat * Math.PI) / 180;
    const lat2 = (p2.lat * Math.PI) / 180;
    const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;

    area += dLng * (2 + Math.sin(lat1) + Math.sin(lat2));
  }

  area = (Math.abs(area) * R * R) / 4.0;
  return area;
}

// ----------------- LENGTH & AREA CONVERTERS -----------------

export type LengthUnit = 'feet' | 'meters' | 'inches' | 'yards' | 'chains' | 'links';

export const LENGTH_TO_METERS: Record<LengthUnit, number> = {
  meters: 1,
  feet: 0.3048,
  inches: 0.0254,
  yards: 0.9144,
  chains: 20.1168, // 66 ft
  links: 0.201168, // 0.66 ft
};

export function convertLength(value: number, from: LengthUnit, to: LengthUnit): number {
  const inMeters = value * LENGTH_TO_METERS[from];
  return inMeters / LENGTH_TO_METERS[to];
}

export type AreaUnit =
  | 'sqft'
  | 'sqm'
  | 'acre'
  | 'hectare'
  | 'ropani'
  | 'aana'
  | 'paisa'
  | 'daam'
  | 'bigha'
  | 'kattha'
  | 'dhur';

export const AREA_TO_SQFT: Record<AreaUnit, number> = {
  sqft: 1,
  sqm: SQM_TO_SQFT,
  acre: ACRE_TO_SQFT,
  hectare: HECTARE_TO_SQFT,
  ropani: ROPANI_SQFT,
  aana: AANA_SQFT,
  paisa: PAISA_SQFT,
  daam: DAAM_SQFT,
  bigha: BIGHA_SQFT,
  kattha: KATTHA_SQFT,
  dhur: DHUR_SQFT,
};

export function convertArea(value: number, from: AreaUnit, to: AreaUnit): number {
  const inSqFt = value * AREA_TO_SQFT[from];
  return inSqFt / AREA_TO_SQFT[to];
}

// ----------------- AREA ARITHMETIC -----------------

export type ArithmeticOp = 'add' | 'subtract' | 'multiply' | 'divide';

export function calculateAreaArithmetic(
  val1SqFt: number,
  val2: number,
  op: ArithmeticOp,
  isVal2Scalar: boolean = false
): MultiUnitAreaResult {
  let resultSqFt = 0;
  switch (op) {
    case 'add':
      resultSqFt = val1SqFt + val2;
      break;
    case 'subtract':
      resultSqFt = Math.max(0, val1SqFt - val2);
      break;
    case 'multiply':
      resultSqFt = val1SqFt * (isVal2Scalar ? val2 : 1);
      break;
    case 'divide':
      resultSqFt = val2 !== 0 ? val1SqFt / val2 : 0;
      break;
  }
  return getAllUnitsFromSqFt(resultSqFt);
}

// ----------------- SURVEY & GEODESY TOOLS -----------------

/**
 * Degrees to DMS (Degrees, Minutes, Seconds)
 */
export function degToDms(deg: number, isLat: boolean): string {
  const dir = isLat ? (deg >= 0 ? 'N' : 'S') : deg >= 0 ? 'E' : 'W';
  const abs = Math.abs(deg);
  const d = Math.floor(abs);
  const minFloat = (abs - d) * 60;
  const m = Math.floor(minFloat);
  const s = ((minFloat - m) * 60).toFixed(2);
  return `${d}° ${m}' ${s}" ${dir}`;
}

/**
 * DMS to Decimal Degrees
 */
export function dmsToDeg(d: number, m: number, s: number, dir: 'N' | 'S' | 'E' | 'W'): number {
  let dec = d + m / 60 + s / 3600;
  if (dir === 'S' || dir === 'W') dec = -dec;
  return dec;
}

export interface UTMCoordinate {
  zone: number;
  hemisphere: 'N' | 'S';
  easting: number;
  northing: number;
  formatted: string;
}

/**
 * WGS84 Lat/Lon to approximate UTM coordinates
 */
export function latLngToUTM(lat: number, lng: number): UTMCoordinate {
  const zone = Math.floor((lng + 180) / 6) + 1;
  const hemisphere = lat >= 0 ? 'N' : 'S';

  const a = 6378137.0; // WGS84 equatorial radius
  const f = 1 / 298.257223563;
  const e2 = 2 * f - f * f;
  const k0 = 0.9996;

  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  const centralLng = ((zone - 1) * 6 - 180 + 3) * (Math.PI / 180);

  const N = a / Math.sqrt(1 - e2 * Math.sin(latRad) * Math.sin(latRad));
  const T = Math.tan(latRad) * Math.tan(latRad);
  const C = (e2 / (1 - e2)) * Math.cos(latRad) * Math.cos(latRad);
  const A = Math.cos(latRad) * (lngRad - centralLng);

  const M =
    a *
    ((1 - e2 / 4 - (3 * e2 * e2) / 64 - (5 * e2 * e2 * e2) / 256) * latRad -
      ((3 * e2) / 8 + (3 * e2 * e2) / 32 + (45 * e2 * e2 * e2) / 1024) * Math.sin(2 * latRad) +
      ((15 * e2 * e2) / 256 + (45 * e2 * e2 * e2) / 1024) * Math.sin(4 * latRad) -
      ((35 * e2 * e2 * e2) / 3072) * Math.sin(6 * latRad));

  const easting =
    k0 *
      N *
      (A +
        ((1 - T + C) * Math.pow(A, 3)) / 6 +
        ((5 - 18 * T + T * T + 72 * C - 58 * (e2 / (1 - e2))) * Math.pow(A, 5)) / 120) +
    500000;

  let northing =
    k0 *
    (M +
      N *
        Math.tan(latRad) *
        ((A * A) / 2 +
          ((5 - T + 9 * C + 4 * C * C) * Math.pow(A, 4)) / 24 +
          ((61 - 58 * T + T * T + 600 * C - 330 * (e2 / (1 - e2))) * Math.pow(A, 6)) / 720));

  if (lat < 0) {
    northing += 10000000; // False northing for southern hemisphere
  }

  const roundedE = Math.round(easting);
  const roundedN = Math.round(northing);

  return {
    zone,
    hemisphere,
    easting: roundedE,
    northing: roundedN,
    formatted: `${zone}${hemisphere} ${roundedE}E ${roundedN}N`,
  };
}

/**
 * UTM to MGRS representation string
 */
export function utmToMGRS(utm: UTMCoordinate): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const colLetter = letters[Math.floor(utm.easting / 100000) % letters.length];
  const rowLetter = letters[Math.floor(utm.northing / 100000) % letters.length];
  const e100k = String(Math.floor(utm.easting % 100000)).padStart(5, '0');
  const n100k = String(Math.floor(utm.northing % 100000)).padStart(5, '0');
  return `${utm.zone}${utm.hemisphere} ${colLetter}${rowLetter} ${e100k.slice(0, 4)} ${n100k.slice(0, 4)}`;
}

/**
 * Traverse closure error and precision calculation
 */
export interface TraverseLeg {
  bearingDeg: number;
  distance: number;
}

export interface ClosureErrorResult {
  totalDistance: number;
  sumNorthing: number; // sum(dY)
  sumEasting: number;  // sum(dX)
  linearClosureError: number;
  relativePrecision: string;
  fractionPrecision: number;
  bearingErrorDeg: number;
}

export function calculateTraverseClosure(legs: TraverseLeg[]): ClosureErrorResult {
  let totalDist = 0;
  let sumN = 0;
  let sumE = 0;

  for (const leg of legs) {
    const rad = (leg.bearingDeg * Math.PI) / 180;
    const dN = leg.distance * Math.cos(rad);
    const dE = leg.distance * Math.sin(rad);
    sumN += dN;
    sumE += dE;
    totalDist += leg.distance;
  }

  const closureErr = Math.sqrt(sumN * sumN + sumE * sumE);
  const precisionRatio = closureErr > 0.00001 ? Math.round(totalDist / closureErr) : 999999;
  const bearingErr = (Math.atan2(sumE, sumN) * 180) / Math.PI;

  return {
    totalDistance: totalDist,
    sumNorthing: parseFloat(sumN.toFixed(4)),
    sumEasting: parseFloat(sumE.toFixed(4)),
    linearClosureError: parseFloat(closureErr.toFixed(4)),
    relativePrecision: `1 : ${precisionRatio.toLocaleString()}`,
    fractionPrecision: precisionRatio,
    bearingErrorDeg: (bearingErr + 360) % 360,
  };
}

/**
 * Earthwork cut/fill volume calculation (Average End Area & Grid)
 */
export interface EarthworkResult {
  cutVolumeCuM: number;
  fillVolumeCuM: number;
  netVolumeCuM: number;
  cutVolumeCuYd: number;
  fillVolumeCuYd: number;
  netVolumeCuYd: number;
}

export function calculateEndAreaVolume(
  area1: number,
  area2: number,
  stationDistance: number
): number {
  return ((area1 + area2) / 2) * stationDistance;
}

export function calculateGridEarthwork(
  existingGrid: number[][],
  proposedGrid: number[][],
  cellSizeM: number
): EarthworkResult {
  let cutVol = 0;
  let fillVol = 0;
  const cellArea = cellSizeM * cellSizeM;

  for (let r = 0; r < existingGrid.length; r++) {
    for (let c = 0; c < (existingGrid[r]?.length || 0); c++) {
      const exist = existingGrid[r][c];
      const prop = proposedGrid[r]?.[c] ?? exist;
      const diff = prop - exist; // > 0 means fill, < 0 means cut
      if (diff > 0) {
        fillVol += diff * cellArea;
      } else if (diff < 0) {
        cutVol += Math.abs(diff) * cellArea;
      }
    }
  }

  const cuMToCuYd = 1.30795;

  return {
    cutVolumeCuM: parseFloat(cutVol.toFixed(2)),
    fillVolumeCuM: parseFloat(fillVol.toFixed(2)),
    netVolumeCuM: parseFloat((fillVol - cutVol).toFixed(2)),
    cutVolumeCuYd: parseFloat((cutVol * cuMToCuYd).toFixed(2)),
    fillVolumeCuYd: parseFloat((fillVol * cuMToCuYd).toFixed(2)),
    netVolumeCuYd: parseFloat(((fillVol - cutVol) * cuMToCuYd).toFixed(2)),
  };
}

/**
 * Stakeout calculation: Bearing, distance, and relative offsets
 */
export interface StakeoutGuide {
  distanceMeters: number;
  azimuthDeg: number;
  deltaEastingMeters: number;
  deltaNorthingMeters: number;
  cardinalDirection: string;
}

export function calculateStakeout(current: GeoPoint, target: GeoPoint): StakeoutGuide {
  const dist = haversineDistanceMeters(current, target);
  
  const y = Math.sin(((target.lng - current.lng) * Math.PI) / 180) * Math.cos((target.lat * Math.PI) / 180);
  const x =
    Math.cos((current.lat * Math.PI) / 180) * Math.sin((target.lat * Math.PI) / 180) -
    Math.sin((current.lat * Math.PI) / 180) *
      Math.cos((target.lat * Math.PI) / 180) *
      Math.cos(((target.lng - current.lng) * Math.PI) / 180);
  let az = (Math.atan2(y, x) * 180) / Math.PI;
  az = (az + 360) % 360;

  // Approximate metric delta
  const dLatM = (target.lat - current.lat) * 111139;
  const dLngM = (target.lng - current.lng) * 111139 * Math.cos((current.lat * Math.PI) / 180);

  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const dirIdx = Math.round(az / 45) % 8;

  return {
    distanceMeters: parseFloat(dist.toFixed(3)),
    azimuthDeg: parseFloat(az.toFixed(1)),
    deltaEastingMeters: parseFloat(dLngM.toFixed(3)),
    deltaNorthingMeters: parseFloat(dLatM.toFixed(3)),
    cardinalDirection: directions[dirIdx],
  };
}

/**
 * Export helpers: Generate DXF, KML, and GeoJSON strings
 */
export function generateDXF(points: Point2D[], polygonName = 'SURVEY_PLOT'): string {
  let entities = '';
  // Polyline
  entities += '0\nPOLYLINE\n8\nBOUNDARY\n66\n1\n70\n1\n';
  points.forEach((p) => {
    entities += `0\nVERTEX\n8\nBOUNDARY\n10\n${p.x.toFixed(4)}\n20\n${p.y.toFixed(4)}\n30\n0.0\n`;
  });
  entities += '0\nSEQEND\n';

  // Text labels for vertices
  points.forEach((p, idx) => {
    entities += `0\nTEXT\n8\nLABELS\n10\n${(p.x + 0.5).toFixed(4)}\n20\n${(p.y + 0.5).toFixed(4)}\n30\n0.0\n40\n0.8\n1\nP${idx + 1}\n`;
  });

  return `0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nSECTION\n2\nTABLES\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n${entities}0\nENDSEC\n0\nEOF\n`;
}

export function generateKML(coords: GeoPoint[], name = 'Land Survey Pro Polygon'): string {
  if (coords.length === 0) return '';
  const closedCoords = [...coords];
  if (coords.length > 2) {
    closedCoords.push(coords[0]);
  }
  const coordString = closedCoords.map((c) => `${c.lng.toFixed(7)},${c.lat.toFixed(7)},0`).join(' ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${name}</name>
    <Style id="polyStyle">
      <LineStyle>
        <color>ff00aaff</color>
        <width>3</width>
      </LineStyle>
      <PolyStyle>
        <color>4d00ffff</color>
      </PolyStyle>
    </Style>
    <Placemark>
      <name>${name}</name>
      <styleUrl>#polyStyle</styleUrl>
      <Polygon>
        <extrude>1</extrude>
        <altitudeMode>relativeToGround</altitudeMode>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>${coordString}</coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>
  </Document>
</kml>`;
}

export function generateGeoJSON(coords: GeoPoint[], properties: Record<string, any> = {}): string {
  if (coords.length < 3) {
    return JSON.stringify(
      {
        type: 'FeatureCollection',
        features: coords.map((c, i) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [c.lng, c.lat] },
          properties: { index: i + 1 },
        })),
      },
      null,
      2
    );
  }

  const ring = coords.map((c) => [c.lng, c.lat]);
  ring.push([coords[0].lng, coords[0].lat]);

  return JSON.stringify(
    {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            name: 'Survey Parcel Boundary',
            generatedBy: 'Land Survey Pro',
            ...properties,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [ring],
          },
        },
      ],
    },
    null,
    2
  );
}
