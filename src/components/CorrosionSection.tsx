/**
 * Corrosion Protection Section: Soil Electrochemical Tests, Aggressiveness Assessment & Class A/B Detailing
 * (AASHTO LRFD Article 11.12.8 & FHWA NHI-14-007)
 */
import React from 'react';
import { CorrosionInputs, CorrosionAssessmentResults, Language, DuctMaterial, CorrosionClass } from '../types/nailing';
import { TRANSLATIONS } from '../utils/translations';
import { HelpCircle, Check, AlertTriangle, ShieldCheck, ShieldAlert, FileSpreadsheet, Info } from 'lucide-react';

interface Props {
  inputs: CorrosionInputs;
  results: CorrosionAssessmentResults;
  barDiameter: number;
  onChange: (inputs: CorrosionInputs) => void;
  lang: Language;
  onOpenGuidance: () => void;
}

export const CorrosionSection: React.FC<Props> = ({
  inputs,
  results,
  barDiameter,
  onChange,
  lang,
  onOpenGuidance,
}) => {
  const isFa = lang === 'fa';
  const t = TRANSLATIONS[lang];

  const handleECChange = (ec: number) => {
    // rho = 1000 / EC roughly in ohm-cm
    const res = ec > 0 ? Math.round(1000 / ec) : 3000;
    onChange({
      ...inputs,
      soilTests: {
        ...inputs.soilTests,
        electricalConductivity: ec,
        resistivity: res,
      },
    });
  };

  const handleResistivityChange = (rho: number) => {
    const ec = rho > 0 ? Number((1000 / rho).toFixed(2)) : 0.33;
    onChange({
      ...inputs,
      soilTests: {
        ...inputs.soilTests,
        resistivity: rho,
        electricalConductivity: ec,
      },
    });
  };

  // Preset borehole data from PDF page 20
  const handleLoadBoreholeSample = () => {
    onChange({
      ...inputs,
      soilTests: {
        pH: 8.0,
        electricalConductivity: 1.3,
        resistivity: 770, // 715 - 833 ohm-cm
        chlorides: 50,
        sulfates: 93,
        organicContent: 0.5,
      },
      selectedClass: 'ClassA',
      ductMaterial: 'PVC',
      ductWallThickness: 1.2,
      ductInsideDiameter: barDiameter + 12,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Section Header */}
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
              5
            </span>
            <span>{t.secCorrosionTitle}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{t.secCorrosionDesc}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadBoreholeSample}
            className="text-xs text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-300 font-medium flex items-center gap-1"
            title="Load BH3-Inlet Borehole Chemistry from PDF"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{isFa ? 'داده‌های گمانه BH3 گزارش' : 'Load BH3 Sample'}</span>
          </button>

          <button
            onClick={onOpenGuidance}
            className="text-xs text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-medium bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-300"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.parameterGuidance}</span>
          </button>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs: Chemical Tests & Duct Sizing (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Chemical tests card */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <span>{t.soilElectroTitle}</span>
              <span className="text-[11px] text-slate-500 font-normal">
                ({isFa ? 'معیارهای ۵ گانه خاک غیرتهاجمی AASHTO' : 'AASHTO 5 Criteria'})
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* pH */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {t.paramSoilPH} (5 ≤ pH ≤ 10)
                </label>
                <div className="flex rounded-lg border border-slate-300 overflow-hidden bg-white shadow-2xs" dir="ltr">
                  <input
                    type="number"
                    dir="ltr"
                    step="0.1"
                    min="1"
                    max="14"
                    value={inputs.soilTests.pH}
                    onChange={(e) =>
                      onChange({
                        ...inputs,
                        soilTests: { ...inputs.soilTests, pH: parseFloat(e.target.value) || 7.0 },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs font-mono text-slate-800 text-left bg-transparent focus:outline-none"
                  />
                  <span
                    className={`px-2 py-1 text-[10px] font-bold border-l border-slate-200 shrink-0 flex items-center justify-center min-w-[38px] ${
                      results.isPHSafe ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {results.isPHSafe ? 'OK' : 'FAIL'}
                  </span>
                </div>
              </div>

              {/* Resistivity rho */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {t.paramSoilResistivity} (≥ 3000 Ω·cm)
                </label>
                <div className="flex rounded-lg border border-slate-300 overflow-hidden bg-white shadow-2xs" dir="ltr">
                  <input
                    type="number"
                    dir="ltr"
                    step="50"
                    min="100"
                    max="50000"
                    value={inputs.soilTests.resistivity}
                    onChange={(e) => handleResistivityChange(parseFloat(e.target.value) || 3000)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono text-slate-800 text-left bg-transparent focus:outline-none"
                  />
                  <span
                    className={`px-2 py-1 text-[10px] font-bold border-l border-slate-200 shrink-0 flex items-center justify-center min-w-[42px] ${
                      results.isResistivitySafe ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {results.isResistivitySafe ? 'OK' : 'FAIL'}
                  </span>
                </div>
              </div>

              {/* EC (Conductivity) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {t.paramSoilEC}
                </label>
                <div className="flex rounded-lg border border-slate-300 overflow-hidden bg-white shadow-2xs" dir="ltr">
                  <input
                    type="number"
                    dir="ltr"
                    step="0.1"
                    min="0.05"
                    max="10"
                    value={inputs.soilTests.electricalConductivity}
                    onChange={(e) => handleECChange(parseFloat(e.target.value) || 0.33)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono text-slate-800 text-left bg-transparent focus:outline-none"
                  />
                  <span className="bg-slate-100 border-l border-slate-200 px-2 py-1 text-[10px] text-slate-500 font-semibold select-none flex items-center justify-center min-w-[40px]">
                    dS/m
                  </span>
                </div>
              </div>

              {/* Chlorides Cl */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {t.paramSoilChlorides} (≤ 100 ppm)
                </label>
                <div className="flex rounded-lg border border-slate-300 overflow-hidden bg-white shadow-2xs" dir="ltr">
                  <input
                    type="number"
                    dir="ltr"
                    step="5"
                    min="0"
                    max="5000"
                    value={inputs.soilTests.chlorides}
                    onChange={(e) =>
                      onChange({
                        ...inputs,
                        soilTests: { ...inputs.soilTests, chlorides: parseFloat(e.target.value) || 0 },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs font-mono text-slate-800 text-left bg-transparent focus:outline-none"
                  />
                  <span
                    className={`px-2 py-1 text-[10px] font-bold border-l border-slate-200 shrink-0 flex items-center justify-center min-w-[38px] ${
                      results.isChloridesSafe ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {results.isChloridesSafe ? 'OK' : 'FAIL'}
                  </span>
                </div>
              </div>

              {/* Sulfates SO4 */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {t.paramSoilSulfates} (≤ 200 ppm)
                </label>
                <div className="flex rounded-lg border border-slate-300 overflow-hidden bg-white shadow-2xs" dir="ltr">
                  <input
                    type="number"
                    dir="ltr"
                    step="5"
                    min="0"
                    max="10000"
                    value={inputs.soilTests.sulfates}
                    onChange={(e) =>
                      onChange({
                        ...inputs,
                        soilTests: { ...inputs.soilTests, sulfates: parseFloat(e.target.value) || 0 },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs font-mono text-slate-800 text-left bg-transparent focus:outline-none"
                  />
                  <span
                    className={`px-2 py-1 text-[10px] font-bold border-l border-slate-200 shrink-0 flex items-center justify-center min-w-[38px] ${
                      results.isSulfatesSafe ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {results.isSulfatesSafe ? 'OK' : 'FAIL'}
                  </span>
                </div>
              </div>

              {/* Organics */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {t.paramSoilOrganics} (≤ 1.0%)
                </label>
                <div className="flex rounded-lg border border-slate-300 overflow-hidden bg-white shadow-2xs" dir="ltr">
                  <input
                    type="number"
                    dir="ltr"
                    step="0.1"
                    min="0"
                    max="20"
                    value={inputs.soilTests.organicContent}
                    onChange={(e) =>
                      onChange({
                        ...inputs,
                        soilTests: { ...inputs.soilTests, organicContent: parseFloat(e.target.value) || 0 },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs font-mono text-slate-800 text-left bg-transparent focus:outline-none"
                  />
                  <span
                    className={`px-2 py-1 text-[10px] font-bold border-l border-slate-200 shrink-0 flex items-center justify-center min-w-[38px] ${
                      results.isOrganicsSafe ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {results.isOrganicsSafe ? 'OK' : 'FAIL'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Protection Class selection & detailing */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-800">
                {isFa ? 'انتخاب رده حفاظت خوردگی (Corrosion Protection Class)' : 'Select Protection Class'}
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ ...inputs, selectedClass: 'ClassA', designLife: 'permanent' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                    inputs.selectedClass === 'ClassA'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Class A (Encapsulation)
                </button>

                <button
                  type="button"
                  onClick={() => onChange({ ...inputs, selectedClass: 'ClassB', designLife: 'permanent' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                    inputs.selectedClass === 'ClassB'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Class B (Coated Bars)
                </button>

                <button
                  type="button"
                  onClick={() => onChange({ ...inputs, selectedClass: 'None', designLife: 'temporary' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                    inputs.selectedClass === 'None'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {isFa ? 'بدون حفاظت (موقت)' : 'None (Temporary)'}
                </button>
              </div>
            </div>

            {/* CLASS NONE (NO CORROSION PROTECTION FOR TEMPORARY NAILS) */}
            {inputs.selectedClass === 'None' ? (
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-600" />
                  <span>{isFa ? 'طرح نیل بدون غلاف محافظ (ویژه سازه‌های موقت)' : 'Bare Tendon without Corrosion Protection'}</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  {isFa ? (
                    <div>
                      <strong>ضوابط آیین‌نامه‌ای AASHTO و FHWA برای نیل‌های موقت:</strong>
                      <p className="mt-1">
                        در این حالت، میلگرد نیل به صورت بدون پوشش و بدون غلاف مستقیماً درون دوغاب سیمانی گمانه اجرا می‌گردد. این گزینه <strong>صرفاً برای سازه‌های نگهبان موقت</strong> (مدت بهره‌برداری کمتر از ۲ سال / ۱۸ تا ۲۴ ماه) مجاز است و برای دیوارهای دائمی مورد تأیید نمی‌باشد.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <strong>AASHTO & FHWA Criteria for Temporary Soil Nails (&lt; 2 Years):</strong>
                      <p className="mt-1">
                        Unprotected bare steel tendon installed directly in cement grout. Permissible strictly for temporary excavation support structures with service life under 18 to 24 months.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : inputs.selectedClass === 'ClassA' ? (
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{t.encapsulationDetailsTitle}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      {t.paramDuctMaterial}
                    </label>
                    <select
                      value={inputs.ductMaterial}
                      onChange={(e) =>
                        onChange({
                          ...inputs,
                          ductMaterial: e.target.value as DuctMaterial,
                          ductWallThickness: e.target.value === 'PVC' ? 1.0 : 1.5,
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white"
                    >
                      <option value="PVC">PVC موج‌دار (Corrugated PVC)</option>
                      <option value="HDPE">HDPE موج‌دار (Corrugated HDPE)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      {t.paramDuctThickness} (min {inputs.ductMaterial === 'PVC' ? '1.0' : '1.5'} mm)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0.8"
                        max="5.0"
                        value={inputs.ductWallThickness}
                        onChange={(e) =>
                          onChange({ ...inputs, ductWallThickness: parseFloat(e.target.value) || 1.0 })
                        }
                        className="w-full px-2.5 py-1.5 text-xs border rounded-lg font-mono"
                      />
                      <span className="absolute inset-y-0 right-2 flex items-center text-[10px] text-slate-400">
                        mm
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      {t.paramDuctInsideDia} (min {barDiameter + 10} mm)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="1"
                        min="30"
                        max="120"
                        value={inputs.ductInsideDiameter}
                        onChange={(e) =>
                          onChange({ ...inputs, ductInsideDiameter: parseFloat(e.target.value) || 45 })
                        }
                        className="w-full px-2.5 py-1.5 text-xs border rounded-lg font-mono"
                      />
                      <span className="absolute inset-y-0 right-2 flex items-center text-[10px] text-slate-400">
                        mm
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      {t.paramCentralizerSpacing} (≤ 3.0 m / 10 ft)
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
                      className="w-full px-2.5 py-1.5 text-xs border rounded-lg font-mono"
                    />
                  </div>

                  <div className="flex items-center text-xs text-slate-600 pt-5">
                    <span>
                      {isFa ? 'پوشش دوغاب حلقوی داخل غلاف:' : 'Annular clearance:'}{' '}
                      <strong className="text-emerald-700 font-mono">
                        {((inputs.ductInsideDiameter - barDiameter) / 2).toFixed(1)} mm
                      </strong>{' '}
                      (حداقل ۵ میلیمتر)
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* CLASS B DETAILS */
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>{t.classBDesc}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      {isFa ? 'ضخامت پوشش اپوکسی (7 تا 12 mil)' : 'Epoxy Coating Thickness (7-12 mil)'}
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="5"
                      max="20"
                      value={inputs.epoxyCoatingThickness || 10}
                      onChange={(e) =>
                        onChange({ ...inputs, epoxyCoatingThickness: parseFloat(e.target.value) || 10 })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      {isFa ? 'حداقل ضخامت پوشش دوغاب اطراف نیل' : 'Minimum Grout Cover'} (≥ 25.4 mm)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="20"
                      max="60"
                      value={inputs.groutCoverClassB || 25.4}
                      onChange={(e) =>
                        onChange({ ...inputs, groutCoverClassB: parseFloat(e.target.value) || 25.4 })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border rounded-lg font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Output Card: Assessment & Code Compliance (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-700">
                {isFa ? 'ارزیابی وضعیت تهاجمی و حفاظت خاک' : 'Corrosion Evaluation'}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  results.summaryStatus === 'Compliant'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {results.summaryStatus === 'Compliant' ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                {results.summaryStatus === 'Compliant' ? 'Compliant (منطبق)' : 'Non-Compliant (نقص)'}
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">{t.soilClassification}:</span>
                <span
                  className={`font-bold ${
                    results.isAggressive ? 'text-amber-700' : 'text-emerald-700'
                  }`}
                >
                  {results.isAggressive ? t.soilAggressive : t.soilNonAggressive}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">{t.corrosionReqClass}:</span>
                <span className="font-bold text-slate-800">
                  {results.recommendedClass === 'ClassA' ? 'Class A (Encapsulation)' : 'Class B (Coated)'}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">{isFa ? 'کلاس انتخاب شده در پروژه:' : 'Selected Class:'}</span>
                <span className="font-bold text-blue-700">
                  {inputs.selectedClass === 'ClassA' ? 'Class A (محصورسازی)' : 'Class B (پوشش‌دار)'}
                </span>
              </div>

              {inputs.selectedClass === 'ClassA' && (
                <>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">{isFa ? 'کنترل ضخامت دیواره غلاف:' : 'Duct Wall Thickness:'}</span>
                    <span
                      className={`font-mono font-bold ${
                        results.isDuctThicknessAdequate ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {inputs.ductWallThickness} mm ({results.isDuctThicknessAdequate ? 'OK' : 'NG'})
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">{isFa ? 'کنترل قطر داخلی غلاف:' : 'Duct Inside Diameter:'}</span>
                    <span
                      className={`font-mono font-bold ${
                        results.isDuctDiameterAdequate ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {inputs.ductInsideDiameter} mm ≥ {barDiameter + 10} mm ({results.isDuctDiameterAdequate ? 'OK' : 'NG'})
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">{isFa ? 'پوشش دوغاب داخلی داخل غلاف:' : 'Internal Grout Cover:'}</span>
                    <span
                      className={`font-mono font-bold ${
                        results.isInternalClearanceAdequate ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {((inputs.ductInsideDiameter - barDiameter) / 2).toFixed(1)} mm ≥ 5 mm ({results.isInternalClearanceAdequate ? 'OK' : 'NG'})
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div
            className={`mt-4 p-2.5 rounded-lg border text-[11px] flex items-start gap-2 ${
              results.isAggressive
                ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            }`}
          >
            {results.isAggressive ? (
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            )}
            <span>
              {isFa
                ? results.isAggressive
                  ? `به دلیل مقاومت ویژه کمتر از 3000 Ω·cm (هدایت الکتریکی بالا)، محیط تهاجمی است. مطابق AASHTO 11.12.8 استفاده از سیستم محصورسازی کامل (Class A) با غلاف موج‌دار ${inputs.ductMaterial} و سنترالایزرهای داخلی/خارجی الزامی است.`
                  : `کلیه شرایط ۵ گانه محیط غیرتهاجمی تأمین گردیده و استفاده از میلگردهای اپوکسی یا گالوانیزه (کلاس B) با حداقل پوشش دوغاب مجاز است.`
                : results.isAggressive
                ? 'Due to low soil resistivity (< 3000 ohm-cm), soil is Aggressive. AASHTO mandates Class A Encapsulation.'
                : 'Soil is Non-Aggressive. Class B or Class A is permissible.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
