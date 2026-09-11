import React from 'react';
import {
  Sparkles,
  ShieldAlert,
  Users,
  Camera,
  ArrowRight,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  Building2,
  IndianRupee,
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import { ProjectRecord } from '../../../data/projectsData';
import { ProjectWorkspaceData } from '../../../data/projectWorkspaceData';
import { WorkspaceTabId } from './ProjectSecondaryNav';

interface ProjectExecutiveOverviewProps {
  project: ProjectRecord;
  workspaceData: ProjectWorkspaceData;
  onSelectTab: (tabId: WorkspaceTabId) => void;
  onSelectParcel?: (parcelId: string) => void;
  onNavigateTab?: (tab: any) => void;
}

export const ProjectExecutiveOverview: React.FC<ProjectExecutiveOverviewProps> = ({
  project,
  workspaceData,
  onSelectTab,
  onSelectParcel,
  onNavigateTab,
}) => {
  const { consentSummary, riskMetrics, officers, evidencePhotos, activityTimeline } = workspaceData;

  return (
    <div id="project-executive-overview" className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Current Statutory Status & Target Milestone Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-5 border border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EA580C] text-white uppercase tracking-wider">
              Active Milestone
            </span>
            <span className="text-xs text-slate-300 font-mono">
              Stage 06: RFCTLARR Compensation Disbursal (Sec 77)
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Direct DBT Disbursal in Progress for {project.name}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            ₹{project.compensationDisbursedCr} Cr of ₹{project.compensationAssessedCr} Cr disbursed via PFMS. Active civil court partition disputes under escrow determination for remaining parcels.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onSelectTab('acquisition')}
            className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <span>View 8-Stage Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Four Strategic Command Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: What-If Simulator Recommendation */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">
                Corridor Optimizer
              </span>
              <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              Option B: Southern Bypass
            </h4>
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Savings:</span>
                <strong className="text-emerald-700 font-bold">₹12.7 Cr (-15%)</strong>
              </div>
              <div className="flex justify-between">
                <span>PAPs Avoided:</span>
                <strong className="text-slate-800 font-bold">74 Families</strong>
              </div>
              <div className="flex justify-between">
                <span>Feasibility:</span>
                <strong className="text-emerald-700 font-bold">89 / 100</strong>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelectTab('simulator')}
            className="w-full py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <span>Inspect Corridor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Risk & Injunctions */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-rose-800 tracking-wider">
                Risk Matrix
              </span>
              <div className="w-7 h-7 rounded-md bg-rose-50 text-rose-700 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              18 Critical Parcels Flagged
            </h4>
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Court Injunctions:</span>
                <strong className="text-rose-700 font-bold">9 Civil Suits</strong>
              </div>
              <div className="flex justify-between">
                <span>Valuation Gaps:</span>
                <strong className="text-amber-800 font-bold">12 Parcels</strong>
              </div>
              <div className="flex justify-between">
                <span>Satellite Shifts:</span>
                <strong className="text-teal-700 font-bold">5 Alerts</strong>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelectTab('risk')}
            className="w-full py-1.5 text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <span>View Risk Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Consent & Objections */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-purple-800 tracking-wider">
                People Consent
              </span>
              <div className="w-7 h-7 rounded-md bg-purple-50 text-purple-700 flex items-center justify-center">
                <FileCheck2 className="w-4 h-4" />
              </div>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              {consentSummary.consentPercentage}% Form A-1 Consent
            </h4>
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Consent Given:</span>
                <strong className="text-emerald-700 font-bold">{consentSummary.consentObtained} Families</strong>
              </div>
              <div className="flex justify-between">
                <span>Sec 15 Objections:</span>
                <strong className="text-amber-800 font-bold">{consentSummary.objectionsFiled} Filed</strong>
              </div>
              <div className="flex justify-between">
                <span>Pending e-KYC:</span>
                <strong className="text-slate-700 font-bold">{consentSummary.consentPending} Cases</strong>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelectTab('consent')}
            className="w-full py-1.5 text-xs font-semibold text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <span>Inspect Consent Table</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 4: Field Officers & Evidence */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-blue-800 tracking-wider">
                Ground Truth Team
              </span>
              <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              {officers.length} Deputed Officers
            </h4>
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>On Field Now:</span>
                <strong className="text-amber-700 font-bold">2 Officers Active</strong>
              </div>
              <div className="flex justify-between">
                <span>Photo Evidence:</span>
                <strong className="text-teal-700 font-bold">{evidencePhotos.length} Geo-Tagged</strong>
              </div>
              <div className="flex justify-between">
                <span>Discrepancies:</span>
                <strong className="text-rose-700 font-bold">2 Recorded</strong>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelectTab('officers')}
            className="w-full py-1.5 text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <span>View Officers & Evidence</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Notified Villages Cadastral Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Revenue Circles & Village Alignment Breakdown
            </h4>
            <p className="text-[11px] text-slate-500">
              Cadastral distribution of notified parcels under Section 11 gazette
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 font-mono">
            Total: {project.landProposed} Hectares
          </span>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-3.5 py-2">Village Name</th>
                <th className="px-3.5 py-2">Tehsil Circle</th>
                <th className="px-3.5 py-2">Acquired Area (Ha)</th>
                <th className="px-3.5 py-2">Affected Families</th>
                <th className="px-3.5 py-2">Compensation Status</th>
                <th className="px-3.5 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50">
                <td className="px-3.5 py-2 font-bold text-slate-900">Rampur</td>
                <td className="px-3.5 py-2">Kashi Vidyapeeth</td>
                <td className="px-3.5 py-2 font-mono">112.4 Ha</td>
                <td className="px-3.5 py-2 font-mono">164 PAPs</td>
                <td className="px-3.5 py-2">
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
                    In Escrow & Partition
                  </span>
                </td>
                <td className="px-3.5 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectParcel) onSelectParcel('PARCEL-001');
                      if (onNavigateTab) onNavigateTab('digital-twin');
                    }}
                    className="text-amber-800 font-semibold hover:underline cursor-pointer"
                  >
                    Inspect Twin →
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-3.5 py-2 font-bold text-slate-900">Shivpur</td>
                <td className="px-3.5 py-2">Harahua</td>
                <td className="px-3.5 py-2 font-mono">88.6 Ha</td>
                <td className="px-3.5 py-2 font-mono">118 PAPs</td>
                <td className="px-3.5 py-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                    Disbursed (Tranche 1 & 2)
                  </span>
                </td>
                <td className="px-3.5 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectParcel) onSelectParcel('PARCEL-006');
                      if (onNavigateTab) onNavigateTab('digital-twin');
                    }}
                    className="text-amber-800 font-semibold hover:underline cursor-pointer"
                  >
                    Inspect Twin →
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-3.5 py-2 font-bold text-slate-900">Babatpur</td>
                <td className="px-3.5 py-2">Pindra</td>
                <td className="px-3.5 py-2 font-mono">92.0 Ha</td>
                <td className="px-3.5 py-2 font-mono">86 PAPs</td>
                <td className="px-3.5 py-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                    R&R Cluster Disbursal
                  </span>
                </td>
                <td className="px-3.5 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectParcel) onSelectParcel('PARCEL-007');
                      if (onNavigateTab) onNavigateTab('digital-twin');
                    }}
                    className="text-amber-800 font-semibold hover:underline cursor-pointer"
                  >
                    Inspect Twin →
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-3.5 py-2 font-bold text-slate-900">Harahua</td>
                <td className="px-3.5 py-2">Harahua</td>
                <td className="px-3.5 py-2 font-mono">49.8 Ha</td>
                <td className="px-3.5 py-2 font-mono">44 PAPs</td>
                <td className="px-3.5 py-2">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-semibold">
                    Award Finalized
                  </span>
                </td>
                <td className="px-3.5 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectParcel) onSelectParcel('PARCEL-008');
                      if (onNavigateTab) onNavigateTab('digital-twin');
                    }}
                    className="text-amber-800 font-semibold hover:underline cursor-pointer"
                  >
                    Inspect Twin →
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
