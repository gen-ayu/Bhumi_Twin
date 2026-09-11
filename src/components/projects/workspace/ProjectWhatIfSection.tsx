import React, { useState } from 'react';
import {
  GitCompare,
  Sparkles,
  TrendingDown,
  Users,
  IndianRupee,
  Layers,
  AlertTriangle,
  Scale,
  Clock,
  CheckCircle2,
  RefreshCw,
  Award,
  ShieldCheck,
  Eye,
  Sliders,
  Maximize2
} from 'lucide-react';
import { SIMULATOR_CORRIDORS } from '../../../data/mockData';
import { NavTab } from '../../layout/GovHeader';

interface ProjectWhatIfSectionProps {
  onNavigateTab?: (tab: NavTab) => void;
}

export const ProjectWhatIfSection: React.FC<ProjectWhatIfSectionProps> = ({ onNavigateTab }) => {
  const [activeCorridor, setActiveCorridor] = useState<'both' | 'option-a' | 'option-b'>('both');
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const optionA = SIMULATOR_CORRIDORS[0];
  const optionB = SIMULATOR_CORRIDORS[1];

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }, 900);
  };

  return (
    <div id="what-if-corridor-section" className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
      {/* Section Header & Interactive Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
              AI Decision Support System
            </span>
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">
              Multi-Criteria Alignment Optimizer
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight mt-1">
            5. What-If Corridor Simulator & Spatial Alignment Comparison
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Simulate alternative bypass routes to avoid dense habited settlements, contested court parcels, and save public compensation funds.
          </p>
        </div>

        {/* Corridor Controls & Recalculate Button */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setActiveCorridor('both')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                activeCorridor === 'both' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overlay Both
            </button>
            <button
              type="button"
              onClick={() => setActiveCorridor('option-a')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                activeCorridor === 'option-a' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Original (Red)
            </button>
            <button
              type="button"
              onClick={() => setActiveCorridor('option-b')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                activeCorridor === 'option-b' ? 'bg-emerald-700 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              AI Optimized (Green)
            </button>
          </div>

          <button
            type="button"
            onClick={handleRecalculate}
            disabled={isRecalculating}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
            <span>{isRecalculating ? 'Optimizing Corridor...' : 'Re-run Optimization'}</span>
          </button>
        </div>
      </div>

      {showNotification && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Multi-Criteria Spatial Optimization Recomputed: Southern bypass alignment achieves optimal 89/100 feasibility.</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono">Synced 0.2s</span>
        </div>
      )}

      {/* AI Recommendation Banner */}
      <div className="bg-[#0F172A] text-white rounded-xl p-4 sm:p-5 shadow-xs border border-slate-800 border-l-4 border-l-emerald-500 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1">
                <Award className="w-3 h-3" />
                AI RECOMMENDED ALIGNMENT DECISION
              </span>
              <span className="text-slate-300 text-xs font-mono">
                Feasibility Score: <strong className="text-emerald-400">89/100</strong> (vs 68/100)
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
              Recommended Alignment: Corridor Option B (Southern Low-Density Bypass)
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              By adjusting the route curvature 820m south onto low-density uncultivated revenue land, Option B achieves{' '}
              <strong className="text-emerald-400 font-bold">18.0% fewer displaced families (74 fewer households)</strong>, a{' '}
              <strong className="text-emerald-400 font-bold">₹12.7 Crore reduction in compensation outlay</strong>, and avoids 14 out of 18 high-conflict dispute parcels (a{' '}
              <strong className="text-white font-bold">77.7% reduction in litigation injunction exposure</strong>).
            </p>
          </div>

          {/* Savings Metric Chips */}
          <div className="shrink-0 flex items-center gap-2.5 flex-wrap">
            <div className="bg-slate-800/90 border border-slate-700 p-2.5 rounded-lg text-center min-w-[100px]">
              <span className="text-[10px] uppercase text-slate-400 block font-bold">Estimated Savings</span>
              <span className="text-xl font-black text-white">₹12.7 Cr</span>
              <span className="text-[10px] text-emerald-400 block font-semibold">-15.1% Outlay</span>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 p-2.5 rounded-lg text-center min-w-[100px]">
              <span className="text-[10px] uppercase text-slate-400 block font-bold">Families Avoided</span>
              <span className="text-xl font-black text-emerald-400">74 PAPs</span>
              <span className="text-[10px] text-slate-300 block font-semibold">412 → 338</span>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 p-2.5 rounded-lg text-center min-w-[100px]">
              <span className="text-[10px] uppercase text-slate-400 block font-bold">Delay Avoided</span>
              <span className="text-xl font-black text-emerald-400">-4.3 Mo</span>
              <span className="text-[10px] text-slate-300 block font-mono">5.5 Mo → 1.2 Mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Alignment Map: High-Fidelity Realistic SVG Map */}
      <div className="bg-[#0B1329] rounded-xl border border-slate-800 p-4 shadow-md relative overflow-hidden">
        {/* Map Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800/80 text-xs text-white gap-2">
          <div className="flex items-center gap-2 font-bold">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>Interactive Spatial Cadastral Overlay: Corridor Alignment Simulator</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="text-slate-300 font-semibold">Original Alignment (Red - bisects dense core)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-300 font-semibold">AI Recommended Bypass (Green - curved route)</span>
            </div>
          </div>
        </div>

        {/* SVG Mini Map */}
        <div className="w-full h-64 sm:h-80 mt-2 relative">
          <svg viewBox="0 0 820 340" className="w-full h-full select-none">
            <defs>
              <pattern id="cadastral-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#1E293B" strokeWidth="0.8" />
              </pattern>
              {/* Linear Gradients for route glow */}
              <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Cadastral Grid */}
            <rect width="820" height="340" fill="#0B1329" />
            <rect width="820" height="340" fill="url(#cadastral-grid)" opacity="0.6" />

            {/* Revenue Village Sector Blocks */}
            <g opacity="0.5">
              {/* Rampur Zone */}
              <rect x="40" y="30" width="190" height="280" fill="#1E293B" rx="10" stroke="#334155" strokeWidth="1" />
              <text x="135" y="55" fill="#94A3B8" fontSize="11" textAnchor="middle" fontWeight="bold">VILLAGE RAMPUR</text>
              <text x="135" y="70" fill="#64748B" fontSize="9" textAnchor="middle">Dense Agricultural Core & Orchards</text>

              {/* Shivpur Zone */}
              <rect x="250" y="30" width="180" height="280" fill="#1E293B" rx="10" stroke="#334155" strokeWidth="1" />
              <text x="340" y="55" fill="#94A3B8" fontSize="11" textAnchor="middle" fontWeight="bold">VILLAGE SHIVPUR</text>
              <text x="340" y="70" fill="#64748B" fontSize="9" textAnchor="middle">Commercial Strip & Warehouses</text>

              {/* Babatpur Zone */}
              <rect x="450" y="30" width="170" height="280" fill="#1E293B" rx="10" stroke="#334155" strokeWidth="1" />
              <text x="535" y="55" fill="#94A3B8" fontSize="11" textAnchor="middle" fontWeight="bold">VILLAGE BABATPUR</text>
              <text x="535" y="70" fill="#64748B" fontSize="9" textAnchor="middle">Farmland & Airport Proximity</text>

              {/* Harahua Zone */}
              <rect x="640" y="30" width="150" height="280" fill="#1E293B" rx="10" stroke="#334155" strokeWidth="1" />
              <text x="715" y="55" fill="#94A3B8" fontSize="11" textAnchor="middle" fontWeight="bold">VILLAGE HARAHUA</text>
              <text x="715" y="70" fill="#64748B" fontSize="9" textAnchor="middle">Highway Junction & Bypass</text>
            </g>

            {/* High Dispute Cluster in Rampur (Intersects Option A) */}
            <circle cx="160" cy="135" r="38" fill="#EF4444" opacity="0.18" stroke="#EF4444" strokeDasharray="4 3" strokeWidth="1.5" />
            <text x="160" y="132" fill="#FCA5A5" fontSize="9" textAnchor="middle" fontWeight="bold">CRITICAL DISPUTE ZONE</text>
            <text x="160" y="145" fill="#F87171" fontSize="8" textAnchor="middle">Parcel PARCEL-001 & Fruit Orchards</text>

            {/* Commercial Shed Conflict in Shivpur */}
            <circle cx="340" cy="140" r="30" fill="#F59E0B" opacity="0.15" stroke="#F59E0B" strokeDasharray="3 3" />
            <text x="340" y="142" fill="#FCD34D" fontSize="8" textAnchor="middle" fontWeight="bold">COMMERCIAL WAREHOUSE</text>

            {/* Canal Crossing */}
            <path d="M 680 30 Q 690 170, 710 310" fill="none" stroke="#0284C7" strokeWidth="4" opacity="0.4" strokeDasharray="4 2" />
            <text x="705" y="295" fill="#38BDF8" fontSize="8" textAnchor="middle">Drainage Canal</text>

            {/* OPTION A: Original Northern Alignment (Red) */}
            {(activeCorridor === 'both' || activeCorridor === 'option-a') && (
              <g id="option-a-path">
                {/* Wide ROW corridor buffer */}
                <path
                  d="M 50 145 C 160 120, 280 145, 430 135 C 570 125, 680 145, 780 150"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="24"
                  strokeOpacity="0.22"
                  strokeLinecap="round"
                />
                {/* Centerline */}
                <path
                  d="M 50 145 C 160 120, 280 145, 430 135 C 570 125, 680 145, 780 150"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="3.5"
                  strokeDasharray="6 4"
                />
                {/* Waypoints */}
                <circle cx="50" cy="145" r="5" fill="#EF4444" />
                <circle cx="160" cy="132" r="5" fill="#EF4444" />
                <circle cx="430" cy="135" r="5" fill="#EF4444" />
                <circle cx="780" cy="150" r="5" fill="#EF4444" />
                {/* Label */}
                <rect x="180" y="95" width="220" height="20" rx="4" fill="#1E293B" stroke="#EF4444" strokeWidth="1" />
                <text x="290" y="109" fill="#FCA5A5" fontSize="9" textAnchor="middle" fontWeight="bold">
                  Option A: Directly Intersects 18 Dispute Parcels
                </text>
              </g>
            )}

            {/* OPTION B: AI Recommended Southern Bypass (Green - Realistic Curvature) */}
            {(activeCorridor === 'both' || activeCorridor === 'option-b') && (
              <g id="option-b-path">
                {/* Wide ROW corridor buffer */}
                <path
                  d="M 50 210 C 140 270, 260 260, 410 225 C 550 190, 670 210, 780 175"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="26"
                  strokeOpacity="0.28"
                  strokeLinecap="round"
                />
                {/* Centerline with curve */}
                <path
                  d="M 50 210 C 140 270, 260 260, 410 225 C 550 190, 670 210, 780 175"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="4"
                  filter="url(#glow-green)"
                />
                {/* Waypoint markers */}
                <circle cx="50" cy="210" r="5.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="210" cy="263" r="5.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="410" cy="225" r="5.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="780" cy="175" r="5.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
                {/* Label */}
                <rect x="150" y="280" width="260" height="22" rx="4" fill="#064E3B" stroke="#10B981" strokeWidth="1" />
                <text x="280" y="295" fill="#A7F3D0" fontSize="10" textAnchor="middle" fontWeight="bold">
                  Option B: AI Southern Bypass (Only 4 Critical Parcels)
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Option A (Original) Card */}
        <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-rose-500 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                Preliminary DPR Alignment
              </span>
              <h4 className="font-extrabold text-slate-900 text-sm">
                Option A: Original Alignment (Red)
              </h4>
            </div>
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200">
              Feasibility: 68/100
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {optionA.alignmentDescription}
          </p>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Parcels Affected</span>
              <span className="text-base font-black text-slate-900">{optionA.affectedParcelsCount}</span>
              <span className="text-[10px] text-rose-700 block font-semibold">+32 more</span>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Affected PAPs</span>
              <span className="text-base font-black text-rose-900">{optionA.affectedFamiliesCount}</span>
              <span className="text-[10px] text-rose-700 block font-semibold">High displacement</span>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Cost</span>
              <span className="text-base font-black text-slate-900">₹{optionA.totalCostCr} Cr</span>
              <span className="text-[10px] text-rose-700 block font-semibold">Higher solatium</span>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Litigation Parcels</span>
              <span className="text-base font-black text-rose-700">{optionA.highRiskParcelsCount}</span>
              <span className="text-[10px] text-slate-500 block">Critical stay risk</span>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Injunction Suits</span>
              <span className="text-base font-black text-rose-900">9 Suits</span>
              <span className="text-[10px] text-rose-700 block font-semibold">Civil court stay</span>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Delay Risk</span>
              <span className="text-base font-black text-rose-800">+{optionA.predictedDelayMonths} Mo</span>
              <span className="text-[10px] text-rose-700 block font-semibold">5.5 Mo projected</span>
            </div>
          </div>
        </div>

        {/* Option B (AI Recommended) Card */}
        <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-emerald-500 p-4 shadow-2xs space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-bl">
            RECOMMENDED DECISION
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                AI Cadastral Bypass Alignment
              </span>
              <h4 className="font-extrabold text-slate-900 text-sm">
                Option B: Southern Bypass (Green)
              </h4>
            </div>
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
              Feasibility: 89/100
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {optionB.alignmentDescription}
          </p>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Parcels Affected</span>
              <span className="text-base font-black text-slate-900">{optionB.affectedParcelsCount}</span>
              <span className="text-[10px] text-emerald-700 block font-bold">-21.6% fewer</span>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Affected PAPs</span>
              <span className="text-base font-black text-slate-900">{optionB.affectedFamiliesCount}</span>
              <span className="text-[10px] text-emerald-700 block font-bold">-74 Families saved</span>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Cost</span>
              <span className="text-base font-black text-emerald-700">₹{optionB.totalCostCr} Cr</span>
              <span className="text-[10px] text-emerald-700 block font-bold">₹12.7 Cr Saved</span>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Litigation Parcels</span>
              <span className="text-base font-black text-emerald-700">{optionB.highRiskParcelsCount}</span>
              <span className="text-[10px] text-emerald-700 block font-bold">-77.7% drop</span>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Injunction Suits</span>
              <span className="text-base font-black text-emerald-700">1 Case</span>
              <span className="text-[10px] text-emerald-700 block font-bold">Manageable escrow</span>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Delay Risk</span>
              <span className="text-base font-black text-slate-900">+{optionB.predictedDelayMonths} Mo</span>
              <span className="text-[10px] text-emerald-700 block font-bold">-4.3 Mo avoided</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
