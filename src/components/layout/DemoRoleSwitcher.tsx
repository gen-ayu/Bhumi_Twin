import React, { useState } from 'react';
import { Shield, Sparkles, ChevronRight, Play, Check, ChevronDown } from 'lucide-react';
import { UserRole } from '../../types';
import { NavTab } from './GovHeader';

interface DemoRoleSwitcherProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onSelectParcel: (parcelId: string) => void;
}

export const DemoRoleSwitcher: React.FC<DemoRoleSwitcherProps> = ({
  currentRole,
  onSelectRole,
  currentTab,
  onSelectTab,
  onSelectParcel,
}) => {
  const [expanded, setExpanded] = useState(true);

  // The 7 SIH Pitch Flow Steps defined in Section 6 of prompt:
  const demoSteps = [
    {
      id: 1,
      title: 'GIS Map View',
      tab: 'gis-map' as NavTab,
      role: 'admin' as UserRole,
      parcelId: 'P-204',
      desc: 'Interactive 148-parcel cadastral grid with risk heatmaps',
    },
    {
      id: 2,
      title: 'Inspect High-Risk Parcel',
      tab: 'gis-map' as NavTab,
      role: 'admin' as UserRole,
      parcelId: 'P-204',
      desc: 'Select Critical Parcel #P-204 (Score 78) & open drawer',
    },
    {
      id: 3,
      title: 'Digital Twin & AI Risk Radar',
      tab: 'digital-twin' as NavTab,
      role: 'admin' as UserRole,
      parcelId: 'P-204',
      desc: 'Explainable AI factors: 8-stage lifecycle & ownership litigation',
    },
    {
      id: 4,
      title: 'Sentinel-2 Satellite Alert',
      tab: 'satellite' as NavTab,
      role: 'officer' as UserRole,
      parcelId: 'P-204',
      desc: 'Before/after physical change detection & advisory banner',
    },
    {
      id: 5,
      title: 'What-If Corridor Simulator',
      tab: 'simulator' as NavTab,
      role: 'admin' as UserRole,
      desc: 'Side-by-side Option A vs Option B: 18% fewer families displaced',
    },
    {
      id: 6,
      title: 'Citizen Portal',
      tab: 'citizen-portal' as NavTab,
      role: 'citizen' as UserRole,
      desc: 'Plain-language status, transparent compensation & DBT check',
    },
    {
      id: 7,
      title: 'Field Verification Form',
      tab: 'verification' as NavTab,
      role: 'officer' as UserRole,
      parcelId: 'P-204',
      desc: 'GPS geotag, photo drag-and-drop & status update toast',
    },
  ];

  const handleRunStep = (step: typeof demoSteps[0]) => {
    onSelectRole(step.role);
    if (step.parcelId) {
      onSelectParcel(step.parcelId);
    }
    onSelectTab(step.tab);
  };

  return (
    <div
      id="demo-role-switcher-container"
      className="fixed left-3 bottom-5 z-40 bg-slate-900/95 text-white rounded-xl shadow-2xl border border-slate-700 backdrop-blur-md transition-all duration-300 max-w-xs sm:max-w-sm"
    >
      {/* Header / Collapse Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span className="text-xs font-bold tracking-wide text-amber-400 uppercase">
            SIH Pitch Control
          </span>
        </div>
        
        <button
          id="toggle-demo-switcher-btn"
          onClick={() => setExpanded(!expanded)}
          className="text-slate-400 hover:text-white p-1 rounded transition-colors text-xs flex items-center gap-1 cursor-pointer"
        >
          <span className="text-[10px]">{expanded ? 'Minimize' : 'Expand'}</span>
          <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {expanded && (
        <div className="p-3 space-y-3">
          {/* Role Switcher Tabs */}
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Switch User Role Live</span>
              <span className="text-amber-400 font-mono text-[9px]">NO LOGOUT REQUIRED</span>
            </div>
            
            <div className="grid grid-cols-3 gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
              <button
                id="role-switch-admin"
                onClick={() => onSelectRole('admin')}
                className={`py-1.5 text-xs font-bold rounded transition-all cursor-pointer ${
                  currentRole === 'admin'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                Admin
              </button>
              <button
                id="role-switch-officer"
                onClick={() => onSelectRole('officer')}
                className={`py-1.5 text-xs font-bold rounded transition-all cursor-pointer ${
                  currentRole === 'officer'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                Officer
              </button>
              <button
                id="role-switch-citizen"
                onClick={() => onSelectRole('citizen')}
                className={`py-1.5 text-xs font-bold rounded transition-all cursor-pointer ${
                  currentRole === 'citizen'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                Citizen
              </button>
            </div>
          </div>

          {/* Guided Pitch Walkthrough Quick Navigator */}
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Play className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                SIH Guided Pitch Sequence
              </span>
              <span className="text-[9px] text-slate-400">7 Connected Steps</span>
            </div>

            <div className="space-y-1 max-h-48 overflow-y-auto pr-1 text-xs no-scrollbar">
              {demoSteps.map((step) => {
                const isCurrent = currentTab === step.tab && (step.role === currentRole || currentRole !== 'citizen');
                return (
                  <button
                    key={step.id}
                    onClick={() => handleRunStep(step)}
                    className={`w-full text-left p-1.5 rounded flex items-center justify-between gap-1.5 transition-colors cursor-pointer border ${
                      isCurrent
                        ? 'bg-amber-600/20 border-amber-500 text-amber-200'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-4 h-4 rounded-full bg-slate-700 text-amber-300 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                        {step.id}
                      </span>
                      <div className="truncate">
                        <div className="font-semibold leading-tight text-[11px] truncate">{step.title}</div>
                        <div className="text-[9px] text-slate-400 truncate">{step.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
