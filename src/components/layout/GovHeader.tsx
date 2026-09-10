import React, { useState } from 'react';
import {
  Search,
  Menu,
  X,
  Layers,
  Activity,
  GitCompare,
  Satellite,
  ClipboardCheck,
  FileText,
  User,
  ShieldAlert,
  Home,
  CheckCircle2
} from 'lucide-react';
import { UserRole } from '../../types';

export type NavTab =
  | 'dashboard'
  | 'gis-map'
  | 'digital-twin'
  | 'simulator'
  | 'verification'
  | 'satellite'
  | 'citizen-portal'
  | 'audit-log';

interface GovHeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentRole: UserRole;
  language: 'en' | 'hi';
  onSearch: (query: string) => void;
  onOpenLogin: () => void;
  selectedParcelId?: string;
}

export const GovHeader: React.FC<GovHeaderProps> = ({
  currentTab,
  onSelectTab,
  currentRole,
  language,
  onSearch,
  onOpenLogin,
  selectedParcelId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('Parcels');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const navItems: { id: NavTab; labelEn: string; labelHi: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', labelEn: 'Dashboard', labelHi: 'डैशबोर्ड', icon: <Home className="w-4 h-4" /> },
    { id: 'gis-map', labelEn: 'GIS Map', labelHi: 'जीआईएस मानचित्र', icon: <Layers className="w-4 h-4" /> },
    { id: 'digital-twin', labelEn: 'Digital Twin', labelHi: 'डिजिटल ट्विन', icon: <Activity className="w-4 h-4" />, badge: selectedParcelId ? selectedParcelId : undefined },
    { id: 'simulator', labelEn: 'What-If Simulator', labelHi: 'सिमुलेटर', icon: <GitCompare className="w-4 h-4" />, badge: 'AI Core' },
    { id: 'satellite', labelEn: 'Satellite Alerts', labelHi: 'उपग्रह अलर्ट', icon: <Satellite className="w-4 h-4" />, badge: 'Sentinel-2' },
    { id: 'verification', labelEn: 'Field Verification', labelHi: 'क्षेत्र सत्यापन', icon: <ClipboardCheck className="w-4 h-4" /> },
    { id: 'citizen-portal', labelEn: 'Citizen Portal', labelHi: 'नागरिक पोर्टल', icon: <User className="w-4 h-4" /> },
    { id: 'audit-log', labelEn: 'Audit Log', labelHi: 'ऑडिट लॉग', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <header id="gov-main-header" className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Upper Tier: Logo + Search + Account */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & National Emblem */}
          <div className="flex items-center gap-3 shrink-0">
            {/* National Emblem SVG */}
            <div className="w-9 h-11 flex flex-col items-center justify-center p-0.5 bg-amber-50/70 border border-amber-200/80 rounded" title="National Emblem of India">
              <svg viewBox="0 0 100 120" className="w-full h-full fill-amber-900 stroke-amber-900" xmlns="http://www.w3.org/2000/svg">
                {/* 4-Lion Ashoka Capital silhouette representation */}
                <circle cx="50" cy="30" r="14" fill="#92400e" />
                <path d="M 32 30 Q 30 15, 42 12 Q 50 16, 58 12 Q 70 15, 68 30 Z" fill="#b45309" />
                <path d="M 28 35 Q 20 40, 24 55 Q 35 60, 42 50 Z" fill="#92400e" />
                <path d="M 72 35 Q 80 40, 76 55 Q 65 60, 58 50 Z" fill="#92400e" />
                <rect x="30" y="58" width="40" height="12" rx="2" fill="#78350f" />
                {/* Ashoka Wheel base */}
                <circle cx="50" cy="78" r="8" fill="none" stroke="#000080" strokeWidth="2.5" />
                <path d="M 50 70 L 50 86 M 42 78 L 58 78 M 44 72 L 56 84 M 44 84 L 56 72" stroke="#000080" strokeWidth="1.5" />
                <rect x="22" y="90" width="56" height="6" rx="1" fill="#78350f" />
                <text x="50" y="108" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#78350f" fontFamily="serif">सत्यमेव जयते</text>
              </svg>
            </div>

            {/* Wordmark */}
            <button
              onClick={() => onSelectTab('dashboard')}
              className="text-left flex flex-col focus:outline-hidden group"
            >
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-amber-700 transition-colors">
                  BHUMI<span className="text-amber-600">-TWIN</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  {language === 'hi' ? 'भूमि-ट्विन' : 'v2.4 SIH'}
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 tracking-tight line-clamp-1">
                {language === 'hi'
                  ? 'ग्रामीण विकास मंत्रालय • राष्ट्रीय भूमि अधिग्रहण डिजिटल ट्विन'
                  : 'Ministry of Rural Development • Decision-Intelligence Digital Twin'}
              </p>
            </button>
          </div>

          {/* Center: Global Search Bar (MyGov Style) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-xl mx-4 border border-slate-300 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 shadow-2xs"
          >
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'पार्सल आईडी (जैसे P-204), गांव, खसरा या खतौनी संख्या खोजें...'
                  : 'Search Parcel ID (e.g. P-204), Village, Survey No., Case ID...'
              }
              className="w-full px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
            />
            
            <div className="h-6 w-px bg-slate-200"></div>

            <select
              id="global-search-category"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              aria-label="Search category"
              className="bg-slate-50 text-slate-600 text-xs px-2.5 py-1.5 border-none focus:outline-hidden cursor-pointer"
            >
              <option>All Categories</option>
              <option>Parcels</option>
              <option>Beneficiaries</option>
              <option>Disputes</option>
            </select>

            <button
              id="global-search-submit-btn"
              type="submit"
              className="bg-[#EA580C] hover:bg-[#D97706] text-white px-4 py-2 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'खोजें' : 'Search'}</span>
            </button>
          </form>

          {/* Right: Current Active User Role & Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              id="user-profile-header-btn"
              onClick={onOpenLogin}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
              title="Click to switch role or view credentials"
            >
              <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentRole === 'admin' ? 'AD' : currentRole === 'officer' ? 'OF' : 'CZ'}
              </div>
              <div className="hidden lg:block leading-tight text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <span>
                    {currentRole === 'admin'
                      ? 'District Collectorate'
                      : currentRole === 'officer'
                      ? 'Revenue Officer'
                      : 'Kisan Beneficiary'}
                  </span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">
                  {currentRole} Session
                </div>
              </div>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-nav-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Lower Tier: Navigation Tabs (for Admin/Officer), or simplified citizen indicator */}
      {currentRole !== 'citizen' ? (
        <nav className="border-t border-slate-100 bg-slate-50/80 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  {item.icon}
                  <span>{language === 'hi' ? item.labelHi : item.labelEn}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                        active ? 'bg-amber-800 text-amber-100' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      ) : (
        /* Citizen-specific simplified navigation strip */
        <nav className="border-t border-slate-100 bg-emerald-50/70 px-4 sm:px-6 lg:px-8 py-1.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-emerald-950 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>
                {language === 'hi'
                  ? 'नागरिक सेवा केंद्र: भूमि अधिग्रहण स्थिति एवं मुआवजा ट्रैकर'
                  : 'Citizen Services: Land Acquisition Status & Compensation Tracker'}
              </span>
            </div>
            <div className="text-[11px] text-emerald-700">
              {language === 'hi' ? 'हेल्पलाइन: 1800-180-1551 (टोल फ्री)' : 'Toll-Free Helpline: 1800-180-1551'}
            </div>
          </div>
        </nav>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-2">
          <form onSubmit={handleSearchSubmit} className="flex mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search parcel ID or village..."
              className="w-full text-xs p-2 border border-slate-300 rounded-l-md"
            />
            <button type="submit" className="bg-amber-600 text-white px-3 py-2 text-xs rounded-r-md">
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2 rounded text-xs font-medium text-left ${
                  currentTab === item.id ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {item.icon}
                <span>{item.labelEn}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
