export type UserRole = 'admin' | 'officer' | 'citizen';

export type RiskLevel = 'low' | 'attention' | 'critical';

export interface RiskFactor {
  category: 'Ownership' | 'Compensation' | 'R&R' | 'Legal' | 'Environmental' | 'Social' | 'Delay';
  score: number; // 0-100
  weight: number;
  description: string;
}

export interface LandOwner {
  id: string;
  name: string;
  relation: string;
  sharePercent: number;
  aadhaarStatus: 'Verified' | 'Pending' | 'Flagged';
  phone: string;
  bankAccountLinked: boolean;
  category: 'General' | 'OBC' | 'SC' | 'ST';
}

export interface Parcel {
  id: string; // e.g. "P-204"
  ulpin: string; // Unique Land Parcel Identification Number
  surveyNumber: string;
  village: string;
  block: string;
  district: string;
  areaHectares: number;
  landType: 'Agricultural' | 'Residential' | 'Commercial' | 'Orchard / Agro' | 'Forest / Wetland';
  currentStage: AcquisitionStage;
  stageProgressPercent: number;
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  riskConfidence: number; // e.g. 88
  riskSummary: string;
  riskFactors: RiskFactor[];
  owners: LandOwner[];
  affectedFamilyCount: number;
  compensation: {
    estimatedAmountCr: number;
    awardedAmountCr: number;
    paidAmountCr: number;
    pendingAmountCr: number;
    solatiumPercent: number;
    status: 'Assessment' | 'Award Declared' | 'Partial Disbursed' | 'Disbursed' | 'In Escrow Dispute';
  };
  rrStatus: {
    eligible: boolean;
    housingAllotted: 'Allotted' | 'Pending' | 'Not Applicable';
    resettlementSite: string;
    subsistenceGrantPaid: boolean;
    livelihoodSkillEnrolled: boolean;
    notes: string;
  };
  legalCase?: {
    caseNumber: string;
    court: string;
    petitioner: string;
    issue: string;
    status: 'Open Injunction' | 'Under Hearing' | 'Stay Vacated' | 'Disposed';
    nextHearingDate: string;
  };
  satelliteAlert?: {
    flagged: boolean;
    alertDate: string;
    changeType: 'New Structure' | 'Earth Excavation' | 'Tree Clearing';
    confidence: number;
    status: 'Pending Field Check' | 'Verified Changed' | 'False Positive';
  };
  lastFieldVerification?: {
    date: string;
    officer: string;
    status: 'Verified' | 'Discrepancy Found' | 'Pending Inspection';
    notes: string;
    gpsCoordinates: string;
  };
  timeline: {
    date: string;
    stage: string;
    description: string;
    officer: string;
  }[];
  coordinates: [number, number][]; // SVG polygon points [x, y]
}

export type AcquisitionStage =
  | 'Proposal & Feasibility'
  | 'Joint Measurement Survey'
  | 'Sec 11 Preliminary Notification'
  | 'Sec 15 Hearing of Objections'
  | 'Sec 19 Declaration of Acquisition'
  | 'Compensation Determination'
  | 'R&R Package Disbursement'
  | 'Physical Possession & Handover';

export interface ProjectSummary {
  id: string;
  name: string;
  nameHindi: string;
  code: string;
  district: string;
  state: string;
  totalLengthKm: number;
  totalParcels: number;
  totalAffectedFamilies: number;
  totalAreaHectares: number;
  estimatedCostCr: number;
  disbursedCostCr: number;
  projectHealthScore: number; // 0-100
  targetCompletion: string;
  predictedDelayMonths: number;
  nodalOfficer: string;
  executiveAgency: string;
}

export interface CorridorOption {
  id: 'option-a' | 'option-b';
  name: string;
  tagline: string;
  alignmentDescription: string;
  totalLengthKm: number;
  affectedParcelsCount: number;
  affectedFamiliesCount: number;
  totalCostCr: number;
  highRiskParcelsCount: number;
  rrDisplacementRisk: 'Low' | 'Moderate' | 'High';
  legalInjunctionRisk: 'Low' | 'Moderate' | 'High';
  environmentalRisk: 'Low' | 'Moderate' | 'High';
  predictedDelayMonths: number;
  feasibilityScore: number;
  color: string;
  pathCoordinates: string; // SVG path data
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  type: 'satellite' | 'legal' | 'compensation' | 'delay' | 'verification';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'info';
  parcelId?: string;
  actionLabel?: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  designation: string;
  action: string;
  target: string;
  oldValue: string;
  newValue: string;
  hash: string;
}
