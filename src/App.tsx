import React, { useState } from 'react';
import { GovTopBar } from './components/layout/GovTopBar';
import { GovHeader, NavTab } from './components/layout/GovHeader';
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
import { ALL_PARCELS } from './data/mockData';

export function App() {
  // Roles & View State
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [selectedParcelId, setSelectedParcelId] = useState<string>('P-204');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Accessibility & Localization
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');

  // Search Action
  const handleGlobalSearch = (query: string) => {
    const q = query.trim().toUpperCase();
    const found = ALL_PARCELS.find(
      (p) =>
        p.id.toUpperCase().includes(q) ||
        p.surveyNumber.toUpperCase().includes(q) ||
        p.village.toUpperCase().includes(q) ||
        p.ulpin.toUpperCase().includes(q)
    );

    if (found) {
      setSelectedParcelId(found.id);
      setCurrentTab('digital-twin');
    } else {
      // Navigate to GIS Map and keep current selection
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
      className={`min-h-screen flex flex-col bg-slate-100/90 text-slate-900 transition-colors duration-200 ${
        highContrast ? 'contrast-125 saturate-150' : ''
      } ${textSizeClass}`}
    >
      {/* 1. Official Government Top Utility Bar */}
      <GovTopBar
        currentRole={currentRole}
        language={language}
        onToggleLanguage={() => setLanguage(language === 'en' ? 'hi' : 'en')}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(!highContrast)}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        onSelectRole={handleRoleSelect}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* 2. Official 2-Tier Header (with Wordmark & Global Search) */}
      <GovHeader
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentRole={currentRole}
        language={language}
        onSearch={handleGlobalSearch}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        selectedParcelId={selectedParcelId}
      />

      {/* 3. Main Dynamic Content Region */}
      <main id="main-content" className="flex-1 w-full pb-16">
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
