/**
 * AASHTO LRFD (2020) & FHWA-NHI-14-007 Soil Nail Wall Design Suite
 * Unified Dark Geotechnical Windows Desktop & Mobile/Android PWA Application
 */
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { DesignState, Language } from './types/nailing';
import {
  SAMPLE_PROJECT_FROM_PDF,
  DEEP_EXCAVATION_PRESET,
  DEFAULT_SYSTEM_SPECS,
  normalizeDesignState,
} from './constants/standardsData';
import { calculateAll } from './utils/calculations';
import { DesktopHeader, MainTabId } from './components/DesktopHeader';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { DesignSummaryCard, DashboardTargetSection } from './components/DesignSummaryCard';
import { SystemSpecsSection } from './components/SystemSpecsSection';
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
import { WindowsExeModal } from './components/WindowsExeModal';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import { AboutModal } from './components/AboutModal';
import {
  Activity,
  Cpu,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Sliders,
  LayoutGrid,
  FileCheck,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Layers,
  FileText,
  Building2,
  Compass,
} from 'lucide-react';

export type CalcModuleId =
  | 'tendon'
  | 'pullout'
  | 'plate'
  | 'facing'
  | 'corrosion'
  | 'cad'
  | 'all';

const MODULE_ORDER: CalcModuleId[] = [
  'tendon',
  'pullout',
  'plate',
  'facing',
  'corrosion',
  'cad',
];

export default function App() {
  const [lang, setLang] = useState<Language>('fa');
  const [history, setHistory] = useState<DesignState[]>([normalizeDesignState(SAMPLE_PROJECT_FROM_PDF)]);
  const [historyIdx, setHistoryIdx] = useState<number>(0);

  const state = history[historyIdx];

  const updateStateWithHistory = useCallback(
    (next: DesignState) => {
      const normalized = normalizeDesignState(next);
      setHistory((prev) => {
        const sliced = prev.slice(0, historyIdx + 1);
        const updated = [...sliced, normalized].slice(-30);
        setHistoryIdx(updated.length - 1);
        return updated;
      });
    },
    [historyIdx]
  );

  const canUndo = historyIdx > 0;
  const canRedo = historyIdx < history.length - 1;

  const handleUndo = useCallback(() => {
    setHistoryIdx((idx) => (idx > 0 ? idx - 1 : idx));
  }, []);

  const handleRedo = useCallback(() => {
    setHistoryIdx((idx) => (idx < history.length - 1 ? idx + 1 : idx));
  }, [history.length]);

  const [activeMainTab, setActiveMainTab] = useState<MainTabId>('project');
  const [activeCalcModule, setActiveCalcModule] = useState<CalcModuleId>('tendon');
  const [facingTargetSubTab, setFacingTargetSubTab] = useState<{ tab: 'temp' | 'perm' | 'studs'; seq: number } | null>(null);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState<boolean>(true);

  // Windows desktop ergonomics
  const [zoomPercent, setZoomPercent] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isCompactHeader, setIsCompactHeader] = useState<boolean>(false);

  // Modals
  const [isProjectManagerOpen, setIsProjectManagerOpen] = useState(false);
  const [isGuidanceOpen, setIsGuidanceOpen] = useState(false);
  const [isWindowsModalOpen, setIsWindowsModalOpen] = useState(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const results = useMemo(() => calculateAll(state), [state]);
  const isFa = lang === 'fa';

  const handleDashboardNavigate = useCallback((target: DashboardTargetSection) => {
    if (target.tab === 'project') {
      setActiveMainTab('project');
    } else if (target.tab === 'system') {
      setActiveMainTab('system');
    } else if (target.tab === 'calc') {
      setActiveMainTab('calc');
      setActiveCalcModule(target.module);
      if (target.module === 'facing' && target.facingSubTab) {
        setFacingTargetSubTab((prev) => ({
          tab: target.facingSubTab!,
          seq: (prev?.seq || 0) + 1,
        }));
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    // Keep portable Windows EXE loopback server alive while window is open
    if (
      typeof window !== 'undefined' &&
      window.location.hostname === '127.0.0.1' &&
      window.location.port !== '3000' &&
      window.location.port !== '5173' &&
      window.location.port !== '4173'
    ) {
      const sendPing = () => {
        fetch('/api/ping').catch(() => {});
      };
      sendPing();
      const timer = window.setInterval(sendPing, 5000);
      const handleUnload = () => {
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/shutdown');
        }
      };
      window.addEventListener('beforeunload', handleUnload);
      return () => {
        window.clearInterval(timer);
        window.removeEventListener('beforeunload', handleUnload);
      };
    }
    return undefined;
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isFa ? 'rtl' : 'ltr';
  }, [lang, isFa]);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  // Global keyboard shortcuts (Windows standard UX)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        if ((e.target as HTMLElement)?.tagName !== 'INPUT') {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
        if ((e.target as HTMLElement)?.tagName !== 'INPUT') {
          e.preventDefault();
          handleRedo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('snda:trigger-save'));
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('snda:trigger-open'));
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setActiveMainTab('report');
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setIsCompactHeader((p) => !p);
      } else if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        setZoomPercent((z) => Math.min(130, z + 5));
      } else if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        setZoomPercent((z) => Math.max(80, z - 5));
      } else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        setZoomPercent(100);
      } else if (e.key === 'F1') {
        e.preventDefault();
        setIsAboutModalOpen(true);
      } else if (e.key === 'F11') {
        e.preventDefault();
        handleToggleFullscreen();
      }
    };

    const onOpenReport = () => setActiveMainTab('report');
    const onNavCalc = () => setActiveMainTab('calc');
    const onNavGuide = () => setActiveMainTab('guide');
    const onNavCad = () => setActiveMainTab('cad');
    const onNavRefs = () => setActiveMainTab('refs');

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('snda:open-report', onOpenReport);
    window.addEventListener('snda:navigate-calc', onNavCalc);
    window.addEventListener('snda:navigate-guide', onNavGuide);
    window.addEventListener('snda:navigate-cad', onNavCad);
    window.addEventListener('snda:navigate-refs', onNavRefs);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('snda:open-report', onOpenReport);
      window.removeEventListener('snda:navigate-calc', onNavCalc);
      window.removeEventListener('snda:navigate-guide', onNavGuide);
      window.removeEventListener('snda:navigate-cad', onNavCad);
      window.removeEventListener('snda:navigate-refs', onNavRefs);
    };
  }, [handleUndo, handleRedo, handleToggleFullscreen]);

  const handleNewProject = () => {
    updateStateWithHistory(SAMPLE_PROJECT_FROM_PDF);
  };

  const handleLoadDeepPreset = () => {
    updateStateWithHistory(DEEP_EXCAVATION_PRESET);
  };

  const isTemporarySystem = state.corrosion.designLife === 'temporary';

  const handleChangeDesignLife = (life: 'temporary' | 'permanent') => {
    updateStateWithHistory({
      ...state,
      corrosion: {
        ...state.corrosion,
        designLife: life,
        selectedClass:
          life === 'temporary'
            ? 'None'
            : state.corrosion.selectedClass === 'None'
            ? results.corrosion.isAggressive
              ? 'ClassA'
              : 'ClassB'
            : state.corrosion.selectedClass,
      },
    });
  };

  const isFacingModulePassed = isTemporarySystem
    ? results.tempFlexure.isPassed && results.tempPunching.isPassed
    : results.tempFlexure.isPassed &&
      results.tempPunching.isPassed &&
      results.permFlexure.isPassed &&
      results.permPunching.isPassed &&
      results.headedStuds.isPassed;

  const workflowSteps: { id: CalcModuleId; step: number; nameFa: string; nameEn: string; ok: boolean }[] = [
    { id: 'tendon', step: 1, nameFa: 'میلگرد کششی', nameEn: 'Tendon', ok: results.tendon.isPassed },
    { id: 'pullout', step: 2, nameFa: 'بیرون‌کشیدگی دوغاب', nameEn: 'Pullout', ok: results.pullout.isPassed },
    { id: 'plate', step: 3, nameFa: 'صفحه سر نیل', nameEn: 'Plate', ok: results.plate.isPassed },
    {
      id: 'facing',
      step: 4,
      nameFa: 'رویه شاتکریت و بتن',
      nameEn: 'Facings',
      ok: isFacingModulePassed,
    },
    {
      id: 'corrosion',
      step: 5,
      nameFa: 'حفاظت خوردگی',
      nameEn: 'Corrosion',
      ok: results.corrosion.summaryStatus === 'Compliant',
    },
    { id: 'cad', step: 6, nameFa: 'نقشه CAD', nameEn: 'CAD', ok: true },
  ];

  const activeModuleIdx = MODULE_ORDER.indexOf(activeCalcModule);
  const prevModule = activeModuleIdx > 0 ? MODULE_ORDER[activeModuleIdx - 1] : null;
  const nextModule = activeModuleIdx >= 0 && activeModuleIdx < MODULE_ORDER.length - 1 ? MODULE_ORDER[activeModuleIdx + 1] : null;

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans"
      style={{ fontSize: `${zoomPercent}%` }}
    >
      {/* 1. WINDOWS MENU BAR & UNIFIED COMMAND HEADER */}
      <DesktopHeader
        state={state}
        results={results}
        onUpdateState={updateStateWithHistory}
        lang={lang}
        onToggleLang={() => setLang((p) => (p === 'fa' ? 'en' : 'fa'))}
        onOpenGuidance={() => setIsGuidanceOpen(true)}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
        onOpenReport={() => setActiveMainTab('report')}
        onPrint={() => {
          setActiveMainTab('report');
          setTimeout(() => window.print(), 120);
        }}
        onOpenProjectManager={() => setIsProjectManagerOpen(true)}
        onNewProject={handleNewProject}
        onLoadDeepPreset={handleLoadDeepPreset}
        onOpenWindowsModal={() => setIsWindowsModalOpen(true)}
        onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
        activeMainTab={activeMainTab}
        onSelectMainTab={(tab) => setActiveMainTab(tab)}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        zoomPercent={zoomPercent}
        onZoomIn={() => setZoomPercent((z) => Math.min(130, z + 5))}
        onZoomOut={() => setZoomPercent((z) => Math.max(80, z - 5))}
        onResetZoom={() => setZoomPercent(100)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        isCompactHeader={isCompactHeader}
        onToggleCompactHeader={() => setIsCompactHeader((p) => !p)}
      />

      {/* Offline Status Strip (only visible when device is offline) */}
      <OfflineIndicator isFa={isFa} />

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 space-y-4 pb-24 md:pb-6">

        {/* TOP-LEVEL TAB 1: PROJECT INFO */}
        {activeMainTab === 'project' && (
          <ProjectInfoCard
            metadata={state.metadata}
            onChange={(metadata) => updateStateWithHistory({ ...state, metadata })}
            lang={lang}
            onOpenGuidance={() => setIsGuidanceOpen(true)}
            onNextTab={() => setActiveMainTab('system')}
          />
        )}

        {/* TOP-LEVEL TAB 2: SOIL NAIL SYSTEM SPECS (GEOMETRY, LIFE & PRELIMINARY SIZING) */}
        {activeMainTab === 'system' && (
          <SystemSpecsSection
            system={state.system || DEFAULT_SYSTEM_SPECS}
            Sh={state.facing.Sh}
            Sv={state.facing.Sv}
            designLife={state.corrosion.designLife}
            currentTmax={state.tendon.Tmax}
            currentLp={state.pullout.effectiveBondLength}
            onChangeSystem={(system) => updateStateWithHistory({ ...state, system })}
            onChangeSpacing={(Sh, Sv) =>
              updateStateWithHistory({
                ...state,
                facing: { ...state.facing, Sh, Sv },
              })
            }
            onChangeDesignLife={handleChangeDesignLife}
            onApplyPreliminaryToDesign={(estimatedTmax, estimatedLp) =>
              updateStateWithHistory({
                ...state,
                tendon: { ...state.tendon, Tmax: estimatedTmax },
                pullout: { ...state.pullout, effectiveBondLength: estimatedLp },
              })
            }
            onGoToCalculations={() => {
              setActiveMainTab('calc');
              setActiveCalcModule('tendon');
            }}
            onOpenGuidance={() => setIsGuidanceOpen(true)}
            lang={lang}
          />
        )}

        {/* TOP-LEVEL TAB 3: DESIGN CALCULATIONS */}
        {activeMainTab === 'calc' && (
          <div className="space-y-4">
            {/* CALCULATION MODULE RIBBON */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-2.5 shadow-xl">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2 mb-2 px-1 gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>{isFa ? 'ماژول‌های محاسباتی طراحی نیلینگ (پرش مستقیم به هر گام):' : 'Soil Nail Design Modules (Direct Step Jump):'}</span>
                </div>
                <span className="text-[11px] text-sky-400 font-medium">
                  {isFa
                    ? isTemporarySystem
                      ? 'حالت سیستم موقت فعال (بدون پوشش دائم / معاف از خوردگی)'
                      : 'حالت سیستم دائم فعال (پوشش دائم و حفاظت خوردگی الزامی)'
                    : isTemporarySystem
                    ? 'Temporary System Active (No Perm. Facing / Corrosion Exempt)'
                    : 'Permanent System Active (Perm. Facing & Corrosion Required)'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
                {[
                  {
                    id: 'tendon' as CalcModuleId,
                    step: '1',
                    color: 'bg-blue-600',
                    title: isFa ? 'میلگرد کششی' : 'Tendon',
                    ok: results.tendon.isPassed,
                    sub: `φ${state.tendon.barDiameter}mm (CDR=${results.tendon.capacityDemandRatio})`,
                  },
                  {
                    id: 'pullout' as CalcModuleId,
                    step: '2',
                    color: 'bg-emerald-600',
                    title: isFa ? 'بیرون‌کشیدگی دوغاب' : 'Pullout',
                    ok: results.pullout.isPassed,
                    sub: `DD=${state.pullout.drillholeDiameter}mm (CDR=${results.pullout.capacityDemandRatio})`,
                  },
                  {
                    id: 'plate' as CalcModuleId,
                    step: '3',
                    color: 'bg-amber-600',
                    title: isFa ? 'صفحه سر نیل' : 'Bearing Plate',
                    ok: results.plate.isPassed,
                    sub: `${state.plate.plateWidth}×${state.plate.plateWidth}cm (t=${state.plate.plateThickness}cm)`,
                  },
                  {
                    id: 'facing' as CalcModuleId,
                    step: '4',
                    color: 'bg-indigo-600',
                    title: isFa ? 'رویه شاتکریت و بتن' : 'Facings',
                    ok: isFacingModulePassed,
                    sub: isTemporarySystem
                      ? `Temp Only (${state.facing.tempThickness}mm)`
                      : `h=${state.facing.tempThickness}/${state.facing.permThickness}mm`,
                  },
                  {
                    id: 'corrosion' as CalcModuleId,
                    step: '5',
                    color: 'bg-teal-600',
                    title: isFa ? 'حفاظت خوردگی' : 'Corrosion',
                    ok: results.corrosion.summaryStatus === 'Compliant',
                    sub: results.corrosion.isExemptTemporary ? 'Temp (Exempt)' : `${state.corrosion.selectedClass}`,
                  },
                  {
                    id: 'cad' as CalcModuleId,
                    step: '6',
                    color: 'bg-violet-600',
                    title: isFa ? 'مقطع CAD' : 'CAD Drawing',
                    ok: true,
                    sub: isFa ? 'جزئیات اجرایی' : 'Cross-Section',
                    badgeText: 'SVG',
                  },
                ].map((mod) => {
                  const isActive = activeCalcModule === mod.id;
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => setActiveCalcModule(mod.id)}
                      className={`p-2.5 min-h-[54px] rounded-xl border text-start transition flex flex-col justify-between cursor-pointer ${
                        isActive
                          ? 'bg-slate-800 border-amber-500 text-white shadow-md ring-1 ring-amber-500/40 font-bold'
                          : 'bg-slate-950/70 hover:bg-slate-800/70 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1 gap-1">
                        <span className="font-bold flex items-center gap-1.5 text-[11px] truncate">
                          <span className={`w-4 h-4 rounded-full ${mod.color} text-white flex items-center justify-center text-[10px] font-black shrink-0`}>
                            {mod.step}
                          </span>
                          <span className="truncate">{mod.title}</span>
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                            mod.badgeText
                              ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                              : mod.ok
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {mod.badgeText || (mod.ok ? 'OK' : 'NG')}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate" dir="ltr">
                        {mod.sub}
                      </div>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setActiveCalcModule('all')}
                  className={`p-2.5 min-h-[54px] rounded-xl border text-start transition flex flex-col justify-between cursor-pointer ${
                    activeCalcModule === 'all'
                      ? 'bg-indigo-950/70 border-indigo-400 text-white shadow-md ring-1 ring-indigo-400/40 font-bold'
                      : 'bg-slate-950/70 hover:bg-slate-800/70 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-bold">
                    <LayoutGrid className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{isFa ? 'نمای یکپارچه (همه)' : 'All Sections'}</span>
                  </div>
                  <div className="text-[10px] text-indigo-300 font-medium truncate">
                    {isFa ? 'نمایش پشت‌سرهم ۵ گام + CAD' : 'Continuous view (6 steps)'}
                  </div>
                </button>
              </div>
            </div>

            {/* MODULE WORKSPACE */}
            {(activeCalcModule === 'tendon' || activeCalcModule === 'all') && (
              <TendonSection
                inputs={state.tendon}
                results={results.tendon}
                onChange={(tendon) => updateStateWithHistory({ ...state, tendon })}
                lang={lang}
                onOpenGuidance={() => setIsGuidanceOpen(true)}
              />
            )}

            {(activeCalcModule === 'pullout' || activeCalcModule === 'all') && (
              <PulloutSection
                inputs={state.pullout}
                results={results.pullout}
                Tmax={state.tendon.Tmax}
                loadFactorEV={state.tendon.loadFactorEV}
                onChange={(pullout) => updateStateWithHistory({ ...state, pullout })}
                lang={lang}
                onOpenGuidance={() => setIsGuidanceOpen(true)}
              />
            )}

            {(activeCalcModule === 'plate' || activeCalcModule === 'all') && (
              <BearingPlateSection
                inputs={state.plate}
                results={results.plate}
                T0={results.T0}
                onChange={(plate) => updateStateWithHistory({ ...state, plate })}
                lang={lang}
                onOpenGuidance={() => setIsGuidanceOpen(true)}
              />
            )}

            {(activeCalcModule === 'facing' || activeCalcModule === 'all') && (
              <FacingSection
                inputs={state.facing}
                tempFlexure={results.tempFlexure}
                tempPunching={results.tempPunching}
                permFlexure={results.permFlexure}
                permPunching={results.permPunching}
                headedStuds={results.headedStuds}
                T0={results.T0}
                isTemporarySystem={isTemporarySystem}
                requestedSubTab={facingTargetSubTab}
                onChange={(facing) => updateStateWithHistory({ ...state, facing })}
                onGoToSystemSpecs={() => setActiveMainTab('system')}
                lang={lang}
                onOpenGuidance={() => setIsGuidanceOpen(true)}
              />
            )}

            {(activeCalcModule === 'corrosion' || activeCalcModule === 'all') && (
              <CorrosionSection
                inputs={state.corrosion}
                results={results.corrosion}
                barDiameter={state.tendon.barDiameter}
                onChange={(corrosion) => updateStateWithHistory({ ...state, corrosion })}
                onGoToSystemSpecs={() => setActiveMainTab('system')}
                lang={lang}
                onOpenGuidance={() => setIsGuidanceOpen(true)}
              />
            )}

            {(activeCalcModule === 'cad' || activeCalcModule === 'all') && (
              <InteractiveCrossSectionSvg state={state} results={results} lang={lang} />
            )}

            {/* SINGLE UNIFIED BOTTOM WORKFLOW JUMP BAR */}
            {activeCalcModule !== 'all' && (
              <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  disabled={!prevModule}
                  onClick={() => prevModule && setActiveCalcModule(prevModule)}
                  className="px-3.5 py-2 min-h-[40px] text-xs font-semibold rounded-xl flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 text-slate-200 border border-slate-800 transition cursor-pointer"
                >
                  {isFa ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  <span>{isFa ? 'گام قبلی' : 'Previous'}</span>
                </button>

                <div className="flex flex-wrap items-center gap-1.5">
                  {workflowSteps.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveCalcModule(item.id)}
                      className={`px-2.5 py-1.5 min-h-[36px] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                        activeCalcModule === item.id
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                          : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                          activeCalcModule === item.id ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.step}
                      </span>
                      <span className="hidden sm:inline">{isFa ? item.nameFa : item.nameEn}</span>
                      {item.id !== 'cad' && (
                        <span
                          className={`text-[9px] px-1 rounded font-bold ${
                            item.ok
                              ? activeCalcModule === item.id
                                ? 'bg-emerald-950 text-emerald-300'
                                : 'bg-emerald-500/15 text-emerald-300'
                              : activeCalcModule === item.id
                              ? 'bg-rose-950 text-rose-300'
                              : 'bg-rose-500/15 text-rose-300'
                          }`}
                        >
                          {item.ok ? 'OK' : 'NG'}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {nextModule ? (
                  <button
                    type="button"
                    onClick={() => setActiveCalcModule(nextModule)}
                    className="px-4 py-2 min-h-[40px] bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-md cursor-pointer"
                  >
                    <span>{isFa ? 'گام بعدی' : 'Next Step'}</span>
                    {isFa ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveMainTab('report')}
                    className="px-4 py-2 min-h-[40px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl flex items-center gap-1.5 transition shadow-md text-xs cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>{isFa ? 'داشبورد و دفترچه محاسبات (PDF)' : 'Dashboard & Calculation Booklet'}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* TOP-LEVEL TAB 4: STEP-BY-STEP PARAMETER SELECTION GUIDE */}
        {activeMainTab === 'guide' && <StepByStepGuide lang={lang} />}

        {/* TOP-LEVEL TAB 5: THEORY, REFERENCES & BILINGUAL GLOSSARY */}
        {activeMainTab === 'refs' && <TechnicalReferencesAndGlossary lang={lang} />}

        {/* TOP-LEVEL TAB 6: CAD CROSS-SECTIONS */}
        {activeMainTab === 'cad' && <InteractiveCrossSectionSvg state={state} results={results} lang={lang} />}

        {/* TOP-LEVEL TAB 7: HYPERLINKED ENGINEERING DASHBOARD & INLINE CALCULATION BOOKLET */}
        {activeMainTab === 'report' && (
          <div className="space-y-4">
            {/* EXECUTIVE HYPERLINKED DASHBOARD (Hidden during paper print) */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden print:hidden">
              <div className="px-4 py-2.5 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-bold text-slate-100">
                    {isFa
                      ? 'داشبورد نظارت مهندسی و دسترسی سریع (جهت بررسی روی هر آیتم کلیک کنید)'
                      : 'Engineering Supervision Dashboard (Click any item to inspect)'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                      results.isOverallPassed
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/35'
                    }`}
                  >
                    {results.isOverallPassed ? (isFa ? 'کلیه کنترل‌ها OK' : 'ALL CHECKS PASS') : isFa ? 'نیازمند اصلاح (NG)' : 'REVISION REQ.'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                      isSummaryExpanded
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <span>{isFa ? 'خلاصه شاخص‌ها و CDR' : 'Executive CDR'}</span>
                    {isSummaryExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMainTab('project')}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer border bg-slate-900 hover:bg-slate-800 text-sky-300 border-slate-700 hover:border-sky-500/40"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{isFa ? 'مشخصات پروژه' : 'Project Info'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMainTab('system')}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer border bg-slate-900 hover:bg-slate-800 text-cyan-300 border-slate-700 hover:border-cyan-500/40"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>
                      {isFa
                        ? `سیستم نیلینگ (${isTemporarySystem ? 'موقت' : 'دائم'})`
                        : `Nailing System (${isTemporarySystem ? 'Temp' : 'Perm'})`}
                    </span>
                  </button>
                </div>
              </div>

              {isSummaryExpanded && (
                <div className="p-3 bg-slate-950/40">
                  <DesignSummaryCard
                    state={state}
                    results={results}
                    lang={lang}
                    onNavigate={handleDashboardNavigate}
                  />
                </div>
              )}
            </div>

            {/* INLINE CALCULATION BOOKLET (NEVER BLOCKS NAVIGATION) */}
            <ReportModal
              isOpen={true}
              inline={true}
              state={state}
              results={results}
              lang={lang}
            />
          </div>
        )}
      </main>

      {/* 3. MOBILE / ANDROID THUMB-FRIENDLY BOTTOM NAVIGATION BAR (< md) */}
      <nav
        dir={isFa ? 'rtl' : 'ltr'}
        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-1 pt-1 pb-safe shadow-2xl print:hidden"
        aria-label={isFa ? 'منوی پایین موبایل' : 'Mobile Navigation'}
      >
        <div className="grid grid-cols-7 gap-0.5">
          {[
            { id: 'project' as MainTabId, icon: Building2, label: isFa ? 'پروژه' : 'Project' },
            { id: 'system' as MainTabId, icon: Compass, label: isFa ? 'سیستم' : 'System' },
            { id: 'calc' as MainTabId, icon: Sliders, label: isFa ? 'محاسبات' : 'Calc' },
            { id: 'guide' as MainTabId, icon: Sparkles, label: isFa ? 'راهنما' : 'Guide' },
            { id: 'refs' as MainTabId, icon: BookOpen, label: isFa ? 'مراجع' : 'Refs' },
            { id: 'cad' as MainTabId, icon: Layers, label: 'CAD' },
            { id: 'report' as MainTabId, icon: FileText, label: isFa ? 'PDF' : 'PDF' },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeMainTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveMainTab(tab.id)}
                className={`min-h-[48px] rounded-lg flex flex-col items-center justify-center gap-0.5 text-[9.5px] font-bold transition cursor-pointer ${
                  active
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/35'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate max-w-full px-0.5">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 4. DESKTOP WINDOWS STATUS BAR (Hidden on mobile to preserve thumb nav space) */}
      <footer className="hidden md:flex bg-slate-950 text-slate-300 border-t border-slate-800 px-4 py-2 text-xs items-center justify-between gap-3 select-none print:hidden">
        <div className="flex items-center gap-4 text-[11px] font-mono tabular-nums">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>AASHTO LRFD (2020) & FHWA-NHI-14-007</span>
          </span>
          <span className="text-slate-700">|</span>
          <span>
            Tmax: <strong className="text-white">{state.tendon.Tmax} kN</strong> (T0 = {results.T0} kN)
          </span>
          <span className="text-slate-700">|</span>
          <span>
            Tendon: <strong className="text-sky-300">φ{state.tendon.barDiameter} mm</strong>
          </span>
          <span className="hidden lg:inline text-slate-700">|</span>
          <span className="hidden lg:inline">
            Hole: <strong className="text-teal-300">{state.pullout.drillholeDiameter} mm</strong>
          </span>
          <span className="hidden lg:inline text-slate-700">|</span>
          <span className="hidden lg:inline">
            Plate: <strong className="text-amber-300">{state.plate.plateWidth}×{state.plate.plateWidth} cm</strong>
          </span>
          <span className="hidden lg:inline text-slate-700">|</span>
          <span className="hidden lg:inline">
            Class:{' '}
            <strong className="text-emerald-300">
              {results.corrosion.isExemptTemporary ? (isFa ? 'موقت (معاف)' : 'Exempt (Temp)') : state.corrosion.selectedClass}
            </strong>
          </span>
        </div>

        <div
          className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 border ${
            results.isOverallPassed
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
              : 'bg-rose-500/15 text-rose-300 border-rose-500/35'
          }`}
        >
          {results.isOverallPassed ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
          <span>{results.isOverallPassed ? 'AASHTO COMPLIANT (OK)' : 'CRITERIA NOT MET (NG)'}</span>
        </div>
      </footer>

      {/* MODALS */}
      <ProjectManagerModal
        isOpen={isProjectManagerOpen}
        onClose={() => setIsProjectManagerOpen(false)}
        currentState={state}
        currentResults={results}
        onLoadProject={updateStateWithHistory}
        lang={lang}
      />

      <GuidanceModal isOpen={isGuidanceOpen} onClose={() => setIsGuidanceOpen(false)} lang={lang} />

      <WindowsExeModal isOpen={isWindowsModalOpen} onClose={() => setIsWindowsModalOpen(false)} lang={lang} />

      <AndroidInstallModal isOpen={isAndroidModalOpen} onClose={() => setIsAndroidModalOpen(false)} lang={lang} />

      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} lang={lang} />
    </div>
  );
}
