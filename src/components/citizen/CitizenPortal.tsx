import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  IndianRupee,
  Home,
  ShieldCheck,
  HelpCircle,
  PhoneCall,
  Send,
  FileCheck,
  Building,
  Info,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface CitizenPortalProps {
  initialCaseId?: string;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({ initialCaseId = 'CAS-2026-RAM-204' }) => {
  const [caseIdInput, setCaseIdInput] = useState(initialCaseId);
  const [searchedCaseId, setSearchedCaseId] = useState(initialCaseId);
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [grievanceText, setGrievanceText] = useState('');
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (caseIdInput.trim()) {
      setSearchedCaseId(caseIdInput.trim().toUpperCase());
    }
  };

  // Plain-Language Citizen Steps (Jargon-free)
  const citizenSteps = [
    { num: 1, title: 'Project Announced', status: 'done', desc: 'Government gazette published' },
    { num: 2, title: 'Land Joint Survey', status: 'done', desc: 'Boundary measured with GPS' },
    { num: 3, title: 'Public Notice Issued', status: 'done', desc: 'Section 11 notification' },
    { num: 4, title: 'Hearings & Objections', status: 'done', desc: 'Gram Sabha review completed' },
    { num: 5, title: 'Final Award Declared', status: 'current', desc: 'Amount officially calculated' },
    { num: 6, title: 'Direct Bank Transfer', status: 'upcoming', desc: 'Aadhaar DBT disbursement' },
    { num: 7, title: 'R&R Assistance', status: 'upcoming', desc: 'Housing & skill support' },
    { num: 8, title: 'Handover & Closure', status: 'upcoming', desc: 'Final possession record' },
  ];

  return (
    <div id="citizen-portal-screen" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Friendly Reassuring Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-2xl p-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-200">
            Citizen Information & Transparency Desk
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Kisan & Landowner Information Portal
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-2xl leading-relaxed">
          Check your land measurement, approved compensation calculation, direct bank transfer status, and rehabilitation entitlements with complete transparency.
        </p>

        {/* Case ID Search Box */}
        <form onSubmit={handleSearch} className="mt-5 flex flex-col sm:flex-row gap-2 max-w-xl">
          <div className="relative flex-1">
            <input
              id="citizen-case-search-input"
              type="text"
              value={caseIdInput}
              onChange={(e) => setCaseIdInput(e.target.value)}
              placeholder="Enter Case ID (e.g. CAS-2026-RAM-204 or P-204)"
              className="w-full px-4 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-mono font-bold focus:outline-hidden focus:ring-2 focus:ring-amber-400 shadow-inner"
            />
          </div>
          <button
            id="citizen-case-search-submit-btn"
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#D97706] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Search className="w-4 h-4" />
            <span>Track My Case</span>
          </button>
        </form>

        <div className="mt-2 text-[11px] text-emerald-200 flex items-center gap-2">
          <span>Quick Demo:</span>
          <button
            type="button"
            onClick={() => {
              setCaseIdInput('CAS-2026-RAM-204');
              setSearchedCaseId('CAS-2026-RAM-204');
            }}
            className="underline hover:text-white font-mono"
          >
            CAS-2026-RAM-204 (Rampur)
          </button>
        </div>
      </div>

      {/* Current Progress Alert Banner */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-200 rounded-lg text-amber-900 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-900 uppercase">
                Stage 5 of 8 in Progress
              </span>
              <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-amber-200">
                {searchedCaseId}
              </span>
            </div>
            <p className="text-xs text-amber-950 mt-0.5 font-medium">
              Land Measurement & Joint Valuation Verified. Section 19 Award has been formally declared.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowGrievanceModal(true)}
          className="shrink-0 px-3.5 py-1.5 bg-white border border-amber-400 text-amber-900 hover:bg-amber-100 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
        >
          Have a Question? Ask Land Cell
        </button>
      </div>

      {/* 8-Step Simplified Progress Stepper */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Step-by-Step Acquisition Journey
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {citizenSteps.map((step) => (
            <div
              key={step.num}
              className={`p-3 rounded-xl border text-xs transition-all ${
                step.status === 'current'
                  ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-300'
                  : step.status === 'done'
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-500">Step {step.num}</span>
                {step.status === 'done' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : step.status === 'current' ? (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-white animate-pulse">
                    CURRENT
                  </span>
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300"></span>
                )}
              </div>
              <div className={`font-bold leading-tight ${step.status === 'current' ? 'text-slate-900' : 'text-slate-800'}`}>
                {step.title}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column Transparent Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Land Parcel Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <Building className="w-4 h-4 text-slate-600" />
              <span>Your Registered Land Parcel</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Verified Title
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Khasra / Survey No:</span>
              <span className="font-bold text-slate-800 font-mono">412/3B</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Village & Block:</span>
              <span className="font-bold text-slate-800">Rampur, Kashi Vidyapeeth</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Total Area Measured:</span>
              <span className="font-bold text-slate-800">2.45 Hectares (~6.05 Acres)</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Public Purpose Project:</span>
              <span className="font-medium text-slate-800">Varanasi Ring Road & Logistics Corridor</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Acquiring Agency:</span>
              <span className="font-medium text-slate-800">National Highways Authority (MoRTH)</span>
            </div>
          </div>
        </div>

        {/* Plain Compensation Breakdown Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              <span>Compensation Entitlement Calculation</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              RFCTLARR 2013 Act
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Circle Rate Base Assessment:</span>
              <span className="font-semibold text-slate-800">₹92,50,000</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Rural Multiplier Factor (x 2.0):</span>
              <span className="font-semibold text-slate-800">₹92,50,000</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">100% Statutory Solatium:</span>
              <span className="font-semibold text-emerald-700">+ 100% Guaranteed</span>
            </div>
            <div className="flex items-center justify-between py-1.5 bg-emerald-50 px-2 rounded-lg text-emerald-950 font-bold">
              <span>Total Sanctioned Award Amount:</span>
              <span className="text-sm">₹1,85,00,000 (₹1.85 Cr)</span>
            </div>
          </div>

          {/* Aadhaar Direct Bank Transfer Status */}
          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">Direct DBT Bank Account Linked</span>
              <span className="text-slate-500 text-[11px]">
                State Bank of India (SBI) A/c ending in ••••4102. Aadhaar biometric authentication verified.
              </span>
            </div>
          </div>
        </div>

        {/* Resettlement & Family Support Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <Home className="w-4 h-4 text-amber-600" />
              <span>Rehabilitation & Family Assistance</span>
            </h3>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
              Package Approved
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Alternative Housing Plot:</span>
              <span className="font-bold text-slate-800">Earmarked in Babatpur Sector 4</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">One-Time Resettlement Allowance:</span>
              <span className="font-bold text-emerald-700">₹3,50,000 Sanctioned</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Free Youth Skill Apprenticeship:</span>
              <span className="font-bold text-slate-800">1 Family Member Nominated</span>
            </div>
          </div>
        </div>

        {/* "What Happens Next" Jargon-Free Guide */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Info className="w-4 h-4 text-blue-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">What Happens Next (Simple Guide)</h3>
          </div>

          <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
            <li>
              <strong className="text-slate-800">Notice for Disbursement:</strong> You will receive an SMS alert 7 days before compensation is credited to your bank account.
            </li>
            <li>
              <strong className="text-slate-800">Zero Intermediary Policy:</strong> All funds are transferred directly via PFMS portal to your Aadhaar-linked account.
            </li>
            <li>
              <strong className="text-slate-800">Dispute Resolution Desk:</strong> If you or any co-sharer have questions on succession share, visit the Tehsildar desk on Tuesdays.
            </li>
          </ul>
        </div>

      </div>

      {/* Citizen Grievance Modal */}
      {showGrievanceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-300 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-600" />
                <span>Submit Inquiry or Grievance to Land Cell</span>
              </h3>
              <button
                onClick={() => {
                  setShowGrievanceModal(false);
                  setGrievanceSubmitted(false);
                }}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {grievanceSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 text-xs text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <span className="font-bold block text-sm">Grievance Registered Successfully</span>
                <p>Your Complaint Reference Number is: <strong className="font-mono text-emerald-800">GRV-2026-VRN-8421</strong></p>
                <p className="text-slate-600">The Additional District Magistrate (Land Acquisition) will review your query within 3 business days.</p>
                <button
                  onClick={() => {
                    setShowGrievanceModal(false);
                    setGrievanceSubmitted(false);
                  }}
                  className="mt-3 px-4 py-2 bg-emerald-700 text-white font-bold rounded-lg"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-slate-600">
                  Please describe your question regarding land boundary, tree valuation, co-sharer split, or bank account update.
                </p>
                <textarea
                  value={grievanceText}
                  onChange={(e) => setGrievanceText(e.target.value)}
                  placeholder="Enter details of your inquiry or discrepancy..."
                  rows={4}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-slate-800"
                />

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowGrievanceModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (grievanceText.trim()) setGrievanceSubmitted(true);
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit to Land Cell</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
