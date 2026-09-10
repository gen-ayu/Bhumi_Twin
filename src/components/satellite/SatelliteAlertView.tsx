import React, { useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  Layers,
  ArrowRight,
  ClipboardCheck,
} from 'lucide-react';
import { NavTab } from '../layout/GovHeader';

interface SatelliteAlertViewProps {
  onNavigateTab: (tab: NavTab) => void;
  onSelectParcel: (parcelId: string) => void;
}

// Locked polygon vertices (% of container). Manually positioned by user.
const LOCKED_POINTS = [
  { x: 20.60, y: 9.02 },
  { x: 28.29, y: 13.70 },
  { x: 25.54, y: 29.94 },
  { x: 19.18, y: 24.47 },
];

export const SatelliteAlertView: React.FC<SatelliteAlertViewProps> = ({
  onNavigateTab,
  onSelectParcel,
}) => {
  const [showPolygonOverlay, setShowPolygonOverlay] = useState(true);
  const [sliderPos, setSliderPos] = useState(50);

  const ptStr   = LOCKED_POINTS.map(p => `${p.x},${p.y}`).join(' ');
  const cx      = LOCKED_POINTS.reduce((s, p) => s + p.x, 0) / LOCKED_POINTS.length;
  const bottomY = Math.max(...LOCKED_POINTS.map(p => p.y));

  return (
    <div id="satellite-alert-view" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

      <div className="bg-amber-50/80 border border-slate-200 border-l-4 border-l-amber-600 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 text-amber-900 rounded shrink-0 mt-0.5 border border-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">EARTH OBSERVATION ADVISORY ALERT</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded">Confidence: 91%</span>
            </div>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
              Potential physical change detected on Parcel #P-204 — field verification recommended.
              <span className="block text-[11px] text-slate-500 mt-0.5 font-normal">(Advisory decision support — authorized revenue officials retain final statutory determination under RFCTLARR Act 2013).</span>
            </p>
          </div>
        </div>
        <button
          onClick={() => { onSelectParcel('P-204'); onNavigateTab('verification'); }}
          className="shrink-0 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>Dispatch Field Verification</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-5">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white font-mono">PARCEL #P-204</span>
              <h2 className="text-lg font-extrabold text-slate-900">Sentinel-2 Optical Multispectral Change Detection</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Source: ESA Copernicus Sentinel-2 MSI (10-meter GSD) • ISRO Bhuvan Coregistration</p>
          </div>
          <button
            onClick={() => setShowPolygonOverlay(v => !v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${showPolygonOverlay ? 'bg-rose-100 text-rose-900 border-rose-300' : 'bg-slate-100 text-slate-600 border-slate-200'}`}
          >
            <Layers className="w-3.5 h-3.5 text-rose-600" />
            <span>{showPolygonOverlay ? 'Change Polygon: ON' : 'Change Polygon: OFF'}</span>
          </button>
        </div>

        <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden border-2 border-slate-800 select-none bg-slate-950 shadow-inner">

          {/* Baseline image */}
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('/satellite_baseline.jpg')` }}>
            <div className="absolute inset-0 bg-emerald-950/20" />
            {/* Baseline badge positioned top-right of the baseline layer */}
            <div className="absolute top-3 right-3 bg-slate-900/90 text-white px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold backdrop-blur-sm flex items-center gap-1.5 border border-slate-700 pointer-events-none z-10">
              <Calendar className="w-3 h-3 text-emerald-400" />
              <span>Baseline: 15-JAN-2026</span>
            </div>
          </div>

          {/* Latest pass clipped by slider */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('/satellite_change.jpg')`, clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          >
            <div className="absolute inset-0 bg-amber-950/10" />
            {/* Latest pass badge positioned top-left, compact and non-overlapping */}
            <div className="absolute top-3 left-3 bg-slate-900/90 text-white px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold backdrop-blur-sm flex items-center gap-1.5 border border-slate-700 whitespace-nowrap pointer-events-none z-10">
              <Calendar className="w-3 h-3 text-amber-400" />
              <span>Latest Pass: 18-AUG-2026</span>
            </div>
          </div>

          {/* Locked polygon — always on top, never clipped */}
          {showPolygonOverlay && (
            <>
              <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polygon points={ptStr} fill="rgba(239,68,68,0.15)" stroke="none" />
                <polygon points={ptStr} fill="none" stroke="#f87171" strokeWidth="0.5" strokeDasharray="3 1.5" strokeLinejoin="round">
                  <animate attributeName="stroke-dashoffset" from="0" to="9" dur="1s" repeatCount="indefinite" />
                </polygon>
                <polygon points={ptStr} fill="none" stroke="#ef4444" strokeWidth="0.25" strokeLinejoin="round" />
              </svg>
              <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none animate-pulse" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <filter id="poly-glow">
                    <feGaussianBlur stdDeviation="0.8" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <polygon points={ptStr} fill="none" stroke="rgba(239,68,68,0.5)" strokeWidth="1.2" filter="url(#poly-glow)" />
              </svg>
              {/* Badge placed directly below the polygon pointing up with ▲ */}
              <div className="absolute z-10 pointer-events-none" style={{ left: `${cx}%`, top: `${bottomY}%`, transform: 'translate(-50%, 8px)' }}>
                <div className="whitespace-nowrap flex items-center gap-1.5 bg-rose-700/95 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-md shadow-xl border border-rose-400 backdrop-blur-sm">
                  <span className="text-rose-200">▲</span> ILLEGAL STRUCTURE · P-204
                </div>
              </div>
            </>
          )}

          {/* Slider bar */}
          <div className="absolute top-0 bottom-0 w-[2px] bg-amber-400 shadow-[0_0_8px_2px_rgba(251,191,36,0.6)] pointer-events-none z-20" style={{ left: `calc(${sliderPos}% - 1px)` }}>
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-amber-500 text-white shadow-xl flex items-center justify-center font-bold text-sm border-[3px] border-white">⇄</div>
            <div className="absolute top-2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-amber-400" />
            <div className="absolute bottom-2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-amber-400" />
          </div>

          {/* Range input — z-30 above polygon (polygon is pointer-events-none so no conflict) */}
          <input
            type="range" min="0" max="100" value={sliderPos}
            onChange={e => setSliderPos(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            title="Drag to compare baseline vs latest pass"
          />

          <div className="absolute bottom-3 right-3 bg-slate-900/90 text-slate-300 px-3 py-1.5 rounded-lg text-[10px] font-mono border border-slate-700 pointer-events-none z-20 flex items-center gap-2">
            <span className="text-emerald-400">◀ BEFORE</span>
            <span className="text-slate-500">|</span>
            <span className="text-amber-400">AFTER ▶</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">NDVI (Vegetation Index)</span>
            <div className="flex items-baseline gap-2 mt-1"><span className="text-xl font-black text-rose-700">-42.4%</span><span className="text-xs text-slate-500">Vegetation Clearance</span></div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden"><div className="h-full bg-rose-500 w-3/5" /></div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">NDBI (Built-up Impervious Index)</span>
            <div className="flex items-baseline gap-2 mt-1"><span className="text-xl font-black text-amber-700">+68.1%</span><span className="text-xs text-slate-500">Masonry Reflectance</span></div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden"><div className="h-full bg-amber-500 w-4/5" /></div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Model Diagnostic</span>
            <div className="flex items-baseline gap-2 mt-1"><span className="text-sm font-black text-slate-900">Unapproved Wall</span><span className="text-xs font-bold text-emerald-600">91% Conf</span></div>
            <p className="text-[10px] text-slate-500 mt-1">Confirmed discrepancy with RoR agricultural baseline.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
