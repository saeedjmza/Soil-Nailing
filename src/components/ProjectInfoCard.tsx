/**
 * Project Identification & Metadata Editor Component
 * Manages project name, document number, client, consultant, designer, checker, date, and notes.
 * Directly links to calculation report and *.SNDA file export.
 */
import React, { useState } from 'react';
import { ProjectMetadata, Language } from '../types/nailing';
import { TRANSLATIONS } from '../utils/translations';
import { Building2, User, FileText, Calendar, CheckSquare, ChevronDown, ChevronUp, Info } from 'lucide-react';

interface Props {
  metadata: ProjectMetadata;
  onChange: (metadata: ProjectMetadata) => void;
  lang: Language;
}

export const ProjectInfoCard: React.FC<Props> = ({ metadata, onChange, lang }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isFa = lang === 'fa';
  const t = TRANSLATIONS[lang];

  const updateField = (field: keyof ProjectMetadata, val: string) => {
    onChange({
      ...metadata,
      [field]: val,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
      {/* Clickable Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-5 py-3.5 bg-slate-50 hover:bg-slate-100/80 cursor-pointer border-b border-slate-200 flex items-center justify-between transition select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span>{isFa ? 'شناسنامه و مشخصات پروژه (ورودی‌های دفترچه محاسبات فنی)' : 'Project Information & Calculation Booklet Header'}</span>
              <span className="text-[11px] font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {metadata.projectName || (isFa ? 'بدون عنوان' : 'Untitled')}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              {isFa
                ? `شماره مدرک: ${metadata.projectNumber || '-'} | کارفرما: ${metadata.client || '-'} | محاسب: ${metadata.designer || '-'}`
                : `Doc: ${metadata.projectNumber || '-'} | Client: ${metadata.client || '-'} | Designer: ${metadata.designer || '-'}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            {isExpanded ? (isFa ? 'بستن مشخصات' : 'Collapse') : (isFa ? 'ویرایش مشخصات' : 'Edit Info')}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Expanded Form Inputs */}
      {isExpanded && (
        <div className="p-5 bg-white space-y-4 text-xs">
          <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-100 text-blue-900 flex items-start gap-2 text-[11px]">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              {isFa
                ? 'این اطلاعات مستقیماً بر روی صفحه جلد و پاورقی‌های دفترچه محاسبات رسمی (PDF/چاپ) و فایل ذخیره‌شده SNDA درج می‌شوند.'
                : 'These details are directly printed on the calculation booklet cover page (PDF) and saved into your *.SNDA project file.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Project Name */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {t.projectName} *
              </label>
              <input
                type="text"
                value={metadata.projectName}
                onChange={(e) => updateField('projectName', e.target.value)}
                placeholder={isFa ? 'مثال: پایدارسازی گود تجاری ولیعصر' : 'e.g. Soil Nail Wall Design'}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white"
              />
            </div>

            {/* Doc / Project Number */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {t.projectNumber}
              </label>
              <input
                type="text"
                value={metadata.projectNumber}
                onChange={(e) => updateField('projectNumber', e.target.value)}
                placeholder="CALC-SN-01"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white font-mono"
              />
            </div>

            {/* Client */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {t.client}
              </label>
              <input
                type="text"
                value={metadata.client}
                onChange={(e) => updateField('client', e.target.value)}
                placeholder={isFa ? 'نام کارفرما یا سازمان متقاضی' : 'Client Organization'}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white"
              />
            </div>

            {/* Consultant */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {t.consultant}
              </label>
              <input
                type="text"
                value={metadata.consultant}
                onChange={(e) => updateField('consultant', e.target.value)}
                placeholder={isFa ? 'مهندسین مشاور ژئوتکنیک' : 'Consulting Engineers'}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white"
              />
            </div>

            {/* Designer */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {t.designer}
              </label>
              <input
                type="text"
                value={metadata.designer}
                onChange={(e) => updateField('designer', e.target.value)}
                placeholder={isFa ? 'نام مهندس محاسب' : 'Design Engineer'}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white"
              />
            </div>

            {/* Checker */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {t.checker}
              </label>
              <input
                type="text"
                value={metadata.checker}
                onChange={(e) => updateField('checker', e.target.value)}
                placeholder={isFa ? 'نام کنترل‌کننده فنی' : 'Lead Technical Checker'}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {t.date}
              </label>
              <input
                type="text"
                value={metadata.date}
                onChange={(e) => updateField('date', e.target.value)}
                placeholder="1405/07/11"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white font-mono"
              />
            </div>

            {/* Design Notes */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {t.notes}
              </label>
              <input
                type="text"
                value={metadata.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder={isFa ? 'فرضیات، تراز گمانه‌ها، ضوابط ویژه' : 'Key assumptions & site conditions'}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
