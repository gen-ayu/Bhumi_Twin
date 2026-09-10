import React, { useState } from 'react';
import { Shield, KeyRound, User, Lock, ArrowRight, CheckCircle2, FileText, Info } from 'lucide-react';
import { UserRole } from '../../types';

interface LoginViewProps {
  onLoginSuccess: (role: UserRole, caseId?: string) => void;
  onCancel?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onCancel }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [email, setEmail] = useState('collector.varanasi@gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [citizenCaseId, setCitizenCaseId] = useState('CAS-2026-RAM-204');
  const [error, setError] = useState('');

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    if (role === 'admin') {
      setEmail('collector.varanasi@gov.in');
    } else if (role === 'officer') {
      setEmail('rev.officer.harahua@gov.in');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'citizen') {
      if (!citizenCaseId.trim()) {
        setError('Please enter a valid Case ID or Parcel ID');
        return;
      }
      onLoginSuccess('citizen', citizenCaseId.trim());
    } else {
      onLoginSuccess(selectedRole);
    }
  };

  return (
    <div id="goi-login-screen" className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-100">
      {/* Background Graphic Watermark */}
      <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
        <svg viewBox="0 0 100 120" className="w-[600px] h-[600px] fill-slate-900" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="30" r="14" />
          <path d="M 32 30 Q 30 15, 42 12 Q 50 16, 58 12 Q 70 15, 68 30 Z" />
          <circle cx="50" cy="78" r="18" fill="none" stroke="currentColor" strokeWidth="4" />
        </svg>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Government Portal Header Seal Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          
          {/* Tricolor Accent Header */}
          <div className="h-1.5 w-full flex">
            <div className="h-full w-1/3 bg-[#FF9933]"></div>
            <div className="h-full w-1/3 bg-white"></div>
            <div className="h-full w-1/3 bg-[#138808]"></div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Top Emblem & Title */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-50 border border-amber-200 mb-3 shadow-xs">
                <Shield className="w-7 h-7 text-amber-700" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                BHUMI<span className="text-amber-600">-TWIN</span> Access Portal
              </h2>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Ministry of Rural Development • Government of India
              </p>
              <div className="mt-2 inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                Single Sign-On & Citizen Case Verification
              </div>
            </div>

            {/* Role Selector Tabs (Admin | Officer | Citizen) */}
            <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex mb-6">
              <button
                type="button"
                id="login-role-tab-admin"
                onClick={() => handleRoleChange('admin')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                id="login-role-tab-officer"
                onClick={() => handleRoleChange('officer')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedRole === 'officer'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Officer
              </button>
              <button
                type="button"
                id="login-role-tab-citizen"
                onClick={() => handleRoleChange('citizen')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedRole === 'citizen'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Citizen
              </button>
            </div>

            {error && (
              <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {selectedRole !== 'citizen' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="official-email">
                      Government Email / Parichay ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="official-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-slate-800 bg-white"
                        placeholder="officer@nic.in or name@gov.in"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700" htmlFor="official-password">
                        Security Password
                      </label>
                      <a href="#forgot" className="text-[11px] text-amber-700 hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="official-password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-slate-800 bg-white"
                        placeholder="Enter your confidential password"
                      />
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800">Demonstration Access:</span> Click login to authenticate instantly with active district scope permissions.
                    </div>
                  </div>

                  <button
                    id="submit-official-login-btn"
                    type="submit"
                    className="w-full py-2.5 bg-[#EA580C] hover:bg-[#D97706] text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Login to Official Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                /* Citizen Case Tracking Login */
                <>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 leading-relaxed">
                    <p className="font-semibold mb-1">Welcome Kisan / Landowner</p>
                    <p>Enter your Case Reference ID to check your land acquisition stage, verified award amount, and direct bank transfer status.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="citizen-case-id">
                      Case Reference ID or Parcel ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <input
                        id="citizen-case-id"
                        type="text"
                        required
                        value={citizenCaseId}
                        onChange={(e) => setCitizenCaseId(e.target.value)}
                        placeholder="e.g. CAS-2026-RAM-204 or P-204"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-slate-800 font-mono bg-white"
                      />
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px] text-slate-500">
                      <span>Quick Demo Cases:</span>
                      <button
                        type="button"
                        onClick={() => setCitizenCaseId('CAS-2026-RAM-204')}
                        className="text-emerald-700 hover:underline font-mono font-medium"
                      >
                        CAS-2026-RAM-204 (Rampur)
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => setCitizenCaseId('CAS-2026-BAB-042')}
                        className="text-emerald-700 hover:underline font-mono font-medium"
                      >
                        CAS-2026-BAB-042 (Babatpur)
                      </button>
                    </div>
                  </div>

                  <button
                    id="submit-citizen-login-btn"
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Check Acquisition & Compensation Status</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </form>

            {onCancel && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Return to Active Session
                </button>
              </div>
            )}
          </div>

          {/* Footer of Card */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 text-center text-[10px] text-slate-500">
            Protected by Government of India Cybersecurity Protocols • CERT-In Compliant
          </div>
        </div>
      </div>
    </div>
  );
};
