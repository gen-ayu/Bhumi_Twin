import React, { useState } from 'react';
import {
  MessageSquare,
  Bell,
  Calendar,
  Star,
  LifeBuoy,
  X,
  Send,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';
import { NOTIFICATIONS_FEED } from '../../data/mockData';
import { NavTab } from './GovHeader';

interface FloatingDockProps {
  onNavigateTab: (tab: NavTab) => void;
  onInspectParcel?: (parcelId: string) => void;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({ onNavigateTab, onInspectParcel }) => {
  const [activeModal, setActiveModal] = useState<'none' | 'help' | 'alerts' | 'calendar' | 'feedback'>('none');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  return (
    <>
      {/* Floating Action Cluster on right edge (exact MyGov style from user screenshot) */}
      <aside
        id="goi-floating-action-cluster"
        aria-label="Quick tools dock"
        className="fixed right-3 bottom-24 z-40 flex flex-col items-center gap-2.5"
      >
        {/* Help / Query button */}
        <button
          onClick={() => setActiveModal(activeModal === 'help' ? 'none' : 'help')}
          className="w-10 h-10 rounded-full bg-white text-amber-600 border border-amber-300 shadow-lg hover:bg-amber-50 hover:scale-105 flex items-center justify-center transition-all cursor-pointer group"
          title="SIH Decision Support & Guidance"
          aria-label="Decision Support Guidance"
        >
          <Sparkles className="w-5 h-5 text-amber-600 group-hover:rotate-12 transition-transform" />
        </button>

        {/* Notifications / Alerts button with badge */}
        <button
          onClick={() => setActiveModal(activeModal === 'alerts' ? 'none' : 'alerts')}
          className="relative w-10 h-10 rounded-full bg-white text-rose-600 border border-rose-300 shadow-lg hover:bg-rose-50 hover:scale-105 flex items-center justify-center transition-all cursor-pointer"
          title="Active Project Alerts & Discrepancies"
          aria-label="Active Project Alerts"
        >
          <Bell className="w-5 h-5 text-rose-600" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
            4
          </span>
        </button>

        {/* Calendar / Milestones button */}
        <button
          onClick={() => setActiveModal(activeModal === 'calendar' ? 'none' : 'calendar')}
          className="w-10 h-10 rounded-full bg-white text-indigo-600 border border-indigo-300 shadow-lg hover:bg-indigo-50 hover:scale-105 flex items-center justify-center transition-all cursor-pointer"
          title="Statutory Timelines & Gazette Milestones"
          aria-label="Statutory Timelines"
        >
          <Calendar className="w-5 h-5 text-indigo-600" />
        </button>

        {/* Feedback / Grievance button */}
        <button
          onClick={() => setActiveModal(activeModal === 'feedback' ? 'none' : 'feedback')}
          className="w-10 h-10 rounded-full bg-white text-emerald-600 border border-emerald-300 shadow-lg hover:bg-emerald-50 hover:scale-105 flex items-center justify-center transition-all cursor-pointer"
          title="Citizen & Officer Feedback / Grievance"
          aria-label="Feedback and Grievance"
        >
          <MessageSquare className="w-5 h-5 text-emerald-600" />
        </button>
      </aside>

      {/* Flyout Modals */}
      {activeModal === 'alerts' && (
        <div className="fixed right-16 bottom-24 z-50 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-300 p-4 animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h4 className="font-bold text-slate-800 text-sm">Active Decision Alerts</h4>
            </div>
            <button
              onClick={() => setActiveModal('none')}
              className="p-1 hover:bg-slate-100 rounded-md text-slate-500"
              aria-label="Close alerts modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {NOTIFICATIONS_FEED.map((alt) => (
              <div
                key={alt.id}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{alt.title}</span>
                  <span className="text-[10px] text-slate-400">{alt.timestamp}</span>
                </div>
                <p className="text-slate-600 mt-1 line-clamp-2">{alt.description}</p>
                {alt.parcelId && (
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      {alt.parcelId}
                    </span>
                    <button
                      onClick={() => {
                        if (alt.type === 'satellite') onNavigateTab('satellite');
                        else if (alt.parcelId && onInspectParcel) onInspectParcel(alt.parcelId);
                        setActiveModal('none');
                      }}
                      className="text-[10px] text-blue-700 font-bold hover:underline"
                    >
                      {alt.actionLabel || 'Inspect'} →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeModal === 'help' && (
        <div className="fixed right-16 bottom-24 z-50 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-300 p-4 animate-in fade-in slide-in-from-right-4 duration-200 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h4 className="font-bold text-slate-800 text-sm">BHUMI-TWIN Decision Superpowers</h4>
            </div>
            <button
              onClick={() => setActiveModal('none')}
              className="p-1 hover:bg-slate-100 rounded-md text-slate-500"
              aria-label="Close guidance modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2.5 text-slate-600">
            <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-950">
              <span className="font-bold block text-slate-900 mb-0.5">1. Digital Twin & Cadastre</span>
              Unified representation of Project → Parcel → People → Lifecycle → Compensation.
            </div>

            <div className="p-2.5 rounded-lg bg-rose-50/80 border border-rose-200 text-rose-950">
              <span className="font-bold block text-slate-900 mb-0.5">2. Explainable AI Risk Radar (0–100)</span>
              Identifies bottlenecks across ownership disputes, court litigations, valuation discrepancies, and environmental hurdles before they cause delays.
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-emerald-950">
              <span className="font-bold block text-slate-900 mb-0.5">3. What-If Corridor Simulator</span>
              Side-by-side comparison of proposed alignment corridors (Option A vs Option B) to cut displaced families and land acquisition costs.
            </div>

            <button
              onClick={() => {
                onNavigateTab('simulator');
                setActiveModal('none');
              }}
              className="w-full mt-2 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs transition-colors"
            >
              Open What-If Simulator →
            </button>
          </div>
        </div>
      )}

      {activeModal === 'calendar' && (
        <div className="fixed right-16 bottom-24 z-50 w-80 bg-white rounded-xl shadow-2xl border border-slate-300 p-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <h4 className="font-bold text-slate-800 text-sm">Statutory Timelines</h4>
            </div>
            <button
              onClick={() => setActiveModal('none')}
              className="p-1 hover:bg-slate-100 rounded-md text-slate-500"
              aria-label="Close timelines modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2">
            <div className="p-2 rounded border border-slate-200 bg-slate-50">
              <div className="font-bold text-slate-800">14 Sep 2026</div>
              <div className="text-slate-600">Gram Sabha Hearing: Shivpur Village Hall</div>
            </div>
            <div className="p-2 rounded border border-slate-200 bg-slate-50">
              <div className="font-bold text-slate-800">24 Sep 2026</div>
              <div className="text-rose-700 font-medium">District Court Hearing: Parcel P-204 Partition Suit</div>
            </div>
            <div className="p-2 rounded border border-slate-200 bg-slate-50">
              <div className="font-bold text-slate-800">30 Sep 2026</div>
              <div className="text-slate-600">Section 19 Award Declaration Deadline for Package 3B</div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'feedback' && (
        <div className="fixed right-16 bottom-24 z-50 w-80 bg-white rounded-xl shadow-2xl border border-slate-300 p-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-slate-800 text-sm">Grievance & Feedback</h4>
            </div>
            <button
              onClick={() => setActiveModal('none')}
              className="p-1 hover:bg-slate-100 rounded-md text-slate-500"
              aria-label="Close grievance modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {feedbackSent ? (
            <div className="mt-4 p-4 text-center bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
              <span className="font-bold block mb-1">Feedback Recorded</span>
              Reference ID: CPG-2026-9041. Our Land Cell will review within 2 working days.
            </div>
          ) : (
            <div className="mt-3 space-y-2.5">
              <p className="text-slate-600">
                Submit an inquiry, report a survey discrepancy, or ask a question regarding land valuation.
              </p>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Enter details of your query or grievance..."
                rows={3}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
              />
              <button
                onClick={() => {
                  if (feedbackText.trim()) setFeedbackSent(true);
                }}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Grievance</span>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
