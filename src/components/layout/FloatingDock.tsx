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
      {/* Floating Action Cluster on right edge: Compact, Calm Administrative Utility Dock */}
      <aside
        id="goi-floating-action-cluster"
        aria-label="Quick tools dock"
        className="fixed right-3 bottom-24 z-40 bg-white border border-slate-200 shadow-md rounded-lg p-1 flex flex-col items-center gap-1"
      >
        {/* Help / Guidance button */}
        <button
          onClick={() => setActiveModal(activeModal === 'help' ? 'none' : 'help')}
          className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
            activeModal === 'help' ? 'bg-amber-100 text-amber-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Decision Support Reference & Architecture"
          aria-label="Decision Support Reference"
        >
          <Sparkles className="w-4 h-4 text-amber-700" />
        </button>

        {/* Notifications / Alerts button with subtle badge */}
        <button
          onClick={() => setActiveModal(activeModal === 'alerts' ? 'none' : 'alerts')}
          className={`relative w-9 h-9 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
            activeModal === 'alerts' ? 'bg-rose-100 text-rose-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Active Project Alerts & Injunctions"
          aria-label="Active Project Alerts"
        >
          <Bell className="w-4 h-4 text-slate-700" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-600"></span>
        </button>

        {/* Calendar / Milestones button */}
        <button
          onClick={() => setActiveModal(activeModal === 'calendar' ? 'none' : 'calendar')}
          className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
            activeModal === 'calendar' ? 'bg-indigo-100 text-indigo-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Statutory Timelines & Hearings"
          aria-label="Statutory Timelines"
        >
          <Calendar className="w-4 h-4 text-slate-700" />
        </button>

        {/* Feedback / Grievance button */}
        <button
          onClick={() => setActiveModal(activeModal === 'feedback' ? 'none' : 'feedback')}
          className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
            activeModal === 'feedback' ? 'bg-emerald-100 text-emerald-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Citizen & Officer Grievance Desk"
          aria-label="Feedback and Grievance"
        >
          <MessageSquare className="w-4 h-4 text-slate-700" />
        </button>
      </aside>

      {/* Flyout Modals */}
      {activeModal === 'alerts' && (
        <div className="fixed right-16 bottom-24 z-50 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-slate-200 p-4 animate-in fade-in slide-in-from-right-2 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h4 className="font-bold text-slate-900 text-sm">Active Decision Alerts</h4>
            </div>
            <button
              onClick={() => setActiveModal('none')}
              className="p-1 hover:bg-slate-100 rounded text-slate-500"
              aria-label="Close alerts modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {NOTIFICATIONS_FEED.map((alt) => (
              <div
                key={alt.id}
                className="p-2.5 rounded-md border border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 transition-colors text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{alt.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{alt.timestamp}</span>
                </div>
                <p className="text-slate-600 mt-1 leading-snug">{alt.description}</p>
                {alt.parcelId && (
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                      {alt.parcelId}
                    </span>
                    <button
                      onClick={() => {
                        if (alt.type === 'satellite') onNavigateTab('satellite');
                        else if (alt.parcelId && onInspectParcel) onInspectParcel(alt.parcelId);
                        setActiveModal('none');
                      }}
                      className="text-[11px] text-amber-700 font-bold hover:underline"
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
        <div className="fixed right-16 bottom-24 z-50 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-slate-200 p-4 animate-in fade-in slide-in-from-right-2 duration-150 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h4 className="font-bold text-slate-900 text-sm">Platform Decision Support</h4>
            </div>
            <button
              onClick={() => setActiveModal('none')}
              className="p-1 hover:bg-slate-100 rounded text-slate-500"
              aria-label="Close guidance modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2.5 text-slate-600">
            <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200 text-slate-800">
              <span className="font-bold block text-slate-900 mb-0.5">1. Digital Twin & Cadastre</span>
              Unified representation of Project → Parcel → Landowner → RFCTLARR Lifecycle → Direct Bank Transfer.
            </div>

            <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200 text-slate-800">
              <span className="font-bold block text-slate-900 mb-0.5">2. Decision Support Risk Radar</span>
              Identifies bottlenecks across title partition suits, valuation disputes, and environmental clearances.
            </div>

            <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200 text-slate-800">
              <span className="font-bold block text-slate-900 mb-0.5">3. What-If Corridor Optimizer</span>
              Spatial route evaluation to minimize household displacement, legal friction, and compensation outlay.
            </div>

            <button
              onClick={() => {
                onNavigateTab('simulator');
                setActiveModal('none');
              }}
              className="w-full mt-2 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-bold text-xs transition-colors"
            >
              Open What-If Simulator →
            </button>
          </div>
        </div>
      )}

      {activeModal === 'calendar' && (
        <div className="fixed right-16 bottom-24 z-50 w-80 bg-white rounded-lg shadow-xl border border-slate-200 p-4 text-xs animate-in fade-in slide-in-from-right-2 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-700" />
              <h4 className="font-bold text-slate-900 text-sm">Statutory Timelines</h4>
            </div>
            <button
              onClick={() => setActiveModal('none')}
              className="p-1 hover:bg-slate-100 rounded text-slate-500"
              aria-label="Close timelines modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2">
            <div className="p-2 rounded border border-slate-200 bg-slate-50/70">
              <div className="font-bold text-slate-800">14 Sep 2026</div>
              <div className="text-slate-600">Gram Sabha Hearing: Shivpur Village Hall</div>
            </div>
            <div className="p-2 rounded border border-amber-200 bg-amber-50/50">
              <div className="font-bold text-slate-800">24 Sep 2026</div>
              <div className="text-amber-900 font-medium">District Court Hearing: Parcel PARCEL-001 Partition Suit</div>
            </div>
            <div className="p-2 rounded border border-slate-200 bg-slate-50/70">
              <div className="font-bold text-slate-800">30 Sep 2026</div>
              <div className="text-slate-600">Section 19 Award Declaration Deadline for Package 3B</div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'feedback' && (
        <div className="fixed right-16 bottom-24 z-50 w-80 bg-white rounded-lg shadow-xl border border-slate-200 p-4 text-xs animate-in fade-in slide-in-from-right-2 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-slate-700" />
              <h4 className="font-bold text-slate-900 text-sm">Grievance & Feedback</h4>
            </div>
            <button
              onClick={() => setActiveModal('none')}
              className="p-1 hover:bg-slate-100 rounded text-slate-500"
              aria-label="Close grievance modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {feedbackSent ? (
            <div className="mt-4 p-3 text-center bg-emerald-50 text-emerald-800 rounded border border-emerald-200">
              <span className="font-bold block mb-1">Feedback Registered</span>
              Reference ID: CPG-2026-9041. Land Cell will review within 2 working days.
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
                className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
              />
              <button
                onClick={() => {
                  if (feedbackText.trim()) setFeedbackSent(true);
                }}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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
