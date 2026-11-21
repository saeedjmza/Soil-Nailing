/**
 * Corrosion Protection Section:
 * Split into 2 dedicated modes:
 *   1. Temporary Nails (< 2 yrs): Exempt from corrosion protection checks & installed bare in grout (AASHTO 11.12.8 / FHWA GEC-7 §3.4)
 *   2. Permanent Nails (> 75 yrs): Soil Electrochemical Aggressiveness Check + Mandatory Class A or Class B Detailing
 */
import React from 'react';
import { CorrosionInputs, CorrosionAssessmentResults, Language, DuctMaterial } from '../types/nailing';
import { TRANSLATIONS } from '../utils/translations';
import { HelpCircle, Check, AlertTriangle, ShieldCheck, ShieldAlert, Info, Clock } from 'lucide-react';

interface Props {
  inputs: CorrosionInputs;
  results: CorrosionAssessmentResults;
  barDiameter: number;
  onChange: (inputs: CorrosionInputs) => void;
  onGoToSystemSpecs?: () => void;
  lang: Language;
  onOpenGuidance: () => void;
}

export const CorrosionSection: React.FC<Props> = ({
  inputs,
  results,
  barDiameter,
  onChange,
  onGoToSystemSpecs,
  lang,
  onOpenGuidance,
}) => {
  const isFa = lang === 'fa';
  const t = TRANSLATIONS[lang];
  const isTemporary = inputs.designLife === 'temporary';

  const handleECChange = (ec: number) => {
    const res = ec > 0 ? Math.round(1000 / ec) : 3000;
    onChange({
      ...inputs,
      soilTests: { ...inputs.soilTests, electricalConductivity: ec, resistivity: res },
    });
  };

  const handleResistivityChange = (rho: number) => {
    const ec = rho > 0 ? Number((1000 / rho).toFixed(2)) : 0.33;
    onChange({
      ...inputs,
      soilTests: { ...inputs.soilTests, resistivity: rho, electricalConductivity: ec },
    });
  };

  const handleSelectTemporary = () => {
    onChange({
      ...inputs,
      designLife: 'temporary',
      selectedClass: 'None',
    });
  };

  const handleSelectPermanent = () => {
    const fallbackClass = results.isAggressive ? 'ClassA' : 'ClassB';
    onChange({
      ...inputs,
      designLife: 'permanent',
      selectedClass: inputs.selectedClass === 'None' ? fallbackClass : inputs.selectedClass,
    });
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center text-xs font-black">
              5
            </span>
            <span>{t.secCorrosionTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{t.secCorrosionDesc}</p>
        </div>

        <button
          type="button"
          onClick={onOpenGuidance}
          className="text-xs text-emerald-300 hover:text-white flex items-center gap-1.5 font-medium bg-emerald-500/15 hover:bg-emerald-500/25 px-3 py-1.5 rounded-lg border border-emerald-500/35 transition cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{t.parameterGuidance}</span>
        </button>
      </div>

      {/* Mode Switcher: Temporary (Exempt) vs Permanent (Full Check) - synced with System Specs */}
      <div className="px-5 py-4 bg-slate-950/40 border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="text-xs font-bold text-slate-300">
            {isFa ? 'نوع عمر بهره‌برداری سیستم میخ‌کوبی (همگام با سربرگ مشخصات سیستم نیلینگ):' : 'Service Life Category (Synced with Nailing System Specs Tab):'}
          </div>
          {onGoToSystemSpecs && (
            <button
              type="button"
              onClick={onGoToSystemSpecs}
              className="text-[11px] font-semibold text-cyan-300 hover:text-cyan-200 underline cursor-pointer"
            >
              {isFa ? 'ویرایش در مشخصات سیستم نیلینگ' : 'Edit in Nailing System Tab'}
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Option 1: Temporary Nails */}
          <button
            type="button"
            onClick={handleSelectTemporary}
            className={`p-3.5 rounded-xl border text-start transition flex items-start gap-3 cursor-pointer ${
              isTemporary
                ? 'bg-amber-500/15 border-amber-400 text-white shadow-md ring-1 ring-amber-400/40'
                : 'bg-slate-950/70 hover:bg-slate-800/70 border-slate-800 text-slate-300'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                isTemporary ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Clock className="w-5 h-5" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-sm font-black">
                  {isFa ? '۱. نیل‌های موقت (Temporary Nails)' : '1. Temporary Nails (< 2 Years)'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {isFa ? 'معاف از حفاظت' : 'Exempt'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isFa
                  ? 'عمر بهره‌برداری کمتر از ۲ سال (گودبرداری موقت). مطابق آیین‌نامه از کنترل حفاظت خوردگی معاف بوده و میلگرد بدون غلاف و پوشش نصب می‌شود.'
                  : 'Service life under 18–24 months. Exempt from corrosion checks; bare rebar installed directly in cement grout.'}
              </p>
            </div>
          </button>

          {/* Option 2: Permanent Nails */}
          <button
            type="button"
            onClick={handleSelectPermanent}
            className={`p-3.5 rounded-xl border text-start transition flex items-start gap-3 cursor-pointer ${
              !isTemporary
                ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-md ring-1 ring-emerald-400/40'
                : 'bg-slate-950/70 hover:bg-slate-800/70 border-slate-800 text-slate-300'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                !isTemporary ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-sm font-black">
                  {isFa ? '۲. نیل‌های دائم (Permanent Nails)' : '2. Permanent Nails (> 75 Years)'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {isFa ? 'الزام Class A / B' : 'Class A / B Req.'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isFa
                  ? 'دیواره‌های دائم (> ۷۵ سال). کنترل کامل معیارهای ۵ گانه تهاجمی بودن خاک و الزام حفاظت کلاس A (غلاف موج‌دار) یا کلاس B (اپوکسی/گالوانیزه).'
                  : 'Permanent retaining walls (> 75 years). Full 5-parameter soil aggressiveness evaluation & mandatory Class A/B protection.'}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* SECTION BODY */}
      {isTemporary ? (
        /* TEMPORARY EXEMPT VIEW */
        <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="border border-amber-500/35 rounded-xl p-5 bg-amber-950/25 space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Info className="w-5 h-5 shrink-0" />
                <span>
                  {isFa
                    ? 'معافیت نیل‌های موقت از سیستم حفاظت خوردگی (AASHTO 11.12.8 & FHWA GEC-7 §3.4)'
                    : 'Temporary Nail Corrosion Exemption (AASHTO 11.12.8 & FHWA GEC-7 §3.4)'}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {isFa
                  ? 'بر اساس بخش ۳.۴ نشریه FHWA-NHI-14-007 و بند 11.12.8 آیین‌نامه AASHTO LRFD، دیواره‌ها و ترانشه‌های میخ‌کوبی شده موقت با عمر بهره‌برداری کمتر از ۱۸ تا ۲۴ ماه از کنترل معیارهای خوردگی خاک و نصب غلاف محصورکننده (Class A) یا پوشش اپوکسی (Class B) معاف هستند.'
                  : 'Per FHWA-NHI-14-007 Section 3.4 and AASHTO LRFD 11.12.8, temporary soil nail walls with a design service life under 18–24 months are exempt from soil corrosion protection detailing.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                  <div className="font-bold text-amber-300">
                    {isFa ? 'نحوه اجرای میلگرد موقت:' : 'Installation Specification:'}
                  </div>
                  <div className="text-slate-300">
                    {isFa
                      ? `میلگرد آجدار ساده (φ${barDiameter} mm) بدون غلاف و بدون پوشش اپوکسی مستقیماً درون دوغاب سیمانی گمانه نصب می‌شود.`
                      : `Bare steel tendon (φ${barDiameter} mm) without protective duct or epoxy coating is installed directly in cement grout.`}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                  <div className="font-bold text-emerald-300">
                    {isFa ? 'حداقل الزامات اجرایی:' : 'Minimum Construction Detailing:'}
                  </div>
                  <div className="text-slate-300">
                    {isFa
                      ? 'استفاده از اسپیسر (سنترالایزر) به فواصل حداکثر ۲.۵ تا ۳ متر جهت تأمین پوشش حداقل ۲۵ میلی‌متر دوغاب سیمانی توصیه می‌گردد.'
                      : 'Provide PVC centralizers at ≤ 2.5–3.0 m spacing to maintain a uniform ≥ 25 mm cement grout cover around the bar.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200">
                  {isFa ? 'وضعیت کنترل حفاظت خوردگی' : 'Corrosion Check Status'}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border bg-emerald-500/15 text-emerald-300 border-emerald-500/35">
                  <Check className="w-3 h-3" />
                  {isFa ? 'معاف — تأیید (Exempt OK)' : 'Compliant (Exempt)'}
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">{isFa ? 'نوع سازه:' : 'Structure Class:'}</span>
                  <span className="font-bold text-amber-300">{isFa ? 'موقت (کمتر از ۲ سال)' : 'Temporary (< 2 yrs)'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">{isFa ? 'سیستم انتخابی:' : 'Protection System:'}</span>
                  <span className="font-bold text-slate-100">{isFa ? 'بدون حفاظت (نصب مستقیم در دوغاب)' : 'None (Bare Bar in Grout)'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">{isFa ? 'الزام آزمون شیمیایی خاک:' : 'Chemical Test Req:'}</span>
                  <span className="font-bold text-emerald-400">{isFa ? 'معاف (Exempt)' : 'Exempt'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl border bg-emerald-950/35 border-emerald-700/40 text-emerald-200 text-[11px] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                {isFa
                  ? 'نیل‌های موقت نیازی به غلاف موج‌دار (Class A) یا پوشش اپوکسی (Class B) ندارند و کنترل خوردگی با وضعیت معاف (OK) در دفترچه محاسبات ثبت می‌شود.'
                  : 'Temporary nails require no duct or coating and pass corrosion verification as Exempt per AASHTO 11.12.8.'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* PERMANENT FULL EVALUATION VIEW */
        <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Inputs */}
          <div className="lg:col-span-7 space-y-5">
            {/* Chemical tests */}
            <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/60">
              <h3 className="text-xs font-bold text-slate-200 mb-3 flex flex-wrap items-center gap-1.5">
                <span>{t.soilElectroTitle}</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  ({isFa ? 'معیارهای ۵ گانه خاک غیرتهاجمی AASHTO' : 'AASHTO 5 Criteria'})
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">{t.paramSoilPH} (5–10)</label>
                  <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-900" dir="ltr">
                    <input
                      type="number"
                      dir="ltr"
                      step="0.1"
                      min="1"
                      max="14"
                      value={inputs.soilTests.pH}
                      onChange={(e) => onChange({ ...inputs, soilTests: { ...inputs.soilTests, pH: parseFloat(e.target.value) || 7.0 } })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono text-slate-100 text-left bg-transparent focus:outline-none"
                    />
                    <span className={`px-2 py-1 text-[10px] font-bold border-l border-slate-800 shrink-0 flex items-center justify-center min-w-[40px] ${results.isPHSafe ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                      {results.isPHSafe ? 'OK' : 'FAIL'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">{t.paramSoilResistivity} (≥3000)</label>
                  <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-900" dir="ltr">
                    <input
                      type="number"
                      dir="ltr"
                      step="50"
                      min="100"
                      max="50000"
                      value={inputs.soilTests.resistivity}
                      onChange={(e) => handleResistivityChange(parseFloat(e.target.value) || 3000)}
                      className="w-full px-2.5 py-1.5 text-xs font-mono text-slate-100 text-left bg-transparent focus:outline-none"
                    />
                    <span className={`px-2 py-1 text-[10px] font-bold border-l border-slate-800 shrink-0 flex items-center justify-center min-w-[42px] ${results.isResistivitySafe ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                      {results.isResistivitySafe ? 'OK' : 'FAIL'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">{t.paramSoilEC}</label>
                  <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-900" dir="ltr">
                    <input
                      type="number"
                      dir="ltr"
                      step="0.1"
                      min="0.05"
                      max="10"
                      value={inputs.soilTests.electricalConductivity}
                      onChange={(e) => handleECChange(parseFloat(e.target.value) || 0.33)}
                      className="w-full px-2.5 py-1.5 text-xs font-mono text-slate-100 text-left bg-transparent focus:outline-none"
                    />
                    <span className="bg-slate-950 border-l border-slate-800 px-2 py-1 text-[10px] text-slate-400 font-semibold select-none flex items-center justify-center min-w-[40px]">
                      dS/m
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">{t.paramSoilChlorides} (≤100 ppm)</label>
                  <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-900" dir="ltr">
                    <input
                      type="number"
                      dir="ltr"
                      step="5"
                      min="0"
                      max="5000"
                      value={inputs.soilTests.chlorides}
                      onChange={(e) => onChange({ ...inputs, soilTests: { ...inputs.soilTests, chlorides: parseFloat(e.target.value) || 0 } })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono text-slate-100 text-left bg-transparent focus:outline-none"
                    />
                    <span className={`px-2 py-1 text-[10px] font-bold border-l border-slate-800 shrink-0 flex items-center justify-center min-w-[40px] ${results.isChloridesSafe ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                      {results.isChloridesSafe ? 'OK' : 'FAIL'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">{t.paramSoilSulfates} (≤200 ppm)</label>
                  <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-900" dir="ltr">
                    <input
                      type="number"
                      dir="ltr"
                      step="5"
                      min="0"
                      max="10000"
                      value={inputs.soilTests.sulfates}
                      onChange={(e) => onChange({ ...inputs, soilTests: { ...inputs.soilTests, sulfates: parseFloat(e.target.value) || 0 } })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono text-slate-100 text-left bg-transparent focus:outline-none"
                    />
                    <span className={`px-2 py-1 text-[10px] font-bold border-l border-slate-800 shrink-0 flex items-center justify-center min-w-[40px] ${results.isSulfatesSafe ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                      {results.isSulfatesSafe ? 'OK' : 'FAIL'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">{t.paramSoilOrganics} (≤1.0%)</label>
                  <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-900" dir="ltr">
                    <input
                      type="number"
                      dir="ltr"
                      step="0.1"
                      min="0"
                      max="20"
                      value={inputs.soilTests.organicContent}
                      onChange={(e) => onChange({ ...inputs, soilTests: { ...inputs.soilTests, organicContent: parseFloat(e.target.value) || 0 } })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono text-slate-100 text-left bg-transparent focus:outline-none"
                    />
                    <span className={`px-2 py-1 text-[10px] font-bold border-l border-slate-800 shrink-0 flex items-center justify-center min-w-[40px] ${results.isOrganicsSafe ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                      {results.isOrganicsSafe ? 'OK' : 'FAIL'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Permanent Protection Class selection (Class A / Class B only) */}
            <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/60 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-200">
                  {isFa ? 'انتخاب کلاس حفاظت خوردگی (ویژه نیل‌های دائم)' : 'Select Permanent Protection Class'}
                </label>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onChange({ ...inputs, selectedClass: 'ClassA', designLife: 'permanent' })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      inputs.selectedClass === 'ClassA'
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    Class A (Encapsulation)
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ ...inputs, selectedClass: 'ClassB', designLife: 'permanent' })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      inputs.selectedClass === 'ClassB'
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    Class B (Coated Bars)
                  </button>
                </div>
              </div>

              {inputs.selectedClass === 'ClassA' ? (
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t.encapsulationDetailsTitle}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">{t.paramDuctMaterial}</label>
                      <select
                        value={inputs.ductMaterial}
                        onChange={(e) =>
                          onChange({
                            ...inputs,
                            ductMaterial: e.target.value as DuctMaterial,
                            ductWallThickness: e.target.value === 'PVC' ? 1.0 : 1.5,
                          })
                        }
                        className="w-full px-2.5 py-2 text-xs border border-slate-700 rounded-xl bg-slate-900 text-slate-100"
                      >
                        <option value="PVC">PVC موج‌دار (Corrugated PVC)</option>
                        <option value="HDPE">HDPE موج‌دار (Corrugated HDPE)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        {t.paramDuctThickness} (min {inputs.ductMaterial === 'PVC' ? '1.0' : '1.5'} mm)
                      </label>
                      <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-900" dir="ltr">
                        <input
                          type="number"
                          step="0.1"
                          min="0.8"
                          max="5.0"
                          value={inputs.ductWallThickness}
                          onChange={(e) => onChange({ ...inputs, ductWallThickness: parseFloat(e.target.value) || 1.0 })}
                          className="w-full px-2.5 py-1.5 text-xs font-mono text-slate-100 bg-transparent focus:outline-none"
                        />
                        <span className="bg-slate-950 border-l border-slate-800 px-2.5 py-1 text-[10px] text-slate-400 flex items-center">
                          mm
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        {t.paramDuctInsideDia} (min {barDiameter + 10} mm)
                      </label>
                      <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-900" dir="ltr">
                        <input
                          type="number"
                          step="1"
                          min="30"
                          max="120"
                          value={inputs.ductInsideDiameter}
                          onChange={(e) => onChange({ ...inputs, ductInsideDiameter: parseFloat(e.target.value) || 45 })}
                          className="w-full px-2.5 py-1.5 text-xs font-mono text-slate-100 bg-transparent focus:outline-none"
                        />
                        <span className="bg-slate-950 border-l border-slate-800 px-2.5 py-1 text-[10px] text-slate-400 flex items-center">
                          mm
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        {t.paramCentralizerSpacing} (≤ 3.0 m)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="1.0"
                        max="4.0"
                        value={inputs.internalCentralizerSpacing}
                        onChange={(e) =>
                          onChange({
                            ...inputs,
                            internalCentralizerSpacing: parseFloat(e.target.value) || 2.5,
                            externalCentralizerSpacing: parseFloat(e.target.value) || 2.5,
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-700 rounded-xl bg-slate-900 text-slate-100 font-mono"
                      />
                    </div>

                    <div className="flex items-center text-xs text-slate-300 pt-4">
                      <span>
                        {isFa ? 'پوشش دوغاب حلقوی داخل غلاف:' : 'Annular clearance:'}{' '}
                        <strong className="text-emerald-400 font-mono">
                          {((inputs.ductInsideDiameter - barDiameter) / 2).toFixed(1)} mm
                        </strong>{' '}
                        <span className="text-slate-400">({isFa ? 'حداقل ۵ میلیمتر' : 'min 5 mm'})</span>
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                    <span>{t.classBDesc}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        {isFa ? 'ضخامت پوشش اپوکسی (7 تا 12 mil)' : 'Epoxy Coating Thickness (7-12 mil)'}
                      </label>
                      <input
                        type="number"
                        step="1"
                        min="5"
                        max="20"
                        value={inputs.epoxyCoatingThickness || 10}
                        onChange={(e) => onChange({ ...inputs, epoxyCoatingThickness: parseFloat(e.target.value) || 10 })}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-700 rounded-xl bg-slate-900 text-slate-100 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        {isFa ? 'حداقل پوشش دوغاب اطراف نیل' : 'Minimum Grout Cover'} (≥ 25.4 mm)
                      </label>
                      <input
                        type="number"
                        step="1"
                        min="20"
                        max="60"
                        value={inputs.groutCoverClassB || 25.4}
                        onChange={(e) => onChange({ ...inputs, groutCoverClassB: parseFloat(e.target.value) || 25.4 })}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-700 rounded-xl bg-slate-900 text-slate-100 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Output */}
          <div className="lg:col-span-5 bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200">
                  {isFa ? 'ارزیابی وضعیت تهاجمی و حفاظت خاک' : 'Corrosion Evaluation'}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                    results.summaryStatus === 'Compliant'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
                      : 'bg-rose-500/15 text-rose-300 border-rose-500/35'
                  }`}
                >
                  {results.summaryStatus === 'Compliant' ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  {results.summaryStatus === 'Compliant' ? (isFa ? 'Compliant (منطبق)' : 'Compliant') : isFa ? 'Non-Compliant (نقص)' : 'Non-Compliant'}
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">{t.soilClassification}:</span>
                  <span className={`font-bold ${results.isAggressive ? 'text-amber-300' : 'text-emerald-300'}`}>
                    {results.isAggressive ? t.soilAggressive : t.soilNonAggressive}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">{t.corrosionReqClass}:</span>
                  <span className="font-bold text-slate-100">
                    {results.recommendedClass === 'ClassA' ? 'Class A (Encapsulation)' : 'Class B (Coated)'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">{isFa ? 'کلاس انتخاب شده:' : 'Selected Class:'}</span>
                  <span className="font-bold text-sky-300">
                    {inputs.selectedClass === 'ClassA' ? 'Class A' : inputs.selectedClass === 'ClassB' ? 'Class B' : 'None'}
                  </span>
                </div>

                {inputs.selectedClass === 'ClassA' && (
                  <>
                    <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">{isFa ? 'ضخامت دیواره غلاف:' : 'Duct Thickness:'}</span>
                      <span className={`font-mono font-bold ${results.isDuctThicknessAdequate ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {inputs.ductWallThickness} mm ({results.isDuctThicknessAdequate ? 'OK' : 'NG'})
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">{isFa ? 'قطر داخلی غلاف:' : 'Duct Inside Dia:'}</span>
                      <span className={`font-mono font-bold ${results.isDuctDiameterAdequate ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {inputs.ductInsideDiameter} mm ≥ {barDiameter + 10} mm ({results.isDuctDiameterAdequate ? 'OK' : 'NG'})
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">{isFa ? 'دوغاب حلقوی داخلی:' : 'Internal Clearance:'}</span>
                      <span className={`font-mono font-bold ${results.isInternalClearanceAdequate ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {((inputs.ductInsideDiameter - barDiameter) / 2).toFixed(1)} mm ≥ 5 mm ({results.isInternalClearanceAdequate ? 'OK' : 'NG'})
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div
              className={`mt-4 p-3 rounded-xl border text-[11px] flex items-start gap-2 ${
                results.isAggressive
                  ? 'bg-amber-950/40 border-amber-700/40 text-amber-200'
                  : 'bg-emerald-950/40 border-emerald-700/40 text-emerald-200'
              }`}
            >
              {results.isAggressive ? (
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <span>
                {isFa
                  ? results.isAggressive
                    ? `محیط خاک تهاجمی است. مطابق AASHTO 11.12.8 برای نیل‌های دائم استفاده از سیستم محصورسازی کامل (Class A) با غلاف موج‌دار ${inputs.ductMaterial} الزامی است.`
                    : `کلیه شرایط ۵ گانه محیط غیرتهاجمی تأمین گردیده و برای نیل‌های دائم استفاده از میلگردهای اپوکسی یا گالوانیزه (کلاس B) مجاز است.`
                  : results.isAggressive
                  ? 'Soil is Aggressive. AASHTO mandates Class A Encapsulation for permanent nails.'
                  : 'Soil is Non-Aggressive. Class B or Class A is permissible for permanent nails.'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
