import React from 'react';
import { QrCode, Smartphone, ExternalLink, ShieldCheck, Heart, ArrowUp } from 'lucide-react';

export const GovFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="gov-official-footer" className="bg-[#111827] text-slate-300 pt-12 pb-6 border-t-4 border-amber-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Link Columns + App Download Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          
          {/* Col 1: Get Involved */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm tracking-wide uppercase">Get Involved</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#citizen-portal" className="hover:text-amber-400 transition-colors">Citizen Case Tracker</a></li>
              <li><a href="#objections" className="hover:text-amber-400 transition-colors">Submit Section 15 Objection</a></li>
              <li><a href="#hearings" className="hover:text-amber-400 transition-colors">Gram Sabha Public Hearings</a></li>
              <li><a href="#sia" className="hover:text-amber-400 transition-colors">Social Impact Assessment (SIA)</a></li>
              <li><a href="#dbt" className="hover:text-amber-400 transition-colors">Aadhaar DBT Bank Linking</a></li>
              <li><a href="#grievance" className="hover:text-amber-400 transition-colors">CPGRAMS Land Grievance</a></li>
            </ul>
          </div>

          {/* Col 2: Modules */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm tracking-wide uppercase">Core Modules</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#gis-map" className="hover:text-amber-400 transition-colors">GIS Parcel Spatial Map</a></li>
              <li><a href="#digital-twin" className="hover:text-amber-400 transition-colors">Cadastral Digital Twin</a></li>
              <li><a href="#risk-radar" className="hover:text-amber-400 transition-colors">AI Risk Radar & Delay Index</a></li>
              <li><a href="#simulator" className="hover:text-amber-400 transition-colors">What-If Alignment Simulator</a></li>
              <li><a href="#satellite" className="hover:text-amber-400 transition-colors">Sentinel-2 Satellite Alerts</a></li>
              <li><a href="#field" className="hover:text-amber-400 transition-colors">GPS Field Verification</a></li>
            </ul>
          </div>

          {/* Col 3: Help & Support */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm tracking-wide uppercase">Help & Support</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#contact" className="hover:text-amber-400 transition-colors">District Collectorate Desk</a></li>
              <li><a href="#rfctlarr" className="hover:text-amber-400 transition-colors">RFCTLARR Act 2013 FAQs</a></li>
              <li><a href="#rules" className="hover:text-amber-400 transition-colors">State Land Acquisition Rules</a></li>
              <li><a href="#ombudsman" className="hover:text-amber-400 transition-colors">Land Authority Ombudsman</a></li>
              <li><a href="#terms" className="hover:text-amber-400 transition-colors">Website Terms & Conditions</a></li>
              <li><a href="#rti" className="hover:text-amber-400 transition-colors">Right to Information (RTI)</a></li>
            </ul>
          </div>

          {/* Col 4: Useful Links */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm tracking-wide uppercase">National Portals</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5"><a href="https://rural.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">Ministry of Rural Dev <ExternalLink className="w-2.5 h-2.5" /></a></li>
              <li className="flex items-center gap-1.5"><a href="https://mygov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">MyGov.in Portal <ExternalLink className="w-2.5 h-2.5" /></a></li>
              <li className="flex items-center gap-1.5"><a href="https://pmgatishakti.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">PM Gati Shakti Master Plan <ExternalLink className="w-2.5 h-2.5" /></a></li>
              <li className="flex items-center gap-1.5"><a href="https://bhuvan.nrsc.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">ISRO Bhuvan Geo-Portal <ExternalLink className="w-2.5 h-2.5" /></a></li>
              <li className="flex items-center gap-1.5"><a href="https://digitalindia.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">Digital India Land Records <ExternalLink className="w-2.5 h-2.5" /></a></li>
            </ul>
          </div>

          {/* Col 5: App Download Block & QR Code */}
          <div className="space-y-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <h3 className="text-white font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-amber-500" />
              Download Bhumi Mobile
            </h3>
            <p className="text-[11px] text-slate-400">
              Scan to inspect parcel tags, upload field verifications & track compensation on the go.
            </p>
            
            <div className="flex items-center gap-3 pt-1">
              {/* QR Code Graphic Placeholder */}
              <div className="w-16 h-16 bg-white p-1.5 rounded-lg flex items-center justify-center shrink-0 shadow-md">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
              
              <div className="flex flex-col gap-1.5">
                {/* App Store Badge */}
                <div className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-[9px] px-2.5 py-1 rounded flex items-center gap-1.5 cursor-pointer">
                  <span className="font-semibold leading-tight">App Store</span>
                </div>
                {/* Google Play Badge */}
                <div className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-[9px] px-2.5 py-1 rounded flex items-center gap-1.5 cursor-pointer">
                  <span className="font-semibold leading-tight">Google Play</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Follow us + Scroll to top row */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/80 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-medium">Follow Ministry updates:</span>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-7 h-7 rounded-full bg-slate-800 hover:bg-amber-600 flex items-center justify-center cursor-pointer transition-colors font-bold text-[10px]">X</span>
              <span className="w-7 h-7 rounded-full bg-slate-800 hover:bg-amber-600 flex items-center justify-center cursor-pointer transition-colors font-bold text-[10px]">fb</span>
              <span className="w-7 h-7 rounded-full bg-slate-800 hover:bg-amber-600 flex items-center justify-center cursor-pointer transition-colors font-bold text-[10px]">in</span>
              <span className="w-7 h-7 rounded-full bg-slate-800 hover:bg-amber-600 flex items-center justify-center cursor-pointer transition-colors font-bold text-[10px]">yt</span>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors bg-slate-800/60 hover:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Disclaimer & GIGW Compliance Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 text-center md:text-left">
          <div>
            <p className="font-medium text-slate-300">
              BHUMI-TWIN • National Land Acquisition Decision-Intelligence & Digital Twin Platform
            </p>
            <p className="text-slate-400 mt-0.5">
              Developed for Smart India Hackathon (SIH 2026) • Ministry of Rural Development, Government of India.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              GIGW 3.0 & STQC Certified
            </span>
            <span>•</span>
            <span>Security Audited by CERT-In Empanelled Agency</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
