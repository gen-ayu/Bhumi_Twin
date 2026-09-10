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
  ChevronRight,
  ChevronLeft,
  Scale,
  Users,
  IndianRupee,
  GitCompare,
  Sparkles
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

  // Drawer open/close state (by default kept CLOSED until opened manually)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

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
      
      {/* Top Map Control Bar & Filters - Compressed Single Line */}
      <div className="z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 py-1.5 flex items-center justify-between gap-2 shadow-xs overflow-x-auto whitespace-nowrap min-h-[44px]">
        
        {/* Left: Layer Toggles */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1 mr-0.5">
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden xl:inline">Layers:</span>
          </span>

          {/* AI Risk Heatmap Toggle */}
          <button
            onClick={() => setShowRiskHeatmap(!showRiskHeatmap)}
            className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              showRiskHeatmap
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${showRiskHeatmap ? 'bg-amber-600' : 'bg-slate-400'}`}></span>
            <span>Risk Radar</span>
          </button>

          {/* Corridor Alignment Toggle */}
          <button
            onClick={() => setShowCorridor(!showCorridor)}
            className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              showCorridor
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${showCorridor ? 'bg-emerald-400' : 'bg-slate-400'}`}></span>
            <span>Corridors</span>
          </button>

          {/* Satellite Imagery Toggle */}
          <button
            onClick={() => setSatelliteBasemap(!satelliteBasemap)}
            className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              satelliteBasemap
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Satellite className="w-3.5 h-3.5 text-emerald-700" />
            <span>Satellite</span>
          </button>
        </div>

        {/* Center: Filtering Dropdowns */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
            <Filter className="w-3 h-3 text-slate-400" />
            <span className="hidden lg:inline">Filter:</span>
          </div>

          {/* Village Filter */}
          <select
            value={filterVillage}
            onChange={(e) => setFilterVillage(e.target.value)}
            aria-label="Filter by Village"
            className="text-[11px] border border-slate-300 rounded px-1.5 py-0.5 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500 h-7"
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
            className="text-[11px] border border-slate-300 rounded px-1.5 py-0.5 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500 h-7"
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
            {filteredParcels.length}/{ALL_PARCELS.length}
          </span>
        </div>

        {/* Far Right-Hand Corner: Parcel Details Button */}
        <div className="flex items-center shrink-0">
          <button
            id="toggle-inspector-topbar-btn"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
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
                  onClick={() => {
                    onSelectParcel(parcel.id);
                    setIsDrawerOpen(true);
                  }}
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



        {/* Click-to-Inspect Slide-In Side Drawer for Selected Parcel (Quick Spatial Inspector) */}
        {isDrawerOpen && (
          <div
            id="parcel-slidein-drawer"
            className="absolute right-0 top-0 bottom-0 w-80 sm:w-96 z-30 bg-white shadow-2xl border-l border-slate-200 flex flex-col p-5 overflow-y-auto animate-in slide-in-from-right duration-200"
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

            {/* Dossier Overview Strip (Summaries - deep details kept in Digital Twin) */}
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
      </div>
    </div>
  );
};
