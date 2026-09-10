import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Home,
  Globe,
  MapPin,
  Compass,
  Bell
} from 'lucide-react';
import { UserRole } from '../../types';
import { ALL_PARCELS, CURRENT_PROJECT, NOTIFICATIONS_FEED } from '../../data/mockData';

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
  onToggleLanguage?: () => void;
  onSearch: (query: string, category?: string) => void;
  onOpenLogin: () => void;
  selectedParcelId?: string;
  sidebarExpanded?: boolean;
  onToggleSidebar?: () => void;
}

export const GovHeader: React.FC<GovHeaderProps> = ({
  currentTab,
  onSelectTab,
  currentRole,
  language,
  onToggleLanguage,
  onSearch,
  onOpenLogin,
  selectedParcelId,
  sidebarExpanded,
  onToggleSidebar,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<
    'all' | 'project' | 'parcel' | 'survey' | 'district' | 'village' | 'landmark'
  >('all');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(4);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSearchExpanded) {
      searchInputRef.current?.focus();
    }
  }, [isSearchExpanded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        !searchQuery.trim()
      ) {
        setIsSearchExpanded(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchExpanded, searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchExpanded((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim(), searchCategory);
    }
  };

  const getPlaceholderText = () => {
    if (language === 'hi') {
      switch (searchCategory) {
        case 'project':
          return 'परियोजना आईडी खोजें (उदा. PROJ-MRD-2026-09)...';
        case 'parcel':
          return 'पार्सल आईडी खोजें (उदा. P-204, P-042)...';
        case 'survey':
          return 'खसरा / सर्वे संख्या खोजें (उदा. 412/3B)...';
        case 'district':
          return 'जिला खोजें (उदा. Varanasi)...';
        case 'village':
          return 'गांव खोजें (उदा. Rampur, Shivpur)...';
        case 'landmark':
          return 'लैंडमार्क खोजें (उदा. Babatpur Airport, Harahua Flyover)...';
        default:
          return 'प्रोजेक्ट, पार्सल, खसरा, जिला, गांव या लैंडमार्क खोजें...';
      }
    }
    switch (searchCategory) {
      case 'project':
        return 'Search Project ID (e.g. PROJ-MRD-2026-09, NH-31)...';
      case 'parcel':
        return 'Search Parcel ID (e.g. P-204, P-042, P-089)...';
      case 'survey':
        return 'Search Survey No. (e.g. 412/3B, 88/4)...';
      case 'district':
        return 'Search District (e.g. Varanasi)...';
      case 'village':
        return 'Search Village (e.g. Rampur, Shivpur, Babatpur)...';
      case 'landmark':
        return 'Search Landmark (e.g. Babatpur Airport, Harahua Flyover)...';
      default:
        return 'Search Project ID, Parcel, Survey No., District, Village, Landmark...';
    }
  };

  interface SearchSuggestion {
    category: string;
    badge: string;
    title: string;
    subtitle: string;
    value: string;
    icon: 'project' | 'parcel' | 'survey' | 'village' | 'district' | 'landmark';
  }

  const matchingSuggestions: SearchSuggestion[] = useMemo(() => {
    const q = searchQuery.trim().toUpperCase();
    if (!q) return [];
    const results: SearchSuggestion[] = [];

    // Check Project ID
    if (searchCategory === 'all' || searchCategory === 'project') {
      if (
        CURRENT_PROJECT.id.toUpperCase().includes(q) ||
        CURRENT_PROJECT.code.toUpperCase().includes(q) ||
        CURRENT_PROJECT.name.toUpperCase().includes(q)
      ) {
        results.push({
          category: 'project',
          badge: 'Project ID',
          title: `${CURRENT_PROJECT.id} • ${CURRENT_PROJECT.code}`,
          subtitle: CURRENT_PROJECT.name,
          value: CURRENT_PROJECT.id,
          icon: 'project',
        });
      }
    }

    // Check Parcels, Surveys, Villages, Districts, Landmarks
    const seenVillages = new Set<string>();
    const seenLandmarks = new Set<string>();

    for (const p of ALL_PARCELS) {
      if (results.length >= 8) break;

      // Parcel ID match
      if (
        (searchCategory === 'all' || searchCategory === 'parcel') &&
        (p.id.toUpperCase().includes(q) || p.ulpin.toUpperCase().includes(q))
      ) {
        results.push({
          category: 'parcel',
          badge: 'Parcel ID',
          title: `${p.id} (Survey ${p.surveyNumber})`,
          subtitle: `${p.village}, ${p.district} • ${p.areaHectares} Ha`,
          value: p.id,
          icon: 'parcel',
        });
        continue;
      }

      // Survey No match
      if (
        (searchCategory === 'all' || searchCategory === 'survey') &&
        p.surveyNumber.toUpperCase().includes(q)
      ) {
        results.push({
          category: 'survey',
          badge: 'Survey No.',
          title: `Survey No. ${p.surveyNumber}`,
          subtitle: `Parcel ${p.id} in ${p.village}, ${p.district}`,
          value: p.surveyNumber,
          icon: 'survey',
        });
        continue;
      }

      // Village match
      if (
        (searchCategory === 'all' || searchCategory === 'village') &&
        p.village.toUpperCase().includes(q) &&
        !seenVillages.has(p.village)
      ) {
        seenVillages.add(p.village);
        results.push({
          category: 'village',
          badge: 'Village',
          title: `Village ${p.village}`,
          subtitle: `${p.district} District • Block ${p.block}`,
          value: p.village,
          icon: 'village',
        });
        continue;
      }

      // Landmark match
      if (
        (searchCategory === 'all' || searchCategory === 'landmark') &&
        p.nearestLandmark &&
        p.nearestLandmark.toUpperCase().includes(q) &&
        !seenLandmarks.has(p.nearestLandmark)
      ) {
        seenLandmarks.add(p.nearestLandmark);
        results.push({
          category: 'landmark',
          badge: 'Landmark',
          title: p.nearestLandmark,
          subtitle: `Near Parcel ${p.id} (${p.village}, ${p.district})`,
          value: p.nearestLandmark,
          icon: 'landmark',
        });
        continue;
      }
    }

    return results;
  }, [searchQuery, searchCategory]);

  const navItems: { id: NavTab; labelEn: string; labelHi: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', labelEn: 'Dashboard', labelHi: 'डैशबोर्ड', icon: <Home className="w-4 h-4" /> },
    { id: 'gis-map', labelEn: 'GIS Map', labelHi: 'जीआईएस मानचित्र', icon: <Layers className="w-4 h-4" /> },
    { id: 'digital-twin', labelEn: 'Digital Twin', labelHi: 'डिजिटल ट्विन', icon: <Activity className="w-4 h-4" />, badge: selectedParcelId ? selectedParcelId : undefined },
    { id: 'simulator', labelEn: 'What-If Simulator', labelHi: 'सिमुलेटर', icon: <GitCompare className="w-4 h-4" /> },
    { id: 'satellite', labelEn: 'Satellite Alerts', labelHi: 'उपग्रह अलर्ट', icon: <Satellite className="w-4 h-4" /> },
    { id: 'verification', labelEn: 'Field Verification', labelHi: 'क्षेत्र सत्यापन', icon: <ClipboardCheck className="w-4 h-4" /> },
    { id: 'citizen-portal', labelEn: 'Citizen Portal', labelHi: 'नागरिक पोर्टल', icon: <User className="w-4 h-4" /> },
    { id: 'audit-log', labelEn: 'Audit Log', labelHi: 'ऑडिट लॉग', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <header id="gov-main-header" className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Tricolor Top Accent Line */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-[#FFFFFF] border-y border-slate-200"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      {/* Main Single Tier Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: 3-Dashes Sidebar Toggle + Logo & National Emblem */}
          <div className="flex items-center gap-2.5 shrink-0">
            {onToggleSidebar && (
              <button
                id="header-sidebar-toggle-btn"
                onClick={onToggleSidebar}
                className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 transition-all cursor-pointer focus:outline-hidden flex flex-col justify-center items-center gap-1 w-9 h-9 group shadow-2xs"
                title={
                  sidebarExpanded
                    ? (language === 'hi' ? 'साइडबार समेटें (3 डैश)' : 'Collapse sidebar (3 dashes)')
                    : (language === 'hi' ? 'साइडबार फैलाएं (3 डैश)' : 'Expand sidebar (3 dashes)')
                }
                aria-label="Toggle Sidebar"
              >
                {/* 3 dashes styled in the colors of the Indian flag */}
                <span className="w-5 h-0.5 rounded-full bg-[#FF9933] transition-all group-hover:scale-x-110"></span>
                <span className="w-5 h-0.5 rounded-full bg-[#000080] transition-all group-hover:scale-x-110"></span>
                <span className="w-5 h-0.5 rounded-full bg-[#138808] transition-all group-hover:scale-x-110"></span>
              </button>
            )}

            {/* National Emblem SVG */}
            <div className="w-8 h-10 flex flex-col items-center justify-center p-0.5 bg-amber-50/70 border border-amber-200/80 rounded" title="National Emblem of India">
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

            {/* Wordmark and Single Government Subtitle below */}
            <button
              onClick={() => onSelectTab('dashboard')}
              className="text-left flex flex-col focus:outline-hidden group"
            >
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-amber-700 transition-colors">
                  BHUMI<span className="text-amber-600">-TWIN</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  1.0.0 SIH
                </span>
              </div>
              <p className="text-[10.5px] font-medium text-slate-600 tracking-tight">
                {language === 'hi'
                  ? 'भारत सरकार • ग्रामीण विकास मंत्रालय'
                  : 'Government of India • Ministry of Rural Development'}
              </p>
            </button>
          </div>

          {/* Right: Expandable Search, Language, Compressed Profile Icon */}
          <div className="flex items-center gap-2">
            {/* Expandable Multi-Criteria Search */}
            <div ref={searchContainerRef} className="relative flex items-center">
              {isSearchExpanded ? (
                <div className="relative">
                  <form
                    onSubmit={handleSearchSubmit}
                    className="flex items-center w-72 sm:w-[420px] md:w-[520px] border border-amber-500 rounded-lg overflow-hidden bg-white shadow-lg transition-all duration-200"
                  >
                    {/* Category Criteria Selector */}
                    <select
                      id="search-category-select"
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value as any)}
                      aria-label="Search filter criteria"
                      className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold px-2 py-1.5 border-r border-slate-200 focus:outline-hidden cursor-pointer shrink-0"
                    >
                      <option value="all">{language === 'hi' ? 'सभी प्रकार' : 'All Criteria'}</option>
                      <option value="project">{language === 'hi' ? 'परियोजना आईडी' : 'Project ID'}</option>
                      <option value="parcel">{language === 'hi' ? 'पार्सल आईडी' : 'Parcel ID'}</option>
                      <option value="survey">{language === 'hi' ? 'खसरा / सर्वे' : 'Survey No.'}</option>
                      <option value="district">{language === 'hi' ? 'जिला' : 'District'}</option>
                      <option value="village">{language === 'hi' ? 'गांव' : 'Village'}</option>
                      <option value="landmark">{language === 'hi' ? 'लैंडमार्क' : 'Landmark'}</option>
                    </select>

                    {/* Text Input */}
                    <div className="flex-1 flex items-center px-2 min-w-0">
                      <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1.5" />
                      <input
                        ref={searchInputRef}
                        id="global-search-input"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            setIsSearchExpanded(false);
                          }
                        }}
                        placeholder={getPlaceholderText()}
                        className="w-full py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      id="global-search-submit-btn"
                      type="submit"
                      className="bg-[#EA580C] hover:bg-[#D97706] text-white px-3 py-1.5 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                    >
                      <span>{language === 'hi' ? 'खोजें' : 'Search'}</span>
                    </button>

                    {/* Close Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchExpanded(false);
                        setSearchQuery('');
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                      title="Close search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </form>

                  {/* Instant Autocomplete Suggestions Dropdown */}
                  {searchQuery.trim().length > 0 && matchingSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <span>Matching Results ({matchingSuggestions.length})</span>
                        <span className="text-[9px] font-normal text-slate-500">Click to select</span>
                      </div>
                      {matchingSuggestions.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            onSearch(item.value, item.category);
                            setSearchQuery(item.value);
                            setIsSearchExpanded(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-amber-50/70 border-b border-slate-100 last:border-0 flex items-center justify-between gap-2 group transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="p-1 rounded bg-slate-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-800 shrink-0">
                              {item.icon === 'landmark' ? (
                                <MapPin className="w-3 h-3" />
                              ) : item.icon === 'village' ? (
                                <Home className="w-3 h-3" />
                              ) : item.icon === 'project' ? (
                                <Compass className="w-3 h-3" />
                              ) : (
                                <FileText className="w-3 h-3" />
                              )}
                            </span>
                            <div className="truncate">
                              <div className="text-xs font-semibold text-slate-800 group-hover:text-amber-700 truncate">
                                {item.title}
                              </div>
                              <div className="text-[10px] text-slate-500 truncate">
                                {item.subtitle}
                              </div>
                            </div>
                          </div>
                          <span className="shrink-0 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                            {item.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  id="expand-search-btn"
                  onClick={() => setIsSearchExpanded(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-700 hover:text-slate-900 transition-colors text-xs font-medium cursor-pointer shadow-2xs"
                  title="Quick Search (Ctrl+K / ⌘K)"
                >
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-500">
                    {language === 'hi' ? 'खोजें...' : 'Search...'}
                  </span>
                  <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-200/60 rounded border border-slate-300/60">
                    ⌘K
                  </kbd>
                </button>
              )}
            </div>

            {/* Notifications Popover Trigger & Drawer */}
            <div ref={notificationsRef} className="relative">
              <button
                id="nav-notifications-btn"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`relative p-2 rounded-lg border transition-colors cursor-pointer ${
                  notificationsOpen
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                }`}
                title={language === 'hi' ? `सूचनाएं (${unreadCount} नई)` : `Notifications (${unreadCount} New)`}
                aria-label="Notifications"
              >
                <Bell className="w-3.5 h-3.5 text-slate-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center shadow-xs border border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Drawer */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  {/* Header */}
                  <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">
                        {language === 'hi' ? 'सूचनाएं एवं अलर्ट' : 'Notifications & Alerts'}
                      </span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                          {unreadCount} {language === 'hi' ? 'नई' : 'New'}
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => setUnreadCount(0)}
                        className="text-[11px] font-medium text-slate-500 hover:text-amber-700 transition-colors cursor-pointer"
                      >
                        {language === 'hi' ? 'सभी पढ़ा हुआ चिन्हित करें' : 'Mark all read'}
                      </button>
                    )}
                  </div>

                  {/* Notifications List */}
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {NOTIFICATIONS_FEED.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 hover:bg-slate-50/80 transition-colors flex gap-2.5 items-start text-left"
                      >
                        <div
                          className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                            item.severity === 'high'
                              ? 'bg-rose-500'
                              : item.severity === 'medium'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="font-semibold text-xs text-slate-800 truncate">
                              {item.title}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {item.timestamp}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                          <div className="mt-1.5 flex items-center gap-2">
                            <button
                              onClick={() => {
                                setNotificationsOpen(false);
                                if (item.type === 'satellite') {
                                  onSelectTab('satellite');
                                } else if (item.parcelId) {
                                  onSelectTab('digital-twin');
                                } else {
                                  onSelectTab('dashboard');
                                }
                              }}
                              className="text-[10px] font-bold text-amber-700 hover:text-amber-800 underline underline-offset-2 cursor-pointer"
                            >
                              {item.actionLabel || (language === 'hi' ? 'विवरण देखें' : 'Inspect Alert')} →
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        setNotificationsOpen(false);
                        onSelectTab('audit-log');
                      }}
                      className="text-xs font-semibold text-slate-600 hover:text-amber-700 transition-colors cursor-pointer"
                    >
                      {language === 'hi' ? 'सभी सिस्टम ऑडिट लॉग देखें →' : 'View Full System Audit Log →'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Language Toggle */}
            {onToggleLanguage && (
              <button
                id="lang-toggle-btn"
                onClick={onToggleLanguage}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium cursor-pointer transition-colors"
                title="Switch Language / भाषा बदलें"
              >
                <Globe className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="hidden sm:inline-flex items-center text-[11px]">
                  <span className={language === 'en' ? 'font-bold text-amber-800' : 'text-slate-500 hover:text-slate-700'}>
                    English (EN)
                  </span>
                  <span className="text-slate-300 mx-1.5 font-light">/</span>
                  <span className={language === 'hi' ? 'font-bold text-amber-800' : 'text-slate-500 hover:text-slate-700'}>
                    हिन्दी (HI)
                  </span>
                </span>
              </button>
            )}

            {/* Compressed Profile Button (just the icon) */}
            <button
              id="user-profile-header-btn"
              onClick={onOpenLogin}
              className="relative p-0.5 rounded-full hover:ring-2 hover:ring-amber-500/50 transition-all cursor-pointer focus:outline-hidden"
              title={`Active Session: ${
                currentRole === 'admin'
                  ? 'District Collectorate (Admin)'
                  : currentRole === 'officer'
                  ? 'Revenue Officer'
                  : 'Kisan Beneficiary'
              } • Click to switch`}
            >
              <div className="w-8 h-8 rounded-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center font-bold text-xs shadow-xs transition-colors">
                {currentRole === 'admin' ? 'AD' : currentRole === 'officer' ? 'OF' : 'CZ'}
              </div>
              <span
                className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"
                title="Active Session"
              />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-nav-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>



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
