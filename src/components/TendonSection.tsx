/**
 * Nail Tendon Section: Tendon Rebar Diameter & Tensile Resistance (AASHTO 11.12.6.1)
 */
import React from 'react';
import { TendonInputs, TendonResults, Language } from '../types/nailing';
import { STANDARD_REBARS } from '../constants/standardsData';
import { TRANSLATIONS } from '../utils/translations';
import { HelpCircle, Check, AlertTriangle, Info } from 'lucide-react';

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

  return (
    <div className="bg-slate-900/90 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-300 flex items-center justify-center text-xs font-black">
              1
            </span>
            <span>{t.secTendonTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{t.secTendonDesc}</p>
        </div>

        <button
          type="button"
          onClick={onOpenGuidance}
          className="text-xs text-sky-300 hover:text-white flex items-center gap-1.5 font-medium bg-sky-500/15 hover:bg-sky-500/25 px-3 py-1.5 rounded-lg border border-sky-500/35 transition cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{t.parameterGuidance}</span>
        </button>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t.paramTmax}</label>
              <div className="flex rounded-xl border border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-sky-500/50 focus-within:border-sky-500 bg-slate-950" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  min="1"
                  step="1"
                  value={inputs.Tmax}
                  onChange={(e) => onChange({ ...inputs, Tmax: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm font-mono text-slate-100 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-900 border-l border-slate-800 px-3 py-2 text-xs font-semibold text-slate-400 shrink-0 select-none flex items-center justify-center min-w-[46px]">
                  kN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{t.paramTmaxHelp}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t.paramGammaEV}</label>
              <div className="flex rounded-xl border border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-sky-500/50 focus-within:border-sky-500 bg-slate-950" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  step="0.05"
                  min="1.0"
                  max="1.5"
                  value={inputs.loadFactorEV}
                  onChange={(e) => onChange({ ...inputs, loadFactorEV: parseFloat(e.target.value) || 1.35 })}
                  className="w-full px-3 py-2 text-sm font-mono text-slate-100 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-900 border-l border-slate-800 px-3 py-2 text-xs font-semibold text-slate-400 shrink-0 select-none flex items-center justify-center min-w-[46px]">
                  γ
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{t.paramGammaEVHelp}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t.paramSteelGrade}</label>
              <select
                value={inputs.steelGrade}
                onChange={(e) => {
                  const grade = e.target.value as TendonInputs['steelGrade'];
                  let fy = 400;
                  let phi = 0.75;
                  if (grade === 'Grade60') { fy = 400; phi = 0.75; }
                  else if (grade === 'Grade75') { fy = 520; phi = 0.75; }
                  else if (grade === 'Grade95') { fy = 655; phi = 0.65; }
                  else if (grade === 'Grade150') { fy = 1035; phi = 0.65; }
                  onChange({ ...inputs, steelGrade: grade, fy, phiT: phi });
                }}
                className="w-full px-3 py-2 text-xs border border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500/50 bg-slate-950 text-slate-100"
              >
                <option value="Grade60">Grade 60 (fy = 400 MPa)</option>
                <option value="Grade75">Grade 75 (fy = 520 MPa)</option>
                <option value="Grade95">Grade 95 Threadbar (fy = 655 MPa)</option>
                <option value="Grade150">Grade 150 Threadbar (fy = 1035 MPa)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t.paramFy}</label>
              <div className="flex rounded-xl border border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-sky-500/50 bg-slate-950" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  min="200"
                  step="10"
                  value={inputs.fy}
                  onChange={(e) => onChange({ ...inputs, fy: parseFloat(e.target.value) || 400 })}
                  className="w-full px-3 py-2 text-sm font-mono text-slate-100 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-900 border-l border-slate-800 px-3 py-2 text-xs font-semibold text-slate-400 shrink-0 select-none flex items-center justify-center min-w-[46px]">
                  MPa
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t.paramPhiT}</label>
              <div className="flex rounded-xl border border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-sky-500/50 bg-slate-950" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  step="0.05"
                  min="0.5"
                  max="1.0"
                  value={inputs.phiT}
                  onChange={(e) => onChange({ ...inputs, phiT: parseFloat(e.target.value) || 0.75 })}
                  className="w-full px-3 py-2 text-sm font-mono text-slate-100 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-900 border-l border-slate-800 px-3 py-2 text-xs font-semibold text-slate-400 shrink-0 select-none flex items-center justify-center min-w-[42px]">
                  φ
                </span>
              </div>
            </div>
          </div>

          {/* Standard Rebar Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
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
                    onClick={() => onChange({ ...inputs, barDiameter: bar.diameter })}
                    className={`py-2 px-1 min-h-[48px] rounded-xl border text-center transition flex flex-col items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'bg-sky-600 text-white border-sky-400 ring-2 ring-sky-500/40 shadow-md'
                        : isSufficient
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/35 hover:bg-emerald-500/20'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-xs font-black font-mono">{bar.designationMetric}</span>
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-sky-100' : 'text-slate-500'}`}>
                      {bar.areaCm2} cm²
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Output Card */}
        <div className="lg:col-span-5 bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200">
                {isFa ? 'نتیجه کنترل ظرفیت کششی میلگرد' : 'Tensile Check Results'}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                  results.isPassed
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
                    : 'bg-rose-500/15 text-rose-300 border-rose-500/35'
                }`}
              >
                {results.isPassed ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                {results.isPassed ? (isFa ? 'OK (تأمین شد)' : 'OK') : isFa ? 'NG (مردود)' : 'NG'}
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">{t.tendonFactoredDemand}:</span>
                <span className="font-mono font-bold text-slate-100">γ · Tmax = {results.factoredLoad} kN</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">{t.tendonNominalRes}:</span>
                <span className="font-mono text-slate-200">RT = {results.nominalResistance} kN</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">{t.tendonFactoredRes}:</span>
                <span className="font-mono font-bold text-emerald-400">φT · RT = {results.factoredResistance} kN</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">{t.tendonAsReq}:</span>
                <span className="font-mono font-bold text-amber-300">{results.AsRequired} cm²</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">{t.tendonAsProv}:</span>
                <span className="font-mono font-bold text-sky-300">
                  {results.AsProvided} cm² (φ{inputs.barDiameter} mm)
                </span>
              </div>
              <div className="flex justify-between py-1.5 pt-2">
                <span className="font-bold text-slate-200">{t.tendonCDR}:</span>
                <span className={`font-mono font-black text-sm ${results.capacityDemandRatio >= 1.0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {results.capacityDemandRatio} {results.capacityDemandRatio >= 1.0 ? '≥ 1.0' : '< 1.0'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-sky-950/40 border border-sky-800/40 text-[11px] text-sky-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
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
