import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  IndianRupee,
  Home,
  Scale,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  MapPin,
  Calendar,
  Satellite,
  ClipboardCheck,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Layers
} from 'lucide-react';
import { Parcel, AcquisitionStage } from '../../types';
import { ALL_PARCELS } from '../../data/mockData';
import { NavTab } from '../layout/GovHeader';

interface DigitalTwinViewProps {
  selectedParcelId: string;
  onSelectParcel: (parcelId: string) => void;
  onNavigateTab: (tab: NavTab) => void;
}

const ALL_STAGES: AcquisitionStage[] = [
  'Proposal & Feasibility',
  'Joint Measurement Survey',
  'Sec 11 Preliminary Notification',
  'Sec 15 Hearing of Objections',
  'Sec 19 Declaration of Acquisition',
  'Compensation Determination',
  'R&R Package Disbursement',
  'Physical Possession & Handover',
];

export const DigitalTwinView: React.FC<DigitalTwinViewProps> = ({
  selectedParcelId,
  onSelectParcel,
  onNavigateTab,
}) => {
  const parcel = ALL_PARCELS.find((p) => p.id === selectedParcelId) || ALL_PARCELS[0];

  const currentStageIndex = ALL_STAGES.indexOf(parcel.currentStage);

  return (
    <div id="digital-twin-profile-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Parcel Selector Dropdown & Quick Switch Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-700">Select Parcel to Inspect:</span>
          <select
            value={parcel.id}
            onChange={(e) => onSelectParcel(e.target.value)}
            aria-label="Select Parcel"
            className="border border-slate-300 rounded-md px-2.5 py-1 text-xs font-mono font-bold text-slate-800 bg-slate-50 focus:ring-1 focus:ring-amber-500"
          >
            {ALL_PARCELS.slice(0, 15).map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} • {p.village} ({p.riskLevel.toUpperCase()} - {p.riskScore})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('gis-map')}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50"
          >
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>View on GIS Map</span>
          </button>
        </div>
      </div>

      {/* Header Profile Block */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-slate-900 text-white font-mono">
                PARCEL {parcel.id}
              </span>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                ULPIN: {parcel.ulpin}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                  parcel.riskLevel === 'critical'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : parcel.riskLevel === 'attention'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                <span>Risk Level: {parcel.riskLevel.toUpperCase()} ({parcel.riskScore}/100)</span>
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Cadastral Parcel #{parcel.id} • Survey No. {parcel.surveyNumber}
            </h1>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Village: {parcel.village} • Block: {parcel.block} • District: {parcel.district}, Uttar Pradesh</span>
            </p>
          </div>

          {/* Quick Stats Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center min-w-[100px]">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Area</span>
              <span className="text-base font-black text-slate-900">{parcel.areaHectares} Ha</span>
              <span className="text-[10px] text-slate-400 block">{(parcel.areaHectares * 2.471).toFixed(2)} Acres</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center min-w-[100px]">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Land Type</span>
              <span className="text-sm font-bold text-slate-800">{parcel.landType}</span>
              <span className="text-[10px] text-emerald-600 block font-medium">RoR Verified</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center min-w-[110px]">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Award Sum</span>
              <span className="text-base font-black text-slate-900">₹{parcel.compensation.estimatedAmountCr} Cr</span>
              <span className="text-[10px] text-amber-700 block font-medium">{parcel.compensation.status}</span>
            </div>
          </div>
        </div>

        {/* 8-Stage Horizontal Lifecycle Stepper */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              RFCTLARR 2013 Statutory Lifecycle Progression
            </h3>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
              Active Stage: {parcel.currentStage}
            </span>
          </div>

          {/* Stepper Bar */}
          <div className="relative mt-4">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 relative z-10">
              {ALL_STAGES.map((st, idx) => {
                const isCompleted = idx < currentStageIndex;
                const isActive = idx === currentStageIndex;
                return (
                  <div
                    key={st}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      isActive
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs ring-2 ring-amber-200'
                        : isCompleted
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-1">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isActive ? (
                        <span className="w-4 h-4 rounded-full bg-white text-amber-600 text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-bold leading-tight line-clamp-2">
                      {st}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content Grid: Left (Risk Radar + Legal), Right (People + Compensation + R&R) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Decision Support Risk Radar & Legal Injunctions */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Decision Support Risk Analysis Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  Decision Support & Risk Factor Analysis
                </h3>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <span>Model Confidence:</span>
                <span className="font-mono font-bold text-slate-800">{parcel.riskConfidence}%</span>
              </div>
            </div>

            {/* Score Badge + Plain-English Explanation */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-lg bg-slate-50 border border-slate-200">
              {/* Score Badge */}
              <div
                className={`w-24 h-24 rounded-lg flex flex-col items-center justify-center shrink-0 border-2 shadow-xs ${
                  parcel.riskLevel === 'critical'
                    ? 'bg-rose-50 border-rose-300 text-rose-900'
                    : parcel.riskLevel === 'attention'
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                }`}
              >
                <span className="text-3xl font-black leading-none">{parcel.riskScore}</span>
                <span className="text-[9px] uppercase font-bold tracking-wider mt-1">
                  {parcel.riskLevel.toUpperCase()}
                </span>
                <span className="text-[8px] font-mono text-slate-500">Scale 0-100</span>
              </div>

              {/* Statutory Risk Assessment & Rationale */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-900 block text-sm">
                  Statutory Risk Assessment & Rationale:
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {parcel.riskSummary}
                </p>
                <div className="pt-1 text-[11px] text-rose-700 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Projected Timeline Delay: ~6.0 Months if partition injunction is unresolved.</span>
                </div>
              </div>
            </div>

            {/* Factor Breakdown Bars */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Risk Factor Breakdown & Sub-Indices
              </h4>

              {parcel.riskFactors.map((factor) => (
                <div key={factor.category} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <span>{factor.category} Vulnerability</span>
                      <span className="text-[10px] text-slate-400">(wt: {factor.weight * 100}%)</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {factor.score}/100
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        factor.score >= 70
                          ? 'bg-rose-500'
                          : factor.score >= 40
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${factor.score}%` }}
                    ></div>
                  </div>

                  <p className="text-[11px] text-slate-500 italic">
                    {factor.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Actions Bar inside Risk Radar */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <button
                id="digital-twin-open-satellite-btn"
                onClick={() => onNavigateTab('satellite')}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Satellite className="w-4 h-4 text-amber-700" />
                <span>Sentinel-2 Satellite Alert</span>
              </button>

              <button
                id="digital-twin-open-verification-btn"
                onClick={() => onNavigateTab('verification')}
                className="px-3.5 py-1.5 bg-[#EA580C] hover:bg-[#D97706] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>Initiate Field Verification</span>
              </button>
            </div>
          </div>

          {/* Legal Case Details Card (if exists) */}
          {parcel.legalCase && (
            <div className="bg-white rounded-xl border border-rose-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-rose-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Active Legal Suit / Injunction</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                  {parcel.legalCase.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-rose-50/60 p-3 rounded-lg border border-rose-100">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Case Suit No.</span>
                  <span className="font-mono font-bold text-slate-800">{parcel.legalCase.caseNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Judicial Forum</span>
                  <span className="font-bold text-slate-800">{parcel.legalCase.court}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Petitioners</span>
                  <span className="font-medium text-slate-700">{parcel.legalCase.petitioner}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Next Hearing</span>
                  <span className="font-bold text-rose-900">{parcel.legalCase.nextHearingDate}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-800">Issue Summary: </span>
                {parcel.legalCase.issue}
              </p>
            </div>
          )}

          {/* Historical Timeline Log */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-600" />
              <span>Acquisition Event Timeline</span>
            </h3>

            <div className="space-y-3 relative pl-4 border-l-2 border-slate-200 text-xs">
              {parcel.timeline.map((event, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-600 border-2 border-white"></div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{event.stage}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{event.date}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{event.description}</p>
                  <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
                    Officer: {event.officer}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): People / Households + Compensation + R&R */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Landowners & Affected Households Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">People & Registered Households</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {parcel.affectedFamilyCount} Affected Families
              </span>
            </div>

            <div className="space-y-2.5">
              {parcel.owners.map((owner) => (
                <div
                  key={owner.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{owner.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        owner.aadhaarStatus === 'Verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Aadhaar: {owner.aadhaarStatus}
                    </span>
                  </div>

                  <div className="text-slate-600">
                    {owner.relation} • Category: <span className="font-semibold">{owner.category}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="font-semibold text-slate-700">Land Share: {owner.sharePercent}%</span>
                    <span className="text-slate-500 font-mono">{owner.phone}</span>
                  </div>

                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <CheckCircle2 className={`w-3 h-3 ${owner.bankAccountLinked ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{owner.bankAccountLinked ? 'Direct DBT Bank Account Seeded' : 'Bank Account Linking Pending'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compensation Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Compensation Award Breakdown</h3>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                {parcel.compensation.status}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Estimated Compensation:</span>
                <span className="font-bold text-slate-900">₹{parcel.compensation.estimatedAmountCr} Cr</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Awarded (Circle Rate x 2 + 100% Solatium):</span>
                <span className="font-bold text-slate-900">₹{parcel.compensation.awardedAmountCr} Cr</span>
              </div>
              <div className="flex items-center justify-between text-emerald-700 font-semibold">
                <span>Disbursed via DBT:</span>
                <span>₹{parcel.compensation.paidAmountCr} Cr</span>
              </div>
              <div className="flex items-center justify-between text-rose-700 font-bold">
                <span>Pending in Escrow / Objection:</span>
                <span>₹{parcel.compensation.pendingAmountCr} Cr</span>
              </div>
            </div>

            {/* Compensation Progress Bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{
                  width: `${(parcel.compensation.paidAmountCr / Math.max(0.1, parcel.compensation.estimatedAmountCr)) * 100}%`,
                }}
              ></div>
            </div>
            <div className="text-[10px] text-slate-500 text-right">
              {Math.round((parcel.compensation.paidAmountCr / Math.max(0.1, parcel.compensation.estimatedAmountCr)) * 100)}% Disbursed
            </div>
          </div>

          {/* R&R Entitlements Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">Resettlement & Rehabilitation (R&R)</h3>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${parcel.rrStatus.eligible ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                {parcel.rrStatus.eligible ? 'R&R Eligible' : 'No Resettlement'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Alternative House Allotment:</span>
                <span className="font-bold text-slate-800">{parcel.rrStatus.housingAllotted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Resettlement Colony:</span>
                <span className="font-medium text-slate-700">{parcel.rrStatus.resettlementSite}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Subsistence Allowance:</span>
                <span className={parcel.rrStatus.subsistenceGrantPaid ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                  {parcel.rrStatus.subsistenceGrantPaid ? 'Disbursed (₹3.5 Lakhs)' : 'Pending Clearance'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Livelihood Apprenticeship:</span>
                <span className="font-medium text-slate-700">
                  {parcel.rrStatus.livelihoodSkillEnrolled ? 'Enrolled under PM Kaushal Vikas' : 'Not Enrolled'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              Notes: {parcel.rrStatus.notes}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
