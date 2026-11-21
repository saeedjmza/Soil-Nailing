/**
 * Facing Design Section: Initial Shotcrete & Permanent Facing Flexure, Punching Shear & Headed Studs (AASHTO 11.12.6.2)
 */
import React, { useState, useEffect } from 'react';
import {
  FacingInputs,
  FacingFlexureResults,
  FacingPunchingResults,
  HeadedStudsResults,
  Language,
} from '../types/nailing';
import { STANDARD_MESH_OPTIONS } from '../constants/standardsData';
import { TRANSLATIONS } from '../utils/translations';
import { HelpCircle, Check, AlertTriangle, Grid, Info, Sliders, Calculator, Edit3 } from 'lucide-react';

interface Props {
  inputs: FacingInputs;
  tempFlexure: FacingFlexureResults;
  tempPunching: FacingPunchingResults;
  permFlexure: FacingFlexureResults;
  permPunching: FacingPunchingResults;
  headedStuds: HeadedStudsResults;
  T0: number;
  isTemporarySystem?: boolean;
  requestedSubTab?: { tab: 'temp' | 'perm' | 'studs'; seq: number } | null;
  onChange: (inputs: FacingInputs) => void;
  onGoToSystemSpecs?: () => void;
  lang: Language;
  onOpenGuidance: () => void;
}

export const FacingSection: React.FC<Props> = ({
  inputs,
  tempFlexure,
  tempPunching,
  permFlexure,
  permPunching,
  headedStuds,
  T0,
  isTemporarySystem = false,
  requestedSubTab = null,
  onChange,
  onGoToSystemSpecs,
  lang,
  onOpenGuidance,
}) => {
  const isFa = lang === 'fa';
  const t = TRANSLATIONS[lang];
  const [activeFacingSubTab, setActiveFacingSubTab] = useState<'temp' | 'perm' | 'studs'>('temp');

  useEffect(() => {
    if (requestedSubTab) {
      setActiveFacingSubTab(requestedSubTab.tab);
    }
  }, [requestedSubTab]);

  // Manual Custom Rebar Mode vs Standard Mesh Selector states
  const [tempMode, setTempMode] = useState<'standard' | 'manual'>('standard');
  const [tempManualDia, setTempManualDia] = useState<number>(inputs.tempMesh.meshDiameter || 6);
  const [tempManualSpacing, setTempManualSpacing] = useState<number>(inputs.tempMesh.meshSpacing || 150);

  const [permMode, setPermMode] = useState<'standard' | 'manual'>('standard');
  const [permManualDia, setPermManualDia] = useState<number>(inputs.permMesh.meshDiameter || 10);
  const [permManualSpacing, setPermManualSpacing] = useState<number>(inputs.permMesh.meshSpacing || 150);

  useEffect(() => {
    if (inputs.tempMesh.meshDiameter) setTempManualDia(inputs.tempMesh.meshDiameter);
    if (inputs.tempMesh.meshSpacing) setTempManualSpacing(inputs.tempMesh.meshSpacing);
  }, [inputs.tempMesh.meshDiameter, inputs.tempMesh.meshSpacing]);

  useEffect(() => {
    if (inputs.permMesh.meshDiameter) setPermManualDia(inputs.permMesh.meshDiameter);
    if (inputs.permMesh.meshSpacing) setPermManualSpacing(inputs.permMesh.meshSpacing);
  }, [inputs.permMesh.meshDiameter, inputs.permMesh.meshSpacing]);

  // Helper to calculate area per linear meter: As = (1000 / s) * (pi * d^2 / 4)
  const calcRebarArea = (dia: number, spacing: number): number => {
    if (spacing <= 0 || dia <= 0) return 0;
    const singleArea = (Math.PI * dia * dia) / 4;
    return Math.round((1000 / spacing) * singleArea * 10) / 10;
  };

  const handleApplyTempManualRebar = (dia: number, spacing: number) => {
    const area = calcRebarArea(dia, spacing);
    onChange({
      ...inputs,
      tempMesh: {
        ...inputs.tempMesh,
        avn: area,
        avm: area,
        ahn: area,
        ahm: area,
        meshDiameter: dia,
        meshSpacing: spacing,
      },
    });
  };

  const handleApplyPermManualRebar = (dia: number, spacing: number) => {
    const area = calcRebarArea(dia, spacing);
    onChange({
      ...inputs,
      permMesh: {
        ...inputs.permMesh,
        avn: area,
        avm: area,
        ahn: area,
        ahm: area,
        meshDiameter: dia,
        meshSpacing: spacing,
      },
    });
  };

  const handleTempMeshSelect = (area: number, dia: number, spacing: number) => {
    onChange({
      ...inputs,
      tempMesh: {
        ...inputs.tempMesh,
        avn: area,
        avm: area,
        ahn: area,
        ahm: area,
        meshDiameter: dia,
        meshSpacing: spacing,
      },
    });
  };

  const handlePermMeshSelect = (area: number, dia: number, spacing: number) => {
    onChange({
      ...inputs,
      permMesh: {
        ...inputs.permMesh,
        avn: area,
        avm: area,
        ahn: area,
        ahm: area,
        meshDiameter: dia,
        meshSpacing: spacing,
      },
    });
  };

  const handleTempThicknessChange = (h: number) => {
    // Automatically adjust CF per AASHTO: 100mm -> 2.0, 150mm -> 1.5, >=200mm -> 1.0
    let cf = 1.0;
    if (h <= 100) cf = 2.0;
    else if (h <= 150) cf = 2.0 - ((h - 100) / 50) * 0.5;
    else if (h < 200) cf = 1.5 - ((h - 150) / 50) * 0.5;
    else cf = 1.0;

    onChange({
      ...inputs,
      tempThickness: h,
      tempCF: Number(cf.toFixed(2)),
    });
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
      {/* Section Header */}
      <div className="px-5 py-4 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center text-xs font-black">
              4
            </span>
            <span>{t.secFacingTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{t.secFacingDesc}</p>
        </div>

        <button
          type="button"
          onClick={onOpenGuidance}
          className="text-xs text-indigo-300 hover:text-white flex items-center gap-1.5 font-medium bg-indigo-500/15 hover:bg-indigo-500/25 px-3 py-1.5 rounded-lg border border-indigo-500/35 transition cursor-pointer whitespace-nowrap"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{t.parameterGuidance}</span>
        </button>
      </div>

      {/* Temporary System Notice Banner */}
      {isTemporarySystem && (
        <div className="px-5 py-3 bg-amber-950/35 border-b border-amber-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5 text-amber-200">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-100">
                {isFa ? 'سیستم نیلینگ موقت فعال است (Temporary System):' : 'Temporary Nailing System Active:'}
              </span>{' '}
              <span>
                {isFa
                  ? 'بر اساس انتخاب شما در سربرگ مشخصات سیستم نیلینگ، این سازه موقت بوده و نیاز به طراحی رویه پوشش دائم و گل‌میخ‌های سر نیل ندارد؛ تنها پوشش شاتکریت موقت کنترل می‌شود.'
                  : 'Per your selection in Nailing System Specs, permanent concrete facing and headed studs are not required; only temporary shotcrete facing is checked.'}
              </span>
            </div>
          </div>
          {onGoToSystemSpecs && (
            <button
              type="button"
              onClick={onGoToSystemSpecs}
              className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-[11px] font-bold transition cursor-pointer shrink-0"
            >
              {isFa ? 'تغییر در مشخصات سیستم نیلینگ' : 'Change in System Specs'}
            </button>
          )}
        </div>
      )}

      {/* Grid Spacing Inputs Strip */}
      <div className="px-5 py-3 bg-indigo-950/30 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-indigo-200 font-bold">
          <Grid className="w-4 h-4 text-indigo-400" />
          <span>{t.spacingTitle}:</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-slate-300 font-medium">{t.paramSh}:</label>
            <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-950 w-32 shrink-0 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500" dir="ltr">
              <input
                type="number"
                dir="ltr"
                step="0.1"
                min="0.8"
                max="3.5"
                value={inputs.Sh}
                onChange={(e) => onChange({ ...inputs, Sh: parseFloat(e.target.value) || 2.0 })}
                className="w-full px-2.5 py-1.5 text-xs font-mono text-slate-100 text-left bg-transparent focus:outline-none tabular-nums"
              />
              <span className="bg-slate-900 border-l border-slate-800 px-2.5 py-1.5 text-xs text-slate-400 font-bold select-none min-w-[32px] flex items-center justify-center">
                m
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-slate-300 font-medium">{t.paramSv}:</label>
            <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-950 w-32 shrink-0 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500" dir="ltr">
              <input
                type="number"
                dir="ltr"
                step="0.1"
                min="0.8"
                max="3.5"
                value={inputs.Sv}
                onChange={(e) => onChange({ ...inputs, Sv: parseFloat(e.target.value) || 2.0 })}
                className="w-full px-2.5 py-1.5 text-xs font-mono text-slate-100 text-left bg-transparent focus:outline-none tabular-nums"
              />
              <span className="bg-slate-900 border-l border-slate-800 px-2.5 py-1.5 text-xs text-slate-400 font-bold select-none min-w-[32px] flex items-center justify-center">
                m
              </span>
            </div>
          </div>

          <div className="text-[11px] text-sky-200 bg-sky-500/15 border border-sky-500/30 px-3 py-1 rounded-lg font-mono tabular-nums" dir="ltr">
            T0 = {T0} kN [Smax = {Math.max(inputs.Sh, inputs.Sv)} m]
          </div>
        </div>
      </div>

      {/* Sub Tabs: Temporary / Permanent / Headed Studs (Zero Horizontal Scroll) */}
      <div className="px-4 sm:px-5 py-2.5 bg-slate-950/40 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveFacingSubTab('temp')}
          className={`px-3 py-2 rounded-xl border transition-all flex items-center justify-between gap-2 cursor-pointer ${
            activeFacingSubTab === 'temp'
              ? 'bg-indigo-500/15 border-indigo-400/70 text-indigo-200 font-bold shadow-xs'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <span className="truncate">
            {isFa ? '۱. پوشش موقت (شاتکریت اولیه)' : '1. Initial / Temporary Facing'}
          </span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded font-mono border shrink-0 ${
              tempFlexure.isPassed && tempPunching.isPassed
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
            }`}
          >
            {tempFlexure.isPassed && tempPunching.isPassed ? 'OK' : 'NG'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFacingSubTab('perm')}
          className={`px-3 py-2 rounded-xl border transition-all flex items-center justify-between gap-2 cursor-pointer ${
            activeFacingSubTab === 'perm'
              ? 'bg-indigo-500/15 border-indigo-400/70 text-indigo-200 font-bold shadow-xs'
              : isTemporarySystem
              ? 'bg-slate-900/40 border-slate-800/70 text-slate-500 hover:text-slate-300'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <span className="truncate">
            {isFa ? '۲. پوشش دائم (بتن نهایی)' : '2. Final / Permanent Facing'}
          </span>
          {isTemporarySystem ? (
            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold border bg-slate-800 text-slate-400 border-slate-700 shrink-0">
              {isFa ? 'غیرالزامی (موقت)' : 'N/A (Temp)'}
            </span>
          ) : (
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-mono border shrink-0 ${
                permFlexure.isPassed && permPunching.isPassed
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
              }`}
            >
              {permFlexure.isPassed && permPunching.isPassed ? 'OK' : 'NG'}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveFacingSubTab('studs')}
          className={`px-3 py-2 rounded-xl border transition-all flex items-center justify-between gap-2 cursor-pointer ${
            activeFacingSubTab === 'studs'
              ? 'bg-indigo-500/15 border-indigo-400/70 text-indigo-200 font-bold shadow-xs'
              : isTemporarySystem
              ? 'bg-slate-900/40 border-slate-800/70 text-slate-500 hover:text-slate-300'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <span className="truncate">
            {isFa ? '۳. کشش گل‌میخ‌های سر نیل دائم' : '3. Headed Studs Tension'}
          </span>
          {isTemporarySystem ? (
            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold border bg-slate-800 text-slate-400 border-slate-700 shrink-0">
              {isFa ? 'غیرالزامی (موقت)' : 'N/A (Temp)'}
            </span>
          ) : (
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-mono border shrink-0 ${
                headedStuds.isPassed
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
              }`}
            >
              {headedStuds.isPassed ? 'OK' : 'NG'}
            </span>
          )}
        </button>
      </div>

      <div className="p-5">
        {/* SUBTAB 1: INITIAL / TEMPORARY SHOTCRETE FACING */}
        {activeFacingSubTab === 'temp' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Thickness h_temp */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t.paramFacingThickness}
                  </label>
                  <div className="flex rounded-xl border border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 bg-slate-950" dir="ltr">
                    <input
                      type="number"
                      dir="ltr"
                      min="80"
                      max="300"
                      step="10"
                      value={inputs.tempThickness}
                      onChange={(e) => handleTempThicknessChange(parseFloat(e.target.value) || 150)}
                      className="w-full px-3 py-2 text-sm font-mono text-slate-100 text-left bg-transparent focus:outline-none tabular-nums"
                    />
                    <span className="bg-slate-900 border-l border-slate-800 px-3 py-2 text-xs font-semibold text-slate-400 shrink-0 select-none flex items-center justify-center min-w-[44px]">
                      mm
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {isFa ? `معادل ${(inputs.tempThickness / 10).toFixed(0)} سانتی‌متر` : `${(inputs.tempThickness / 10).toFixed(0)} cm`}
                  </p>
                </div>

                {/* f'c Shotcrete */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t.paramFacingFc}
                  </label>
                  <div className="flex rounded-xl border border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 bg-slate-950" dir="ltr">
                    <input
                      type="number"
                      dir="ltr"
                      min="15"
                      max="45"
                      step="5"
                      value={inputs.tempFc}
                      onChange={(e) => onChange({ ...inputs, tempFc: parseFloat(e.target.value) || 20 })}
                      className="w-full px-3 py-2 text-sm font-mono text-slate-100 text-left bg-transparent focus:outline-none tabular-nums"
                    />
                    <span className="bg-slate-900 border-l border-slate-800 px-3 py-2 text-xs font-semibold text-slate-400 shrink-0 select-none flex items-center justify-center min-w-[44px]">
                      MPa
                    </span>
                  </div>
                </div>

                {/* CF Factor */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t.paramCF}
                  </label>
                  <input
                    type="number"
                    min="1.0"
                    max="2.5"
                    step="0.1"
                    value={inputs.tempCF}
                    onChange={(e) => onChange({ ...inputs, tempCF: parseFloat(e.target.value) || 1.5 })}
                    className="w-full px-3 py-2 text-sm border border-slate-700 rounded-xl bg-slate-950 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none font-mono text-slate-100 tabular-nums"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">{t.paramCFHelp}</p>
                </div>
              </div>

              {/* Reinforcement Configuration: Standard Mesh vs Manual Rebar Input */}
              <div className="space-y-3 pt-1">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{isFa ? 'تعیین مشخصات آرماتوربندی شاتکریت موقت:' : 'Temporary Facing Reinforcement:'}</span>
                  </label>

                  {/* Mode Toggle */}
                  <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setTempMode('standard')}
                      className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                        tempMode === 'standard'
                          ? 'bg-slate-800 text-indigo-300 border border-slate-700 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isFa ? 'مش استاندارد پیش‌ساخته' : 'Standard Mesh Presets'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTempMode('manual')}
                      className={`px-3 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                        tempMode === 'manual'
                          ? 'bg-indigo-600 text-white font-bold shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{isFa ? 'ورود دستی قطر و فواصل میلگرد' : 'Manual Rebar (d & s)'}</span>
                    </button>
                  </div>
                </div>

                {/* Option 1: Standard Welded Wire Mesh Grid Selector */}
                {tempMode === 'standard' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {STANDARD_MESH_OPTIONS.map((mesh, idx) => {
                      const isSelected = inputs.tempMesh.avn === mesh.areaMm2PerM;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setTempManualDia(mesh.wireDiameterMm);
                            setTempManualSpacing(mesh.spacingMm);
                            handleTempMeshSelect(mesh.areaMm2PerM, mesh.wireDiameterMm, mesh.spacingMm);
                          }}
                          className={`px-3 py-2.5 rounded-xl border text-xs text-left transition cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600/25 text-indigo-200 border-indigo-400/60 font-bold shadow-sm'
                              : 'bg-slate-950/70 hover:bg-slate-800 text-slate-300 border-slate-800'
                          }`}
                        >
                          <div>{isFa ? mesh.labelFa : mesh.labelEn}</div>
                          <div className={`text-[10px] font-mono tabular-nums mt-0.5 ${isSelected ? 'text-indigo-300' : 'text-slate-400'}`}>
                            {mesh.areaMm2PerM} mm²/m
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Option 2: Manual Rebar Diameter & Spacing Input */}
                {tempMode === 'manual' && (
                  <div className="bg-indigo-950/25 border border-indigo-500/30 rounded-xl p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-indigo-200 font-bold border-b border-indigo-500/20 pb-2">
                      <span className="flex items-center gap-1.5">
                        <Calculator className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{isFa ? 'طراحی سفارشی: قطر میلگرد و فواصل شبکه' : 'Custom Rebar Size & Spacing'}</span>
                      </span>
                      <span className="text-[11px] font-mono text-indigo-300" dir="ltr">
                        As = (1000/s) · (π·d²/4)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Rebar Diameter Input */}
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1.5">
                          {isFa ? 'قطر میلگرد شبکه (d):' : 'Rebar Diameter (d):'}
                        </label>
                        <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-950 mb-2" dir="ltr">
                          <input
                            type="number"
                            min="4"
                            max="25"
                            step="1"
                            value={tempManualDia}
                            onChange={(e) => {
                              const dia = parseFloat(e.target.value) || 0;
                              setTempManualDia(dia);
                              handleApplyTempManualRebar(dia, tempManualSpacing);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs font-mono font-bold text-slate-100 text-left bg-transparent focus:outline-none tabular-nums"
                          />
                          <span className="bg-slate-900 border-l border-slate-800 px-2.5 py-1 text-xs text-slate-400 font-bold flex items-center justify-center">
                            mm
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {[5, 6, 8, 10, 12].map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => {
                                setTempManualDia(d);
                                handleApplyTempManualRebar(d, tempManualSpacing);
                              }}
                              className={`px-2.5 py-1 text-[10px] rounded-lg font-mono font-semibold transition cursor-pointer ${
                                tempManualDia === d
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-700'
                              }`}
                            >
                              φ{d}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Rebar Spacing Input */}
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1.5">
                          {isFa ? 'فاصله آرماتورها (s):' : 'Rebar Spacing (s):'}
                        </label>
                        <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-950 mb-2" dir="ltr">
                          <input
                            type="number"
                            min="50"
                            max="400"
                            step="25"
                            value={tempManualSpacing}
                            onChange={(e) => {
                              const sp = parseFloat(e.target.value) || 0;
                              setTempManualSpacing(sp);
                              handleApplyTempManualRebar(tempManualDia, sp);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs font-mono font-bold text-slate-100 text-left bg-transparent focus:outline-none tabular-nums"
                          />
                          <span className="bg-slate-900 border-l border-slate-800 px-2.5 py-1 text-xs text-slate-400 font-bold flex items-center justify-center">
                            mm
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {[100, 125, 150, 200, 250].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => {
                                setTempManualSpacing(s);
                                handleApplyTempManualRebar(tempManualDia, s);
                              }}
                              className={`px-2.5 py-1 text-[10px] rounded-lg font-mono font-semibold transition cursor-pointer ${
                                tempManualSpacing === s
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-700'
                              }`}
                            >
                              @{s}mm
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Calculated Live Result Card & Apply Button */}
                    <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="space-y-0.5">
                        <div className="text-[11px] text-slate-300 font-medium">
                          {isFa ? 'آرماتوربندی حاصل:' : 'Resulting Reinforcement:'}{' '}
                          <strong className="text-indigo-200 font-mono font-black" dir="ltr">
                            φ{tempManualDia}@{tempManualSpacing} mm
                          </strong>
                        </div>
                        <div className="text-xs text-indigo-300 font-bold font-mono tabular-nums" dir="ltr">
                          As = {calcRebarArea(tempManualDia, tempManualSpacing)} mm²/m ({(calcRebarArea(tempManualDia, tempManualSpacing) / 100).toFixed(2)} cm²/m)
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApplyTempManualRebar(tempManualDia, tempManualSpacing)}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isFa ? 'اعمال به شاتکریت' : 'Apply to Shotcrete'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Fine-Tuning Cross-Sectional Areas Inputs */}
                <div className="pt-2 border-t border-slate-800">
                  <div className="text-[11px] text-slate-400 font-semibold mb-1.5 flex items-center justify-between">
                    <span>{isFa ? 'سطح مقطع جهت‌های مختلف (قابلیت اصلاح مستقل):' : 'Directional Reinforcement Areas:'}</span>
                    <span className="text-[10px] font-mono text-slate-400">mm²/m</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">{t.meshAvn}:</label>
                      <input
                        type="number"
                        value={inputs.tempMesh.avn}
                        onChange={(e) =>
                          onChange({
                            ...inputs,
                            tempMesh: { ...inputs.tempMesh, avn: parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-700 rounded-lg bg-slate-950 font-mono text-slate-100 tabular-nums focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">{t.meshAvm}:</label>
                      <input
                        type="number"
                        value={inputs.tempMesh.avm}
                        onChange={(e) =>
                          onChange({
                            ...inputs,
                            tempMesh: { ...inputs.tempMesh, avm: parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-700 rounded-lg bg-slate-950 font-mono text-slate-100 tabular-nums focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">{t.meshAhn}:</label>
                      <input
                        type="number"
                        value={inputs.tempMesh.ahn}
                        onChange={(e) =>
                          onChange({
                            ...inputs,
                            tempMesh: { ...inputs.tempMesh, ahn: parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-700 rounded-lg bg-slate-950 font-mono text-slate-100 tabular-nums focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">{t.meshAhm}:</label>
                      <input
                        type="number"
                        value={inputs.tempMesh.ahm}
                        onChange={(e) =>
                          onChange({
                            ...inputs,
                            tempMesh: { ...inputs.tempMesh, ahm: parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-700 rounded-lg bg-slate-950 font-mono text-slate-100 tabular-nums focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Output: Temp Facing Flexure & Punching */}
            <div className="lg:col-span-5 bg-slate-950/70 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between space-y-4">
              {/* Flexure Check */}
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200">
                    {isFa ? 'کنترل خمش شاتکریت موقت' : 'Temp Facing Flexure'}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                      tempFlexure.isPassed
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/35'
                    }`}
                  >
                    {tempFlexure.isPassed ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {tempFlexure.isPassed ? (isFa ? 'OK (تأمین شد)' : 'OK (PASS)') : (isFa ? 'NG (مردود)' : 'NG (FAIL)')}
                  </span>
                </div>

                <div className="mt-2.5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isFa ? 'پارامتر هندسی (F):' : 'Geometry (F):'}</span>
                    <span className="font-mono text-slate-200 tabular-nums" dir="ltr">{tempFlexure.F} mm²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t.facingFlexureRes}:</span>
                    <span className="font-mono text-slate-200 tabular-nums" dir="ltr">RFF = {tempFlexure.RFF} kN</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isFa ? 'مقاومت طراحی (φFF · RFF):' : 'Factored Resistance:'}</span>
                    <span className="font-mono font-bold text-emerald-300 tabular-nums" dir="ltr">{tempFlexure.factoredResistance} kN</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800/60">
                    <span className="font-bold text-slate-200">{t.facingFlexureCDR}:</span>
                    <span
                      className={`font-mono font-black text-xs tabular-nums ${
                        tempFlexure.CDR >= 1.0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                      dir="ltr"
                    >
                      {tempFlexure.CDR} {tempFlexure.CDR >= 1.0 ? '≥ 1.0 (OK)' : '< 1.0 (NG)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Punching Shear Check */}
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200">
                    {isFa ? 'کنترل برش پانچینگ شاتکریت' : 'Temp Facing Punching Shear'}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                      tempPunching.isPassed
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/35'
                    }`}
                  >
                    {tempPunching.isPassed ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {tempPunching.isPassed ? (isFa ? 'OK (تأمین شد)' : 'OK (PASS)') : (isFa ? 'NG (مردود)' : 'NG (FAIL)')}
                  </span>
                </div>

                <div className="mt-2.5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t.facingPunchingDc}:</span>
                    <span className="font-mono text-slate-200 tabular-nums" dir="ltr">Dc' = {tempPunching.DcPrime} m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t.facingPunchingRes}:</span>
                    <span className="font-mono text-slate-200 tabular-nums" dir="ltr">VF = {tempPunching.VF} kN</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isFa ? 'مقاومت طراحی پانچ (φFP · RFP):' : 'Factored Punching:'}</span>
                    <span className="font-mono font-bold text-indigo-300 tabular-nums" dir="ltr">{tempPunching.factoredResistance} kN</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800/60">
                    <span className="font-bold text-slate-200">{t.facingPunchingCDR}:</span>
                    <span
                      className={`font-mono font-black text-xs tabular-nums ${
                        tempPunching.CDR >= 1.0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                      dir="ltr"
                    >
                      {tempPunching.CDR} {tempPunching.CDR >= 1.0 ? '≥ 1.0 (OK)' : '< 1.0 (NG)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: FINAL / PERMANENT CONCRETE FACING */}
        {activeFacingSubTab === 'perm' && isTemporarySystem && (
          <div className="p-6 rounded-2xl bg-amber-950/25 border border-amber-500/35 text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/35 text-xs font-bold">
              <span>{isFa ? 'غیرالزامی — سیستم نیلینگ موقت' : 'Not Required — Temporary Nailing System'}</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100">
              {isFa
                ? 'سیستم موقت به رویه پوشش دائم (بتن نهایی) نیاز ندارد'
                : 'Temporary Soil Nail System Does Not Require Permanent Facing'}
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {isFa
                ? 'در سربرگ «مشخصات سیستم نیلینگ»، نوع سازه به صورت موقت (< ۲ سال) انتخاب شده است. بر اساس آیین‌نامه AASHTO LRFD و FHWA-NHI-14-007 برای پایدارسازی موقت گودها، تنها طراحی و کنترل پوشش شاتکریت اولیه (زیربخش ۱) ملاک عمل است.'
                : 'Your system is currently set to Temporary (< 2 years) in the Nailing System tab. Per AASHTO LRFD & FHWA-NHI-14-007, only the temporary shotcrete facing needs verification.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setActiveFacingSubTab('temp')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer transition"
              >
                {isFa ? 'بازگشت به شاتکریت موقت' : 'Back to Temporary Shotcrete'}
              </button>
              {onGoToSystemSpecs && (
                <button
                  type="button"
                  onClick={onGoToSystemSpecs}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/35 font-bold text-xs cursor-pointer transition"
                >
                  {isFa ? 'تغییر نوع سیستم به دائم در تب مشخصات سیستم' : 'Switch to Permanent in System Tab'}
                </button>
              )}
            </div>
          </div>
        )}

        {activeFacingSubTab === 'perm' && !isTemporarySystem && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Thickness h_perm */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t.paramFacingThickness}
                  </label>
                  <div className="flex rounded-xl border border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 bg-slate-950" dir="ltr">
                    <input
                      type="number"
                      dir="ltr"
                      min="100"
                      max="400"
                      step="10"
                      value={inputs.permThickness}
                      onChange={(e) => onChange({ ...inputs, permThickness: parseFloat(e.target.value) || 200 })}
                      className="w-full px-3 py-2 text-sm font-mono text-slate-100 text-left bg-transparent focus:outline-none tabular-nums"
                    />
                    <span className="bg-slate-900 border-l border-slate-800 px-3 py-2 text-xs font-semibold text-slate-400 shrink-0 select-none flex items-center justify-center min-w-[44px]">
                      mm
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {isFa ? `معادل ${(inputs.permThickness / 10).toFixed(0)} سانتی‌متر بتن مسلح` : `${(inputs.permThickness / 10).toFixed(0)} cm`}
                  </p>
                </div>

                {/* f'c Concrete */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t.paramFacingFc}
                  </label>
                  <div className="flex rounded-xl border border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 bg-slate-950" dir="ltr">
                    <input
                      type="number"
                      dir="ltr"
                      min="20"
                      max="50"
                      step="5"
                      value={inputs.permFc}
                      onChange={(e) => onChange({ ...inputs, permFc: parseFloat(e.target.value) || 30 })}
                      className="w-full px-3 py-2 text-sm font-mono text-slate-100 text-left bg-transparent focus:outline-none tabular-nums"
                    />
                    <span className="bg-slate-900 border-l border-slate-800 px-3 py-2 text-xs font-semibold text-slate-400 shrink-0 select-none flex items-center justify-center min-w-[44px]">
                      MPa
                    </span>
                  </div>
                </div>

                {/* CF Factor (Always 1.0 for permanent) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t.paramCF}
                  </label>
                  <input
                    type="number"
                    disabled
                    value={1.0}
                    className="w-full px-3 py-2 text-sm border border-slate-800 rounded-xl bg-slate-950/60 font-mono text-slate-500 tabular-nums"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    {isFa ? 'برای پوشش دائم همواره CF = 1.0 است' : 'CF = 1.0 for permanent facings'}
                  </p>
                </div>
              </div>

              {/* Reinforcement Configuration: Standard Mesh vs Manual Rebar Input for Permanent Facing */}
              <div className="space-y-3 pt-1">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{isFa ? 'تعیین مشخصات آرماتوربندی بتن دائم:' : 'Permanent Facing Reinforcement:'}</span>
                  </label>

                  {/* Mode Toggle */}
                  <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setPermMode('standard')}
                      className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                        permMode === 'standard'
                          ? 'bg-slate-800 text-indigo-300 border border-slate-700 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isFa ? 'مش استاندارد پیش‌ساخته' : 'Standard Mesh Presets'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPermMode('manual')}
                      className={`px-3 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                        permMode === 'manual'
                          ? 'bg-indigo-600 text-white font-bold shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{isFa ? 'ورود دستی قطر و فواصل میلگرد' : 'Manual Rebar (d & s)'}</span>
                    </button>
                  </div>
                </div>

                {/* Option 1: Standard Welded Wire Mesh Grid Selector */}
                {permMode === 'standard' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {STANDARD_MESH_OPTIONS.map((mesh, idx) => {
                      const isSelected = inputs.permMesh.avn === mesh.areaMm2PerM;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setPermManualDia(mesh.wireDiameterMm);
                            setPermManualSpacing(mesh.spacingMm);
                            handlePermMeshSelect(mesh.areaMm2PerM, mesh.wireDiameterMm, mesh.spacingMm);
                          }}
                          className={`px-3 py-2.5 rounded-xl border text-xs text-left transition cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600/25 text-indigo-200 border-indigo-400/60 font-bold shadow-sm'
                              : 'bg-slate-950/70 hover:bg-slate-800 text-slate-300 border-slate-800'
                          }`}
                        >
                          <div>{isFa ? mesh.labelFa : mesh.labelEn}</div>
                          <div className={`text-[10px] font-mono tabular-nums mt-0.5 ${isSelected ? 'text-indigo-300' : 'text-slate-400'}`}>
                            {mesh.areaMm2PerM} mm²/m
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Option 2: Manual Rebar Diameter & Spacing Input */}
                {permMode === 'manual' && (
                  <div className="bg-indigo-950/25 border border-indigo-500/30 rounded-xl p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-indigo-200 font-bold border-b border-indigo-500/20 pb-2">
                      <span className="flex items-center gap-1.5">
                        <Calculator className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{isFa ? 'طراحی سفارشی آرماتور بتن دائم: قطر و فواصل' : 'Custom Permanent Rebar Size & Spacing'}</span>
                      </span>
                      <span className="text-[11px] font-mono text-indigo-300" dir="ltr">
                        As = (1000/s) · (π·d²/4)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Rebar Diameter Input */}
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1.5">
                          {isFa ? 'قطر میلگرد دیواره دائم (d):' : 'Rebar Diameter (d):'}
                        </label>
                        <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-950 mb-2" dir="ltr">
                          <input
                            type="number"
                            min="6"
                            max="36"
                            step="1"
                            value={permManualDia}
                            onChange={(e) => {
                              const dia = parseFloat(e.target.value) || 0;
                              setPermManualDia(dia);
                              handleApplyPermManualRebar(dia, permManualSpacing);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs font-mono font-bold text-slate-100 text-left bg-transparent focus:outline-none tabular-nums"
                          />
                          <span className="bg-slate-900 border-l border-slate-800 px-2.5 py-1 text-xs text-slate-400 font-bold flex items-center justify-center">
                            mm
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {[8, 10, 12, 14, 16, 18, 20].map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => {
                                setPermManualDia(d);
                                handleApplyPermManualRebar(d, permManualSpacing);
                              }}
                              className={`px-2.5 py-1 text-[10px] rounded-lg font-mono font-semibold transition cursor-pointer ${
                                permManualDia === d
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-700'
                              }`}
                            >
                              φ{d}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Rebar Spacing Input */}
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1.5">
                          {isFa ? 'فاصله آرماتورها (s):' : 'Rebar Spacing (s):'}
                        </label>
                        <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-950 mb-2" dir="ltr">
                          <input
                            type="number"
                            min="50"
                            max="400"
                            step="25"
                            value={permManualSpacing}
                            onChange={(e) => {
                              const sp = parseFloat(e.target.value) || 0;
                              setPermManualSpacing(sp);
                              handleApplyPermManualRebar(permManualDia, sp);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs font-mono font-bold text-slate-100 text-left bg-transparent focus:outline-none tabular-nums"
                          />
                          <span className="bg-slate-900 border-l border-slate-800 px-2.5 py-1 text-xs text-slate-400 font-bold flex items-center justify-center">
                            mm
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {[100, 125, 150, 200, 250, 300].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => {
                                setPermManualSpacing(s);
                                handleApplyPermManualRebar(permManualDia, s);
                              }}
                              className={`px-2.5 py-1 text-[10px] rounded-lg font-mono font-semibold transition cursor-pointer ${
                                permManualSpacing === s
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-700'
                              }`}
                            >
                              @{s}mm
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Calculated Live Result Card & Apply Button */}
                    <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="space-y-0.5">
                        <div className="text-[11px] text-slate-300 font-medium">
                          {isFa ? 'آرماتوربندی حاصل:' : 'Resulting Reinforcement:'}{' '}
                          <strong className="text-indigo-200 font-mono font-black" dir="ltr">
                            φ{permManualDia}@{permManualSpacing} mm
                          </strong>
                        </div>
                        <div className="text-xs text-indigo-300 font-bold font-mono tabular-nums" dir="ltr">
                          As = {calcRebarArea(permManualDia, permManualSpacing)} mm²/m ({(calcRebarArea(permManualDia, permManualSpacing) / 100).toFixed(2)} cm²/m)
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApplyPermManualRebar(permManualDia, permManualSpacing)}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isFa ? 'اعمال به بتن دائم' : 'Apply to Permanent Facing'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Fine-Tuning Cross-Sectional Areas Inputs */}
                <div className="pt-2 border-t border-slate-800">
                  <div className="text-[11px] text-slate-400 font-semibold mb-1.5 flex items-center justify-between">
                    <span>{isFa ? 'سطح مقطع جهت‌های مختلف (قابلیت اصلاح مستقل):' : 'Directional Reinforcement Areas:'}</span>
                    <span className="text-[10px] font-mono text-slate-400">mm²/m</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">{t.meshAvn}:</label>
                      <input
                        type="number"
                        value={inputs.permMesh.avn}
                        onChange={(e) =>
                          onChange({
                            ...inputs,
                            permMesh: { ...inputs.permMesh, avn: parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-700 rounded-lg bg-slate-950 font-mono text-slate-100 tabular-nums focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">{t.meshAvm}:</label>
                      <input
                        type="number"
                        value={inputs.permMesh.avm}
                        onChange={(e) =>
                          onChange({
                            ...inputs,
                            permMesh: { ...inputs.permMesh, avm: parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-700 rounded-lg bg-slate-950 font-mono text-slate-100 tabular-nums focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">{t.meshAhn}:</label>
                      <input
                        type="number"
                        value={inputs.permMesh.ahn}
                        onChange={(e) =>
                          onChange({
                            ...inputs,
                            permMesh: { ...inputs.permMesh, ahn: parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-700 rounded-lg bg-slate-950 font-mono text-slate-100 tabular-nums focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">{t.meshAhm}:</label>
                      <input
                        type="number"
                        value={inputs.permMesh.ahm}
                        onChange={(e) =>
                          onChange({
                            ...inputs,
                            permMesh: { ...inputs.permMesh, ahm: parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-700 rounded-lg bg-slate-950 font-mono text-slate-100 tabular-nums focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Output: Perm Facing Flexure & Punching */}
            <div className="lg:col-span-5 bg-slate-950/70 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between space-y-4">
              {/* Flexure Check */}
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200">
                    {isFa ? 'کنترل خمش بتن دائم' : 'Perm Facing Flexure'}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                      permFlexure.isPassed
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/35'
                    }`}
                  >
                    {permFlexure.isPassed ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {permFlexure.isPassed ? (isFa ? 'OK (تأمین شد)' : 'OK (PASS)') : (isFa ? 'NG (مردود)' : 'NG (FAIL)')}
                  </span>
                </div>

                <div className="mt-2.5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isFa ? 'پارامتر هندسی (F):' : 'Geometry (F):'}</span>
                    <span className="font-mono text-slate-200 tabular-nums" dir="ltr">{permFlexure.F} mm²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t.facingFlexureRes}:</span>
                    <span className="font-mono text-slate-200 tabular-nums" dir="ltr">RFF = {permFlexure.RFF} kN</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isFa ? 'مقاومت طراحی (φFF · RFF):' : 'Factored Resistance:'}</span>
                    <span className="font-mono font-bold text-emerald-300 tabular-nums" dir="ltr">{permFlexure.factoredResistance} kN</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800/60">
                    <span className="font-bold text-slate-200">{t.facingFlexureCDR}:</span>
                    <span
                      className={`font-mono font-black text-xs tabular-nums ${
                        permFlexure.CDR >= 1.0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                      dir="ltr"
                    >
                      {permFlexure.CDR} {permFlexure.CDR >= 1.0 ? '≥ 1.0 (OK)' : '< 1.0 (NG)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Punching Shear Check */}
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200">
                    {isFa ? 'کنترل برش پانچینگ بتن دائم' : 'Perm Facing Punching Shear'}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                      permPunching.isPassed
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/35'
                    }`}
                  >
                    {permPunching.isPassed ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {permPunching.isPassed ? (isFa ? 'OK (تأمین شد)' : 'OK (PASS)') : (isFa ? 'NG (مردود)' : 'NG (FAIL)')}
                  </span>
                </div>

                <div className="mt-2.5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t.facingPunchingDc}:</span>
                    <span className="font-mono text-slate-200 tabular-nums" dir="ltr">Dc' = {permPunching.DcPrime} m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t.facingPunchingRes}:</span>
                    <span className="font-mono text-slate-200 tabular-nums" dir="ltr">VF = {permPunching.VF} kN</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isFa ? 'مقاومت طراحی پانچ (φFP · RFP):' : 'Factored Punching:'}</span>
                    <span className="font-mono font-bold text-indigo-300 tabular-nums" dir="ltr">{permPunching.factoredResistance} kN</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800/60">
                    <span className="font-bold text-slate-200">{t.facingPunchingCDR}:</span>
                    <span
                      className={`font-mono font-black text-xs tabular-nums ${
                        permPunching.CDR >= 1.0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                      dir="ltr"
                    >
                      {permPunching.CDR} {permPunching.CDR >= 1.0 ? '≥ 1.0 (OK)' : '< 1.0 (NG)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: HEADED STUDS TENSILE CHECK */}
        {activeFacingSubTab === 'studs' && isTemporarySystem && (
          <div className="p-6 rounded-2xl bg-amber-950/25 border border-amber-500/35 text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/35 text-xs font-bold">
              <span>{isFa ? 'غیرالزامی — سیستم نیلینگ موقت' : 'Not Required — Temporary Nailing System'}</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100">
              {isFa
                ? 'گل‌میخ‌های اتصال سر نیل در سیستم موقت حذف می‌شوند'
                : 'Headed Studs Are Omitted for Temporary Nailing Systems'}
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {isFa
                ? 'گل‌میخ‌ها (Headed Studs) صرفاً برای انتقال کشش سر نیل به شبکه آرماتور بتن دائم کاربرد دارند. از آنجا که این پروژه به عنوان سیستم موقت تعریف شده و فاقد رویه پوشش دائم است، کنترل گل‌میخ‌ها موضوعیت ندارد.'
                : 'Headed studs transfer nail head tension into the permanent concrete facing rebar grid. Because this project is set to Temporary (no permanent facing), headed stud checks are waived.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setActiveFacingSubTab('temp')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer transition"
              >
                {isFa ? 'بازگشت به شاتکریت موقت' : 'Back to Temporary Shotcrete'}
              </button>
              {onGoToSystemSpecs && (
                <button
                  type="button"
                  onClick={onGoToSystemSpecs}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/35 font-bold text-xs cursor-pointer transition"
                >
                  {isFa ? 'تغییر نوع سیستم به دائم' : 'Switch to Permanent System'}
                </button>
              )}
            </div>
          </div>
        )}

        {activeFacingSubTab === 'studs' && !isTemporarySystem && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Count NH */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t.paramStudsCount}
                  </label>
                  <select
                    value={inputs.headedStudsCount}
                    onChange={(e) =>
                      onChange({ ...inputs, headedStudsCount: parseInt(e.target.value) || 4 })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none bg-slate-950 text-slate-100"
                  >
                    <option value={2}>2 {isFa ? 'عدد' : 'studs'}</option>
                    <option value={4}>4 {isFa ? 'عدد (متداول)' : 'studs (Standard)'}</option>
                    <option value={6}>6 {isFa ? 'عدد' : 'studs'}</option>
                    <option value={8}>8 {isFa ? 'عدد' : 'studs'}</option>
                  </select>
                </div>

                {/* Stud Diameter */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t.paramStudDia}
                  </label>
                  <div className="flex rounded-xl border border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 bg-slate-950" dir="ltr">
                    <input
                      type="number"
                      dir="ltr"
                      min="10"
                      max="32"
                      step="2"
                      value={inputs.headedStudDiameter}
                      onChange={(e) =>
                        onChange({ ...inputs, headedStudDiameter: parseFloat(e.target.value) || 16 })
                      }
                      className="w-full px-3 py-2 text-sm font-mono text-slate-100 text-left bg-transparent focus:outline-none tabular-nums"
                    />
                    <span className="bg-slate-900 border-l border-slate-800 px-3 py-2 text-xs font-semibold text-slate-400 shrink-0 select-none flex items-center justify-center min-w-[44px]">
                      mm
                    </span>
                  </div>
                </div>

                {/* Stud fy */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t.paramStudFy}
                  </label>
                  <div className="flex rounded-xl border border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 bg-slate-950" dir="ltr">
                    <input
                      type="number"
                      dir="ltr"
                      min="250"
                      max="600"
                      step="10"
                      value={inputs.headedStudFy}
                      onChange={(e) =>
                        onChange({ ...inputs, headedStudFy: parseFloat(e.target.value) || 350 })
                      }
                      className="w-full px-3 py-2 text-sm font-mono text-slate-100 text-left bg-transparent focus:outline-none tabular-nums"
                    />
                    <span className="bg-slate-900 border-l border-slate-800 px-3 py-2 text-xs font-semibold text-slate-400 shrink-0 select-none flex items-center justify-center min-w-[44px]">
                      MPa
                    </span>
                  </div>
                </div>
              </div>

              {/* Stud Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t.paramStudType}
                  </label>
                  <select
                    value={inputs.headedStudType}
                    onChange={(e) => {
                      const type = e.target.value as 'A307' | 'A325';
                      onChange({ ...inputs, headedStudType: type, phiFH: type === 'A307' ? 0.70 : 0.80 });
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none bg-slate-950 text-slate-100"
                  >
                    <option value="A307">A307 Steel Bolt (φFH = 0.70)</option>
                    <option value="A325">A325 Steel Bolt (φFH = 0.80)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Output: Headed Studs */}
            <div className="lg:col-span-5 bg-slate-950/70 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200">
                    {isFa ? 'نتایج کنترل کشش گل‌میخ‌های سر نیل' : 'Headed Studs Tensile Check'}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                      headedStuds.isPassed
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/35'
                    }`}
                  >
                    {headedStuds.isPassed ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {headedStuds.isPassed ? (isFa ? 'OK (کفایت دارد)' : 'OK (PASS)') : (isFa ? 'NG (مردود)' : 'NG (FAIL)')}
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/70">
                    <span className="text-slate-400">{t.studsFactoredDemand}:</span>
                    <span className="font-mono font-bold text-slate-200 tabular-nums" dir="ltr">
                      γ · T0 = {headedStuds.factoredLoad} kN
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/70">
                    <span className="text-slate-400">{isFa ? 'مساحت کل مقطع گل‌میخ‌ها (As):' : 'Total Stud Area:'}</span>
                    <span className="font-mono text-slate-200 tabular-nums" dir="ltr">
                      {headedStuds.totalAs} cm² ({inputs.headedStudsCount}×{headedStuds.AsSingleStud} cm²)
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/70">
                    <span className="text-slate-400">{t.studsNominalRes}:</span>
                    <span className="font-mono text-slate-200 tabular-nums" dir="ltr">
                      RFH = {headedStuds.RFH} kN
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/70">
                    <span className="text-slate-400">{isFa ? 'مقاومت طراحی (φFH · RFH):' : 'Factored Resistance:'}</span>
                    <span className="font-mono font-bold text-indigo-300 tabular-nums" dir="ltr">
                      {headedStuds.factoredResistance} kN
                    </span>
                  </div>

                  <div className="flex justify-between py-1.5 pt-2">
                    <span className="font-bold text-slate-200">{t.studsCDR}:</span>
                    <span
                      className={`font-mono font-black text-sm tabular-nums ${
                        headedStuds.CDR >= 1.0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                      dir="ltr"
                    >
                      {headedStuds.CDR} {headedStuds.CDR >= 1.0 ? '≥ 1.0 (OK)' : '< 1.0 (NG)'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/25 text-[11px] text-indigo-200 flex items-start gap-2">
                <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  {isFa
                    ? `رابطه آیین‌نامه AASHTO 11.12.6.2.3: φFH · RFH ≥ γp-EV · T0sn با RFH = NH · As · Fy-hs. گل‌میخ‌ها برای انتقال کشش سر نیل به بتن پوشش نهایی طراحی می‌شوند.`
                    : `AASHTO Equation: φFH · RFH ≥ γp-EV · T0sn where RFH = NH · As · Fy-hs.`}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
