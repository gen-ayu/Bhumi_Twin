import React from 'react';
import { Globe, UserCheck } from 'lucide-react';
import { UserRole } from '../../types';

interface GovTopBarProps {
  currentRole: UserRole;
  language: 'en' | 'hi';
  onToggleLanguage: () => void;
  highContrast?: boolean;
  onToggleHighContrast?: () => void;
  fontSize?: 'normal' | 'large' | 'larger';
  onChangeFontSize?: (size: 'normal' | 'large' | 'larger') => void;
  onSelectRole?: (role: UserRole) => void;
  onOpenLogin: () => void;
}

export const GovTopBar: React.FC<GovTopBarProps> = ({
  currentRole,
  language,
  onToggleLanguage,
  onOpenLogin,
}) => {
  return (
    <div id="gov-top-utility-bar" className="w-full text-xs border-b border-slate-200 bg-white select-none transition-colors duration-200">
      {/* Subtle Tricolor Top Accent Line */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-[#FFFFFF] border-y border-slate-200"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2 text-slate-700">
        {/* Left: Indian Flag & Label */}
        <div className="flex items-center gap-2">
          {/* Flag SVG */}
          <div className="flex flex-col w-5 h-3.5 border border-slate-300 rounded-[1px] overflow-hidden shadow-xs">
            <div className="h-1/3 bg-[#FF9933]"></div>
            <div className="h-1/3 bg-white flex items-center justify-center">
              <div className="w-1 h-1 rounded-full border-[0.5px] border-[#000080] flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-[#000080]"></div>
              </div>
            </div>
            <div className="h-1/3 bg-[#138808]"></div>
          </div>
          <span className="font-semibold tracking-wide text-[11px] text-slate-800">
            {language === 'hi' ? 'भारत सरकार • ग्रामीण विकास मंत्रालय' : 'GOVERNMENT OF INDIA • Ministry of Rural Development'}
          </span>
        </div>

        {/* Right: Language & User Profile */}
        <div className="flex items-center gap-3 ml-auto text-[11px]">

          {/* Language Toggle Dropdown */}
          <button
            id="lang-toggle-btn"
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-medium cursor-pointer"
          >
            <Globe className="w-3 h-3 text-slate-600" />
            <span>{language === 'en' ? 'English (EN)' : 'हिन्दी (HI)'}</span>
          </button>

          {/* User Role Badge / Profile Link */}
          <button
            id="topbar-login-role-btn"
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors cursor-pointer"
          >
            <UserCheck className="w-3 h-3" />
            <span className="capitalize">
              {currentRole === 'citizen' ? 'Citizen' : currentRole === 'officer' ? 'Officer' : 'Admin'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
