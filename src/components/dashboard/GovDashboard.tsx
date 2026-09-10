import React from 'react';
import {
  Layers,
  Users,
  AlertTriangle,
  IndianRupee,
  Home,
  Scale,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Bell,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Eye,
  GitCompare,
  Satellite
} from 'lucide-react';
import { CURRENT_PROJECT, ALL_PARCELS, NOTIFICATIONS_FEED } from '../../data/mockData';
import { NavTab } from '../layout/GovHeader';
import { useLanguage } from '../../context/LanguageContext';

interface GovDashboardProps {
  onNavigateTab: (tab: NavTab) => void;
  onSelectParcel: (parcelId: string) => void;
}

export const GovDashboard: React.FC<GovDashboardProps> = ({ onNavigateTab, onSelectParcel }) => {
  const { t, language } = useLanguage();
  const highRiskParcels = ALL_PARCELS.filter((p) => p.riskLevel === 'critical');
  const attentionParcels = ALL_PARCELS.filter((p) => p.riskLevel === 'attention');
  const lowRiskParcels = ALL_PARCELS.filter((p) => p.riskLevel === 'low');

  // Health Score: 68/100 (Attention)
  const healthScore = 68;

  return (
    <div id="gov-dashboard-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Project Banner & Executive Context Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {t('Active Project #01')}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ID: {CURRENT_PROJECT.code}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-medium">
              {t('District')}: {CURRENT_PROJECT.district}, {CURRENT_PROJECT.state}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1.5 tracking-tight">
            {language === 'hi' ? CURRENT_PROJECT.nameHindi : CURRENT_PROJECT.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('Nodal Authority')}: {CURRENT_PROJECT.nodalOfficer} • {t('Length')}: {CURRENT_PROJECT.totalLengthKm} km • {t('Target Possession')}: {CURRENT_PROJECT.targetCompletion}
          </p>
        </div>

        {/* Action Buttons to Jump Instantly */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            id="dash-jump-gis-btn"
            onClick={() => onNavigateTab('gis-map')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>{t('Open GIS Spatial Map')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            id="dash-jump-simulator-btn"
            onClick={() => onNavigateTab('simulator')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all cursor-pointer"
          >
            <GitCompare className="w-4 h-4 text-emerald-600" />
            <span>{t('What-If Corridor Simulator')}</span>
          </button>
        </div>
      </div>

      {/* Control-Room KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Parcels */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('Total Parcels')}</span>
            <Layers className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {CURRENT_PROJECT.totalParcels}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {t('Across 4 Revenue Villages')}
          </div>
        </div>

        {/* Affected Families */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('Affected Families')}</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {CURRENT_PROJECT.totalAffectedFamilies}
          </div>
          <div className="text-[11px] text-indigo-700 mt-1 font-medium">
            {t('344 Landowners + 68 Tenants')}
          </div>
        </div>

        {/* High-Risk Parcels (RED TINTED) */}
        <div
          onClick={() => {
            onSelectParcel('P-204');
            onNavigateTab('gis-map');
          }}
          className="bg-rose-50/80 p-4 rounded-xl border-2 border-rose-300 shadow-xs hover:border-rose-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-700 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              {t('High-Risk Parcels')}
            </span>
            <span className="text-[10px] bg-rose-600 text-white font-bold px-1.5 py-0.5 rounded">
              {t('CRITICAL', 'गंभीर')}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-900">
            {highRiskParcels.length}
          </div>
          <div className="text-[11px] text-rose-800 mt-1 flex items-center justify-between font-medium">
            <span>{t('Click to inspect on map')}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Pending Compensation */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('Pending Compensation')}</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            ₹42.8 <span className="text-base font-semibold text-slate-500">{t('Cr')}</span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-medium">
            ₹41.4 {t('Cr')} {t('already disbursed')} (49%)
          </div>
        </div>

        {/* Pending R&R */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('Pending R&R')}</span>
            <Home className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            68 <span className="text-base font-semibold text-slate-500">{t('Families')}</span>
          </div>
          <div className="text-[11px] text-amber-800 mt-1 font-medium">
            {t('Resettlement site in Babatpur Sector 4')}
          </div>
        </div>

        {/* Open Legal Cases */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('Legal Injunctions')}</span>
            <Scale className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            09 <span className="text-base font-semibold text-slate-500">{t('Cases')}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {t('District Court & High Court writs')}
          </div>
        </div>

        {/* Predicted Delays */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('Predicted Delay')}</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700">
            +4.2 <span className="text-base font-semibold text-slate-500">{t('Mo')}</span>
          </div>
          <div className="text-[11px] text-amber-800 mt-1 font-medium">
            {t('Mitigated to +1.2 Mo with Option B')}
          </div>
        </div>

        {/* Satellite Alert Flag */}
        <div
          onClick={() => onNavigateTab('satellite')}
          className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              <Satellite className="w-4 h-4 text-amber-600" />
              {t('Satellite Alerts')}
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-1.5 py-0.5 rounded">
              {t('1 NEW')}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            01 <span className="text-base font-semibold text-slate-500">{t('Flag')}</span>
          </div>
          <div className="text-[11px] text-amber-800 mt-1 flex items-center justify-between font-medium">
            <span>{t('Earthwork on #P-204')}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main Analytics Row: Project Health Score Gauge + Risk Distribution + Decision Alerts Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col (5 cols): Circular Project Health Score Gauge + Risk Distribution */}
        <div className="lg:col-span-5 space-y-6">
          {/* Health Score Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>{t('Overall Project Health Index')}</span>
              </h3>
              <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                {t('Attention Required (40–69)')}
              </span>
            </div>

            {/* Circular Gauge Representation */}
            <div className="flex items-center justify-center py-2">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  {/* Background Track */}
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    stroke="#E2E8F0"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  {/* Active Arc (68%) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    stroke="#D97706"
                    strokeWidth="10"
                    strokeDasharray={301.6}
                    strokeDashoffset={301.6 * (1 - healthScore / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-black text-slate-900">{healthScore}</span>
                  <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
                    {t('Score / 100')}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                    {t('Moderate Bottlenecks')}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 text-center mt-2 leading-relaxed">
              {t('Based on composite cadastral velocity, court injunction volume, DBT payment rate, and forest clearance timeline.')}
            </p>
          </div>

          {/* Mini Risk Distribution Card */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                {t('Cadastral Risk Classification Distribution')}
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {CURRENT_PROJECT.totalParcels} {t('Total Parcels')}
              </span>
            </div>

            <div className="space-y-3">
              {/* Green: Low Risk (0-39) */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    {t('Low Risk (0–39) — Clear Title & Flow')}
                  </span>
                  <span className="font-bold text-slate-900">
                    {lowRiskParcels.length} <span className="text-slate-400 font-normal">({Math.round((lowRiskParcels.length / ALL_PARCELS.length) * 100)}%)</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${(lowRiskParcels.length / ALL_PARCELS.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Yellow: Attention (40-69) */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-amber-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    {t('Attention (40–69) — Verification / R&R')}
                  </span>
                  <span className="font-bold text-slate-900">
                    {attentionParcels.length} <span className="text-slate-400 font-normal">({Math.round((attentionParcels.length / ALL_PARCELS.length) * 100)}%)</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${(attentionParcels.length / ALL_PARCELS.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Red: Critical (70-100) */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-rose-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    {t('Critical (70–100) — Injunctions / Disputes')}
                  </span>
                  <span className="font-bold text-rose-900">
                    {highRiskParcels.length} <span className="text-slate-400 font-normal">({Math.round((highRiskParcels.length / ALL_PARCELS.length) * 100)}%)</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${(highRiskParcels.length / ALL_PARCELS.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Quick Filter Jump */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">{t('Highlight high risks on GIS:')}</span>
              <button
                onClick={() => {
                  onSelectParcel('P-204');
                  onNavigateTab('gis-map');
                }}
                className="text-amber-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{t('Filter Critical Parcels')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Col (7 cols): Decision Feed & High-Risk Spotlight Card */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Spotlight Hero High-Risk Parcel Card: P-204 (Crisp Administrative Dossier) */}
          <div className="bg-white rounded-lg border border-slate-200 border-l-4 border-l-rose-600 p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white uppercase tracking-wider">
                  {t('URGENT BOTTLENECK')}
                </span>
                <span className="font-mono text-xs font-bold text-slate-900">
                  {language === 'hi' ? 'पार्सल #P-204 (खसरा संख्या 412/3B)' : 'Parcel #P-204 (Survey No. 412/3B)'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
                <span>{t('Risk Level: Critical (Score 78/100)')}</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">{t('Location')}</span>
                <span className="font-bold text-slate-800">{t('Village Rampur, Kashi Block')}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">{t('Primary Conflict')}</span>
                <span className="font-bold text-rose-800">{t('Title Partition & Court Writ')}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">{t('Award Escrow')}</span>
                <span className="font-bold text-slate-800">{t('₹1.85 Cr Pending')}</span>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-700 bg-slate-50 p-3 rounded border border-slate-200 leading-relaxed">
              <strong className="text-slate-900 font-semibold">{t('Decision Support Assessment: ')}</strong>
              {t('Active partition dispute between 3 coparceners in District Civil Court; hearing set for 24 Sep. Sentinel-2 pass detected recent unapproved brick structure. Poses immediate 6-month critical path delay to Corridor Option A.')}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onSelectParcel('P-204');
                    onNavigateTab('digital-twin');
                  }}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t('Inspect Digital Twin & Risk Factors')}</span>
                </button>

                <button
                  onClick={() => {
                    onSelectParcel('P-204');
                    onNavigateTab('satellite');
                  }}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Satellite className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t('View Satellite Alert')}</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-500 font-mono">
                {t('Model Confidence: 89%')}
              </span>
            </div>
          </div>

          {/* Real-time Decision Notifications Feed */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">{t('Recent Decision-Intelligence Alerts')}</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">{t('Live Feed')}</span>
            </div>

            <div className="space-y-3">
              {NOTIFICATIONS_FEED.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.severity === 'high'
                            ? 'bg-rose-500'
                            : item.severity === 'medium'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                      ></span>
                      <span className="font-bold text-xs text-slate-900">{item.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-snug pl-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="pl-4 sm:pl-0 shrink-0">
                    <button
                      onClick={() => {
                        if (item.type === 'satellite') onNavigateTab('satellite');
                        else if (item.parcelId) {
                          onSelectParcel(item.parcelId);
                          onNavigateTab('digital-twin');
                        }
                      }}
                      className="text-xs font-bold text-blue-700 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{item.actionLabel || 'Inspect'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
