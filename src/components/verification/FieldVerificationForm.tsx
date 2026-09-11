import React, { useState } from 'react';
import {
  ClipboardCheck,
  Camera,
  MapPin,
  Upload,
  CheckCircle2,
  Shield,
  User,
  Clock,
  AlertTriangle,
  FileText,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALL_PARCELS } from '../../data/mockData';
import { NavTab } from '../layout/GovHeader';

interface FieldVerificationFormProps {
  initialParcelId?: string;
  onNavigateTab: (tab: NavTab) => void;
  onParcelUpdated?: (parcelId: string, status: string) => void;
}

export const FieldVerificationForm: React.FC<FieldVerificationFormProps> = ({
  initialParcelId = 'PARCEL-001',
  onNavigateTab,
  onParcelUpdated,
}) => {
  const [selectedParcelId, setSelectedParcelId] = useState(initialParcelId);
  const [officerId, setOfficerId] = useState('REV-OFF-4412 (Shri S.N. Tripathi, Revenue Inspector)');
  const [gpsAccuracy, setGpsAccuracy] = useState('±1.8 meters (RTK-DGPS Locked)');
  const [currentCoordinates, setCurrentCoordinates] = useState('25.3418° N, 82.9412° E');
  const [verificationFinding, setVerificationFinding] = useState<'Verified' | 'Discrepancy Found' | 'Requires Demarcation'>('Discrepancy Found');
  
  // Physical features checked
  const [features, setFeatures] = useState({
    standingCrops: true,
    tubewellBorewell: true,
    boundaryFencing: false,
    puccaStructure: true,
    encroachmentObserved: true,
    treesEnumerated: true,
  });

  const [notes, setNotes] = useState(
    'Ground inspection confirms newly erected 1.2m brick boundary foundation across Northern contour. Unrecorded borewell pipe observed. Discrepancy logged against Section 11 gazette baseline.'
  );

  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const activeParcel = ALL_PARCELS.find((p) => p.id === selectedParcelId) || ALL_PARCELS[0];

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setUploadedPhotoUrl(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const url = URL.createObjectURL(e.dataTransfer.files[0]);
      setUploadedPhotoUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D97706', '#10B981', '#3B82F6'],
      });
    } catch (err) {
      // ignore in iframe if blocked
    }

    if (onParcelUpdated) {
      onParcelUpdated(selectedParcelId, verificationFinding);
    }
  };

  return (
    <div id="field-verification-form-container" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 uppercase tracking-wider">
              <ClipboardCheck className="w-3.5 h-3.5 text-amber-700" />
              On-Ground Inspection Applet
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Patwari / Field Survey Mode
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Digital Field Verification & Ground Truth Form
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Submit geo-tagged field observations, photo evidence, and structural discrepancies to feed the Cadastral Risk Analysis.
          </p>
        </div>

        {/* Status Pill */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-right">
          <span className="text-[10px] text-slate-500 uppercase block font-semibold">Inspector Assigned</span>
          <span className="text-xs font-bold text-slate-800 font-mono">REV-OFF-4412</span>
        </div>
      </div>

      {submitted ? (
        /* Submission Success Screen */
        <div className="bg-white rounded-2xl border-2 border-emerald-400 p-8 shadow-xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <h2 className="text-2xl font-black text-slate-900">
            Field Verification Successfully Registered
          </h2>

          <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
            Record <strong className="font-mono text-slate-800">#FVR-2026-VRN-401</strong> has been cryptographically signed and submitted to the District Collectorate Desk. The Cadastral Digital Twin & AI Risk Radar have been updated with your findings.
          </p>

          <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-left">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Target Parcel</span>
              <span className="font-bold text-slate-900">{selectedParcelId} ({activeParcel.village})</span>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Recorded Status</span>
              <span className="font-bold text-rose-700">{verificationFinding}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigateTab('digital-twin')}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>View Updated Digital Twin Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setSubmitted(false)}
              className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-50 transition-colors"
            >
              Submit Another Inspection
            </button>
          </div>
        </div>
      ) : (
        /* The Actual Inspection Form */
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          
          {/* Section 1: Parcel & Officer Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
            {/* Parcel Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1" htmlFor="parcel-select">
                Target Parcel for Inspection
              </label>
              <select
                id="parcel-select"
                value={selectedParcelId}
                onChange={(e) => setSelectedParcelId(e.target.value)}
                className="w-full text-xs font-mono font-bold p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              >
                {ALL_PARCELS.slice(0, 15).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} — {p.village} (Survey #{p.surveyNumber}) — Risk: {p.riskScore}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Area: {activeParcel.areaHectares} Ha • Land Class: {activeParcel.landType}
              </span>
            </div>

            {/* Officer Identification (Auto-filled) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1" htmlFor="officer-id-field">
                Inspecting Revenue Officer / Patwari
              </label>
              <input
                id="officer-id-field"
                type="text"
                readOnly
                value={officerId}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed font-medium"
              />
              <span className="text-[11px] text-emerald-700 mt-1 block font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Digital Signature Token Active
              </span>
            </div>
          </div>

          {/* Section 2: Mock GPS Coordinates & Accuracy Badge */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500 text-white rounded-lg shadow-xs">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  GNSS Coordinates Captured
                </span>
                <span className="font-mono text-xs sm:text-sm font-black text-slate-900">
                  {currentCoordinates}
                </span>
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <span>Accuracy: <strong className="text-emerald-700">{gpsAccuracy}</strong></span>
                  <span>•</span>
                  <span>Altitude: 84.2m AMSL</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setCurrentCoordinates(`25.341${Math.floor(Math.random() * 9)}° N, 82.941${Math.floor(Math.random() * 9)}° E`);
              }}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
            >
              Refresh GPS Fix
            </button>
          </div>

          {/* Section 3: Physical Observations Checkboxes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Physical Features Observed on Cadastral Parcel
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={features.standingCrops}
                  onChange={(e) => setFeatures({ ...features, standingCrops: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-medium text-slate-800">Standing Crops</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={features.tubewellBorewell}
                  onChange={(e) => setFeatures({ ...features, tubewellBorewell: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-medium text-slate-800">Tubewell / Borewell</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={features.puccaStructure}
                  onChange={(e) => setFeatures({ ...features, puccaStructure: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-medium text-slate-800">Pucca / Masonry Wall</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={features.boundaryFencing}
                  onChange={(e) => setFeatures({ ...features, boundaryFencing: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-medium text-slate-800">Boundary Demarcation</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={features.encroachmentObserved}
                  onChange={(e) => setFeatures({ ...features, encroachmentObserved: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-medium text-slate-800">New Unapproved Work</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={features.treesEnumerated}
                  onChange={(e) => setFeatures({ ...features, treesEnumerated: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-medium text-slate-800">Fruit-Bearing Trees</span>
              </label>
            </div>
          </div>

          {/* Section 4: Geotagged Photo Upload Control with Drag & Drop */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Geotagged Photo Verification Evidence
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Drop Area */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center flex flex-col items-center justify-center transition-colors cursor-pointer ${
                  isDragOver ? 'border-amber-500 bg-amber-50' : 'border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Camera className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-800 block">
                  Drag and drop parcel photo here
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  Supports JPG, PNG (Max 15MB)
                </span>

                <label className="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg cursor-pointer transition-colors border border-slate-200">
                  <span>Browse Device Gallery</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Geotagged Watermarked Preview */}
              {uploadedPhotoUrl && (
                <div className="relative rounded-xl overflow-hidden border-2 border-slate-300 shadow-sm group">
                  <img
                    src={uploadedPhotoUrl}
                    alt="Geotagged ground evidence"
                    referrerPolicy="no-referrer"
                    className="w-full h-44 object-cover"
                  />
                  
                  {/* Digital Watermark Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-3 text-white text-[10px] font-mono leading-tight space-y-0.5">
                    <div className="flex items-center justify-between font-bold text-amber-400">
                      <span>PARCEL: {selectedParcelId}</span>
                      <span>VERIFIED GEOTAG</span>
                    </div>
                    <div>COORDS: {currentCoordinates}</div>
                    <div>TIMESTAMP: 09-SEP-2026 10:15:32 IST</div>
                    <div className="text-slate-400 text-[9px]">OFFICER: REV-OFF-4412 • SHA-256 VERIFIED</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Field Notes & Finding */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1" htmlFor="verification-finding-select">
                Overall Verification Finding Status
              </label>
              <select
                id="verification-finding-select"
                value={verificationFinding}
                onChange={(e) => setVerificationFinding(e.target.value as any)}
                className="w-full text-xs font-bold p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              >
                <option value="Discrepancy Found">⚠️ Discrepancy Found (Physical structure conflicts with gazette record)</option>
                <option value="Verified">✅ Verified (Boundary & survey match baseline records)</option>
                <option value="Requires Demarcation">🔄 Requires Joint Demarcation with PWD & Landowner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1" htmlFor="field-notes-textarea">
                Detailed Field Observation Remarks
              </label>
              <textarea
                id="field-notes-textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                required
                className="w-full p-3 text-xs border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                placeholder="Enter specific physical boundary observations..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Submit Statutory Verification Record</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
