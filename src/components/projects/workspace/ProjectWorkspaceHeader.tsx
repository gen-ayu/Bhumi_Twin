import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  ShieldAlert,
  Edit3,
  Download,
  Share2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Activity,
  Layers,
  FileSpreadsheet,
  X,
  Check,
  Printer
} from 'lucide-react';
import { ProjectRecord } from '../../../data/projectsData';
import { NavTab } from '../../layout/GovHeader';
import { useLanguage } from '../../../context/LanguageContext';

interface ProjectWorkspaceHeaderProps {
  project: ProjectRecord;
  overallStatus: 'On Track' | 'At Risk' | 'Delayed';
  overallRiskScore: number;
  lastUpdated: string;
  onBack: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onSelectParcel?: (parcelId: string) => void;
}

export const ProjectWorkspaceHeader: React.FC<ProjectWorkspaceHeaderProps> = ({
  project,
  overallStatus,
  overallRiskScore,
  lastUpdated,
  onBack,
  onNavigateTab,
  onSelectParcel,
}) => {
  const { language } = useLanguage();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Edit form state
  const [statusVal, setStatusVal] = useState(project.status);
  const [targetDateVal, setTargetDateVal] = useState(project.targetDate);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsEditModalOpen(false);
    }, 1000);
  };

  // Status visual styles
  const getOverallStatusBadge = () => {
    switch (overallStatus) {
      case 'On Track':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400/20';
      case 'At Risk':
        return 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-400/20';
      case 'Delayed':
      default:
        return 'bg-rose-50 text-rose-800 border-rose-300 ring-1 ring-rose-400/20';
    }
  };

  const getRiskScoreBadge = (score: number) => {
    if (score >= 70) {
      return {
        bg: 'bg-rose-50 text-rose-800 border-rose-300',
        dot: 'bg-rose-500',
        label: 'High Injunction & Dispute Risk',
      };
    } else if (score >= 40) {
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-300',
        dot: 'bg-amber-500',
        label: 'Attention Needed',
      };
    } else {
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        dot: 'bg-emerald-500',
        label: 'Low Risk',
      };
    }
  };

  const riskInfo = getRiskScoreBadge(overallRiskScore);

  return (
    <div id="project-header-section" className="space-y-4">
      {/* Breadcrumb Navigation & Global Quick Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-amber-800 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'परियोजना सूची पर वापस' : 'Back to All Projects'}</span>
          </button>
          <span className="text-slate-300">|</span>
          <div className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
            <span className="hover:text-slate-700 cursor-pointer" onClick={onBack}>Projects</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">{project.state}</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">{project.district}</span>
            <span>/</span>
            <span className="font-mono text-slate-700 font-bold bg-slate-100 px-1.5 py-0.5 rounded text-[11px] border border-slate-200">
              {project.id}
            </span>
          </div>
        </div>

        {/* Quick Navigations */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigateTab('gis-map')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
            title="Inspect Cadastral GIS Alignment"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'hi' ? 'जीआईएस मैप देखें' : 'View on GIS Map'}</span>
          </button>
          <button
            onClick={() => {
              if (onSelectParcel) onSelectParcel('PARCEL-001');
              onNavigateTab('digital-twin');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
            title="Open 3D Cadastral Digital Twin"
          >
            <Activity className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'hi' ? 'डिजिटल ट्विन' : 'Inspect Digital Twin'}</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Copy Workspace Link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Project Profile Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
          <div className="space-y-2 max-w-4xl">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-900 text-white shadow-2xs">
                {project.id}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-100/70 text-amber-900 border border-amber-300">
                {project.projectType}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono text-slate-600 bg-slate-100 border border-slate-200">
                Code: {project.code}
              </span>
              {/* Overall Project Status */}
              <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border flex items-center gap-1.5 ${getOverallStatusBadge()}`}>
                <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                <span>Status: {overallStatus}</span>
              </span>
              {/* Overall Risk Score */}
              <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border flex items-center gap-1.5 ${riskInfo.bg}`}>
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Risk Score: {overallRiskScore}/100 ({project.riskLevel} Risk)</span>
              </span>
            </div>

            {/* Project Name */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              {language === 'hi' && project.nameHi ? project.nameHi : project.name}
            </h1>

            {project.description && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                {project.description}
              </p>
            )}

            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 pt-1 text-xs text-slate-600 border-t border-slate-100">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span><strong>District:</strong> {project.district}, {project.state}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span><strong>Agency:</strong> {project.agency}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span><strong>Target:</strong> <span className="font-semibold text-slate-900">{project.targetDate}</span></span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span><strong>Last Updated:</strong> <span className="text-slate-800 font-mono text-[11px]">{lastUpdated}</span></span>
              </span>
            </div>
          </div>

          {/* Right Action Block (Edit Project & Export Dossier) */}
          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5 self-start lg:min-w-[200px]">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs hover:border-slate-400 transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-600" />
              <span>Edit Project Details</span>
            </button>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg shadow-2xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Project Dossier</span>
            </button>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Acquisition Complete</span>
              <span className="text-xl font-black text-[#EA580C]">{project.acquisitionProgress}%</span>
              <span className="text-[10px] text-slate-500 block font-mono mt-0.5">{project.landAcquired} / {project.landProposed} Ha</span>
            </div>
          </div>
        </div>

        {/* Notified Revenue Villages */}
        {project.villages && project.villages.length > 0 && (
          <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">Notified Villages under Sec 11:</span>
            {project.villages.map((village, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium text-[11px]"
              >
                {village}
              </span>
            ))}
            <span className="text-[11px] text-slate-400 ml-1 font-mono">({project.villages.length} Revenue Circles)</span>
          </div>
        )}
      </div>

      {/* Modal: Edit Project */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-300 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm">Edit Project Specifications</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs">
              {savedSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Project metadata successfully updated in Government Registry.</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Name (Official)</label>
                <input
                  type="text"
                  defaultValue={project.name}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Completion Date</label>
                  <input
                    type="text"
                    value={targetDateVal}
                    onChange={(e) => setTargetDateVal(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Statutory Stage Status</label>
                  <select
                    value={statusVal}
                    onChange={(e) => setStatusVal(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
                  >
                    <option value="Survey">Joint Survey (JMS)</option>
                    <option value="Notification">Sec 11 Notification</option>
                    <option value="Award">Award Declaration</option>
                    <option value="Compensation">Compensation Disbursal</option>
                    <option value="R&R">R&R Resettlement</option>
                    <option value="Possession">Physical Possession</option>
                    <option value="Delayed">Delayed / Litigated</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nodal Officer (CALA)</label>
                <input
                  type="text"
                  defaultValue={project.nodalOfficer}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#EA580C] hover:bg-[#C2410C] text-white rounded-lg cursor-pointer font-bold flex items-center gap-1.5 shadow-2xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Export Project Dossier */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-300 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-4 bg-[#0F172A] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-[#EA580C]" />
                <h3 className="font-bold text-sm">Export Statutory Land Acquisition Dossier</h3>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="font-bold text-slate-900">{project.name}</div>
                <div className="text-slate-600 text-[11px]">
                  Project ID: <span className="font-mono font-bold text-slate-800">{project.id}</span> | State: {project.state} ({project.district})
                </div>
                <div className="text-[11px] text-slate-500">
                  Includes Cadastral Land Inventory, 8-Stage Milestone Audit, People Consent Summary, Evidence Photos EXIF, and AI Corridor Analysis.
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-slate-700 block">Select Report Format</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      alert(`Generating Comprehensive PDF Dossier for ${project.id}...`);
                      setIsExportModalOpen(false);
                    }}
                    className="p-3 border-2 border-amber-500 bg-amber-50/50 rounded-lg flex flex-col items-center gap-1.5 hover:bg-amber-50 cursor-pointer text-center"
                  >
                    <Printer className="w-5 h-5 text-amber-700" />
                    <span className="font-bold text-slate-900">PDF Legal Dossier</span>
                    <span className="text-[10px] text-slate-500">RFCTLARR Formatted</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      alert(`Exporting Land Cadastre & Compensation XLSX for ${project.id}...`);
                      setIsExportModalOpen(false);
                    }}
                    className="p-3 border border-slate-300 bg-white hover:bg-slate-50 rounded-lg flex flex-col items-center gap-1.5 cursor-pointer text-center"
                  >
                    <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                    <span className="font-bold text-slate-900">Excel / CSV Cadastre</span>
                    <span className="text-[10px] text-slate-500">PFMS & Khasra Ledger</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
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
