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
  ArrowRight,
  RefreshCw,
  Award,
  Sliders
} from 'lucide-react';
import { WHAT_IF_OPTIONS, WHAT_IF_COMPARISON_SUMMARY } from '../../data/whatIfData';
import { NavTab } from '../layout/GovHeader';

interface WhatIfSimulatorProps {
  onNavigateTab: (tab: NavTab) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ onNavigateTab }) => {
  const [activeCorridor, setActiveCorridor] = useState<'both' | 'option-a' | 'option-b'>('both');
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [appliedWeight, setAppliedWeight] = useState<'balanced' | 'min-displacement' | 'min-cost'>('balanced');

  const optionA = WHAT_IF_OPTIONS.optionA;
  const optionB = WHAT_IF_OPTIONS.optionB;

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
    }, 800);
  };

  return (
    <div id="what-if-corridor-simulator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header & Simulator Control Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200 uppercase tracking-wider">
              Decision Support System
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Multi-Criteria Alignment Optimizer
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            What-If Corridor Alignment Simulator
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Simulate alternate spatial routes to minimize household displacement, legal litigation disputes, and budgetary acquisition outlay.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center bg-slate-100 p-1 rounded-md border border-slate-200 text-xs">
            <button
              onClick={() => setActiveCorridor('both')}
              className={`px-3 py-1.5 rounded font-bold transition-all cursor-pointer ${
                activeCorridor === 'both' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overlay Both
            </button>
            <button
              onClick={() => setActiveCorridor('option-a')}
              className={`px-3 py-1.5 rounded font-bold transition-all cursor-pointer ${
                activeCorridor === 'option-a' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Option A (Original)
            </button>
            <button
              onClick={() => setActiveCorridor('option-b')}
              className={`px-3 py-1.5 rounded font-bold transition-all cursor-pointer ${
                activeCorridor === 'option-b' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Option B (Optimized)
            </button>
          </div>

          <button
            onClick={handleRecalculate}
            disabled={isRecalculating}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
            <span>{isRecalculating ? 'Calculating Cost & R&R...' : 'Re-run Optimization'}</span>
          </button>
        </div>
      </div>

      {/* HIGHLIGHTED EXECUTIVE RECOMMENDATION BANNER (Authoritative Navy + Emerald Accent) */}
      <div className="bg-[#0f172a] text-white rounded-lg p-5 shadow-sm border border-slate-700 border-l-4 border-l-emerald-500 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1">
                <Award className="w-3 h-3" />
                RECOMMENDED ALIGNMENT DECISION
              </span>
              <span className="text-slate-300 text-xs font-mono">
                Feasibility Score: {optionB.feasibilityScore}/100
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Recommended Alignment: {optionB.name}
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              By shifting the corridor curvature 820m south onto low-density uncultivated revenue land, Option B yields{' '}
              <strong className="text-emerald-400 font-bold">{Math.abs(WHAT_IF_COMPARISON_SUMMARY.familiesDisplacedReductionPercent)}% fewer displaced families ({WHAT_IF_COMPARISON_SUMMARY.familiesDisplacedAvoided} fewer households)</strong>, a{' '}
              <strong className="text-emerald-400 font-bold">₹{WHAT_IF_COMPARISON_SUMMARY.costSavingsCr} Crore reduction in compensation budget</strong>, and cuts high-risk litigation parcels from {optionA.highRiskParcelsCount} to {optionB.highRiskParcelsCount} (a{' '}
              <strong className="text-white font-bold">{Math.abs(WHAT_IF_COMPARISON_SUMMARY.highRiskReductionPercent)}% reduction in legal injunction exposure</strong>).
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <div className="bg-slate-800/90 border border-slate-700 p-3 rounded-lg text-center min-w-[110px]">
              <span className="text-[10px] uppercase text-slate-400 block font-bold">Estimated Savings</span>
              <span className="text-2xl font-black text-white">₹{WHAT_IF_COMPARISON_SUMMARY.costSavingsCr} Cr</span>
              <span className="text-[10px] text-emerald-400 block font-semibold">{WHAT_IF_COMPARISON_SUMMARY.costSavingsPercent}% Total Outlay</span>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 p-3 rounded-lg text-center min-w-[110px]">
              <span className="text-[10px] uppercase text-slate-400 block font-bold">Delay Avoided</span>
              <span className="text-2xl font-black text-emerald-400">-{WHAT_IF_COMPARISON_SUMMARY.delayAvoidedMonths} Mo</span>
              <span className="text-[10px] text-slate-300 block font-mono">{WHAT_IF_COMPARISON_SUMMARY.delayOptionAMonths} Mo → {WHAT_IF_COMPARISON_SUMMARY.delayOptionBMonths} Mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Alignment Comparison: Interactive Mini-Map */}
      <div className="bg-[#0F172A] rounded-xl border border-slate-700 p-4 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-white">
          <div className="flex items-center gap-2 font-bold">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>Spatial Cadastral Overlay: Corridor Alignments Over Parcel Cadastre</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="text-slate-300 font-semibold">{optionA.shortName} (Original - bisects Rampur core)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-300 font-semibold">{optionB.shortName} (AI Bypass - shifts south)</span>
            </div>
          </div>
        </div>

        {/* SVG Mini Map */}
        <div className="w-full h-56 sm:h-72 mt-2 relative">
          <svg viewBox="0 0 740 320" className="w-full h-full">
            {/* Background Grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="740" height="320" fill="url(#grid)" />

            {/* Village zones representation */}
            <rect x="40" y="30" width="180" height="260" fill="#1E293B" opacity="0.4" rx="8" />
            <text x="130" y="55" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="bold">VILLAGE RAMPUR (Dense)</text>

            <rect x="230" y="30" width="160" height="260" fill="#1E293B" opacity="0.4" rx="8" />
            <text x="310" y="55" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="bold">SHIVPUR (Residential)</text>

            <rect x="400" y="30" width="160" height="260" fill="#1E293B" opacity="0.4" rx="8" />
            <text x="480" y="55" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="bold">BABATPUR (Farmland)</text>

            <rect x="570" y="30" width="140" height="260" fill="#1E293B" opacity="0.4" rx="8" />
            <text x="640" y="55" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="bold">HARAHUA (Bypass)</text>

            {/* High-conflict cluster zone in Rampur (Avoided by Option B) */}
            <circle cx="160" cy="140" r="32" fill="#EF4444" opacity="0.2" stroke="#EF4444" strokeDasharray="3 3" />
            <text x="160" y="142" fill="#FCA5A5" fontSize="8" textAnchor="middle" fontWeight="bold">PARCEL-001 & ORCHARD DISPUTE</text>

            {/* Option A Corridor (Red) */}
            {(activeCorridor === 'both' || activeCorridor === 'option-a') && (
              <g>
                <path
                  d={optionA.pathCoordinates}
                  fill="none"
                  stroke={optionA.color}
                  strokeWidth="20"
                  strokeOpacity="0.25"
                  strokeLinecap="round"
                />
                <path
                  d={optionA.pathCoordinates}
                  fill="none"
                  stroke={optionA.strokeColor || '#EF4444'}
                  strokeWidth="3.5"
                  strokeDasharray="6 4"
                />
                <circle cx="60" cy="180" r="5" fill={optionA.color} />
                <circle cx="680" cy="180" r="5" fill={optionA.color} />
                <text x="210" y="130" fill={optionA.color} fontSize="10" fontWeight="bold">
                  {optionA.shortName}: Intersects {optionA.highRiskParcelsCount} Critical Parcels
                </text>
              </g>
            )}

            {/* Option B Corridor (Emerald Green) */}
            {(activeCorridor === 'both' || activeCorridor === 'option-b') && (
              <g>
                <path
                  d={optionB.pathCoordinates}
                  fill="none"
                  stroke={optionB.color}
                  strokeWidth="22"
                  strokeOpacity="0.25"
                  strokeLinecap="round"
                />
                <path
                  d={optionB.pathCoordinates}
                  fill="none"
                  stroke={optionB.strokeColor || '#10B981'}
                  strokeWidth="4"
                />
                <circle cx="60" cy="210" r="5" fill={optionB.color} />
                <circle cx="680" cy="200" r="5" fill={optionB.color} />
                <text x="240" y="270" fill="#34D399" fontSize="10" fontWeight="bold">
                  {optionB.shortName}: Southern Bypass (Only {optionB.highRiskParcelsCount} Critical Parcels)
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Side-by-Side Comparison Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Option A Detailed Card */}
        <div className="bg-white rounded-lg border border-slate-200 border-l-4 border-l-rose-500 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                Preliminary DPR Alignment
              </span>
              <h3 className="font-extrabold text-slate-900 text-lg">
                Option A: Original Northern Route
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 font-mono">
              Score: 68/100
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {optionA.alignmentDescription}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Parcels Affected</span>
              <span className="text-xl font-black text-slate-900">{optionA.affectedParcelsCount}</span>
              <span className="text-[10px] text-rose-700 block font-semibold">+32 more parcels</span>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Affected Families</span>
              <span className="text-xl font-black text-rose-900">{optionA.affectedFamiliesCount}</span>
              <span className="text-[10px] text-rose-700 block font-semibold">High displacement</span>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Total Land Outlay</span>
              <span className="text-xl font-black text-slate-900">₹{optionA.totalCostCr} Cr</span>
              <span className="text-[10px] text-rose-700 block font-semibold">Circle rate + solatium</span>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Critical Risk Parcels</span>
              <span className="text-xl font-black text-rose-700">{optionA.highRiskParcelsCount}</span>
              <span className="text-[10px] text-slate-500 block">Litigation & disputes</span>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Injunction Suits</span>
              <span className="text-xl font-black text-rose-900">{optionA.injunctionSuitsCount} Cases</span>
              <span className="text-[10px] text-rose-700 block font-semibold">Stay risk high</span>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Delay Prediction</span>
              <span className="text-xl font-black text-rose-800">+{optionA.predictedDelayMonths} Mo</span>
              <span className="text-[10px] text-rose-700 block font-semibold">Critical path delay</span>
            </div>
          </div>
        </div>

        {/* Option B Detailed Card (RECOMMENDED) */}
        <div className="bg-white rounded-lg border border-slate-200 border-l-4 border-l-emerald-500 p-5 shadow-xs space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-bl">
            RECOMMENDED
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                Alternative Alignment Bypass
              </span>
              <h3 className="font-extrabold text-slate-900 text-lg">
                {optionB.name}
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
              Score: {optionB.feasibilityScore}/100
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {optionB.alignmentDescription}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Parcels Affected</span>
              <span className="text-xl font-black text-slate-900">{optionB.affectedParcelsCount}</span>
              <span className="text-[10px] text-emerald-700 block font-bold">
                {optionA.affectedParcelsCount - optionB.affectedParcelsCount} fewer
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Affected Families</span>
              <span className="text-xl font-black text-slate-900">{optionB.affectedFamiliesCount}</span>
              <span className="text-[10px] text-emerald-700 block font-bold">
                {WHAT_IF_COMPARISON_SUMMARY.familiesDisplacedReductionPercent}% displaced
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Total Land Outlay</span>
              <span className="text-xl font-black text-slate-900">₹{optionB.totalCostCr} Cr</span>
              <span className="text-[10px] text-emerald-700 block font-bold">₹{WHAT_IF_COMPARISON_SUMMARY.costSavingsCr} Cr Saved</span>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Critical Risk Parcels</span>
              <span className="text-xl font-black text-slate-900">{optionB.highRiskParcelsCount}</span>
              <span className="text-[10px] text-emerald-700 block font-bold">{WHAT_IF_COMPARISON_SUMMARY.highRiskReductionPercent}% drop</span>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Injunction Suits</span>
              <span className="text-xl font-black text-slate-900">{optionB.injunctionSuitsCount} Case</span>
              <span className="text-[10px] text-emerald-700 block font-bold">Minimal stay risk</span>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Delay Prediction</span>
              <span className="text-xl font-black text-slate-900">+{optionB.predictedDelayMonths} Mo</span>
              <span className="text-[10px] text-emerald-700 block font-bold">Schedule secured</span>
            </div>
          </div>
        </div>

      </div>

      {/* Comparative Bar Chart Visualization Component */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-emerald-600" />
          <span>Relative Metric Comparison (Option A vs Option B)</span>
        </h3>

        <div className="space-y-4 text-xs">
          {/* Families Displaced */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-800">Displaced Families (R&R Exposure)</span>
              <span className="font-mono text-slate-600">
                Option A: {optionA.affectedFamiliesCount} vs Option B: {optionB.affectedFamiliesCount} (-{WHAT_IF_COMPARISON_SUMMARY.familiesDisplacedAvoided} families)
              </span>
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-rose-500"
                style={{ width: `${(optionA.affectedFamiliesCount / (optionA.affectedFamiliesCount + optionB.affectedFamiliesCount)) * 100}%` }}
                title={`Option A: ${optionA.affectedFamiliesCount}`}
              ></div>
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${(optionB.affectedFamiliesCount / (optionA.affectedFamiliesCount + optionB.affectedFamiliesCount)) * 100}%` }}
                title={`Option B: ${optionB.affectedFamiliesCount}`}
              ></div>
            </div>
          </div>

          {/* Acquisition Cost */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-800">Compensation Outlay (in ₹ Crores)</span>
              <span className="font-mono text-slate-600">
                Option A: ₹{optionA.totalCostCr} Cr vs Option B: ₹{optionB.totalCostCr} Cr (-₹{WHAT_IF_COMPARISON_SUMMARY.costSavingsCr} Cr)
              </span>
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-rose-500"
                style={{ width: `${(optionA.totalCostCr / (optionA.totalCostCr + optionB.totalCostCr)) * 100}%` }}
              ></div>
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${(optionB.totalCostCr / (optionA.totalCostCr + optionB.totalCostCr)) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* High Risk Parcels */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-800">High Risk Litigation Parcels</span>
              <span className="font-mono text-slate-600">
                Option A: {optionA.highRiskParcelsCount} parcels vs Option B: {optionB.highRiskParcelsCount} parcels ({WHAT_IF_COMPARISON_SUMMARY.highRiskReductionPercent}%)
              </span>
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-rose-500"
                style={{ width: `${(optionA.highRiskParcelsCount / (optionA.highRiskParcelsCount + optionB.highRiskParcelsCount)) * 100}%` }}
              ></div>
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${(optionB.highRiskParcelsCount / (optionA.highRiskParcelsCount + optionB.highRiskParcelsCount)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
