import { CorridorOption } from '../types';

// =============================================================================
// SHARED WHAT-IF SIMULATOR DATA SOURCE (SINGLE SOURCE OF TRUTH)
// =============================================================================
// Authoritative dataset consumed concurrently by:
// 1. What-If Simulator Page (src/components/simulator/WhatIfSimulator.tsx)
// 2. Project Workspace What-If Section (src/components/projects/workspace/ProjectWhatIfSection.tsx)
// 3. GIS Map Viewport & Overlay (src/components/gis/GisMapView.tsx)
// =============================================================================

export interface WhatIfMetrics {
  feasibilityScore: number;
  totalCostCr: number;
  affectedFamiliesCount: number;
  highRiskParcelsCount: number;
  injunctionSuitsCount: number;
  predictedDelayMonths: number;
  totalLengthKm: number;
  affectedParcelsCount: number;
}

export interface WhatIfCorridorOption extends CorridorOption {
  shortName: string;
  routeLabel: string;
  injunctionSuitsCount: number;
  strokeColor: string;
  casingColor: string;
  affectedParcelIds: string[];
  geometry: GeoJSON.LineString;
  metrics: WhatIfMetrics;
}

// =============================================================================
// MATHEMATICAL BEZIER PROJECTION (SVG Coordinate Space -> WGS84 Geographic Space)
// =============================================================================
// Calibrated to align with parcel cadastre over the Varanasi project corridor.
const PROJECTION_CENTER_LNG = 82.9412;
const PROJECTION_CENTER_LAT = 25.3418;
const SVG_CENTER_X = 400;
const SVG_CENTER_Y = 240;
const SCALE_LNG = 0.00015;
const SCALE_LAT = 0.00014;

export function projectPointToGeo(x: number, y: number): [number, number] {
  const lng = +(PROJECTION_CENTER_LNG + (x - SVG_CENTER_X) * SCALE_LNG).toFixed(6);
  const lat = +(PROJECTION_CENTER_LAT - (y - SVG_CENTER_Y) * SCALE_LAT).toFixed(6);
  return [lng, lat];
}

/**
 * Samples points along a quadratic bezier curve B(t) = (1-t)^2 P0 + 2(1-t)t C + t^2 P1
 */
function sampleQuadraticBezier(
  p0: [number, number],
  c: [number, number],
  p1: [number, number],
  steps: number
): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const invT = 1 - t;
    const x = invT * invT * p0[0] + 2 * invT * t * c[0] + t * t * p1[0];
    const y = invT * invT * p0[1] + 2 * invT * t * c[1] + t * t * p1[1];
    points.push([x, y]);
  }
  return points;
}

/**
 * Generates georeferenced WGS84 LineString coordinates for Option A corridor
 * from trajectory: 'M 60 180 Q 220 140, 380 160 T 680 180'.
 * Bisects the Rampur orchard dispute cluster and 18 critical dispute parcels.
 */
export function getOptionAGeometry(): GeoJSON.LineString {
  const seg1 = sampleQuadraticBezier([60, 180], [220, 140], [380, 160], 30);
  const seg2 = sampleQuadraticBezier([380, 160], [540, 180], [680, 180], 30);
  const combined2D = [...seg1, ...seg2.slice(1)];
  const geoCoordinates = combined2D.map(([x, y]) => projectPointToGeo(x, y));

  return {
    type: 'LineString',
    coordinates: geoCoordinates,
  };
}

/**
 * Generates georeferenced WGS84 LineString coordinates for Option B corridor
 * from trajectory: 'M 60 210 Q 230 260, 420 230 T 680 200'.
 * Shifts 820m south onto low-density uncultivated land, bypassing the 18 dispute parcels.
 */
export function getOptionBGeometry(): GeoJSON.LineString {
  const seg1 = sampleQuadraticBezier([60, 210], [230, 260], [420, 230], 30);
  const seg2 = sampleQuadraticBezier([420, 230], [610, 200], [680, 200], 30);
  const combined2D = [...seg1, ...seg2.slice(1)];
  const geoCoordinates = combined2D.map(([x, y]) => projectPointToGeo(x, y));

  return {
    type: 'LineString',
    coordinates: geoCoordinates,
  };
}

// 18 Critical Dispute Parcels intersected by Option A (Original Northern Route)
export const OPTION_A_AFFECTED_PARCEL_IDS: string[] = [
  'PARCEL-001', // Rampur orchard litigation dispute (Lead case)
  'PARCEL-008', // Harahua wetland & forest buffer zone
  'PARCEL-009', 'PARCEL-013', 'PARCEL-016', 'PARCEL-020',
  'PARCEL-023', 'PARCEL-027', 'PARCEL-030', 'PARCEL-034',
  'PARCEL-037', 'PARCEL-041', 'PARCEL-044', 'PARCEL-048',
  'PARCEL-051', 'PARCEL-055', 'PARCEL-058', 'PARCEL-062',
];

// 4 Parcels intersected by Option B (Southern Bypass - avoids all residential & orchard disputes)
export const OPTION_B_AFFECTED_PARCEL_IDS: string[] = [
  'PARCEL-009', 'PARCEL-013', 'PARCEL-016', 'PARCEL-020',
];

// =============================================================================
// CANONICAL WHAT-IF SIMULATOR OPTIONS
// =============================================================================

export const WHAT_IF_OPTIONS: {
  optionA: WhatIfCorridorOption;
  optionB: WhatIfCorridorOption;
} = {
  optionA: {
    id: 'option-a',
    name: 'Corridor Option A (Original Northern Alignment)',
    shortName: 'Option A',
    routeLabel: 'Original Northern Route',
    tagline: 'Planned under 2024 preliminary DPR; directly bisects Rampur agricultural core.',
    alignmentDescription: 'Passes directly through Rampur orchard belts, 4 dense habitation settlements, and 1 seasonal wetland drainage.',
    totalLengthKm: 28.4,
    affectedParcelsCount: 148,
    affectedFamiliesCount: 412,
    totalCostCr: 84.2,
    highRiskParcelsCount: 18,
    injunctionSuitsCount: 9,
    rrDisplacementRisk: 'High',
    legalInjunctionRisk: 'High',
    environmentalRisk: 'Moderate',
    predictedDelayMonths: 5.5,
    feasibilityScore: 68,
    color: '#EF4444',
    strokeColor: '#F87171',
    casingColor: '#EF4444',
    pathCoordinates: 'M 60 180 Q 220 140, 380 160 T 680 180',
    affectedParcelIds: OPTION_A_AFFECTED_PARCEL_IDS,
    geometry: getOptionAGeometry(),
    metrics: {
      feasibilityScore: 68,
      totalCostCr: 84.2,
      affectedFamiliesCount: 412,
      highRiskParcelsCount: 18,
      injunctionSuitsCount: 9,
      predictedDelayMonths: 5.5,
      totalLengthKm: 28.4,
      affectedParcelsCount: 148,
    },
  },

  optionB: {
    id: 'option-b',
    name: 'Corridor Option B (AI-Optimized Southern Bypass)',
    shortName: 'Option B (Optimized)',
    routeLabel: 'AI Southern Bypass',
    tagline: 'Recommended: Curvature shifted 820m south onto low-density uncultivated barren parcels.',
    alignmentDescription: 'Circumvents Rampur orchard cluster, minimizes residential homestead acquisition, avoids wetland buffer, and aligns with vacant revenue land.',
    totalLengthKm: 29.1,
    affectedParcelsCount: 116,
    affectedFamiliesCount: 338,
    totalCostCr: 71.5,
    highRiskParcelsCount: 4,
    injunctionSuitsCount: 1,
    rrDisplacementRisk: 'Low',
    legalInjunctionRisk: 'Low',
    environmentalRisk: 'Low',
    predictedDelayMonths: 1.2,
    feasibilityScore: 89,
    color: '#10B981',
    strokeColor: '#10B981',
    casingColor: '#10B981',
    pathCoordinates: 'M 60 210 Q 230 260, 420 230 T 680 200',
    affectedParcelIds: OPTION_B_AFFECTED_PARCEL_IDS,
    geometry: getOptionBGeometry(),
    metrics: {
      feasibilityScore: 89,
      totalCostCr: 71.5,
      affectedFamiliesCount: 338,
      highRiskParcelsCount: 4,
      injunctionSuitsCount: 1,
      predictedDelayMonths: 1.2,
      totalLengthKm: 29.1,
      affectedParcelsCount: 116,
    },
  },
};

// Authoritative array for backward compatibility across simulator & project views
export const SIMULATOR_CORRIDORS: WhatIfCorridorOption[] = [
  WHAT_IF_OPTIONS.optionA,
  WHAT_IF_OPTIONS.optionB,
];

// High-level executive decision summary
export const WHAT_IF_COMPARISON_SUMMARY = {
  recommendedOptionId: 'option-b' as const,
  recommendedOptionName: WHAT_IF_OPTIONS.optionB.name,
  feasibilityScore: WHAT_IF_OPTIONS.optionB.feasibilityScore,
  costSavingsCr: +(WHAT_IF_OPTIONS.optionA.totalCostCr - WHAT_IF_OPTIONS.optionB.totalCostCr).toFixed(1), // 12.7 Cr
  costSavingsPercent: -15.1,
  familiesDisplacedAvoided: WHAT_IF_OPTIONS.optionA.affectedFamiliesCount - WHAT_IF_OPTIONS.optionB.affectedFamiliesCount, // 74 families
  familiesDisplacedReductionPercent: -18.0,
  highRiskParcelsAvoided: WHAT_IF_OPTIONS.optionA.highRiskParcelsCount - WHAT_IF_OPTIONS.optionB.highRiskParcelsCount, // 14 parcels
  highRiskReductionPercent: -77.7,
  delayAvoidedMonths: +(WHAT_IF_OPTIONS.optionA.predictedDelayMonths - WHAT_IF_OPTIONS.optionB.predictedDelayMonths).toFixed(1), // 4.3 Mo
  delayOptionAMonths: WHAT_IF_OPTIONS.optionA.predictedDelayMonths,
  delayOptionBMonths: WHAT_IF_OPTIONS.optionB.predictedDelayMonths,
};

// =============================================================================
// GEOJSON EXPORT UTILITIES (Ready for MapLibre Layer Sources)
// =============================================================================

export function getWhatIfCorridorsGeoJSON(): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        id: 'option-a',
        properties: {
          id: 'option-a',
          name: WHAT_IF_OPTIONS.optionA.name,
          color: WHAT_IF_OPTIONS.optionA.color,
          feasibilityScore: WHAT_IF_OPTIONS.optionA.metrics.feasibilityScore,
        },
        geometry: WHAT_IF_OPTIONS.optionA.geometry,
      },
      {
        type: 'Feature',
        id: 'option-b',
        properties: {
          id: 'option-b',
          name: WHAT_IF_OPTIONS.optionB.name,
          color: WHAT_IF_OPTIONS.optionB.color,
          feasibilityScore: WHAT_IF_OPTIONS.optionB.metrics.feasibilityScore,
        },
        geometry: WHAT_IF_OPTIONS.optionB.geometry,
      },
    ],
  };
}

export function getWhatIfImpactZonesGeoJSON(): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: [],
  };
}
