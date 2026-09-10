import React, { useState } from 'react';
import {
  Activity,
  Calendar,
  Clock,
  ShieldCheck,
  FileText,
  User,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Hash
} from 'lucide-react';
import { ProjectTimelineEvent } from '../../../data/projectWorkspaceData';

interface ProjectActivityTimelineProps {
  activityTimeline: ProjectTimelineEvent[];
}

export const ProjectActivityTimeline: React.FC<ProjectActivityTimelineProps> = ({
  activityTimeline,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedEvents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredEvents = activityTimeline.filter((evt) => {
    if (filterType === 'ALL') return true;
    return evt.eventType === filterType;
  });

  const getEventBadge = (type: ProjectTimelineEvent['eventType']) => {
    switch (type) {
      case 'survey':
        return { bg: 'bg-blue-50 text-blue-800 border-blue-200', label: 'Survey' };
      case 'notification':
        return { bg: 'bg-indigo-50 text-indigo-800 border-indigo-200', label: 'Gazette Notification' };
      case 'objection':
        return { bg: 'bg-amber-50 text-amber-800 border-amber-200', label: 'Objection Hearing' };
      case 'declaration':
        return { bg: 'bg-purple-50 text-purple-800 border-purple-200', label: 'Declaration' };
      case 'award':
        return { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: 'Award' };
      case 'compensation':
        return { bg: 'bg-teal-50 text-teal-800 border-teal-200', label: 'PFMS Disbursal' };
      case 'verification':
        return { bg: 'bg-orange-50 text-orange-800 border-orange-200', label: 'Field Verification' };
      case 'consent':
        return { bg: 'bg-green-50 text-green-800 border-green-200', label: 'Consent Record' };
      case 'legal':
      default:
        return { bg: 'bg-rose-50 text-rose-800 border-rose-200', label: 'Court Notice' };
    }
  };

  return (
    <div id="project-activity-timeline-section" className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-900"></span>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              9. Statutory Project Activity & Tamper-Evident Audit Timeline
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable chronological register of statutory orders, gazette notifications, tribunal hearings, and field verifications
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All Events' },
            { id: 'verification', label: 'Field Verifications' },
            { id: 'compensation', label: 'Disbursals' },
            { id: 'legal', label: 'Court Cases' },
            { id: 'consent', label: 'Consent' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilterType(item.id)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer text-[11px] whitespace-nowrap ${
                filterType === item.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {filteredEvents.map((evt) => {
          const badge = getEventBadge(evt.eventType);
          const isExpanded = !!expandedEvents[evt.id];

          return (
            <div key={evt.id} className="relative group">
              {/* Timeline Marker Dot */}
              <div className="absolute -left-6 sm:-left-8 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-slate-600 flex items-center justify-center group-hover:border-[#EA580C] transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-[#EA580C]" />
              </div>

              {/* Event Card */}
              <div className="bg-slate-50 hover:bg-white rounded-xl border border-slate-200 p-3.5 transition-all hover:border-slate-300 hover:shadow-2xs space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="font-mono text-slate-500 text-[11px]">
                      {evt.date} • {evt.time}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-700 font-mono text-[10px]">
                      {evt.status}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleExpand(evt.id)}
                    className="text-slate-400 hover:text-slate-700 text-xs flex items-center gap-1 self-start cursor-pointer"
                  >
                    <span>{isExpanded ? 'Less' : 'Details'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                    {evt.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                {/* Footer Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>
                      <strong className="text-slate-700">{evt.actor}</strong> ({evt.actorDesignation})
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      Ref: {evt.refDocNumber}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{evt.hash}</span>
                    </span>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1.5 animate-in fade-in">
                    <div className="font-bold text-slate-800">Statutory Audit Signature Block</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                      <div>
                        <span className="text-slate-400 block">Record Event ID</span>
                        <span className="font-mono font-bold text-slate-800">{evt.id}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Lifecycle Stage</span>
                        <span className="font-bold text-slate-800">{evt.stage}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Digital Verification Hash</span>
                        <span className="font-mono text-slate-700">{evt.hash}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Timestamp Verification</span>
                        <span className="text-slate-700">{evt.date}, {evt.time} (NTP Synced)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
