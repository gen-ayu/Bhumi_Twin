import React, { useState } from 'react';
import { GovHeader, NavTab } from './components/layout/GovHeader';
import { GovSidebar } from './components/layout/GovSidebar';
import { GovFooter } from './components/layout/GovFooter';
import { CookieBanner } from './components/layout/CookieBanner';
import { FloatingDock } from './components/layout/FloatingDock';
import { DemoRoleSwitcher } from './components/layout/DemoRoleSwitcher';

// Screens
import { GovDashboard } from './components/dashboard/GovDashboard';
import { GisMapView } from './components/gis/GisMapView';
import { DigitalTwinView } from './components/digitaltwin/DigitalTwinView';
import { WhatIfSimulator } from './components/simulator/WhatIfSimulator';
import { CitizenPortal } from './components/citizen/CitizenPortal';
import { FieldVerificationForm } from './components/verification/FieldVerificationForm';
import { SatelliteAlertView } from './components/satellite/SatelliteAlertView';
import { AuditLogView } from './components/audit/AuditLogView';
import { LoginView } from './components/auth/LoginView';

import { UserRole } from './types';
import { ALL_PARCELS, CURRENT_PROJECT } from './data/mockData';
import { useLanguage } from './context/LanguageContext';

export function App() {
  // Localization from context
  const { language, toggleLanguage } = useLanguage();

  // Sidebar Expanded State (Collapsible with 3-dashes toggle)
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);

  // Roles & View State
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [selectedParcelId, setSelectedParcelId] = useState<string>('P-204');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Accessibility
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');


  // Search Action: handles Project ID, Parcel ID, Survey Number, District, Village, and Location Landmarks
  const handleGlobalSearch = (query: string, category: string = 'all') => {
    const q = query.trim().toUpperCase();
    if (!q) return;

    // 1. Check Project ID match (e.g. PROJ-MRD-2026-09, NH-31, Varanasi Ring Road)
    const isProjectMatch =
      CURRENT_PROJECT.id.toUpperCase().includes(q) ||
      CURRENT_PROJECT.code.toUpperCase().includes(q) ||
      CURRENT_PROJECT.name.toUpperCase().includes(q);

    if (category === 'project' || (category === 'all' && isProjectMatch)) {
      setCurrentTab('dashboard');
      return;
    }

    // 2. Check Parcel ID, Survey Number, District, Village, and Landmark match
    const found = ALL_PARCELS.find((p) => {
      const matchParcel = p.id.toUpperCase().includes(q) || p.ulpin.toUpperCase().includes(q);
      const matchSurvey = p.surveyNumber.toUpperCase().includes(q);
      const matchDistrict = p.district.toUpperCase().includes(q);
      const matchVillage = p.village.toUpperCase().includes(q);
      const matchLandmark = p.nearestLandmark?.toUpperCase().includes(q);

      switch (category) {
        case 'parcel':
          return matchParcel;
        case 'survey':
          return matchSurvey;
        case 'district':
          return matchDistrict;
        case 'village':
          return matchVillage;
        case 'landmark':
          return matchLandmark;
        case 'all':
        default:
          return matchParcel || matchSurvey || matchDistrict || matchVillage || matchLandmark;
      }
    });

    if (found) {
      setSelectedParcelId(found.id);
      if (category === 'village' || category === 'district' || category === 'landmark') {
        setCurrentTab('gis-map');
      } else {
        setCurrentTab('digital-twin');
      }
    } else {
      // Fallback: Navigate to GIS Map for spatial exploration
      setCurrentTab('gis-map');
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'citizen') {
      setCurrentTab('citizen-portal');
    } else if (currentTab === 'citizen-portal') {
      setCurrentTab('dashboard');
    }
  };

  const handleLoginSuccess = (role: UserRole, caseId?: string) => {
    setCurrentRole(role);
    setIsLoginModalOpen(false);
    if (role === 'citizen') {
      setCurrentTab('citizen-portal');
      if (caseId) {
        setSelectedParcelId('P-204');
      }
    } else {
      setCurrentTab('dashboard');
    }
  };

  const handleParcelUpdated = (parcelId: string, status: string) => {
    const found = ALL_PARCELS.find((p) => p.id === parcelId);
    if (found) {
      found.lastFieldVerification = {
        date: '09 Sep 2026',
        officer: 'REV-OFF-4412 (Shri S.N. Tripathi)',
        status: status as any,
        notes: 'Field verification submitted via mobile digital applet.',
        gpsCoordinates: '25.3418° N, 82.9412° E',
      };
    }
  };

  // Accessibility text size class
  const textSizeClass =
    fontSize === 'larger' ? 'text-lg' : fontSize === 'large' ? 'text-base' : 'text-sm';

  return (
    <div
      id="bhumi-twin-root"
      className={`min-h-screen flex flex-col bg-slate-100/70 text-slate-900 transition-colors duration-200 ${
        highContrast ? 'contrast-125 saturate-150' : ''
      } ${textSizeClass}`}
    >
      {/* Unified Government Single Navigation Bar */}
      <GovHeader
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentRole={currentRole}
        language={language}
        onToggleLanguage={toggleLanguage}
        onSearch={handleGlobalSearch}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        selectedParcelId={selectedParcelId}
        sidebarExpanded={sidebarExpanded}
        onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)}
      />

      {/* 3. Main Dynamic Content Region with Collapsible Indian Flag Themed Sidebar */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
        <GovSidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          currentRole={currentRole}
          language={language}
          selectedParcelId={selectedParcelId}
          expanded={sidebarExpanded}
          onToggleExpand={() => setSidebarExpanded(!sidebarExpanded)}
        />

        <main id="main-content" className="flex-1 overflow-y-auto w-full pb-16 min-w-0 transition-all duration-300">
          {isLoginModalOpen ? (
            <LoginView
              onLoginSuccess={handleLoginSuccess}
              onCancel={() => setIsLoginModalOpen(false)}
            />
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <GovDashboard
                  onNavigateTab={setCurrentTab}
                  onSelectParcel={(id) => {
                    setSelectedParcelId(id);
                    setCurrentTab('digital-twin');
                  }}
                />
              )}

              {currentTab === 'gis-map' && (
                <GisMapView
                  selectedParcelId={selectedParcelId}
                  onSelectParcel={setSelectedParcelId}
                  onNavigateTab={setCurrentTab}
                />
              )}

              {currentTab === 'digital-twin' && (
                <DigitalTwinView
                  selectedParcelId={selectedParcelId}
                  onSelectParcel={setSelectedParcelId}
                  onNavigateTab={setCurrentTab}
                />
              )}

              {currentTab === 'simulator' && (
                <WhatIfSimulator onNavigateTab={setCurrentTab} />
              )}

              {currentTab === 'citizen-portal' && (
                <CitizenPortal initialCaseId="CAS-2026-RAM-204" />
              )}

              {currentTab === 'verification' && (
                <FieldVerificationForm
                  initialParcelId={selectedParcelId}
                  onNavigateTab={setCurrentTab}
                  onParcelUpdated={handleParcelUpdated}
                />
              )}

              {currentTab === 'satellite' && (
                <SatelliteAlertView
                  onNavigateTab={setCurrentTab}
                  onSelectParcel={(id) => {
                    setSelectedParcelId(id);
                  }}
                />
              )}

              {currentTab === 'audit-log' && <AuditLogView />}
            </>
          )}
        </main>
      </div>

      {/* 4. Official Footer (MyGov.in 4-column style) */}
      <GovFooter />

      {/* 5. GoI-compliant Cookie Consent Banner */}
      <CookieBanner />

      {/* 6. Floating Action Dock on Right Edge (Alerts, Calendar, Feedback, Support) */}
      <FloatingDock
        onNavigateTab={setCurrentTab}
        onInspectParcel={(id) => {
          setSelectedParcelId(id);
          setCurrentTab('digital-twin');
        }}
      />

      {/* 7. Sticky Role Switcher & SIH 7-Step Pitch Flow Navigator */}
      <DemoRoleSwitcher
        currentRole={currentRole}
        onSelectRole={handleRoleSelect}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onSelectParcel={setSelectedParcelId}
      />
    </div>
  );
}
export default App;
