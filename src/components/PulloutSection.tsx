/**
 * Pullout Resistance Section: Drillhole Diameter, Bond Length & qu (AASHTO 11.12.5.2)
 */
import React, { useState } from 'react';
import { PulloutInputs, PulloutResults, Language } from '../types/nailing';
import { PRESUMPTIVE_BOND_STRENGTHS } from '../constants/standardsData';
import { TRANSLATIONS } from '../utils/translations';
import { HelpCircle, Check, AlertTriangle, BookOpen, Layers, Info } from 'lucide-react';

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
  Tmax,
  loadFactorEV,
  onChange,
  lang,
  onOpenGuidance,
}) => {
  const isFa = lang === 'fa';
  const t = TRANSLATIONS[lang];
  const [showBondTableModal, setShowBondTableModal] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Section Header */}
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-black">
              2
            </span>
            <span>{t.secPulloutTitle}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{t.secPulloutDesc}</p>
        </div>

        <button
          onClick={onOpenGuidance}
          className="text-xs text-teal-600 hover:text-teal-800 flex items-center gap-1 font-medium bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{t.parameterGuidance}</span>
        </button>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Drillhole Diameter DD */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.paramDrillholeDia}
              </label>
              <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 bg-white shadow-2xs" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  min="80"
                  max="300"
                  step="5"
                  value={inputs.drillholeDiameter}
                  onChange={(e) =>
                    onChange({ ...inputs, drillholeDiameter: parseFloat(e.target.value) || 120 })
                  }
                  className="w-full px-3 py-2 text-sm font-mono text-slate-800 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-100 border-l border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 shrink-0 select-none flex items-center justify-center min-w-[42px]">
                  mm
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{t.paramDrillholeDiaHelp}</p>
            </div>

            {/* Effective Bond Length Lp */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.paramEffectiveBondLen}
              </label>
              <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 bg-white shadow-2xs" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  min="1"
                  max="30"
                  step="0.5"
                  value={inputs.effectiveBondLength}
                  onChange={(e) =>
                    onChange({ ...inputs, effectiveBondLength: parseFloat(e.target.value) || 7.0 })
                  }
                  className="w-full px-3 py-2 text-sm font-mono text-slate-800 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-100 border-l border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 shrink-0 select-none flex items-center justify-center min-w-[42px]">
                  m
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{t.paramEffectiveBondLenHelp}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bond Strength qu */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  {t.paramBondStrength}
                </label>
                <button
                  type="button"
                  onClick={() => setShowBondTableModal(true)}
                  className="text-[11px] text-teal-600 hover:underline flex items-center gap-0.5 font-medium"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>{isFa ? 'جدول AASHTO' : 'AASHTO Table'}</span>
                </button>
              </div>
              <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 bg-white shadow-2xs" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  min="20"
                  max="1000"
                  step="5"
                  value={inputs.bondStrength}
                  onChange={(e) =>
                    onChange({ ...inputs, bondStrength: parseFloat(e.target.value) || 150 })
                  }
                  className="w-full px-3 py-2 text-sm font-mono text-slate-800 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-100 border-l border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 shrink-0 select-none flex items-center justify-center min-w-[42px]">
                  kPa
                </span>
              </div>
              {inputs.soilDescriptionKey && (
                <p className="text-[11px] text-teal-700 font-medium mt-1">
                  {isFa ? 'خاک انتخاب شده:' : 'Selected:'} {inputs.soilDescriptionKey}
                </p>
              )}
            </div>

            {/* Resistance Factor phi_PO */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.paramPhiPO}
              </label>
              <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 bg-white shadow-2xs" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  value={inputs.phiPO}
                  onChange={(e) =>
                    onChange({ ...inputs, phiPO: parseFloat(e.target.value) || 0.65 })
                  }
                  className="w-full px-3 py-2 text-sm font-mono text-slate-800 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-100 border-l border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 shrink-0 select-none flex items-center justify-center min-w-[42px]">
                  φ
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{t.paramPhiPOHelp}</p>
            </div>
          </div>

          {/* Quick Common Presets for qu */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {isFa ? 'انتخاب سریع مقاومت پیوستگی تجربی (AASHTO C11.12.5.2)' : 'Quick Presumptive Bond Strength'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { label: isFa ? 'ماسه و شن (150 kPa)' : 'Sand/Gravel (150 kPa)', qu: 150, key: 'Sand/Gravel' },
                { label: isFa ? 'ماسه لای‌دار (125 kPa)' : 'Silty Sand (125 kPa)', qu: 125, key: 'Silty Sand' },
                { label: isFa ? 'رس سخت (50 kPa)' : 'Stiff Clay (50 kPa)', qu: 50, key: 'Stiff Clay' },
                { label: isFa ? 'ماسه سنگ هوازده (250 kPa)' : 'Sandstone (250 kPa)', qu: 250, key: 'Sandstone' },
                { label: isFa ? 'مارن/سنگ آهک (350 kPa)' : 'Limestone (350 kPa)', qu: 350, key: 'Limestone' },
                { label: isFa ? 'دولومیت درزه‌دار (600 kPa)' : 'Dolomite (600 kPa)', qu: 600, key: 'Dolomite' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange({ ...inputs, bondStrength: item.qu, soilDescriptionKey: item.label })}
                  className={`px-2 py-1.5 rounded-lg border text-xs text-left transition ${
                    inputs.bondStrength === item.qu
                      ? 'bg-teal-600 text-white border-teal-600 font-semibold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="truncate">{item.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Card (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-700">
                {isFa ? 'نتیجه کنترل بیرون‌کشیدگی دوغاب-خاک' : 'Pullout Check Results'}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  results.isPassed
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {results.isPassed ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                {results.isPassed ? 'OK (کفایت دارد)' : 'NG (مردود)'}
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">{t.pulloutFactoredDemand}:</span>
                <span className="font-mono font-bold text-slate-800">
                  γ · Tmax = {results.factoredLoad} kN
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">{t.pulloutNominalRes}:</span>
                <span className="font-mono text-slate-800">
                  RPO = {results.nominalResistance} kN
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">{t.pulloutFactoredRes}:</span>
                <span className="font-mono font-bold text-teal-700">
                  φPO · RPO = {results.factoredResistance} kN
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">{isFa ? 'محیط گمانه (π · DD):' : 'Circumference:'}</span>
                <span className="font-mono text-slate-700">
                  {(Math.PI * (inputs.drillholeDiameter / 1000)).toFixed(3)} m
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

          <div className="mt-4 p-2.5 rounded-lg bg-teal-50/70 border border-teal-200/70 text-[11px] text-teal-800 flex items-start gap-2">
            <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span>
              {isFa
                ? `فرمول آیین‌نامه: φPO · RPO ≥ γp-EV · Tmax. با قطر سوراخ DD=${inputs.drillholeDiameter}mm و طول پیوستگی Lp=${inputs.effectiveBondLength}m، ظرفیت پیوستگی دوغاب و زمین ${results.factoredResistance} kN در برابر تقاضای ${results.factoredLoad} kN ${results.isPassed ? 'تأمین گردیده است.' : 'ناکافی است (باید طول باند Lp یا قطر گمانه DD افزایش یابد).'}`
                : `AASHTO Equation: φPO · RPO ≥ γp-EV · Tmax. Pullout resistance is governed by bond length Lp and bond strength qu.`}
            </span>
          </div>
        </div>
      </div>

      {/* Modal for Presumptive Bond Strength Table from AASHTO C11.12.5.2 */}
      {showBondTableModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-400" />
                <span>{isFa ? 'جدول مقاومت پیوستگی خاک و سنگ (AASHTO Table C11.12.5.2)' : 'Presumptive Bond Strength Table'}</span>
              </h3>
              <button
                onClick={() => setShowBondTableModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-4 overflow-y-auto text-xs space-y-3">
              <p className="text-slate-500">
                {isFa
                  ? 'بر اساس راهنمای AASHTO LRFD و FHWA NHI-14-007، مقادیر زیر به عنوان مقاومت پیوستگی اسمی نهایی (qu) برای انواع خاک و روش‌های حفاری پیشنهاد شده‌اند. روی هر ردیف کلیک کنید تا در محاسبات اعمال گردد:'
                  : 'Select an entry to populate bond strength qu in the calculation engine:'}
              </p>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-right border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2">{isFa ? 'نوع خاک / سنگ' : 'Soil / Rock Type'}</th>
                      <th className="p-2">{isFa ? 'روش حفاری' : 'Drilling Method'}</th>
                      <th className="p-2">{isFa ? 'محدوده (psi)' : 'Range (psi)'}</th>
                      <th className="p-2">{isFa ? 'محدوده (kPa)' : 'Range (kPa)'}</th>
                      <th className="p-2 text-center">{isFa ? 'انتخاب' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {PRESUMPTIVE_BOND_STRENGTHS.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-teal-50/60 cursor-pointer transition"
                        onClick={() => {
                          onChange({
                            ...inputs,
                            bondStrength: item.recommendedKPa,
                            soilDescriptionKey: isFa ? item.soilDescriptionFa : item.soilDescriptionEn,
                          });
                          setShowBondTableModal(false);
                        }}
                      >
                        <td className="p-2 font-medium text-slate-800">
                          {isFa ? item.soilDescriptionFa : item.soilDescriptionEn}
                        </td>
                        <td className="p-2 text-slate-600">{item.drillingMethod}</td>
                        <td className="p-2 font-mono text-slate-600">
                          {item.quMinPsi} - {item.quMaxPsi}
                        </td>
                        <td className="p-2 font-mono text-slate-700 font-bold">
                          {item.quMinKPa} - {item.quMaxKPa} ({item.recommendedKPa})
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            className="px-2 py-0.5 bg-teal-600 text-white rounded text-[11px] font-medium"
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

            <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowBondTableModal(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 text-xs font-semibold"
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
