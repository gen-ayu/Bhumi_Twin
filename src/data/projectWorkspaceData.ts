import { ALL_PROJECTS_DATA, ProjectRecord } from './projectsData';

export interface FieldOfficerRecord {
  id: string;
  name: string;
  designation: string;
  department: string;
  phone: string;
  email: string;
  jurisdiction: string;
  assignedParcels: number;
  verifiedCount: number;
  pendingCount: number;
  lastActivity: string;
  status: 'Active' | 'On Field' | 'In Office' | 'On Leave';
  badgeColor: string;
  recentParcels: string[];
}

export interface ConsentRecord {
  id: string;
  familyHead: string;
  relation: string;
  aadhaarMasked: string;
  parcelId: string;
  surveyNo: string;
  village: string;
  landAreaHa: number;
  compensationClaimCr: number;
  consentStatus: 'Consent Obtained' | 'Pending' | 'Objected' | 'Disputed';
  consentDate: string;
  objectionType?: string;
  objectionSummary?: string;
  documentsVerified: boolean;
  documentsCount: number;
  contactNumber: string;
}

export interface FieldEvidencePhoto {
  id: string;
  parcelId: string;
  surveyNo: string;
  village: string;
  officerName: string;
  officerId: string;
  dateTime: string;
  gpsCoordinates: string;
  evidenceType:
    | 'Pucca Structure'
    | 'Standing Crop'
    | 'Borewell / Tube-well'
    | 'Boundary Encroachment'
    | 'Orchard Trees'
    | 'Drainage / Canal';
  verificationStatus: 'Verified' | 'Discrepancy Found' | 'Under Review';
  imageUrl: string;
  thumbnailUrl: string;
  caption: string;
  notes: string;
}

export interface CriticalParcelRecord {
  id: string;
  surveyNo: string;
  village: string;
  areaHa: number;
  issueType: 'Legal Dispute' | 'Valuation Disparity' | 'Encroachment Alert' | 'Succession Conflict' | 'Satellite Shift';
  riskScore: number;
  riskLevel: 'Critical' | 'High' | 'Medium';
  status: string;
  courtCaseRef?: string;
  compensationGapCr?: number;
  keyConcern: string;
}

export interface ProjectTimelineEvent {
  id: string;
  date: string;
  time: string;
  stage: string;
  title: string;
  description: string;
  actor: string;
  actorDesignation: string;
  eventType:
    | 'survey'
    | 'notification'
    | 'objection'
    | 'declaration'
    | 'award'
    | 'compensation'
    | 'verification'
    | 'consent'
    | 'legal';
  refDocNumber: string;
  hash: string;
  status: 'Verified' | 'Official Gazette' | 'Court Order' | 'PFMS Ack';
}

export interface ProjectWorkspaceData {
  project: ProjectRecord;
  overallStatus: 'On Track' | 'At Risk' | 'Delayed';
  overallRiskScore: number;
  riskConfidence: number;
  lastUpdated: string;
  officers: FieldOfficerRecord[];
  consentSummary: {
    totalFamilies: number;
    consentObtained: number;
    consentPending: number;
    objectionsFiled: number;
    disputedCases: number;
    consentPercentage: number;
  };
  consentRecords: ConsentRecord[];
  evidencePhotos: FieldEvidencePhoto[];
  riskMetrics: {
    totalParcels: number;
    highRiskParcels: number;
    legalDisputes: number;
    compensationIssues: number;
    rnrIssues: number;
    satelliteAlerts: number;
    dataInconsistencies: number;
  };
  criticalParcels: CriticalParcelRecord[];
  activityTimeline: ProjectTimelineEvent[];
}

export function getProjectWorkspaceData(projectId: string): ProjectWorkspaceData {
  const project = ALL_PROJECTS_DATA.find((p) => p.id === projectId) || ALL_PROJECTS_DATA[0];

  // Realistic officers roster
  const officers: FieldOfficerRecord[] = [
    {
      id: 'REV-OFF-4412',
      name: 'Shri S.N. Tripathi',
      designation: 'Revenue Inspector (RI)',
      department: 'Revenue & Land Records Dept',
      phone: '+91 94152 78912',
      email: 'sn.tripathi.rev@up.gov.in',
      jurisdiction: 'Rampur & Babatpur Sector',
      assignedParcels: 48,
      verifiedCount: 42,
      pendingCount: 6,
      lastActivity: 'Today, 10:45 AM (P-204 DGPS verify)',
      status: 'On Field',
      badgeColor: 'text-amber-700 bg-amber-50 border-amber-300',
      recentParcels: ['P-204', 'P-205', 'P-208', 'P-212'],
    },
    {
      id: 'PAT-4109',
      name: 'Smt. Rashmi Patel',
      designation: 'Lekhpal / Patwari',
      department: 'Tehsil Pindra Administrative Circle',
      phone: '+91 98390 12345',
      email: 'rashmi.patel@up.nic.in',
      jurisdiction: 'Shivpur & Harahua Belts',
      assignedParcels: 36,
      verifiedCount: 31,
      pendingCount: 5,
      lastActivity: 'Yesterday, 04:30 PM (Khasra sync)',
      status: 'Active',
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-300',
      recentParcels: ['P-156', 'P-157', 'P-160', 'P-162'],
    },
    {
      id: 'SUR-8831',
      name: 'Er. D.K. Srivastava',
      designation: 'DGPS Lead Surveyor',
      department: 'Survey of India / NHAI GIS Cell',
      phone: '+91 94508 34910',
      email: 'dk.srivastava@nhai.gov.in',
      jurisdiction: 'Corridor Alignment ROW',
      assignedParcels: 42,
      verifiedCount: 38,
      pendingCount: 4,
      lastActivity: 'Today, 08:15 AM (Drone Orthophoto)',
      status: 'On Field',
      badgeColor: 'text-blue-700 bg-blue-50 border-blue-300',
      recentParcels: ['P-077', 'P-078', 'P-082', 'P-095'],
    },
    {
      id: 'RNR-1044',
      name: 'Shri Anand Verma',
      designation: 'R&R Field Officer',
      department: 'Resettlement & Rehabilitation Directorate',
      phone: '+91 94155 67210',
      email: 'anand.verma@rnr.up.gov.in',
      jurisdiction: 'Babatpur R&R Cluster Sector 4',
      assignedParcels: 22,
      verifiedCount: 19,
      pendingCount: 3,
      lastActivity: '08 Sep 2026, 03:20 PM (PAP counseling)',
      status: 'In Office',
      badgeColor: 'text-purple-700 bg-purple-50 border-purple-300',
      recentParcels: ['P-204', 'P-206', 'P-077'],
    },
  ];

  // People Consent and Objections sample records
  const consentRecords: ConsentRecord[] = [
    {
      id: 'PAP-2026-001',
      familyHead: 'Ramprasad Bind (Co-Sharer)',
      relation: 'S/o Late Mangal Bind',
      aadhaarMasked: 'XXXX-XXXX-4812',
      parcelId: 'P-204',
      surveyNo: '412/3B',
      village: 'Rampur',
      landAreaHa: 2.45,
      compensationClaimCr: 2.40,
      consentStatus: 'Disputed',
      consentDate: 'Contested (18 Jul 2026)',
      objectionType: 'Partition Suit & Circle Rate Dispute',
      objectionSummary: 'Demands commercial valuation and exclusion of tube-well compensation escrow.',
      documentsVerified: false,
      documentsCount: 4,
      contactNumber: '+91 98391 •••••',
    },
    {
      id: 'PAP-2026-002',
      familyHead: 'Kallu Bind (Co-Sharer)',
      relation: 'S/o Late Mangal Bind',
      aadhaarMasked: 'XXXX-XXXX-7109',
      parcelId: 'P-204',
      surveyNo: '412/3B',
      village: 'Rampur',
      landAreaHa: 0.61,
      compensationClaimCr: 0.46,
      consentStatus: 'Pending',
      consentDate: 'Under Review',
      objectionType: 'Apportionment Agreement',
      objectionSummary: 'Willing to consent if sub-court partition settlement is recorded.',
      documentsVerified: true,
      documentsCount: 6,
      contactNumber: '+91 94152 •••••',
    },
    {
      id: 'PAP-2026-003',
      familyHead: 'Gita Devi',
      relation: 'W/o Late Parasnath Patel',
      aadhaarMasked: 'XXXX-XXXX-9901',
      parcelId: 'P-156',
      surveyNo: '330/1',
      village: 'Shivpur',
      landAreaHa: 1.15,
      compensationClaimCr: 0.95,
      consentStatus: 'Consent Obtained',
      consentDate: '12 May 2026',
      objectionType: 'None (Full Consent)',
      objectionSummary: 'Accepted statutory circle rate + 100% solatium compensation in full.',
      documentsVerified: true,
      documentsCount: 8,
      contactNumber: '+91 94522 •••••',
    },
    {
      id: 'PAP-2026-004',
      familyHead: 'Mohd. Rafiq Ansari',
      relation: 'S/o Late Noor Mohammed',
      aadhaarMasked: 'XXXX-XXXX-3341',
      parcelId: 'P-206',
      surveyNo: '414/2',
      village: 'Shivpur',
      landAreaHa: 3.12,
      compensationClaimCr: 4.10,
      consentStatus: 'Objected',
      consentDate: 'Objection filed (04 Jun 2026)',
      objectionType: 'Section 15 Commercial Structure Valuation',
      objectionSummary: 'Filed Section 15 objection claiming commercial godown compensation on agricultural khatian.',
      documentsVerified: true,
      documentsCount: 5,
      contactNumber: '+91 98380 •••••',
    },
    {
      id: 'PAP-2026-005',
      familyHead: 'Badri Narayan Mishra',
      relation: 'S/o Pandit K.N. Mishra',
      aadhaarMasked: 'XXXX-XXXX-8820',
      parcelId: 'P-077',
      surveyNo: '109/2',
      village: 'Babatpur',
      landAreaHa: 2.90,
      compensationClaimCr: 2.15,
      consentStatus: 'Consent Obtained',
      consentDate: '28 Apr 2026',
      objectionType: 'None (Consent Form A-1)',
      objectionSummary: 'Enrolled in Babatpur R&R Cluster Sector 4 scheme; 1st installment released.',
      documentsVerified: true,
      documentsCount: 9,
      contactNumber: '+91 94511 •••••',
    },
    {
      id: 'PAP-2026-006',
      familyHead: 'Durgawati Devi',
      relation: 'W/o Late Shivpujan Bind',
      aadhaarMasked: 'XXXX-XXXX-1522',
      parcelId: 'P-204',
      surveyNo: '412/3B',
      village: 'Rampur',
      landAreaHa: 0.61,
      compensationClaimCr: 0.46,
      consentStatus: 'Disputed',
      consentDate: 'Notice Sent (02 Aug 2026)',
      objectionType: 'Succession Certificate Contest',
      objectionSummary: 'Claimed widow succession rights; bank account linking pending.',
      documentsVerified: false,
      documentsCount: 3,
      contactNumber: '+91 87654 •••••',
    },
    {
      id: 'PAP-2026-007',
      familyHead: 'Harishchandra Yadav',
      relation: 'S/o Dinanath Yadav',
      aadhaarMasked: 'XXXX-XXXX-6619',
      parcelId: 'P-215',
      surveyNo: '422/1',
      village: 'Harahua',
      landAreaHa: 1.40,
      compensationClaimCr: 1.10,
      consentStatus: 'Pending',
      consentDate: 'Awaiting Bank Aadhaar e-KYC',
      objectionType: 'Pending Verification',
      objectionSummary: 'Agreed in Gram Sabha meeting; physical biometric validation scheduled.',
      documentsVerified: true,
      documentsCount: 4,
      contactNumber: '+91 94158 •••••',
    },
    {
      id: 'PAP-2026-008',
      familyHead: 'Smt. Shanti Devi',
      relation: 'W/o Late Bachchu Lal',
      aadhaarMasked: 'XXXX-XXXX-4002',
      parcelId: 'P-228',
      surveyNo: '445/2A',
      village: 'Rampur',
      landAreaHa: 1.85,
      compensationClaimCr: 1.55,
      consentStatus: 'Consent Obtained',
      consentDate: '19 Jun 2026',
      objectionType: 'None (Consent Form A-1)',
      objectionSummary: 'Direct Benefit Transfer (DBT) token authorized; registry endorsement complete.',
      documentsVerified: true,
      documentsCount: 7,
      contactNumber: '+91 98394 •••••',
    },
  ];

  // Realistic photographic field evidence gallery
  const evidencePhotos: FieldEvidencePhoto[] = [
    {
      id: 'EVD-901',
      parcelId: 'P-204',
      surveyNo: '412/3B',
      village: 'Rampur',
      officerName: 'Shri S.N. Tripathi (RI)',
      officerId: 'REV-OFF-4412',
      dateTime: '09 Sep 2026, 10:18 AM',
      gpsCoordinates: '25.3418° N, 82.9412° E (±1.4m RTK)',
      evidenceType: 'Boundary Encroachment',
      verificationStatus: 'Discrepancy Found',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1000&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=400&q=80',
      caption: 'Unrecorded 1.2m brick boundary foundation erected along Northern alignment boundary.',
      notes: 'Foundation wall built post-Section 11 notification without revenue approval. Flagged for surveyor survey reconciliation.',
    },
    {
      id: 'EVD-902',
      parcelId: 'P-204',
      surveyNo: '412/3B',
      village: 'Rampur',
      officerName: 'Shri S.N. Tripathi (RI)',
      officerId: 'REV-OFF-4412',
      dateTime: '09 Sep 2026, 10:24 AM',
      gpsCoordinates: '25.3419° N, 82.9414° E (±1.8m RTK)',
      evidenceType: 'Borewell / Tube-well',
      verificationStatus: 'Discrepancy Found',
      imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1000&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
      caption: 'Submersible tube-well piping and pump-house located on disputed parcel sector.',
      notes: 'Owner claims private installation cost of ₹2.80 Lakhs. Discrepancy logged vs original Joint Measurement Survey baseline.',
    },
    {
      id: 'EVD-903',
      parcelId: 'P-156',
      surveyNo: '330/1',
      village: 'Shivpur',
      officerName: 'Smt. Rashmi Patel (Patwari)',
      officerId: 'PAT-4109',
      dateTime: '07 Sep 2026, 03:15 PM',
      gpsCoordinates: '25.3582° N, 82.9610° E (±1.1m RTK)',
      evidenceType: 'Standing Crop',
      verificationStatus: 'Verified',
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80',
      caption: 'Kharif paddy crop enumerated under Joint Agricultural Survey.',
      notes: 'Standing paddy crop estimated at 85 quintals yield. Crop damage compensation entitlement calculated per State Agriculture rate.',
    },
    {
      id: 'EVD-904',
      parcelId: 'P-077',
      surveyNo: '109/2',
      village: 'Babatpur',
      officerName: 'Er. D.K. Srivastava (Lead Surveyor)',
      officerId: 'SUR-8831',
      dateTime: '05 Sep 2026, 09:40 AM',
      gpsCoordinates: '25.4410° N, 82.8590° E (±0.8m RTK)',
      evidenceType: 'Boundary Encroachment',
      verificationStatus: 'Verified',
      imageUrl: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1000&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=400&q=80',
      caption: 'DGPS stone boundary pillar #VRN-P077-B marked along ROW perimeter.',
      notes: 'Cadastral corners cross-referenced with Bhoomi Naksha vector polygons. 100% boundary alignment validated.',
    },
    {
      id: 'EVD-905',
      parcelId: 'P-206',
      surveyNo: '414/2',
      village: 'Shivpur',
      officerName: 'Smt. Rashmi Patel (Patwari)',
      officerId: 'PAT-4109',
      dateTime: '03 Sep 2026, 11:30 AM',
      gpsCoordinates: '25.3615° N, 82.9642° E (±1.5m RTK)',
      evidenceType: 'Pucca Structure',
      verificationStatus: 'Under Review',
      imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=400&q=80',
      caption: 'Commercial godown shed roof and RCC columns on highway frontage.',
      notes: 'PWD valuation team deputed for assessment. Building approved as agricultural store in 2021; commercial use claimed.',
    },
    {
      id: 'EVD-906',
      parcelId: 'P-112',
      surveyNo: '240/1',
      village: 'Harahua',
      officerName: 'Er. D.K. Srivastava (Lead Surveyor)',
      officerId: 'SUR-8831',
      dateTime: '01 Sep 2026, 02:45 PM',
      gpsCoordinates: '25.3890° N, 82.9125° E (±1.2m RTK)',
      evidenceType: 'Drainage / Canal',
      verificationStatus: 'Verified',
      imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80',
      caption: 'Minor irrigation canal crossing needing culvert design integration.',
      notes: 'State Irrigation Dept NOC received; no diversion of natural wetland drainage channel required.',
    },
    {
      id: 'EVD-907',
      parcelId: 'P-204',
      surveyNo: '412/3B',
      village: 'Rampur',
      officerName: 'Shri S.N. Tripathi (RI)',
      officerId: 'REV-OFF-4412',
      dateTime: '28 Aug 2026, 04:10 PM',
      gpsCoordinates: '25.3421° N, 82.9416° E (±1.5m RTK)',
      evidenceType: 'Orchard Trees',
      verificationStatus: 'Verified',
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80',
      caption: 'Horticulture enumeration of 24 mature mango & guava trees.',
      notes: 'Enumeration tags affixed. District Horticulture Officer assessment attached to compensation schedule.',
    },
    {
      id: 'EVD-908',
      parcelId: 'P-228',
      surveyNo: '445/2A',
      village: 'Rampur',
      officerName: 'Shri S.N. Tripathi (RI)',
      officerId: 'REV-OFF-4412',
      dateTime: '25 Aug 2026, 12:15 PM',
      gpsCoordinates: '25.3450° N, 82.9430° E (±1.0m RTK)',
      evidenceType: 'Standing Crop',
      verificationStatus: 'Verified',
      imageUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1000&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=400&q=80',
      caption: 'Agricultural plot verified clear of encroachment; ready for possession.',
      notes: 'Owner confirmed receipt of award intimation; harvesting scheduled within 15 days.',
    },
  ];

  // Critical/High-Risk parcels
  const criticalParcels: CriticalParcelRecord[] = [
    {
      id: 'P-204',
      surveyNo: '412/3B',
      village: 'Rampur',
      areaHa: 2.45,
      issueType: 'Legal Dispute',
      riskScore: 78,
      riskLevel: 'Critical',
      status: 'Escrow Determination',
      courtCaseRef: 'WP(C)/2026/0891 (Civil Judge Sr Div)',
      compensationGapCr: 0.55,
      keyConcern: 'Active 3-way partition suit; demanded ₹2.40 Cr vs award ₹1.85 Cr; unrecorded masonry boundary.',
    },
    {
      id: 'P-206',
      surveyNo: '414/2',
      village: 'Shivpur',
      areaHa: 3.12,
      issueType: 'Valuation Disparity',
      riskScore: 71,
      riskLevel: 'Critical',
      status: 'Sec 15 Objections',
      courtCaseRef: 'CALA/REV/2026/104',
      compensationGapCr: 0.85,
      keyConcern: 'Commercial warehouse valuation claimed on agricultural khatian record; re-inspection ordered.',
    },
    {
      id: 'P-112',
      surveyNo: '240/1',
      village: 'Harahua',
      areaHa: 4.80,
      issueType: 'Encroachment Alert',
      riskScore: 68,
      riskLevel: 'High',
      status: 'Demarcation Pending',
      courtCaseRef: 'N/A (Revenue Circle)',
      compensationGapCr: 0.20,
      keyConcern: 'Canal buffer zone overlap; temporary tin sheds erected post-notification.',
    },
    {
      id: 'P-231',
      surveyNo: '450/3',
      village: 'Rampur',
      areaHa: 1.95,
      issueType: 'Succession Conflict',
      riskScore: 64,
      riskLevel: 'High',
      status: 'Heirship Scrutiny',
      courtCaseRef: 'Tehsil Succession Rev/412',
      compensationGapCr: 0.35,
      keyConcern: 'Deceased owner with 4 heirs in separate states; Aadhaar e-KYC mismatch.',
    },
    {
      id: 'P-095',
      surveyNo: '138/4',
      village: 'Babatpur',
      areaHa: 2.10,
      issueType: 'Satellite Shift',
      riskScore: 62,
      riskLevel: 'High',
      status: 'Ground Verification',
      courtCaseRef: 'Sentinel-2 Alert #SAT-882',
      compensationGapCr: 0.15,
      keyConcern: 'Recent earth excavation detected by Sentinel-2 change detection algorithm.',
    },
  ];

  // Statutory activity timeline
  const activityTimeline: ProjectTimelineEvent[] = [
    {
      id: 'EVT-9104',
      date: '09 Sep 2026',
      time: '10:45 IST',
      stage: 'Field Verification',
      title: 'DGPS Field Inspection Completed for Parcel #P-204',
      description: 'Shri S.N. Tripathi logged structural discrepancy regarding newly erected 1.2m masonry foundation and tube-well installation.',
      actor: 'Shri S.N. Tripathi',
      actorDesignation: 'Revenue Inspector (Harahua Circle)',
      eventType: 'verification',
      refDocNumber: 'INSP/VRN/2026/09/204',
      hash: 'SHA256: 4f88e2...a901c',
      status: 'Verified',
    },
    {
      id: 'EVT-9103',
      date: '07 Sep 2026',
      time: '14:20 IST',
      stage: 'Consent Update',
      title: 'Consent Dossier Accepted for 14 Parcels in Shivpur',
      description: 'Village Shivpur farmers submitted voluntary consent under Form A-1. Compensation calculated at circle rate + 100% solatium.',
      actor: 'District Land Acquisition Office',
      actorDesignation: 'Competent Authority (CALA)',
      eventType: 'consent',
      refDocNumber: 'CONSENT/SHV/BATCH-04',
      hash: 'SHA256: 8a11bc...43fe1',
      status: 'Official Gazette',
    },
    {
      id: 'EVT-9102',
      date: '02 Sep 2026',
      time: '16:00 IST',
      stage: 'Legal Case Update',
      title: 'High Court Notice Served on WP(C)/2026/0891 (Rampur)',
      description: 'District Government Counsel instructed to submit counter-affidavit defending Section 11 gazette baseline and compensation escrow deposit.',
      actor: 'District Civil Court Desk',
      actorDesignation: 'Standing Counsel, NHAI',
      eventType: 'legal',
      refDocNumber: 'WP(C)/2026/0891',
      hash: 'SHA256: 7d42ea...b8192',
      status: 'Court Order',
    },
    {
      id: 'EVT-9101',
      date: '28 Aug 2026',
      time: '11:30 IST',
      stage: 'Compensation Disbursal',
      title: 'Direct Benefit Transfer (DBT) Tranche of ₹14.80 Cr Processed',
      description: 'PFMS automated payment gateway credited 76 PAP beneficiary accounts across Babatpur and Harahua villages.',
      actor: 'Ministry Finance PFMS Portal',
      actorDesignation: 'Automated Payment Gateway',
      eventType: 'compensation',
      refDocNumber: 'PFMS/2026/BATCH-199',
      hash: 'SHA256: 3c90e4...f1107',
      status: 'PFMS Ack',
    },
    {
      id: 'EVT-9100',
      date: '15 Jul 2026',
      time: '10:00 IST',
      stage: 'Award Declaration',
      title: 'Section 19 Final Award Sanctioned by District Collector',
      description: 'Detailed compensation awards announced for 84 revenue parcels. Total sanctioned award ₹84.20 Crores under RFCTLARR 2013.',
      actor: 'Shri Arvind K. Mishra, IAS',
      actorDesignation: 'District Collector & Magistrate',
      eventType: 'award',
      refDocNumber: 'GAZ/UP/2026/SEC19-09',
      hash: 'SHA256: 1f54ab...90234',
      status: 'Official Gazette',
    },
    {
      id: 'EVT-9099',
      date: '24 May 2026',
      time: '15:30 IST',
      stage: 'Objection Hearing',
      title: 'Section 15 Public Hearing of Objections Concluded',
      description: 'Competent Authority heard 48 objections across 4 villages. 34 claims amicably settled; 14 referred to valuation committee.',
      actor: 'CALA Hearing Tribunal',
      actorDesignation: 'Sub-Divisional Magistrate (Pindra)',
      eventType: 'objection',
      refDocNumber: 'SEC15/HEARING/MINUTES-03',
      hash: 'SHA256: 9b20ca...ee712',
      status: 'Verified',
    },
    {
      id: 'EVT-9098',
      date: '14 Feb 2026',
      time: '09:00 IST',
      stage: 'Notification Issued',
      title: 'Section 11 Preliminary Notification Published in State Gazette',
      description: 'Official notification published in UP Extraordinary Gazette and two daily vernacular newspapers specifying 342.8 Hectares for acquisition.',
      actor: 'Principal Secretary (Revenue)',
      actorDesignation: 'Government of Uttar Pradesh',
      eventType: 'notification',
      refDocNumber: 'GAZ/2026/NOTIF-11/VRN',
      hash: 'SHA256: 6a88ff...00123',
      status: 'Official Gazette',
    },
    {
      id: 'EVT-9097',
      date: '10 Jan 2026',
      time: '17:00 IST',
      stage: 'Joint Survey Completed',
      title: 'Joint Measurement Survey (JMS) Signed by Revenue & NHAI',
      description: 'Cadastral boundary mapping, tree enumeration, and structure geo-tagging completed across 148 parcels along NH-31 Bypass alignment.',
      actor: 'Joint Survey Committee',
      actorDesignation: 'NHAI Project Director & CALA Varanasi',
      eventType: 'survey',
      refDocNumber: 'JMS/REPORT/FINAL-01',
      hash: 'SHA256: 2d19ef...44521',
      status: 'Verified',
    },
  ];

  // Calculate dynamic consent numbers matching the project's PAP scale
  const totalFamilies = project.affectedFamilies || 412;
  const consentObtained = Math.round(totalFamilies * 0.689);
  const consentPending = Math.round(totalFamilies * 0.184);
  const objectionsFiled = Math.round(totalFamilies * 0.092);
  const disputedCases = totalFamilies - consentObtained - consentPending - objectionsFiled;
  const consentPercentage = +( (consentObtained / totalFamilies) * 100 ).toFixed(1);

  // Overall status
  const overallStatus: 'On Track' | 'At Risk' | 'Delayed' =
    project.riskLevel === 'Critical' || project.status === 'Delayed'
      ? 'Delayed'
      : project.riskLevel === 'High'
      ? 'At Risk'
      : 'On Track';

  const overallRiskScore =
    project.riskLevel === 'Critical' ? 84 : project.riskLevel === 'High' ? 74 : project.riskLevel === 'Medium' ? 48 : 22;

  return {
    project,
    overallStatus,
    overallRiskScore,
    riskConfidence: 91,
    lastUpdated: '10 Sep 2026, 09:30 IST',
    officers,
    consentSummary: {
      totalFamilies,
      consentObtained,
      consentPending,
      objectionsFiled,
      disputedCases,
      consentPercentage,
    },
    consentRecords,
    evidencePhotos,
    riskMetrics: {
      totalParcels: 148,
      highRiskParcels: 18,
      legalDisputes: 9,
      compensationIssues: 12,
      rnrIssues: 7,
      satelliteAlerts: 5,
      dataInconsistencies: 6,
    },
    criticalParcels,
    activityTimeline,
  };
}
