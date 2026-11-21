/**
 * Pullout Resistance Section: Drillhole Diameter, Bond Length & qu (AASHTO 11.12.5.2)
 */
import React, { useState } from 'react';
import { PulloutInputs, PulloutResults, Language } from '../types/nailing';
import { PRESUMPTIVE_BOND_STRENGTHS } from '../constants/standardsData';
import { TRANSLATIONS } from '../utils/translations';
import { HelpCircle, Check, AlertTriangle, BookOpen, Info, X } from 'lucide-react';

interface Props {
  inputs: PulloutInputs;
  results: PulloutResults;
  Tmax: number;
  loadFactorEV: number;
  onChange: (inputs: PulloutInputs) => void;
  lang: Language;
  onOpenGuidance: () => void;
}

export const PulloutSection: React.FC<Props> = ({
  inputs,
  results,
  onChange,
  lang,
  onOpenGuidance,
}) => {
  const isFa = lang === 'fa';
  const t = TRANSLATIONS[lang];
  const [showBondTableModal, setShowBondTableModal] = useState(false);

  return (
    <div className="bg-slate-900/90 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center text-xs font-black">
              2
            </span>
            <span>{t.secPulloutTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{t.secPulloutDesc}</p>
        </div>

        <button
          type="button"
          onClick={onOpenGuidance}
          className="text-xs text-teal-300 hover:text-white flex items-center gap-1.5 font-medium bg-teal-500/15 hover:bg-teal-500/25 px-3 py-1.5 rounded-lg border border-teal-500/35 transition cursor-pointer"
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
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t.paramDrillholeDia}</label>
              <div className="flex rounded-xl border border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-teal-500/50 bg-slate-950" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  min="80"
                  max="300"
                  step="5"
                  value={inputs.drillholeDiameter}
                  onChange={(e) => onChange({ ...inputs, drillholeDiameter: parseFloat(e.target.value) || 120 })}
                  className="w-full px-3 py-2 text-sm font-mono text-slate-100 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-900 border-l border-slate-800 px-3 py-2 text-xs font-semibold text-slate-400 shrink-0 select-none flex items-center justify-center min-w-[46px]">
                  mm
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{t.paramDrillholeDiaHelp}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t.paramEffectiveBondLen}</label>
              <div className="flex rounded-xl border border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-teal-500/50 bg-slate-950" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  min="1"
                  max="30"
                  step="0.5"
                  value={inputs.effectiveBondLength}
                  onChange={(e) => onChange({ ...inputs, effectiveBondLength: parseFloat(e.target.value) || 7.0 })}
                  className="w-full px-3 py-2 text-sm font-mono text-slate-100 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-900 border-l border-slate-800 px-3 py-2 text-xs font-semibold text-slate-400 shrink-0 select-none flex items-center justify-center min-w-[46px]">
                  m
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{t.paramEffectiveBondLenHelp}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">{t.paramBondStrength}</label>
                <button
                  type="button"
                  onClick={() => setShowBondTableModal(true)}
                  className="text-[11px] text-teal-400 hover:text-teal-300 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>{isFa ? 'جدول AASHTO' : 'AASHTO Table'}</span>
                </button>
              </div>
              <div className="flex rounded-xl border border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-teal-500/50 bg-slate-950" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  min="20"
                  max="1000"
                  step="5"
                  value={inputs.bondStrength}
                  onChange={(e) => onChange({ ...inputs, bondStrength: parseFloat(e.target.value) || 150 })}
                  className="w-full px-3 py-2 text-sm font-mono text-slate-100 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-900 border-l border-slate-800 px-3 py-2 text-xs font-semibold text-slate-400 shrink-0 select-none flex items-center justify-center min-w-[46px]">
                  kPa
                </span>
              </div>
              {inputs.soilDescriptionKey && (
                <p className="text-[11px] text-teal-300 font-medium mt-1">
                  {isFa ? 'خاک انتخاب شده:' : 'Selected:'} {inputs.soilDescriptionKey}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t.paramPhiPO}</label>
              <div className="flex rounded-xl border border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-teal-500/50 bg-slate-950" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  value={inputs.phiPO}
                  onChange={(e) => onChange({ ...inputs, phiPO: parseFloat(e.target.value) || 0.65 })}
                  className="w-full px-3 py-2 text-sm font-mono text-slate-100 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-900 border-l border-slate-800 px-3 py-2 text-xs font-semibold text-slate-400 shrink-0 select-none flex items-center justify-center min-w-[42px]">
                  φ
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{t.paramPhiPOHelp}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {isFa ? 'انتخاب سریع مقاومت پیوستگی تجربی (AASHTO C11.12.5.2)' : 'Quick Presumptive Bond Strength'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { label: isFa ? 'ماسه و شن (150 kPa)' : 'Sand/Gravel (150 kPa)', qu: 150 },
                { label: isFa ? 'ماسه لای‌دار (125 kPa)' : 'Silty Sand (125 kPa)', qu: 125 },
                { label: isFa ? 'رس سخت (50 kPa)' : 'Stiff Clay (50 kPa)', qu: 50 },
                { label: isFa ? 'ماسه سنگ هوازده (250 kPa)' : 'Sandstone (250 kPa)', qu: 250 },
                { label: isFa ? 'مارن/سنگ آهک (350 kPa)' : 'Limestone (350 kPa)', qu: 350 },
                { label: isFa ? 'دولومیت درزه‌دار (600 kPa)' : 'Dolomite (600 kPa)', qu: 600 },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange({ ...inputs, bondStrength: item.qu, soilDescriptionKey: item.label })}
                  className={`px-2.5 py-2 rounded-xl border text-xs text-start transition cursor-pointer ${
                    inputs.bondStrength === item.qu
                      ? 'bg-teal-600 text-white border-teal-400 font-bold shadow-md'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                >
                  <div className="truncate">{item.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-5 bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200">
                {isFa ? 'نتیجه کنترل بیرون‌کشیدگی دوغاب-خاک' : 'Pullout Check Results'}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                  results.isPassed
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
                    : 'bg-rose-500/15 text-rose-300 border-rose-500/35'
                }`}
              >
                {results.isPassed ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                {results.isPassed ? (isFa ? 'OK (کفایت دارد)' : 'OK') : isFa ? 'NG (مردود)' : 'NG'}
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">{t.pulloutFactoredDemand}:</span>
                <span className="font-mono font-bold text-slate-100">γ · Tmax = {results.factoredLoad} kN</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">{t.pulloutNominalRes}:</span>
                <span className="font-mono text-slate-200">RPO = {results.nominalResistance} kN</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">{t.pulloutFactoredRes}:</span>
                <span className="font-mono font-bold text-teal-400">φPO · RPO = {results.factoredResistance} kN</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">{isFa ? 'محیط گمانه (π · DD):' : 'Circumference:'}</span>
                <span className="font-mono text-slate-300">
                  {(Math.PI * (inputs.drillholeDiameter / 1000)).toFixed(3)} m
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

          <div className="mt-4 p-3 rounded-xl bg-teal-950/40 border border-teal-800/40 text-[11px] text-teal-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <span>
              {isFa
                ? `فرمول آیین‌نامه: φPO · RPO ≥ γp-EV · Tmax. با قطر سوراخ DD=${inputs.drillholeDiameter}mm و طول پیوستگی Lp=${inputs.effectiveBondLength}m، ظرفیت پیوستگی ${results.factoredResistance} kN در برابر تقاضای ${results.factoredLoad} kN ${results.isPassed ? 'تأمین گردیده است.' : 'ناکافی است (باید Lp یا DD افزایش یابد).'}`
                : `AASHTO Equation: φPO · RPO ≥ γp-EV · Tmax. Pullout resistance is governed by bond length Lp and bond strength qu.`}
            </span>
          </div>
        </div>
      </div>

      {/* Modal for Presumptive Bond Strength Table */}
      {showBondTableModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[120] p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden text-slate-200">
            <div className="px-5 py-3.5 bg-slate-950 flex items-center justify-between border-b border-slate-800">
              <h3 className="font-bold text-sm flex items-center gap-2 text-slate-100">
                <BookOpen className="w-4 h-4 text-teal-400" />
                <span>{isFa ? 'جدول مقاومت پیوستگی خاک و سنگ (AASHTO Table C11.12.5.2)' : 'Presumptive Bond Strength Table'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowBondTableModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto text-xs space-y-3">
              <p className="text-slate-400">
                {isFa
                  ? 'بر اساس راهنمای AASHTO LRFD و FHWA NHI-14-007، روی هر ردیف کلیک کنید تا مقدار مقاومت پیوستگی اسمی (qu) در محاسبات اعمال گردد:'
                  : 'Select an entry to populate bond strength qu in the calculation engine:'}
              </p>

              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-start border-collapse">
                  <thead className="bg-slate-950 text-slate-300 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">{isFa ? 'نوع خاک / سنگ' : 'Soil / Rock Type'}</th>
                      <th className="p-2.5">{isFa ? 'روش حفاری' : 'Drilling Method'}</th>
                      <th className="p-2.5">{isFa ? 'محدوده (psi)' : 'Range (psi)'}</th>
                      <th className="p-2.5">{isFa ? 'محدوده (kPa)' : 'Range (kPa)'}</th>
                      <th className="p-2.5 text-center">{isFa ? 'انتخاب' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {PRESUMPTIVE_BOND_STRENGTHS.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-800/70 cursor-pointer transition"
                        onClick={() => {
                          onChange({
                            ...inputs,
                            bondStrength: item.recommendedKPa,
                            soilDescriptionKey: isFa ? item.soilDescriptionFa : item.soilDescriptionEn,
                          });
                          setShowBondTableModal(false);
                        }}
                      >
                        <td className="p-2.5 font-medium text-slate-100">
                          {isFa ? item.soilDescriptionFa : item.soilDescriptionEn}
                        </td>
                        <td className="p-2.5 text-slate-400">{item.drillingMethod}</td>
                        <td className="p-2.5 font-mono text-slate-400">
                          {item.quMinPsi} - {item.quMaxPsi}
                        </td>
                        <td className="p-2.5 font-mono text-teal-300 font-bold">
                          {item.quMinKPa} - {item.quMaxKPa} ({item.recommendedKPa})
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            type="button"
                            className="px-2.5 py-1 bg-teal-600 text-white rounded-md text-[11px] font-bold"
                          >
                            {isFa ? 'اعمال' : 'Use'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowBondTableModal(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
