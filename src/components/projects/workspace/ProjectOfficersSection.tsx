import React, { useState } from 'react';
import {
  Users,
  Shield,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  X,
  FileCheck,
  UserCheck
} from 'lucide-react';
import { FieldOfficerRecord } from '../../../data/projectWorkspaceData';

interface ProjectOfficersSectionProps {
  officers: FieldOfficerRecord[];
  onSelectParcel?: (parcelId: string) => void;
  onNavigateTab?: (tab: any) => void;
}

export const ProjectOfficersSection: React.FC<ProjectOfficersSectionProps> = ({
  officers,
  onSelectParcel,
  onNavigateTab,
}) => {
  const [selectedOfficer, setSelectedOfficer] = useState<FieldOfficerRecord | null>(null);

  const getStatusBadge = (status: FieldOfficerRecord['status']) => {
    switch (status) {
      case 'On Field':
        return 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-400/20';
      case 'Active':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400/20';
      case 'In Office':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'On Leave':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div id="field-officers-section" className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              4. Assigned Revenue & Field Verification Officers
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Key personnel accountable for cadastral boundary ground-truthing, DGPS surveys, and Section 15 hearings
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Team Strength:</span>
          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {officers.length} Deputed Officers
          </span>
        </div>
      </div>

      {/* Officers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {officers.map((officer) => {
          const completionPct = Math.round((officer.verifiedCount / (officer.assignedParcels || 1)) * 100);

          return (
            <div
              key={officer.id}
              className="bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-200 p-4 transition-all hover:border-slate-300 hover:shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                {/* Officer Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-300 shrink-0">
                      {officer.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs leading-snug">{officer.name}</h3>
                      <div className="text-[10px] text-slate-500 font-medium">{officer.designation}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(officer.status)}`}>
                    {officer.status}
                  </span>
                </div>

                {/* ID & Jurisdiction */}
                <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-slate-200/60 font-medium">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Officer ID:</span>
                    <span className="font-mono font-bold text-slate-800">{officer.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Circle:</span>
                    <span className="truncate max-w-[140px] text-right font-semibold text-slate-700">
                      {officer.jurisdiction}
                    </span>
                  </div>
                </div>

                {/* Verification Progress */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Verification Progress</span>
                    <span className="font-bold text-slate-800">{completionPct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span className="text-emerald-700 font-semibold">{officer.verifiedCount} Completed</span>
                    <span className="text-amber-700 font-semibold">{officer.pendingCount} Pending</span>
                  </div>
                </div>

                {/* Last Activity */}
                <div className="bg-white p-2 rounded border border-slate-200 text-[10px] text-slate-600">
                  <span className="text-slate-400 font-semibold block">Last Active:</span>
                  <span className="font-medium text-slate-800 line-clamp-1">{officer.lastActivity}</span>
                </div>
              </div>

              {/* View Details Action */}
              <button
                type="button"
                onClick={() => setSelectedOfficer(officer)}
                className="w-full py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
              >
                <span>View Details & Dossier</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Officer Detail Modal */}
      {selectedOfficer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-300 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-4 bg-[#0F172A] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm">Revenue Officer Service Dossier</h3>
              </div>
              <button
                onClick={() => setSelectedOfficer(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 flex items-center justify-center font-bold text-sm">
                  {selectedOfficer.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{selectedOfficer.name}</h4>
                  <div className="text-slate-600 font-medium">{selectedOfficer.designation}</div>
                  <div className="text-slate-500 font-mono text-[11px]">{selectedOfficer.department}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 block font-semibold">Official Phone</span>
                  <span className="font-semibold text-slate-800">{selectedOfficer.phone}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 block font-semibold">Government Email</span>
                  <span className="font-semibold text-slate-800 truncate block">{selectedOfficer.email}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 block font-semibold">Jurisdiction Circle</span>
                  <span className="font-semibold text-slate-800">{selectedOfficer.jurisdiction}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 block font-semibold">Assigned Parcels</span>
                  <span className="font-semibold text-slate-800">{selectedOfficer.assignedParcels} Parcels</span>
                </div>
              </div>

              {/* Recent Verification Activity */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-700 block">Recently Verified Parcels</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedOfficer.recentParcels.map((parcelId) => (
                    <button
                      key={parcelId}
                      type="button"
                      onClick={() => {
                        setSelectedOfficer(null);
                        if (onSelectParcel) onSelectParcel(parcelId);
                        if (onNavigateTab) onNavigateTab('digital-twin');
                      }}
                      className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-mono font-bold text-[11px] cursor-pointer flex items-center gap-1"
                    >
                      <span>{parcelId}</span>
                      <ExternalLink className="w-3 h-3 text-amber-700" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 text-[11px]">
                <strong className="text-slate-800">Field Logs: </strong>
                {selectedOfficer.lastActivity}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedOfficer(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer font-medium"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
