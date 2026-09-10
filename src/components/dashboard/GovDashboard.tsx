import React, { useState, useMemo } from 'react';
import {
  Layers,
  Users,
  AlertTriangle,
  IndianRupee,
  Home,
  Scale,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Eye,
  GitCompare,
  Satellite,
  Activity,
  FileCheck,
  AlertCircle,
  Building,
  Filter,
  RefreshCw,
  TrendingUp,
  FileText,
  Calendar,
  CheckCircle,
  BarChart2,
  ArrowUpDown,
  MapPin,
  Compass
} from 'lucide-react';
import { NavTab } from '../layout/GovHeader';
import { useLanguage } from '../../context/LanguageContext';

interface GovDashboardProps {
  onNavigateTab: (tab: NavTab) => void;
  onSelectParcel: (parcelId: string) => void;
}

interface StateData {
  state: string;
  stateHi: string;
  code: string;
  projects: number;
  landProposedHa: number;
  landAcquiredHa: number;
  acquisitionPercent: number;
  affectedFamilies: number;
  compensationPaidCr: number;
  rrPercent: number;
  atRisk: number;
  status: 'On Track' | 'Attention' | 'Critical';
}

export const GovDashboard: React.FC<GovDashboardProps> = ({ onNavigateTab, onSelectParcel }) => {
  const { t, language } = useLanguage();

  // Global Filter States
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedProjectType, setSelectedProjectType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('30d');

  // State Table Sorting
  const [sortField, setSortField] = useState<keyof StateData>('projects');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // National-level Key Metrics
  const nationalKpis = {
    activeProjects: 128,
    landProposedHa: 24860,
    landAcquiredHa: 16420,
    acquisitionPercent: 66.1,
    affectedFamilies: 28450,
    compensationAssessedCr: 8420,
    compensationDisbursedCr: 6180,
    compensationPercent: 73.4,
    possessionCompletedHa: 11240,
    possessionPercent: 45.2,
    pendingRrFamilies: 4280,
  };

  // Project Status Distribution
  const projectStatusDistribution = [
    { label: 'On Track', labelHi: 'समय पर', count: 72, percent: 56.3, color: 'bg-emerald-500', textColor: 'text-emerald-700', badgeBg: 'bg-emerald-50 border-emerald-200' },
    { label: 'At Risk', labelHi: 'जोखिम में', count: 38, percent: 29.7, color: 'bg-amber-500', textColor: 'text-amber-700', badgeBg: 'bg-amber-50 border-amber-200' },
    { label: 'Delayed', labelHi: 'विलंबित', count: 18, percent: 14.0, color: 'bg-rose-500', textColor: 'text-rose-700', badgeBg: 'bg-rose-50 border-rose-200' },
  ];

  // Key Delay Bottlenecks (Scrollable panel)
  const nationalBottlenecks = [
    { id: 1, cause: 'Compensation Processing & PFMS Escrow', causeHi: 'मुआवजा संवितरण एवं पीएफएमएस एस्क्रो', affectedProjects: 42, percent: 32.8, severity: 'critical' },
    { id: 2, cause: 'Legal Disputes & Court Stay Writs', causeHi: 'कानूनी विवाद एवं अदालती स्थगन याचिकाएं', affectedProjects: 28, percent: 21.9, severity: 'critical' },
    { id: 3, cause: 'R&R Housing Layout Sanction Overdue', causeHi: 'पुनर्वास आवास लेआउट स्वीकृति में विलंब', affectedProjects: 22, percent: 17.2, severity: 'high' },
    { id: 4, cause: 'Land / Ownership Title Verification', causeHi: 'भूमि / स्वामित्व विभाजन सत्यापन', affectedProjects: 19, percent: 14.8, severity: 'medium' },
    { id: 5, cause: 'Field & Satellite Anomaly Verification', causeHi: 'धरातल एवं उपग्रह विसंगति सत्यापन', affectedProjects: 17, borderProjects: 13.3, severity: 'medium' },
    { id: 6, cause: 'Forest Stage-I & Environmental NOCs', causeHi: 'वन मंजूरी एवं पर्यावरण अनापत्ति प्रमाण पत्र', affectedProjects: 14, percent: 10.9, severity: 'medium' },
    { id: 7, cause: 'Wayside Utility Shifting Approvals', causeHi: 'उपयोगिता पाइपलाइन एवं विद्युत शिफ्टिंग', affectedProjects: 11, percent: 8.6, severity: 'low' },
  ];

  // State-wise Acquisition Data (Compact Scrollable Table)
  const stateDataList: StateData[] = [
    { state: 'Uttar Pradesh', stateHi: 'उत्तर प्रदेश', code: 'UP', projects: 24, landProposedHa: 4820, landAcquiredHa: 3210, acquisitionPercent: 67, affectedFamilies: 5420, compensationPaidCr: 1240, rrPercent: 72, atRisk: 6, status: 'Attention' },
    { state: 'Maharashtra', stateHi: 'महाराष्ट्र', code: 'MH', projects: 18, landProposedHa: 3940, landAcquiredHa: 2890, acquisitionPercent: 73, affectedFamilies: 4110, compensationPaidCr: 1120, rrPercent: 81, atRisk: 4, status: 'On Track' },
    { state: 'Gujarat', stateHi: 'गुजरात', code: 'GJ', projects: 16, landProposedHa: 3180, landAcquiredHa: 2450, acquisitionPercent: 77, affectedFamilies: 3240, compensationPaidCr: 960, rrPercent: 84, atRisk: 2, status: 'On Track' },
    { state: 'Madhya Pradesh', stateHi: 'मध्य प्रदेश', code: 'MP', projects: 15, landProposedHa: 3420, landAcquiredHa: 2050, acquisitionPercent: 60, affectedFamilies: 3680, compensationPaidCr: 780, rrPercent: 64, atRisk: 5, status: 'Attention' },
    { state: 'Tamil Nadu', stateHi: 'तमिलनाडु', code: 'TN', projects: 14, landProposedHa: 2640, landAcquiredHa: 1980, acquisitionPercent: 75, affectedFamilies: 2950, compensationPaidCr: 740, rrPercent: 79, atRisk: 3, status: 'On Track' },
    { state: 'Bihar', stateHi: 'बिहार', code: 'BR', projects: 13, landProposedHa: 2860, landAcquiredHa: 1480, acquisitionPercent: 52, affectedFamilies: 4280, compensationPaidCr: 590, rrPercent: 48, atRisk: 7, status: 'Critical' },
    { state: 'Rajasthan', stateHi: 'राजस्थान', code: 'RJ', projects: 12, landProposedHa: 2420, landAcquiredHa: 1510, acquisitionPercent: 62, affectedFamilies: 2610, compensationPaidCr: 460, rrPercent: 61, atRisk: 4, status: 'Attention' },
    { state: 'Karnataka', stateHi: 'कर्नाटक', code: 'KA', projects: 16, landProposedHa: 1580, landAcquiredHa: 850, acquisitionPercent: 54, affectedFamilies: 2160, compensationPaidCr: 290, rrPercent: 59, atRisk: 7, status: 'Attention' },
  ];

  // Sorted States
  const sortedStates = useMemo(() => {
    return [...stateDataList].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [sortField, sortOrder]);

  const handleSort = (field: keyof StateData) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Section 6: Nationwide Action Items (Compact scrollable list)
  const nationalActionItems = [
    {
      id: 'ACT-01',
      severity: 'critical' as const,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      title: '18 projects have crossed expected acquisition timelines',
      titleHi: '18 परियोजनाएं लक्षित भूमि अधिग्रहण समयसीमा पार कर चुकी हैं',
      detail: 'Critical path slippage >90 days across Uttar Pradesh, Bihar, Maharashtra, and Madhya Pradesh.',
      detailHi: 'उत्तर प्रदेश, बिहार, महाराष्ट्र एवं मध्य प्रदेश में 90 दिनों से अधिक का विलंब।',
      metric: '18 Projects',
      actionText: 'Review Projects',
      actionTextHi: 'समीक्षा करें',
      onClick: () => onNavigateTab('simulator'),
    },
    {
      id: 'ACT-02',
      severity: 'critical' as const,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      title: '₹2,240 Cr compensation remains pending disbursement',
      titleHi: '₹2,240 करोड़ का मुआवजा संवितरण लंबित है',
      detail: 'PFMS batch reconciliations and court escrow approvals pending across 54 revenue blocks.',
      detailHi: '54 राजस्व ब्लॉकों में पीएफएमएस बैच मिलान एवं अदालती एस्क्रो स्वीकृतियां लंबित।',
      metric: '₹2,240 Cr Pending',
      actionText: 'Review Disbursals',
      actionTextHi: 'समीक्षा करें',
      onClick: () => {
        onSelectParcel('P-204');
        onNavigateTab('digital-twin');
      },
    },
    {
      id: 'ACT-03',
      severity: 'high' as const,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      title: '426 parcels have unresolved ownership and title disputes',
      titleHi: '426 भू-पार्सलों पर अनसुलझे स्वामित्व एवं विभाजन विवाद हैं',
      detail: 'Coparcener partition suits and succession certificate disputes pending before District Civil Judges.',
      detailHi: 'जिला सिविल न्यायालयों के समक्ष सह-स्वामित्व विभाजन एवं उत्तराधिकार विवाद लंबित।',
      metric: '426 Parcels',
      actionText: 'Review Parcels',
      actionTextHi: 'समीक्षा करें',
      onClick: () => {
        onSelectParcel('P-204');
        onNavigateTab('digital-twin');
      },
    },
    {
      id: 'ACT-04',
      severity: 'high' as const,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      title: '4,280 families have pending R&R rehabilitation actions',
      titleHi: '4,280 परिवारों के पुनर्वास एवं व्यवस्थापन कार्य लंबित हैं',
      detail: 'Resettlement cluster layout approvals and alternative housing plot sanctions overdue by >45 days.',
      detailHi: 'पुनर्वास क्लस्टर लेआउट अनुमोदन एवं वैकल्पिक आवास आवंटन 45 दिनों से अधिक विलंबित।',
      metric: '4,280 Families',
      actionText: 'Review R&R',
      actionTextHi: 'समीक्षा करें',
      onClick: () => {
        onSelectParcel('P-077');
        onNavigateTab('digital-twin');
      },
    },
    {
      id: 'ACT-05',
      severity: 'medium' as const,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      title: '312 parcels require on-ground field verification',
      titleHi: '312 भू-पार्सलों पर धरातलीय सत्यापन अपेक्षित है',
      detail: 'Automated satellite pass flagged fresh physical earth excavations and unapproved boundary masonry.',
      detailHi: 'स्वचालित उपग्रह पारगमन द्वारा नए भू-उत्खनन एवं अनधिकृत सीमा निर्माण चिन्हित।',
      metric: '312 Parcels',
      actionText: 'Review Verifications',
      actionTextHi: 'समीक्षा करें',
      onClick: () => onNavigateTab('satellite'),
    },
  ];

  // Section 7: National AI Insights
  const nationalAiInsights = [
    {
      id: 'AI-01',
      title: 'High Delay Probability Forecast',
      titleHi: 'उच्च विलंब संभावना पूर्वानुमान',
      text: '18 projects have a high probability (>82%) of milestone delay within the next 3 months, primarily triggered by unresolved co-tenancy partition suits and delayed forest Stage-I clearances.',
      textHi: '18 परियोजनाओं में आगामी 3 महीनों के भीतर मील का पत्थर विलंबित होने की उच्च संभावना (>82%) है, जिसका मुख्य कारण सह-स्वामित्व विभाजन वाद एवं लंबित वन स्वीकृतियां हैं।',
      tag: 'Critical Path Warning',
    },
    {
      id: 'AI-02',
      title: 'Primary Operational Bottleneck',
      titleHi: 'प्रमुख परिचालन गतिरोध',
      text: 'Compensation processing is currently the largest acquisition bottleneck, contributing to 46% of total timeline slippage across active infrastructure corridors nationwide.',
      textHi: 'मुआवजा संवितरण वर्तमान में सबसे बड़ा अधिग्रहण गतिरोध है, जो देश भर में सक्रिय अवसंरचना कॉरिडोर में कुल 46% समयसीमा विलंब के लिए उत्तरदायी है।',
      tag: 'Operational Drag',
    },
    {
      id: 'AI-03',
      title: 'Legal Risk Exposure Cluster',
      titleHi: 'कानूनी जोखिम समूह',
      text: '42 projects show elevated legal-risk indicators concentrated in peri-urban linear bypass alignments where circle rates diverge significantly from prevailing commercial market value.',
      textHi: '42 परियोजनाओं में उच्च कानूनी-जोखिम संकेतक दिखाई दे रहे हैं, विशेषकर पेरी-अर्बन बाईपास संरेखण में जहां सर्किल दरें प्रचलित बाजार दरों से भिन्न हैं।',
      tag: 'Litigation Radar',
    },
  ];

  // Section 8: Recent System Activity Feed
  const recentActivities = [
    {
      id: 'ACT-LOG-01',
      time: '10:42 AM',
      title: 'Land acquisition proposal submitted (NH-48 Western Expressway Ext., Gujarat)',
      titleHi: 'भूमि अधिग्रहण प्रस्ताव प्रस्तुत (एनएच-48 वेस्टर्न एक्सप्रेसवे एक्सटेंशन, गुजरात)',
      department: 'NHAI Regional Office, Gandhinagar',
    },
    {
      id: 'ACT-LOG-02',
      time: '10:31 AM',
      title: 'Compensation batch approved (₹18.4 Cr PFMS direct bank transfer, Maharashtra)',
      titleHi: 'मुआवजा बैच स्वीकृत (₹18.4 करोड़ पीएफएमएस प्रत्यक्ष बैंक अंतरण, महाराष्ट्र)',
      department: 'Competent Authority (CALA), Pune',
    },
    {
      id: 'ACT-LOG-03',
      time: '10:18 AM',
      title: 'Field verification completed (RTK-DGPS boundary check, 14 parcels, Uttar Pradesh)',
      titleHi: 'क्षेत्र सत्यापन पूर्ण (आरटीके-डीजीपीएस सीमा सत्यापन, 14 पार्सल, उत्तर प्रदेश)',
      department: 'Revenue Inspectorate Desk, Varanasi',
    },
    {
      id: 'ACT-LOG-04',
      time: '09:56 AM',
      title: 'New legal case recorded (Writ Petition 1104/2026, High Court of Allahabad)',
      titleHi: 'नया कानूनी वाद दर्ज (याचिका 1104/2026, इलाहाबाद उच्च न्यायालय)',
      department: 'District Civil Litigation Cell, Prayagraj',
    },
    {
      id: 'ACT-LOG-05',
      time: '09:40 AM',
      title: 'R&R milestone updated (Phase 2 housing plots allotted, Sector 4 Babatpur)',
      titleHi: 'पुनर्वास मील का पत्थर अद्यतित (द्वितीय चरण आवासीय भूखंड आवंटित, सेक्टर 4 बाबतपुर)',
      department: 'R&R Commissionerate Office',
    },
    {
      id: 'ACT-LOG-06',
      time: '09:15 AM',
      title: 'Satellite ground anomaly flagged (Sentinel-2 earth excavation detected, Sector 8)',
      titleHi: 'उपग्रह विसंगति चिन्हित (सेंटिनल-2 द्वारा भूमि उत्खनन की पहचान, सेक्टर 8)',
      department: 'Automated Earth Observation Engine',
    },
  ];

  return (
    <div id="gov-dashboard-container" className="w-full max-w-(--breakpoint-2xl) mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-4">
      
      {/* =========================================================================
          TOP SECTION — NATIONAL OVERVIEW & GLOBAL FILTERS
          Compact, single-card layout. Zero single-project header.
         ========================================================================= */}
      <header className="bg-white rounded-lg border border-slate-200 px-4 py-3 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          
          {/* Title & Subtitle */}
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></span>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight uppercase">
                {t('National Land Acquisition Overview', 'राष्ट्रीय भूमि अधिग्रहण समग्र अवलोकन')}
              </h1>
            </div>
            <p className="text-[11.5px] text-slate-500 font-medium">
              {t(
                'Real-time monitoring across projects, states and districts',
                'परियोजनाओं, राज्यों एवं जिलों का वास्तविक समय में राष्ट्रीय प्रशासनिक अनुश्रवण'
              )}
            </p>
          </div>

          {/* Last Updated Timestamp */}
          <div className="flex items-center gap-2 shrink-0 text-xs text-slate-500 font-mono bg-slate-50 px-2.5 py-1 rounded border border-slate-200 self-start lg:self-auto">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{t('Last Updated: 10 Sep 2026, 01:40 PM', 'अंतिम अद्यतन: 10 सितंबर 2026, 01:40 अपराह्न')}</span>
          </div>

        </div>

        {/* Global Filter Bar */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-slate-600 font-semibold pr-1">
            <Filter className="w-3.5 h-3.5 text-orange-600" />
            <span>{t('Filters', 'फ़िल्टर')}:</span>
          </div>

          {/* State */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-2 py-1 rounded bg-white border border-slate-300 text-slate-800 font-medium focus:outline-hidden focus:ring-1 focus:ring-orange-500 cursor-pointer"
            aria-label="Filter by State"
          >
            <option value="all">{t('State: All States ', 'राज्य: सभी राज्य ')}</option>
            <option value="UP">Uttar Pradesh (24)</option>
            <option value="MH">Maharashtra (18)</option>
            <option value="GJ">Gujarat (16)</option>
            <option value="MP">Madhya Pradesh (15)</option>
            <option value="TN">Tamil Nadu (14)</option>
            <option value="BR">Bihar (13)</option>
            <option value="RJ">Rajasthan (12)</option>
            <option value="KA">Karnataka (16)</option>
          </select>

          {/* District */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-2 py-1 rounded bg-white border border-slate-300 text-slate-800 font-medium focus:outline-hidden focus:ring-1 focus:ring-orange-500 cursor-pointer"
            aria-label="Filter by District"
          >
            <option value="all">{t('District: All Districts', 'जिला: सभी जिले')}</option>
            <option value="varanasi">Varanasi</option>
            <option value="pune">Pune</option>
            <option value="ahmedabad">Ahmedabad</option>
            <option value="indore">Indore</option>
            <option value="patna">Patna</option>
          </select>

          {/* Project Type */}
          <select
            value={selectedProjectType}
            onChange={(e) => setSelectedProjectType(e.target.value)}
            className="px-2 py-1 rounded bg-white border border-slate-300 text-slate-800 font-medium focus:outline-hidden focus:ring-1 focus:ring-orange-500 cursor-pointer"
            aria-label="Filter by Project Type"
          >
            <option value="all">{t('Type: All Projects', 'प्रकार: सभी')}</option>
            <option value="highway">Highways & Expressways (74)</option>
            <option value="railway">Dedicated Freight & Railways (28)</option>
            <option value="industrial">Industrial Corridors (16)</option>
            <option value="ports">Ports & Multimodal Logistics (10)</option>
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2 py-1 rounded bg-white border border-slate-300 text-slate-800 font-medium focus:outline-hidden focus:ring-1 focus:ring-orange-500 cursor-pointer"
            aria-label="Filter by Status"
          >
            <option value="all">{t('Status: All Statuses', 'स्थिति: सभी स्थितियां')}</option>
            <option value="on-track">🟢 On Track (72)</option>
            <option value="at-risk">🟡 At Risk (38)</option>
            <option value="delayed">🔴 Delayed (18)</option>
          </select>

          {/* Timeframe */}
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-2 py-1 rounded bg-white border border-slate-300 text-slate-800 font-medium focus:outline-hidden focus:ring-1 focus:ring-orange-500 cursor-pointer"
            aria-label="Filter by Timeframe"
          >
            <option value="30d">{t('Last 30 Days', 'विगत 30 दिन')}</option>
            <option value="90d">{t('Last Quarter (90 Days)', 'विगत त्रैमास')}</option>
            <option value="1y">{t('FY 2026-27', 'वित्तीय वर्ष 2026-27')}</option>
          </select>
        </div>
      </header>

      {/* =========================================================================
          SECTION 1 — CORE NATIONAL KPIs
          8 Cards Arranged Across 2 Compact Rows (Desktop: 4x2)
         ========================================================================= */}
      <section aria-label="Core National KPIs">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-2.5">
          
          {/* 1. ACTIVE PROJECTS */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 truncate">
              {t('Active Projects', 'सक्रिय परियोजनाएं')}
            </span>
            <div className="mt-1">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {nationalKpis.activeProjects}
              </span>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">
                {t('28 States & UTs', '28 राज्यों में')}
              </p>
            </div>
          </div>

          {/* 2. LAND PROPOSED */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 truncate">
              {t('Land Proposed', 'प्रस्तावित भूमि')}
            </span>
            <div className="mt-1">
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {nationalKpis.landProposedHa.toLocaleString()} <span className="text-xs font-semibold text-slate-500">Ha</span>
              </div>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">
                {t('Notified RoW footprint', 'अधिसूचित संरेखण')}
              </p>
            </div>
          </div>

          {/* 3. LAND ACQUIRED */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 truncate">
                {t('Land Acquired', 'अधिग्रहीत')}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                {nationalKpis.acquisitionPercent}%
              </span>
            </div>
            <div className="mt-1">
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {nationalKpis.landAcquiredHa.toLocaleString()} <span className="text-xs font-semibold text-slate-500">Ha</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${nationalKpis.acquisitionPercent}%` }}></div>
              </div>
            </div>
          </div>

          {/* 4. AFFECTED FAMILIES */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 truncate">
              {t('Affected Families', 'प्रभावित परिवार')}
            </span>
            <div className="mt-1">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {nationalKpis.affectedFamilies.toLocaleString()}
              </span>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">
                {t('RFCTLARR SIA census', 'एसआईए गणना')}
              </p>
            </div>
          </div>

          {/* 5. COMPENSATION ASSESSED */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 truncate">
              {t('Comp. Assessed', 'आकलित मुआवजा')}
            </span>
            <div className="mt-1">
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                ₹{nationalKpis.compensationAssessedCr.toLocaleString()} <span className="text-xs font-semibold text-slate-500">Cr</span>
              </div>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">
                {t('Statutory awards', 'अधिनिर्णय राशि')}
              </p>
            </div>
          </div>

          {/* 6. COMPENSATION DISBURSED */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 truncate">
                {t('Comp. Disbursed', 'संवितरित')}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                {nationalKpis.compensationPercent}%
              </span>
            </div>
            <div className="mt-1">
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                ₹{nationalKpis.compensationDisbursedCr.toLocaleString()} <span className="text-xs font-semibold text-slate-500">Cr</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${nationalKpis.compensationPercent}%` }}></div>
              </div>
            </div>
          </div>

          {/* 7. POSSESSION COMPLETED */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 truncate">
                {t('Possession', 'कब्जा')}
              </span>
              <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1 py-0.2 rounded border border-slate-200">
                {nationalKpis.possessionPercent}%
              </span>
            </div>
            <div className="mt-1">
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {nationalKpis.possessionCompletedHa.toLocaleString()} <span className="text-xs font-semibold text-slate-500">Ha</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${nationalKpis.possessionPercent}%` }}></div>
              </div>
            </div>
          </div>

          {/* 8. PENDING R&R */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 truncate">
              {t('Pending R&R', 'लंबित पुनर्वास')}
            </span>
            <div className="mt-1">
              <div className="text-2xl font-extrabold text-amber-700 tracking-tight">
                {nationalKpis.pendingRrFamilies.toLocaleString()} <span className="text-xs font-semibold text-slate-500">Fam</span>
              </div>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">
                {t('Housing layout', 'आवास आवंटन')}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — ACQUISITION STATUS & KEY BOTTLENECKS
          Side-by-side with fixed-height internal scroll for bottlenecks
         ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        
        {/* Left (5 cols): Acquisition Status Distribution */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 p-3.5 shadow-2xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {t('Acquisition Status Distribution', 'भूमि अधिग्रहण स्थिति वर्गीकरण')}
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">128 {t('Projects', 'परियोजनाएं')}</span>
            </div>

            {/* Segmented Bar */}
            <div className="mt-3">
              <div className="w-full bg-slate-100 h-3 rounded overflow-hidden flex shadow-2xs">
                <div className="bg-emerald-500 h-full" style={{ width: '56.3%' }} title="On Track: 72 (56.3%)"></div>
                <div className="bg-amber-500 h-full" style={{ width: '29.7%' }} title="At Risk: 38 (29.7%)"></div>
                <div className="bg-rose-500 h-full" style={{ width: '14.0%' }} title="Delayed: 18 (14.0%)"></div>
              </div>
            </div>

            {/* Compact Distribution Rows */}
            <div className="mt-3 space-y-1.5">
              {projectStatusDistribution.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded border border-slate-100 bg-slate-50/70 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                    <span className="font-semibold text-slate-800">
                      {language === 'hi' ? item.labelHi : item.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="font-bold text-slate-900">{item.count}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10.5px] font-bold ${item.badgeBg} ${item.textColor}`}>
                      {item.percent}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>{t('National Adherence Rate:', 'राष्ट्रीय अनुपालन दर:')}</span>
            <strong className="text-slate-800">56.3% {t('On-Schedule', 'समय पर')}</strong>
          </div>
        </div>

        {/* Right (7 cols): Key Bottlenecks with Fixed Max Height & Internal Scroll */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 p-3.5 shadow-2xs flex flex-col justify-between space-y-2">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {t('Key Bottlenecks', 'प्रमुख प्रशासनिक गतिरोध')}
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {nationalBottlenecks.length} {t('Identified Causes', 'पहचाने गए कारक')}
            </span>
          </div>

          {/* Internal Scrollable Container (Shows 4-5 items naturally, scrolls smoothly) */}
          <div className="max-h-48 overflow-y-auto pr-1.5 space-y-2 divide-y divide-slate-100">
            {nationalBottlenecks.map((item) => (
              <div key={item.id} className="pt-1.5 first:pt-0 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800 truncate pr-2">
                    <span className="font-mono text-slate-400 font-bold mr-1.5">#{item.id}</span>
                    {language === 'hi' ? item.causeHi : item.cause}
                  </span>
                  <span className="font-mono font-bold text-slate-900 shrink-0">
                    {item.affectedProjects} {t('projects', 'परियोजनाएं')}
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.severity === 'critical'
                        ? 'bg-rose-500'
                        : item.severity === 'high'
                        ? 'bg-amber-500'
                        : 'bg-orange-400'
                    }`}
                    style={{ width: `${(item.affectedProjects / 45) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-1.5 border-t border-slate-100 text-[10px] text-slate-400 text-right">
            <span>{t('Scroll down to inspect additional bottlenecks ↓', 'अतिरिक्त गतिरोध देखने हेतु नीचे स्क्रॉल करें ↓')}</span>
          </div>

        </div>

      </section>

      {/* =========================================================================
          SECTION 3 — STATE-WISE ACQUISITION STATUS
          Compact Fixed-Height Table with Sticky Header & Sorting
         ========================================================================= */}
      <section className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        
        <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-orange-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {t('State-Wise Acquisition Status', 'राज्यवार भूमि अधिग्रहण स्थिति')}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="text-[11px] font-mono">{sortedStates.length} {t('States Active', 'सक्रिय राज्य')}</span>
          </div>
        </div>

        {/* Scrollable Table with Sticky Header */}
        <div className="max-h-56 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-100/95 backdrop-blur-xs text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 z-10">
              <tr>
                <th
                  onClick={() => handleSort('state')}
                  className="px-3 py-2 cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>{t('State', 'राज्य')}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('projects')}
                  className="px-3 py-2 text-right cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>{t('Projects', 'परियोजनाएं')}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-3 py-2 text-right">{t('Land Proposed', 'प्रस्तावित भूमि')}</th>
                <th className="px-3 py-2 text-right">{t('Land Acquired', 'अधिग्रहीत भूमि')}</th>
                <th
                  onClick={() => handleSort('acquisitionPercent')}
                  className="px-3 py-2 text-right cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>{t('Acquired %', 'अधिग्रहीत %')}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-3 py-2 text-right">{t('Affected Fam.', 'प्रभावित परिवार')}</th>
                <th
                  onClick={() => handleSort('compensationPaidCr')}
                  className="px-3 py-2 text-right cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>{t('Comp. Paid', 'मुआवजा')}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-3 py-2 text-right">{t('R&R %', 'पुनर्वास %')}</th>
                <th
                  onClick={() => handleSort('atRisk')}
                  className="px-3 py-2 text-right cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>{t('At Risk', 'जोखिम')}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-3 py-2 text-center">{t('Status', 'स्थिति')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedStates.map((st) => (
                <tr key={st.code} className="hover:bg-slate-50 transition-colors font-mono text-[11.5px]">
                  <td className="px-3 py-2 font-sans font-semibold text-slate-900">
                    {language === 'hi' ? st.stateHi : st.state}
                  </td>
                  <td className="px-3 py-2 text-right font-bold text-slate-800">{st.projects}</td>
                  <td className="px-3 py-2 text-right text-slate-600">{st.landProposedHa.toLocaleString()} Ha</td>
                  <td className="px-3 py-2 text-right text-slate-600">{st.landAcquiredHa.toLocaleString()} Ha</td>
                  <td className="px-3 py-2 text-right">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                      {st.acquisitionPercent}%
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right text-slate-600">{st.affectedFamilies.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right text-slate-900 font-bold">₹{st.compensationPaidCr} Cr</td>
                  <td className="px-3 py-2 text-right text-slate-700 font-medium">{st.rrPercent}%</td>
                  <td className="px-3 py-2 text-right">
                    <span className={`px-1 py-0.2 rounded text-[10.5px] font-bold ${
                      st.atRisk > 5 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {st.atRisk}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      st.status === 'On Track'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : st.status === 'Attention'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {st.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
          <span>{t('Click column headers to sort table records', 'स्तंभ शीर्षकों पर क्लिक करके क्रमबद्ध करें')}</span>
          <span className="text-orange-700 font-bold hover:underline cursor-pointer">
            {t('View All States  →', 'सभी राज्य देखें →')}
          </span>
        </div>

      </section>

      {/* =========================================================================
          SECTIONS 4 & 5 — NATIONAL SPATIAL OVERVIEW + PERFORMANCE ANALYTICS
          Compact Side-by-Side Responsive Grid
         ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        
        {/* Left (6 cols): National Spatial Overview Preview */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-orange-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {t('National Spatial Overview', 'राष्ट्रीय स्थानिक अवलोकन')}
              </h2>
            </div>

            <button
              onClick={() => onNavigateTab('gis-map')}
              className="flex items-center gap-1 text-xs font-bold text-orange-700 hover:text-orange-800 cursor-pointer"
            >
              <span>{t('Open GIS Map →', 'जीआईएस मानचित्र खोलें →')}</span>
            </button>
          </div>

          {/* Compact Stylized India Map Preview */}
          <div className="relative bg-[#0F172A] p-2 h-52 select-none overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-60"></div>
            
            <svg viewBox="0 0 500 240" className="w-full h-full">
              {/* National Corridor Outlines */}
              <path d="M 120 70 Q 220 50, 360 80 T 440 180" fill="none" stroke="#60A5FA" strokeWidth="2.5" strokeDasharray="4 2" opacity="0.6" />
              <path d="M 100 80 Q 150 160, 240 220" fill="none" stroke="#34D399" strokeWidth="2.5" opacity="0.6" />
              <path d="M 220 60 L 220 220" fill="none" stroke="#FBBF24" strokeWidth="2" strokeDasharray="3 3" opacity="0.5" />

              {/* State Density Clusters */}
              {/* Northern Cluster (UP / NCR) */}
              <g transform="translate(230, 80)">
                <circle cx="0" cy="0" r="14" fill="#EF4444" opacity="0.25" className="animate-ping" />
                <circle cx="0" cy="0" r="8" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
                <rect x="12" y="-10" width="70" height="18" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="0.5" />
                <text x="16" y="3" fill="#FFFFFF" fontSize="8" fontWeight="bold">UP • 24 Proj</text>
              </g>

              {/* Western Cluster (Maharashtra / Gujarat) */}
              <g transform="translate(140, 140)">
                <circle cx="0" cy="0" r="7" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
                <rect x="10" y="-9" width="70" height="18" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="0.5" />
                <text x="14" y="4" fill="#FFFFFF" fontSize="8" fontWeight="bold">MH • 18 Proj</text>
              </g>

              {/* Central Cluster (MP) */}
              <g transform="translate(220, 130)">
                <circle cx="0" cy="0" r="6" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />
                <rect x="9" y="-9" width="68" height="18" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="0.5" />
                <text x="13" y="4" fill="#FFFFFF" fontSize="8" fontWeight="bold">MP • 15 Proj</text>
              </g>

              {/* Southern Cluster (Tamil Nadu / Karnataka) */}
              <g transform="translate(210, 190)">
                <circle cx="0" cy="0" r="6" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
                <rect x="9" y="-9" width="68" height="18" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="0.5" />
                <text x="13" y="4" fill="#FFFFFF" fontSize="8" fontWeight="bold">TN • 14 Proj</text>
              </g>

              {/* Eastern Cluster (Bihar / Bengal) */}
              <g transform="translate(340, 95)">
                <circle cx="0" cy="0" r="7" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
                <rect x="10" y="-9" width="68" height="18" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="0.5" />
                <text x="14" y="4" fill="#FFFFFF" fontSize="8" fontWeight="bold">BR • 13 Proj</text>
              </g>
            </svg>

            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-700">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-xs bg-emerald-500"></span> On Track</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-xs bg-amber-500"></span> At Risk</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-xs bg-rose-500"></span> Critical</span>
              <span className="text-slate-400 font-mono">128 Projects Monitored</span>
            </div>
          </div>
        </div>

        {/* Right (6 cols): Performance & Timeline Analytics */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-3.5 shadow-2xs flex flex-col justify-between space-y-3">
          
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {t('Acquisition Performance', 'भूमि अधिग्रहण निष्पादन एवं समयसीमा')}
                </h2>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">FY 2026-27</span>
            </div>

            {/* Timeline Adherence Gauges */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded border border-emerald-200 bg-emerald-50/60">
                <span className="text-[10.5px] font-semibold text-emerald-800 block">{t('On-Time Target', 'समयबद्ध')}</span>
                <span className="text-lg font-extrabold text-emerald-900">68%</span>
                <span className="text-[9.5px] text-emerald-700 block">87 Projects</span>
              </div>

              <div className="p-2 rounded border border-amber-200 bg-amber-50/60">
                <span className="text-[10.5px] font-semibold text-amber-800 block">{t('At-Risk Buffer', 'जोखिम में')}</span>
                <span className="text-lg font-extrabold text-amber-900">14%</span>
                <span className="text-[9.5px] text-amber-700 block">18 Projects</span>
              </div>

              <div className="p-2 rounded border border-rose-200 bg-rose-50/60">
                <span className="text-[10.5px] font-semibold text-rose-800 block">{t('Timeline Slippage', 'विलंबित')}</span>
                <span className="text-lg font-extrabold text-rose-900">18%</span>
                <span className="text-[9.5px] text-rose-700 block">23 Projects</span>
              </div>
            </div>

            {/* Recent Monthly Trajectory Visual */}
            <div className="mt-3 p-2 rounded bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-[11px] font-medium text-slate-700">
                <span>{t('Monthly Land Handover Rate', 'मासिक भूमि हस्तांतरण दर')}</span>
                <span className="font-mono font-bold text-slate-900">1,480 Ha / Month</span>
              </div>

              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                <div className="bg-emerald-600 h-full" style={{ width: '68%' }} title="On-time: 68%"></div>
                <div className="bg-amber-400 h-full" style={{ width: '14%' }} title="At-risk: 14%"></div>
                <div className="bg-rose-500 h-full" style={{ width: '18%' }} title="Delayed: 18%"></div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>{t('Compensation Disbursal Trajectory:', 'मुआवजा संवितरण गति:')}</span>
            <strong className="text-slate-800">₹820 Cr / Month Average</strong>
          </div>

        </div>

      </section>

      {/* =========================================================================
          SECTIONS 6 & 7 — REQUIRES ATTENTION (7 cols) + AI INTELLIGENCE (5 cols)
          Both Fixed-Height with Internal Scroll
         ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        
        {/* Section 6 (7 cols): Requires Immediate Attention (Fixed-height Scrollable Alert Panel) */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between">
          
          <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {t('Requires Immediate Attention', 'तत्काल प्रशासनिक ध्यान अपेक्षित')}
              </h2>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              {nationalActionItems.length} {t('Action Items', 'मुद्दे')}
            </span>
          </div>

          {/* Internal Scrollable Alert Panel (Shows ~3-4 alerts at once, scrolls cleanly) */}
          <div className="max-h-56 overflow-y-auto divide-y divide-slate-100">
            {nationalActionItems.map((item) => (
              <div
                key={item.id}
                className="p-3 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.2 rounded text-[9.5px] font-bold uppercase tracking-wider border ${item.badgeColor}`}>
                      {item.severity}
                    </span>
                    <span className="font-mono text-[10.5px] font-bold text-slate-700">
                      {item.metric}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-xs truncate">
                    {language === 'hi' ? item.titleHi : item.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {language === 'hi' ? item.detailHi : item.detail}
                  </p>
                </div>

                <button
                  onClick={item.onClick}
                  className={`shrink-0 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                    item.severity === 'critical'
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-slate-800 hover:bg-slate-900 text-white'
                  }`}
                >
                  <span>{language === 'hi' ? item.actionTextHi : item.actionText}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="px-4 py-1.5 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-400 text-right">
            <span>{t('Scroll inside panel for additional national alerts ↓', 'अतिरिक्त राष्ट्रीय अलर्ट देखने हेतु स्क्रॉल करें ↓')}</span>
          </div>

        </div>

        {/* Section 7 (5 cols): BHUMI-TWIN Intelligence (Fixed-height) */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 p-3.5 shadow-2xs flex flex-col justify-between space-y-2">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {t('BHUMI-TWIN Intelligence', 'भूमि-ट्विन निर्णय बुद्धिमत्ता')}
              </h2>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              {t('AI v2.4 • 91% Conf.', 'एआई v2.4 • 91%')}
            </span>
          </div>

          {/* Internal Scrollable AI Insights List */}
          <div className="max-h-56 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
            {nationalAiInsights.map((insight) => (
              <div key={insight.id} className="pt-2 first:pt-0 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-orange-100 text-orange-800 border border-orange-200">
                    {insight.tag}
                  </span>
                  <button
                    onClick={() => onNavigateTab('simulator')}
                    className="text-[10.5px] font-bold text-orange-700 hover:text-orange-800 flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>{t('View Risk Analysis', 'जोखिम विश्लेषण')}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <h3 className="font-bold text-slate-900 text-xs">
                  {language === 'hi' ? insight.titleHi : insight.title}
                </h3>
                <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                  {language === 'hi' ? insight.textHi : insight.text}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-1.5 border-t border-slate-100 text-[10px] text-slate-400 text-right">
            <span>{t('AI decision support for administrative officers', 'प्रशासनिक अधिकारियों हेतु निर्णय समर्थन')}</span>
          </div>

        </div>

      </section>

      {/* =========================================================================
          SECTION 8 — RECENT SYSTEM ACTIVITY
          Compact Panel with Fixed Height & Internal Scroll
         ========================================================================= */}
      <section className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-2xs space-y-2">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-orange-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {t('Recent System Activity', 'हालिया राष्ट्रीय प्रशासनिक गतिविधि')}
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('audit-log')}
            className="text-xs font-bold text-orange-700 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>{t('View Complete Audit Trail →', 'सम्पूर्ण ऑडिट ट्रेल देखें →')}</span>
          </button>
        </div>

        {/* Scrollable Event Feed (max-h-40) */}
        <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 text-xs pr-1">
          {recentActivities.map((act) => (
            <div key={act.id} className="py-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200 shrink-0">
                  {act.time}
                </span>
                <span className="font-medium text-slate-800 truncate">
                  {language === 'hi' ? act.titleHi : act.title}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0 pl-6 sm:pl-0">
                {act.department}
              </span>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
};
