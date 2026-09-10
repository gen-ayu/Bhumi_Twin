import React from 'react';
import { QrCode, Smartphone, ExternalLink, ShieldCheck, ArrowUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const GovFooter: React.FC = () => {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="gov-official-footer" className="bg-[#0f172a] text-slate-300 pt-6 pb-4 border-t-2 border-orange-600 text-xs">
      <div className="w-full max-w-(--breakpoint-2xl) mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Grid: 4 Links Columns + App Download Box */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 pb-5 border-b border-slate-800">
          
          {/* Col 1: Citizen Services */}
          <div className="space-y-2">
            <h3 className="text-white font-bold text-xs tracking-wider uppercase">{t('Citizen Services', 'नागरिक सेवाएं')}</h3>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li><a href="#citizen-portal" className="hover:text-orange-400 transition-colors">{t('Citizen Case Tracker')}</a></li>
              <li><a href="#objections" className="hover:text-orange-400 transition-colors">{t('Submit Section 15 Objection')}</a></li>
              <li><a href="#hearings" className="hover:text-orange-400 transition-colors">{t('Gram Sabha Public Hearings')}</a></li>
              <li><a href="#dbt" className="hover:text-orange-400 transition-colors">{t('Aadhaar DBT Bank Linking')}</a></li>
              <li><a href="#grievance" className="hover:text-orange-400 transition-colors">{t('CPGRAMS Land Grievance')}</a></li>
            </ul>
          </div>

          {/* Col 2: Core Modules */}
          <div className="space-y-2">
            <h3 className="text-white font-bold text-xs tracking-wider uppercase">{t('Core Modules', 'प्रमुख मॉड्यूल')}</h3>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li><a href="#gis-map" className="hover:text-orange-400 transition-colors">{t('GIS Parcel Spatial Map')}</a></li>
              <li><a href="#digital-twin" className="hover:text-orange-400 transition-colors">{t('Cadastral Digital Twin')}</a></li>
              <li><a href="#simulator" className="hover:text-orange-400 transition-colors">{t('What-If Alignment Simulator')}</a></li>
              <li><a href="#satellite" className="hover:text-orange-400 transition-colors">{t('Sentinel-2 Satellite Alerts')}</a></li>
              <li><a href="#field" className="hover:text-orange-400 transition-colors">{t('GPS Field Verification')}</a></li>
            </ul>
          </div>

          {/* Col 3: Statutory & Support */}
          <div className="space-y-2">
            <h3 className="text-white font-bold text-xs tracking-wider uppercase">{t('Help & Support', 'सहायता एवं समर्थन')}</h3>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li><a href="#rfctlarr" className="hover:text-orange-400 transition-colors">{t('RFCTLARR Act 2013 FAQs')}</a></li>
              <li><a href="#rules" className="hover:text-orange-400 transition-colors">{t('State Land Acquisition Rules')}</a></li>
              <li><a href="#ombudsman" className="hover:text-orange-400 transition-colors">{t('Land Authority Ombudsman')}</a></li>
              <li><a href="#terms" className="hover:text-orange-400 transition-colors">{t('Website Terms & Conditions')}</a></li>
              <li><a href="#rti" className="hover:text-orange-400 transition-colors">{t('Right to Information (RTI)')}</a></li>
            </ul>
          </div>

          {/* Col 4: National Portals */}
          <div className="space-y-2">
            <h3 className="text-white font-bold text-xs tracking-wider uppercase">{t('National Portals', 'राष्ट्रीय पोर्टल')}</h3>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li><a href="https://rural.gov.in" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition-colors flex items-center gap-1">{t('Ministry of Rural Dev')} <ExternalLink className="w-2.5 h-2.5" /></a></li>
              <li><a href="https://mygov.in" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition-colors flex items-center gap-1">{t('MyGov.in Portal')} <ExternalLink className="w-2.5 h-2.5" /></a></li>
              <li><a href="https://pmgatishakti.gov.in" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition-colors flex items-center gap-1">{t('PM Gati Shakti Master Plan')} <ExternalLink className="w-2.5 h-2.5" /></a></li>
              <li><a href="https://bhuvan.nrsc.gov.in" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition-colors flex items-center gap-1">{t('ISRO Bhuvan Geo-Portal')} <ExternalLink className="w-2.5 h-2.5" /></a></li>
            </ul>
          </div>

          {/* Col 5: App Download Block (Compact) */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 bg-slate-800/60 p-3 rounded-lg border border-slate-700 flex sm:flex-col justify-between gap-2.5">
            <div>
              <h3 className="text-white font-bold text-[11px] uppercase tracking-wide flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-orange-500" />
                {t('Download Bhumi Mobile', 'भूमि मोबाइल ऐप')}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                {t('Field verification & compensation tracking on mobile.')}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-white p-1 rounded flex items-center justify-center shrink-0">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
              <div className="flex flex-col gap-1 text-[9px]">
                <div className="bg-slate-700 hover:bg-slate-600 px-2 py-0.5 rounded font-semibold text-white cursor-pointer">
                  App Store
                </div>
                <div className="bg-slate-700 hover:bg-slate-600 px-2 py-0.5 rounded font-semibold text-white cursor-pointer">
                  Google Play
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Compact Bottom Bar: Compliance & Back to Top */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10.5px] text-slate-400">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-semibold text-slate-300">
              BHUMI-TWIN • Ministry of Rural Development, Government of India
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              GIGW 3.0 & STQC Certified
            </span>
            <span>•</span>
            <span>SIH 2026</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded text-[10px] cursor-pointer"
          >
            <span>{t('Back to Top', 'शीर्ष पर')}</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>

      </div>
    </footer>
  );
};
