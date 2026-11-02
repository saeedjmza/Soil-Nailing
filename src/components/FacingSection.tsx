/**
 * Facing Design Section: Initial Shotcrete & Permanent Facing Flexure, Punching Shear & Headed Studs (AASHTO 11.12.6.2)
 */
import React, { useState } from 'react';
import {
  FacingInputs,
  FacingFlexureResults,
  FacingPunchingResults,
  HeadedStudsResults,
  Language,
} from '../types/nailing';
import { STANDARD_MESH_OPTIONS } from '../constants/standardsData';
import { TRANSLATIONS } from '../utils/translations';
import { HelpCircle, Check, AlertTriangle, Layers, Grid, Shield, Info, Sliders, Calculator, Edit3 } from 'lucide-react';

interface Props {
  inputs: FacingInputs;
  tempFlexure: FacingFlexureResults;
  tempPunching: FacingPunchingResults;
  permFlexure: FacingFlexureResults;
  permPunching: FacingPunchingResults;
  headedStuds: HeadedStudsResults;
  T0: number;
  onChange: (inputs: FacingInputs) => void;
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
  onChange,
  lang,
  onOpenGuidance,
}) => {
  const isFa = lang === 'fa';
  const t = TRANSLATIONS[lang];
  const [activeFacingSubTab, setActiveFacingSubTab] = useState<'temp' | 'perm' | 'studs'>('temp');

  // Manual Custom Rebar Mode vs Standard Mesh Selector states
  const [tempMode, setTempMode] = useState<'standard' | 'manual'>('standard');
  const [tempManualDia, setTempManualDia] = useState<number>(inputs.tempMesh.meshDiameter || 6);
  const [tempManualSpacing, setTempManualSpacing] = useState<number>(inputs.tempMesh.meshSpacing || 150);

  const [permMode, setPermMode] = useState<'standard' | 'manual'>('standard');
  const [permManualDia, setPermManualDia] = useState<number>(inputs.permMesh.meshDiameter || 10);
  const [permManualSpacing, setPermManualSpacing] = useState<number>(inputs.permMesh.meshSpacing || 150);

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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Section Header */}
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black">
              4
            </span>
            <span>{t.secFacingTitle}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{t.secFacingDesc}</p>
        </div>

        <button
          onClick={onOpenGuidance}
          className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{t.parameterGuidance}</span>
        </button>
      </div>

      {/* Grid Spacing Inputs Strip */}
      <div className="px-5 py-3 bg-indigo-50/50 border-b border-indigo-100 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-indigo-950 font-bold">
          <Grid className="w-4 h-4 text-indigo-600" />
          <span>{t.spacingTitle}:</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-slate-700 font-medium">{t.paramSh}:</label>
            <div className="flex rounded-lg border border-slate-300 overflow-hidden bg-white w-32 shadow-2xs shrink-0" dir="ltr">
              <input
                type="number"
                dir="ltr"
                step="0.1"
                min="0.8"
                max="3.5"
                value={inputs.Sh}
                onChange={(e) => onChange({ ...inputs, Sh: parseFloat(e.target.value) || 2.0 })}
                className="w-full px-2.5 py-1 text-xs font-mono text-slate-800 text-left bg-transparent focus:outline-none"
              />
              <span className="bg-slate-100 border-l border-slate-200 px-2.5 py-1 text-xs text-slate-600 font-bold select-none min-w-[32px] flex items-center justify-center">
                m
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-slate-700 font-medium">{t.paramSv}:</label>
            <div className="flex rounded-lg border border-slate-300 overflow-hidden bg-white w-32 shadow-2xs shrink-0" dir="ltr">
              <input
                type="number"
                dir="ltr"
                step="0.1"
                min="0.8"
                max="3.5"
                value={inputs.Sv}
                onChange={(e) => onChange({ ...inputs, Sv: parseFloat(e.target.value) || 2.0 })}
                className="w-full px-2.5 py-1 text-xs font-mono text-slate-800 text-left bg-transparent focus:outline-none"
              />
              <span className="bg-slate-100 border-l border-slate-200 px-2.5 py-1 text-xs text-slate-600 font-bold select-none min-w-[32px] flex items-center justify-center">
                m
              </span>
            </div>
          </div>

          <div className="text-[11px] text-indigo-900 bg-indigo-100/80 px-2.5 py-1 rounded font-mono" dir="ltr">
            T0 = {T0} kN [Smax = {Math.max(inputs.Sh, inputs.Sv)} m]
          </div>
        </div>
      </div>

      {/* Sub Tabs: Temporary / Permanent / Headed Studs */}
      <div className="px-5 pt-3 border-b border-slate-200 flex gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveFacingSubTab('temp')}
          className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeFacingSubTab === 'temp'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>{t.tempFacingTitle}</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
              tempFlexure.isPassed && tempPunching.isPassed
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {tempFlexure.isPassed && tempPunching.isPassed ? 'OK' : 'NG'}
          </span>
        </button>

        <button
          onClick={() => setActiveFacingSubTab('perm')}
          className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeFacingSubTab === 'perm'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>{t.permFacingTitle}</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
              permFlexure.isPassed && permPunching.isPassed
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {permFlexure.isPassed && permPunching.isPassed ? 'OK' : 'NG'}
          </span>
        </button>

        <button
          onClick={() => setActiveFacingSubTab('studs')}
          className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeFacingSubTab === 'studs'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>{t.headedStudsTitle}</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
              headedStuds.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}
          >
            {headedStuds.isPassed ? 'OK' : 'NG'}
          </span>
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.paramFacingThickness}
                  </label>
                  <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 bg-white shadow-2xs" dir="ltr">
                    <input
                      type="number"
                      dir="ltr"
                      min="80"
                      max="300"
                      step="10"
                      value={inputs.tempThickness}
                      onChange={(e) => handleTempThicknessChange(parseFloat(e.target.value) || 150)}
                      className="w-full px-3 py-2 text-sm font-mono text-slate-800 text-left bg-transparent focus:outline-none"
                    />
                    <span className="bg-slate-100 border-l border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 shrink-0 select-none flex items-center justify-center min-w-[42px]">
                      mm
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {isFa ? `معادل ${(inputs.tempThickness / 10).toFixed(0)} سانتی‌متر` : `${(inputs.tempThickness / 10).toFixed(0)} cm`}
                  </p>
                </div>

                {/* f'c Shotcrete */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.paramFacingFc}
                  </label>
                  <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 bg-white shadow-2xs" dir="ltr">
                    <input
                      type="number"
                      dir="ltr"
                      min="15"
                      max="45"
                      step="5"
                      value={inputs.tempFc}
                      onChange={(e) => onChange({ ...inputs, tempFc: parseFloat(e.target.value) || 20 })}
                      className="w-full px-3 py-2 text-sm font-mono text-slate-800 text-left bg-transparent focus:outline-none"
                    />
                    <span className="bg-slate-100 border-l border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 shrink-0 select-none flex items-center justify-center min-w-[42px]">
                      MPa
                    </span>
                  </div>
                </div>

                {/* CF Factor */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.paramCF}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1.0"
                      max="2.5"
                      step="0.1"
                      value={inputs.tempCF}
                      onChange={(e) => onChange({ ...inputs, tempCF: parseFloat(e.target.value) || 1.5 })}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-slate-800"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{t.paramCFHelp}</p>
                </div>
              </div>

              {/* Reinforcement Configuration: Standard Mesh vs Manual Rebar Input */}
              <div className="space-y-3 pt-1">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{isFa ? 'تعیین مشخصات آرماتوربندی شاتکریت موقت:' : 'Temporary Facing Reinforcement:'}</span>
                  </label>

                  {/* Mode Toggle Pills */}
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setTempMode('standard')}
                      className={`px-2.5 py-1 rounded-md transition ${
                        tempMode === 'standard'
                          ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {isFa ? 'مش استاندارد پیش‌ساخته' : 'Standard Mesh Presets'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTempMode('manual')}
                      className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                        tempMode === 'manual'
                          ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{isFa ? 'ورود دستی قطر و فواصل میلگرد' : 'Manual Rebar (d & s)'}</span>
                    </button>
                  </div>
                </div>

                {/* Option 1: Standard Welded Wire Mesh Grid Selector */}
                {tempMode === 'standard' && (
                  <div>
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
                            className={`px-3 py-2 rounded-lg border text-xs text-left transition ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <div>{isFa ? mesh.labelFa : mesh.labelEn}</div>
                            <div className={`text-[10px] ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                              {mesh.areaMm2PerM} mm²/m
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Option 2: Manual Rebar Diameter & Spacing Input (User Requested Feature) */}
                {tempMode === 'manual' && (
                  <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-indigo-950 font-bold border-b border-indigo-200/60 pb-1.5">
                      <span className="flex items-center gap-1">
                        <Calculator className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{isFa ? 'طراحی سفارشی: قطر میلگرد و فواصل شبکه' : 'Custom Rebar Size & Spacing'}</span>
                      </span>
                      <span className="text-[11px] font-mono text-indigo-700">
                        As = (1000/s) · (π·d²/4)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Rebar Diameter Input */}
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">
                          {isFa ? 'قطر میلگرد شبکه (d):' : 'Rebar Diameter (d):'}
                        </label>
                        <div className="flex rounded-lg border border-slate-300 overflow-hidden bg-white shadow-2xs mb-1.5" dir="ltr">
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
                            className="w-full px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800 text-left bg-transparent focus:outline-none"
                          />
                          <span className="bg-slate-100 border-l border-slate-200 px-2.5 py-1 text-xs text-slate-600 font-bold flex items-center justify-center">
                            mm
                          </span>
                        </div>
                        {/* Quick Diameter Chips */}
                        <div className="flex flex-wrap gap-1">
                          {[5, 6, 8, 10, 12].map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => {
                                setTempManualDia(d);
                                handleApplyTempManualRebar(d, tempManualSpacing);
                              }}
                              className={`px-2 py-0.5 text-[10px] rounded font-mono font-semibold transition ${
                                tempManualDia === d
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-white hover:bg-indigo-100 text-indigo-900 border border-indigo-200'
                              }`}
                            >
                              φ{d}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Rebar Spacing Input */}
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">
                          {isFa ? 'فاصله آرماتورها (s):' : 'Rebar Spacing (s):'}
                        </label>
                        <div className="flex rounded-lg border border-slate-300 overflow-hidden bg-white shadow-2xs mb-1.5" dir="ltr">
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
                            className="w-full px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800 text-left bg-transparent focus:outline-none"
                          />
                          <span className="bg-slate-100 border-l border-slate-200 px-2.5 py-1 text-xs text-slate-600 font-bold flex items-center justify-center">
                            mm
                          </span>
                        </div>
                        {/* Quick Spacing Chips */}
                        <div className="flex flex-wrap gap-1">
                          {[100, 125, 150, 200, 250].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => {
                                setTempManualSpacing(s);
                                handleApplyTempManualRebar(tempManualDia, s);
                              }}
                              className={`px-2 py-0.5 text-[10px] rounded font-mono font-semibold transition ${
                                tempManualSpacing === s
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-white hover:bg-indigo-100 text-indigo-900 border border-indigo-200'
                              }`}
                            >
                              @{s}mm
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Calculated Live Result Card & Apply Button */}
                    <div className="bg-white rounded-lg p-2.5 border border-indigo-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="space-y-0.5">
                        <div className="text-[11px] text-slate-600 font-medium">
                          {isFa ? 'آرماتوربندی حاصل:' : 'Resulting Reinforcement:'}{' '}
                          <strong className="text-indigo-950 font-mono font-black" dir="ltr">
                            φ{tempManualDia}@{tempManualSpacing} mm
                          </strong>
                        </div>
                        <div className="text-xs text-indigo-700 font-bold font-mono" dir="ltr">
                          As = {calcRebarArea(tempManualDia, tempManualSpacing)} mm²/m ({(calcRebarArea(tempManualDia, tempManualSpacing) / 100).toFixed(2)} cm²/m)
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApplyTempManualRebar(tempManualDia, tempManualSpacing)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isFa ? 'اعمال به شاتکریت' : 'Apply to Shotcrete'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Fine-Tuning Cross-Sectional Areas Inputs */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] text-slate-500 font-semibold mb-1 flex items-center justify-between">
                    <span>{isFa ? 'سطح مقطع جهت‌های مختلف (قابلیت اصلاح مستقل):' : 'Directional Reinforcement Areas:'}</span>
                    <span className="text-[10px] font-mono text-slate-400">mm²/m</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-600">{t.meshAvn}:</label>
                      <input
                        type="number"
                        value={inputs.tempMesh.avn}
                        onChange={(e) =>
                          onChange({
                            ...inputs,
                            tempMesh: { ...inputs.tempMesh, avn: parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border rounded font-mono text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-600">{t.meshAvm}:</label>
                      <input
                        type="number"
                        value={inputs.tempMesh.avm}
                        onChange={(e) =>
                          onChange({
                            ...inputs,
                            tempMesh: { ...inputs.tempMesh, avm: parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border rounded font-mono text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-600">{t.meshAhn}:</label>
                      <input
                        type="number"
                        value={inputs.tempMesh.ahn}
                        onChange={(e) =>
                          onChange({
                            ...inputs,
                            tempMesh: { ...inputs.tempMesh, ahn: parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border rounded font-mono text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-600">{t.meshAhm}:</label>
                      <input
                        type="number"
                        value={inputs.tempMesh.ahm}
                        onChange={(e) =>
                          onChange({
                            ...inputs,
                            tempMesh: { ...inputs.tempMesh, ahm: parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border rounded font-mono text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Output: Temp Facing Flexure & Punching */}
            <div className="lg:col-span-5 bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between space-y-4">
              {/* Flexure Check */}
              <div className="border-b border-slate-200 pb-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <span className="text-xs font-bold text-slate-700">
                    {isFa ? 'کنترل خمش شاتکریت موقت' : 'Temp Facing Flexure'}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      tempFlexure.isPassed
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {tempFlexure.isPassed ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {tempFlexure.isPassed ? 'OK (تأمین شد)' : 'NG (مردود)'}
                  </span>
                </div>

                <div className="mt-2 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">{isFa ? 'پارامتر هندسی (F):' : 'Geometry (F):'}</span>
                    <span className="font-mono text-slate-800">{tempFlexure.F} mm²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t.facingFlexureRes}:</span>
                    <span className="font-mono text-slate-800">RFF = {tempFlexure.RFF} kN</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{isFa ? 'مقاومت طراحی (φFF · RFF):' : 'Factored Resistance:'}</span>
                    <span className="font-mono font-bold text-emerald-700">{tempFlexure.factoredResistance} kN</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="font-bold text-slate-700">{t.facingFlexureCDR}:</span>
                    <span
                      className={`font-mono font-black text-xs ${
                        tempFlexure.CDR >= 1.0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {tempFlexure.CDR} {tempFlexure.CDR >= 1.0 ? '≥ 1.0 (OK)' : '< 1.0 (NG)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Punching Shear Check */}
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <span className="text-xs font-bold text-slate-700">
                    {isFa ? 'کنترل برش پانچینگ شاتکریت' : 'Temp Facing Punching Shear'}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      tempPunching.isPassed
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {tempPunching.isPassed ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {tempPunching.isPassed ? 'OK (تأمین شد)' : 'NG (مردود)'}
                  </span>
                </div>

                <div className="mt-2 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t.facingPunchingDc}:</span>
                    <span className="font-mono text-slate-800">Dc\' = {tempPunching.DcPrime} m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t.facingPunchingRes}:</span>
                    <span className="font-mono text-slate-800">VF = {tempPunching.VF} kN</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{isFa ? 'مقاومت طراحی پانچ (φFP · RFP):' : 'Factored Punching:'}</span>
                    <span className="font-mono font-bold text-indigo-700">{tempPunching.factoredResistance} kN</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="font-bold text-slate-700">{t.facingPunchingCDR}:</span>
                    <span
                      className={`font-mono font-black text-xs ${
                        tempPunching.CDR >= 1.0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
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
        {activeFacingSubTab === 'perm' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Thickness h_perm */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.paramFacingThickness}
                  </label>
                  <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 bg-white shadow-2xs" dir="ltr">
                    <input
                      type="number"
                      dir="ltr"
                      min="100"
                      max="400"
                      step="10"
                      value={inputs.permThickness}
                      onChange={(e) => onChange({ ...inputs, permThickness: parseFloat(e.target.value) || 200 })}
                      className="w-full px-3 py-2 text-sm font-mono text-slate-800 text-left bg-transparent focus:outline-none"
                    />
                    <span className="bg-slate-100 border-l border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 shrink-0 select-none flex items-center justify-center min-w-[42px]">
                      mm
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {isFa ? `معادل ${(inputs.permThickness / 10).toFixed(0)} سانتی‌متر بتن مسلح` : `${(inputs.permThickness / 10).toFixed(0)} cm`}
                  </p>
                </div>

                {/* f'c Concrete */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.paramFacingFc}
                  </label>
                  <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 bg-white shadow-2xs" dir="ltr">
                    <input
                      type="number"
                      dir="ltr"
                      min="20"
                      max="50"
                      step="5"
                      value={inputs.permFc}
                      onChange={(e) => onChange({ ...inputs, permFc: parseFloat(e.target.value) || 30 })}
                      className="w-full px-3 py-2 text-sm font-mono text-slate-800 text-left bg-transparent focus:outline-none"
                    />
                    <span className="bg-slate-100 border-l border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 shrink-0 select-none flex items-center justify-center min-w-[42px]">
                      MPa
                    </span>
                  </div>
                </div>

                {/* CF Factor (Always 1.0 for permanent) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.paramCF}
                  </label>
                  <input
                    type="number"
                    disabled
                    value={1.0}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-100 font-mono text-slate-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    {isFa ? 'برای پوشش دائم همواره CF = 1.0 است' : 'CF = 1.0 for permanent facings'}
                  </p>
                </div>
              </div>

              {/* Reinforcement Configuration: Standard Mesh vs Manual Rebar Input for Permanent Facing */}
              <div className="space-y-3 pt-1">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{isFa ? 'تعیین مشخصات آرماتوربندی بتن دائم:' : 'Permanent Facing Reinforcement:'}</span>
                  </label>

                  {/* Mode Toggle Pills */}
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setPermMode('standard')}
                      className={`px-2.5 py-1 rounded-md transition ${
                        permMode === 'standard'
                          ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {isFa ? 'مش استاندارد پیش‌ساخته' : 'Standard Mesh Presets'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPermMode('manual')}
                      className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                        permMode === 'manual'
                          ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{isFa ? 'ورود دستی قطر و فواصل میلگرد' : 'Manual Rebar (d & s)'}</span>
                    </button>
                  </div>
                </div>

                {/* Option 1: Standard Welded Wire Mesh Grid Selector */}
                {permMode === 'standard' && (
                  <div>
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
                            className={`px-3 py-2 rounded-lg border text-xs text-left transition ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <div>{isFa ? mesh.labelFa : mesh.labelEn}</div>
                            <div className={`text-[10px] ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                              {mesh.areaMm2PerM} mm²/m
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Option 2: Manual Rebar Diameter & Spacing Input (User Requested Feature) */}
                {permMode === 'manual' && (
                  <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-indigo-950 font-bold border-b border-indigo-200/60 pb-1.5">
                      <span className="flex items-center gap-1">
                        <Calculator className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{isFa ? 'طراحی سفارشی آرماتور بتن دائم: قطر و فواصل' : 'Custom Permanent Rebar Size & Spacing'}</span>
                      </span>
                      <span className="text-[11px] font-mono text-indigo-700">
                        As = (1000/s) · (π·d²/4)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Rebar Diameter Input */}
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">
                          {isFa ? 'قطر میلگرد دیواره دائم (d):' : 'Rebar Diameter (d):'}
                        </label>
                        <div className="flex rounded-lg border border-slate-300 overflow-hidden bg-white shadow-2xs mb-1.5" dir="ltr">
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
                            className="w-full px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800 text-left bg-transparent focus:outline-none"
                          />
                          <span className="bg-slate-100 border-l border-slate-200 px-2.5 py-1 text-xs text-slate-600 font-bold flex items-center justify-center">
                            mm
                          </span>
                        </div>
                        {/* Quick Diameter Chips for Permanent */}
                        <div className="flex flex-wrap gap-1">
                          {[8, 10, 12, 14, 16, 18, 20].map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => {
                                setPermManualDia(d);
                                handleApplyPermManualRebar(d, permManualSpacing);
                              }}
                              className={`px-2 py-0.5 text-[10px] rounded font-mono font-semibold transition ${
                                permManualDia === d
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-white hover:bg-indigo-100 text-indigo-900 border border-indigo-200'
                              }`}
                            >
                              φ{d}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Rebar Spacing Input */}
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">
                          {isFa ? 'فاصله آرماتورها (s):' : 'Rebar Spacing (s):'}
                        </label>
                        <div className="flex rounded-lg border border-slate-300 overflow-hidden bg-white shadow-2xs mb-1.5" dir="ltr">
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
                            className="w-full px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800 text-left bg-transparent focus:outline-none"
                          />
                          <span className="bg-slate-100 border-l border-slate-200 px-2.5 py-1 text-xs text-slate-600 font-bold flex items-center justify-center">
                            mm
                          </span>
                        </div>
                        {/* Quick Spacing Chips */}
                        <div className="flex flex-wrap gap-1">
                          {[100, 125, 150, 200, 250, 300].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => {
                                setPermManualSpacing(s);
                                handleApplyPermManualRebar(permManualDia, s);
                              }}
                              className={`px-2 py-0.5 text-[10px] rounded font-mono font-semibold transition ${
                                permManualSpacing === s
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-white hover:bg-indigo-100 text-indigo-900 border border-indigo-200'
                              }`}
                            >
                              @{s}mm
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Calculated Live Result Card & Apply Button */}
                    <div className="bg-white rounded-lg p-2.5 border border-indigo-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="space-y-0.5">
                        <div className="text-[11px] text-slate-600 font-medium">
                          {isFa ? 'آرماتوربندی حاصل:' : 'Resulting Reinforcement:'}{' '}
                          <strong className="text-indigo-950 font-mono font-black" dir="ltr">
                            φ{permManualDia}@{permManualSpacing} mm
                          </strong>
                        </div>
                        <div className="text-xs text-indigo-700 font-bold font-mono" dir="ltr">
                          As = {calcRebarArea(permManualDia, permManualSpacing)} mm²/m ({(calcRebarArea(permManualDia, permManualSpacing) / 100).toFixed(2)} cm²/m)
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApplyPermManualRebar(permManualDia, permManualSpacing)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isFa ? 'اعمال به بتن دائم' : 'Apply to Permanent Facing'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Fine-Tuning Cross-Sectional Areas Inputs */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] text-slate-500 font-semibold mb-1 flex items-center justify-between">
                    <span>{isFa ? 'سطح مقطع جهت‌های مختلف (قابلیت اصلاح مستقل):' : 'Directional Reinforcement Areas:'}</span>
                    <span className="text-[10px] font-mono text-slate-400">mm²/m</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-600">{t.meshAvn}:</label>
                      <input
                        type="number"
                        value={inputs.permMesh.avn}
                        onChange={(e) =>
                          onChange({
                            ...inputs,
                            permMesh: { ...inputs.permMesh, avn: parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border rounded font-mono text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-600">{t.meshAvm}:</label>
                      <input
                        type="number"
                        value={inputs.permMesh.avm}
                        onChange={(e) =>
                          onChange({
                            ...inputs,
                            permMesh: { ...inputs.permMesh, avm: parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border rounded font-mono text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-600">{t.meshAhn}:</label>
                      <input
                        type="number"
                        value={inputs.permMesh.ahn}
                        onChange={(e) =>
                          onChange({
                            ...inputs,
                            permMesh: { ...inputs.permMesh, ahn: parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border rounded font-mono text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-600">{t.meshAhm}:</label>
                      <input
                        type="number"
                        value={inputs.permMesh.ahm}
                        onChange={(e) =>
                          onChange({
                            ...inputs,
                            permMesh: { ...inputs.permMesh, ahm: parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border rounded font-mono text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Output: Perm Facing Flexure & Punching */}
            <div className="lg:col-span-5 bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between space-y-4">
              {/* Flexure Check */}
              <div className="border-b border-slate-200 pb-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <span className="text-xs font-bold text-slate-700">
                    {isFa ? 'کنترل خمش بتن دائم' : 'Perm Facing Flexure'}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      permFlexure.isPassed
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {permFlexure.isPassed ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {permFlexure.isPassed ? 'OK (تأمین شد)' : 'NG (مردود)'}
                  </span>
                </div>

                <div className="mt-2 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">{isFa ? 'پارامتر هندسی (F):' : 'Geometry (F):'}</span>
                    <span className="font-mono text-slate-800">{permFlexure.F} mm²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t.facingFlexureRes}:</span>
                    <span className="font-mono text-slate-800">RFF = {permFlexure.RFF} kN</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{isFa ? 'مقاومت طراحی (φFF · RFF):' : 'Factored Resistance:'}</span>
                    <span className="font-mono font-bold text-emerald-700">{permFlexure.factoredResistance} kN</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="font-bold text-slate-700">{t.facingFlexureCDR}:</span>
                    <span
                      className={`font-mono font-black text-xs ${
                        permFlexure.CDR >= 1.0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {permFlexure.CDR} {permFlexure.CDR >= 1.0 ? '≥ 1.0 (OK)' : '< 1.0 (NG)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Punching Shear Check */}
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <span className="text-xs font-bold text-slate-700">
                    {isFa ? 'کنترل برش پانچینگ بتن دائم' : 'Perm Facing Punching Shear'}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      permPunching.isPassed
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {permPunching.isPassed ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {permPunching.isPassed ? 'OK (تأمین شد)' : 'NG (مردود)'}
                  </span>
                </div>

                <div className="mt-2 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t.facingPunchingDc}:</span>
                    <span className="font-mono text-slate-800">Dc\' = {permPunching.DcPrime} m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t.facingPunchingRes}:</span>
                    <span className="font-mono text-slate-800">VF = {permPunching.VF} kN</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{isFa ? 'مقاومت طراحی پانچ (φFP · RFP):' : 'Factored Punching:'}</span>
                    <span className="font-mono font-bold text-indigo-700">{permPunching.factoredResistance} kN</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="font-bold text-slate-700">{t.facingPunchingCDR}:</span>
                    <span
                      className={`font-mono font-black text-xs ${
                        permPunching.CDR >= 1.0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
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
        {activeFacingSubTab === 'studs' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Count NH */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.paramStudsCount}
                  </label>
                  <select
                    value={inputs.headedStudsCount}
                    onChange={(e) =>
                      onChange({ ...inputs, headedStudsCount: parseInt(e.target.value) || 4 })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value={2}>2 {isFa ? 'عدد' : 'studs'}</option>
                    <option value={4}>4 {isFa ? 'عدد (متداول)' : 'studs (Standard)'}</option>
                    <option value={6}>6 {isFa ? 'عدد' : 'studs'}</option>
                    <option value={8}>8 {isFa ? 'عدد' : 'studs'}</option>
                  </select>
                </div>

                {/* Stud Diameter */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.paramStudDia}
                  </label>
                  <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 bg-white shadow-2xs" dir="ltr">
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
                      className="w-full px-3 py-2 text-sm font-mono text-slate-800 text-left bg-transparent focus:outline-none"
                    />
                    <span className="bg-slate-100 border-l border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 shrink-0 select-none flex items-center justify-center min-w-[42px]">
                      mm
                    </span>
                  </div>
                </div>

                {/* Stud fy */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.paramStudFy}
                  </label>
                  <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 bg-white shadow-2xs" dir="ltr">
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
                      className="w-full px-3 py-2 text-sm font-mono text-slate-800 text-left bg-transparent focus:outline-none"
                    />
                    <span className="bg-slate-100 border-l border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 shrink-0 select-none flex items-center justify-center min-w-[42px]">
                      MPa
                    </span>
                  </div>
                </div>
              </div>

              {/* Stud Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.paramStudType}
                  </label>
                  <select
                    value={inputs.headedStudType}
                    onChange={(e) => {
                      const type = e.target.value as 'A307' | 'A325';
                      onChange({ ...inputs, headedStudType: type, phiFH: type === 'A307' ? 0.70 : 0.80 });
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="A307">A307 Steel Bolt (φFH = 0.70)</option>
                    <option value="A325">A325 Steel Bolt (φFH = 0.80)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Output: Headed Studs */}
            <div className="lg:col-span-5 bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-700">
                    {isFa ? 'نتایج کنترل کشش گل‌میخ‌های سر نیل' : 'Headed Studs Tensile Check'}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      headedStuds.isPassed
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {headedStuds.isPassed ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {headedStuds.isPassed ? 'OK (کفایت دارد)' : 'NG (مردود)'}
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">{t.studsFactoredDemand}:</span>
                    <span className="font-mono font-bold text-slate-800">
                      γ · T0 = {headedStuds.factoredLoad} kN
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">{isFa ? 'مساحت کل مقطع گل‌میخ‌ها (As):' : 'Total Stud Area:'}</span>
                    <span className="font-mono text-slate-800">
                      {headedStuds.totalAs} cm² ({inputs.headedStudsCount}×{headedStuds.AsSingleStud} cm²)
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">{t.studsNominalRes}:</span>
                    <span className="font-mono text-slate-800">
                      RFH = {headedStuds.RFH} kN
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">{isFa ? 'مقاومت طراحی (φFH · RFH):' : 'Factored Resistance:'}</span>
                    <span className="font-mono font-bold text-indigo-700">
                      {headedStuds.factoredResistance} kN
                    </span>
                  </div>

                  <div className="flex justify-between py-1.5 pt-2">
                    <span className="font-bold text-slate-700">{t.studsCDR}:</span>
                    <span
                      className={`font-mono font-black text-sm ${
                        headedStuds.CDR >= 1.0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {headedStuds.CDR} {headedStuds.CDR >= 1.0 ? '≥ 1.0 (OK)' : '< 1.0 (NG)'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-200/70 text-[11px] text-indigo-800 flex items-start gap-2">
                <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
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
