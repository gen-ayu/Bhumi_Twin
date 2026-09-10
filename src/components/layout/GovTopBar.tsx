import React from 'react';
import { Globe, UserCheck, Eye, Sparkles } from 'lucide-react';
import { UserRole } from '../../types';

interface GovTopBarProps {
  currentRole: UserRole;
  language: 'en' | 'hi';
  onToggleLanguage: () => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  fontSize: 'normal' | 'large' | 'larger';
  onChangeFontSize: (size: 'normal' | 'large' | 'larger') => void;
  onSelectRole: (role: UserRole) => void;
  onOpenLogin: () => void;
}

export const GovTopBar: React.FC<GovTopBarProps> = ({
  currentRole,
  language,
  onToggleLanguage,
  highContrast,
  onToggleHighContrast,
  fontSize,
  onChangeFontSize,
  onSelectRole,
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
          <span className="hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-800 border border-amber-200 font-medium">
            SIH-2026 Innovation Portal
          </span>
        </div>

        {/* Right: Accessibility, Language, Skip, User */}
        <div className="flex items-center gap-3 ml-auto text-[11px]">
          <a
            href="#main-content"
            className="hidden sm:inline-block text-slate-600 hover:text-slate-900 underline underline-offset-2 focus:outline-hidden"
          >
            {language === 'hi' ? 'मुख्य सामग्री पर जाएं' : 'Skip to main content'}
          </a>

          <div className="h-3.5 w-px bg-slate-300 hidden sm:block"></div>

          {/* Font Size Selector (A- / A / A+) */}
          <div className="flex items-center bg-slate-100 rounded border border-slate-200 p-0.5">
            <button
              id="font-size-small-btn"
              onClick={() => onChangeFontSize('normal')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${fontSize === 'normal' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
              title="Standard font size"
            >
              A
            </button>
            <button
              id="font-size-large-btn"
              onClick={() => onChangeFontSize('large')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${fontSize === 'large' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
              title="Large font size"
            >
              A+
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            id="high-contrast-toggle-btn"
            onClick={onToggleHighContrast}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded border transition-colors ${
              highContrast ? 'bg-slate-900 text-yellow-300 border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title="Toggle High Contrast Mode"
          >
            <Eye className="w-3 h-3" />
            <span className="hidden md:inline">{highContrast ? 'Contrast: ON' : 'High Contrast'}</span>
          </button>

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
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors cursor-pointer"
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
