/**
 * AASHTO LRFD (2020) & FHWA-NHI-14-007 Soil Nail Wall Design Suite
 * Windows Desktop-style Engineering Application
 */
import React, { useState, useMemo, useEffect } from 'react';
import { DesignState, Language } from './types/nailing';
import { SAMPLE_PROJECT_FROM_PDF, DEEP_EXCAVATION_PRESET } from './constants/standardsData';
import { calculateAll } from './utils/calculations';
import { TRANSLATIONS } from './utils/translations';
import { DesktopHeader } from './components/DesktopHeader';
import { DesignSummaryCard } from './components/DesignSummaryCard';
import { TendonSection } from './components/TendonSection';
import { PulloutSection } from './components/PulloutSection';
import { BearingPlateSection } from './components/BearingPlateSection';
import { FacingSection } from './components/FacingSection';
import { CorrosionSection } from './components/CorrosionSection';
import { InteractiveCrossSectionSvg } from './components/InteractiveCrossSectionSvg';
import { ProjectManagerModal } from './components/ProjectManagerModal';
import { TechnicalReferencesAndGlossary } from './components/TechnicalReferencesAndGlossary';
import { StepByStepGuide } from './components/StepByStepGuide';
import { GuidanceModal } from './components/GuidanceModal';
import { ReportModal } from './components/ReportModal';
import { ProjectInfoCard } from './components/ProjectInfoCard';
import {
  Layers,
  Calculator,
  Compass,
  BookOpen,
  FileText,
  FolderOpen,
  Save,
  CheckCircle,
  AlertTriangle,
  Info,
  Shield,
  Activity,
  Cpu,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Sliders,
  Check,
  LayoutGrid,
  FileCheck,
} from 'lucide-react';

export type CalcModuleId = 'tendon' | 'pullout' | 'plate' | 'facing' | 'corrosion' | 'cad' | 'all';

export default function App() {
  const [lang, setLang] = useState<Language>('fa');
  const [state, setState] = useState<DesignState>(SAMPLE_PROJECT_FROM_PDF);
  const [activeMainTab, setActiveMainTab] = useState<'calc' | 'guide' | 'refs' | 'cad' | 'report'>('calc');
  const [activeCalcModule, setActiveCalcModule] = useState<CalcModuleId>('tendon');
  const [isSummaryExpanded, setIsSummaryExpanded] = useState<boolean>(true);
  const [isProjectInfoExpanded, setIsProjectInfoExpanded] = useState<boolean>(false);
  const [isProjectManagerOpen, setIsProjectManagerOpen] = useState(false);
  const [isGuidanceOpen, setIsGuidanceOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Recalculate everything in real-time
  const results = useMemo(() => {
    return calculateAll(state);
  }, [state]);

  const isFa = lang === 'fa';
  const t = TRANSLATIONS[lang];

  // Update HTML title & dir based on language
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isFa ? 'rtl' : 'ltr';
  }, [lang, isFa]);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'fa' ? 'en' : 'fa'));
  };

  const handleNewProject = () => {
    if (confirm(isFa ? 'آیا مایل به ایجاد یک پروژه جدید با تنظیمات پیش‌فرض هستید؟' : 'Create a new blank project with defaults?')) {
      setState(SAMPLE_PROJECT_FROM_PDF);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-100 flex flex-col font-sans ${isFa ? 'font-vazir' : ''}`}>
      {/* 1. UNIFIED WINDOWS DESKTOP COMMAND & NAVIGATION HEADER */}
      <DesktopHeader
        state={state}
        onUpdateState={setState}
        lang={lang}
        onToggleLang={handleToggleLang}
        onOpenGuidance={() => setIsGuidanceOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        onPrint={() => setIsReportOpen(true)}
        onOpenProjectManager={() => setIsProjectManagerOpen(true)}
        onNewProject={handleNewProject}
        activeMainTab={activeMainTab}
        onSelectMainTab={setActiveMainTab}
      />

      {/* 2. MAIN APPLICATION WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 space-y-4">
        {/* TOP DOCK: COLLAPSIBLE EXECUTIVE KPI MONITOR & PROJECT METADATA */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>{isFa ? 'داشبورد نظارت مهندسی و مشخصات پروژه' : 'Engineering Dashboard & Project Setup'}</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${results.isOverallPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {results.isOverallPassed ? (isFa ? 'کلیه کنترل‌ها OK' : 'ALL CHECKS PASS') : (isFa ? 'نیازمند اصلاح (NG)' : 'REVISION REQ.')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition ${
                  isSummaryExpanded ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{isFa ? 'خلاصه شاخص‌ها و نسبت‌های CDR' : 'Executive CDR Ratios'}</span>
                {isSummaryExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              <button
                type="button"
                onClick={() => setIsProjectInfoExpanded(!isProjectInfoExpanded)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition ${
                  isProjectInfoExpanded ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{isFa ? 'مشخصات و فرضیات پروژه' : 'Project Metadata'}</span>
                {isProjectInfoExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Collapsible Executive Summary Card */}
          {isSummaryExpanded && (
            <div className="p-3 border-b border-slate-100 bg-slate-50/50">
              <DesignSummaryCard state={state} results={results} lang={lang} />
            </div>
          )}

          {/* Collapsible Project Metadata Form */}
          {isProjectInfoExpanded && (
            <div className="p-3 bg-white border-t border-slate-200">
              <ProjectInfoCard
                metadata={state.metadata}
                onChange={(metadata) => setState({ ...state, metadata })}
                lang={lang}
              />
            </div>
          )}
        </div>

        {/* TAB 1: DESIGN CALCULATIONS */}
        {activeMainTab === 'calc' && (
          <div className="space-y-4">
            {/* WINDOWS DESKTOP CALCULATION MODULE RIBBON / STEP BAR */}
            <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2 px-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span>{isFa ? 'ماژول‌های محاسباتی طراحی نیلینگ (گردش کار گام‌به‌گام ویندوز):' : 'Soil Nail Design Modules (Step Workflow):'}</span>
                </div>
                <div className="text-[11px] text-indigo-600 font-semibold">
                  {isFa ? 'پرش مستقیم به هر گام دلخواه با ۱ کلیک (بدون نیاز به طی گام‌های میانی)' : 'Direct 1-click jump to any step (non-sequential workflow)'}
                </div>
              </div>

              {/* Module Buttons Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 text-xs">
                {/* 1. Tendon */}
                <button
                  type="button"
                  onClick={() => setActiveCalcModule('tendon')}
                  className={`p-2 rounded-lg border ${isFa ? 'text-right' : 'text-left'} transition flex flex-col justify-between ${
                    activeCalcModule === 'tendon'
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-500 font-bold'
                      : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold flex items-center gap-1 text-[11px]">
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
                      <span>{isFa ? 'میلگرد کششی' : 'Tendon'}</span>
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${results.tendon.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {results.tendon.isPassed ? 'OK' : 'NG'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono" dir="ltr">
                    φ{state.tendon.barDiameter}mm (CDR={results.tendon.capacityDemandRatio})
                  </div>
                </button>

                {/* 2. Pullout */}
                <button
                  type="button"
                  onClick={() => setActiveCalcModule('pullout')}
                  className={`p-2 rounded-lg border ${isFa ? 'text-right' : 'text-left'} transition flex flex-col justify-between ${
                    activeCalcModule === 'pullout'
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-500 font-bold'
                      : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold flex items-center gap-1 text-[11px]">
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">2</span>
                      <span>{isFa ? 'بیرون‌کشیدگی دوغاب' : 'Pullout'}</span>
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${results.pullout.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {results.pullout.isPassed ? 'OK' : 'NG'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono" dir="ltr">
                    DD={state.pullout.drillholeDiameter}mm (CDR={results.pullout.capacityDemandRatio})
                  </div>
                </button>

                {/* 3. Bearing Plate */}
                <button
                  type="button"
                  onClick={() => setActiveCalcModule('plate')}
                  className={`p-2 rounded-lg border ${isFa ? 'text-right' : 'text-left'} transition flex flex-col justify-between ${
                    activeCalcModule === 'plate'
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-500 font-bold'
                      : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold flex items-center gap-1 text-[11px]">
                      <span className="w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-black">3</span>
                      <span>{isFa ? 'صفحه سر نیل' : 'Bearing Plate'}</span>
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${results.plate.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {results.plate.isPassed ? 'OK' : 'NG'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono" dir="ltr">
                    {state.plate.plateWidth}×{state.plate.plateWidth}cm (t={state.plate.plateThickness}cm)
                  </div>
                </button>

                {/* 4. Facing */}
                <button
                  type="button"
                  onClick={() => setActiveCalcModule('facing')}
                  className={`p-2 rounded-lg border ${isFa ? 'text-right' : 'text-left'} transition flex flex-col justify-between ${
                    activeCalcModule === 'facing'
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-500 font-bold'
                      : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold flex items-center gap-1 text-[11px]">
                      <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">4</span>
                      <span>{isFa ? 'رویه شاتکریت و بتن' : 'Facings'}</span>
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${results.tempFlexure.isPassed && results.tempPunching.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {results.tempFlexure.isPassed && results.tempPunching.isPassed ? 'OK' : 'NG'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono" dir="ltr">
                    h={state.facing.tempThickness}/{state.facing.permThickness}mm
                  </div>
                </button>

                {/* 5. Corrosion */}
                <button
                  type="button"
                  onClick={() => setActiveCalcModule('corrosion')}
                  className={`p-2 rounded-lg border ${isFa ? 'text-right' : 'text-left'} transition flex flex-col justify-between ${
                    activeCalcModule === 'corrosion'
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-500 font-bold'
                      : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold flex items-center gap-1 text-[11px]">
                      <span className="w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-black">5</span>
                      <span>{isFa ? 'حفاظت خوردگی' : 'Corrosion'}</span>
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${results.corrosion.isClassAdequate ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {results.corrosion.isClassAdequate ? 'OK' : 'NG'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono" dir="ltr">
                    {state.corrosion.selectedClass}
                  </div>
                </button>

                {/* 6. CAD */}
                <button
                  type="button"
                  onClick={() => setActiveCalcModule('cad')}
                  className={`p-2 rounded-lg border ${isFa ? 'text-right' : 'text-left'} transition flex flex-col justify-between ${
                    activeCalcModule === 'cad'
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-500 font-bold'
                      : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold flex items-center gap-1 text-[11px]">
                      <span className="w-4 h-4 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-black">6</span>
                      <span>{isFa ? 'مقطع و نقشه CAD' : 'CAD Drawing'}</span>
                    </span>
                    <span className="text-[10px] px-1 py-0.2 rounded bg-slate-200 text-slate-700 font-bold">
                      SVG
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {isFa ? 'جزئیات اجرایی' : 'Cross-Section'}
                  </div>
                </button>

                {/* 7. All Modules (Continuous Scroll View) */}
                <button
                  type="button"
                  onClick={() => setActiveCalcModule('all')}
                  className={`p-2 rounded-lg border ${isFa ? 'text-right' : 'text-left'} transition flex flex-col justify-between ${
                    activeCalcModule === 'all'
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs ring-1 ring-indigo-500 font-bold'
                      : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold flex items-center gap-1 text-[11px]">
                      <LayoutGrid className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{isFa ? 'نمای یکپارچه' : 'All Sections'}</span>
                    </span>
                  </div>
                  <div className="text-[10px] text-indigo-700 font-semibold">
                    {isFa ? 'نمایش تمام بخش‌ها' : 'Continuous View'}
                  </div>
                </button>
              </div>
            </div>

            {/* MODULE WORKSPACE: RENDER BASED ON ACTIVE SELECTION */}
            {/* 1. Nail Tendon Tension */}
            {(activeCalcModule === 'tendon' || activeCalcModule === 'all') && (
              <div className="space-y-3">
                <TendonSection
                  inputs={state.tendon}
                  results={results.tendon}
                  onChange={(tendon) => setState({ ...state, tendon })}
                  lang={lang}
                  onOpenGuidance={() => setIsGuidanceOpen(true)}
                />
                {activeCalcModule === 'tendon' && (
                  <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                        <Sliders className="w-3.5 h-3.5 text-blue-600" />
                        <span>{isFa ? 'گردش کار طراحی — پرش مستقیم به هر گام دلخواه:' : 'Design Workflow — Direct Jump to Any Step:'}</span>
                      </div>
                      <div className="text-[11px] text-blue-700 font-medium">
                        {isFa ? 'برای رفتن مستقیم به هر گام (مثلاً از گام ۱ به ۴) روی دکمه آن کلیک کنید' : 'Click any step button to jump directly without intermediate steps'}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                      <button
                        type="button"
                        disabled
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 opacity-40 cursor-not-allowed bg-slate-100 text-slate-400"
                      >
                        {isFa ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                        <span>{isFa ? 'گام قبلی' : 'Previous'}</span>
                      </button>

                      {/* Direct Jump Step Selector */}
                      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                        {[
                          { id: 'tendon', step: 1, nameFa: 'میلگرد کششی', nameEn: 'Tendon', ok: results.tendon.isPassed },
                          { id: 'pullout', step: 2, nameFa: 'بیرون‌کشیدگی دوغاب', nameEn: 'Pullout', ok: results.pullout.isPassed },
                          { id: 'plate', step: 3, nameFa: 'صفحه سر نیل', nameEn: 'Bearing Plate', ok: results.plate.isPassed },
                          { id: 'facing', step: 4, nameFa: 'رویه شاتکریت و بتن', nameEn: 'Facings', ok: results.tempFlexure.isPassed && results.tempPunching.isPassed },
                          { id: 'corrosion', step: 5, nameFa: 'حفاظت خوردگی', nameEn: 'Corrosion', ok: results.corrosion.isClassAdequate },
                          { id: 'cad', step: 6, nameFa: 'نقشه CAD', nameEn: 'CAD Drawing', ok: true },
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveCalcModule(item.id as CalcModuleId)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                              activeCalcModule === item.id
                                ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-400 font-bold'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                            title={isFa ? `پرش مستقیم به گام ${item.step}: ${item.nameFa}` : `Jump directly to Step ${item.step}: ${item.nameEn}`}
                          >
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                              activeCalcModule === item.id ? 'bg-white text-blue-700' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {item.step}
                            </span>
                            <span className="hidden sm:inline">{isFa ? item.nameFa : item.nameEn}</span>
                            {item.id !== 'cad' && (
                              <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                                item.ok
                                  ? (activeCalcModule === item.id ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800')
                                  : (activeCalcModule === item.id ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-800')
                              }`}>
                                {item.ok ? 'OK' : 'NG'}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveCalcModule('pullout')}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition shadow-xs"
                      >
                        <span>{isFa ? 'گام بعدی: بیرون‌کشیدگی دوغاب' : 'Next: Grout Pullout'}</span>
                        {isFa ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. Borehole & Pullout Resistance */}
            {(activeCalcModule === 'pullout' || activeCalcModule === 'all') && (
              <div className="space-y-3">
                <PulloutSection
                  inputs={state.pullout}
                  results={results.pullout}
                  Tmax={state.tendon.Tmax}
                  loadFactorEV={state.tendon.loadFactorEV}
                  onChange={(pullout) => setState({ ...state, pullout })}
                  lang={lang}
                  onOpenGuidance={() => setIsGuidanceOpen(true)}
                />
                {activeCalcModule === 'pullout' && (
                  <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                        <Sliders className="w-3.5 h-3.5 text-blue-600" />
                        <span>{isFa ? 'گردش کار طراحی — پرش مستقیم به هر گام دلخواه:' : 'Design Workflow — Direct Jump to Any Step:'}</span>
                      </div>
                      <div className="text-[11px] text-blue-700 font-medium">
                        {isFa ? 'امکان ورود مستقیم به گام‌های ۱ تا ۶ بدون اجبار به طی مراحل متوالی' : 'Jump directly between steps without passing intermediate ones'}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => setActiveCalcModule('tendon')}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      >
                        {isFa ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                        <span>{isFa ? 'گام ۱: میلگرد' : 'Prev: Tendon'}</span>
                      </button>

                      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                        {[
                          { id: 'tendon', step: 1, nameFa: 'میلگرد کششی', nameEn: 'Tendon', ok: results.tendon.isPassed },
                          { id: 'pullout', step: 2, nameFa: 'بیرون‌کشیدگی دوغاب', nameEn: 'Pullout', ok: results.pullout.isPassed },
                          { id: 'plate', step: 3, nameFa: 'صفحه سر نیل', nameEn: 'Bearing Plate', ok: results.plate.isPassed },
                          { id: 'facing', step: 4, nameFa: 'رویه شاتکریت و بتن', nameEn: 'Facings', ok: results.tempFlexure.isPassed && results.tempPunching.isPassed },
                          { id: 'corrosion', step: 5, nameFa: 'حفاظت خوردگی', nameEn: 'Corrosion', ok: results.corrosion.isClassAdequate },
                          { id: 'cad', step: 6, nameFa: 'نقشه CAD', nameEn: 'CAD Drawing', ok: true },
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveCalcModule(item.id as CalcModuleId)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                              activeCalcModule === item.id
                                ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-400 font-bold'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                              activeCalcModule === item.id ? 'bg-white text-blue-700' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {item.step}
                            </span>
                            <span className="hidden sm:inline">{isFa ? item.nameFa : item.nameEn}</span>
                            {item.id !== 'cad' && (
                              <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                                item.ok
                                  ? (activeCalcModule === item.id ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800')
                                  : (activeCalcModule === item.id ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-800')
                              }`}>
                                {item.ok ? 'OK' : 'NG'}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveCalcModule('plate')}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition shadow-xs"
                      >
                        <span>{isFa ? 'گام بعدی: صفحه سر نیل' : 'Next: Bearing Plate'}</span>
                        {isFa ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. Nail Head Bearing Plate */}
            {(activeCalcModule === 'plate' || activeCalcModule === 'all') && (
              <div className="space-y-3">
                <BearingPlateSection
                  inputs={state.plate}
                  results={results.plate}
                  T0={results.T0}
                  onChange={(plate) => setState({ ...state, plate })}
                  lang={lang}
                  onOpenGuidance={() => setIsGuidanceOpen(true)}
                />
                {activeCalcModule === 'plate' && (
                  <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                        <Sliders className="w-3.5 h-3.5 text-blue-600" />
                        <span>{isFa ? 'گردش کار طراحی — پرش مستقیم به هر گام دلخواه:' : 'Design Workflow — Direct Jump to Any Step:'}</span>
                      </div>
                      <div className="text-[11px] text-blue-700 font-medium">
                        {isFa ? 'امکان ورود مستقیم به گام‌های ۱ تا ۶ بدون اجبار به طی مراحل متوالی' : 'Jump directly between steps without passing intermediate ones'}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => setActiveCalcModule('pullout')}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      >
                        {isFa ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                        <span>{isFa ? 'گام ۲: بیرون‌کشیدگی' : 'Prev: Pullout'}</span>
                      </button>

                      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                        {[
                          { id: 'tendon', step: 1, nameFa: 'میلگرد کششی', nameEn: 'Tendon', ok: results.tendon.isPassed },
                          { id: 'pullout', step: 2, nameFa: 'بیرون‌کشیدگی دوغاب', nameEn: 'Pullout', ok: results.pullout.isPassed },
                          { id: 'plate', step: 3, nameFa: 'صفحه سر نیل', nameEn: 'Bearing Plate', ok: results.plate.isPassed },
                          { id: 'facing', step: 4, nameFa: 'رویه شاتکریت و بتن', nameEn: 'Facings', ok: results.tempFlexure.isPassed && results.tempPunching.isPassed },
                          { id: 'corrosion', step: 5, nameFa: 'حفاظت خوردگی', nameEn: 'Corrosion', ok: results.corrosion.isClassAdequate },
                          { id: 'cad', step: 6, nameFa: 'نقشه CAD', nameEn: 'CAD Drawing', ok: true },
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveCalcModule(item.id as CalcModuleId)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                              activeCalcModule === item.id
                                ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-400 font-bold'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                              activeCalcModule === item.id ? 'bg-white text-blue-700' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {item.step}
                            </span>
                            <span className="hidden sm:inline">{isFa ? item.nameFa : item.nameEn}</span>
                            {item.id !== 'cad' && (
                              <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                                item.ok
                                  ? (activeCalcModule === item.id ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800')
                                  : (activeCalcModule === item.id ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-800')
                              }`}>
                                {item.ok ? 'OK' : 'NG'}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveCalcModule('facing')}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition shadow-xs"
                      >
                        <span>{isFa ? 'گام بعدی: رویه شاتکریت و بتن' : 'Next: Facing Design'}</span>
                        {isFa ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. Facings: Flexure, Punching Shear & Headed Studs */}
            {(activeCalcModule === 'facing' || activeCalcModule === 'all') && (
              <div className="space-y-3">
                <FacingSection
                  inputs={state.facing}
                  tempFlexure={results.tempFlexure}
                  tempPunching={results.tempPunching}
                  permFlexure={results.permFlexure}
                  permPunching={results.permPunching}
                  headedStuds={results.headedStuds}
                  T0={results.T0}
                  onChange={(facing) => setState({ ...state, facing })}
                  lang={lang}
                  onOpenGuidance={() => setIsGuidanceOpen(true)}
                />
                {activeCalcModule === 'facing' && (
                  <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                        <Sliders className="w-3.5 h-3.5 text-blue-600" />
                        <span>{isFa ? 'گردش کار طراحی — پرش مستقیم به هر گام دلخواه:' : 'Design Workflow — Direct Jump to Any Step:'}</span>
                      </div>
                      <div className="text-[11px] text-blue-700 font-medium">
                        {isFa ? 'امکان ورود مستقیم به گام‌های ۱ تا ۶ بدون اجبار به طی مراحل متوالی' : 'Jump directly between steps without passing intermediate ones'}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => setActiveCalcModule('plate')}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      >
                        {isFa ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                        <span>{isFa ? 'گام ۳: صفحه سر نیل' : 'Prev: Bearing Plate'}</span>
                      </button>

                      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                        {[
                          { id: 'tendon', step: 1, nameFa: 'میلگرد کششی', nameEn: 'Tendon', ok: results.tendon.isPassed },
                          { id: 'pullout', step: 2, nameFa: 'بیرون‌کشیدگی دوغاب', nameEn: 'Pullout', ok: results.pullout.isPassed },
                          { id: 'plate', step: 3, nameFa: 'صفحه سر نیل', nameEn: 'Bearing Plate', ok: results.plate.isPassed },
                          { id: 'facing', step: 4, nameFa: 'رویه شاتکریت و بتن', nameEn: 'Facings', ok: results.tempFlexure.isPassed && results.tempPunching.isPassed },
                          { id: 'corrosion', step: 5, nameFa: 'حفاظت خوردگی', nameEn: 'Corrosion', ok: results.corrosion.isClassAdequate },
                          { id: 'cad', step: 6, nameFa: 'نقشه CAD', nameEn: 'CAD Drawing', ok: true },
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveCalcModule(item.id as CalcModuleId)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                              activeCalcModule === item.id
                                ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-400 font-bold'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                              activeCalcModule === item.id ? 'bg-white text-blue-700' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {item.step}
                            </span>
                            <span className="hidden sm:inline">{isFa ? item.nameFa : item.nameEn}</span>
                            {item.id !== 'cad' && (
                              <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                                item.ok
                                  ? (activeCalcModule === item.id ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800')
                                  : (activeCalcModule === item.id ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-800')
                              }`}>
                                {item.ok ? 'OK' : 'NG'}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveCalcModule('corrosion')}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition shadow-xs"
                      >
                        <span>{isFa ? 'گام بعدی: حفاظت خوردگی' : 'Next: Corrosion'}</span>
                        {isFa ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. Soil Corrosiveness & Permanent Protection */}
            {(activeCalcModule === 'corrosion' || activeCalcModule === 'all') && (
              <div className="space-y-3">
                <CorrosionSection
                  inputs={state.corrosion}
                  results={results.corrosion}
                  barDiameter={state.tendon.barDiameter}
                  onChange={(corrosion) => setState({ ...state, corrosion })}
                  lang={lang}
                  onOpenGuidance={() => setIsGuidanceOpen(true)}
                />
                {activeCalcModule === 'corrosion' && (
                  <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                        <Sliders className="w-3.5 h-3.5 text-blue-600" />
                        <span>{isFa ? 'گردش کار طراحی — پرش مستقیم به هر گام دلخواه:' : 'Design Workflow — Direct Jump to Any Step:'}</span>
                      </div>
                      <div className="text-[11px] text-blue-700 font-medium">
                        {isFa ? 'امکان ورود مستقیم به گام‌های ۱ تا ۶ بدون اجبار به طی مراحل متوالی' : 'Jump directly between steps without passing intermediate ones'}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => setActiveCalcModule('facing')}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      >
                        {isFa ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                        <span>{isFa ? 'گام ۴: رویه فیس' : 'Prev: Facing'}</span>
                      </button>

                      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                        {[
                          { id: 'tendon', step: 1, nameFa: 'میلگرد کششی', nameEn: 'Tendon', ok: results.tendon.isPassed },
                          { id: 'pullout', step: 2, nameFa: 'بیرون‌کشیدگی دوغاب', nameEn: 'Pullout', ok: results.pullout.isPassed },
                          { id: 'plate', step: 3, nameFa: 'صفحه سر نیل', nameEn: 'Bearing Plate', ok: results.plate.isPassed },
                          { id: 'facing', step: 4, nameFa: 'رویه شاتکریت و بتن', nameEn: 'Facings', ok: results.tempFlexure.isPassed && results.tempPunching.isPassed },
                          { id: 'corrosion', step: 5, nameFa: 'حفاظت خوردگی', nameEn: 'Corrosion', ok: results.corrosion.isClassAdequate },
                          { id: 'cad', step: 6, nameFa: 'نقشه CAD', nameEn: 'CAD Drawing', ok: true },
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveCalcModule(item.id as CalcModuleId)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                              activeCalcModule === item.id
                                ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-400 font-bold'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                              activeCalcModule === item.id ? 'bg-white text-blue-700' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {item.step}
                            </span>
                            <span className="hidden sm:inline">{isFa ? item.nameFa : item.nameEn}</span>
                            {item.id !== 'cad' && (
                              <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                                item.ok
                                  ? (activeCalcModule === item.id ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800')
                                  : (activeCalcModule === item.id ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-800')
                              }`}>
                                {item.ok ? 'OK' : 'NG'}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveCalcModule('cad')}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition shadow-xs"
                      >
                        <span>{isFa ? 'مشاهده مقطع و نقشه CAD' : 'View CAD Section'}</span>
                        {isFa ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 6. Embedded CAD Cross-Section */}
            {(activeCalcModule === 'cad' || activeCalcModule === 'all') && (
              <div className="space-y-3">
                <InteractiveCrossSectionSvg state={state} results={results} lang={lang} />
                {activeCalcModule === 'cad' && (
                  <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                        <Sliders className="w-3.5 h-3.5 text-blue-600" />
                        <span>{isFa ? 'گردش کار طراحی — پرش مستقیم به هر گام دلخواه:' : 'Design Workflow — Direct Jump to Any Step:'}</span>
                      </div>
                      <div className="text-[11px] text-blue-700 font-medium">
                        {isFa ? 'امکان ورود مستقیم به گام‌های ۱ تا ۶ بدون اجبار به طی مراحل متوالی' : 'Jump directly between steps without passing intermediate ones'}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => setActiveCalcModule('corrosion')}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      >
                        {isFa ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                        <span>{isFa ? 'گام ۵: حفاظت خوردگی' : 'Prev: Corrosion'}</span>
                      </button>

                      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                        {[
                          { id: 'tendon', step: 1, nameFa: 'میلگرد کششی', nameEn: 'Tendon', ok: results.tendon.isPassed },
                          { id: 'pullout', step: 2, nameFa: 'بیرون‌کشیدگی دوغاب', nameEn: 'Pullout', ok: results.pullout.isPassed },
                          { id: 'plate', step: 3, nameFa: 'صفحه سر نیل', nameEn: 'Bearing Plate', ok: results.plate.isPassed },
                          { id: 'facing', step: 4, nameFa: 'رویه شاتکریت و بتن', nameEn: 'Facings', ok: results.tempFlexure.isPassed && results.tempPunching.isPassed },
                          { id: 'corrosion', step: 5, nameFa: 'حفاظت خوردگی', nameEn: 'Corrosion', ok: results.corrosion.isClassAdequate },
                          { id: 'cad', step: 6, nameFa: 'نقشه CAD', nameEn: 'CAD Drawing', ok: true },
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveCalcModule(item.id as CalcModuleId)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                              activeCalcModule === item.id
                                ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-400 font-bold'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                              activeCalcModule === item.id ? 'bg-white text-blue-700' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {item.step}
                            </span>
                            <span className="hidden sm:inline">{isFa ? item.nameFa : item.nameEn}</span>
                            {item.id !== 'cad' && (
                              <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                                item.ok
                                  ? (activeCalcModule === item.id ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800')
                                  : (activeCalcModule === item.id ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-800')
                              }`}>
                                {item.ok ? 'OK' : 'NG'}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsReportOpen(true)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1.5 transition shadow-xs text-xs"
                      >
                        <FileCheck className="w-4 h-4" />
                        <span>{isFa ? 'چاپ دفترچه محاسبات فنی (PDF)' : 'Calculation Booklet (PDF)'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: STEP-BY-STEP PARAMETER SELECTION GUIDE */}
        {activeMainTab === 'guide' && (
          <div className="space-y-6">
            <StepByStepGuide lang={lang} />
          </div>
        )}

        {/* TAB 3: THEORY, REFERENCES & BILINGUAL GLOSSARY */}
        {activeMainTab === 'refs' && (
          <div className="space-y-6">
            <TechnicalReferencesAndGlossary lang={lang} />
          </div>
        )}

        {/* TAB 4: CAD CROSS-SECTIONS */}
        {activeMainTab === 'cad' && (
          <div className="space-y-6">
            <InteractiveCrossSectionSvg state={state} results={results} lang={lang} />
          </div>
        )}
      </main>

      {/* 3. WINDOWS DESKTOP STATUS BAR */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-700 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>AASHTO LRFD (2020) & FHWA-NHI-14-007</span>
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline">
            Tmax: <strong className="text-white">{state.tendon.Tmax} kN</strong> (T0 = {results.T0} kN)
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline">
            Tendon: <strong className="text-white">φ{state.tendon.barDiameter} mm</strong>
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline">
            Hole: <strong className="text-white">{state.pullout.drillholeDiameter} mm</strong>
          </span>
          <span className="hidden lg:inline text-slate-600">|</span>
          <span className="hidden lg:inline">
            Plate: <strong className="text-white">{state.plate.plateWidth}×{state.plate.plateWidth} cm</strong>
          </span>
          <span className="hidden lg:inline text-slate-600">|</span>
          <span className="hidden lg:inline">
            Protection: <strong className="text-emerald-400">{state.corrosion.selectedClass}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
              results.isOverallPassed ? 'bg-emerald-900 text-emerald-300' : 'bg-rose-900 text-rose-300'
            }`}
          >
            {results.isOverallPassed ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
            <span>{results.isOverallPassed ? 'AASHTO COMPLIANT (OK)' : 'CRITERIA NOT MET (NG)'}</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Project Management Save / Load Archive Modal */}
      <ProjectManagerModal
        isOpen={isProjectManagerOpen}
        onClose={() => setIsProjectManagerOpen(false)}
        currentState={state}
        currentResults={results}
        onLoadProject={(loadedState) => setState(loadedState)}
        lang={lang}
      />

      {/* 2. Geotechnical Guidance Handbook Modal */}
      <GuidanceModal
        isOpen={isGuidanceOpen}
        onClose={() => setIsGuidanceOpen(false)}
        lang={lang}
      />

      {/* 3. Formal Calculation Booklet PDF & Print Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        state={state}
        results={results}
        lang={lang}
      />
    </div>
  );
}
