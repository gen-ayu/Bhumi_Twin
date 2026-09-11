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
import { ProjectsListView } from './components/projects/ProjectsListView';
import { ProjectDetailsView } from './components/projects/ProjectDetailsView';

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
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedParcelId, setSelectedParcelId] = useState<string>('PARCEL-001');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Tab switcher helper that resets project details view when navigating
  const handleSelectTab = (tab: NavTab) => {
    if (tab === 'projects') {
      setSelectedProjectId(null);
    }
    setCurrentTab(tab);
  };

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
        setSelectedParcelId('PARCEL-001');
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
      className={`h-screen w-screen overflow-hidden bg-slate-100/70 text-slate-900 transition-colors duration-200 relative ${
        highContrast ? 'contrast-125 saturate-150' : ''
      } ${textSizeClass}`}
    >
      {/* 1. Left Fixed Sidebar (top: 0, left: 0, height: 100vh) */}
      <GovSidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        currentRole={currentRole}
        language={language}
        selectedParcelId={selectedParcelId}
        expanded={sidebarExpanded}
        onToggleExpand={() => setSidebarExpanded(!sidebarExpanded)}
      />

      {/* 2. Main Viewport Area (Accounts for fixed sidebar width) */}
      <div
        className={`h-screen flex flex-col overflow-hidden transition-all duration-300 ${
          sidebarExpanded ? 'pl-64' : 'pl-16'
        }`}
      >
        {/* Top Navbar - Fixed at the top */}
        <GovHeader
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          currentRole={currentRole}
          language={language}
          onToggleLanguage={toggleLanguage}
          onSearch={handleGlobalSearch}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          selectedParcelId={selectedParcelId}
          sidebarExpanded={sidebarExpanded}
          onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)}
        />

        {/* 3. Independent Scrollable Main Content Area */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto w-full min-w-0 transition-all duration-300 flex flex-col"
        >
          <div className="flex-1 pb-16">
            {isLoginModalOpen ? (
              <LoginView
                onLoginSuccess={handleLoginSuccess}
                onCancel={() => setIsLoginModalOpen(false)}
              />
            ) : (
              <>
                {currentTab === 'dashboard' && (
                  <GovDashboard
                    onNavigateTab={handleSelectTab}
                    onSelectParcel={(id) => {
                      setSelectedParcelId(id);
                      handleSelectTab('digital-twin');
                    }}
                  />
                )}

                {currentTab === 'projects' && (
                  selectedProjectId ? (
                    <ProjectDetailsView
                      projectId={selectedProjectId}
                      onBack={() => setSelectedProjectId(null)}
                      onNavigateTab={handleSelectTab}
                      onSelectParcel={(id) => {
                        setSelectedParcelId(id);
                        handleSelectTab('digital-twin');
                      }}
                    />
                  ) : (
                    <ProjectsListView
                      onSelectProject={(id) => setSelectedProjectId(id)}
                      currentRole={currentRole}
                    />
                  )
                )}

                {currentTab === 'gis-map' && (
                  <GisMapView
                    selectedParcelId={selectedParcelId}
                    onSelectParcel={setSelectedParcelId}
                    onNavigateTab={handleSelectTab}
                  />
                )}

                {currentTab === 'digital-twin' && (
                  <DigitalTwinView
                    selectedParcelId={selectedParcelId}
                    onSelectParcel={setSelectedParcelId}
                    onNavigateTab={handleSelectTab}
                  />
                )}

                {currentTab === 'simulator' && (
                  <WhatIfSimulator onNavigateTab={handleSelectTab} />
                )}

                {currentTab === 'citizen-portal' && (
                  <CitizenPortal initialCaseId="CAS-2026-RAM-204" />
                )}

                {currentTab === 'verification' && (
                  <FieldVerificationForm
                    initialParcelId={selectedParcelId}
                    onNavigateTab={handleSelectTab}
                    onParcelUpdated={handleParcelUpdated}
                  />
                )}

                {currentTab === 'satellite' && (
                  <SatelliteAlertView
                    onNavigateTab={handleSelectTab}
                    onSelectParcel={(id) => {
                      setSelectedParcelId(id);
                    }}
                  />
                )}

                {currentTab === 'audit-log' && <AuditLogView />}
              </>
            )}
          </div>

          {/* 4. Official Footer (MyGov.in 4-column style) inside scrollable area */}
          <GovFooter />
        </main>
      </div>

      {/* 5. GoI-compliant Cookie Consent Banner */}
      <CookieBanner />

      {/* 6. Floating Action Dock on Right Edge (Alerts, Calendar, Feedback, Support) */}
      <FloatingDock
        onNavigateTab={handleSelectTab}
        onInspectParcel={(id) => {
          setSelectedParcelId(id);
          handleSelectTab('digital-twin');
        }}
      />

      {/* 7. Sticky Role Switcher & SIH 7-Step Pitch Flow Navigator */}
      <DemoRoleSwitcher
        currentRole={currentRole}
        onSelectRole={handleRoleSelect}
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onSelectParcel={setSelectedParcelId}
      />
    </div>
  );
}
export default App;
