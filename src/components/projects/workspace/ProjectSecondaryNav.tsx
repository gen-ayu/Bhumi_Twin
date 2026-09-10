import React, { useRef } from 'react';
import {
  LayoutDashboard,
  Clock,
  Users,
  Sparkles,
  UserCheck,
  Camera,
  ShieldAlert,
  History,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export type WorkspaceTabId =
  | 'overview'
  | 'acquisition'
  | 'officers'
  | 'simulator'
  | 'consent'
  | 'evidence'
  | 'risk'
  | 'activity';

export interface TabItem {
  id: WorkspaceTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeType?: 'default' | 'success' | 'alert' | 'highlight';
}

interface ProjectSecondaryNavProps {
  activeTab: WorkspaceTabId;
  onTabClick: (tabId: WorkspaceTabId) => void;
  counts?: {
    officers?: number;
    consentRate?: number;
    evidence?: number;
    highRisk?: number;
    activity?: number;
  };
}

export const ProjectSecondaryNav: React.FC<ProjectSecondaryNavProps> = ({
  activeTab,
  onTabClick,
  counts,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const tabs: TabItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: 'Summary',
      badgeType: 'default',
    },
    {
      id: 'acquisition',
      label: 'Acquisition',
      icon: Clock,
      badge: '8 Stages',
      badgeType: 'default',
    },
    {
      id: 'officers',
      label: 'Field Officers',
      icon: Users,
      badge: counts?.officers ? `${counts.officers}` : '4',
      badgeType: 'default',
    },
    {
      id: 'simulator',
      label: 'What-If Simulator',
      icon: Sparkles,
      badge: 'AI Rec',
      badgeType: 'highlight',
    },
    {
      id: 'consent',
      label: 'Consent & Objections',
      icon: UserCheck,
      badge: counts?.consentRate ? `${counts.consentRate}%` : '68.9%',
      badgeType: 'success',
    },
    {
      id: 'evidence',
      label: 'Field Evidence',
      icon: Camera,
      badge: counts?.evidence ? `${counts.evidence}` : '8',
      badgeType: 'default',
    },
    {
      id: 'risk',
      label: 'Risk & Parcels',
      icon: ShieldAlert,
      badge: counts?.highRisk ? `${counts.highRisk}` : '18',
      badgeType: 'alert',
    },
    {
      id: 'activity',
      label: 'Activity',
      icon: History,
      badge: counts?.activity ? `${counts.activity}` : '8',
      badgeType: 'default',
    },
  ];

  const scrollNav = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getBadgeStyle = (type?: TabItem['badgeType'], isActive?: boolean) => {
    if (isActive) {
      return 'bg-[#EA580C] text-white';
    }
    switch (type) {
      case 'highlight':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-300';
      case 'success':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'alert':
        return 'bg-rose-100 text-rose-800 border border-rose-300 font-bold';
      case 'default':
      default:
        return 'bg-slate-200/80 text-slate-700';
    }
  };

  return (
    <div
      id="secondary-project-navbar"
      className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-white/95 backdrop-blur-md border-y border-slate-200 shadow-2xs transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left Scroll Chevron (Mobile/Tablet) */}
        <button
          type="button"
          onClick={() => scrollNav('left')}
          className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg shrink-0 cursor-pointer"
          title="Scroll tabs left"
          aria-label="Scroll tabs left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Tab Strip */}
        <div
          ref={scrollContainerRef}
          className="flex-1 flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-2 scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabClick(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-amber-50 text-[#C2410C] border border-amber-300 shadow-2xs font-bold ring-1 ring-amber-400/30'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive ? 'text-[#EA580C]' : 'text-slate-400'
                  }`}
                />
                <span>{tab.label}</span>

                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono shrink-0 transition-colors ${getBadgeStyle(
                      tab.badgeType,
                      isActive
                    )}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Scroll Chevron (Mobile/Tablet) */}
        <button
          type="button"
          onClick={() => scrollNav('right')}
          className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg shrink-0 cursor-pointer"
          title="Scroll tabs right"
          aria-label="Scroll tabs right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
