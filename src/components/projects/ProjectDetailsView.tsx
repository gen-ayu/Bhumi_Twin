import React from 'react';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  IndianRupee,
  Layers,
  Users,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ExternalLink,
  Download,
  Activity,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { ProjectRecord, ALL_PROJECTS_DATA } from '../../data/projectsData';
import { NavTab } from '../layout/GovHeader';
import { useLanguage } from '../../context/LanguageContext';

interface ProjectDetailsViewProps {
  projectId: string;
  onBack: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onSelectParcel?: (parcelId: string) => void;
}

const STAGES = [
  { id: 'survey', label: 'Joint Survey (JMS)', labelHi: 'संयुक्त सर्वेक्षण' },
  { id: 'sec11', label: 'Sec 11 Notification', labelHi: 'धारा 11 अधिसूचना' },
  { id: 'sec15', label: 'Sec 15 Objections', labelHi: 'धारा 15 आपत्तियां' },
  { id: 'sec19', label: 'Sec 19 Declaration', labelHi: 'धारा 19 घोषणा' },
  { id: 'award', label: 'Award Declaration', labelHi: 'अवार्ड घोषणा' },
  { id: 'compensation', label: 'Compensation Disbursal', labelHi: 'मुआवजा वितरण' },
  { id: 'rnr', label: 'R&R Resettlement', labelHi: 'पुनर्वास एवं पुनर्स्थापन' },
  { id: 'possession', label: 'Physical Possession', labelHi: 'भौतिक कब्जा' },
];

export const ProjectDetailsView: React.FC<ProjectDetailsViewProps> = ({
  projectId,
  onBack,
  onNavigateTab,
  onSelectParcel,
}) => {
  const { language } = useLanguage();
  const project: ProjectRecord =
    ALL_PROJECTS_DATA.find((p) => p.id === projectId) || ALL_PROJECTS_DATA[0];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Possession':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Delayed':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      case 'Compensation':
      case 'Award':
      case 'R&R':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-300';
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Critical':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-300 font-semibold';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Low':
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  // Determine active pipeline stage based on project status
  const getActiveStageIndex = (status: string) => {
    switch (status) {
      case 'Not Started':
        return -1;
      case 'Survey':
        return 0;
      case 'Notification':
        return 1;
      case 'Award':
        return 4;
      case 'Compensation':
        return 5;
      case 'R&R':
        return 6;
      case 'Possession':
        return 7;
      case 'Completed':
        return 8;
      case 'Delayed':
        return 5;
      default:
        return 3;
    }
  };

  const currentStageIdx = getActiveStageIndex(project.status);

  return (
    <div id="project-details-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-amber-800 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'hi' ? 'परियोजनाओं की सूची पर वापस' : 'Back to All Projects'}</span>
          </button>
          <span className="text-slate-300">|</span>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span>Projects</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">{project.state}</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">{project.district}</span>
            <span>/</span>
            <span className="font-mono text-slate-600 font-bold">{project.id}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('gis-map')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'जीआईएस मानचित्र में देखें' : 'View on GIS Map'}</span>
          </button>
          <button
            onClick={() => {
              if (onSelectParcel) onSelectParcel('P-204');
              onNavigateTab('digital-twin');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'डिजिटल ट्विन निरीक्षण' : 'Inspect Digital Twin'}</span>
          </button>
          <button
            onClick={() => alert(`Exporting comprehensive land acquisition dossier for ${project.id}...`)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Download PDF Dossier"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Main Project Profile Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
                {project.id}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                {project.projectType}
              </span>
              <span className={`px-2.5 py-0.5 rounded text-[11px] border flex items-center gap-1 ${getStatusBadge(project.status)}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                <span>{project.status}</span>
              </span>
              <span className={`px-2.5 py-0.5 rounded text-[11px] border flex items-center gap-1 ${getRiskBadge(project.riskLevel)}`}>
                <ShieldAlert className="w-3 h-3" />
                <span>Risk: {project.riskLevel}</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              {language === 'hi' && project.nameHi ? project.nameHi : project.name}
            </h1>

            {project.description && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {project.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 pt-1 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{project.district}, {project.state}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{project.agency}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Nodal: <strong className="text-slate-800">{project.nodalOfficer}</strong></span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Target: <strong className="text-slate-800">{project.targetDate}</strong></span>
              </span>
            </div>
          </div>

          {/* Quick Health / Progress Radial */}
          <div className="shrink-0 flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5 self-start">
            <div className="text-center">
              <div className="text-2xl font-black text-[#EA580C]">{project.acquisitionProgress}%</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Acquisition Completed</div>
            </div>
          </div>
        </div>

        {/* Villages Covered */}
        {project.villages && project.villages.length > 0 && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Notified Villages:</span>
            {project.villages.map((v, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px]"
              >
                {v}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 4 Essential Monitoring KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Land Proposed vs Acquired */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Land Acquisition</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{project.landAcquired}</span>
            <span className="text-xs text-slate-500 font-medium">/ {project.landProposed} Ha</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#EA580C] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, project.acquisitionProgress)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Progress</span>
            <span className="font-bold text-slate-800">{project.acquisitionProgress}%</span>
          </div>
        </div>

        {/* Compensation Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Compensation Disbursed</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">₹{project.compensationDisbursedCr}</span>
            <span className="text-xs text-slate-500 font-medium">/ ₹{project.compensationAssessedCr} Cr</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  100,
                  Math.round((project.compensationDisbursedCr / (project.compensationAssessedCr || 1)) * 100)
                )}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Disbursal Rate</span>
            <span className="font-bold text-emerald-700">
              {Math.round((project.compensationDisbursedCr / (project.compensationAssessedCr || 1)) * 100)}%
            </span>
          </div>
        </div>

        {/* Physical Possession */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Physical Possession</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{project.possessionPercent}%</span>
            <span className="text-xs text-slate-500 font-medium">Handover</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, project.possessionPercent)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Remaining Encroachments</span>
            <span className="font-bold text-slate-800">{Math.max(0, 100 - project.possessionPercent)}%</span>
          </div>
        </div>

        {/* Affected Families & R&R */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Affected Families</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{project.affectedFamilies}</span>
            <span className="text-xs text-slate-500 font-medium">PAP Households</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: '78%' }} />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>R&R Verification</span>
            <span className="font-bold text-purple-700">78% Settled</span>
          </div>
        </div>
      </div>

      {/* 8-Stage Statutory Land Acquisition Workflow Pipeline */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              RFCTLARR Statutory Land Acquisition Pipeline
            </h2>
            <p className="text-xs text-slate-500">
              Stages governed under Right to Fair Compensation and Transparency in Land Acquisition Act
            </p>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
            Current: {project.status}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
          {STAGES.map((stage, idx) => {
            const isPassed = idx < currentStageIdx;
            const isCurrent = idx === currentStageIdx;
            return (
              <div
                key={stage.id}
                className={`p-2.5 rounded-lg border text-center transition-all ${
                  isPassed
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                    : isCurrent
                    ? 'bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-400/30 font-semibold'
                    : 'bg-slate-50/70 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex justify-center mb-1">
                  {isPassed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[9px] font-bold text-slate-400">
                      {idx + 1}
                    </div>
                  )}
                </div>
                <div className="text-[11px] leading-tight font-medium">
                  {language === 'hi' ? stage.labelHi : stage.label}
                </div>
                <div className="text-[9px] mt-1 text-slate-500">
                  {isPassed ? 'Completed' : isCurrent ? 'Active Stage' : 'Pending'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Land Parcels / Khata Overview Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Land Parcels Under Acquisition
            </h2>
            <p className="text-xs text-slate-500">
              Geo-referenced revenue parcels mapped to this project alignment
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('gis-map')}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Open Spatial Viewer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-3 py-2.5">Parcel / Survey No</th>
                <th className="px-3 py-2.5">Village</th>
                <th className="px-3 py-2.5">Area (Ha)</th>
                <th className="px-3 py-2.5">Land Type</th>
                <th className="px-3 py-2.5">Compensation Status</th>
                <th className="px-3 py-2.5">Risk Flag</th>
                <th className="px-3 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-amber-50/50">
                <td className="px-3 py-2 font-mono font-semibold text-slate-900">P-204 / 412/3B</td>
                <td className="px-3 py-2">{project.villages?.[0] || 'Rampur'}</td>
                <td className="px-3 py-2 font-mono">2.45</td>
                <td className="px-3 py-2">Agricultural</td>
                <td className="px-3 py-2">
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px]">
                    Assessment Done
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-bold">
                    Court Dispute
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => {
                      if (onSelectParcel) onSelectParcel('P-204');
                      onNavigateTab('digital-twin');
                    }}
                    className="text-amber-700 hover:text-amber-800 font-semibold cursor-pointer underline underline-offset-2"
                  >
                    Inspect Twin →
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-3 py-2 font-mono font-semibold text-slate-900">P-205 / 413/1A</td>
                <td className="px-3 py-2">{project.villages?.[0] || 'Rampur'}</td>
                <td className="px-3 py-2 font-mono">1.80</td>
                <td className="px-3 py-2">Agricultural</td>
                <td className="px-3 py-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px]">
                    Disbursed (Direct DBTs)
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px]">
                    Clear
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => {
                      if (onSelectParcel) onSelectParcel('P-205');
                      onNavigateTab('digital-twin');
                    }}
                    className="text-slate-600 hover:text-amber-700 font-medium cursor-pointer underline underline-offset-2"
                  >
                    Inspect →
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-3 py-2 font-mono font-semibold text-slate-900">P-206 / 414/2</td>
                <td className="px-3 py-2">{project.villages?.[1] || 'Shivpur'}</td>
                <td className="px-3 py-2 font-mono">3.12</td>
                <td className="px-3 py-2">Commercial / Abadi</td>
                <td className="px-3 py-2">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[11px]">
                    Award Declared
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px]">
                    Structure Value Check
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => {
                      if (onSelectParcel) onSelectParcel('P-206');
                      onNavigateTab('digital-twin');
                    }}
                    className="text-slate-600 hover:text-amber-700 font-medium cursor-pointer underline underline-offset-2"
                  >
                    Inspect →
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
