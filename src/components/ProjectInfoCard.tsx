/**
 * Project Identification & Metadata Step Card (Dark Geotechnical Theme)
 */
import React from 'react';
import { ProjectMetadata, Language } from '../types/nailing';
import { TRANSLATIONS } from '../utils/translations';
import { Building2, Info, HelpCircle, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
  metadata: ProjectMetadata;
  onChange: (metadata: ProjectMetadata) => void;
  lang: Language;
  onOpenGuidance?: () => void;
  onNextTab?: () => void;
}

export const ProjectInfoCard: React.FC<Props> = ({ metadata, onChange, lang, onOpenGuidance, onNextTab }) => {
  const isFa = lang === 'fa';
  const t = TRANSLATIONS[lang];

  const updateField = (field: keyof ProjectMetadata, val: string) => {
    onChange({
      ...metadata,
      [field]: val,
    });
  };

  const isMetadataComplete = Boolean(metadata.projectName?.trim() && metadata.projectNumber?.trim());

  return (
    <div className="bg-slate-900/90 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
      {/* Project Info Header */}
      <div className="px-5 py-4 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-300 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </span>
            <span>
              {isFa
                ? 'شناسنامه و مشخصات پروژه (Project Information)'
                : 'Project Information & Booklet Header'}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isFa
              ? 'ثبت مشخصات کارفرما، مهندس مشاور، محاسب و عنوان پروژه برای درج در دفترچه محاسبات PDF و فایل *.SNDA'
              : 'Enter client, consultant, engineer, and project metadata for PDF reports and *.SNDA files'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 border ${
              isMetadataComplete
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/35'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isMetadataComplete ? (isFa ? 'شناسنامه آماده' : 'Ready') : isFa ? 'عنوان پروژه الزامی' : 'Title Req.'}</span>
          </span>

          {onOpenGuidance && (
            <button
              type="button"
              onClick={onOpenGuidance}
              className="text-xs text-sky-300 hover:text-white flex items-center gap-1.5 font-medium bg-sky-500/15 hover:bg-sky-500/25 px-3 py-1.5 rounded-lg border border-sky-500/35 transition cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t.parameterGuidance}</span>
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4 text-xs">
        <div className="p-3 bg-sky-950/35 rounded-xl border border-sky-800/40 text-sky-200 flex items-start gap-2.5 text-[11.5px]">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-sky-100">
              {isFa ? 'سربرگ نخست — مستندسازی پروژه:' : 'Step 1 — Project Documentation:'}
            </span>{' '}
            <span>
              {isFa
                ? 'اطلاعات این بخش مستقیماً در صفحه اول دفترچه محاسبات فنی (PDF)، سربرگ خروجی و مشخصات فایل ذخیره (*.SNDA) ثبت می‌شود. در سربرگ بعدی مشخصات کلی ترانشه و سیستم میخ‌کوبی (موقت یا دائم) را تعیین کنید.'
                : 'These project details appear directly on the PDF calculation booklet cover page and *.SNDA project archive. Next, define the nailing system and service life.'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { key: 'projectName' as const, label: `${t.projectName} *`, placeholder: isFa ? 'پایدارسازی ترانشه پروژه' : 'Soil Nail Wall Design' },
            { key: 'projectNumber' as const, label: t.projectNumber, placeholder: 'CALC-SN-01', mono: true },
            { key: 'client' as const, label: t.client, placeholder: isFa ? 'نام کارفرما' : 'Client Organization' },
            { key: 'consultant' as const, label: t.consultant, placeholder: isFa ? 'مهندسین مشاور ژئوتکنیک' : 'Consulting Engineers' },
            { key: 'designer' as const, label: t.designer, placeholder: isFa ? 'نام مهندس محاسب' : 'Design Engineer' },
            { key: 'checker' as const, label: t.checker, placeholder: isFa ? 'نام کنترل‌کننده فنی' : 'Technical Checker' },
            { key: 'date' as const, label: t.date, placeholder: '1405/07/11', mono: true },
            { key: 'notes' as const, label: t.notes, placeholder: isFa ? 'فرضیات و شرایط ساختگاه پروژه' : 'Site conditions & assumptions' },
          ].map((field) => (
            <div key={field.key} className={field.key === 'projectName' || field.key === 'notes' ? 'sm:col-span-2' : ''}>
              <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1">
                {field.key === 'projectName' && <Building2 className="w-3.5 h-3.5 text-sky-400" />}
                <span>{field.label}</span>
              </label>
              <input
                type="text"
                value={metadata[field.key]}
                onChange={(e) => updateField(field.key, e.target.value)}
                placeholder={field.placeholder}
                className={`w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 focus:outline-none ${
                  field.mono ? 'font-mono' : ''
                }`}
              />
            </div>
          ))}
        </div>

        {onNextTab && (
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onNextTab}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-md cursor-pointer"
            >
              <span>{isFa ? 'ادامه به سربرگ مشخصات سیستم نیلینگ' : 'Next: Nailing System Specs'}</span>
              {isFa ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

