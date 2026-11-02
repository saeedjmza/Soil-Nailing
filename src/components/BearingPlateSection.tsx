/**
 * Bearing Plate Section: Nail Head Plate Dimensions, Cantilever Bending & Concrete Bearing Stress (FHWA NHI-14-007)
 */
import React from 'react';
import { BearingPlateInputs, BearingPlateResults, Language } from '../types/nailing';
import { TRANSLATIONS } from '../utils/translations';
import { HelpCircle, Check, AlertTriangle, Square, Info } from 'lucide-react';

interface Props {
  inputs: BearingPlateInputs;
  results: BearingPlateResults;
  T0: number;
  onChange: (inputs: BearingPlateInputs) => void;
  lang: Language;
  onOpenGuidance: () => void;
}

export const BearingPlateSection: React.FC<Props> = ({
  inputs,
  results,
  T0,
  onChange,
  lang,
  onOpenGuidance,
}) => {
  const isFa = lang === 'fa';
  const t = TRANSLATIONS[lang];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Section Header */}
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-black">
              3
            </span>
            <span>{t.secPlateTitle}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{t.secPlateDesc}</p>
        </div>

        <button
          onClick={onOpenGuidance}
          className="text-xs text-amber-600 hover:text-amber-800 flex items-center gap-1 font-medium bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{t.parameterGuidance}</span>
        </button>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Plate Width B */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.paramPlateWidth}
              </label>
              <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 bg-white shadow-2xs" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  min="10"
                  max="50"
                  step="1"
                  value={inputs.plateWidth}
                  onChange={(e) =>
                    onChange({ ...inputs, plateWidth: parseFloat(e.target.value) || 20 })
                  }
                  className="w-full px-3 py-2 text-sm font-mono text-slate-800 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-100 border-l border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 shrink-0 select-none flex items-center justify-center min-w-[42px]">
                  cm
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {isFa ? `معادل ${(inputs.plateWidth * 10).toFixed(0)}×${(inputs.plateWidth * 10).toFixed(0)} mm` : `${(inputs.plateWidth * 10).toFixed(0)} mm square`}
              </p>
            </div>

            {/* Hole Diameter D_hole */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.paramPlateHoleDia}
              </label>
              <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 bg-white shadow-2xs" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  min="2"
                  max="10"
                  step="0.5"
                  value={inputs.holeDiameter}
                  onChange={(e) =>
                    onChange({ ...inputs, holeDiameter: parseFloat(e.target.value) || 4.5 })
                  }
                  className="w-full px-3 py-2 text-sm font-mono text-slate-800 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-100 border-l border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 shrink-0 select-none flex items-center justify-center min-w-[42px]">
                  cm
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {isFa ? `سوراخ عبور میلگرد (${(inputs.holeDiameter * 10).toFixed(0)} mm)` : 'Center hole'}
              </p>
            </div>

            {/* Plate Thickness t */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.paramPlateThickness}
              </label>
              <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 bg-white shadow-2xs" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  min="0.5"
                  max="6"
                  step="0.1"
                  value={inputs.plateThickness}
                  onChange={(e) =>
                    onChange({ ...inputs, plateThickness: parseFloat(e.target.value) || 2.0 })
                  }
                  className="w-full px-3 py-2 text-sm font-mono text-slate-800 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-100 border-l border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 shrink-0 select-none flex items-center justify-center min-w-[42px]">
                  cm
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {isFa ? `معادل ${(inputs.plateThickness * 10).toFixed(0)} mm` : `${(inputs.plateThickness * 10).toFixed(0)} mm thick`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* fy of Plate */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.paramPlateFy}
              </label>
              <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 bg-white shadow-2xs" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  min="200"
                  max="600"
                  step="10"
                  value={inputs.fyPlate}
                  onChange={(e) =>
                    onChange({ ...inputs, fyPlate: parseFloat(e.target.value) || 400 })
                  }
                  className="w-full px-3 py-2 text-sm font-mono text-slate-800 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-100 border-l border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 shrink-0 select-none flex items-center justify-center min-w-[42px]">
                  MPa
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {isFa ? 'فولاد ساختمانی St37 (240 MPa) یا St52 (360-400 MPa)' : 'Plate steel yield stress'}
              </p>
            </div>

            {/* f'c of Shotcrete / Concrete */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.paramPlateFc}
              </label>
              <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 bg-white shadow-2xs" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  min="15"
                  max="50"
                  step="5"
                  value={inputs.fcShotcrete}
                  onChange={(e) =>
                    onChange({ ...inputs, fcShotcrete: parseFloat(e.target.value) || 20 })
                  }
                  className="w-full px-3 py-2 text-sm font-mono text-slate-800 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-100 border-l border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 shrink-0 select-none flex items-center justify-center min-w-[42px]">
                  MPa
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {isFa ? 'مقاومت فشاری ۲۸ روزه شاتکریت تکیه‌گاه' : 'Supporting shotcrete strength'}
              </p>
            </div>
          </div>

          {/* Quick preset plate sizes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {isFa ? 'ابعاد متداول ورق سر نیل (پلیت استاندارد)' : 'Standard Plate Presets'}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {[
                { label: '20×20×1.5 cm', w: 20, t: 1.5, hole: 4.5 },
                { label: '20×20×2.0 cm (نمونه)', w: 20, t: 2.0, hole: 4.5 },
                { label: '25×25×2.0 cm', w: 25, t: 2.0, hole: 5.0 },
                { label: '25×25×2.5 cm', w: 25, t: 2.5, hole: 5.0 },
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...inputs,
                      plateWidth: p.w,
                      plateThickness: p.t,
                      holeDiameter: p.hole,
                    })
                  }
                  className={`px-2 py-1.5 rounded-lg border text-xs text-center transition ${
                    inputs.plateWidth === p.w && inputs.plateThickness === p.t
                      ? 'bg-amber-600 text-white border-amber-600 font-semibold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {p.label}
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
                {isFa ? 'نتایج کنترل تنش اتکایی و خمش پلیت' : 'Bearing Plate Check Results'}
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
                <span className="text-slate-600">{t.paramNailHeadLoad}:</span>
                <span className="font-mono font-bold text-slate-800">
                  T0 = {results.T0} kN
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">{t.plateFpAllow}:</span>
                <span className="font-mono text-slate-800">
                  fp = {results.fpAllowable} MPa ({(results.fpAllowable * 10.197).toFixed(1)} kg/cm²)
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">{t.plateAreaReq}:</span>
                <span className="font-mono font-bold text-amber-700">
                  Areq = {results.requiredArea} cm²
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">{t.plateAreaProv}:</span>
                <span className="font-mono font-bold text-emerald-700">
                  Anet = {results.netAreaProvided} cm²
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">{t.plateContactPress}:</span>
                <span className="font-mono text-slate-800">
                  q = {results.contactPressure} kg/cm²
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">{t.plateCantileverLen}:</span>
                <span className="font-mono text-slate-800">
                  l = {results.cantileverLength} cm
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-600">{t.plateThicknessReq}:</span>
                <span className="font-mono font-bold text-amber-700">
                  treq = {results.requiredThickness} cm (موجود: {results.actualThickness} cm)
                </span>
              </div>

              <div className="flex justify-between py-1.5 pt-2">
                <span className="font-bold text-slate-700">{isFa ? 'کنترل تنش خمشی (σ ≤ Fb):' : 'Bending Stress Check:'}</span>
                <span
                  className={`font-mono font-black text-xs ${
                    results.isFlexurePassed ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {results.bendingStress} ≤ {results.allowableBendingStress} kg/cm²
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/70 text-[11px] text-amber-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              {isFa
                ? `پلیت فولادی به عنوان صفحه ستون تحت بار محوری سر نیل مدل می‌شود. کنترل سطح اتکا با fp = 0.7 f'c و کنترل خمش طره با Fb = 0.75 fy ${results.isPassed ? 'تأمین گردیده است.' : 'نیاز به افزایش ابعاد یا ضخامت پلیت دارد.'}`
                : `Bearing plate is designed as a column base plate resisting T0. Checked against allowable concrete bearing and steel flexural stress.`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
