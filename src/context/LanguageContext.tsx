import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (enText: string, customHi?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Comprehensive Government of India bilingual terminology dictionary (English <-> Hindi)
export const DICTIONARY: Record<string, string> = {
  // Navigation & Brand
  'BHUMI-TWIN': 'भूमि-ट्विन',
  'Government of India • Ministry of Rural Development': 'भारत सरकार • ग्रामीण विकास मंत्रालय',
  'GOVERNMENT OF INDIA • Ministry of Rural Development': 'भारत सरकार • ग्रामीण विकास मंत्रालय',
  'Decision-Intelligence Digital Twin': 'निर्णय-बुद्धिमत्ता डिजिटल ट्विन',
  'Version 1.0.0 SIH': 'संस्करण 1.0.0 SIH',
  '1.0.0 SIH': '1.0.0 SIH',
  'Dashboard': 'डैशबोर्ड',
  'GIS Map': 'जीआईएस मानचित्र',
  'Digital Twin': 'डिजिटल ट्विन',
  'What-If Simulator': 'सिमुलेटर',
  'Satellite Alerts': 'उपग्रह अलर्ट',
  'Field Verification': 'क्षेत्र सत्यापन',
  'Citizen Portal': 'नागरिक पोर्टल',
  'Audit Log': 'ऑडिट लॉग',
  'Search...': 'खोजें...',
  'Search': 'खोजें',
  'Quick Search (Ctrl+K / ⌘K)': 'त्वरित खोज (Ctrl+K / ⌘K)',
  'All Criteria': 'सभी प्रकार',
  'Project ID': 'परियोजना आईडी',
  'Parcel ID': 'पार्सल आईडी',
  'Survey No.': 'खसरा / सर्वे संख्या',
  'District': 'जिला',
  'Village': 'गांव',
  'Landmark': 'स्थान / लैंडमार्क',
  'Notifications & Alerts': 'सूचनाएं एवं अलर्ट',
  'Notifications': 'सूचनाएं',
  'Mark all read': 'सभी पढ़ा हुआ चिन्हित करें',
  'View Full System Audit Log →': 'सभी सिस्टम ऑडिट लॉग देखें →',
  'Inspect Alert': 'अलर्ट जांचें',
  'Inspect Alert →': 'अलर्ट जांचें →',
  'View Case': 'केस देखें',
  'View Case →': 'केस देखें →',
  'View Voucher': 'वाउचर देखें',
  'View Voucher →': 'वाउचर देखें →',
  'View Milestone': 'मील का पत्थर देखें',
  'View Report': 'रिपोर्ट देखें',
  'English (EN)': 'English (EN)',
  'हिन्दी (HI)': 'हिन्दी (HI)',
  'Switch Language / भाषा बदलें': 'भाषा बदलें / Switch Language',

  // Roles
  'District Collectorate': 'जिला समाहर्ता (कलेक्टर)',
  'District Collectorate (Admin)': 'जिला समाहर्ता (प्रशासक)',
  'Revenue Officer': 'राजस्व अधिकारी',
  'Kisan Beneficiary': 'किसान लाभार्थी',
  'Citizen': 'नागरिक',
  'Officer': 'अधिकारी',
  'Admin': 'प्रशासक',
  'Session': 'सत्र',
  'Active Session': 'सक्रिय सत्र',

  // National Land Acquisition Overview
  'National Land Acquisition Overview': 'राष्ट्रीय भूमि अधिग्रहण समग्र अवलोकन',
  'NATIONAL LAND ACQUISITION OVERVIEW': 'राष्ट्रीय भूमि अधिग्रहण समग्र अवलोकन',
  'Real-time monitoring across projects, states and districts': 'परियोजनाओं, राज्यों एवं जिलों का वास्तविक समय में राष्ट्रीय प्रशासनिक अनुश्रवण',
  'Last Updated: 10 Sep 2026, 01:40 PM': 'अंतिम अद्यतन: 10 सितंबर 2026, 01:40 अपराह्न',
  'Active Projects': 'सक्रिय परियोजनाएं',
  'Land Proposed': 'प्रस्तावित भूमि',
  'Land Acquired': 'अधिग्रहीत भूमि',
  'Compensation Assessed': 'आकलित मुआवजा',
  'Comp. Assessed': 'आकलित मुआवजा',
  'Compensation Disbursed': 'संवितरित मुआवजा',
  'Comp. Disbursed': 'संवितरित मुआवजा',
  'Possession Completed': 'पूर्ण भौतिक कब्जा',
  'Possession': 'कब्जा',
  'Acquisition Status Distribution': 'भूमि अधिग्रहण स्थिति वर्गीकरण',
  'Key Bottlenecks': 'प्रमुख प्रशासनिक गतिरोध',
  'State-Wise Acquisition Status': 'राज्यवार भूमि अधिग्रहण स्थिति',
  'National Spatial Overview': 'राष्ट्रीय स्थानिक अवलोकन',
  'Acquisition Performance': 'भूमि अधिग्रहण निष्पादन एवं समयसीमा',
  'Requires Immediate Attention': 'तत्काल प्रशासनिक ध्यान अपेक्षित',
  'BHUMI-TWIN Intelligence': 'भूमि-ट्विन निर्णय बुद्धिमत्ता',
  'Recent System Activity': 'हालिया राष्ट्रीय प्रशासनिक गतिविधि',
  'View Complete Audit Trail →': 'सम्पूर्ण ऑडिट ट्रेल देखें →',
  'View All States  →': 'सभी राज्य देखें →',
  'Open GIS Map →': 'जीआईएस मानचित्र खोलें →',
  'On Track': 'समय पर',
  'At Risk': 'जोखिम में',
  'Delayed': 'विलंबित',
  'Projects': 'परियोजनाएं',
  'State': 'राज्य',
  'States': 'राज्य',
  'Acquired %': 'अधिग्रहीत %',
  'Affected Fam.': 'प्रभावित परिवार',
  'Comp. Paid': 'मुआवजा',
  'R&R %': 'पुनर्वास %',

  // Project Banner & KPIs
  'Active Project #01': 'सक्रिय परियोजना #01',
  'Varanasi Ring Road & Logistics Corridor (Pkg 3B)': 'वाराणसी रिंग रोड एवं लॉजिस्टिक्स कॉरिडोर (पैकेज 3बी)',
  'Nodal Authority': 'नोडल प्राधिकारी',
  'Length': 'लंबाई',
  'Target Possession': 'लक्षित कब्जा',
  'Open GIS Spatial Map': 'जीआईएस स्थानिक मानचित्र खोलें',
  'What-If Corridor Simulator': 'वॉट-इफ कॉरिडोर सिमुलेटर',
  'Total Parcels': 'कुल पार्सल',
  'Across 4 Revenue Villages': '4 राजस्व गांवों में विस्तृत',
  'Affected Families': 'प्रभावित परिवार',
  '344 Landowners + 68 Tenants': '344 भूमि स्वामी + 68 काश्तकार',
  'High-Risk Parcels': 'उच्च जोखिम पार्सल',
  'Click to inspect on map': 'मानचित्र पर निरीक्षण हेतु क्लिक करें',
  'Pending Compensation': 'लंबित मुआवजा',
  'already disbursed': 'पहले ही संवितरित',
  'Pending R&R': 'लंबित पुनर्वास एवं पुनर्व्यवस्थापन',
  'Resettlement site in Babatpur Sector 4': 'बाबतपुर सेक्टर 4 में पुनर्वास स्थल',
  'Legal Injunctions': 'कानूनी वाद / स्थगन',
  'District Court & High Court writs': 'जिला व उच्च न्यायालय याचिकाएं',
  'Predicted Delay': 'अनुमानित विलंब',
  'Mitigated to +1.2 Mo with Option B': 'विकल्प बी अपनाने पर +1.2 माह तक सीमित',
  'Satellite Alert Flag': 'उपग्रह अलर्ट फ्लैग',
  '1 NEW': '1 नया',
  'Earthwork on #PARCEL-001': 'पार्सल #PARCEL-001 पर निर्माण कार्य',
  'Flag': 'फ्लैग',

  // Health Gauge & Bottlenecks
  'Overall Project Health Index': 'समग्र परियोजना स्वास्थ्य सूचकांक',
  'Attention Required (40–69)': 'ध्यान अपेक्षित (40–69)',
  'Attention Required': 'ध्यान अपेक्षित',
  'Healthy & On Track': 'संतोषजनक व समय पर',
  'Critical Risk': 'गंभीर जोखिम',
  'Score / 100': 'स्कोर / 100',
  'Moderate Bottlenecks': 'मध्यम गतिरोध',
  'Based on composite cadastral velocity, court injunction volume, DBT payment rate, and forest clearance timeline.':
    'संयुक्त कैडस्ट्रल गति, न्यायालय स्थगन संख्या, डीबीटी भुगतान दर और वन मंजूरी समयसीमा पर आधारित।',
  'Cadastral Risk Classification Distribution': 'कैडस्ट्रल जोखिम वर्गीकरण वितरण',
  'Cadastral Risk Breakdown': 'कैडस्ट्रल जोखिम विवरण',
  '148 Total Parcels': '148 कुल पार्सल',
  'Low Risk (0–39) — Clear Title & Flow': 'कम जोखिम (0–39) — स्पष्ट स्वामित्व व निर्बाध',
  'Attention (40–69) — Verification / R&R': 'ध्यानार्थ (40–69) — सत्यापन / पुनर्वास लंबित',
  'Critical (70–100) — Injunctions / Disputes': 'गंभीर (70–100) — अदालती स्थगन / विवाद',
  'Highlight high risks on GIS:': 'जीआईएस पर उच्च जोखिम प्रदर्शित करें:',
  'Filter Critical Parcels': 'गंभीर पार्सल फ़िल्टर करें',

  // Urgent Bottleneck Dossier (PARCEL-001)
  'URGENT BOTTLENECK': 'अति आवश्यक गतिरोध',
  'Urgent Bottleneck': 'अति आवश्यक गतिरोध',
  'Parcel #PARCEL-001 (Survey No. 412/3B)': 'पार्सल #PARCEL-001 (खसरा संख्या 412/3B)',
  'Risk Level: Critical (Score 78/100)': 'जोखिम स्तर: गंभीर (स्कोर 78/100)',
  'Location': 'स्थान',
  'Village Rampur, Kashi Block': 'गांव रामपुर, काशी ब्लॉक',
  'Primary Conflict': 'मुख्य विवाद',
  'Title Partition & Court Writ': 'स्वामित्व विभाजन एवं अदालती याचिका',
  'Award Escrow': 'अधिनिर्णय एस्क्रो',
  '₹1.85 Cr Pending': '₹1.85 करोड़ लंबित',
  'Decision Support Assessment: ': 'निर्णय समर्थन मूल्यांकन: ',
  'Decision Support Assessment': 'निर्णय समर्थन मूल्यांकन',
  'Active partition dispute between 3 coparceners in District Civil Court; hearing set for 24 Sep. Sentinel-2 pass detected recent unapproved brick structure. Poses immediate 6-month critical path delay to Corridor Option A.':
    'जिला सिविल कोर्ट में 3 सह-स्वामियों के बीच सक्रिय विभाजन विवाद; सुनवाई 24 सितंबर को निर्धारित। सेंटिनल-2 उपग्रह ने हालिया अनाधिकृत ईंट निर्माण की पहचान की है। यह कॉरिडोर विकल्प ए के लिए 6 महीने का तत्काल गंभीर विलंब उत्पन्न करता है।',
  'Inspect Digital Twin & Risk Factors': 'डिजिटल ट्विन व जोखिम कारक जांचें',
  'View Satellite Alert': 'उपग्रह अलर्ट देखें',
  'Model Confidence: 89%': 'मॉडल विश्वसनीयता: 89%',

  // Decision Feed
  'Recent Decision-Intelligence Alerts': 'हालिया निर्णय-बुद्धिमत्ता अलर्ट',
  'Live Feed': 'लाइव फ़ीड',
  'New High-Confidence Encroachment': 'नई उच्च-विश्वसनीयता अतिक्रमण पहचान',
  'Court Notice Served: Partition Suit': 'न्यायालय नोटिस तामील: विभाजन वाद',
  'DBT Compensation Batch Cleared': 'डीबीटी मुआवजा बैच स्वीकृत',
  'Sec 19 Declaration Milestone Completed': 'धारा 19 घोषणा मील का पत्थर पूर्ण',
  'Field Verification Report Submitted': 'क्षेत्र सत्यापन रिपोर्ट प्रस्तुत',

  // GIS Map
  'Map Layers': 'मानचित्र परतें',
  'Risk Classification': 'जोखिम वर्गीकरण',
  'Corridor Alignments': 'कॉरिडोर संरेखण',
  'Satellite Base': 'उपग्रह आधार',
  'Filter': 'फ़िल्टर',
  'All Villages': 'सभी गांव',
  'All Land Types': 'सभी भूमि प्रकार',
  'All Risk Bands': 'सभी जोखिम श्रेणियां',
  'Agricultural': 'कृषि योग्य',
  'Residential': 'आवासीय',
  'Commercial': 'व्यावसायिक',
  'Orchard / Agro': 'बागवानी / कृषि',
  'Forest / Wetland': 'वन / आर्द्रभूमि',
  'Active Acquisition Milestone': 'सक्रिय अधिग्रहण चरण',
  'Physical Possession & Handover': 'भौतिक कब्जा एवं हस्तांतरण',
  'Registered Title Holders': 'पंजीकृत भूमि स्वामी',
  'Verified': 'सत्यापित',
  'Unverified': 'असत्यापित',
  'Inspect in Digital Twin': 'डिजिटल ट्विन में जांचें',
  'Open Field Dossier': 'क्षेत्र सत्यापन खोलें',
  'Zoom In': 'ज़ूम इन',
  'Zoom Out': 'ज़ूम आउट',
  'Reset View': 'व्यू रीसेट करें',
  'Select Parcel to Inspect:': 'निरीक्षण हेतु पार्सल चुनें:',
  'Selected Parcel Details': 'चयनित पार्सल विवरण',
  'Calculated Risk Score': 'परिकलित जोखिम स्कोर',
  'Current Acquisition Milestone': 'वर्तमान अधिग्रहण चरण',
  'Title Verification Status': 'स्वामित्व सत्यापन स्थिति',
  'Close Inspector': 'विवरण बंद करें',
  'Reset Filters': 'फ़िल्टर रीसेट करें',
  'Corridor Alignment A (Primary)': 'कॉरिडोर संरेखण ए (प्राथमिक)',
  'Corridor Alignment B (Optimized)': 'कॉरिडोर संरेखण बी (अनुकूलित)',

  // Digital Twin 8 Stages (RFCTLARR 2013)
  'Proposal & Feasibility': 'प्रस्ताव एवं व्यवहार्यता',
  'Joint Measurement Survey': 'संयुक्त माप सर्वेक्षण (JMS)',
  'Sec 11 Preliminary Notification': 'धारा 11 प्रारंभिक अधिसूचना',
  'Sec 15 Hearing of Objections': 'धारा 15 आपत्तियों की सुनवाई',
  'Sec 19 Declaration of Acquisition': 'धारा 19 अधिग्रहण की घोषणा',
  'Compensation Determination': 'मुआवजा निर्धारण',
  'R&R Package Disbursement': 'पुनर्वास पैकेज संवितरण',
  '8-Stage RFCTLARR Acquisition Lifecycle': '8-चरणीय भूमि अधिग्रहण जीवनचक्र (RFCTLARR 2013)',
  'Current Stage': 'वर्तमान चरण',
  'Stage Progress': 'चरण प्रगति',
  'Stage History & Verification Trail': 'चरण इतिहास एवं सत्यापन विवरण',
  'Explainable Risk Radar': 'व्याख्यात्मक जोखिम रडार',
  'Compensation Breakdown': 'मुआवजा विवरण',
  'Estimated Total': 'अनुमानित कुल',
  'Awarded Amount': 'स्वीकृत राशि',
  'Paid via DBT': 'डीबीटी द्वारा भुगतान',
  'Pending Escrow': 'लंबित एस्क्रो',
  'Land Parcel Ownership Tree': 'भूमि पार्सल स्वामित्व वृक्ष',
  'Legal Injunction & Court Status': 'कानूनी स्थगन एवं न्यायालय स्थिति',
  'Writ Petition No.': 'याचिका संख्या',
  'High Court of Judicature at Allahabad': 'इलाहाबाद उच्च न्यायालय',
  'District Civil Court, Varanasi': 'जिला दीवानी अदालत, वाराणसी',
  'Next Hearing Date': 'अगली सुनवाई तिथि',
  'Stay Order Active': 'स्थगन आदेश प्रभावी',
  'Download Legal Summary': 'कानूनी सारांश डाउनलोड करें',
  'Inspect Cadastral Plot in GIS': 'जीआईएस में भू-प्लॉट जांचें',
  'Co-Sharer': 'सह-स्वामी',
  'Title Holder': 'भूमि स्वामी',
  'Tenant': 'काश्तकार',
  'Aadhaar Linked': 'आधार लिंक है',
  'Bank DBT Verified': 'बैंक डीबीटी सत्यापित',

  // Simulator
  'What-If Corridor Alignment Simulator': 'वॉट-इफ कॉरिडोर संरेखण सिमुलेटर',
  'Real-time decision intelligence': 'वास्तविक समय निर्णय-बुद्धिमत्ता विश्लेषण',
  'Simulate Alternate Alignment': 'वैकल्पिक संरेखण सिमुलेट करें',
  'Approved Alignment Option A': 'अनुमोदित संरेखण विकल्प ए',
  'Proposed Alignment Option B': 'प्रस्तावित अनुकूलित विकल्प बी',
  'Comparison Metrics': 'तुलनात्मक मेट्रिक्स',
  'Projected Total Cost': 'प्रक्षेपित कुल लागत',
  'Possession Timeline': 'कब्जा समयसीमा',
  'Litigation Risk Exposure': 'मुकदमेबाजी जोखिम स्तर',
  'Adopt Option B': 'विकल्प बी अपनाएं',
  'Download Cabinet Note': 'कैबिनेट नोट डाउनलोड करें',
  'Total Cost Savings': 'कुल लागत बचत',
  'Delay Reduction': 'विलंब में कमी',
  'Affected Families Reduced': 'प्रभावित परिवारों में कमी',
  'Re-run Simulation': 'सिमुलेशन पुनः चलाएं',
  'Export Analysis PDF': 'विश्लेषण पीडीएफ निर्यात करें',
  'Cabinet Approval Summary': 'मंत्रिमंडल अनुमोदन सारांश',

  // Satellite Alerts
  'Satellite Earth Observation Advisory': 'उपग्रह भू-अवलोकन परामर्श',
  'Automated Spectral Anomaly Detection': 'स्वचालित स्पेक्ट्रल विसंगति पहचान',
  'Sentinel-2 Spacecraft Feed': 'सेंटिनल-2 अंतरिक्ष उपग्रह फ़ीड',
  'Ground Encroachment Detected': 'धरातलीय अतिक्रमण चिन्हित',
  'Confidence': 'विश्वसनीयता',
  'Pass Date': 'पारगमन तिथि',
  'Dispatch Patwari / Revenue Inspector': 'पटवारी / राजस्व निरीक्षक को भेजें',
  'Ignore / False Positive': 'अमान्य / गलत संकेत',
  'Generate Site Inspection Order': 'स्थल निरीक्षण आदेश जारी करें',
  'Status: Action Required': 'स्थिति: कार्रवाई अपेक्षित',
  'Baseline Imagery': 'आधार रेखा उपग्रह चित्र',
  'Recent Pass Imagery': 'हालिया पारगमन चित्र',
  'Difference Mask': 'अंतर मास्क (विसंगति)',

  // Field Verification
  'Field Verification Inspection Dossier': 'क्षेत्र सत्यापन निरीक्षण विवरणिका',
  'Real-Time RTK-DGPS Cadastral Audit': 'रीयल-टाइम आरटीके-डीजीपीएस कैडस्ट्रल ऑडिट',
  'Officer In-Charge': 'प्रभारी अधिकारी',
  'Inspection Date': 'निरीक्षण तिथि',
  'Demarcation Boundary Stones': 'सीमांकन पत्थर सत्यापन',
  'Physical Encroachment Inspection': 'भौतिक अतिक्रमण निरीक्षण',
  'Crop / Plantation Enumeration': 'फसल / वृक्ष गणना',
  'Structure Measurement': 'संरचना भौतिक माप',
  'Geo-Tagged Photos': 'जियो-टैग्ड तस्वीरें',
  'Officer Digital Signature': 'अधिकारी का डिजिटल हस्ताक्षर',
  'Submit Verified Dossier': 'सत्यापित रिपोर्ट सबमिट करें',
  'Mark as Disputed': 'विवादित चिन्हित करें',

  // Citizen Portal
  'Citizen Services: Land Acquisition Status & Compensation Tracker': 'नागरिक सेवा केंद्र: भूमि अधिग्रहण स्थिति एवं मुआवजा ट्रैकर',
  'Toll-Free Helpline: 1800-180-1551': 'हेल्पलाइन: 1800-180-1551 (टोल फ्री)',
  'Track Land Acquisition Claim': 'भूमि अधिग्रहण दावा स्थिति जांचें',
  'Enter Parcel ID, Khatauni or Mobile': 'पार्सल आईडी, खतौनी या मोबाइल नंबर दर्ज करें',
  'Track Claim Status': 'दावा स्थिति जांचें',
  'Direct Bank Transfer (DBT) Status': 'प्रत्यक्ष लाभ अंतरण (DBT) स्थिति',
  'Processed through PFMS Portal': 'पीएफएमएस पोर्टल के माध्यम से संसाधित',
  'Download Formal Award Letter': 'अधिनिर्णय पत्र डाउनलोड करें',
  'Register Citizen Grievance': 'नागरिक शिकायत दर्ज करें',
  'Download Compensation Slip': 'मुआवजा पर्ची डाउनलोड करें',
  'Submit Query / Objection': 'प्रश्न / आपत्ति दर्ज करें',

  // Audit Log
  'Immutable Cryptographic Audit Trail': 'अपरिवर्तनीय क्रिप्टोग्राफिक ऑडिट ट्रेल',
  'SHA-256 Ledger of All Administrative Actions': 'सभी प्रशासनिक कार्यों का SHA-256 खाता',
  'Audit Record ID': 'ऑडिट रिकॉर्ड आईडी',
  'Timestamp': 'समय',
  'Executive Official': 'कार्यकारी अधिकारी',
  'Action Summary': 'कार्रवाई विवरण',
  'Cryptographic Hash': 'क्रिप्टोग्राफिक हैश',
  'Previous Block Hash': 'पिछला ब्लॉक हैश',
  'Tamper-Proof Verified': 'सत्यापित सुरक्षित',
  'Export Signed Audit Trail': 'हस्ताक्षरित ऑडिट ट्रेल निर्यात करें',

  // Footer
  'Get Involved': 'सहभागिता',
  'Citizen Case Tracker': 'नागरिक केस ट्रैकर',
  'Submit Section 15 Objection': 'धारा 15 आपत्ति दर्ज करें',
  'Gram Sabha Public Hearings': 'ग्राम सभा जन सुनवाई',
  'Social Impact Assessment (SIA)': 'सामाजिक प्रभाव मूल्यांकन (SIA)',
  'Aadhaar DBT Bank Linking': 'आधार डीबीटी बैंक लिंकिंग',
  'CPGRAMS Land Grievance': 'सीपीजीआरएएमएस भूमि शिकायत',
  'Core Modules': 'प्रमुख मॉड्यूल',
  'GIS Parcel Spatial Map': 'जीआईएस पार्सल स्थानिक मानचित्र',
  'Cadastral Digital Twin': 'कैडस्ट्रल डिजिटल ट्विन',
  'AI Risk Radar & Delay Index': 'एआई जोखिम रडार व विलंब सूचकांक',
  'What-If Alignment Simulator': 'वॉट-इफ संरेखण सिमुलेटर',
  'Sentinel-2 Satellite Alerts': 'सेंटिनल-2 उपग्रह अलर्ट',
  'GPS Field Verification': 'जीपीएस क्षेत्र सत्यापन',
  'Help & Support': 'सहायता एवं समर्थन',
  'District Collectorate Desk': 'जिला समाहर्ता कार्यालय डेस्क',
  'RFCTLARR Act 2013 FAQs': 'RFCTLARR अधिनियम 2013 अक्सर पूछे जाने वाले प्रश्न',
  'State Land Acquisition Rules': 'राज्य भूमि अधिग्रहण नियमावली',
  'Land Authority Ombudsman': 'भूमि प्राधिकरण लोकपाल',
  'Website Terms & Conditions': 'वेबसाइट नियम व शर्तें',
  'Right to Information (RTI)': 'सूचना का अधिकार (RTI)',
  'National Portals': 'राष्ट्रीय पोर्टल',
  'Ministry of Rural Dev': 'ग्रामीण विकास मंत्रालय',
  'MyGov.in Portal': 'माईगव.इन पोर्टल',
  'PM Gati Shakti Master Plan': 'पीएम गति शक्ति मास्टर प्लान',
  'ISRO Bhuvan Geo-Portal': 'इसरो भुवन भू-पोर्टल',
  'Digital India Land Records': 'डिजिटल इंडिया भूमि अभिलेख',
  'Download Bhumi Mobile': 'भूमि मोबाइल ऐप डाउनलोड करें',
  'Scan to inspect parcel tags, upload field verifications & track compensation on the go.':
    'पार्सल विवरण देखने, फील्ड सत्यापन अपलोड करने और मोबाइल पर मुआवजा ट्रैक करने हेतु स्कैन करें।',
  'Follow Ministry updates:': 'मंत्रालय के अपडेट फॉलो करें:',
  'Last Updated:': 'अंतिम अद्यतन:',
  'Back to Top': 'शीर्ष पर जाएं',
  'Designed & Developed for Smart India Hackathon (SIH 2026)': 'स्मार्ट इंडिया हैकथॉन (SIH 2026) हेतु डिज़ाइन एवं विकसित',
  'Ministry of Rural Development • Land Resources Division': 'ग्रामीण विकास मंत्रालय • भूमि संसाधन प्रभाग',
  'Compliant with GoI Web Guidelines (GIGW 3.0)': 'भारत सरकार वेब दिशानिर्देश (GIGW 3.0) के अनुरूप',

  // Demo Role Switcher
  'Demo Navigator': 'डेमो नेविगेटर',
  'SWITCH USER ROLE LIVE': 'लाइव उपयोगकर्ता भूमिका बदलें',
  'SIH GUIDED PITCH SEQUENCE': 'एसआईएच निर्देशित पिच अनुक्रम',
  '7 CONNECTED STEPS': '7 परस्पर जुड़े चरण',
  'NO LOGOUT REQUIRED': 'लॉगआउट की आवश्यकता नहीं',
  'GIS Map View': 'जीआईएस मानचित्र दृश्य',
  'Inspect High-Risk Parcel': 'उच्च जोखिम पार्सल का निरीक्षण',
  'Digital Twin & AI Risk Radar': 'डिजिटल ट्विन एवं एआई जोखिम रडार',
  'Sentinel-2 Satellite Alert': 'सेंटिनल-2 उपग्रह अलर्ट',
  'Run What-If Corridor Simulator': 'वॉट-इफ कॉरिडोर सिमुलेटर चलाएं',
  'Citizen Self-Service Portal': 'नागरिक स्व-सेवा पोर्टल',
  'Immutable System Audit Log': 'अपरिवर्तनीय सिस्टम ऑडिट लॉग',
  'Interactive 148-parcel cadastral grid with risk heatmaps': 'जोखिम हीटमैप के साथ इंटरैक्टिव 148-पार्सल कैडस्ट्रल ग्रिड',
  'Select Critical Parcel #PARCEL-001 (Score 78) & open drawer': 'गंभीर पार्सल #PARCEL-001 (स्कोर 78) चुनें एवं विवरण खोलें',
  'Explainable AI factors: 8-stage lifecycle & ownership litigation': 'व्याख्यात्मक एआई कारक: 8-चरणीय जीवनचक्र व स्वामित्व मुकदमेबाजी',
  'Before/after physical change detection & advisory banner': 'भौतिक परिवर्तन पहचान एवं परामर्श बैनर',
  'Simulate 4.2 Mo delay mitigation & ₹18.4 Cr savings': '4.2 माह विलंब में कमी एवं ₹18.4 करोड़ बचत का सिमुलेशन',
  'Farmer claim tracking, Aadhaar DBT status & grievance filing': 'किसान दावा ट्रैकिंग, आधार डीबीटी स्थिति एवं शिकायत पंजीकरण',
  'Tamper-proof SHA-256 ledger of all administrative decisions': 'सभी प्रशासनिक निर्णयों का सुरक्षित SHA-256 बहीखाता',

  // Cookie Banner
  'Cookie Settings & Privacy Policy': 'कुकी सेटिंग्स एवं गोपनीयता नीति',
  'Customize Cookies': 'कुकीज़ अनुकूलित करें',
  'Decline optional cookies': 'वैकल्पिक कुकीज़ अस्वीकार करें',
  'Accept All Cookies': 'सभी कुकीज़ स्वीकार करें',
  'This website uses cookies to provide a better user experience and analyze traffic in compliance with Government of India Digital Personal Data Protection (DPDP) Act. By clicking accept, you agree to the policies outlined in the':
    'यह वेबसाइट भारत सरकार के डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम के अनुपालन में बेहतर उपयोगकर्ता अनुभव प्रदान करने और ट्रैफ़िक का विश्लेषण करने के लिए कुकीज़ का उपयोग करती है। स्वीकार पर क्लिक करके, आप नीतियों से सहमत होते हैं:',
  'Privacy Policy': 'गोपनीयता नीति',
  'and': 'एवं',
  'Cookie Policy.': 'कुकी नीति।',

  // Units, Common words & Statuses
  'Cr': 'करोड़',
  'Mo': 'माह',
  'Ha': 'हेक्टेयर',
  'Hectares': 'हेक्टेयर',
  'Cases': 'मामले',
  'Families': 'परिवार',
  'Parcels': 'पार्सल',
  'Ownership': 'स्वामित्व',
  'Legal': 'कानूनी',
  'Compensation': 'मुआवजा',
  'Delay': 'विलंब',
  'R&R': 'पुनर्वास',
  'Environmental': 'पर्यावरण',
  'Social': 'सामाजिक',
  'Disputes': 'विवाद',
  'Beneficiaries': 'लाभार्थी',
  'Recent Activity': 'हालिया गतिविधि',
  'Layer Toggles': 'परत टॉगल',
  'Close': 'बंद करें',
  'Submit': 'प्रस्तुत करें',
  'Cancel': 'रद्द करें',
  'Save': 'सहेजें',
  'Download': 'डाउनलोड करें',
  'View': 'देखें',
  'Inspect': 'जांचें',
  'Status': 'स्थिति',
  'Date': 'दिनांक',
  'Action': 'कार्रवाई',
  'Details': 'विवरण',
  'Total': 'कुल',
  'Pending': 'लंबित',
  'Disbursed': 'संवितरित',
  'Completed': 'पूर्ण',
  'Active': 'सक्रिय',
  'Critical': 'गंभीर',
  'Attention': 'ध्यानार्थ',
  'Low': 'कम',
  'Low Risk': 'कम जोखिम',
  'Medium': 'मध्यम',
  'High': 'उच्च',
  'Score': 'स्कोर',
  'Village Rampur': 'गांव रामपुर',
  'Village Shivpur': 'गांव शिवपुर',
  'Village Babatpur': 'गांव बाबतपुर',
  'Village Harahua': 'गांव हरहुआ',
  'Rampur': 'रामपुर',
  'Shivpur': 'शिवपुर',
  'Babatpur': 'बाबतपुर',
  'Harahua': 'हरहुआ',
  'Varanasi': 'वाराणसी',
  'Uttar Pradesh': 'उत्तर प्रदेश',
};

// Common phrase & token replacements for composite text nodes
const PHRASE_REPLACEMENTS: [RegExp, string][] = [
  [/(\d+(?:\.\d+)?)\s*Cr\b/g, '$1 करोड़'],
  [/(\d+(?:\.\d+)?)\s*Mo\b/g, '$1 माह'],
  [/(\d+(?:\.\d+)?)\s*Ha\b/g, '$1 हेक्टेयर'],
  [/(\d+(?:\.\d+)?)\s*km\b/g, '$1 किमी'],
  [/\bTotal Parcels\b/gi, 'कुल पार्सल'],
  [/\bAffected Families\b/gi, 'प्रभावित परिवार'],
  [/\bHigh-Risk Parcels\b/gi, 'उच्च जोखिम पार्सल'],
  [/\bPending Compensation\b/gi, 'लंबित मुआवजा'],
  [/\bPending R&R\b/gi, 'लंबित पुनर्वास'],
  [/\bLegal Injunctions\b/gi, 'कानूनी वाद / स्थगन'],
  [/\bPredicted Delay\b/gi, 'अनुमानित विलंब'],
  [/\bSatellite Alerts\b/gi, 'उपग्रह अलर्ट'],
  [/\bRisk Level\b/gi, 'जोखिम स्तर'],
  [/\bUrgent Bottleneck\b/gi, 'अति आवश्यक गतिरोध'],
  [/\bCritical\b/gi, 'गंभीर'],
  [/\bAttention\b/gi, 'ध्यानार्थ'],
  [/\bLow Risk\b/gi, 'कम जोखिम'],
  [/\bAgricultural\b/gi, 'कृषि योग्य'],
  [/\bResidential\b/gi, 'आवासीय'],
  [/\bCommercial\b/gi, 'व्यावसायिक'],
  [/\bDisbursed\b/gi, 'संवितरित'],
  [/\bVerified\b/gi, 'सत्यापित'],
  [/\bPending\b/gi, 'लंबित'],
  [/\bDownload\b/gi, 'डाउनलोड'],
  [/\bInspect\b/gi, 'जांचें'],
  [/\bClose\b/gi, 'बंद करें'],
  [/\bSubmit\b/gi, 'प्रस्तुत करें'],
  [/\bVillage\b/gi, 'गांव'],
  [/\bDistrict\b/gi, 'जिला'],
  [/\bLength\b/gi, 'लंबाई'],
];

// Reverse dictionary (Hindi -> English)
export const REVERSE_DICTIONARY: Record<string, string> = {};
for (const [en, hi] of Object.entries(DICTIONARY)) {
  if (
    !REVERSE_DICTIONARY[hi] ||
    (en !== en.toUpperCase() && REVERSE_DICTIONARY[hi] === REVERSE_DICTIONARY[hi].toUpperCase()) ||
    en.length > REVERSE_DICTIONARY[hi].length
  ) {
    REVERSE_DICTIONARY[hi] = en;
  }
}

// Reverse phrase replacements (Hindi -> English)
const REVERSE_PHRASE_REPLACEMENTS: [RegExp, string][] = [
  [/(\d+(?:\.\d+)?)\s*करोड़\b/g, '$1 Cr'],
  [/(\d+(?:\.\d+)?)\s*माह\b/g, '$1 Mo'],
  [/(\d+(?:\.\d+)?)\s*हेक्टेयर\b/g, '$1 Ha'],
  [/(\d+(?:\.\d+)?)\s*किमी\b/g, '$1 km'],
  [/कुल पार्सल/g, 'Total Parcels'],
  [/प्रभावित परिवार/g, 'Affected Families'],
  [/उच्च जोखिम पार्सल/g, 'High-Risk Parcels'],
  [/लंबित मुआवजा/g, 'Pending Compensation'],
  [/लंबित पुनर्वास/g, 'Pending R&R'],
  [/कानूनी वाद \/ स्थगन/g, 'Legal Injunctions'],
  [/अनुमानित विलंब/g, 'Predicted Delay'],
  [/उपग्रह अलर्ट/g, 'Satellite Alerts'],
  [/जोखिम स्तर/g, 'Risk Level'],
  [/अति आवश्यक गतिरोध/g, 'Urgent Bottleneck'],
  [/गंभीर/g, 'Critical'],
  [/ध्यानार्थ/g, 'Attention'],
  [/कम जोखिम/g, 'Low Risk'],
  [/कृषि योग्य/g, 'Agricultural'],
  [/आवासीय/g, 'Residential'],
  [/व्यावसायिक/g, 'Commercial'],
  [/संवितरित/g, 'Disbursed'],
  [/सत्यापित/g, 'Verified'],
  [/लंबित/g, 'Pending'],
  [/डाउनलोड/g, 'Download'],
  [/जांचें/g, 'Inspect'],
  [/बंद करें/g, 'Close'],
  [/प्रस्तुत करें/g, 'Submit'],
  [/गांव/g, 'Village'],
  [/जिला/g, 'District'],
  [/लंबाई/g, 'Length'],
];

const isHindiText = (str: string): boolean => /[\u0900-\u097F]/.test(str);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('bhumi_language');
      return saved === 'hi' || saved === 'en' ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (enText: string, customHi?: string): string => {
    if (language === 'en') return enText;
    if (customHi && customHi.trim()) return customHi;
    const cleanKey = enText.trim();
    if (DICTIONARY[cleanKey]) return DICTIONARY[cleanKey];
    return enText;
  };

  useEffect(() => {
    try {
      localStorage.setItem('bhumi_language', language);
    } catch {
      // ignore
    }
    document.documentElement.lang = language;

    // Automatic recursive DOM translation for text nodes and attributes
    const root = document.getElementById('bhumi-twin-root') || document.body;
    if (!root) return;

    let isTranslating = false;

    const translateText = (text: string): string => {
      const trimmed = text.trim();
      if (!trimmed) return text;
      // 1. Direct dictionary match
      if (DICTIONARY[trimmed]) {
        return text.replace(trimmed, DICTIONARY[trimmed]);
      }
      // 2. Case-insensitive dictionary match
      const lower = trimmed.toLowerCase();
      for (const [key, val] of Object.entries(DICTIONARY)) {
        if (key.toLowerCase() === lower) {
          return text.replace(trimmed, val);
        }
      }
      // 3. Composite phrase replacements
      let res = text;
      for (const [pattern, repl] of PHRASE_REPLACEMENTS) {
        res = res.replace(pattern, repl);
      }
      return res;
    };

    const translateToEnglish = (text: string): string => {
      const trimmed = text.trim();
      if (!trimmed) return text;
      // 1. Direct reverse dictionary match
      if (REVERSE_DICTIONARY[trimmed]) {
        return text.replace(trimmed, REVERSE_DICTIONARY[trimmed]);
      }
      // 2. Case-insensitive reverse match
      const lower = trimmed.toLowerCase();
      for (const [hi, en] of Object.entries(REVERSE_DICTIONARY)) {
        if (hi.toLowerCase() === lower) {
          return text.replace(trimmed, en);
        }
      }
      // 3. Composite phrase reverse replacements
      let res = text;
      for (const [pattern, repl] of REVERSE_PHRASE_REPLACEMENTS) {
        res = res.replace(pattern, repl);
      }
      // 4. Substring replacements for any dictionary entries found in text
      for (const [hi, en] of Object.entries(REVERSE_DICTIONARY)) {
        if (hi.length > 2 && res.includes(hi)) {
          res = res.split(hi).join(en);
        }
      }
      return res;
    };

    const processNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue;
        if (!text || !text.trim() || text.length < 2) return;

        if (language === 'hi') {
          // Only save __origText if the text is currently English (NOT already Hindi)
          if (!(node as any).__origText && !isHindiText(text)) {
            (node as any).__origText = text;
          }
          const orig = (node as any).__origText || text;
          if (!isHindiText(text)) {
            const translated = translateText(orig);
            if (translated !== text) {
              node.nodeValue = translated;
            }
          }
        } else {
          // Restore English
          const orig = (node as any).__origText;
          if (orig && !isHindiText(orig)) {
            if (node.nodeValue !== orig) {
              node.nodeValue = orig;
            }
            delete (node as any).__origText;
          } else if (isHindiText(text)) {
            // If text is in Hindi and no valid English __origText, convert it back to English
            const restored = translateToEnglish(text);
            if (restored !== text) {
              node.nodeValue = restored;
            }
            delete (node as any).__origText;
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tag = el.tagName;
        if (['SCRIPT', 'STYLE', 'CODE', 'PRE'].includes(tag)) return;

        if (language === 'hi') {
          const ph = el.getAttribute('placeholder');
          if (ph && ph.trim()) {
            if (!(el as any).__origPlaceholder && !isHindiText(ph)) {
              (el as any).__origPlaceholder = ph;
            }
            const origPh = (el as any).__origPlaceholder || ph;
            if (!isHindiText(ph)) {
              const trPh = translateText(origPh);
              if (trPh !== ph) el.setAttribute('placeholder', trPh);
            }
          }
          const title = el.getAttribute('title');
          if (title && title.trim()) {
            if (!(el as any).__origTitle && !isHindiText(title)) {
              (el as any).__origTitle = title;
            }
            const origTitle = (el as any).__origTitle || title;
            if (!isHindiText(title)) {
              const trTitle = translateText(origTitle);
              if (trTitle !== title) el.setAttribute('title', trTitle);
            }
          }
        } else {
          // Restore English attributes
          const origPh = (el as any).__origPlaceholder;
          if (origPh && !isHindiText(origPh)) {
            el.setAttribute('placeholder', origPh);
            delete (el as any).__origPlaceholder;
          } else {
            const currentPh = el.getAttribute('placeholder');
            if (currentPh && isHindiText(currentPh)) {
              el.setAttribute('placeholder', translateToEnglish(currentPh));
            }
            delete (el as any).__origPlaceholder;
          }

          const origTitle = (el as any).__origTitle;
          if (origTitle && !isHindiText(origTitle)) {
            el.setAttribute('title', origTitle);
            delete (el as any).__origTitle;
          } else {
            const currentTitle = el.getAttribute('title');
            if (currentTitle && isHindiText(currentTitle)) {
              el.setAttribute('title', translateToEnglish(currentTitle));
            }
            delete (el as any).__origTitle;
          }
        }

        // Traverse children
        for (let child = el.firstChild; child; child = child.nextSibling) {
          processNode(child);
        }
      }
    };

    const runTranslation = () => {
      if (isTranslating) return;
      isTranslating = true;
      try {
        processNode(root);
      } finally {
        isTranslating = false;
      }
    };

    runTranslation();

    // Observe future DOM mutations (e.g. tab changes, filters, dialogs)
    const observer = new MutationObserver((mutations) => {
      if (isTranslating) return;
      let hasChanges = false;
      for (const m of mutations) {
        if (m.type === 'childList' && m.addedNodes.length > 0) {
          hasChanges = true;
          break;
        }
      }
      if (hasChanges) {
        runTranslation();
      }
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
