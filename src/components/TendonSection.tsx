/**
 * Nail Tendon Section: Tendon Rebar Diameter & Tensile Resistance (AASHTO 11.12.6.1)
 */
import React from 'react';
import { TendonInputs, TendonResults, Language } from '../types/nailing';
import { STANDARD_REBARS } from '../constants/standardsData';
import { TRANSLATIONS } from '../utils/translations';
import { HelpCircle, Check, AlertTriangle, Shield, Info } from 'lucide-react';

interface Props {
  inputs: TendonInputs;
  results: TendonResults;
  onChange: (inputs: TendonInputs) => void;
  lang: Language;
  onOpenGuidance: () => void;
}

export const TendonSection: React.FC<Props> = ({
  inputs,
  results,
  onChange,
  lang,
  onOpenGuidance,
}) => {
  const isFa = lang === 'fa';
  const t = TRANSLATIONS[lang];

  const handleBarSelect = (dia: number) => {
    onChange({ ...inputs, barDiameter: dia });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Section Header */}
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black">
              1
            </span>
            <span>{t.secTendonTitle}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{t.secTendonDesc}</p>
        </div>

        <button
          onClick={onOpenGuidance}
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{t.parameterGuidance}</span>
        </button>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tmax input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.paramTmax}
              </label>
              <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white shadow-2xs" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  min="1"
                  step="1"
                  value={inputs.Tmax}
                  onChange={(e) => onChange({ ...inputs, Tmax: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm font-mono text-slate-800 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-100 border-l border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 shrink-0 select-none flex items-center justify-center min-w-[42px]">
                  kN
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{t.paramTmaxHelp}</p>
            </div>

            {/* Load Factor gamma_p-EV */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.paramGammaEV}
              </label>
              <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white shadow-2xs" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  step="0.05"
                  min="1.0"
                  max="1.5"
                  value={inputs.loadFactorEV}
                  onChange={(e) => onChange({ ...inputs, loadFactorEV: parseFloat(e.target.value) || 1.35 })}
                  className="w-full px-3 py-2 text-sm font-mono text-slate-800 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-100 border-l border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 shrink-0 select-none flex items-center justify-center min-w-[42px]">
                  γ
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{t.paramGammaEVHelp}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Steel Grade */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.paramSteelGrade}
              </label>
              <select
                value={inputs.steelGrade}
                onChange={(e) => {
                  const grade = e.target.value as any;
                  let fy = 400;
                  let phi = 0.75;
                  if (grade === 'Grade60') { fy = 400; phi = 0.75; }
                  else if (grade === 'Grade75') { fy = 520; phi = 0.75; }
                  else if (grade === 'Grade95') { fy = 655; phi = 0.65; }
                  else if (grade === 'Grade150') { fy = 1035; phi = 0.65; }
                  onChange({ ...inputs, steelGrade: grade, fy, phiT: phi });
                }}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Grade60">Grade 60 (fy = 400 MPa)</option>
                <option value="Grade75">Grade 75 (fy = 520 MPa)</option>
                <option value="Grade95">Grade 95 Threadbar (fy = 655 MPa)</option>
                <option value="Grade150">Grade 150 Threadbar (fy = 1035 MPa)</option>
              </select>
            </div>

            {/* Yield Strength fy */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.paramFy}
              </label>
              <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white shadow-2xs" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  min="200"
                  step="10"
                  value={inputs.fy}
                  onChange={(e) => onChange({ ...inputs, fy: parseFloat(e.target.value) || 400 })}
                  className="w-full px-3 py-2 text-sm font-mono text-slate-800 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-100 border-l border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 shrink-0 select-none flex items-center justify-center min-w-[42px]">
                  MPa
                </span>
              </div>
            </div>

            {/* phi_T resistance factor */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.paramPhiT}
              </label>
              <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white shadow-2xs" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  step="0.05"
                  min="0.5"
                  max="1.0"
                  value={inputs.phiT}
                  onChange={(e) => onChange({ ...inputs, phiT: parseFloat(e.target.value) || 0.75 })}
                  className="w-full px-3 py-2 text-sm font-mono text-slate-800 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-100 border-l border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 shrink-0 select-none flex items-center justify-center min-w-[42px]">
                  φ
                </span>
              </div>
            </div>
          </div>

          {/* Quick Rebar Size Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              {t.paramBarDiameter} ({isFa ? 'انتخاب سریع از سایزهای استاندارد میلگرد' : 'Standard Rebar Sizes'})
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {STANDARD_REBARS.map((bar) => {
                const isSelected = inputs.barDiameter === bar.diameter;
                const isSufficient = bar.areaCm2 >= results.AsRequired;
                return (
                  <button
                    key={bar.diameter}
                    type="button"
                    onClick={() => handleBarSelect(bar.diameter)}
                    className={`py-2 px-1 rounded-lg border text-center transition flex flex-col items-center ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300 shadow-sm'
                        : isSufficient
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-black">{bar.designationMetric}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                      {bar.areaCm2} cm²
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Output Card (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-700">
                {isFa ? 'نتیجه کنترل ظرفیت کششی میلگرد' : 'Tensile Check Results'}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  results.isPassed
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {results.isPassed ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                {results.isPassed ? 'OK (تأمین شد)' : 'NG (مردود)'}
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">{t.tendonFactoredDemand}:</span>
                <span className="font-mono font-bold text-slate-800">
                  γ · Tmax = {results.factoredLoad} kN
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">{t.tendonNominalRes}:</span>
                <span className="font-mono text-slate-800">
                  RT = {results.nominalResistance} kN
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">{t.tendonFactoredRes}:</span>
                <span className="font-mono font-bold text-emerald-700">
                  φT · RT = {results.factoredResistance} kN
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">{t.tendonAsReq}:</span>
                <span className="font-mono font-bold text-amber-700">
                  {results.AsRequired} cm²
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">{t.tendonAsProv}:</span>
                <span className="font-mono font-bold text-blue-700">
                  {results.AsProvided} cm² (φ{inputs.barDiameter} mm)
                </span>
              </div>

              <div className="flex justify-between py-1.5 pt-2">
                <span className="font-bold text-slate-700">{t.tendonCDR}:</span>
                <span
                  className={`font-mono font-black text-sm ${
                    results.capacityDemandRatio >= 1.0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {results.capacityDemandRatio} {results.capacityDemandRatio >= 1.0 ? '≥ 1.0' : '< 1.0'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded-lg bg-blue-50/70 border border-blue-200/70 text-[11px] text-blue-800 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              {isFa
                ? `رابطه آیین‌نامه: φT · RT ≥ γp-EV · Tmaxsn. مقاومت میلگرد بدون سهم دوغاب است. برای Tmax = ${inputs.Tmax} kN، استفاده از میلگرد φ${inputs.barDiameter} با As = ${results.AsProvided} cm² ${results.isPassed ? 'کفایت لازم را دارد.' : 'ناکافی است و باید سایز میلگرد بزرگتر انتخاب شود.'}`
                : `AASHTO Equation: φT · RT ≥ γp-EV · Tmaxsn. Rebar strength is calculated without grout contribution.`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
