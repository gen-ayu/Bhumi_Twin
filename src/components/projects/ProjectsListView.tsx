import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Building2,
  MapPin,
  IndianRupee,
  FileSpreadsheet
} from 'lucide-react';
import {
  ProjectRecord,
  ALL_PROJECTS_DATA,
  STATE_DISTRICT_MAP,
  PROJECT_TYPES,
  ACQUISITION_STATUSES,
  RISK_LEVELS,
  ProjectType,
  AcquisitionStatus,
  RiskLevel
} from '../../data/projectsData';
import { UserRole } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ProjectsListViewProps {
  onSelectProject: (projectId: string) => void;
  currentRole: UserRole;
}

type SortField =
  | 'name'
  | 'landProposed'
  | 'landAcquired'
  | 'acquisitionProgress'
  | 'affectedFamilies'
  | 'compensationDisbursedCr'
  | 'possessionPercent'
  | 'riskLevel'
  | 'status';

type SortDirection = 'asc' | 'desc';

export const ProjectsListView: React.FC<ProjectsListViewProps> = ({
  onSelectProject,
  currentRole,
}) => {
  const { language } = useLanguage();

  // Master projects state (allows adding new projects dynamically via modal)
  const [projectsList, setProjectsList] = useState<ProjectRecord[]>(ALL_PROJECTS_DATA);

  // Filters State
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sorting State
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modal State for Registering a Project
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newProject, setNewProject] = useState<Partial<ProjectRecord>>({
    name: '',
    state: 'Punjab',
    district: 'Ludhiana',
    projectType: 'Highway',
    landProposed: 100,
    landAcquired: 0,
    acquisitionProgress: 0,
    affectedFamilies: 50,
    compensationAssessedCr: 20,
    compensationDisbursedCr: 0,
    possessionPercent: 0,
    riskLevel: 'Low',
    status: 'Survey',
    nodalOfficer: '',
    agency: 'NHAI',
    targetDate: '2027',
    estimatedCostCr: 500,
  });

  // Available states for dropdown
  const allStates = useMemo(() => Object.keys(STATE_DISTRICT_MAP).sort(), []);

  // DEPENDENT DISTRICTS LIST: strictly derived from selectedState
  const availableDistricts = useMemo(() => {
    if (selectedState === 'all' || !STATE_DISTRICT_MAP[selectedState]) {
      return [];
    }
    return STATE_DISTRICT_MAP[selectedState];
  }, [selectedState]);

  // CRITICAL: Handle State Change - Automatically resets District
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setSelectedState(newState);
    // Reset district selection so a district from a previous state is never retained
    setSelectedDistrict('all');
    setCurrentPage(1);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(e.target.value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedState('all');
    setSelectedDistrict('all');
    setSelectedType('all');
    setSelectedStatus('all');
    setSelectedRisk('all');
    setSearchQuery('');
    setSortField(null);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedState !== 'all' ||
    selectedDistrict !== 'all' ||
    selectedType !== 'all' ||
    selectedStatus !== 'all' ||
    selectedRisk !== 'all' ||
    searchQuery.trim().length > 0;

  // Sorting Handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        // Reset sort
        setSortField(null);
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return projectsList.filter((project) => {
      // State filter
      if (selectedState !== 'all' && project.state !== selectedState) {
        return false;
      }

      // District filter
      if (selectedDistrict !== 'all' && project.district !== selectedDistrict) {
        return false;
      }

      // Project Type filter
      if (selectedType !== 'all' && project.projectType !== selectedType) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && project.status !== selectedStatus) {
        return false;
      }

      // Risk filter
      if (selectedRisk !== 'all' && project.riskLevel !== selectedRisk) {
        return false;
      }

      // Search Query: Across Project Name, ID, District, State, Villages
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.trim().toLowerCase();
        const matchName = project.name.toLowerCase().includes(q);
        const matchId = project.id.toLowerCase().includes(q) || project.code.toLowerCase().includes(q);
        const matchDistrict = project.district.toLowerCase().includes(q);
        const matchState = project.state.toLowerCase().includes(q);
        const matchVillage = project.villages?.some((v) => v.toLowerCase().includes(q)) ?? false;
        const matchAgency = project.agency.toLowerCase().includes(q);

        if (!matchName && !matchId && !matchDistrict && !matchState && !matchVillage && !matchAgency) {
          return false;
        }
      }

      return true;
    });
  }, [projectsList, selectedState, selectedDistrict, selectedType, selectedStatus, selectedRisk, searchQuery]);

  // Apply Sorting
  const sortedProjects = useMemo(() => {
    if (!sortField) return filteredProjects;

    return [...filteredProjects].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredProjects, sortField, sortDirection]);

  // Paginated Projects
  const totalPages = Math.max(1, Math.ceil(sortedProjects.length / pageSize));
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedProjects.slice(startIndex, startIndex + pageSize);
  }, [sortedProjects, currentPage, pageSize]);

  // Helper for status badge
  const renderStatusBadge = (status: AcquisitionStatus) => {
    let colorClass = 'bg-slate-100 text-slate-700 border-slate-200';
    let icon = '🟢';

    switch (status) {
      case 'Completed':
        colorClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
        icon = '🟢';
        break;
      case 'Possession':
        colorClass = 'bg-blue-50 text-blue-800 border-blue-300';
        icon = '🟢';
        break;
      case 'Compensation':
      case 'Award':
      case 'Notification':
      case 'R&R':
        colorClass = 'bg-amber-50 text-amber-800 border-amber-300';
        icon = '🟡';
        break;
      case 'Delayed':
        colorClass = 'bg-rose-50 text-rose-800 border-rose-300';
        icon = '🔴';
        break;
      case 'Survey':
      case 'Not Started':
      default:
        colorClass = 'bg-slate-50 text-slate-700 border-slate-200';
        icon = '🟡';
        break;
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${colorClass} whitespace-nowrap`}>
        <span className="text-[10px]">{icon}</span>
        <span>{status}</span>
      </span>
    );
  };

  // Helper for risk badge
  const renderRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300 whitespace-nowrap">
            <span>🔴</span>
            <span>Critical</span>
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-orange-100 text-orange-800 border border-orange-300 whitespace-nowrap">
            <span>🟠</span>
            <span>High</span>
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-800 border border-amber-300 whitespace-nowrap">
            <span>🟡</span>
            <span>Medium</span>
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-300 whitespace-nowrap">
            <span>🟢</span>
            <span>Low</span>
          </span>
        );
    }
  };

  // Render Sort Header
  const renderSortHeader = (label: string, field: SortField, align: 'left' | 'right' = 'left') => {
    const isSorted = sortField === field;
    return (
      <button
        onClick={() => handleSort(field)}
        className={`flex items-center gap-1 uppercase tracking-wider text-[10px] font-bold cursor-pointer select-none transition-colors hover:text-slate-900 ${
          isSorted ? 'text-amber-800' : 'text-slate-600'
        } ${align === 'right' ? 'ml-auto justify-end' : ''}`}
        title={`Sort by ${label}`}
      >
        <span>{label}</span>
        {isSorted ? (
          sortDirection === 'asc' ? (
            <ArrowUp className="w-3 h-3 text-amber-700" />
          ) : (
            <ArrowDown className="w-3 h-3 text-amber-700" />
          )
        ) : (
          <ArrowUpDown className="w-2.5 h-2.5 text-slate-400 opacity-60" />
        )}
      </button>
    );
  };

  // Handle Project Creation Submission
  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name) return;

    const created: ProjectRecord = {
      id: `PROJ-${(newProject.projectType || 'HWY').slice(0, 3).toUpperCase()}-2026-${Math.floor(
        10 + Math.random() * 90
      )}`,
      name: newProject.name,
      code: `GOI-${(newProject.state || 'IND').slice(0, 2).toUpperCase()}-01`,
      state: newProject.state || 'Punjab',
      district: newProject.district || 'Ludhiana',
      villages: ['Sector-1', 'Central Block'],
      projectType: newProject.projectType as ProjectType,
      landProposed: Number(newProject.landProposed) || 100,
      landAcquired: 0,
      acquisitionProgress: 0,
      affectedFamilies: Number(newProject.affectedFamilies) || 40,
      compensationAssessedCr: Number(newProject.compensationAssessedCr) || 25,
      compensationDisbursedCr: 0,
      possessionPercent: 0,
      riskLevel: (newProject.riskLevel as RiskLevel) || 'Low',
      status: (newProject.status as AcquisitionStatus) || 'Survey',
      nodalOfficer: newProject.nodalOfficer || 'District Collectorate',
      agency: newProject.agency || 'NHAI',
      targetDate: newProject.targetDate || '2028',
      estimatedCostCr: Number(newProject.estimatedCostCr) || 600,
    };

    setProjectsList([created, ...projectsList]);
    setIsCreateModalOpen(false);
    onSelectProject(created.id);
  };

  // Check role permission for project registration
  const canCreateProject = currentRole === 'admin' || currentRole === 'officer';

  return (
    <div id="projects-list-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              PROJECTS
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              National Repository
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Monitor and manage land acquisition projects across States and Districts
          </p>
        </div>

        {/* Right side: [+ Create / Register Project] button */}
        {canCreateProject && (
          <button
            id="create-project-btn"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#EA580C] hover:bg-[#D97706] rounded-lg shadow-2xs transition-all cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create / Register Project</span>
          </button>
        )}
      </div>

      {/* 2. Compact Horizontal Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* State Dropdown */}
          <div className="flex-1 min-w-[140px] sm:min-w-[150px]">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              State
            </label>
            <select
              id="filter-state-select"
              value={selectedState}
              onChange={handleStateChange}
              className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500 cursor-pointer font-medium"
            >
              <option value="all">All States</option>
              {allStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Dependent District Dropdown */}
          <div className="flex-1 min-w-[140px] sm:min-w-[150px]">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              District
            </label>
            <select
              id="filter-district-select"
              value={selectedDistrict}
              onChange={handleDistrictChange}
              disabled={selectedState === 'all'}
              className={`w-full text-xs py-1.5 px-2.5 rounded-lg border text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500 font-medium ${
                selectedState === 'all'
                  ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-white border-slate-300 cursor-pointer'
              }`}
            >
              <option value="all">
                {selectedState === 'all'
                  ? 'All Districts'
                  : `Select ${selectedState} District`}
              </option>
              {availableDistricts.map((dst) => (
                <option key={dst} value={dst}>
                  {dst}
                </option>
              ))}
            </select>
          </div>

          {/* Project Type Dropdown */}
          <div className="flex-1 min-w-[130px] sm:min-w-[140px]">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Project Type
            </label>
            <select
              id="filter-type-select"
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500 cursor-pointer font-medium"
            >
              <option value="all">All Types</option>
              {PROJECT_TYPES.map((pt) => (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              ))}
            </select>
          </div>

          {/* Acquisition Status Dropdown */}
          <div className="flex-1 min-w-[130px] sm:min-w-[140px]">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Acquisition Status
            </label>
            <select
              id="filter-status-select"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500 cursor-pointer font-medium"
            >
              <option value="all">All Statuses</option>
              {ACQUISITION_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Level Dropdown */}
          <div className="flex-1 min-w-[120px] sm:min-w-[130px]">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Risk Level
            </label>
            <select
              id="filter-risk-select"
              value={selectedRisk}
              onChange={(e) => {
                setSelectedRisk(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500 cursor-pointer font-medium"
            >
              <option value="all">All Risks</option>
              {RISK_LEVELS.map((rl) => (
                <option key={rl} value={rl}>
                  {rl}
                </option>
              ))}
            </select>
          </div>

          {/* Search Project / Project ID Field */}
          <div className="flex-2 min-w-[200px]">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Search Project / Project ID 🔍
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                id="filter-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Name, ID, District, State, Village..."
                className="w-full text-xs py-1.5 pl-8 pr-3 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="self-end pb-0.5">
              <button
                id="clear-filters-btn"
                onClick={handleClearFilters}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear Filters</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Section Header & Count Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            ALL PROJECTS
          </span>
          <span className="text-xs text-slate-500">
            • Showing <strong className="text-slate-800">{sortedProjects.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, sortedProjects.length)}</strong> of <strong className="text-slate-800">{sortedProjects.length}</strong> Projects
            {sortedProjects.length !== projectsList.length && (
              <span className="text-slate-400 ml-1">
                (filtered from {projectsList.length} total)
              </span>
            )}
          </span>
        </div>

        {/* Rows per page selector */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="text-xs py-1 px-1.5 rounded border border-slate-200 bg-white text-slate-700 font-medium cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* 4. Professional Government Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {sortedProjects.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
              <Filter className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">No projects found</h3>
              <p className="text-xs text-slate-500">
                Try changing your filters or search criteria.
              </p>
            </div>
            <div>
              <button
                onClick={handleClearFilters}
                className="px-4 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Table with Sticky Header and Internal Scroll */}
            <div className="max-h-[580px] overflow-y-auto overflow-x-auto relative">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10 select-none">
                  <tr className="divide-x divide-slate-100 text-slate-600">
                    <th className="px-3 py-2.5 font-bold uppercase tracking-wider text-[10px] w-28">
                      Project ID
                    </th>
                    <th className="px-3 py-2.5 font-bold uppercase tracking-wider text-[10px] min-w-[220px]">
                      {renderSortHeader('Project Name', 'name')}
                    </th>
                    <th className="px-3 py-2.5 font-bold uppercase tracking-wider text-[10px]">
                      State
                    </th>
                    <th className="px-3 py-2.5 font-bold uppercase tracking-wider text-[10px]">
                      District
                    </th>
                    <th className="px-3 py-2.5 font-bold uppercase tracking-wider text-[10px]">
                      Type
                    </th>
                    <th className="px-3 py-2.5 font-bold uppercase tracking-wider text-[10px] text-right">
                      {renderSortHeader('Land Proposed', 'landProposed', 'right')}
                    </th>
                    <th className="px-3 py-2.5 font-bold uppercase tracking-wider text-[10px] text-right">
                      {renderSortHeader('Land Acquired', 'landAcquired', 'right')}
                    </th>
                    <th className="px-3 py-2.5 font-bold uppercase tracking-wider text-[10px] min-w-[130px]">
                      {renderSortHeader('Acq Progress', 'acquisitionProgress')}
                    </th>
                    <th className="px-3 py-2.5 font-bold uppercase tracking-wider text-[10px] text-right">
                      {renderSortHeader('Families', 'affectedFamilies', 'right')}
                    </th>
                    <th className="px-3 py-2.5 font-bold uppercase tracking-wider text-[10px]">
                      {renderSortHeader('Compensation', 'compensationDisbursedCr')}
                    </th>
                    <th className="px-3 py-2.5 font-bold uppercase tracking-wider text-[10px]">
                      {renderSortHeader('Possession', 'possessionPercent')}
                    </th>
                    <th className="px-3 py-2.5 font-bold uppercase tracking-wider text-[10px]">
                      {renderSortHeader('Risk', 'riskLevel')}
                    </th>
                    <th className="px-3 py-2.5 font-bold uppercase tracking-wider text-[10px]">
                      {renderSortHeader('Status', 'status')}
                    </th>
                    <th className="px-3 py-2.5 font-bold uppercase tracking-wider text-[10px] text-center w-28">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {paginatedProjects.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-amber-50/40 transition-colors group cursor-pointer"
                      onClick={() => onSelectProject(p.id)}
                    >
                      {/* ID */}
                      <td className="px-3 py-2.5 font-mono font-bold text-slate-900 text-[11px] whitespace-nowrap">
                        {p.id}
                      </td>

                      {/* Project Name */}
                      <td className="px-3 py-2.5">
                        <div className="font-semibold text-slate-900 leading-snug group-hover:text-amber-800 transition-colors">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {p.code} • {p.agency}
                        </div>
                      </td>

                      {/* State */}
                      <td className="px-3 py-2.5 whitespace-nowrap font-medium text-slate-800">
                        {p.state}
                      </td>

                      {/* District */}
                      <td className="px-3 py-2.5 whitespace-nowrap font-medium text-slate-700">
                        {p.district}
                      </td>

                      {/* Type */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {p.projectType}
                        </span>
                      </td>

                      {/* Land Proposed */}
                      <td className="px-3 py-2.5 text-right font-mono font-medium text-slate-800 whitespace-nowrap">
                        {p.landProposed.toFixed(1)} Ha
                      </td>

                      {/* Land Acquired */}
                      <td className="px-3 py-2.5 text-right font-mono font-semibold text-slate-900 whitespace-nowrap">
                        {p.landAcquired.toFixed(1)} Ha
                      </td>

                      {/* Acquisition Progress */}
                      <td className="px-3 py-2.5">
                        <div className="space-y-1 min-w-[100px]">
                          <div className="flex justify-between text-[10px] font-medium">
                            <span className="font-bold text-slate-800">{p.acquisitionProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                p.acquisitionProgress >= 80
                                  ? 'bg-emerald-600'
                                  : p.acquisitionProgress >= 50
                                  ? 'bg-amber-500'
                                  : 'bg-[#EA580C]'
                              }`}
                              style={{ width: `${Math.min(100, p.acquisitionProgress)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Affected Families */}
                      <td className="px-3 py-2.5 text-right font-mono text-slate-700 whitespace-nowrap">
                        {p.affectedFamilies}
                      </td>

                      {/* Compensation */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <div className="font-semibold text-slate-900 font-mono text-[11px]">
                          ₹{p.compensationDisbursedCr.toFixed(1)} Cr
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {Math.round((p.compensationDisbursedCr / (p.compensationAssessedCr || 1)) * 100)}% of ₹{p.compensationAssessedCr} Cr
                        </div>
                      </td>

                      {/* Possession */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <div className="font-semibold text-slate-800 text-[11px]">
                          {p.possessionPercent}%
                        </div>
                        <div className="text-[10px] text-slate-400">handed over</div>
                      </td>

                      {/* Risk */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        {renderRiskBadge(p.riskLevel)}
                      </td>

                      {/* Status */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        {renderStatusBadge(p.status)}
                      </td>

                      {/* Action */}
                      <td className="px-3 py-2.5 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onSelectProject(p.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-amber-800 hover:text-white bg-amber-50 hover:bg-amber-700 border border-amber-300 hover:border-amber-700 rounded-md transition-all cursor-pointer"
                          title="Open full project details"
                        >
                          <span>View Project</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 select-none">
              <div>
                Showing <strong>{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, sortedProjects.length)}</strong> of <strong>{sortedProjects.length}</strong> projects
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded border text-xs font-semibold ${
                    currentPage === 1
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 cursor-pointer'
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`w-7 h-7 rounded text-xs font-semibold flex items-center justify-center border ${
                      currentPage === pg
                        ? 'bg-[#EA580C] text-white border-[#EA580C]'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 cursor-pointer'
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded border text-xs font-semibold ${
                    currentPage === totalPages
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 cursor-pointer'
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 5. Create / Register Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Register New Land Acquisition Project
                </h2>
                <p className="text-xs text-slate-500">
                  Government Land Acquisition Portal • MoRTH / CWC / MoR
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ludhiana-Chandigarh Greenfield Highway"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full py-2 px-3 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State *</label>
                  <select
                    value={newProject.state}
                    onChange={(e) => {
                      const st = e.target.value;
                      const d = STATE_DISTRICT_MAP[st]?.[0] || '';
                      setNewProject({ ...newProject, state: st, district: d });
                    }}
                    className="w-full py-2 px-2.5 border border-slate-300 rounded-lg text-xs"
                  >
                    {allStates.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">District *</label>
                  <select
                    value={newProject.district}
                    onChange={(e) => setNewProject({ ...newProject, district: e.target.value })}
                    className="w-full py-2 px-2.5 border border-slate-300 rounded-lg text-xs"
                  >
                    {(STATE_DISTRICT_MAP[newProject.state || 'Punjab'] || []).map((dst) => (
                      <option key={dst} value={dst}>
                        {dst}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Project Type</label>
                  <select
                    value={newProject.projectType}
                    onChange={(e) => setNewProject({ ...newProject, projectType: e.target.value as ProjectType })}
                    className="w-full py-2 px-2.5 border border-slate-300 rounded-lg text-xs"
                  >
                    {PROJECT_TYPES.map((pt) => (
                      <option key={pt} value={pt}>
                        {pt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Executing Agency</label>
                  <input
                    type="text"
                    value={newProject.agency}
                    onChange={(e) => setNewProject({ ...newProject, agency: e.target.value })}
                    className="w-full py-2 px-3 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Proposed Land (Ha)</label>
                  <input
                    type="number"
                    min="1"
                    value={newProject.landProposed}
                    onChange={(e) => setNewProject({ ...newProject, landProposed: Number(e.target.value) })}
                    className="w-full py-2 px-3 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Est. Cost (₹ Cr)</label>
                  <input
                    type="number"
                    min="1"
                    value={newProject.estimatedCostCr}
                    onChange={(e) => setNewProject({ ...newProject, estimatedCostCr: Number(e.target.value) })}
                    className="w-full py-2 px-3 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Compensation (₹ Cr)</label>
                  <input
                    type="number"
                    min="0"
                    value={newProject.compensationAssessedCr}
                    onChange={(e) => setNewProject({ ...newProject, compensationAssessedCr: Number(e.target.value) })}
                    className="w-full py-2 px-3 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value as AcquisitionStatus })}
                    className="w-full py-2 px-2.5 border border-slate-300 rounded-lg text-xs"
                  >
                    {ACQUISITION_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Risk Assessment</label>
                  <select
                    value={newProject.riskLevel}
                    onChange={(e) => setNewProject({ ...newProject, riskLevel: e.target.value as RiskLevel })}
                    className="w-full py-2 px-2.5 border border-slate-300 rounded-lg text-xs"
                  >
                    {RISK_LEVELS.map((rl) => (
                      <option key={rl} value={rl}>
                        {rl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#EA580C] hover:bg-[#D97706] rounded-lg cursor-pointer"
                >
                  Register Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
