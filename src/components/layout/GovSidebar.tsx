import React from 'react';
import {
  Home,
  Layers,
  Activity,
  GitCompare,
  Satellite,
  ClipboardCheck,
  User,
  FileText,
  ChevronLeft,
  ChevronRight,
  FolderKanban
} from 'lucide-react';
import { NavTab } from './GovHeader';
import { UserRole } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface GovSidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentRole: UserRole;
  language: 'en' | 'hi';
  selectedParcelId?: string;
  expanded: boolean;
  onToggleExpand: () => void;
}

export const GovSidebar: React.FC<GovSidebarProps> = ({
  currentTab,
  onSelectTab,
  currentRole,
  language,
  selectedParcelId,
  expanded,
  onToggleExpand,
}) => {
  const { t } = useLanguage();

  const navItems: {
    id: NavTab;
    labelEn: string;
    labelHi: string;
    icon: React.ReactNode;
    badge?: string;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      labelEn: 'Dashboard',
      labelHi: 'डैशबोर्ड',
      icon: <Home className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'projects',
      labelEn: 'Projects',
      labelHi: 'परियोजनाएं',
      icon: <FolderKanban className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'gis-map',
      labelEn: 'GIS Map',
      labelHi: 'जीआईएस मानचित्र',
      icon: <Layers className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'digital-twin',
      labelEn: 'Digital Twin',
      labelHi: 'डिजिटल ट्विन',
      icon: <Activity className="w-4 h-4 shrink-0" />,
      badge: selectedParcelId ? selectedParcelId : 'P-204',
      badgeColor: 'amber',
    },
    {
      id: 'simulator',
      labelEn: 'What-If Simulator',
      labelHi: 'सिमुलेटर',
      icon: <GitCompare className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'satellite',
      labelEn: 'Satellite Alerts',
      labelHi: 'उपग्रह अलर्ट',
      icon: <Satellite className="w-4 h-4 shrink-0" />,
      badge: '1 NEW',
      badgeColor: 'rose',
    },
    {
      id: 'verification',
      labelEn: 'Field Verification',
      labelHi: 'क्षेत्र सत्यापन',
      icon: <ClipboardCheck className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'citizen-portal',
      labelEn: 'Citizen Portal',
      labelHi: 'नागरिक पोर्टल',
      icon: <User className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'audit-log',
      labelEn: 'Audit Log',
      labelHi: 'ऑडिट लॉग',
      icon: <FileText className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <aside
      id="gov-main-sidebar"
      aria-label="Main Navigation Sidebar"
      className={`relative bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300 z-30 select-none shadow-xs ${
        expanded ? 'w-64' : 'w-16'
      }`}
    >
      {/* Indian Flag (Tiranga) Vertical Spine Line on the left edge */}
      <div className="absolute left-0 top-0 bottom-0 w-1 flex flex-col pointer-events-none z-10">
        <div className="h-1/3 w-full bg-[#FF9933]"></div>
        <div className="h-1/3 w-full bg-slate-300"></div>
        <div className="h-1/3 w-full bg-[#138808]"></div>
      </div>

      {/* Sidebar Header / 3-Dashes Bar */}
      <div className="p-3 border-b border-slate-100 flex items-center justify-between gap-2">
        {expanded ? (
          <div className="flex items-center gap-2 pl-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <div className="flex flex-col">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800">
                {language === 'hi' ? 'पोर्टल मॉड्यूल' : 'PORTAL MODULES'}
              </span>
              <span className="text-[9px] text-slate-500 font-medium">
                {language === 'hi' ? 'राष्ट्रीय भूमि अभिलेख' : 'National Land Records'}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          </div>
        )}

        {/* Collapsible 3-Dashes (Hamburger) Toggle Button */}
        <button
          id="sidebar-collapse-toggle-btn"
          onClick={onToggleExpand}
          className={`p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer flex flex-col justify-center items-center gap-1 shrink-0 ${
            expanded ? '' : 'mx-auto'
          }`}
          title={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {/* 3 dashes styled in Indian Flag colors */}
          <span className="w-4 h-0.5 rounded-full bg-[#FF9933] transition-all"></span>
          <span className="w-4 h-0.5 rounded-full bg-[#000080] transition-all"></span>
          <span className="w-4 h-0.5 rounded-full bg-[#138808] transition-all"></span>
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1 no-scrollbar">
        {navItems.map((item) => {
          const active = currentTab === item.id;
          const label = language === 'hi' ? item.labelHi : item.labelEn;

          return (
            <button
              key={item.id}
              id={`sidebar-tab-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer group relative ${
                active
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-amber-50/60'
              } ${expanded ? 'justify-start' : 'justify-center'}`}
              title={!expanded ? label : undefined}
            >
              {/* Left active marker (Indian Saffron) when expanded */}
              {active && expanded && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#FF9933]"></span>
              )}

              {/* Icon */}
              <div
                className={`${
                  active
                    ? 'text-white'
                    : 'text-slate-500 group-hover:text-amber-700 transition-colors'
                }`}
              >
                {item.icon}
              </div>

              {/* Label & Badges (shown when expanded) */}
              {expanded && (
                <div className="flex-1 flex items-center justify-between overflow-hidden">
                  <span className="truncate text-left">{label}</span>
                  {item.badge && (
                    <span
                      className={`ml-1.5 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
                        active
                          ? 'bg-white/20 text-white border border-white/30'
                          : item.badgeColor === 'rose'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {item.badge === '1 NEW' && language === 'hi' ? '1 नया' : item.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Subtle hover tooltip badge when collapsed */}
              {!expanded && item.badge && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-600 border border-white"></span>
              )}
            </button>
          );
        })}
      </nav>

    </aside>
  );
};
export default GovSidebar;
