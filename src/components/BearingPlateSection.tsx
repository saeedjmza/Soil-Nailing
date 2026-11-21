/**
 * Bearing Plate Section: Nail Head Plate Dimensions, Cantilever Bending & Concrete Bearing Stress (FHWA NHI-14-007)
 */
import React from 'react';
import { BearingPlateInputs, BearingPlateResults, Language } from '../types/nailing';
import { TRANSLATIONS } from '../utils/translations';
import { HelpCircle, Check, AlertTriangle, Info } from 'lucide-react';

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
            <span className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center text-xs font-black">
              3
            </span>
            <span>{t.secPlateTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{t.secPlateDesc}</p>
        </div>

        <button
          type="button"
          onClick={onOpenGuidance}
          className="text-xs text-amber-300 hover:text-white flex items-center gap-1.5 font-medium bg-amber-500/15 hover:bg-amber-500/25 px-3 py-1.5 rounded-lg border border-amber-500/35 transition cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{t.parameterGuidance}</span>
        </button>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t.paramPlateWidth}</label>
              <div className="flex rounded-xl border border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500/50 bg-slate-950" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  min="10"
                  max="50"
                  step="1"
                  value={inputs.plateWidth}
                  onChange={(e) => onChange({ ...inputs, plateWidth: parseFloat(e.target.value) || 20 })}
                  className="w-full px-3 py-2 text-sm font-mono text-slate-100 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-900 border-l border-slate-800 px-3 py-2 text-xs font-semibold text-slate-400 shrink-0 select-none flex items-center justify-center min-w-[42px]">
                  cm
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {isFa ? `معادل ${(inputs.plateWidth * 10).toFixed(0)}×${(inputs.plateWidth * 10).toFixed(0)} mm` : `${(inputs.plateWidth * 10).toFixed(0)} mm square`}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t.paramPlateHoleDia}</label>
              <div className="flex rounded-xl border border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500/50 bg-slate-950" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  min="2"
                  max="10"
                  step="0.5"
                  value={inputs.holeDiameter}
                  onChange={(e) => onChange({ ...inputs, holeDiameter: parseFloat(e.target.value) || 4.5 })}
                  className="w-full px-3 py-2 text-sm font-mono text-slate-100 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-900 border-l border-slate-800 px-3 py-2 text-xs font-semibold text-slate-400 shrink-0 select-none flex items-center justify-center min-w-[42px]">
                  cm
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {isFa ? `سوراخ عبور (${(inputs.holeDiameter * 10).toFixed(0)} mm)` : 'Center hole'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t.paramPlateThickness}</label>
              <div className="flex rounded-xl border border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500/50 bg-slate-950" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  min="0.5"
                  max="6"
                  step="0.1"
                  value={inputs.plateThickness}
                  onChange={(e) => onChange({ ...inputs, plateThickness: parseFloat(e.target.value) || 2.0 })}
                  className="w-full px-3 py-2 text-sm font-mono text-slate-100 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-900 border-l border-slate-800 px-3 py-2 text-xs font-semibold text-slate-400 shrink-0 select-none flex items-center justify-center min-w-[42px]">
                  cm
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {isFa ? `معادل ${(inputs.plateThickness * 10).toFixed(0)} mm` : `${(inputs.plateThickness * 10).toFixed(0)} mm thick`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t.paramPlateFy}</label>
              <div className="flex rounded-xl border border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500/50 bg-slate-950" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  min="200"
                  max="600"
                  step="10"
                  value={inputs.fyPlate}
                  onChange={(e) => onChange({ ...inputs, fyPlate: parseFloat(e.target.value) || 400 })}
                  className="w-full px-3 py-2 text-sm font-mono text-slate-100 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-900 border-l border-slate-800 px-3 py-2 text-xs font-semibold text-slate-400 shrink-0 select-none flex items-center justify-center min-w-[46px]">
                  MPa
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {isFa ? 'فولاد ساختمانی St37 (240 MPa) یا St52 (360-400 MPa)' : 'Plate steel yield stress'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t.paramPlateFc}</label>
              <div className="flex rounded-xl border border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500/50 bg-slate-950" dir="ltr">
                <input
                  type="number"
                  dir="ltr"
                  min="15"
                  max="50"
                  step="5"
                  value={inputs.fcShotcrete}
                  onChange={(e) => onChange({ ...inputs, fcShotcrete: parseFloat(e.target.value) || 20 })}
                  className="w-full px-3 py-2 text-sm font-mono text-slate-100 text-left bg-transparent focus:outline-none"
                />
                <span className="bg-slate-900 border-l border-slate-800 px-3 py-2 text-xs font-semibold text-slate-400 shrink-0 select-none flex items-center justify-center min-w-[46px]">
                  MPa
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {isFa ? 'مقاومت فشاری ۲۸ روزه شاتکریت تکیه‌گاه' : 'Supporting shotcrete strength'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {isFa ? 'ابعاد متداول ورق سر نیل (پلیت استاندارد)' : 'Standard Plate Presets'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: '20×20×1.5 cm', w: 20, t: 1.5, hole: 4.5 },
                { label: isFa ? '20×20×2.0 cm (نمونه)' : '20×20×2.0 cm', w: 20, t: 2.0, hole: 4.5 },
                { label: '25×25×2.0 cm', w: 25, t: 2.0, hole: 5.0 },
                { label: '25×25×2.5 cm', w: 25, t: 2.5, hole: 5.0 },
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange({ ...inputs, plateWidth: p.w, plateThickness: p.t, holeDiameter: p.hole })}
                  className={`px-2.5 py-2 rounded-xl border text-xs text-center font-mono transition cursor-pointer ${
                    inputs.plateWidth === p.w && inputs.plateThickness === p.t
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                >
                  {p.label}
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
                {isFa ? 'نتایج کنترل تنش اتکایی و خمش پلیت' : 'Bearing Plate Check Results'}
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
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">{t.paramNailHeadLoad}:</span>
                <span className="font-mono font-bold text-slate-100">T0 = {results.T0} kN</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">{t.plateFpAllow}:</span>
                <span className="font-mono text-slate-200">
                  fp = {results.fpAllowable} MPa ({(results.fpAllowable * 10.197).toFixed(1)} kg/cm²)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">{t.plateAreaReq}:</span>
                <span className="font-mono font-bold text-amber-300">Areq = {results.requiredArea} cm²</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">{t.plateAreaProv}:</span>
                <span className="font-mono font-bold text-emerald-400">Anet = {results.netAreaProvided} cm²</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">{t.plateContactPress}:</span>
                <span className="font-mono text-slate-200">q = {results.contactPressure} kg/cm²</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">{t.plateCantileverLen}:</span>
                <span className="font-mono text-slate-200">l = {results.cantileverLength} cm</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">{t.plateThicknessReq}:</span>
                <span className="font-mono font-bold text-amber-300">
                  treq = {results.requiredThickness} cm ({results.actualThickness} cm)
                </span>
              </div>
              <div className="flex justify-between py-1.5 pt-2">
                <span className="font-bold text-slate-200">{isFa ? 'کنترل تنش خمشی (σ ≤ Fb):' : 'Bending Stress Check:'}</span>
                <span className={`font-mono font-black text-xs ${results.isFlexurePassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {results.bendingStress} ≤ {results.allowableBendingStress} kg/cm²
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-amber-950/40 border border-amber-800/40 text-[11px] text-amber-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              {isFa
                ? `پلیت فولادی به عنوان صفحه ستون تحت بار محوری سر نیل مدل می‌شود. کنترل سطح اتکا با fp = 0.7 f'c و خمش طره با Fb = 0.75 fy ${results.isPassed ? 'تأمین گردیده است.' : 'نیاز به افزایش ابعاد یا ضخامت پلیت دارد.'}`
                : `Bearing plate is designed as a column base plate resisting T0 against concrete bearing and cantilever bending.`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
