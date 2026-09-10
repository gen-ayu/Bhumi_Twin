import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Scale,
  IndianRupee,
  Home,
  Satellite,
  Database,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CriticalParcelRecord } from '../../../data/projectWorkspaceData';
import { NavTab } from '../../layout/GovHeader';

interface ProjectRiskSummaryProps {
  riskMetrics: {
    totalParcels: number;
    highRiskParcels: number;
    legalDisputes: number;
    compensationIssues: number;
    rnrIssues: number;
    satelliteAlerts: number;
    dataInconsistencies: number;
  };
  criticalParcels: CriticalParcelRecord[];
  onSelectParcel?: (parcelId: string) => void;
  onNavigateTab?: (tab: NavTab) => void;
}

export const ProjectRiskSummary: React.FC<ProjectRiskSummaryProps> = ({
  riskMetrics,
  criticalParcels,
  onSelectParcel,
  onNavigateTab,
}) => {
  const getRiskBadge = (level: CriticalParcelRecord['riskLevel']) => {
    switch (level) {
      case 'Critical':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-black';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-300 font-bold';
      case 'Medium':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  const getIssueBadge = (type: CriticalParcelRecord['issueType']) => {
    switch (type) {
      case 'Legal Dispute':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'Valuation Disparity':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'Encroachment Alert':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Succession Conflict':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Satellite Shift':
      default:
        return 'text-teal-700 bg-teal-50 border-teal-200';
    }
  };

  return (
    <div id="parcel-risk-summary-section" className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              8. Parcel Cadastre & Injunction Risk Breakdown
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            AI Cadastral Risk Intelligence matrix scanning court litigation, compensation disparities, satellite changes, and succession disputes
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Critical Threat Exposure:</span>
          <span className="px-2.5 py-1 rounded-md font-bold text-rose-800 bg-rose-50 border border-rose-300">
            {riskMetrics.highRiskParcels} High-Risk Parcels
          </span>
        </div>
      </div>

      {/* 7 Risk KPI Stats Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {/* Total Parcels */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center space-y-0.5">
          <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold text-slate-500">
            <Layers className="w-3 h-3 text-slate-400" />
            <span>Total Parcels</span>
          </div>
          <div className="text-xl font-black text-slate-900">{riskMetrics.totalParcels}</div>
          <span className="text-[9px] text-slate-500">Alignment ROW</span>
        </div>

        {/* High-Risk Parcels */}
        <div className="bg-rose-50/80 p-3 rounded-xl border border-rose-300 text-center space-y-0.5">
          <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold text-rose-800">
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            <span>High-Risk</span>
          </div>
          <div className="text-xl font-black text-rose-800">{riskMetrics.highRiskParcels}</div>
          <span className="text-[9px] text-rose-600 font-semibold">12.1% of parcels</span>
        </div>

        {/* Legal Disputes */}
        <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-300 text-center space-y-0.5">
          <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold text-amber-900">
            <Scale className="w-3 h-3 text-amber-700" />
            <span>Legal Disputes</span>
          </div>
          <div className="text-xl font-black text-amber-900">{riskMetrics.legalDisputes}</div>
          <span className="text-[9px] text-amber-700 font-semibold">In Civil Court</span>
        </div>

        {/* Compensation Issues */}
        <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-300 text-center space-y-0.5">
          <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold text-blue-900">
            <IndianRupee className="w-3 h-3 text-blue-700" />
            <span>Compensation</span>
          </div>
          <div className="text-xl font-black text-blue-900">{riskMetrics.compensationIssues}</div>
          <span className="text-[9px] text-blue-700 font-semibold">Valuation Gaps</span>
        </div>

        {/* R&R Issues */}
        <div className="bg-purple-50/80 p-3 rounded-xl border border-purple-300 text-center space-y-0.5">
          <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold text-purple-900">
            <Home className="w-3 h-3 text-purple-700" />
            <span>R&R Issues</span>
          </div>
          <div className="text-xl font-black text-purple-900">{riskMetrics.rnrIssues}</div>
          <span className="text-[9px] text-purple-700 font-semibold">Homestead claims</span>
        </div>

        {/* Satellite Alerts */}
        <div className="bg-teal-50/80 p-3 rounded-xl border border-teal-300 text-center space-y-0.5">
          <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold text-teal-900">
            <Satellite className="w-3 h-3 text-teal-700" />
            <span>Satellite Alerts</span>
          </div>
          <div className="text-xl font-black text-teal-900">{riskMetrics.satelliteAlerts}</div>
          <span className="text-[9px] text-teal-700 font-semibold">Sentinel-2 shifts</span>
        </div>

        {/* Data Inconsistencies */}
        <div className="bg-slate-100 p-3 rounded-xl border border-slate-300 text-center space-y-0.5">
          <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold text-slate-700">
            <Database className="w-3 h-3 text-slate-500" />
            <span>Inconsistent</span>
          </div>
          <div className="text-xl font-black text-slate-800">{riskMetrics.dataInconsistencies}</div>
          <span className="text-[9px] text-slate-600 font-semibold">Khasra mismatch</span>
        </div>
      </div>

      {/* Critical Parcels Table */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Critical / High-Risk Parcels Requiring Immediate Executive Action</span>
          </h3>
          <span className="text-[11px] text-slate-500">5 Prioritized Cases</span>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-3.5 py-2.5">Parcel / Survey No</th>
                <th className="px-3.5 py-2.5">Village</th>
                <th className="px-3.5 py-2.5">Area (Ha)</th>
                <th className="px-3.5 py-2.5">Identified Dispute / Risk</th>
                <th className="px-3.5 py-2.5">Risk Score</th>
                <th className="px-3.5 py-2.5">Current Status</th>
                <th className="px-3.5 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {criticalParcels.map((cp) => (
                <tr key={cp.id} className="hover:bg-amber-50/40 transition-colors">
                  <td className="px-3.5 py-2.5 font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectParcel) onSelectParcel(cp.id);
                        if (onNavigateTab) onNavigateTab('digital-twin');
                      }}
                      className="font-black text-slate-900 hover:text-amber-800 underline cursor-pointer"
                    >
                      {cp.id} / {cp.surveyNo}
                    </button>
                    {cp.courtCaseRef && (
                      <div className="text-[10px] text-rose-700 font-sans truncate max-w-[150px]" title={cp.courtCaseRef}>
                        {cp.courtCaseRef}
                      </div>
                    )}
                  </td>

                  <td className="px-3.5 py-2.5 font-medium text-slate-800">
                    {cp.village}
                  </td>

                  <td className="px-3.5 py-2.5 font-mono">
                    {cp.areaHa}
                  </td>

                  <td className="px-3.5 py-2.5 max-w-[240px]">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-block mb-0.5 ${getIssueBadge(cp.issueType)}`}>
                      {cp.issueType}
                    </span>
                    <div className="text-[10px] text-slate-600 truncate leading-snug" title={cp.keyConcern}>
                      {cp.keyConcern}
                    </div>
                  </td>

                  <td className="px-3.5 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[11px] border inline-block ${getRiskBadge(cp.riskLevel)}`}>
                      {cp.riskScore}/100 ({cp.riskLevel})
                    </span>
                  </td>

                  <td className="px-3.5 py-2.5 text-slate-700 text-[11px]">
                    {cp.status}
                  </td>

                  <td className="px-3.5 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectParcel) onSelectParcel(cp.id);
                        if (onNavigateTab) onNavigateTab('digital-twin');
                      }}
                      className="px-2.5 py-1 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded cursor-pointer transition-colors inline-flex items-center gap-1 shadow-2xs"
                    >
                      <span>Inspect Twin</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
