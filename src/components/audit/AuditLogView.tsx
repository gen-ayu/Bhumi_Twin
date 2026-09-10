import React, { useState } from 'react';
import { FileText, ShieldCheck, Search, Filter, Hash, CheckCircle2, Download } from 'lucide-react';
import { AUDIT_TRAIL } from '../../data/mockData';
import { AuditRecord } from '../../types';

export const AuditLogView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('All');

  const filteredLogs = AUDIT_TRAIL.filter((item) => {
    if (filterAction !== 'All' && !item.action.includes(filterAction)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.target.toLowerCase().includes(q) ||
        item.actor.toLowerCase().includes(q) ||
        item.action.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div id="audit-log-screen" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-white flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              IMMUTABLE RECORD
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Statutory Cadastral Audit Log
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Government Compliance & Audit Trail
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Cryptographically sealed timeline of all administrative decisions, award uploads, field verifications, and AI model re-scorings.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting signed audit certificate for district records...')}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Signed PDF Ledger</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Actor, Parcel, or Action..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          >
            <option value="All">All Actions</option>
            <option value="FIELD">Field Inspections</option>
            <option value="RISK">AI Risk Evaluations</option>
            <option value="AWARD">Award Declarations</option>
            <option value="R&R">R&R Sanctions</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Audit ID & Timestamp</th>
                <th className="py-3 px-4">Official Actor & Role</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Transition (Old → New)</th>
                <th className="py-3 px-4">Integrity Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-900 block">{log.id}</span>
                    <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-800 block">{log.actor}</span>
                    <span className="text-[10px] text-slate-500">{log.designation} ({log.role})</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 font-mono">
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900">{log.target}</span>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="text-[11px] text-slate-500 line-through truncate">{log.oldValue}</div>
                    <div className="text-[11px] text-emerald-800 font-medium">{log.newValue}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200 w-fit">
                      <Hash className="w-3 h-3 text-slate-400" />
                      <span>{log.hash}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
