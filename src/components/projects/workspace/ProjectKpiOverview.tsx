import React from 'react';
import {
  Layers,
  MapPin,
  TrendingUp,
  Users,
  IndianRupee,
  CheckCircle2,
  Home,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { ProjectRecord } from '../../../data/projectsData';

interface ProjectKpiOverviewProps {
  project: ProjectRecord;
}

export const ProjectKpiOverview: React.FC<ProjectKpiOverviewProps> = ({ project }) => {
  const disbursalRate = Math.round(
    (project.compensationDisbursedCr / (project.compensationAssessedCr || 1)) * 100
  );
  const remainingLandHa = +(project.landProposed - project.landAcquired).toFixed(1);
  const remainingCompCr = +(project.compensationAssessedCr - project.compensationDisbursedCr).toFixed(1);

  return (
    <div id="project-overview-kpi-section" className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Project Acquisition Health & Vital KPIs
          </h2>
        </div>
        <span className="text-[11px] text-slate-500 font-medium">
          Source: State Revenue & PFMS Disbursal Ledger
        </span>
      </div>

      {/* 8 Compact KPI Cards in 4x2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Land Proposed */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">1. Land Proposed</span>
            <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{project.landProposed}</span>
            <span className="text-xs text-slate-500 font-semibold">Hectares</span>
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>Gazetted Alignment</span>
            <span className="font-semibold text-slate-700">{project.villages?.length || 4} Villages</span>
          </div>
        </div>

        {/* 2. Land Acquired */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">2. Land Acquired</span>
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-700">{project.landAcquired}</span>
            <span className="text-xs text-slate-500 font-semibold">/ {project.landProposed} Ha</span>
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>Remaining to Acquire</span>
            <span className="font-bold text-amber-700">{remainingLandHa} Ha</span>
          </div>
        </div>

        {/* 3. Acquisition Progress */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">3. Acquisition Progress</span>
            <div className="w-6 h-6 rounded-md bg-orange-50 text-[#EA580C] flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#EA580C]">{project.acquisitionProgress}%</span>
            <span className="text-xs text-slate-500 font-medium">Completed</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#EA580C] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, project.acquisitionProgress)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Milestone Target</span>
            <span className="font-semibold text-slate-700">85% by Q4</span>
          </div>
        </div>

        {/* 4. Affected Families */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">4. Affected Families</span>
            <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-700 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{project.affectedFamilies}</span>
            <span className="text-xs text-slate-500 font-semibold">PAP Households</span>
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>Social Impact Assessment</span>
            <span className="font-semibold text-purple-700">Notified Baseline</span>
          </div>
        </div>

        {/* 5. Compensation Assessed */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">5. Compensation Assessed</span>
            <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-800 flex items-center justify-center">
              <Scale className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">₹{project.compensationAssessedCr}</span>
            <span className="text-xs text-slate-500 font-semibold">Crores (Awarded)</span>
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>Includes 100% Solatium</span>
            <span className="font-semibold text-slate-700">Sec 30 RFCTLARR</span>
          </div>
        </div>

        {/* 6. Compensation Disbursed */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">6. Compensation Disbursed</span>
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-700">₹{project.compensationDisbursedCr}</span>
            <span className="text-xs text-slate-500 font-medium">/ ₹{project.compensationAssessedCr} Cr</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, disbursalRate)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Pending Tranche</span>
            <span className="font-bold text-slate-700">₹{remainingCompCr} Cr ({disbursalRate}%)</span>
          </div>
        </div>

        {/* 7. R&R Progress */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">7. R&R Progress</span>
            <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Home className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-indigo-700">78%</span>
            <span className="text-xs text-slate-500 font-semibold">Resettled</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: '78%' }} />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Babatpur Cluster</span>
            <span className="font-semibold text-indigo-800">321 / 412 Settled</span>
          </div>
        </div>

        {/* 8. Possession Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">8. Possession Status</span>
            <div className="w-6 h-6 rounded-md bg-teal-50 text-teal-700 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-teal-800">{project.possessionPercent}%</span>
            <span className="text-xs text-slate-500 font-semibold">Handed Over</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-teal-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, project.possessionPercent)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Remaining Encroachments</span>
            <span className="font-semibold text-rose-700">{Math.max(0, +(100 - project.possessionPercent).toFixed(1))}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
