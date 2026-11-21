/**
 * Windows-Style Desktop Menu Bar & Unified Command Ribbon
 * Styled after Tunnel-application dark slate engineering UI
 */
import React, { useState, useRef, useEffect } from 'react';
import { Language, DesignState, FullCalculationResults } from '../types/nailing';
import { TRANSLATIONS } from '../utils/translations';
import { downloadSndaFile, parseSndaFile } from '../utils/sndaFile';
import { AppLogo } from './common/AppLogo';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  FileText,
  FilePlus,
  FolderOpen,
  Save,
  Printer,
  HelpCircle,
  Globe,
  Sparkles,
  Download,
  Cpu,
  Info,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize2,
  ChevronDown,
  Smartphone,
  Sliders,
  BookOpen,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Archive,
  RotateCcw,
  Building2,
  Compass,
} from 'lucide-react';

export type MainTabId = 'project' | 'system' | 'calc' | 'guide' | 'refs' | 'cad' | 'report';
type ActiveMenu = 'file' | 'edit' | 'view' | 'help' | null;

interface Props {
  state: DesignState;
  results: FullCalculationResults;
  onUpdateState: (newState: DesignState) => void;
  lang: Language;
  onToggleLang: () => void;
  onOpenGuidance: () => void;
  onOpenAboutModal: () => void;
  onOpenReport: () => void;
  onPrint: () => void;
  onOpenProjectManager: () => void;
  onNewProject: () => void;
  onLoadDeepPreset: () => void;
  onOpenWindowsModal: () => void;
  onOpenAndroidModal: () => void;
  activeMainTab: MainTabId;
  onSelectMainTab: (tab: MainTabId) => void;
  // Windows desktop features
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  zoomPercent: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isCompactHeader: boolean;
  onToggleCompactHeader: () => void;
}

export const DesktopHeader: React.FC<Props> = ({
  state,
  results,
  onUpdateState,
  lang,
  onToggleLang,
  onOpenGuidance,
  onOpenAboutModal,
  onOpenReport,
  onPrint,
  onOpenProjectManager,
  onNewProject,
  onLoadDeepPreset,
  onOpenWindowsModal,
  onOpenAndroidModal,
  activeMainTab,
  onSelectMainTab,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoomPercent,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  isFullscreen,
  onToggleFullscreen,
  isCompactHeader,
  onToggleCompactHeader,
}) => {
  const isFa = lang === 'fa';
  const t = TRANSLATIONS[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(null);
  const [fileFeedback, setFileFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const { isInstallable, isInstalled, install } = usePWAInstall();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveMenu(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const toggleMenu = (menu: ActiveMenu) => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  const handleMenuAction = (fn: () => void) => {
    fn();
    setActiveMenu(null);
  };

  const showFileFeedback = (type: 'success' | 'error', msg: string) => {
    setFileFeedback({ type, msg });
    window.setTimeout(() => setFileFeedback(null), 4500);
  };

  const handleSaveSnda = () => {
    const savedFileName = downloadSndaFile(state, { lang });
    showFileFeedback(
      'success',
      isFa
        ? `سناریو با تمام پارامترها در فایل ${savedFileName} ذخیره شد.`
        : `Scenario with all parameters saved to ${savedFileName}.`
    );
  };

  const handleOpenSnda = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (event.target) event.target.value = '';
    if (!file) return;
    try {
      const parsed = await parseSndaFile(file, lang);
      onUpdateState(parsed.state);
      showFileFeedback(
        'success',
        isFa
          ? `سناریو «${parsed.name}» از فایل ${parsed.fileName} با تمام پارامترها فراخوانی شد.`
          : `Loaded scenario "${parsed.name}" from ${parsed.fileName} with all parameters.`
      );
    } catch (err) {
      showFileFeedback(
        'error',
        err instanceof Error
          ? err.message
          : isFa
          ? 'فقط فایل‌های سناریو با پسوند *.snda مجاز هستند.'
          : 'Only *.snda scenario files are allowed.'
      );
    }
  };

  const triggerOpenFile = () => fileInputRef.current?.click();

  // Wire Ctrl+O / Ctrl+S window custom events
  useEffect(() => {
    const onTriggerOpen = () => triggerOpenFile();
    const onTriggerSave = () => handleSaveSnda();
    window.addEventListener('snda:trigger-open', onTriggerOpen);
    window.addEventListener('snda:trigger-save', onTriggerSave);
    return () => {
      window.removeEventListener('snda:trigger-open', onTriggerOpen);
      window.removeEventListener('snda:trigger-save', onTriggerSave);
    };
  });

  const Shortcut: React.FC<{ keys: string }> = ({ keys }) => (
    <span className="text-[10px] font-mono text-slate-400 bg-slate-800/90 px-1.5 py-0.5 rounded border border-slate-700/70 ltr:ml-auto rtl:mr-auto shrink-0">
      {keys}
    </span>
  );

  return (
    <>
      {activeMenu && (
        <div
          className="fixed inset-0 z-[95] bg-black/15 cursor-default"
          onClick={() => setActiveMenu(null)}
        />
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleOpenSnda}
        accept=".snda"
        className="hidden"
      />

      {fileFeedback && (
        <div
          dir={isFa ? 'rtl' : 'ltr'}
          className={`fixed bottom-4 z-[140] max-w-md px-4 py-2.5 rounded-xl border shadow-2xl text-xs font-bold flex items-center gap-2 ${
            isFa ? 'left-4' : 'right-4'
          } ${
            fileFeedback.type === 'success'
              ? 'bg-emerald-950/95 text-emerald-200 border-emerald-500/50'
              : 'bg-rose-950/95 text-rose-200 border-rose-500/50'
          }`}
        >
          {fileFeedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{fileFeedback.msg}</span>
        </div>
      )}

      <header
        dir={isFa ? 'rtl' : 'ltr'}
        className="sticky top-0 z-[100] bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-xs select-none text-slate-200 shadow-xl print:hidden"
      >
        {/* ROW 1: Compact Windows Menu Bar + Quick Command Toolbar */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center justify-between h-11 md:h-10 gap-2">
          {/* Left: App Identity + Classic Windows Menus */}
          <div className="flex items-center gap-1.5 sm:gap-2 relative z-[100] min-w-0">
            <div className="flex items-center gap-2 shrink-0 pe-1.5 border-e border-slate-800">
              <AppLogo size="sm" className="shrink-0" />
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-bold text-slate-100 text-xs sm:text-[13px] whitespace-nowrap truncate max-w-[140px] sm:max-w-none">
                  {isFa ? 'طراحی نیلینگ خاک' : 'Soil Nail Suite'}
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 font-mono text-[10px] font-bold shrink-0">
                  v1.0 LRFD
                </span>
              </div>
            </div>

            {/* Windows Dropdown Menus (Desktop) */}
            <nav className="hidden lg:flex items-center gap-0.5 text-xs">
              {/* FILE MENU */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleMenu('file')}
                  className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap ${
                    activeMenu === 'file' ? 'bg-slate-800 text-amber-300' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <span>{isFa ? 'فایل' : 'File'}</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
                {activeMenu === 'file' && (
                  <div className="absolute top-full mt-1 start-0 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-[110]">
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onNewProject)}
                      className="w-full px-3 py-2 text-start hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 cursor-pointer"
                    >
                      <FilePlus className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>{isFa ? 'پروژه جدید (پیش‌فرض)' : 'New Project'}</span>
                      <Shortcut keys="Ctrl+N" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMenuAction(triggerOpenFile)}
                      className="w-full px-3 py-2 text-start hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 cursor-pointer"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{isFa ? 'باز کردن فایل *.SNDA' : 'Open *.SNDA File...'}</span>
                      <Shortcut keys="Ctrl+O" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMenuAction(handleSaveSnda)}
                      className="w-full px-3 py-2 text-start hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{isFa ? 'ذخیره فایل *.SNDA' : 'Save *.SNDA'}</span>
                      <Shortcut keys="Ctrl+S" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenProjectManager)}
                      className="w-full px-3 py-2 text-start hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 cursor-pointer"
                    >
                      <Archive className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span>{t.navManageProjects}</span>
                    </button>
                    <div className="my-1 border-t border-slate-800" />
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenReport)}
                      className="w-full px-3 py-2 text-start hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{isFa ? 'دفترچه محاسبات / چاپ PDF' : 'Report / Print PDF'}</span>
                      <Shortcut keys="Ctrl+P" />
                    </button>
                  </div>
                )}
              </div>

              {/* EDIT MENU */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleMenu('edit')}
                  className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap ${
                    activeMenu === 'edit' ? 'bg-slate-800 text-amber-300' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <span>{isFa ? 'ویرایش' : 'Edit'}</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
                {activeMenu === 'edit' && (
                  <div className="absolute top-full mt-1 start-0 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-[110]">
                    <button
                      type="button"
                      disabled={!canUndo}
                      onClick={() => handleMenuAction(onUndo)}
                      className="w-full px-3 py-2 text-start hover:bg-slate-800 disabled:opacity-40 flex items-center gap-2.5 text-slate-200 cursor-pointer"
                    >
                      <Undo2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>{isFa ? 'بازگشت به قبل (Undo)' : 'Undo'}</span>
                      <Shortcut keys="Ctrl+Z" />
                    </button>
                    <button
                      type="button"
                      disabled={!canRedo}
                      onClick={() => handleMenuAction(onRedo)}
                      className="w-full px-3 py-2 text-start hover:bg-slate-800 disabled:opacity-40 flex items-center gap-2.5 text-slate-200 cursor-pointer"
                    >
                      <Redo2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>{isFa ? 'انجام مجدد (Redo)' : 'Redo'}</span>
                      <Shortcut keys="Ctrl+Y" />
                    </button>
                    <div className="my-1 border-t border-slate-800" />
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onLoadDeepPreset)}
                      className="w-full px-3 py-2 text-start hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{isFa ? 'بارگذاری سناریو گودبرداری عمیق' : 'Load Deep Excavation Preset'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onNewProject)}
                      className="w-full px-3 py-2 text-start hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{isFa ? 'بازنشانی به پروژه معیار' : 'Reset to Benchmark'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* VIEW MENU */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleMenu('view')}
                  className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap ${
                    activeMenu === 'view' ? 'bg-slate-800 text-amber-300' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <span>{isFa ? 'نما' : 'View'}</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
                {activeMenu === 'view' && (
                  <div className="absolute top-full mt-1 start-0 w-60 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-[110]">
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onZoomIn)}
                      className="w-full px-3 py-2 text-start hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>{isFa ? 'بزرگ‌نمایی' : 'Zoom In'}</span>
                      <Shortcut keys="Ctrl++" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onZoomOut)}
                      className="w-full px-3 py-2 text-start hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 cursor-pointer"
                    >
                      <ZoomOut className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>{isFa ? 'کوچک‌نمایی' : 'Zoom Out'}</span>
                      <Shortcut keys="Ctrl+-" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onResetZoom)}
                      className="w-full px-3 py-2 text-start hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{isFa ? 'اندازه ۱۰۰٪' : 'Reset Zoom'}</span>
                      <Shortcut keys="Ctrl+0" />
                    </button>
                    <div className="my-1 border-t border-slate-800" />
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onToggleFullscreen)}
                      className="w-full px-3 py-2 text-start hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 cursor-pointer"
                    >
                      {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-amber-400" /> : <Maximize className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{isFa ? (isFullscreen ? 'خروج از تمام‌صفحه' : 'تمام‌صفحه') : 'Toggle Fullscreen'}</span>
                      <Shortcut keys="F11" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onToggleCompactHeader)}
                      className="w-full px-3 py-2 text-start hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isFa ? (isCompactHeader ? 'نمایش نوار تب‌ها' : 'نوار فشرده') : 'Compact Header'}</span>
                      <Shortcut keys="Ctrl+M" />
                    </button>
                  </div>
                )}
              </div>

              {/* HELP MENU */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleMenu('help')}
                  className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap ${
                    activeMenu === 'help' ? 'bg-slate-800 text-amber-300' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <span>{isFa ? 'راهنما' : 'Help'}</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
                {activeMenu === 'help' && (
                  <div className="absolute top-full mt-1 start-0 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-[110]">
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenGuidance)}
                      className="w-full px-3 py-2 text-start hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{t.navGuidance}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMenuAction(() => onSelectMainTab('refs'))}
                      className="w-full px-3 py-2 text-start hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>{isFa ? 'مبانی و واژه‌نامه AASHTO' : 'Theory & Glossary'}</span>
                    </button>
                    <div className="my-1 border-t border-slate-800" />
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenWindowsModal)}
                      className="w-full px-3 py-2 text-start hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 cursor-pointer"
                    >
                      <Cpu className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>{isFa ? 'نسخه ویندوز (*.EXE)' : 'Windows .EXE Edition'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenAndroidModal)}
                      className="w-full px-3 py-2 text-start hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 cursor-pointer"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{isFa ? 'نسخه اندروید (WebAPK)' : 'Android App (WebAPK)'}</span>
                    </button>
                    <div className="my-1 border-t border-slate-800" />
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenAboutModal)}
                      className="w-full px-3 py-2 text-start hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{isFa ? 'درباره نرم‌افزار و توسعه‌دهندگان' : 'About & Developers'}</span>
                      <Shortcut keys="F1" />
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* Quick File Save / Open / Undo / Redo */}
            <div className="hidden sm:flex items-center gap-1 border-s border-slate-800 ps-1.5">
              <button
                type="button"
                onClick={handleSaveSnda}
                className="h-7 px-2 rounded-lg bg-emerald-600/15 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/35 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer whitespace-nowrap"
                title={isFa ? 'ذخیره فایل پروژه *.SNDA (Ctrl+S)' : 'Save *.SNDA (Ctrl+S)'}
              >
                <Save className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xl:inline">{t.navSave}</span>
              </button>

              <button
                type="button"
                onClick={triggerOpenFile}
                className="h-7 px-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/35 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer whitespace-nowrap"
                title={isFa ? 'باز کردن فایل *.SNDA (Ctrl+O)' : 'Open *.SNDA (Ctrl+O)'}
              >
                <FolderOpen className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xl:inline">{t.navOpen}</span>
              </button>

              <button
                type="button"
                onClick={onUndo}
                disabled={!canUndo}
                className="h-7 w-7 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-35 text-slate-300 border border-slate-800 flex items-center justify-center transition cursor-pointer"
                title={isFa ? 'بازگشت به قبل (Ctrl+Z)' : 'Undo (Ctrl+Z)'}
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onRedo}
                disabled={!canRedo}
                className="h-7 w-7 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-35 text-slate-300 border border-slate-800 flex items-center justify-center transition cursor-pointer"
                title={isFa ? 'انجام مجدد (Ctrl+Y)' : 'Redo (Ctrl+Y)'}
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Side: Direct PWA Install + Android + Windows EXE + Archive + About + EN/FA + Zoom */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* In-App 1-Click PWA Install Button (when installable & not standalone) */}
            {isInstallable && !isInstalled && (
              <button
                type="button"
                onClick={() => install()}
                className="h-7 sm:h-7 px-2 sm:px-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-md shadow-emerald-600/20 transition cursor-pointer whitespace-nowrap shrink-0"
                title={isFa ? 'نصب مستقیم برنامه روی گوشی یا دسکتاپ' : 'Install App Directly'}
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">{isFa ? 'نصب برنامه' : 'Install'}</span>
              </button>
            )}

            {/* Android App / WebAPK Modal Trigger */}
            <button
              type="button"
              onClick={onOpenAndroidModal}
              className="h-7 px-2 sm:px-2.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/35 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer whitespace-nowrap shrink-0"
              title={isFa ? 'نصب نسخه اندروید و فایل APK' : 'Android App & APK'}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">{isFa ? 'اندروید' : 'Android'}</span>
            </button>

            {/* Windows EXE Modal Trigger */}
            <button
              type="button"
              onClick={onOpenWindowsModal}
              className="h-7 px-2 sm:px-2.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/35 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer whitespace-nowrap shrink-0"
              title={isFa ? 'نسخه ویندوز (*.EXE) و بسته آفلاین' : 'Windows *.EXE Edition'}
            >
              <Cpu className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="font-mono text-[10px]">.EXE</span>
            </button>

            {/* Project Archive Manager */}
            <button
              type="button"
              onClick={onOpenProjectManager}
              className="hidden md:flex h-7 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-[11px] font-semibold items-center gap-1 transition cursor-pointer whitespace-nowrap shrink-0"
              title={t.navManageProjects}
            >
              <Archive className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden xl:inline">{isFa ? 'آرشیو' : 'Projects'}</span>
            </button>

            {/* About Modal */}
            <button
              type="button"
              onClick={onOpenAboutModal}
              className="h-7 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-700/80 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer whitespace-nowrap shrink-0"
              title={isFa ? 'درباره نرم‌افزار و توسعه‌دهندگان (F1)' : 'About & Developers (F1)'}
            >
              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="hidden xl:inline">{isFa ? 'درباره' : 'About'}</span>
            </button>

            {/* Language Switch */}
            <button
              type="button"
              onClick={onToggleLang}
              className="h-7 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700/80 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer whitespace-nowrap shrink-0"
              title={isFa ? 'Switch to English' : 'تغییر به فارسی'}
            >
              <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{isFa ? 'EN' : 'FA'}</span>
            </button>

            {/* Zoom Control (Desktop) */}
            <div className="hidden xl:flex items-center bg-slate-900 border border-slate-800 rounded-lg px-0.5 h-7">
              <button
                type="button"
                onClick={onZoomOut}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
                title="Ctrl+-"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={onResetZoom}
                className="px-1 text-[10px] font-mono text-slate-300 hover:text-white cursor-pointer"
                title="Ctrl+0"
              >
                {zoomPercent}%
              </button>
              <button
                type="button"
                onClick={onZoomIn}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
                title="Ctrl++"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* ROW 2: Desktop Unified Navigation Tabs (Zero Horizontal Scroll) + Real-time Engineering Status */}
        {!isCompactHeader && (
          <div className="hidden md:flex flex-wrap border-t border-slate-800/90 bg-slate-900/70 px-2 sm:px-4 py-1.5 items-center justify-between gap-2 max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => onSelectMainTab('project')}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer whitespace-nowrap shrink-0 ${
                  activeMainTab === 'project'
                    ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-600/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span>{isFa ? '۱. مشخصات پروژه' : '1. Project'}</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectMainTab('system')}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer whitespace-nowrap shrink-0 ${
                  activeMainTab === 'system'
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-600/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Compass className="w-3.5 h-3.5 shrink-0" />
                <span>{isFa ? '۲. سیستم نیلینگ' : '2. System'}</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectMainTab('calc')}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer whitespace-nowrap shrink-0 ${
                  activeMainTab === 'calc'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 shrink-0" />
                <span>{isFa ? '۳. طراحی LRFD' : '3. LRFD Calc'}</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectMainTab('guide')}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer whitespace-nowrap shrink-0 ${
                  activeMainTab === 'guide'
                    ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-600/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>{isFa ? '۴. راهنما' : '4. Guide'}</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectMainTab('refs')}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer whitespace-nowrap shrink-0 ${
                  activeMainTab === 'refs'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>{isFa ? '۵. مبانی و مراجع' : '5. Refs'}</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectMainTab('cad')}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer whitespace-nowrap shrink-0 ${
                  activeMainTab === 'cad'
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-600/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span>{isFa ? '۶. نقشه CAD' : '6. CAD'}</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectMainTab('report')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer whitespace-nowrap shrink-0 ${
                  activeMainTab === 'report'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/50'
                    : 'bg-blue-600/15 hover:bg-blue-600/25 text-blue-200 border border-blue-500/35'
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>{isFa ? '۷. داشبورد و گزارش PDF' : '7. Dashboard & PDF'}</span>
              </button>
            </div>

            {/* Real-Time Engineering Telemetry Badges */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono tabular-nums shrink-0">
              <span className="hidden 2xl:inline-flex items-center gap-1 h-6 px-2 rounded-lg bg-slate-950 border border-slate-800 text-sky-300">
                <span className="text-slate-500">db:</span>
                <strong>φ{state.tendon.barDiameter}</strong>
              </span>
              <span className="hidden 2xl:inline-flex items-center gap-1 h-6 px-2 rounded-lg bg-slate-950 border border-slate-800 text-teal-300">
                <span className="text-slate-500">DD:</span>
                <strong>{state.pullout.drillholeDiameter}mm</strong>
              </span>
              <span className="hidden xl:inline-flex items-center gap-1 h-6 px-2 rounded-lg bg-slate-950 border border-slate-800 text-amber-300">
                <span className="text-slate-500">T0:</span>
                <strong>{results.T0} kN</strong>
              </span>
              <button
                type="button"
                onClick={() => onSelectMainTab('report')}
                title={isFa ? 'مشاهده خلاصه کنترل‌ها در داشبورد' : 'Open Dashboard & Report'}
                className={`inline-flex items-center gap-1 h-6 px-2 rounded-lg font-bold border cursor-pointer transition ${
                  results.isOverallPassed
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                    : 'bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25'
                }`}
              >
                {results.isOverallPassed ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <AlertTriangle className="w-3 h-3" />
                )}
                <span>{results.isOverallPassed ? 'LRFD OK' : 'CHECK NG'}</span>
              </button>
              <button
                type="button"
                onClick={onPrint}
                className="h-6 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 cursor-pointer"
                title={t.navPrint}
              >
                <Printer className="w-3 h-3 text-cyan-400" />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
