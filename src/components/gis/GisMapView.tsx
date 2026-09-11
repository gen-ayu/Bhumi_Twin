import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { googleProtocol, createGoogleStyle } from 'maplibre-google-maps';
import {
  Layers,
  Filter,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  AlertTriangle,
  CheckCircle2,
  X,
  ArrowRight,
  MapPin,
  Compass,
  Satellite,
  Info,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Scale,
  Users,
  IndianRupee,
  GitCompare,
  Sparkles,
  Loader2,
  Search,
  Maximize,
  Minimize
} from 'lucide-react';
import { Parcel, RiskLevel } from '../../types';
import { ALL_PARCELS, SIMULATOR_CORRIDORS } from '../../data/mockData';
import { NavTab } from '../layout/GovHeader';
import {
  WhatIfDataContract,
  getSharedWhatIfData,
  buildCorridorsGeoJSON,
  buildImpactZonesGeoJSON,
} from '../../data/whatIfContract';

// =============================================================================
// BHUMI-TWIN GIS CONFIGURATION
// =============================================================================
// Geographic Anchor: Varanasi Ring Road & Logistics Corridor (Pkg 3B)
export const DEFAULT_MAP_CENTER: [number, number] = [82.9412, 25.3418];
export const DEFAULT_ZOOM = 12;

// Layer Feature Flags: Controls independent GIS layers
export const SHOW_PARCEL_LAYER = true;

// Projection calibration: Maps the existing parcel polygon coordinates
// to precise geographic coordinates (WGS84) over the Varanasi project corridor.
const PROJECTION_CENTER_LNG = 82.9412;
const PROJECTION_CENTER_LAT = 25.3418;
const SVG_CENTER_X = 400;
const SVG_CENTER_Y = 240;
const SCALE_LNG = 0.00015;
const SCALE_LAT = 0.00014;

/**
 * Projects 2D parcel polygon vertices to real WGS84 geographic coordinates [longitude, latitude].
 * Ensures the linear ring is properly closed as required by GeoJSON Polygon spec.
 */
export function parcelCoordinatesToGeo(coords: [number, number][]): [number, number][] {
  const geo: [number, number][] = coords.map(([x, y]) => {
    const lng = +(PROJECTION_CENTER_LNG + (x - SVG_CENTER_X) * SCALE_LNG).toFixed(6);
    const lat = +(PROJECTION_CENTER_LAT - (y - SVG_CENTER_Y) * SCALE_LAT).toFixed(6);
    return [lng, lat];
  });

  if (geo.length > 0) {
    const first = geo[0];
    const last = geo[geo.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      geo.push([first[0], first[1]]);
    }
  }
  return geo;
}

/**
 * Converts BHUMI-TWIN Parcel records into a standard GeoJSON FeatureCollection.
 * Preserves parcel IDs, ULPIN, survey numbers, risk classifications, and village attributes.
 */
export function parcelsToGeoJSON(
  parcels: Parcel[],
  showRiskHeatmap: boolean
): GeoJSON.FeatureCollection<GeoJSON.Polygon> {
  return {
    type: 'FeatureCollection',
    features: parcels.map((p) => {
      const riskColor = !showRiskHeatmap
        ? '#3B82F6'
        : p.riskLevel === 'critical'
        ? '#EF4444'
        : p.riskLevel === 'attention'
        ? '#F59E0B'
        : '#10B981';

      return {
        type: 'Feature',
        id: p.id,
        properties: {
          id: p.id,
          parcelId: p.id,
          ulpin: p.ulpin,
          surveyNumber: p.surveyNumber,
          village: p.village,
          block: p.block,
          district: p.district,
          landType: p.landType,
          areaHectares: p.areaHectares,
          currentStage: p.currentStage,
          riskScore: p.riskScore,
          riskLevel: p.riskLevel,
          riskColor,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [parcelCoordinatesToGeo(p.coordinates)],
        },
      };
    }),
  };
}

/**
 * Computes bounding box [minLng, minLat, maxLng, maxLat] of a parcel feature collection.
 */
function calculateParcelBounds(
  features: GeoJSON.Feature<GeoJSON.Polygon>[]
): [number, number, number, number] | null {
  if (!features || features.length === 0) return null;
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
  for (const f of features) {
    const ring = f.geometry.coordinates[0];
    if (ring) {
      for (const [lng, lat] of ring) {
        if (lng < minLng) minLng = lng;
        if (lat < minLat) minLat = lat;
        if (lng > maxLng) maxLng = lng;
        if (lat > maxLat) maxLat = lat;
      }
    }
  }
  if (!isFinite(minLng)) return null;
  return [minLng, minLat, maxLng, maxLat];
}

// Register Google Protocol with MapLibre once
let isGoogleProtocolAdded = false;
function ensureGoogleProtocol() {
  if (!isGoogleProtocolAdded) {
    try {
      maplibregl.addProtocol('google', googleProtocol);
      isGoogleProtocolAdded = true;
    } catch {
      isGoogleProtocolAdded = true;
    }
  }
}

interface GisMapViewProps {
  selectedParcelId: string;
  onSelectParcel: (parcelId: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  customWhatIfData?: WhatIfDataContract;
}

export const GisMapView: React.FC<GisMapViewProps> = ({
  selectedParcelId,
  onSelectParcel,
  onNavigateTab,
  customWhatIfData,
}) => {
  // Centralized Map Layer States
  const [satelliteBasemap, setSatelliteBasemap] = useState(true);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showCorridor, setShowCorridor] = useState(true);
  const [showRiskHeatmap, setShowRiskHeatmap] = useState(true);
  const [showDistricts, setShowDistricts] = useState(true);
  const [showVillages, setShowVillages] = useState(true);
  const [showProjectBoundary, setShowProjectBoundary] = useState(true);

  // What-If Simulator Dedicated Layer Namespace & States (Decoupled from parcel/risk/corridor)
  const [whatIfLayer, setWhatIfLayer] = useState({
    visible: false,
    optionA: true,
    optionB: true,
    impactZone: true,
    affectedParcels: true,
  });

  // What-If Feature Selection & Dedicated Slide-in Drawer States
  const [selectedWhatIfFeature, setSelectedWhatIfFeature] = useState<'option-a' | 'option-b'>('option-a');
  const [isWhatIfDrawerOpen, setIsWhatIfDrawerOpen] = useState<boolean>(false);

  // Shared What-If data contract (Option A, Option B, affected parcels, metrics)
  const whatIfData = useMemo(() => {
    return customWhatIfData || getSharedWhatIfData();
  }, [customWhatIfData]);

  const corridorsGeoJSON = useMemo(() => {
    return buildCorridorsGeoJSON(whatIfData);
  }, [whatIfData]);

  const impactZonesGeoJSON = useMemo(() => {
    return buildImpactZonesGeoJSON(whatIfData);
  }, [whatIfData]);

  const hasGeographicCorridorGeometry = useMemo(() => {
    return Boolean(whatIfData.optionA.geometry || whatIfData.optionB.geometry);
  }, [whatIfData]);

  const whatIfLayerRef = useRef(whatIfLayer);
  useEffect(() => {
    whatIfLayerRef.current = whatIfLayer;
  }, [whatIfLayer]);

  const corridorsGeoJSONRef = useRef(corridorsGeoJSON);
  useEffect(() => {
    corridorsGeoJSONRef.current = corridorsGeoJSON;
  }, [corridorsGeoJSON]);

  const impactZonesGeoJSONRef = useRef(impactZonesGeoJSON);
  useEffect(() => {
    impactZonesGeoJSONRef.current = impactZonesGeoJSON;
  }, [impactZonesGeoJSON]);

  // Layers Dropdown Popover state
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const layersRef = useRef<HTMLDivElement>(null);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Cadastral Filters
  const [filterVillage, setFilterVillage] = useState<string>('All');
  const [filterLandType, setFilterLandType] = useState<string>('All');
  const [filterRisk, setFilterRisk] = useState<string>('All');

  // Hovered Parcel for Tooltip
  const [hoveredParcel, setHoveredParcel] = useState<Parcel | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // MapLibre Reference & States
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const selectedFeatureIdRef = useRef<string | null>(selectedParcelId || null);
  const hoveredFeatureIdRef = useRef<string | null>(null);
  const [mapLoading, setMapLoading] = useState<boolean>(true);
  const [mapError, setMapError] = useState<string | null>(null);

  // Drawer open/close state (by default kept CLOSED until opened manually)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Google Maps API Key from environment configuration (NOT hardcoded)
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Active selected parcel object (Preserved)
  const activeParcel = useMemo(() => {
    return ALL_PARCELS.find((p) => p.id === selectedParcelId) || ALL_PARCELS[0];
  }, [selectedParcelId]);

  // Filtered parcels (Preserved)
  const filteredParcels = useMemo(() => {
    return ALL_PARCELS.filter((p) => {
      if (filterVillage !== 'All' && p.village !== filterVillage) return false;
      if (filterLandType !== 'All' && p.landType !== filterLandType) return false;
      if (filterRisk === 'low' && p.riskLevel !== 'low') return false;
      if (filterRisk === 'attention' && p.riskLevel !== 'attention') return false;
      if (filterRisk === 'critical' && p.riskLevel !== 'critical') return false;
      return true;
    });
  }, [filterVillage, filterLandType, filterRisk]);

  // Generate GeoJSON FeatureCollection from current filtered parcels
  const parcelGeoJSON = useMemo(() => {
    return parcelsToGeoJSON(filteredParcels, showRiskHeatmap);
  }, [filteredParcels, showRiskHeatmap]);

  const parcelGeoJSONRef = useRef(parcelGeoJSON);
  useEffect(() => {
    parcelGeoJSONRef.current = parcelGeoJSON;
  }, [parcelGeoJSON]);

  // Close Layers dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (layersRef.current && !layersRef.current.contains(e.target as Node)) {
        setIsLayersOpen(false);
      }
    };
    if (isLayersOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLayersOpen]);

  // Handle Fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      setTimeout(() => mapRef.current?.resize(), 100);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const container = document.getElementById('gis-map-screen');
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => {
        setIsFullscreen(true);
        setTimeout(() => mapRef.current?.resize(), 100);
      }).catch((err) => {
        console.warn('Could not activate fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        setTimeout(() => mapRef.current?.resize(), 100);
      }).catch((err) => {
        console.warn('Could not exit fullscreen:', err);
      });
    }
  };

  const handleLocateProject = () => {
    const globalSearch = document.getElementById('global-search-input') as HTMLInputElement | null;
    if (globalSearch) {
      globalSearch.focus();
    }
    mapRef.current?.flyTo({
      center: DEFAULT_MAP_CENTER,
      zoom: 13,
      essential: true,
    });
  };

  // Helper to add/update MapLibre GIS Overlay Layers on top of Google Basemap
  const setupLayers = useCallback(
    (map: maplibregl.Map, geojson: GeoJSON.FeatureCollection<GeoJSON.Polygon>) => {
      if (!SHOW_PARCEL_LAYER) return;

      // 1. Add/Update GeoJSON Source for Cadastral Parcels
      if (!map.getSource('parcels')) {
        map.addSource('parcels', {
          type: 'geojson',
          data: geojson,
          promoteId: 'id',
        });
      } else {
        (map.getSource('parcels') as maplibregl.GeoJSONSource).setData(geojson);
      }

      // 2. Add Parcel Fill Layer (Semi-transparent risk colored polygons)
      if (!map.getLayer('parcel-fill')) {
        map.addLayer({
          id: 'parcel-fill',
          type: 'fill',
          source: 'parcels',
          layout: {
            visibility: showBoundaries ? 'visible' : 'none',
          },
          paint: {
            'fill-color': ['get', 'riskColor'],
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'selected'], false],
              0.85,
              ['boolean', ['feature-state', 'hover'], false],
              0.65,
              ['boolean', ['feature-state', 'whatIfAffected'], false],
              0.60,
              0.45,
            ],
          },
        });
      }

      // 3. Add What-If Impact Zones Source & Fill Layer (Translucent buffer)
      if (!map.getSource('what-if-impact-zones')) {
        map.addSource('what-if-impact-zones', {
          type: 'geojson',
          data: impactZonesGeoJSONRef.current,
          promoteId: 'id',
        });
      } else {
        (map.getSource('what-if-impact-zones') as maplibregl.GeoJSONSource).setData(impactZonesGeoJSONRef.current);
      }

      if (!map.getLayer('what-if-impact-zone')) {
        map.addLayer({
          id: 'what-if-impact-zone',
          type: 'fill',
          source: 'what-if-impact-zones',
          layout: {
            visibility: whatIfLayerRef.current.visible && whatIfLayerRef.current.impactZone ? 'visible' : 'none',
          },
          paint: {
            'fill-color': ['coalesce', ['get', 'color'], '#A855F7'],
            'fill-opacity': 0.22,
          },
        });
      }

      // 4. Add What-If Corridors Source & Line Layers (Option A and Option B)
      if (!map.getSource('what-if-corridors')) {
        map.addSource('what-if-corridors', {
          type: 'geojson',
          data: corridorsGeoJSONRef.current,
          promoteId: 'id',
        });
      } else {
        (map.getSource('what-if-corridors') as maplibregl.GeoJSONSource).setData(corridorsGeoJSONRef.current);
      }

      // Option A: Original Preliminary DPR Line (Red/Pink dashed)
      if (!map.getLayer('what-if-option-a')) {
        map.addLayer({
          id: 'what-if-option-a',
          type: 'line',
          source: 'what-if-corridors',
          filter: ['==', ['get', 'id'], 'option-a'],
          layout: {
            visibility: whatIfLayerRef.current.visible && whatIfLayerRef.current.optionA ? 'visible' : 'none',
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#EF4444',
            'line-width': [
              'case',
              ['boolean', ['feature-state', 'selected'], false],
              6.5,
              4.0,
            ],
            'line-dasharray': [3, 2],
          },
        });
      }

      // Option B: Optimized Southern Bypass Line (Emerald solid)
      if (!map.getLayer('what-if-option-b')) {
        map.addLayer({
          id: 'what-if-option-b',
          type: 'line',
          source: 'what-if-corridors',
          filter: ['==', ['get', 'id'], 'option-b'],
          layout: {
            visibility: whatIfLayerRef.current.visible && whatIfLayerRef.current.optionB ? 'visible' : 'none',
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#10B981',
            'line-width': [
              'case',
              ['boolean', ['feature-state', 'selected'], false],
              7.0,
              4.5,
            ],
          },
        });
      }

      // 5. Add Parcel Outline Layer (with distinct purple stroke for What-If affected parcels)
      if (!map.getLayer('parcel-outline')) {
        map.addLayer({
          id: 'parcel-outline',
          type: 'line',
          source: 'parcels',
          layout: {
            visibility: showBoundaries ? 'visible' : 'none',
          },
          paint: {
            'line-color': [
              'case',
              ['boolean', ['feature-state', 'selected'], false],
              '#FFFFFF',
              ['boolean', ['feature-state', 'whatIfAffected'], false],
              '#C084FC',
              ['get', 'riskColor'],
            ],
            'line-width': [
              'case',
              ['boolean', ['feature-state', 'selected'], false],
              3.5,
              ['boolean', ['feature-state', 'whatIfAffected'], false],
              2.8,
              1.6,
            ],
          },
        });
      }

      // 6. Add Parcel Labels Symbol Layer (Crisp parcel IDs over satellite)
      if (!map.getLayer('parcel-labels')) {
        map.addLayer({
          id: 'parcel-labels',
          type: 'symbol',
          source: 'parcels',
          layout: {
            visibility: showBoundaries ? 'visible' : 'none',
            'text-field': ['get', 'id'],
            'text-size': 10,
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-anchor': 'center',
            'text-allow-overlap': false,
            'text-ignore-placement': false,
          },
          paint: {
            'text-color': '#FFFFFF',
            'text-halo-color': '#0F172A',
            'text-halo-width': 1.5,
          },
        });
      }

      // 7. Add What-If Corridor Labels Symbol Layer
      if (!map.getLayer('what-if-labels')) {
        map.addLayer({
          id: 'what-if-labels',
          type: 'symbol',
          source: 'what-if-corridors',
          layout: {
            visibility: whatIfLayerRef.current.visible ? 'visible' : 'none',
            'text-field': ['get', 'name'],
            'text-size': 11,
            'symbol-placement': 'line',
            'text-anchor': 'center',
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          },
          paint: {
            'text-color': '#FFFFFF',
            'text-halo-color': '#0F172A',
            'text-halo-width': 2,
          },
        });
      }

      // 8. Restore initial selected feature states
      if (selectedParcelId) {
        map.setFeatureState(
          { source: 'parcels', id: selectedParcelId },
          { selected: true }
        );
        selectedFeatureIdRef.current = selectedParcelId;
      }
    },
    [showBoundaries]
  );

  // ---------------------------------------------------------------------------
  // Initialize MapLibre GL Map with Google Map Tiles Basemap & GIS Overlays
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!mapContainerRef.current) return;

    ensureGoogleProtocol();

    // Check API key configuration
    if (!googleMapsApiKey) {
      setMapLoading(false);
      setMapError(
        'Google Maps API key is not configured. Please set VITE_GOOGLE_MAPS_API_KEY in your .env configuration with the Google Cloud Map Tiles API enabled.'
      );
    }

    const mapStyle: any = googleMapsApiKey
      ? createGoogleStyle('google-base', satelliteBasemap ? 'satellite' : 'roadmap', googleMapsApiKey)
      : {
          version: 8,
          sources: {},
          layers: [
            {
              id: 'fallback-bg',
              type: 'background',
              paint: { 'background-color': '#0B132B' },
            },
          ],
        };

    // Provide standard open-source glyphs so symbol layers render cleanly
    if (!mapStyle.glyphs) {
      mapStyle.glyphs = 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf';
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: DEFAULT_MAP_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
    });

    // Add attribution positioned at bottom-right (non-overlapping)
    map.addControl(
      new maplibregl.AttributionControl({
        compact: false,
        customAttribution: '© Google Maps • MapLibre GL',
      }),
      'bottom-right'
    );

    // Attach click and hover events for parcel interactive GIS layer
    map.on('click', 'parcel-fill', (e) => {
      if (e.features && e.features[0]) {
        const parcelId = e.features[0].properties?.id;
        if (parcelId) {
          onSelectParcel(parcelId);
          setIsDrawerOpen(true);
          setIsWhatIfDrawerOpen(false);
        }
      }
    });

    // Attach click and hover events for What-If Option A
    map.on('click', 'what-if-option-a', () => {
      setSelectedWhatIfFeature('option-a');
      setIsWhatIfDrawerOpen(true);
      setIsDrawerOpen(false);
    });
    map.on('mouseenter', 'what-if-option-a', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'what-if-option-a', () => {
      map.getCanvas().style.cursor = '';
    });

    // Attach click and hover events for What-If Option B
    map.on('click', 'what-if-option-b', () => {
      setSelectedWhatIfFeature('option-b');
      setIsWhatIfDrawerOpen(true);
      setIsDrawerOpen(false);
    });
    map.on('mouseenter', 'what-if-option-b', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'what-if-option-b', () => {
      map.getCanvas().style.cursor = '';
    });

    // Attach click and hover events for What-If Impact Zones
    map.on('click', 'what-if-impact-zone', (e) => {
      if (e.features && e.features[0]) {
        const featId = e.features[0].properties?.corridorId || e.features[0].id;
        setSelectedWhatIfFeature(featId === 'option-b' ? 'option-b' : 'option-a');
        setIsWhatIfDrawerOpen(true);
        setIsDrawerOpen(false);
      }
    });
    map.on('mouseenter', 'what-if-impact-zone', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'what-if-impact-zone', () => {
      map.getCanvas().style.cursor = '';
    });

    map.on('mouseenter', 'parcel-fill', (e) => {
      map.getCanvas().style.cursor = 'pointer';
      if (e.features && e.features[0]) {
        const featureId = e.features[0].id || e.features[0].properties?.id;
        if (hoveredFeatureIdRef.current && hoveredFeatureIdRef.current !== featureId) {
          map.setFeatureState({ source: 'parcels', id: hoveredFeatureIdRef.current }, { hover: false });
        }
        if (featureId) {
          map.setFeatureState({ source: 'parcels', id: featureId }, { hover: true });
          hoveredFeatureIdRef.current = String(featureId);
        }
        const p = ALL_PARCELS.find((item) => item.id === featureId);
        if (p) {
          setHoveredParcel(p);
          setTooltipPos({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
        }
      }
    });

    map.on('mousemove', 'parcel-fill', (e) => {
      setTooltipPos({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
    });

    map.on('mouseleave', 'parcel-fill', () => {
      map.getCanvas().style.cursor = '';
      if (hoveredFeatureIdRef.current) {
        map.setFeatureState({ source: 'parcels', id: hoveredFeatureIdRef.current }, { hover: false });
        hoveredFeatureIdRef.current = null;
      }
      setHoveredParcel(null);
    });

    map.on('load', () => {
      setMapLoading(false);
      if (googleMapsApiKey) {
        setMapError(null);
      }

      // Add the parcel GIS layers onto the map
      setupLayers(map, parcelGeoJSON);

      // Fit map viewport to the real geographic bounds of the parcel dataset
      const bounds = calculateParcelBounds(parcelGeoJSON.features);
      if (bounds) {
        map.fitBounds(
          [[bounds[0], bounds[1]], [bounds[2], bounds[3]]],
          { padding: 60, duration: 1000 }
        );
      }
    });

    map.on('error', (e) => {
      const msg = e.error?.message || '';
      if (
        msg.includes('403') ||
        msg.includes('400') ||
        msg.includes('Unauthorized') ||
        msg.includes('Failed to fetch') ||
        msg.includes('Forbidden')
      ) {
        setMapError(
          'Google Maps satellite tiles could not be loaded. Please ensure your Google API key has the "Map Tiles API" enabled.'
        );
        setMapLoading(false);
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [googleMapsApiKey]);

  // ---------------------------------------------------------------------------
  // Dynamic Basemap Style Switch (Satellite vs Roadmap) with GIS Layer Retention
  // ---------------------------------------------------------------------------
  const isInitialBasemapMount = useRef(true);
  useEffect(() => {
    if (isInitialBasemapMount.current) {
      isInitialBasemapMount.current = false;
      return;
    }
    if (!mapRef.current || !googleMapsApiKey) return;

    try {
      const nextStyle: any = createGoogleStyle(
        'google-base',
        satelliteBasemap ? 'satellite' : 'roadmap',
        googleMapsApiKey
      );
      if (!nextStyle.glyphs) {
        nextStyle.glyphs = 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf';
      }

      const map = mapRef.current;
      map.setStyle(nextStyle);

      // Re-attach GIS overlay layers once the new basemap style is loaded
      map.once('style.load', () => {
        setupLayers(map, parcelGeoJSONRef.current);
      });
    } catch (err) {
      console.error('Failed to change map style:', err);
    }
  }, [satelliteBasemap, googleMapsApiKey]);

  // ---------------------------------------------------------------------------
  // Sync Filtered GeoJSON Data with MapLibre Source without map reinitialization
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const source = map.getSource('parcels') as maplibregl.GeoJSONSource | undefined;
    if (source) {
      source.setData(parcelGeoJSON);
    }
  }, [parcelGeoJSON]);

  // ---------------------------------------------------------------------------
  // Sync Selection State: Update MapLibre feature state on selection change
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (!map.getSource('parcels')) return;

    if (selectedFeatureIdRef.current && selectedFeatureIdRef.current !== selectedParcelId) {
      map.setFeatureState(
        { source: 'parcels', id: selectedFeatureIdRef.current },
        { selected: false }
      );
    }
    if (selectedParcelId) {
      map.setFeatureState(
        { source: 'parcels', id: selectedParcelId },
        { selected: true }
      );
      selectedFeatureIdRef.current = selectedParcelId;
    }
  }, [selectedParcelId]);

  // ---------------------------------------------------------------------------
  // Toggle Parcel Boundaries Visibility via Map Layers Control
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const visibility = showBoundaries ? 'visible' : 'none';
    if (map.getLayer('parcel-fill')) {
      map.setLayoutProperty('parcel-fill', 'visibility', visibility);
    }
    if (map.getLayer('parcel-outline')) {
      map.setLayoutProperty('parcel-outline', 'visibility', visibility);
    }
    if (map.getLayer('parcel-labels')) {
      map.setLayoutProperty('parcel-labels', 'visibility', visibility);
    }
  }, [showBoundaries]);

  // ---------------------------------------------------------------------------
  // Sync What-If Corridor & Impact Zone GeoJSON with MapLibre Sources
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const corridorSrc = map.getSource('what-if-corridors') as maplibregl.GeoJSONSource | undefined;
    if (corridorSrc) {
      corridorSrc.setData(corridorsGeoJSON);
    }
    const impactSrc = map.getSource('what-if-impact-zones') as maplibregl.GeoJSONSource | undefined;
    if (impactSrc) {
      impactSrc.setData(impactZonesGeoJSON);
    }
  }, [corridorsGeoJSON, impactZonesGeoJSON]);

  // ---------------------------------------------------------------------------
  // Sync What-If Corridor Feature Selection State
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (!map.getSource('what-if-corridors')) return;

    map.setFeatureState(
      { source: 'what-if-corridors', id: 'option-a' },
      { selected: selectedWhatIfFeature === 'option-a' }
    );
    map.setFeatureState(
      { source: 'what-if-corridors', id: 'option-b' },
      { selected: selectedWhatIfFeature === 'option-b' }
    );
  }, [selectedWhatIfFeature]);

  // ---------------------------------------------------------------------------
  // Toggle What-If Overlay and Sublayers Visibility (No map.setStyle)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const isMain = whatIfLayer.visible;

    if (map.getLayer('what-if-option-a')) {
      map.setLayoutProperty(
        'what-if-option-a',
        'visibility',
        isMain && whatIfLayer.optionA ? 'visible' : 'none'
      );
    }
    if (map.getLayer('what-if-option-b')) {
      map.setLayoutProperty(
        'what-if-option-b',
        'visibility',
        isMain && whatIfLayer.optionB ? 'visible' : 'none'
      );
    }
    if (map.getLayer('what-if-impact-zone')) {
      map.setLayoutProperty(
        'what-if-impact-zone',
        'visibility',
        isMain && whatIfLayer.impactZone ? 'visible' : 'none'
      );
    }
    if (map.getLayer('what-if-labels')) {
      map.setLayoutProperty(
        'what-if-labels',
        'visibility',
        isMain ? 'visible' : 'none'
      );
    }
  }, [whatIfLayer]);

  // ---------------------------------------------------------------------------
  // Highlight Affected Parcels on Existing Parcel Layer (Zero Geometry Duplication)
  // ---------------------------------------------------------------------------
  const prevAffectedParcelIdsRef = useRef<string[]>([]);
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (!map.getSource('parcels')) return;

    // Clear previous affected parcel feature states
    for (const id of prevAffectedParcelIdsRef.current) {
      map.setFeatureState({ source: 'parcels', id }, { whatIfAffected: false });
    }
    prevAffectedParcelIdsRef.current = [];

    // Highlight the active corridor's affected parcels on existing parcel dataset
    if (whatIfLayer.visible && whatIfLayer.affectedParcels) {
      const activeOption = selectedWhatIfFeature === 'option-a' ? whatIfData.optionA : whatIfData.optionB;
      for (const id of activeOption.affectedParcelIds) {
        map.setFeatureState({ source: 'parcels', id }, { whatIfAffected: true });
      }
      prevAffectedParcelIdsRef.current = activeOption.affectedParcelIds;
    }
  }, [whatIfLayer.visible, whatIfLayer.affectedParcels, selectedWhatIfFeature, whatIfData]);

  // ---------------------------------------------------------------------------
  // Responsiveness: ResizeObserver to handle drawer/sidebar/window resizing
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      mapRef.current?.resize();
    });

    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Map Viewport Controls: Zoom In, Zoom Out, Reset View
  // ---------------------------------------------------------------------------
  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  const handleResetView = () => {
    if (!mapRef.current) return;
    const bounds = calculateParcelBounds(parcelGeoJSON.features);
    if (bounds) {
      mapRef.current.fitBounds(
        [[bounds[0], bounds[1]], [bounds[2], bounds[3]]],
        { padding: 60, duration: 800 }
      );
    } else {
      mapRef.current.flyTo({
        center: DEFAULT_MAP_CENTER,
        zoom: DEFAULT_ZOOM,
        essential: true,
      });
    }
  };

  return (
    <div id="gis-map-screen" className="relative w-full h-[calc(100vh-130px)] min-h-[580px] bg-slate-900 overflow-hidden flex flex-col">
      
      {/* Top Page Controls Bar: Filters & Selected Parcel Details (PRESERVED) */}
      <div className="z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 py-1.5 flex items-center justify-between gap-2 shadow-xs overflow-x-auto whitespace-nowrap min-h-[44px]">
        
        {/* Left / Center: Cadastral Filtering Dropdowns */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
            <Filter className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">Filters:</span>
          </div>

          {/* Village Filter */}
          <select
            value={filterVillage}
            onChange={(e) => setFilterVillage(e.target.value)}
            aria-label="Filter by Village"
            className="text-[11px] border border-slate-300 rounded px-1.5 py-0.5 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500 h-7 font-medium"
          >
            <option value="All">All Villages (4)</option>
            <option value="Rampur">Rampur</option>
            <option value="Shivpur">Shivpur</option>
            <option value="Babatpur">Babatpur</option>
            <option value="Harahua">Harahua</option>
          </select>

          {/* Land Type Filter */}
          <select
            value={filterLandType}
            onChange={(e) => setFilterLandType(e.target.value)}
            aria-label="Filter by Land Type"
            className="text-[11px] border border-slate-300 rounded px-1.5 py-0.5 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500 h-7 font-medium"
          >
            <option value="All">All Land Types</option>
            <option value="Agricultural">Agricultural</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Forest / Wetland">Forest / Wetland</option>
          </select>

          {/* Risk Level Filter */}
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            aria-label="Filter by Risk Band"
            className="text-[11px] border border-slate-300 rounded px-1.5 py-0.5 bg-white text-slate-800 font-semibold focus:outline-hidden focus:ring-1 focus:ring-amber-500 h-7"
          >
            <option value="All">All Risk Bands</option>
            <option value="critical">🔴 Critical (70–100)</option>
            <option value="attention">🟡 Attention (40–69)</option>
            <option value="low">🟢 Low (0–39)</option>
          </select>

          {/* Showing Count */}
          <span className="text-[10px] text-slate-500 font-mono pl-0.5">
            {filteredParcels.length}/{ALL_PARCELS.length} Parcels
          </span>
        </div>

        {/* Far Right: Contextual What-If Details & Parcel Details Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* What-If Details Contextual Button */}
          <button
            id="toggle-whatif-topbar-btn"
            onClick={() => {
              if (!whatIfLayer.visible) {
                setWhatIfLayer((prev) => ({ ...prev, visible: true }));
              }
              setIsWhatIfDrawerOpen(!isWhatIfDrawerOpen);
              if (!isWhatIfDrawerOpen) {
                setIsDrawerOpen(false);
              }
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border shadow-xs h-7 ${
              isWhatIfDrawerOpen
                ? 'bg-purple-700 text-white border-purple-700 hover:bg-purple-800 ring-2 ring-purple-200'
                : whatIfLayer.visible
                ? 'bg-purple-50 text-purple-900 border-purple-300 hover:bg-purple-100'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-800'
            }`}
            title={isWhatIfDrawerOpen ? 'Collapse What-If Simulator Details' : 'Open What-If Simulator Details'}
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                selectedWhatIfFeature === 'option-a' ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
            ></span>
            <span className="font-semibold">
              {selectedWhatIfFeature === 'option-a' ? 'Option A (68/100)' : 'Option B (89/100)'}
            </span>
            <span className="text-slate-300">|</span>
            <span>{isWhatIfDrawerOpen ? 'Hide Details' : 'What-If Details'}</span>
            <GitCompare className={`w-3 h-3 ${isWhatIfDrawerOpen ? 'text-white' : 'text-purple-600'}`} />
          </button>

          {/* Parcel Details Button */}
          <button
            id="toggle-inspector-topbar-btn"
            onClick={() => {
              setIsDrawerOpen(!isDrawerOpen);
              if (!isDrawerOpen) {
                setIsWhatIfDrawerOpen(false);
              }
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border shadow-xs h-7 ${
              isDrawerOpen
                ? 'bg-amber-600 text-white border-amber-600 hover:bg-amber-700 ring-2 ring-amber-200'
                : 'bg-white text-slate-800 border-slate-300 hover:border-amber-400 hover:bg-amber-50/80 hover:text-amber-900'
            }`}
            title={isDrawerOpen ? 'Collapse Parcel Details Panel' : 'Open Parcel Details Panel'}
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                activeParcel.riskLevel === 'critical'
                  ? 'bg-rose-500'
                  : activeParcel.riskLevel === 'attention'
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
            ></span>
            <span className="font-mono font-extrabold">{activeParcel.id}</span>
            <span className="text-slate-300">|</span>
            <span>{isDrawerOpen ? 'Hide Details' : 'Parcel Details'}</span>
            <Info className={`w-3 h-3 ${isDrawerOpen ? 'text-white' : 'text-amber-600'}`} />
          </button>
        </div>
      </div>

      {/* Central Map Viewport Container with MapLibre GL JS */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-[#0A0F1D]">
        
        {/* MapLibre Map Container */}
        <div
          ref={mapContainerRef}
          className="absolute inset-0 w-full h-full"
          id="maplibre-central-viewport"
        />

        {/* ========================================================================= */}
        {/* COMPACT FLOATING MAP NAVIGATION BAR (Top Edge of Viewport)                */}
        {/* ========================================================================= */}
        <div className="absolute top-3 left-3 right-3 z-30 pointer-events-auto">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/70 shadow-2xl rounded-xl px-2.5 sm:px-3 py-1.5 flex items-center justify-between gap-2 min-h-[42px] text-white">
            
            {/* LEFT: [ GIS Map ] Badge & Project Title */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs tracking-wide">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>GIS Map</span>
              </div>
              <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-slate-400 font-mono pl-1 border-l border-slate-700/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>VARANASI PKG-3B</span>
              </div>
            </div>

            {/* CENTER: [ Satellite ] [ Layers ▾ ] [ Risk Radar ] [ Corridors ] */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              
              {/* Satellite Basemap Toggle */}
              <button
                onClick={() => setSatelliteBasemap(!satelliteBasemap)}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  satelliteBasemap
                    ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50 shadow-xs'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-800 hover:text-slate-200'
                }`}
                title={satelliteBasemap ? 'Active: Google Satellite' : 'Active: Google Roadmap'}
                aria-label="Toggle Google Satellite or Roadmap Basemap"
              >
                <Satellite className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{satelliteBasemap ? 'Satellite' : 'Roadmap'}</span>
              </button>

              {/* Layers Dropdown Popover */}
              <div className="relative" ref={layersRef}>
                <button
                  onClick={() => setIsLayersOpen(!isLayersOpen)}
                  className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                    isLayersOpen
                      ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50 shadow-xs'
                      : 'bg-slate-800/60 text-slate-300 border-slate-700/50 hover:bg-slate-800 hover:text-white'
                  }`}
                  aria-expanded={isLayersOpen}
                  aria-label="Map Layers Menu"
                  title="Configure GIS Overlays"
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Layers</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isLayersOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Popover Menu */}
                {isLayersOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-slate-900/98 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl p-3 z-50 text-xs space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="font-bold text-slate-200 text-[11px] uppercase tracking-wider flex items-center justify-between pb-1.5 border-b border-slate-800">
                      <span>Map Layers</span>
                      <span className="text-[10px] text-slate-500 font-mono">GIS Overlays</span>
                    </div>

                    <div className="space-y-1">
                      {/* Satellite Base */}
                      <label className="flex items-center gap-2 px-1.5 py-1 rounded-md hover:bg-slate-800/60 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={satelliteBasemap}
                          onChange={() => setSatelliteBasemap(!satelliteBasemap)}
                          className="rounded accent-emerald-500 w-3.5 h-3.5 cursor-pointer"
                        />
                        <span className="text-slate-200 font-medium">Satellite Base</span>
                        <span className="text-[9px] text-emerald-400 ml-auto">Google</span>
                      </label>

                      {/* Districts */}
                      <label className="flex items-center gap-2 px-1.5 py-1 rounded-md hover:bg-slate-800/60 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={showDistricts}
                          onChange={() => setShowDistricts(!showDistricts)}
                          className="rounded accent-indigo-500 w-3.5 h-3.5 cursor-pointer"
                        />
                        <span className="text-slate-200 font-medium">Districts</span>
                        <span className="text-[9px] text-slate-500 ml-auto">Varanasi</span>
                      </label>

                      {/* Villages */}
                      <label className="flex items-center gap-2 px-1.5 py-1 rounded-md hover:bg-slate-800/60 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={showVillages}
                          onChange={() => setShowVillages(!showVillages)}
                          className="rounded accent-indigo-500 w-3.5 h-3.5 cursor-pointer"
                        />
                        <span className="text-slate-200 font-medium">Villages</span>
                        <span className="text-[9px] text-slate-500 ml-auto">4 Zones</span>
                      </label>

                      {/* Parcels */}
                      <label className="flex items-center gap-2 px-1.5 py-1 rounded-md hover:bg-slate-800/60 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={showBoundaries}
                          onChange={() => setShowBoundaries(!showBoundaries)}
                          className="rounded accent-indigo-500 w-3.5 h-3.5 cursor-pointer"
                        />
                        <span className="text-slate-200 font-medium">Parcels</span>
                        <span className="text-[9px] text-slate-400 font-mono ml-auto">148</span>
                      </label>

                      {/* Risk Radar */}
                      <label className="flex items-center gap-2 px-1.5 py-1 rounded-md hover:bg-slate-800/60 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={showRiskHeatmap}
                          onChange={() => setShowRiskHeatmap(!showRiskHeatmap)}
                          className="rounded accent-amber-500 w-3.5 h-3.5 cursor-pointer"
                        />
                        <span className="text-slate-200 font-medium">Risk Radar</span>
                        <span className="w-2 h-2 rounded-full bg-amber-400 ml-auto"></span>
                      </label>

                      {/* Project Boundary */}
                      <label className="flex items-center gap-2 px-1.5 py-1 rounded-md hover:bg-slate-800/60 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={showProjectBoundary}
                          onChange={() => setShowProjectBoundary(!showProjectBoundary)}
                          className="rounded accent-indigo-500 w-3.5 h-3.5 cursor-pointer"
                        />
                        <span className="text-slate-200 font-medium">Project Boundary</span>
                        <span className="text-[9px] text-slate-500 ml-auto">Pkg 3B</span>
                      </label>

                      {/* Corridors */}
                      <label className="flex items-center gap-2 px-1.5 py-1 rounded-md hover:bg-slate-800/60 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={showCorridor}
                          onChange={() => setShowCorridor(!showCorridor)}
                          className="rounded accent-emerald-500 w-3.5 h-3.5 cursor-pointer"
                        />
                        <span className="text-slate-200 font-medium">Corridors</span>
                        <span className="text-[9px] text-emerald-400 ml-auto">Base Line</span>
                      </label>

                      {/* What-If Simulator Overlay Section */}
                      <div className="pt-2 mt-1 border-t border-slate-800/80">
                        <label className="flex items-center gap-2 px-1.5 py-1 rounded-md hover:bg-slate-800/60 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={whatIfLayer.visible}
                            onChange={() => setWhatIfLayer((prev) => ({ ...prev, visible: !prev.visible }))}
                            className="rounded accent-purple-500 w-3.5 h-3.5 cursor-pointer"
                          />
                          <span className="text-slate-200 font-medium">What-If Simulator</span>
                          <span className="text-[9px] text-purple-400 font-mono ml-auto">Opt A & B</span>
                        </label>

                        {/* Sublayers visible when What-If Simulator is checked */}
                        {whatIfLayer.visible && (
                          <div className="ml-5 pl-2 border-l border-purple-500/30 space-y-1 mt-1">
                            <label className="flex items-center gap-2 py-0.5 text-[11px] text-slate-300 hover:text-white cursor-pointer">
                              <input
                                type="checkbox"
                                checked={whatIfLayer.optionA}
                                onChange={() => setWhatIfLayer((prev) => ({ ...prev, optionA: !prev.optionA }))}
                                className="rounded accent-rose-500 w-3 h-3 cursor-pointer"
                              />
                              <span>Option A (Original)</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 ml-auto"></span>
                            </label>

                            <label className="flex items-center gap-2 py-0.5 text-[11px] text-slate-300 hover:text-white cursor-pointer">
                              <input
                                type="checkbox"
                                checked={whatIfLayer.optionB}
                                onChange={() => setWhatIfLayer((prev) => ({ ...prev, optionB: !prev.optionB }))}
                                className="rounded accent-emerald-500 w-3 h-3 cursor-pointer"
                              />
                              <span>Option B (Optimized)</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-auto"></span>
                            </label>

                            <label className="flex items-center gap-2 py-0.5 text-[11px] text-slate-300 hover:text-white cursor-pointer">
                              <input
                                type="checkbox"
                                checked={whatIfLayer.impactZone}
                                onChange={() => setWhatIfLayer((prev) => ({ ...prev, impactZone: !prev.impactZone }))}
                                className="rounded accent-purple-400 w-3 h-3 cursor-pointer"
                              />
                              <span>Impact Buffer Zones</span>
                            </label>

                            <label className="flex items-center gap-2 py-0.5 text-[11px] text-slate-300 hover:text-white cursor-pointer">
                              <input
                                type="checkbox"
                                checked={whatIfLayer.affectedParcels}
                                onChange={() => setWhatIfLayer((prev) => ({ ...prev, affectedParcels: !prev.affectedParcels }))}
                                className="rounded accent-amber-500 w-3 h-3 cursor-pointer"
                              />
                              <span>Affected Parcels</span>
                              <span className="text-[9px] text-amber-400 font-mono ml-auto">Highlights</span>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Access: Risk Radar */}
              <button
                onClick={() => setShowRiskHeatmap(!showRiskHeatmap)}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  showRiskHeatmap
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-800 hover:text-slate-200'
                }`}
                title={showRiskHeatmap ? 'Risk Radar: Enabled' : 'Risk Radar: Disabled'}
                aria-label="Toggle Risk Radar"
              >
                <span className={`w-2 h-2 rounded-full ${showRiskHeatmap ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'}`}></span>
                <span className="hidden sm:inline">Risk Radar</span>
              </button>

              {/* Quick Access: Corridors */}
              <button
                onClick={() => setShowCorridor(!showCorridor)}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  showCorridor
                    ? 'bg-slate-800 text-white border-slate-600 shadow-xs'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-800 hover:text-slate-200'
                }`}
                title={showCorridor ? 'Corridors: Active' : 'Corridors: Inactive'}
                aria-label="Toggle Corridor Alignments"
              >
                <span className={`w-2 h-0.5 ${showCorridor ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
                <span className="hidden md:inline">Corridors</span>
              </button>

              {/* Quick Access: What-If Simulator Overlay */}
              <button
                id="toggle-whatif-nav-btn"
                onClick={() => setWhatIfLayer((prev) => ({ ...prev, visible: !prev.visible }))}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  whatIfLayer.visible
                    ? 'bg-purple-600/30 text-purple-300 border-purple-500/60 shadow-xs ring-1 ring-purple-500/40'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-800 hover:text-slate-200'
                }`}
                title={whatIfLayer.visible ? 'What-If Simulator: Active (Option A & B)' : 'What-If Simulator: Inactive'}
                aria-label="Toggle What-If Simulator Overlay"
              >
                <GitCompare className={`w-3.5 h-3.5 ${whatIfLayer.visible ? 'text-purple-400' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">{whatIfLayer.visible ? 'What-If Simulator ✓' : 'What-If Simulator'}</span>
                <span className="sm:hidden">{whatIfLayer.visible ? 'What-If ✓' : 'What-If'}</span>
              </button>
            </div>

            {/* RIGHT: [ Search / Locate ] [ Reset View ] [ Fullscreen ] */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              
              {/* Search / Locate Button */}
              <button
                onClick={handleLocateProject}
                className="p-1.5 sm:px-2 sm:py-1 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 transition-colors cursor-pointer flex items-center gap-1.5"
                title="Locate Varanasi Corridor (Focus Search / Project Coordinates)"
                aria-label="Search or locate project on map"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden lg:inline">Locate</span>
              </button>

              {/* Reset View Button */}
              <button
                onClick={handleResetView}
                className="p-1.5 sm:px-2 sm:py-1 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 transition-colors cursor-pointer flex items-center gap-1.5"
                title="Reset map view to Varanasi Corridor boundary"
                aria-label="Reset map view"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden lg:inline">Reset</span>
              </button>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 sm:px-2 sm:py-1 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 transition-colors cursor-pointer flex items-center gap-1.5"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                aria-label="Toggle fullscreen map"
              >
                {isFullscreen ? (
                  <Minimize className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Maximize className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {mapLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-xs pointer-events-none transition-opacity duration-300">
            <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-xl shadow-2xl flex items-center gap-3 text-white">
              <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
              <div className="text-xs">
                <p className="font-semibold">Loading satellite imagery & cadastral parcels...</p>
                <p className="text-slate-400 text-[10px]">Google Map Tiles API • MapLibre GL</p>
              </div>
            </div>
          </div>
        )}

        {/* Controlled Error State Overlay */}
        {mapError && (
          <div className="absolute top-18 left-1/2 -translate-x-1/2 z-25 max-w-lg w-[90%] bg-slate-900/95 border border-amber-500/50 rounded-xl p-4 shadow-2xl backdrop-blur-md text-white animate-in fade-in duration-300">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-amber-300">Satellite Imagery Configuration</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">{mapError}</p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                  <span>LAT: 25.3418° N • LON: 82.9412° E</span>
                  <span className="font-mono text-amber-400">VITE_GOOGLE_MAPS_API_KEY</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Graceful Notice for Pending Backend Geographic Geometry */}
        {whatIfLayer.visible && !hasGeographicCorridorGeometry && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-25 bg-slate-900/90 border border-purple-500/40 rounded-xl px-3.5 py-1.5 shadow-2xl backdrop-blur-md text-white flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            <div className="flex items-center gap-1.5">
              <span className="text-purple-300 font-bold">What-If Spatial Alignments:</span>
              <span className="text-slate-300">Awaiting PostGIS/GeoJSON geometry</span>
            </div>
            <span className="text-[10px] text-slate-400 border-l border-slate-700 pl-2">
              {selectedWhatIfFeature === 'option-a' ? '18' : '4'} affected parcels highlighted on map
            </span>
          </div>
        )}

        {/* Hover Tooltip (Positioned over hovered parcel polygon) */}
        {hoveredParcel && (
          <div
            className="fixed pointer-events-none z-50 bg-slate-900/95 text-white p-3 rounded-lg border border-slate-700 shadow-xl text-xs space-y-1 transform -translate-x-1/2 -translate-y-full -mt-3 backdrop-blur-xs"
            style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-extrabold text-white text-sm">{hoveredParcel.id}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  hoveredParcel.riskLevel === 'critical'
                    ? 'bg-rose-600 text-white'
                    : hoveredParcel.riskLevel === 'attention'
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                Risk: {hoveredParcel.riskScore}/100
              </span>
            </div>
            <div className="text-[11px] text-slate-300">
              Survey: <span className="font-semibold text-white">{hoveredParcel.surveyNumber}</span> • {hoveredParcel.village}
            </div>
            <div className="text-[11px] text-slate-300">
              Area: <span className="font-semibold text-white">{hoveredParcel.areaHectares} Ha</span> • {hoveredParcel.landType}
            </div>
            <div className="text-[11px] text-amber-400 font-medium truncate max-w-xs">
              {hoveredParcel.currentStage}
            </div>
          </div>
        )}

        {/* Floating Vertical Zoom Controls (Organized on right side, below the navigation bar) */}
        <div className="absolute right-4 top-18 z-20 flex flex-col bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/80 shadow-2xl overflow-hidden divide-y divide-slate-700/60 text-white">
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-slate-700/80 rounded-t-xl transition-colors cursor-pointer text-slate-200 hover:text-white"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-slate-700/80 transition-colors cursor-pointer text-slate-200 hover:text-white"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            className="p-2 hover:bg-slate-700/80 rounded-b-xl transition-colors cursor-pointer text-slate-200 hover:text-white"
            title="Fit Map to Varanasi Parcel Boundary"
            aria-label="Reset map view"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Fixed Bottom-Left Risk Legend (Strictly Enforced SIH Colors, non-overlapping) */}
        <div className="absolute left-4 bottom-4 z-20 bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-xl text-white backdrop-blur-md text-xs space-y-1.5">
          <div className="font-bold text-slate-200 text-[11px] uppercase tracking-wider flex items-center justify-between gap-4">
            <span>AI Risk Radar Legend</span>
            <span className="text-[10px] text-slate-400">SIH Rules</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#EF4444] shrink-0"></span>
            <span className="text-slate-200 font-medium">🔴 Critical (70–100)</span>
            <span className="text-slate-400 text-[10px] font-mono ml-auto">18 Parcels</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#F59E0B] shrink-0"></span>
            <span className="text-slate-200 font-medium">🟡 Attention (40–69)</span>
            <span className="text-slate-400 text-[10px] font-mono ml-auto">42 Parcels</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#10B981] shrink-0"></span>
            <span className="text-slate-200 font-medium">🟢 Low Risk (0–39)</span>
            <span className="text-slate-400 text-[10px] font-mono ml-auto">88 Parcels</span>
          </div>

          {/* What-If Alignments Legend (Only displayed when What-If Simulator is ON) */}
          {whatIfLayer.visible && (
            <div className="pt-2 mt-2 border-t border-slate-800 space-y-1.5 animate-in fade-in duration-200">
              <div className="font-bold text-slate-300 text-[10px] uppercase tracking-wider flex items-center justify-between">
                <span>What-If Alignments</span>
                <span className="text-purple-400 text-[9px] font-mono">OVERLAY</span>
              </div>

              <div className="flex items-center gap-2 text-[11px]">
                <div className="w-3 h-0.5 border-b-2 border-dashed border-[#EF4444] shrink-0"></div>
                <span className="text-slate-200">● Option A — Original</span>
                <span className="text-[9px] text-rose-400 font-mono ml-auto">18 Parcels</span>
              </div>

              <div className="flex items-center gap-2 text-[11px]">
                <div className="w-3 h-0.5 bg-[#10B981] shrink-0"></div>
                <span className="text-slate-200">● Option B — Optimized</span>
                <span className="text-[9px] text-emerald-400 font-mono ml-auto">4 Parcels</span>
              </div>

              <div className="flex items-center gap-2 text-[11px]">
                <div className="w-3 h-2 bg-purple-500/25 border border-purple-500/60 rounded-xs shrink-0"></div>
                <span className="text-slate-200">▰ Impact Buffer Zone</span>
                <span className="text-[9px] text-purple-400 font-mono ml-auto">Pending GeoJSON</span>
              </div>
            </div>
          )}
        </div>

        {/* Click-to-Inspect Slide-In Side Drawer for Selected Parcel (Quick Spatial Inspector - PRESERVED) */}
        {isDrawerOpen && (
          <div
            id="parcel-slidein-drawer"
            className="absolute right-0 top-0 bottom-0 w-80 sm:w-96 z-40 bg-white shadow-2xl border-l border-slate-200 flex flex-col p-5 overflow-y-auto animate-in slide-in-from-right duration-200"
          >
            {/* Left Edge Collapse Handle Tab */}
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="absolute -left-6 top-1/2 -translate-y-1/2 bg-white border border-r-0 border-slate-300 shadow-md rounded-l-md py-4 px-1 text-slate-500 hover:text-slate-900 hover:bg-slate-50 cursor-pointer flex items-center justify-center transition-colors group"
              title="Collapse Panel"
              aria-label="Collapse Panel"
            >
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-slate-900">{activeParcel.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      activeParcel.riskLevel === 'critical'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : activeParcel.riskLevel === 'attention'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    Risk Score: {activeParcel.riskScore}/100
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  ULPIN: {activeParcel.ulpin}
                </div>
              </div>
            </div>

            {/* Quick Spatial Specs Grid */}
            <div className="grid grid-cols-2 gap-2.5 my-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Survey No.</span>
                <span className="font-bold text-slate-800">{activeParcel.surveyNumber}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Village / Block</span>
                <span className="font-bold text-slate-800 truncate block">{activeParcel.village} ({activeParcel.block})</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Parcel Area</span>
                <span className="font-bold text-slate-800">{activeParcel.areaHectares} Ha <span className="text-slate-400 font-normal">({(activeParcel.areaHectares * 2.471).toFixed(1)} Ac)</span></span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Land Class</span>
                <span className="font-bold text-slate-800">{activeParcel.landType}</span>
              </div>
            </div>

            {/* Lifecycle Current Stage Progress */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-amber-800 uppercase">
                  Active Milestone
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-900">
                  {activeParcel.stageProgressPercent}%
                </span>
              </div>
              <span className="font-bold text-slate-900 block truncate">{activeParcel.currentStage}</span>
              <div className="w-full h-1.5 bg-amber-200 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-amber-600 rounded-full"
                  style={{ width: `${activeParcel.stageProgressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* AI Decision Support Assessment Summary */}
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 mb-3 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>AI Risk Radar</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {activeParcel.riskConfidence}% Conf.
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed text-xs">{activeParcel.riskSummary}</p>

              {/* Active Litigation Callout if present */}
              {activeParcel.legalCase && (
                <div className="mt-2 pt-2 border-t border-slate-200/80 flex items-start gap-1.5 text-[11px] text-rose-800 font-medium">
                  <Scale className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-tight">
                    {activeParcel.legalCase.status}: {activeParcel.legalCase.caseNumber} ({activeParcel.legalCase.court})
                  </span>
                </div>
              )}
            </div>

            {/* Dossier Overview Strip */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center gap-1 text-slate-500 text-[10px] uppercase font-bold mb-0.5">
                  <Users className="w-3 h-3 text-indigo-600" />
                  <span>Title Holders</span>
                </div>
                <div className="font-bold text-slate-900">{activeParcel.owners.length} Registered</div>
                <div className="text-[10px] text-slate-500">{activeParcel.affectedFamilyCount} Affected Families</div>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center gap-1 text-slate-500 text-[10px] uppercase font-bold mb-0.5">
                  <IndianRupee className="w-3 h-3 text-emerald-600" />
                  <span>Compensation</span>
                </div>
                <div className="font-bold text-slate-900">₹{activeParcel.compensation.estimatedAmountCr} Cr</div>
                <div className="text-[10px] text-amber-700 font-medium truncate">{activeParcel.compensation.status}</div>
              </div>
            </div>

            {/* Actions Button Bar */}
            <div className="mt-auto pt-3 border-t border-slate-200 space-y-2">
              <button
                id="drawer-open-digital-twin-btn"
                onClick={() => onNavigateTab('digital-twin')}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Open Complete Digital Twin Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                id="drawer-open-simulator-btn"
                onClick={() => onNavigateTab('simulator')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
              >
                <GitCompare className="w-3.5 h-3.5 text-slate-600" />
                <span>Simulate Route Realignment</span>
              </button>

              {activeParcel.satelliteAlert?.flagged && (
                <button
                  id="drawer-open-satellite-btn"
                  onClick={() => onNavigateTab('satellite')}
                  className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Satellite className="w-3.5 h-3.5 text-rose-600" />
                  <span>Inspect Sentinel-2 Alert</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Slide-In Side Drawer for What-If Simulator Details */}
        {isWhatIfDrawerOpen && (
          <div
            id="whatif-slidein-drawer"
            className="absolute right-0 top-0 bottom-0 w-80 sm:w-96 z-40 bg-white shadow-2xl border-l border-slate-200 flex flex-col p-5 overflow-y-auto animate-in slide-in-from-right duration-200"
          >
            {/* Left Edge Collapse Handle Tab */}
            <button
              onClick={() => setIsWhatIfDrawerOpen(false)}
              className="absolute -left-6 top-1/2 -translate-y-1/2 bg-white border border-r-0 border-slate-300 shadow-md rounded-l-md py-4 px-1 text-slate-500 hover:text-slate-900 hover:bg-slate-50 cursor-pointer flex items-center justify-center transition-colors group"
              title="Collapse What-If Panel"
              aria-label="Collapse What-If Panel"
            >
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1">
                    <GitCompare className="w-3 h-3 text-purple-600" />
                    <span>What-If Simulator</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">GIS Overlay</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {selectedWhatIfFeature === 'option-a' ? 'Option A (Original)' : 'Option B (Optimized)'}
                </h3>
              </div>
              <button
                onClick={() => setIsWhatIfDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Option Switcher Pill Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs my-3">
              <button
                onClick={() => setSelectedWhatIfFeature('option-a')}
                className={`flex-1 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedWhatIfFeature === 'option-a'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-300"></span>
                <span>Option A</span>
              </button>
              <button
                onClick={() => setSelectedWhatIfFeature('option-b')}
                className={`flex-1 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedWhatIfFeature === 'option-b'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
                <span>Option B (Optimized)</span>
              </button>
            </div>

            {/* Decision / Status Banner */}
            {selectedWhatIfFeature === 'option-b' ? (
              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-lg text-xs mb-3">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 uppercase text-[10px] mb-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>Recommended Alignment Decision</span>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed">
                  {whatIfData.optionB.tagline}
                </p>
              </div>
            ) : (
              <div className="p-3 bg-rose-50/80 border border-rose-200 rounded-lg text-xs mb-3">
                <div className="flex items-center gap-1.5 font-bold text-rose-800 uppercase text-[10px] mb-1">
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  <span>Preliminary DPR Alignment (High Exposure)</span>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed">
                  {whatIfData.optionA.tagline}
                </p>
              </div>
            )}

            {/* Executive Comparison Metrics Grid */}
            {(() => {
              const activeOpt = selectedWhatIfFeature === 'option-a' ? whatIfData.optionA : whatIfData.optionB;
              const m = activeOpt.metrics;
              return (
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Feasibility Score</span>
                    <span className={`text-base font-black ${selectedWhatIfFeature === 'option-b' ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {m.feasibilityScore} / 100
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Total Land Outlay</span>
                    <span className="text-base font-black text-slate-900">
                      ₹{m.totalCostCr} Cr
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Affected Families</span>
                    <span className="text-base font-black text-slate-900">
                      {m.affectedFamiliesCount}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Critical Risk Parcels</span>
                    <span className={`text-base font-black ${selectedWhatIfFeature === 'option-b' ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {m.highRiskParcelsCount}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Predicted Delay</span>
                    <span className="text-base font-black text-slate-900">
                      +{m.predictedDelayMonths} Mo
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Total Length</span>
                    <span className="text-base font-black text-slate-900">
                      {m.totalLengthKm} km
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Intersecting Parcels List */}
            {(() => {
              const activeOpt = selectedWhatIfFeature === 'option-a' ? whatIfData.optionA : whatIfData.optionB;
              const affectedList = ALL_PARCELS.filter((p) => activeOpt.affectedParcelIds.includes(p.id));
              return (
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 pb-1 border-b border-slate-200">
                    <span>Intersecting Parcels ({affectedList.length})</span>
                    <span className="text-[10px] text-purple-600 font-mono">Click to inspect</span>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                    {affectedList.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectParcel(p.id);
                          const geo = parcelCoordinatesToGeo(p.coordinates);
                          if (geo.length > 0 && mapRef.current) {
                            mapRef.current.flyTo({ center: geo[0], zoom: 14, duration: 600 });
                          }
                        }}
                        className={`p-2 rounded-md border text-xs cursor-pointer transition-all flex items-center justify-between ${
                          selectedParcelId === p.id
                            ? 'bg-purple-50 border-purple-400 shadow-xs'
                            : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                            <span>{p.id}</span>
                            <span className="text-[10px] font-normal text-slate-500">• {p.village}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Surv: {p.surveyNumber} • {p.areaHectares} Ha
                          </div>
                        </div>

                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            p.riskLevel === 'critical'
                              ? 'bg-rose-100 text-rose-800'
                              : p.riskLevel === 'attention'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.riskLevel === 'critical' ? 'Critical' : p.riskLevel === 'attention' ? 'High Risk' : 'Low Risk'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Actions: View Full Analysis & Open Parcel Inspector */}
            <div className="mt-auto pt-3 border-t border-slate-200 space-y-2">
              <button
                id="whatif-view-full-analysis-btn"
                onClick={() => onNavigateTab('simulator')}
                className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>View Full Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {selectedParcelId && (
                <button
                  onClick={() => {
                    setIsDrawerOpen(true);
                    setIsWhatIfDrawerOpen(false);
                  }}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
                >
                  <Info className="w-3.5 h-3.5 text-slate-600" />
                  <span>Open Selected Parcel Details ({selectedParcelId})</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
