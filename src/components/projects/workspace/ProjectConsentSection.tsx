import React, { useState, useMemo } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  Eye,
  Phone,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  UserCheck
} from 'lucide-react';
import { ConsentRecord } from '../../../data/projectWorkspaceData';
import { NavTab } from '../../layout/GovHeader';

interface ProjectConsentSectionProps {
  summary: {
    totalFamilies: number;
    consentObtained: number;
    consentPending: number;
    objectionsFiled: number;
    disputedCases: number;
    consentPercentage: number;
  };
  consentRecords: ConsentRecord[];
  onSelectParcel?: (parcelId: string) => void;
  onNavigateTab?: (tab: NavTab) => void;
}

export const ProjectConsentSection: React.FC<ProjectConsentSectionProps> = ({
  summary,
  consentRecords,
  onSelectParcel,
  onNavigateTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ConsentRecord['consentStatus']>('ALL');
  const [selectedCase, setSelectedCase] = useState<ConsentRecord | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredRecords = useMemo(() => {
    return consentRecords.filter((rec) => {
      const matchSearch =
        rec.familyHead.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.parcelId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.surveyNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.village.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || rec.consentStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [consentRecords, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getConsentStatusBadge = (status: ConsentRecord['consentStatus']) => {
    switch (status) {
      case 'Consent Obtained':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400/20';
      case 'Pending':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'Objected':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Disputed':
      default:
        return 'bg-rose-50 text-rose-800 border-rose-300 font-bold';
    }
  };

  return (
    <div id="people-consent-section" className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-600"></span>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              6. People Consent, Objections & PAP Rehabilitation
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Project-Affected Persons (PAP) statutory Form A-1 consents, Section 15 objections, and direct DBT account verification
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Overall Consent Level:</span>
          <span className="px-2.5 py-1 rounded-md font-bold text-emerald-800 bg-emerald-50 border border-emerald-300">
            {summary.consentPercentage}% Obtained
          </span>
        </div>
      </div>

      {/* 6 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Total Affected Families */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-500">Total Families</span>
          <div className="text-xl font-black text-slate-900">{summary.totalFamilies}</div>
          <span className="text-[10px] text-slate-500 font-medium">PAP Households</span>
        </div>

        {/* 2. Consent Obtained */}
        <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-center space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-emerald-700">Consent Obtained</span>
          <div className="text-xl font-black text-emerald-800">{summary.consentObtained}</div>
          <span className="text-[10px] text-emerald-700 font-bold">{summary.consentPercentage}% of total</span>
        </div>

        {/* 3. Consent Pending */}
        <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 text-center space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-blue-700">Consent Pending</span>
          <div className="text-xl font-black text-blue-800">{summary.consentPending}</div>
          <span className="text-[10px] text-blue-600 font-medium">In e-KYC Verification</span>
        </div>

        {/* 4. Objections Filed */}
        <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-center space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-amber-800">Objections Filed</span>
          <div className="text-xl font-black text-amber-900">{summary.objectionsFiled}</div>
          <span className="text-[10px] text-amber-700 font-medium">Sec 15 Hearings</span>
        </div>

        {/* 5. Disputed Cases */}
        <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-200 text-center space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-rose-700">Disputed Cases</span>
          <div className="text-xl font-black text-rose-800">{summary.disputedCases}</div>
          <span className="text-[10px] text-rose-700 font-medium">Court / Title Partition</span>
        </div>

        {/* 6. Consent % */}
        <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 text-center space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-amber-400">Consent Rate</span>
          <div className="text-xl font-black text-white">{summary.consentPercentage}%</div>
          <span className="text-[10px] text-slate-300 font-mono">Target: 70%+</span>
        </div>
      </div>

      {/* Table Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search family, parcel, survey no..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          {(['ALL', 'Consent Obtained', 'Pending', 'Objected', 'Disputed'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer text-[11px] whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* People Consent & Objections Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-3.5 py-2.5">Family Head / PAP</th>
                <th className="px-3.5 py-2.5">Parcel / Survey No</th>
                <th className="px-3.5 py-2.5">Village</th>
                <th className="px-3.5 py-2.5">Consent Status</th>
                <th className="px-3.5 py-2.5">Consent Date</th>
                <th className="px-3.5 py-2.5">Objection / Note</th>
                <th className="px-3.5 py-2.5 text-center">Documents</th>
                <th className="px-3.5 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="px-3.5 py-2.5">
                      <div className="font-bold text-slate-900">{rec.familyHead}</div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {rec.relation} • <span className="font-mono">{rec.aadhaarMasked}</span>
                      </div>
                    </td>

                    <td className="px-3.5 py-2.5 font-mono">
                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectParcel) onSelectParcel(rec.parcelId);
                          if (onNavigateTab) onNavigateTab('digital-twin');
                        }}
                        className="font-bold text-amber-800 hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>{rec.parcelId}</span>
                        <span className="text-slate-500 font-normal">({rec.surveyNo})</span>
                      </button>
                      <div className="text-[10px] text-slate-500 font-sans">{rec.landAreaHa} Ha</div>
                    </td>

                    <td className="px-3.5 py-2.5 font-medium text-slate-800">
                      {rec.village}
                    </td>

                    <td className="px-3.5 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border inline-block ${getConsentStatusBadge(rec.consentStatus)}`}>
                        {rec.consentStatus}
                      </span>
                    </td>

                    <td className="px-3.5 py-2.5 text-slate-600 text-[11px]">
                      {rec.consentDate}
                    </td>

                    <td className="px-3.5 py-2.5 max-w-[200px]">
                      <div className="font-semibold text-slate-800 text-[11px] truncate">
                        {rec.objectionType || 'None'}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate" title={rec.objectionSummary}>
                        {rec.objectionSummary}
                      </div>
                    </td>

                    <td className="px-3.5 py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        rec.documentsVerified
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}>
                        {rec.documentsCount} Docs {rec.documentsVerified ? '✓' : ''}
                      </span>
                    </td>

                    <td className="px-3.5 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedCase(rec)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded cursor-pointer transition-colors shadow-2xs"
                      >
                        Dossier →
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    No beneficiary consent records match the search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800">{Math.min(filteredRecords.length, (currentPage - 1) * pageSize + 1)}</strong> to{' '}
            <strong className="text-slate-800">{Math.min(filteredRecords.length, currentPage * pageSize)}</strong> of{' '}
            <strong className="text-slate-800">{filteredRecords.length}</strong> records
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded border border-slate-300 hover:bg-white disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded border border-slate-300 hover:bg-white disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Beneficiary Consent Dossier Details */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-300 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-4 bg-[#0F172A] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm">PAP Beneficiary Consent & Objection Record</h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h4 className="font-black text-sm text-slate-900">{selectedCase.familyHead}</h4>
                  <div className="text-slate-600 font-medium">
                    {selectedCase.relation} • Village {selectedCase.village}
                  </div>
                  <div className="text-slate-500 font-mono text-[11px]">
                    Aadhaar Ref: {selectedCase.aadhaarMasked} • Phone: {selectedCase.contactNumber}
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-bold border ${getConsentStatusBadge(selectedCase.consentStatus)}`}>
                  {selectedCase.consentStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block font-semibold">Parcel / Survey No</span>
                  <span className="font-mono font-bold text-slate-800 text-xs">
                    {selectedCase.parcelId} / {selectedCase.surveyNo}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block font-semibold">Acquired Area</span>
                  <span className="font-bold text-slate-800 text-xs">{selectedCase.landAreaHa} Hectares</span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block font-semibold">Assessed Compensation</span>
                  <span className="font-bold text-slate-800 text-xs">₹{selectedCase.compensationClaimCr} Cr</span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block font-semibold">Statutory Date</span>
                  <span className="font-bold text-slate-800 text-xs">{selectedCase.consentDate}</span>
                </div>
              </div>

              {/* Objection / Discrepancy Note */}
              <div className="p-3 bg-amber-50/70 border border-amber-300 rounded-lg space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-900 block">
                  Ground Truth Objection & Remarks
                </span>
                <div className="font-bold text-slate-900">{selectedCase.objectionType}</div>
                <p className="text-slate-700 leading-relaxed text-[11px]">{selectedCase.objectionSummary}</p>
              </div>

              {/* Uploaded Documents List */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-700 block">Attached Legal Documents ({selectedCase.documentsCount})</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                    <span>1. Khatoni Record #412</span>
                    <span className="text-emerald-700 font-bold">✓ Verified</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                    <span>2. Aadhaar e-KYC Doc</span>
                    <span className="text-emerald-700 font-bold">✓ Linked</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                    <span>3. Bank Passbook / IFSC</span>
                    <span className="text-emerald-700 font-bold">✓ PFMS Ready</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                    <span>4. Consent Form A-1</span>
                    <span className={selectedCase.documentsVerified ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                      {selectedCase.documentsVerified ? '✓ Endorsed' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCase(null);
                    if (onSelectParcel) onSelectParcel(selectedCase.parcelId);
                    if (onNavigateTab) onNavigateTab('digital-twin');
                  }}
                  className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Inspect Parcel #{selectedCase.parcelId} in 3D Twin</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
