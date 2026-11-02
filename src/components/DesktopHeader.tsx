/**
 * Windows-style Desktop Application Header and Command Ribbon
 */
import React, { useRef } from 'react';
import { Language, DesignState } from '../types/nailing';
import { TRANSLATIONS } from '../utils/translations';
import {
  FileText,
  FolderOpen,
  Save,
  FileCheck,
  Printer,
  HelpCircle,
  Globe,
  Sparkles,
  RotateCcw,
  Download,
} from 'lucide-react';

interface Props {
  state: DesignState;
  onUpdateState: (newState: DesignState) => void;
  lang: Language;
  onToggleLang: () => void;
  onOpenGuidance: () => void;
  onOpenReport: () => void;
  onPrint: () => void;
  onOpenProjectManager: () => void;
  onNewProject: () => void;
  activeMainTab: 'calc' | 'guide' | 'refs' | 'cad' | 'report';
  onSelectMainTab: (tab: 'calc' | 'guide' | 'refs' | 'cad' | 'report') => void;
}

export const DesktopHeader: React.FC<Props> = ({
  state,
  onUpdateState,
  lang,
  onToggleLang,
  onOpenGuidance,
  onOpenReport,
  onPrint,
  onOpenProjectManager,
  onNewProject,
  activeMainTab,
  onSelectMainTab,
}) => {
  const isFa = lang === 'fa';
  const t = TRANSLATIONS[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveSnda = () => {
    const payload = {
      app: 'SoilNailDesignSuite',
      version: '1.0',
      fileFormat: 'SNDA',
      savedAt: new Date().toISOString(),
      metadata: state.metadata,
      state: state,
    };
    const dataStr = 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const fileName = (state.metadata.projectName || state.metadata.projectNumber || 'SoilNail_Design').replace(/\s+/g, '_');
    downloadAnchor.setAttribute('download', `${fileName}.snda`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleOpenSnda = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.state && parsed.state.tendon) {
          onUpdateState(parsed.state);
        } else if (parsed.tendon && parsed.pullout && parsed.plate && parsed.facing && parsed.corrosion) {
          onUpdateState(parsed);
        } else {
          alert(isFa ? 'فرمت فایل پروژه *.SNDA معتبر نیست.' : 'Invalid *.SNDA project file format.');
        }
      } catch (err) {
        alert(isFa ? 'خطا در خواندن فایل *.SNDA.' : 'Failed to parse *.SNDA project file.');
      }
    };
    reader.readAsText(file);
    if (event.target) event.target.value = '';
  };

  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-700 shadow-md select-none sticky top-0 z-40">
      {/* 1. WINDOWS TITLE BAR (32px compact standard title bar) */}
      <div className="px-3 py-1 bg-slate-950 flex items-center justify-between text-xs text-slate-300 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {/* Windows-style Application Icon & Title */}
          <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white font-black text-[11px] shadow-2xs">
            SN
          </div>
          <span className="font-semibold text-slate-200 tracking-wide text-xs">
            AASHTO LRFD (2020) & FHWA GEC-7 Soil Nail Design Suite
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 font-mono text-[11px] bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
            {state.metadata.projectName || (isFa ? 'پروژه جاری' : 'Current Project')} [{state.metadata.projectNumber || 'V1.0'}]
          </span>
        </div>

        {/* Windows Right Corner Controls & Language */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-blue-300 hover:text-white font-medium transition text-xs border border-slate-700"
            title={isFa ? 'تغییر زبان نرم‌افزار به انگلیسی' : 'Switch Language to Persian'}
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold">{isFa ? 'English (EN)' : 'فارسی (FA)'}</span>
          </button>

          {/* Decorative Standard Windows Window Controls */}
          <div className="hidden sm:flex items-center gap-1 text-slate-500 mr-1 ml-2">
            <span className="w-3 h-0.5 bg-slate-600 rounded"></span>
            <span className="w-2.5 h-2.5 border border-slate-600 rounded-xs"></span>
            <span className="text-[11px] font-bold text-slate-500 hover:text-rose-400 cursor-pointer">✕</span>
          </div>
        </div>
      </div>

      {/* 2. UNIFIED STANDARD WINDOWS COMMAND RIBBON & TOOLBAR (Single Merged Row) */}
      <div className="px-3 py-1.5 bg-slate-900 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left Side: File Operations Group + Main Workspace View Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* GROUP 1: FILE & PROJECT MANAGEMENT */}
          <div className="flex items-center gap-1 bg-slate-950/60 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={onNewProject}
              className="px-2.5 py-1 rounded-md hover:bg-slate-800 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
              title={isFa ? 'پروژه جدید با تنظیمات پیش‌فرض (Ctrl+N)' : 'New Project (Ctrl+N)'}
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.navNew}</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 rounded-md hover:bg-slate-800 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
              title={isFa ? 'باز کردن فایل محاسبات (*.SNDA)' : 'Open Project File (*.SNDA)'}
            >
              <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.navOpen}</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleOpenSnda}
              accept=".snda,.json"
              className="hidden"
            />

            <button
              onClick={handleSaveSnda}
              className="px-2.5 py-1 rounded-md hover:bg-slate-800 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
              title={isFa ? 'ذخیره فایل پروژه روی هارددیسک (*.SNDA)' : 'Save Project File (*.SNDA)'}
            >
              <Save className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.navSave}</span>
            </button>

            {/* Project Manager & Archive */}
            <button
              onClick={onOpenProjectManager}
              className="px-2.5 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold flex items-center gap-1.5 border border-amber-500/40 transition shadow-2xs"
              title={isFa ? 'آرشیو و مدیریت پروژه‌های ذخیره شده' : 'Project Archive Manager'}
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.navManageProjects}</span>
            </button>
          </div>

          {/* Windows Divider Line */}
          <div className="h-6 w-px bg-slate-700/80 mx-1 hidden sm:block"></div>

          {/* GROUP 2: MAIN WORKSPACE VIEW TABS (Integrated directly into Toolbar) */}
          <div className="flex items-center gap-1 bg-slate-950/60 p-0.5 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => onSelectMainTab('calc')}
              className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition ${
                activeMainTab === 'calc'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>{isFa ? 'محاسبات طراحی' : 'Design Calculations'}</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectMainTab('guide')}
              className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition ${
                activeMainTab === 'guide'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isFa ? 'راهنمای پارامترها' : 'Step-by-Step Guide'}</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectMainTab('refs')}
              className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition ${
                activeMainTab === 'refs'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-300" />
              <span>{isFa ? 'مبانی و مراجع' : 'Theory & Refs'}</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectMainTab('cad')}
              className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition ${
                activeMainTab === 'cad'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-cyan-300" />
              <span>{isFa ? 'مقاطع و نقشه‌های CAD' : 'CAD Cross-Sections'}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Reporting, Output & Guidance Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenGuidance}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition"
            title={isFa ? 'راهنمای جامع آیین‌نامه و متدولوژی طراحی' : 'Engineering Guidance & Design Criteria'}
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">{t.navGuidance}</span>
          </button>

          <button
            onClick={onPrint}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition"
            title={isFa ? 'چاپ سریع دفترچه محاسبات' : 'Print Calculation Report'}
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{t.navPrint}</span>
          </button>

          <button
            onClick={onOpenReport}
            className="px-3.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition border border-blue-400/40"
            title={isFa ? 'مشاهده و چاپ دفترچه محاسبات رسمی مهندسی' : 'Generate & Export Engineering Report'}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.navExportPdf}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
