import React, { useState, useMemo } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { Parcel, RiskLevel } from '../../types';
import { ALL_PARCELS, SIMULATOR_CORRIDORS } from '../../data/mockData';
import { NavTab } from '../layout/GovHeader';

interface GisMapViewProps {
  selectedParcelId: string;
  onSelectParcel: (parcelId: string) => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const GisMapView: React.FC<GisMapViewProps> = ({
  selectedParcelId,
  onSelectParcel,
  onNavigateTab,
}) => {
  // Map Layer States
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showCorridor, setShowCorridor] = useState(true);
  const [showRiskHeatmap, setShowRiskHeatmap] = useState(true);
  const [satelliteBasemap, setSatelliteBasemap] = useState(false);

  // Filters
  const [filterVillage, setFilterVillage] = useState<string>('All');
  const [filterLandType, setFilterLandType] = useState<string>('All');
  const [filterRisk, setFilterRisk] = useState<string>('All');

  // Zoom & Pan
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Hovered Parcel for Tooltip
  const [hoveredParcel, setHoveredParcel] = useState<Parcel | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Active selected parcel object
  const activeParcel = useMemo(() => {
    return ALL_PARCELS.find((p) => p.id === selectedParcelId) || ALL_PARCELS[0];
  }, [selectedParcelId]);

  // Filtered parcels
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

  // Color helper according to strict guidelines:
  // 🟢 0-39 (Green / Low), 🟡 40-69 (Yellow / Attention), 🔴 70-100 (Red / Critical)
  const getParcelColor = (parcel: Parcel, isSelected: boolean) => {
    if (!showRiskHeatmap) {
      return isSelected ? '#3B82F6' : '#94A3B8';
    }
    if (parcel.riskLevel === 'critical') return '#EF4444'; // Red
    if (parcel.riskLevel === 'attention') return '#F59E0B'; // Yellow/Amber
    return '#10B981'; // Green
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div id="gis-map-screen" className="relative w-full h-[calc(100vh-130px)] min-h-[580px] bg-slate-900 overflow-hidden flex flex-col">
      
      {/* Top Map Control Bar & Filters */}
      <div className="z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        
        {/* Left: Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>Map Layers:</span>
          </span>

          {/* AI Risk Heatmap Toggle */}
          <button
            onClick={() => setShowRiskHeatmap(!showRiskHeatmap)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              showRiskHeatmap
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${showRiskHeatmap ? 'bg-amber-600' : 'bg-slate-400'}`}></span>
            <span>Risk Classification</span>
          </button>

          {/* Corridor Alignment Toggle */}
          <button
            onClick={() => setShowCorridor(!showCorridor)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              showCorridor
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${showCorridor ? 'bg-emerald-400' : 'bg-slate-400'}`}></span>
            <span>Corridor Alignments</span>
          </button>

          {/* Satellite Imagery Toggle */}
          <button
            onClick={() => setSatelliteBasemap(!satelliteBasemap)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              satelliteBasemap
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Satellite className="w-3.5 h-3.5 text-emerald-700" />
            <span>Satellite Base</span>
          </button>
        </div>

        {/* Right: Filtering Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold">Filter:</span>
          </div>

          {/* Village Filter */}
          <select
            value={filterVillage}
            onChange={(e) => setFilterVillage(e.target.value)}
            aria-label="Filter by Village"
            className="text-xs border border-slate-300 rounded-md px-2 py-1 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          >
            <option value="All">All Villages (4)</option>
            <option value="Rampur">Rampur (High Conflict)</option>
            <option value="Shivpur">Shivpur</option>
            <option value="Babatpur">Babatpur</option>
            <option value="Harahua">Harahua</option>
          </select>

          {/* Land Type Filter */}
          <select
            value={filterLandType}
            onChange={(e) => setFilterLandType(e.target.value)}
            aria-label="Filter by Land Type"
            className="text-xs border border-slate-300 rounded-md px-2 py-1 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
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
            className="text-xs border border-slate-300 rounded-md px-2 py-1 bg-white text-slate-800 font-semibold focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          >
            <option value="All">All Risk Bands</option>
            <option value="critical">🔴 Critical (70–100)</option>
            <option value="attention">🟡 Attention (40–69)</option>
            <option value="low">🟢 Low (0–39)</option>
          </select>

          {/* Showing Count */}
          <span className="text-[11px] text-slate-500 font-mono pl-1">
            {filteredParcels.length} / {ALL_PARCELS.length} Parcels
          </span>
        </div>
      </div>

      {/* SVG GIS Interactive Canvas Container */}
      <div
        className="relative flex-1 cursor-grab active:cursor-grabbing overflow-hidden select-none bg-[#0F172A]"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Simulated Satellite Textured Background when toggled */}
        {satelliteBasemap ? (
          <div className="absolute inset-0 opacity-80 pointer-events-none">
            {/* Realistic aerial satellite pattern texture */}
            <div className="w-full h-full bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-[#0c131f] flex flex-col justify-between p-6">
              <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                <span>SENTINEL-2 MSI • 10M SPATIAL RESOLUTION • FALSE COLOR IR COMPOSITE</span>
                <span>LAT: 25.3418° N • LON: 82.9412° E</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono text-right">
                ISRO BHUVAN & ESA COPERNICUS DATA HUB
              </div>
            </div>
          </div>
        ) : (
          /* Grid basemap */
          <div className="absolute inset-0 bg-[#0F172A] opacity-95">
            <div className="w-full h-full bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px]"></div>
          </div>
        )}

        {/* SVG Drawing Canvas */}
        <svg
          viewBox="0 0 800 480"
          className="w-full h-full transition-transform duration-75 ease-out"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
          }}
        >
          {/* Compass Rose in corner */}
          <g transform="translate(40, 40)" opacity="0.4">
            <circle cx="0" cy="0" r="16" fill="none" stroke="#64748B" strokeWidth="1" />
            <path d="M 0 -14 L 4 -3 L 0 0 L -4 -3 Z" fill="#EF4444" />
            <path d="M 0 14 L 4 3 L 0 0 L -4 3 Z" fill="#94A3B8" />
            <text x="0" y="-18" textAnchor="middle" fill="#CBD5E1" fontSize="9" fontWeight="bold">N</text>
          </g>

          {/* Village Boundary Regions (Semi-transparent background zones) */}
          <g opacity="0.25">
            {/* Rampur Zone */}
            <path d="M 50 60 L 320 50 L 340 360 L 60 380 Z" fill="#3B82F6" stroke="#60A5FA" strokeDasharray="4 4" />
            <text x="140" y="80" fill="#93C5FD" fontSize="11" fontWeight="bold" opacity="0.8">VILLAGE: RAMPUR</text>

            {/* Shivpur Zone */}
            <path d="M 320 50 L 460 40 L 480 340 L 340 360 Z" fill="#10B981" stroke="#34D399" strokeDasharray="4 4" />
            <text x="360" y="80" fill="#6EE7B7" fontSize="11" fontWeight="bold" opacity="0.8">VILLAGE: SHIVPUR</text>

            {/* Babatpur Zone */}
            <path d="M 460 40 L 620 40 L 640 320 L 480 340 Z" fill="#F59E0B" stroke="#FBBF24" strokeDasharray="4 4" />
            <text x="500" y="80" fill="#FCD34D" fontSize="11" fontWeight="bold" opacity="0.8">VILLAGE: BABATPUR</text>

            {/* Harahua Zone */}
            <path d="M 620 40 L 760 50 L 770 330 L 640 320 Z" fill="#8B5CF6" stroke="#A78BFA" strokeDasharray="4 4" />
            <text x="650" y="80" fill="#C4B5FD" fontSize="11" fontWeight="bold" opacity="0.8">VILLAGE: HARAHUA</text>
          </g>

          {/* Project Alignment Corridor Buffer (Option A & B) */}
          {showCorridor && (
            <g>
              {/* Option A Corridor Ribbon (Original Northern Path - Red tinted) */}
              <path
                d={SIMULATOR_CORRIDORS[0].pathCoordinates}
                fill="none"
                stroke="#EF4444"
                strokeWidth="28"
                strokeOpacity="0.2"
                strokeLinecap="round"
              />
              <path
                d={SIMULATOR_CORRIDORS[0].pathCoordinates}
                fill="none"
                stroke="#EF4444"
                strokeWidth="3"
                strokeDasharray="6 4"
              />

              {/* Option B Corridor Ribbon (Optimized Southern Bypass - Emerald tinted) */}
              <path
                d={SIMULATOR_CORRIDORS[1].pathCoordinates}
                fill="none"
                stroke="#10B981"
                strokeWidth="26"
                strokeOpacity="0.2"
                strokeLinecap="round"
              />
              <path
                d={SIMULATOR_CORRIDORS[1].pathCoordinates}
                fill="none"
                stroke="#10B981"
                strokeWidth="3.5"
              />
            </g>
          )}

          {/* Render All Filtered Parcel Polygons */}
          {filteredParcels.map((parcel) => {
            const isSelected = parcel.id === selectedParcelId;
            const pointsString = parcel.coordinates.map((pt) => `${pt[0]},${pt[1]}`).join(' ');
            const color = getParcelColor(parcel, isSelected);

            // Centroid for label
            const avgX = parcel.coordinates.reduce((sum, pt) => sum + pt[0], 0) / parcel.coordinates.length;
            const avgY = parcel.coordinates.reduce((sum, pt) => sum + pt[1], 0) / parcel.coordinates.length;

            return (
              <g
                key={parcel.id}
                className="cursor-pointer group"
                onClick={() => onSelectParcel(parcel.id)}
                onMouseEnter={(e) => {
                  setHoveredParcel(parcel);
                  setTooltipPos({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => setHoveredParcel(null)}
              >
                {/* Parcel Polygon Fill */}
                <polygon
                  points={pointsString}
                  fill={color}
                  fillOpacity={isSelected ? 0.85 : 0.45}
                  stroke={isSelected ? '#FFFFFF' : color}
                  strokeWidth={isSelected ? 2.8 : 1}
                  className="transition-all duration-150 hover:fill-opacity-90"
                />

                {/* Attention indicator ring around hero parcel P-204 */}
                {parcel.id === 'P-204' && (
                  <circle
                    cx={avgX}
                    cy={avgY}
                    r={18}
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="1.8"
                    strokeDasharray="4 2"
                    opacity={0.85}
                  />
                )}

                {/* Parcel Number Text */}
                <text
                  x={avgX}
                  y={avgY + 3}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize={isSelected ? '9' : '8'}
                  fontWeight="bold"
                  className="pointer-events-none select-none drop-shadow-md"
                >
                  {parcel.id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
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

        {/* Zoom & Reset Floating Controls */}
        <div className="absolute right-4 top-4 z-20 flex flex-col gap-1.5 bg-slate-800/90 p-1 rounded-lg border border-slate-700 shadow-lg text-white">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3))}
            className="p-1.5 hover:bg-slate-700 rounded transition-colors"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
            className="p-1.5 hover:bg-slate-700 rounded transition-colors"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-1.5 hover:bg-slate-700 rounded transition-colors"
            title="Reset Map View"
            aria-label="Reset Map View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Fixed Bottom-Left Risk Legend (Strictly Enforced Colors) */}
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

          <div className="pt-1 mt-1 border-t border-slate-800 text-[10px] text-slate-400 flex items-center gap-2">
            <div className="w-3 h-0.5 bg-[#EF4444]"></div>
            <span>Option A (Original)</span>
            <div className="w-3 h-0.5 bg-[#10B981] ml-2"></div>
            <span>Option B (Optimized)</span>
          </div>
        </div>

        {/* Click-to-Inspect Slide-In Side Drawer for Selected Parcel */}
        {activeParcel && (
          <div
            id="parcel-slidein-drawer"
            className="absolute right-0 top-0 bottom-0 w-80 sm:w-96 z-30 bg-white shadow-2xl border-l border-slate-200 flex flex-col p-5 overflow-y-auto animate-in slide-in-from-right duration-200"
          >
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
                    Risk Score: {activeParcel.riskScore}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  ULPIN: {activeParcel.ulpin}
                </div>
              </div>

              <button
                onClick={() => onSelectParcel('')}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"
                aria-label="Close parcel drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 my-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase">Survey No.</span>
                <span className="font-bold text-slate-800">{activeParcel.surveyNumber}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase">Village / Block</span>
                <span className="font-bold text-slate-800">{activeParcel.village} ({activeParcel.block})</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase">Parcel Area</span>
                <span className="font-bold text-slate-800">{activeParcel.areaHectares} Hectares</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase">Land Class</span>
                <span className="font-bold text-slate-800">{activeParcel.landType}</span>
              </div>
            </div>

            {/* Lifecycle Current Stage */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs mb-3">
              <span className="text-[10px] font-bold text-amber-800 uppercase block mb-1">
                Active Acquisition Milestone
              </span>
              <span className="font-bold text-slate-900 block">{activeParcel.currentStage}</span>
              <div className="w-full h-2 bg-amber-200 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-amber-600 rounded-full"
                  style={{ width: `${activeParcel.stageProgressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Decision Support Assessment */}
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 mb-3 text-xs">
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Decision Support Assessment ({activeParcel.riskConfidence}% Confidence)
              </span>
              <p className="text-slate-700 leading-relaxed">{activeParcel.riskSummary}</p>
            </div>

            {/* Primary Owners Preview */}
            <div className="mb-4 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">
                Registered Title Holders ({activeParcel.owners.length})
              </span>
              <div className="space-y-1.5">
                {activeParcel.owners.map((owner) => (
                  <div
                    key={owner.id}
                    className="p-2 rounded border border-slate-200 bg-white flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{owner.name}</div>
                      <div className="text-[10px] text-slate-500">{owner.relation} • Share: {owner.sharePercent}%</div>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        owner.aadhaarStatus === 'Verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {owner.aadhaarStatus}
                    </span>
                  </div>
                ))}
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

              {activeParcel.satelliteAlert?.flagged && (
                <button
                  onClick={() => onNavigateTab('satellite')}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Satellite className="w-3.5 h-3.5 text-amber-600" />
                  <span>Inspect Sentinel-2 Alert</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
