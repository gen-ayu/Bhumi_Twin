import React, { useState, useMemo } from 'react';
import {
  Camera,
  MapPin,
  Clock,
  User,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Maximize2,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { FieldEvidencePhoto } from '../../../data/projectWorkspaceData';
import { NavTab } from '../../layout/GovHeader';

interface ProjectEvidenceGalleryProps {
  evidencePhotos: FieldEvidencePhoto[];
  onSelectParcel?: (parcelId: string) => void;
  onNavigateTab?: (tab: NavTab) => void;
}

export const ProjectEvidenceGallery: React.FC<ProjectEvidenceGalleryProps> = ({
  evidencePhotos,
  onSelectParcel,
  onNavigateTab,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<FieldEvidencePhoto | null>(null);

  // Filter States
  const [selectedOfficer, setSelectedOfficer] = useState<string>('ALL');
  const [selectedParcel, setSelectedParcel] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Extract unique filter lists
  const officersList = useMemo(() => {
    const set = new Set<string>();
    evidencePhotos.forEach((p) => set.add(p.officerName));
    return Array.from(set);
  }, [evidencePhotos]);

  const parcelsList = useMemo(() => {
    const set = new Set<string>();
    evidencePhotos.forEach((p) => set.add(p.parcelId));
    return Array.from(set);
  }, [evidencePhotos]);

  const typesList = useMemo(() => {
    const set = new Set<string>();
    evidencePhotos.forEach((p) => set.add(p.evidenceType));
    return Array.from(set);
  }, [evidencePhotos]);

  const filteredPhotos = useMemo(() => {
    return evidencePhotos.filter((item) => {
      const matchOfficer = selectedOfficer === 'ALL' || item.officerName === selectedOfficer;
      const matchParcel = selectedParcel === 'ALL' || item.parcelId === selectedParcel;
      const matchType = selectedType === 'ALL' || item.evidenceType === selectedType;
      const matchStatus = selectedStatus === 'ALL' || item.verificationStatus === selectedStatus;
      return matchOfficer && matchParcel && matchType && matchStatus;
    });
  }, [evidencePhotos, selectedOfficer, selectedParcel, selectedType, selectedStatus]);

  const getStatusBadge = (status: FieldEvidencePhoto['verificationStatus']) => {
    switch (status) {
      case 'Verified':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400/20';
      case 'Discrepancy Found':
        return 'bg-rose-50 text-rose-800 border-rose-300 ring-1 ring-rose-400/20 font-bold';
      case 'Under Review':
      default:
        return 'bg-amber-50 text-amber-800 border-amber-300';
    }
  };

  const clearFilters = () => {
    setSelectedOfficer('ALL');
    setSelectedParcel('ALL');
    setSelectedType('ALL');
    setSelectedStatus('ALL');
  };

  return (
    <div id="field-evidence-gallery-section" className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-600"></span>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              7. Field Evidence & Geo-Tagged Ground Truth Gallery
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Photographic evidence submitted from mobile applets with RTK-DGPS coordinates and physical structure tags
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Evidence Count:</span>
          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {filteredPhotos.length} / {evidencePhotos.length} Photos
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-700 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter Evidence Records</span>
          </span>
          {(selectedOfficer !== 'ALL' || selectedParcel !== 'ALL' || selectedType !== 'ALL' || selectedStatus !== 'ALL') && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-amber-800 hover:text-amber-900 font-semibold cursor-pointer underline text-[11px]"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Officer Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Officer</label>
            <select
              value={selectedOfficer}
              onChange={(e) => setSelectedOfficer(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="ALL">All Officers ({officersList.length})</option>
              {officersList.map((off) => (
                <option key={off} value={off}>{off}</option>
              ))}
            </select>
          </div>

          {/* Parcel Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Parcel</label>
            <select
              value={selectedParcel}
              onChange={(e) => setSelectedParcel(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="ALL">All Parcels ({parcelsList.length})</option>
              {parcelsList.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Observation Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="ALL">All Types ({typesList.length})</option>
              {typesList.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Verification Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Discrepancy Found">Discrepancy Found</option>
              <option value="Under Review">Under Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visual Photo Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        {filteredPhotos.length > 0 ? (
          filteredPhotos.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Photo Banner with Badges */}
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden cursor-pointer" onClick={() => setSelectedPhoto(item)}>
                <img
                  src={item.imageUrl}
                  alt={item.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Top Badges */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold">
                    {item.parcelId} / {item.surveyNo}
                  </span>
                </div>

                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border backdrop-blur-xs ${getStatusBadge(item.verificationStatus)}`}>
                    {item.verificationStatus}
                  </span>
                </div>

                {/* Observation Type Chip on Bottom-Left */}
                <div className="absolute bottom-2 left-2">
                  <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-amber-300 text-[10px] font-bold">
                    {item.evidenceType}
                  </span>
                </div>

                {/* Hover overlay hint */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-slate-800 px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1">
                  <Maximize2 className="w-3 h-3" />
                  <span>Enlarge</span>
                </div>
              </div>

              {/* Photo Metadata */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between text-xs">
                <div className="space-y-1.5">
                  <p className="font-semibold text-slate-900 leading-snug line-clamp-2" title={item.caption}>
                    {item.caption}
                  </p>

                  <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.officerName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.dateTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[10px]">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">{item.gpsCoordinates}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(item)}
                    className="text-xs font-semibold text-slate-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Inspection EXIF</span>
                    <Maximize2 className="w-3 h-3 text-slate-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectParcel) onSelectParcel(item.parcelId);
                      if (onNavigateTab) onNavigateTab('digital-twin');
                    }}
                    className="text-[11px] font-mono font-bold text-amber-700 hover:underline cursor-pointer"
                  >
                    Twin →
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-10 text-center text-slate-400 text-xs">
            No photographic evidence records match the current filter selection.
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-700 overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm">
                  Field Evidence Record #{selectedPhoto.id} — Parcel {selectedPhoto.parcelId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs max-h-[85vh] overflow-y-auto">
              <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden bg-black flex items-center justify-center border border-slate-200">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.caption}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-mono font-bold text-xs border border-slate-200">
                    Parcel #{selectedPhoto.parcelId} ({selectedPhoto.surveyNo})
                  </span>
                  <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-bold text-xs">
                    {selectedPhoto.evidenceType}
                  </span>
                  <span className={`px-2.5 py-1 rounded text-xs font-bold border ${getStatusBadge(selectedPhoto.verificationStatus)}`}>
                    {selectedPhoto.verificationStatus}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const id = selectedPhoto.parcelId;
                    setSelectedPhoto(null);
                    if (onSelectParcel) onSelectParcel(id);
                    if (onNavigateTab) onNavigateTab('digital-twin');
                  }}
                  className="px-3 py-1.5 bg-[#EA580C] hover:bg-[#C2410C] text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>Inspect in 3D Digital Twin</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Geotag & EXIF Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-0.5">
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">Inspecting Officer</span>
                  <div className="font-bold text-slate-800">{selectedPhoto.officerName}</div>
                  <div className="text-slate-500 font-mono text-[10px]">{selectedPhoto.officerId}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-0.5">
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">Timestamp</span>
                  <div className="font-bold text-slate-800">{selectedPhoto.dateTime}</div>
                  <div className="text-slate-500 text-[10px]">Village {selectedPhoto.village}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-0.5">
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">RTK-DGPS Geotag</span>
                  <div className="font-mono font-bold text-amber-800 text-[11px]">{selectedPhoto.gpsCoordinates}</div>
                  <div className="text-emerald-700 text-[10px] font-semibold">✓ Satellite Locked</div>
                </div>
              </div>

              {/* Officer Field Notes */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800 block text-xs">Officer Verification Notes & Assessment:</span>
                <p className="text-slate-700 leading-relaxed text-xs">{selectedPhoto.notes}</p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer font-medium"
                >
                  Close Lightbox
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
