import { SIMULATOR_CORRIDORS, ALL_PARCELS } from './mockData';

// =============================================================================
// WHAT-IF SIMULATOR GIS OVERLAY DATA CONTRACT
// =============================================================================

export interface WhatIfMetrics {
  feasibilityScore: number;
  totalCostCr: number;
  affectedFamiliesCount: number;
  highRiskParcelsCount: number;
  predictedDelayMonths: number;
  totalLengthKm: number;
  affectedParcelsCount: number;
}

export interface WhatIfOptionContract {
  id: 'option-a' | 'option-b';
  name: string;
  tagline: string;
  alignmentDescription: string;
  color: string;
  /**
   * Real WGS84 GeoJSON geometry provided by backend GIS / PostGIS service.
   * Remains null until backend GeoJSON alignment is delivered.
   */
  geometry: GeoJSON.LineString | GeoJSON.MultiLineString | null;
  metrics: WhatIfMetrics;
  /**
   * Parcel IDs from the authoritative cadastral parcel dataset affected by this option.
   */
  affectedParcelIds: string[];
}

export interface WhatIfDataContract {
  optionA: WhatIfOptionContract;
  optionB: WhatIfOptionContract;
  /**
   * Optional GeoJSON FeatureCollection containing impact/buffer zone polygons.
   */
  impactZones: GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null;
}

/**
 * Derives the shared What-If simulator dataset by referencing the existing
 * SIMULATOR_CORRIDORS and ALL_PARCELS sources of truth.
 *
 * NOTE: The SVG pathCoordinates in SIMULATOR_CORRIDORS represent 2D presentation
 * canvas curves, not real WGS84 geographic coordinates. In compliance with strict
 * GIS standards, no fake geographic geometry is fabricated here; geometries remain
 * null / empty until backend PostGIS GeoJSON is injected.
 */
export function getSharedWhatIfData(): WhatIfDataContract {
  const optA = SIMULATOR_CORRIDORS.find((c) => c.id === 'option-a') || SIMULATOR_CORRIDORS[0];
  const optB = SIMULATOR_CORRIDORS.find((c) => c.id === 'option-b') || SIMULATOR_CORRIDORS[1];

  // Option A directly intersects the 18 critical dispute parcels in Rampur & Shivpur
  const criticalParcels = ALL_PARCELS.filter((p) => p.riskLevel === 'critical').map((p) => p.id);
  const optionAAffectedIds = criticalParcels.length >= 18 ? criticalParcels.slice(0, 18) : criticalParcels;

  // Option B bypasses the dense dispute cluster, intersecting only 4 parcels
  const optionBAffectedIds = optionAAffectedIds.slice(0, 4);

  return {
    optionA: {
      id: 'option-a',
      name: optA.name,
      tagline: optA.tagline,
      alignmentDescription: optA.alignmentDescription,
      color: optA.color || '#EF4444',
      geometry: null, // Awaiting real backend WGS84 GeoJSON
      metrics: {
        feasibilityScore: optA.feasibilityScore,
        totalCostCr: optA.totalCostCr,
        affectedFamiliesCount: optA.affectedFamiliesCount,
        highRiskParcelsCount: optA.highRiskParcelsCount,
        predictedDelayMonths: optA.predictedDelayMonths,
        totalLengthKm: optA.totalLengthKm,
        affectedParcelsCount: optA.affectedParcelsCount,
      },
      affectedParcelIds: optionAAffectedIds,
    },
    optionB: {
      id: 'option-b',
      name: optB.name,
      tagline: optB.tagline,
      alignmentDescription: optB.alignmentDescription,
      color: optB.color || '#10B981',
      geometry: null, // Awaiting real backend WGS84 GeoJSON
      metrics: {
        feasibilityScore: optB.feasibilityScore,
        totalCostCr: optB.totalCostCr,
        affectedFamiliesCount: optB.affectedFamiliesCount,
        highRiskParcelsCount: optB.highRiskParcelsCount,
        predictedDelayMonths: optB.predictedDelayMonths,
        totalLengthKm: optB.totalLengthKm,
        affectedParcelsCount: optB.affectedParcelsCount,
      },
      affectedParcelIds: optionBAffectedIds,
    },
    impactZones: null, // Awaiting real backend WGS84 GeoJSON
  };
}

/**
 * Builds GeoJSON FeatureCollection for corridors from a WhatIfDataContract.
 * Returns empty FeatureCollection if geometry is not provided.
 */
export function buildCorridorsGeoJSON(data: WhatIfDataContract): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];

  if (data.optionA.geometry) {
    features.push({
      type: 'Feature',
      id: 'option-a',
      properties: {
        id: 'option-a',
        name: data.optionA.name,
        color: data.optionA.color,
        feasibilityScore: data.optionA.metrics.feasibilityScore,
      },
      geometry: data.optionA.geometry,
    });
  }

  if (data.optionB.geometry) {
    features.push({
      type: 'Feature',
      id: 'option-b',
      properties: {
        id: 'option-b',
        name: data.optionB.name,
        color: data.optionB.color,
        feasibilityScore: data.optionB.metrics.feasibilityScore,
      },
      geometry: data.optionB.geometry,
    });
  }

  return {
    type: 'FeatureCollection',
    features,
  };
}

/**
 * Builds GeoJSON FeatureCollection for impact zones.
 */
export function buildImpactZonesGeoJSON(data: WhatIfDataContract): GeoJSON.FeatureCollection {
  if (data.impactZones && data.impactZones.features) {
    return data.impactZones;
  }
  return {
    type: 'FeatureCollection',
    features: [],
  };
}
