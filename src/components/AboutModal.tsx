/**
 * About Software & Developers Modal (درباره نرم‌افزار و مشخصات توسعه‌دهندگان)
 */
import React from 'react';
import { Language } from '../types/nailing';
import { DeveloperProfileSection } from './DeveloperProfileSection';
import { AppLogo } from './common/AppLogo';
import {
  Info,
  ShieldCheck,
  BookOpen,
  Layers,
  X,
  Cpu,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AboutModal: React.FC<Props> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;
  const isFa = lang === 'fa';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col text-slate-100 overflow-hidden ${
          isFa ? 'rtl text-right' : 'ltr text-left'
        }`}
        dir={isFa ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Info className="w-5 h-5 text-blue-100" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-100">
                {isFa ? 'درباره نرم‌افزار و مشخصات توسعه‌دهندگان' : 'About Software & Development Team'}
              </h2>
              <p className="text-[11px] text-slate-400">
                AASHTO LRFD (9th Ed., 2020) & FHWA-NHI-14-007 (GEC-7) Soil Nail Wall Design Suite
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Software Identity Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <AppLogo size="md" />
                <div>
                  <h3 className="text-sm font-bold text-slate-100">
                    {isFa
                      ? 'سامانه جامع محاسبات و طراحی دیوارهای میخ‌کوبی‌شده (نیلینگ)'
                      : 'Soil Nail Wall Design Suite (LRFD Engineering Platform)'}
                  </h3>
                  <div className="text-[11px] text-slate-400">
                    {isFa
                      ? 'طراحی اجزای داخلی، پوشش‌های سطحی، حفاظت خوردگی و خروجی دفترچه محاسبات فنی'
                      : 'Internal Stability, Facings, Bearing Plates, Corrosion Protection & Official PDF Reports'}
                  </div>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 font-mono text-[11px] font-bold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>v1.0</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80 text-[11px]">
              <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-200">{isFa ? 'مبنای آیین‌نامه‌ای' : 'Design Standards'}</div>
                  <div className="text-slate-400 mt-0.5">AASHTO LRFD (2020) & FHWA-NHI-14-007</div>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 flex items-start gap-2">
                <Layers className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-200">{isFa ? 'نقشه‌های مهندسی' : 'CAD Engineering'}</div>
                  <div className="text-slate-400 mt-0.5">{isFa ? 'مقاطع تعاملی سر نیل و گمانه + فایل *.SNDA' : 'Interactive Nail Head & Borehole CAD'}</div>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-200">{isFa ? 'گزارش رسمی دوزبانه' : 'Bilingual Reporting'}</div>
                  <div className="text-slate-400 mt-0.5">{isFa ? 'دفترچه محاسبات فارسی/انگلیسی با جداول کنترل' : 'Persian RTL & English LTR PDF Booklet'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Developer Identification, Contact, Support & GitHub Section */}
          <DeveloperProfileSection
            lang={lang}
            variant="full"
            appVersion="1.0"
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition text-xs border border-slate-700 cursor-pointer"
          >
            {isFa ? 'بستن' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
