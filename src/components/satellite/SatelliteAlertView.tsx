import React, { useState } from 'react';
import {
  Satellite,
  AlertTriangle,
  Sliders,
  Calendar,
  Layers,
  ArrowRight,
  ClipboardCheck,
  Sparkles,
  Eye,
  CheckCircle2,
  Info
} from 'lucide-react';
import { NavTab } from '../layout/GovHeader';

interface SatelliteAlertViewProps {
  onNavigateTab: (tab: NavTab) => void;
  onSelectParcel: (parcelId: string) => void;
}

export const SatelliteAlertView: React.FC<SatelliteAlertViewProps> = ({
  onNavigateTab,
  onSelectParcel,
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // 0 to 100 for before/after comparison
  const [showPolygonOverlay, setShowPolygonOverlay] = useState(true);

  return (
    <div id="satellite-alert-view" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Top Banner: Advisory Notice (Exact requirement from prompt) */}
      <div className="bg-amber-50/80 border border-slate-200 border-l-4 border-l-amber-600 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 text-amber-900 rounded shrink-0 mt-0.5 border border-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                EARTH OBSERVATION ADVISORY ALERT
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.2 rounded">
                Confidence: 91%
              </span>
            </div>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
              Potential physical change detected on Parcel #P-204 — field verification recommended.
              <span className="block text-[11px] text-slate-500 mt-0.5 font-normal">
                (Advisory decision support — authorized revenue officials retain final statutory determination under RFCTLARR Act 2013).
              </span>
            </p>
          </div>
        </div>

        {/* Action Button: Dispatch to Field Verification */}
        <button
          onClick={() => {
            onSelectParcel('P-204');
            onNavigateTab('verification');
          }}
          className="shrink-0 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>Dispatch Field Verification</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Satellite Comparison Workspace */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white font-mono">
                PARCEL #P-204
              </span>
              <h2 className="text-lg font-extrabold text-slate-900">
                Sentinel-2 Optical Multispectral Change Detection
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Source: ESA Copernicus Sentinel-2 MSI (10-meter Ground Sampling Distance) • ISRO Bhuvan Coregistration
            </p>
          </div>

          {/* Toggle Change Overlay */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPolygonOverlay(!showPolygonOverlay)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                showPolygonOverlay
                  ? 'bg-rose-100 text-rose-900 border-rose-300'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-rose-600" />
              <span>{showPolygonOverlay ? 'Change Polygon: ON' : 'Change Polygon: OFF'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Before/After Split Viewer */}
        <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden border-2 border-slate-800 select-none bg-slate-950 shadow-inner">
          
          {/* Baseline Background (Jan 2026 - Pristine Farmland) */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80')`,
            }}
          >
            {/* Dark green agricultural tint overlay */}
            <div className="absolute inset-0 bg-emerald-950/30"></div>

            <div className="absolute top-4 left-4 bg-slate-900/85 text-white px-3 py-1.5 rounded-lg text-xs font-mono font-bold backdrop-blur-xs flex items-center gap-2 border border-slate-700">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Baseline: 15-JAN-2026 (Gazette Date)</span>
            </div>
          </div>

          {/* Latest Pass Overlay (Aug 2026 - Earthwork & Masonry) Clipped by Slider */}
          <div
            className="absolute inset-0 bg-cover bg-center overflow-hidden border-r-2 border-amber-400 shadow-2xl"
            style={{
              width: `${sliderPos}%`,
              backgroundImage: `url('https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1200&q=80')`,
            }}
          >
            <div className="absolute inset-0 bg-amber-950/20 w-[100vw]"></div>

            <div className="absolute top-4 left-4 bg-slate-900/85 text-white px-3 py-1.5 rounded-lg text-xs font-mono font-bold backdrop-blur-xs flex items-center gap-2 border border-slate-700 whitespace-nowrap">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Latest Pass: 18-AUG-2026 (Sentinel-2 MSI)</span>
            </div>

            {/* Pulsing Discrepancy Change Polygon on Latest Pass */}
            {showPolygonOverlay && (
              <div className="absolute top-1/3 left-1/4 w-32 h-28 border-2 border-rose-500 bg-rose-500/30 rounded-lg animate-pulse flex items-center justify-center">
                <span className="text-[10px] font-mono font-bold text-white bg-rose-700 px-1.5 py-0.5 rounded shadow-sm">
                  +SURFACE CONSTR
                </span>
              </div>
            )}
          </div>

          {/* Slider Divider Bar */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-lg pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-500 text-white shadow-xl flex items-center justify-center font-bold text-xs border-2 border-white">
              ⇄
            </div>
          </div>

          {/* Invisible Interactive Range Input over the entire image */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            title="Drag left/right to compare baseline vs latest pass"
          />

          {/* Micro Legend in bottom right */}
          <div className="absolute bottom-3 right-3 bg-slate-900/90 text-slate-300 p-2 rounded-lg text-[10px] font-mono border border-slate-700 pointer-events-none">
            DRAG SLIDER HORIZONTALLY TO COMPARE BEFORE & AFTER
          </div>
        </div>

        {/* Change Detection Spectral Indices & Telemetry Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">
              NDVI (Vegetation Index)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-black text-rose-700">-42.4%</span>
              <span className="text-xs text-slate-500">Vegetation Clearance</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-rose-500 w-3/5"></div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">
              NDBI (Built-up Impervious Index)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-black text-amber-700">+68.1%</span>
              <span className="text-xs text-slate-500">Masonry Reflectance</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-amber-500 w-4/5"></div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">
              Model Diagnostic
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-sm font-black text-slate-900">Unapproved Wall</span>
              <span className="text-xs font-bold text-emerald-600">91% Conf</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Confirmed discrepancy with RoR agricultural baseline.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
