import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const CookieBanner: React.FC = () => {
  const { t, language } = useLanguage();
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <aside
      id="goi-cookie-consent-banner"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-slate-300 shadow-2xl py-3 px-4 sm:px-6 lg:px-8 transition-transform duration-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-800">
        <div className="text-center md:text-left leading-relaxed">
          <p>
            {language === 'hi'
              ? 'यह वेबसाइट भारत सरकार के डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम के अनुपालन में बेहतर उपयोगकर्ता अनुभव प्रदान करने और ट्रैफ़िक का विश्लेषण करने के लिए कुकीज़ का उपयोग करती है। स्वीकार पर क्लिक करके, आप नीतियों से सहमत होते हैं: '
              : 'This website uses cookies to provide a better user experience and analyze traffic in compliance with Government of India Digital Personal Data Protection (DPDP) Act. By clicking accept, you agree to the policies outlined in the '}
            <a href="#cookie-settings" className="text-blue-700 underline font-semibold hover:text-blue-800">
              {t('Cookie Settings & Privacy Policy')}
            </a>
            .
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setVisible(false)}
            className="px-3 py-1.5 rounded-full border border-indigo-900 text-indigo-950 hover:bg-slate-100 font-semibold transition-colors cursor-pointer text-[11px]"
          >
            {t('Customize Cookies')}
          </button>
          
          <button
            onClick={() => setVisible(false)}
            className="px-3.5 py-1.5 rounded-full bg-indigo-900 hover:bg-indigo-950 text-white font-semibold transition-colors cursor-pointer text-[11px]"
          >
            {t('Decline optional cookies')}
          </button>

          <button
            onClick={() => setVisible(false)}
            className="px-4 py-1.5 rounded-full bg-[#3B2896] hover:bg-[#2e1d7d] text-white font-bold transition-colors cursor-pointer shadow-xs text-[11px]"
          >
            {t('Accept All Cookies')}
          </button>
        </div>
      </div>
    </aside>
  );
};
