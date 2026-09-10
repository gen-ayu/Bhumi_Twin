import React, { useState, useMemo } from 'react';
import { NavTab } from '../layout/GovHeader';
import { getProjectWorkspaceData } from '../../data/projectWorkspaceData';

// Subcomponents of the Project Workspace
import { ProjectWorkspaceHeader } from './workspace/ProjectWorkspaceHeader';
import { ProjectKpiOverview } from './workspace/ProjectKpiOverview';
import { ProjectSecondaryNav, WorkspaceTabId } from './workspace/ProjectSecondaryNav';
import { ProjectExecutiveOverview } from './workspace/ProjectExecutiveOverview';
import { ProjectPipelineTimeline } from './workspace/ProjectPipelineTimeline';
import { ProjectOfficersSection } from './workspace/ProjectOfficersSection';
import { ProjectWhatIfSection } from './workspace/ProjectWhatIfSection';
import { ProjectConsentSection } from './workspace/ProjectConsentSection';
import { ProjectEvidenceGallery } from './workspace/ProjectEvidenceGallery';
import { ProjectRiskSummary } from './workspace/ProjectRiskSummary';
import { ProjectActivityTimeline } from './workspace/ProjectActivityTimeline';

interface ProjectDetailsViewProps {
  projectId: string;
  onBack: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onSelectParcel?: (parcelId: string) => void;
}

export const ProjectDetailsView: React.FC<ProjectDetailsViewProps> = ({
  projectId,
  onBack,
  onNavigateTab,
  onSelectParcel,
}) => {
  // Retrieve workspace data enriched with officers, consent, evidence, risks, and activity
  const workspaceData = useMemo(() => {
    return getProjectWorkspaceData(projectId);
  }, [projectId]);

  const {
    project,
    overallStatus,
    overallRiskScore,
    lastUpdated,
    officers,
    consentSummary,
    consentRecords,
    evidencePhotos,
    riskMetrics,
    criticalParcels,
    activityTimeline,
  } = workspaceData;

  // Active section tab: defaults to 'overview'
  const [activeTab, setActiveTab] = useState<WorkspaceTabId>('overview');

  const handleTabChange = (tabId: WorkspaceTabId) => {
    setActiveTab(tabId);
  };

  return (
    <div
      id="project-digital-twin-workspace"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5 pb-20"
    >
      {/* 1. PROJECT HEADER (Always at the top) */}
      <ProjectWorkspaceHeader
        project={project}
        overallStatus={overallStatus}
        overallRiskScore={overallRiskScore}
        lastUpdated={lastUpdated}
        onBack={onBack}
        onNavigateTab={onNavigateTab}
        onSelectParcel={onSelectParcel}
      />

      {/* 2. PROJECT OVERVIEW: 8 COMPACT KPI CARDS (Permanently at top) */}
      <ProjectKpiOverview project={project} />

      {/* 3. STICKY SECONDARY PROJECT NAVIGATION BAR (Immediately below KPI cards) */}
      <ProjectSecondaryNav
        activeTab={activeTab}
        onTabClick={handleTabChange}
        counts={{
          officers: officers.length,
          consentRate: consentSummary.consentPercentage,
          evidence: evidencePhotos.length,
          highRisk: riskMetrics.highRiskParcels,
          activity: activityTimeline.length,
        }}
      />

      {/* 4. DYNAMIC CONTENT REGION: Shows ONLY the selected tab's content */}
      <div id="project-active-tab-content" className="min-h-[400px]">
        {activeTab === 'overview' && (
          <ProjectExecutiveOverview
            project={project}
            workspaceData={workspaceData}
            onSelectTab={handleTabChange}
            onSelectParcel={onSelectParcel}
            onNavigateTab={onNavigateTab}
          />
        )}

        {activeTab === 'acquisition' && (
          <div className="animate-in fade-in duration-200">
            <ProjectPipelineTimeline project={project} />
          </div>
        )}

        {activeTab === 'officers' && (
          <div className="animate-in fade-in duration-200">
            <ProjectOfficersSection
              officers={officers}
              onSelectParcel={onSelectParcel}
              onNavigateTab={onNavigateTab}
            />
          </div>
        )}

        {activeTab === 'simulator' && (
          <div className="animate-in fade-in duration-200">
            <ProjectWhatIfSection onNavigateTab={onNavigateTab} />
          </div>
        )}

        {activeTab === 'consent' && (
          <div className="animate-in fade-in duration-200">
            <ProjectConsentSection
              summary={consentSummary}
              consentRecords={consentRecords}
              onSelectParcel={onSelectParcel}
              onNavigateTab={onNavigateTab}
            />
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="animate-in fade-in duration-200">
            <ProjectEvidenceGallery
              evidencePhotos={evidencePhotos}
              onSelectParcel={onSelectParcel}
              onNavigateTab={onNavigateTab}
            />
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="animate-in fade-in duration-200">
            <ProjectRiskSummary
              riskMetrics={riskMetrics}
              criticalParcels={criticalParcels}
              onSelectParcel={onSelectParcel}
              onNavigateTab={onNavigateTab}
            />
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="animate-in fade-in duration-200">
            <ProjectActivityTimeline activityTimeline={activityTimeline} />
          </div>
        )}
      </div>
    </div>
  );
};
