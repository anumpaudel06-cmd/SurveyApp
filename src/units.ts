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
  if (a + b <= c || a + c <= b || b + c <= a) return 0;
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
 * Circle area
 */
export function circleArea(radius: number): number {
  return Math.PI * Math.max(0, radius) * Math.max(0, radius);
}

/**
 * Semi-circle area
 */
export function semiCircleArea(radius: number): number {
  return 0.5 * Math.PI * Math.max(0, radius) * Math.max(0, radius);
}

/**
 * Deduct building footprint from gross area
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
 * Shoelace formula for polygon area
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

export function haversineDistanceMeters(p1: GeoPoint, p2: GeoPoint): number {
  const R = 6371000;
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

export function geodesicPolygonAreaSqM(coords: GeoPoint[]): number {
  if (coords.length < 3) return 0;
  const R = 6378137;
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

  return (Math.abs(area) * R * R) / 4.0;
}

// ----------------- LENGTH & AREA CONVERTERS -----------------

export type LengthUnit = 'feet' | 'meters' | 'inches' | 'yards' | 'hath' | 'gaj' | 'chains' | 'links';

export const LENGTH_TO_METERS: Record<LengthUnit, number> = {
  meters: 1,
  feet: 0.3048,
  inches: 0.0254,
  yards: 0.9144,
  hath: 0.4572, // 1 Hath = 1.5 ft = 0.4572 m
  gaj: 0.9144,  // 1 Gaj = 3 ft = 0.9144 m
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

// ----------------- ADVANCED TRAVERSE COMPUTATION -----------------

export interface TraverseLeg {
  bearingDeg: number;
  distance: number;
}

export function calculateTraverseClosure(legs: TraverseLeg[]) {
  const inputs: TraverseStationInput[] = legs.map((l, i) => ({
    id: `S${i + 1}`,
    bearingDeg: l.bearingDeg,
    distance: l.distance,
  }));
  const res = calculateFullTraverse(inputs);
  return {
    totalDistance: res.totalDistance,
    sumNorthing: res.sumLat,
    sumEasting: res.sumDep,
    linearClosureError: res.linearMisclosure,
    relativePrecision: res.relativePrecision,
    fractionPrecision: res.fractionPrecision,
    bearingErrorDeg: res.misclosureBearingDeg,
  };
}

export interface TraverseStationInput {
  id: string; // e.g. "1", "A"
  bearingDeg: number; // Azimuth (0-360)
  distance: number; // Distance in meters
}

export interface TraverseComputedStation {
  fromId: string;
  toId: string;
  bearingDeg: number;
  distance: number;
  rawLat: number; // dN = Distance * cos(Bearing)
  rawDep: number; // dE = Distance * sin(Bearing)
  corrLat: number; // Correction applied to Latitude
  corrDep: number; // Correction applied to Departure
  adjLat: number; // Adjusted Latitude
  adjDep: number; // Adjusted Departure
  easting: number; // Cumulative Easting
  northing: number; // Cumulative Northing
}

export type TraverseAdjustmentRule = 'bowditch' | 'transit';
export type SurveyClass = 'class1' | 'class2' | 'class3' | 'class4';

export interface TraverseFullResult {
  stations: TraverseComputedStation[];
  startEasting: number;
  startNorthing: number;
  totalDistance: number;
  sumLat: number;
  sumDep: number;
  linearMisclosure: number;
  relativePrecision: string;
  fractionPrecision: number;
  misclosureBearingDeg: number;
  adjustmentRule: TraverseAdjustmentRule;
  recommendedRule: TraverseAdjustmentRule;
  ruleExplanation: string;
  surveyClass: SurveyClass;
  permissibleRatio: number;
  isPermissible: boolean;
  permissibleLimitStr: string;
}

export const SURVEY_CLASS_SPECS: Record<SurveyClass, { name: string; ratio: number; description: string }> = {
  class1: { name: 'Class 1 (Control Survey)', ratio: 10000, description: '1:10,000 - Higher precision cadastral control' },
  class2: { name: 'Class 2 (Urban Cadastral)', ratio: 5000, description: '1:5,000 - Standard urban plot boundary' },
  class3: { name: 'Class 3 (Rural Cadastral)', ratio: 3000, description: '1:3,000 - Rural agricultural parcels' },
  class4: { name: 'Class 4 (Reconnaissance / Rough)', ratio: 1500, description: '1:1,500 - Preliminary site reconnaissance' },
};

export function calculateFullTraverse(
  inputs: TraverseStationInput[],
  startE = 500000,
  startN = 3000000,
  rule: TraverseAdjustmentRule = 'bowditch',
  surveyClass: SurveyClass = 'class2'
): TraverseFullResult {
  if (inputs.length === 0) {
    return {
      stations: [],
      startEasting: startE,
      startNorthing: startN,
      totalDistance: 0,
      sumLat: 0,
      sumDep: 0,
      linearMisclosure: 0,
      relativePrecision: '1 : ∞',
      fractionPrecision: 999999,
      misclosureBearingDeg: 0,
      adjustmentRule: rule,
      recommendedRule: 'bowditch',
      ruleExplanation: 'Bowditch (Compass) rule balances both angles and distances equally.',
      surveyClass,
      permissibleRatio: 5000,
      isPermissible: true,
      permissibleLimitStr: '1 : 5,000',
    };
  }

  let totalDist = 0;
  let sumLat = 0;
  let sumDep = 0;
  let absSumLat = 0;
  let absSumDep = 0;

  // 1. Calculate raw Latitudes & Departures
  const rawData = inputs.map((stn, idx) => {
    const nextStn = inputs[(idx + 1) % inputs.length];
    const rad = (stn.bearingDeg * Math.PI) / 180;
    const lat = stn.distance * Math.cos(rad);
    const dep = stn.distance * Math.sin(rad);

    totalDist += stn.distance;
    sumLat += lat;
    sumDep += dep;
    absSumLat += Math.abs(lat);
    absSumDep += Math.abs(dep);

    return {
      fromId: stn.id,
      toId: nextStn.id,
      bearingDeg: stn.bearingDeg,
      distance: stn.distance,
      rawLat: lat,
      rawDep: dep,
    };
  });

  // Linear closure error
  const linearMisclosure = Math.sqrt(sumLat * sumLat + sumDep * sumDep);
  const fractionPrecision = linearMisclosure > 0.0001 ? Math.round(totalDist / linearMisclosure) : 999999;
  const misclosureBearingDeg = (Math.atan2(-sumDep, -sumLat) * (180 / Math.PI) + 360) % 360;

  // Permissible check
  const permissibleSpec = SURVEY_CLASS_SPECS[surveyClass];
  const isPermissible = fractionPrecision >= permissibleSpec.ratio;

  // Recommendation: Bowditch is best for total station / modern electronic surveying where distance & angle precision are balanced.
  // Transit rule is used when angular measurements are substantially more precise than taped distances.
  const recommendedRule: TraverseAdjustmentRule = 'bowditch';
  const ruleExplanation =
    rule === 'bowditch'
      ? 'Bowditch Rule (Compass Rule) selected: Distributes error proportionally to leg lengths. Recommended for Total Station & electronic EDM surveys where angular and distance errors are equally likely.'
      : 'Transit Rule selected: Distributes error proportionally to the latitude and departure magnitudes without changing angles excessively. Recommended when angular measurements are significantly more precise than linear distance taping.';

  // 2. Adjust using selected rule
  let currentE = startE;
  let currentN = startN;

  const stations: TraverseComputedStation[] = rawData.map((d) => {
    let corrLat = 0;
    let corrDep = 0;

    if (rule === 'bowditch') {
      // Correction = - (Total Error) * (Leg Distance / Total Distance)
      corrLat = totalDist > 0 ? -sumLat * (d.distance / totalDist) : 0;
      corrDep = totalDist > 0 ? -sumDep * (d.distance / totalDist) : 0;
    } else {
      // Transit Rule: Correction = - (Total Error) * (|Lat| / Sum |Lat|)
      corrLat = absSumLat > 0 ? -sumLat * (Math.abs(d.rawLat) / absSumLat) : 0;
      corrDep = absSumDep > 0 ? -sumDep * (Math.abs(d.rawDep) / absSumDep) : 0;
    }

    const adjLat = d.rawLat + corrLat;
    const adjDep = d.rawDep + corrDep;

    currentN += adjLat;
    currentE += adjDep;

    return {
      fromId: d.fromId,
      toId: d.toId,
      bearingDeg: d.bearingDeg,
      distance: d.distance,
      rawLat: parseFloat(d.rawLat.toFixed(4)),
      rawDep: parseFloat(d.rawDep.toFixed(4)),
      corrLat: parseFloat(corrLat.toFixed(4)),
      corrDep: parseFloat(corrDep.toFixed(4)),
      adjLat: parseFloat(adjLat.toFixed(4)),
      adjDep: parseFloat(adjDep.toFixed(4)),
      easting: parseFloat(currentE.toFixed(3)),
      northing: parseFloat(currentN.toFixed(3)),
    };
  });

  return {
    stations,
    startEasting: startE,
    startNorthing: startN,
    totalDistance: parseFloat(totalDist.toFixed(3)),
    sumLat: parseFloat(sumLat.toFixed(4)),
    sumDep: parseFloat(sumDep.toFixed(4)),
    linearMisclosure: parseFloat(linearMisclosure.toFixed(4)),
    relativePrecision: `1 : ${fractionPrecision.toLocaleString()}`,
    fractionPrecision,
    misclosureBearingDeg: parseFloat(misclosureBearingDeg.toFixed(1)),
    adjustmentRule: rule,
    recommendedRule,
    ruleExplanation,
    surveyClass,
    permissibleRatio: permissibleSpec.ratio,
    isPermissible,
    permissibleLimitStr: `1 : ${permissibleSpec.ratio.toLocaleString()}`,
  };
}

/**
 * Standard File Format Exporter: CSV format (Excel & GIS compatible)
 */
export function generateTraverseCSV(result: TraverseFullResult): string {
  let csv = 'Station_From,Station_To,Bearing_Deg,Distance_m,Raw_dN_m,Raw_dE_m,Corr_dN_m,Corr_dE_m,Adj_dN_m,Adj_dE_m,Easting_m,Northing_m\n';

  result.stations.forEach((stn) => {
    csv += `${stn.fromId},${stn.toId},${stn.bearingDeg},${stn.distance},${stn.rawLat},${stn.rawDep},${stn.corrLat},${stn.corrDep},${stn.adjLat},${stn.adjDep},${stn.easting},${stn.northing}\n`;
  });

  csv += `\n# TRAVERSE SUMMARY\n`;
  csv += `# Total Perimeter (m),${result.totalDistance}\n`;
  csv += `# Linear Misclosure (m),${result.linearMisclosure}\n`;
  csv += `# Relative Precision,${result.relativePrecision}\n`;
  csv += `# Permissible Standard,${result.permissibleLimitStr}\n`;
  csv += `# Status,${result.isPermissible ? 'PASSED' : 'EXCEEDED'}\n`;
  csv += `# Adjustment Rule Applied,${result.adjustmentRule.toUpperCase()}\n`;

  return csv;
}

/**
 * Standard File Format Exporter: Field Book Text Report
 */
export function generateTraverseReportTXT(result: TraverseFullResult): string {
  let txt = `========================================================================\n`;
  txt += `                 LAND SURVEY PRO - TRAVERSE COMPUTATION REPORT          \n`;
  txt += `========================================================================\n\n`;
  txt += `Adjustment Method : ${result.adjustmentRule.toUpperCase()} RULE\n`;
  txt += `Survey Standard   : ${SURVEY_CLASS_SPECS[result.surveyClass].name} (${result.permissibleLimitStr})\n`;
  txt += `Initial Origin    : Easting = ${result.startEasting.toFixed(3)} m | Northing = ${result.startNorthing.toFixed(3)} m\n`;
  txt += `Total Perimeter   : ${result.totalDistance.toFixed(3)} m\n`;
  txt += `Sum Latitudes (dN): ${result.sumLat.toFixed(4)} m\n`;
  txt += `Sum Departures(dE): ${result.sumDep.toFixed(4)} m\n`;
  txt += `Linear Misclosure : ${result.linearMisclosure.toFixed(4)} m\n`;
  txt += `Relative Precision: ${result.relativePrecision}\n`;
  txt += `Verification      : ${result.isPermissible ? 'PASSED (Acceptable)' : 'FAILED (Exceeds Permissible Limit)'}\n\n`;
  txt += `------------------------------------------------------------------------\n`;
  txt += `Leg        Azimuth   Dist(m)   Raw dN    Raw dE    Adj dN    Adj dE    Easting     Northing\n`;
  txt += `------------------------------------------------------------------------\n`;

  result.stations.forEach((s) => {
    const leg = `${s.fromId}->${s.toId}`.padEnd(10);
    const az = `${s.bearingDeg.toFixed(1)}°`.padStart(7);
    const dist = `${s.distance.toFixed(2)}`.padStart(8);
    const rdN = `${s.rawLat.toFixed(3)}`.padStart(9);
    const rdE = `${s.rawDep.toFixed(3)}`.padStart(9);
    const adN = `${s.adjLat.toFixed(3)}`.padStart(9);
    const adE = `${s.adjDep.toFixed(3)}`.padStart(9);
    const E = `${s.easting.toFixed(3)}`.padStart(11);
    const N = `${s.northing.toFixed(3)}`.padStart(12);

    txt += `${leg} ${az} ${dist} ${rdN} ${rdE} ${adN} ${adE} ${E} ${N}\n`;
  });

  txt += `------------------------------------------------------------------------\n`;
  return txt;
}

// ----------------- GEODETIC / PROJECTIONS -----------------

export function degToDms(deg: number, isLat: boolean): string {
  const dir = isLat ? (deg >= 0 ? 'N' : 'S') : deg >= 0 ? 'E' : 'W';
  const abs = Math.abs(deg);
  const d = Math.floor(abs);
  const minFloat = (abs - d) * 60;
  const m = Math.floor(minFloat);
  const s = ((minFloat - m) * 60).toFixed(2);
  return `${d}° ${m}' ${s}" ${dir}`;
}

export interface UTMCoordinate {
  zone: number;
  hemisphere: 'N' | 'S';
  easting: number;
  northing: number;
  formatted: string;
}

export function latLngToUTM(lat: number, lng: number): UTMCoordinate {
  const zone = Math.floor((lng + 180) / 6) + 1;
  const hemisphere = lat >= 0 ? 'N' : 'S';

  const a = 6378137.0;
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
    northing += 10000000;
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

export function utmToMGRS(utm: UTMCoordinate): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const colLetter = letters[Math.floor(utm.easting / 100000) % letters.length];
  const rowLetter = letters[Math.floor(utm.northing / 100000) % letters.length];
  const e100k = String(Math.floor(utm.easting % 100000)).padStart(5, '0');
  const n100k = String(Math.floor(utm.northing % 100000)).padStart(5, '0');
  return `${utm.zone}${utm.hemisphere} ${colLetter}${rowLetter} ${e100k.slice(0, 4)} ${n100k.slice(0, 4)}`;
}

export function calculateStakeout(current: GeoPoint, target: GeoPoint) {
  const dist = haversineDistanceMeters(current, target);
  const y = Math.sin(((target.lng - current.lng) * Math.PI) / 180) * Math.cos((target.lat * Math.PI) / 180);
  const x =
    Math.cos((current.lat * Math.PI) / 180) * Math.sin((target.lat * Math.PI) / 180) -
    Math.sin((current.lat * Math.PI) / 180) *
      Math.cos((target.lat * Math.PI) / 180) *
      Math.cos(((target.lng - current.lng) * Math.PI) / 180);
  let az = (Math.atan2(y, x) * 180) / Math.PI;
  az = (az + 360) % 360;

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

export function calculateEndAreaVolume(area1: number, area2: number, stationDistance: number): number {
  return ((area1 + area2) / 2) * stationDistance;
}

export function calculateGridEarthwork(existingGrid: number[][], proposedGrid: number[][], cellSizeM: number) {
  let cutVol = 0;
  let fillVol = 0;
  const cellArea = cellSizeM * cellSizeM;

  for (let r = 0; r < existingGrid.length; r++) {
    for (let c = 0; c < (existingGrid[r]?.length || 0); c++) {
      const exist = existingGrid[r][c];
      const prop = proposedGrid[r]?.[c] ?? exist;
      const diff = prop - exist;
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

export function generateDXF(points: Point2D[], polygonName = 'SURVEY_PLOT'): string {
  let entities = '0\nPOLYLINE\n8\nBOUNDARY\n66\n1\n70\n1\n';
  points.forEach((p) => {
    entities += `0\nVERTEX\n8\nBOUNDARY\n10\n${p.x.toFixed(4)}\n20\n${p.y.toFixed(4)}\n30\n0.0\n`;
  });
  entities += '0\nSEQEND\n';

  points.forEach((p, idx) => {
    entities += `0\nTEXT\n8\nLABELS\n10\n${(p.x + 0.5).toFixed(4)}\n20\n${(p.y + 0.5).toFixed(4)}\n30\n0.0\n40\n0.8\n1\nP${idx + 1}\n`;
  });

  return `0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nSECTION\n2\nTABLES\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n${entities}0\nENDSEC\n0\nEOF\n`;
}

export function generateKML(coords: GeoPoint[], name = 'Land Survey Pro Polygon'): string {
  if (coords.length === 0) return '';
  const closedCoords = [...coords];
  if (coords.length > 2) closedCoords.push(coords[0]);
  const coordString = closedCoords.map((c) => `${c.lng.toFixed(7)},${c.lat.toFixed(7)},0`).join(' ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${name}</name>
    <Placemark>
      <name>${name}</name>
      <Polygon>
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
    return JSON.stringify({ type: 'FeatureCollection', features: [] }, null, 2);
  }
  const ring = coords.map((c) => [c.lng, c.lat]);
  ring.push([coords[0].lng, coords[0].lat]);

  return JSON.stringify(
    {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { name: 'Survey Boundary', ...properties },
          geometry: { type: 'Polygon', coordinates: [ring] },
        },
      ],
    },
    null,
    2
  );
}
