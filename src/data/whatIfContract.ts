import {
  WHAT_IF_OPTIONS,
  WHAT_IF_COMPARISON_SUMMARY,
  SIMULATOR_CORRIDORS,
  WhatIfMetrics,
  WhatIfCorridorOption,
  getWhatIfCorridorsGeoJSON,
  getWhatIfImpactZonesGeoJSON,
  projectPointToGeo,
  getOptionAGeometry,
  getOptionBGeometry,
  OPTION_A_AFFECTED_PARCEL_IDS,
  OPTION_B_AFFECTED_PARCEL_IDS,
} from './whatIfData';

// Re-export canonical exports
export {
  WHAT_IF_OPTIONS,
  WHAT_IF_COMPARISON_SUMMARY,
  SIMULATOR_CORRIDORS,
  getWhatIfCorridorsGeoJSON,
  getWhatIfImpactZonesGeoJSON,
  projectPointToGeo,
  getOptionAGeometry,
  getOptionBGeometry,
  OPTION_A_AFFECTED_PARCEL_IDS,
  OPTION_B_AFFECTED_PARCEL_IDS,
};
export type { WhatIfMetrics, WhatIfCorridorOption };

// Legacy Contract Interface Support
export interface WhatIfOptionContract extends WhatIfCorridorOption {}

export interface WhatIfDataContract {
  optionA: WhatIfCorridorOption;
  optionB: WhatIfCorridorOption;
  impactZones: GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null;
}

/**
 * Returns the canonical shared What-If data contract.
 */
export function getSharedWhatIfData(): WhatIfDataContract {
  return {
    optionA: WHAT_IF_OPTIONS.optionA,
    optionB: WHAT_IF_OPTIONS.optionB,
    impactZones: null,
  };
}

/**
 * Builds GeoJSON FeatureCollection for corridors from a WhatIfDataContract.
 */
export function buildCorridorsGeoJSON(data?: WhatIfDataContract): GeoJSON.FeatureCollection {
  if (!data) {
    return getWhatIfCorridorsGeoJSON();
  }
  const features: GeoJSON.Feature[] = [];
  if (data.optionA?.geometry) {
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
  if (data.optionB?.geometry) {
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
export function buildImpactZonesGeoJSON(data?: WhatIfDataContract): GeoJSON.FeatureCollection {
  if (data?.impactZones && data.impactZones.features) {
    return data.impactZones;
  }
  return getWhatIfImpactZonesGeoJSON();
}
