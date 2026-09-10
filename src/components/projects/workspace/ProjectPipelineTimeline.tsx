import React from 'react';
import {
  CheckCircle2,
  Clock,
  Circle,
  FileText,
  Calendar,
  ChevronRight,
  Info
} from 'lucide-react';
import { ProjectRecord } from '../../../data/projectsData';
import { useLanguage } from '../../../context/LanguageContext';

interface ProjectPipelineTimelineProps {
  project: ProjectRecord;
}

interface PipelineStageInfo {
  id: string;
  stepNumber: number;
  label: string;
  labelHi: string;
  sectionRef: string;
  dateStr: string;
  statusText: string;
  summary: string;
}

const LIFECYCLE_STAGES: PipelineStageInfo[] = [
  {
    id: 'survey',
    stepNumber: 1,
    label: 'Joint Survey (JMS)',
    labelHi: 'संयुक्त सर्वेक्षण (जेएमएस)',
    sectionRef: 'Rule 6 Cadastre',
    dateStr: 'Completed (10 Jan 2026)',
    statusText: 'Completed',
    summary: 'Cadastral demarcation & structure enumeration signed by joint team.',
  },
  {
    id: 'notification',
    stepNumber: 2,
    label: 'Sec 11 Notification',
    labelHi: 'धारा 11 अधिसूचना',
    sectionRef: 'Sec 11(1) RFCTLARR',
    dateStr: 'Published (14 Feb 2026)',
    statusText: 'Completed',
    summary: 'Preliminary gazette notification issued in UP State Gazette.',
  },
  {
    id: 'objection',
    stepNumber: 3,
    label: 'Sec 15 Objections',
    labelHi: 'धारा 15 सुनवाई',
    sectionRef: 'Sec 15(2) RFCTLARR',
    dateStr: 'Concluded (24 May 2026)',
    statusText: 'Completed',
    summary: '60-day objection hearing window completed by CALA tribunal.',
  },
  {
    id: 'declaration',
    stepNumber: 4,
    label: 'Sec 19 Declaration',
    labelHi: 'धारा 19 घोषणा',
    sectionRef: 'Sec 19(1) RFCTLARR',
    dateStr: 'Declared (15 Jul 2026)',
    statusText: 'Completed',
    summary: 'Formal acquisition declaration gazetted for public infrastructure.',
  },
  {
    id: 'award',
    stepNumber: 5,
    label: 'Award Declaration',
    labelHi: 'अवार्ड घोषणा (धारा 23)',
    sectionRef: 'Sec 23/30 Award',
    dateStr: 'Sanctioned (15 Jul 2026)',
    statusText: 'Completed',
    summary: '₹84.2 Cr compensation & 100% solatium sanctioned by Collector.',
  },
  {
    id: 'compensation',
    stepNumber: 6,
    label: 'Compensation Disbursal',
    labelHi: 'मुआवजा वितरण (डीबीटी)',
    sectionRef: 'Sec 77 Payment',
    dateStr: 'Active (Ongoing Tranche)',
    statusText: 'In Progress',
    summary: '₹41.4 Cr credited directly via PFMS DBT; escrow resolving in court.',
  },
  {
    id: 'rnr',
    stepNumber: 7,
    label: 'R&R Resettlement',
    labelHi: 'पुनर्वास एवं पुनर्स्थापन',
    sectionRef: 'Schedule II & III',
    dateStr: 'Underway (78% Settled)',
    statusText: 'In Progress',
    summary: 'Babatpur Sector 4 housing allotments & subsistence grants disbursing.',
  },
  {
    id: 'possession',
    stepNumber: 8,
    label: 'Physical Possession',
    labelHi: 'भौतिक कब्जा एवं हस्तांतरण',
    sectionRef: 'Sec 38 Possession',
    dateStr: 'Target (Nov 2026)',
    statusText: 'Upcoming',
    summary: 'Encumbrance-free handover to contractor once final tranches complete.',
  },
];

export const ProjectPipelineTimeline: React.FC<ProjectPipelineTimelineProps> = ({ project }) => {
  const { language } = useLanguage();

  // Determine which stage is currently active based on project status
  const getStageStatus = (stageIdx: number) => {
    // Flagship is in Compensation stage (index 5)
    let currentIdx = 5;
    if (project.status === 'Survey') currentIdx = 0;
    else if (project.status === 'Notification') currentIdx = 1;
    else if (project.status === 'Award') currentIdx = 4;
    else if (project.status === 'Compensation') currentIdx = 5;
    else if (project.status === 'R&R') currentIdx = 6;
    else if (project.status === 'Possession') currentIdx = 7;
    else if (project.status === 'Completed') currentIdx = 8;
    else if (project.status === 'Delayed') currentIdx = 5;

    if (stageIdx < currentIdx) return 'completed';
    if (stageIdx === currentIdx) return 'active';
    return 'pending';
  };

  return (
    <div id="acquisition-pipeline-section" className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#EA580C]"></span>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              3. Statutory Land Acquisition Lifecycle Pipeline
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Right to Fair Compensation & Transparency in Land Acquisition (RFCTLARR Act 2013) 8-Stage Progress
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Current Statutory Stage:</span>
          <span className="px-2.5 py-1 rounded-md font-bold text-amber-800 bg-amber-50 border border-amber-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            <span>{project.status === 'Delayed' ? 'Compensation Disbursal (Under Review)' : project.status}</span>
          </span>
        </div>
      </div>

      {/* Visual Pipeline Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-1">
        {LIFECYCLE_STAGES.map((stage, idx) => {
          const state = getStageStatus(idx);
          const isCompleted = state === 'completed';
          const isActive = state === 'active';

          return (
            <div
              key={stage.id}
              className={`relative rounded-xl p-3 border transition-all flex flex-col justify-between ${
                isCompleted
                  ? 'bg-emerald-50/70 border-emerald-300 text-slate-900 shadow-2xs'
                  : isActive
                  ? 'bg-amber-50/90 border-amber-400 text-slate-900 ring-2 ring-amber-400/30 shadow-xs'
                  : 'bg-slate-50/60 border-slate-200 text-slate-500 opacity-80'
              }`}
            >
              {/* Step counter & status icon */}
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isCompleted ? 'bg-emerald-200/70 text-emerald-900' : isActive ? 'bg-amber-200/80 text-amber-900' : 'bg-slate-200 text-slate-600'
                }`}>
                  Stage 0{stage.stepNumber}
                </span>

                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : isActive ? (
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                )}
              </div>

              {/* Title & Statutory Ref */}
              <div className="space-y-1">
                <div className="text-[11px] font-bold leading-tight line-clamp-2">
                  {language === 'hi' ? stage.labelHi : stage.label}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {stage.sectionRef}
                </div>
              </div>

              {/* Date & Status Pill */}
              <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-[10px] space-y-0.5">
                <div className={`font-semibold flex items-center gap-1 ${
                  isCompleted ? 'text-emerald-700' : isActive ? 'text-amber-800' : 'text-slate-500'
                }`}>
                  <Calendar className="w-3 h-3 shrink-0" />
                  <span className="truncate">{stage.dateStr}</span>
                </div>
                <div className="text-[9px] text-slate-500 line-clamp-2 leading-tight">
                  {stage.summary}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
