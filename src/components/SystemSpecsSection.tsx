/**
 * Top-Level Tab: Soil Nail System Specifications (Geometry, Temporary/Permanent Life, Soil & Preliminary Sizing)
 * Syncs Service Life (Temporary vs Permanent) to Facing and Corrosion Protection modules.
 */
import React, { useMemo } from 'react';
import { Language, SystemSpecsInputs } from '../types/nailing';
import { PRELIMINARY_SOIL_PRESETS } from '../constants/standardsData';
import { calculatePreliminaryNailingEstimate } from '../utils/calculations';
import { TRANSLATIONS } from '../utils/translations';
import {
  Compass,
  Clock,
  ShieldCheck,
  Grid,
  Ruler,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Info,
} from 'lucide-react';

interface Props {
  system: SystemSpecsInputs;
  Sh: number;
  Sv: number;
  designLife: 'temporary' | 'permanent';
  currentTmax: number;
  currentLp: number;
  onChangeSystem: (system: SystemSpecsInputs) => void;
  onChangeSpacing: (Sh: number, Sv: number) => void;
  onChangeDesignLife: (life: 'temporary' | 'permanent') => void;
  onApplyPreliminaryToDesign: (estimatedTmax: number, estimatedLp: number) => void;
  onGoToCalculations?: () => void;
  onOpenGuidance?: () => void;
  lang: Language;
}

export const SystemSpecsSection: React.FC<Props> = ({
  system,
  Sh,
  Sv,
  designLife,
  currentTmax,
  currentLp,
  onChangeSystem,
  onChangeSpacing,
  onChangeDesignLife,
  onApplyPreliminaryToDesign,
  onGoToCalculations,
  onOpenGuidance,
  lang,
}) => {
  const isFa = lang === 'fa';
  const t = TRANSLATIONS[lang];
  const isTemporary = designLife === 'temporary';

  const prelim = useMemo(
    () => calculatePreliminaryNailingEstimate(system, Sh, Sv),
    [system, Sh, Sv]
  );

  const updateField = (field: keyof SystemSpecsInputs, val: number) => {
    onChangeSystem({
      ...system,
      [field]: Number.isFinite(val) ? val : 0,
    });
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4" />
            </span>
            <span>
              {isFa
                ? 'مشخصات سیستم میخ‌کوبی (Nailing)، نوع کاربری و ژئوتکنیک اولیه'
                : 'Soil Nail System Specifications, Service Life & Preliminary Sizing'}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isFa
              ? 'انتخاب موقت یا دائم‌بودن سازه، ارتفاع ترانشه، شبکه نیل‌ها، طول کل و مشخصات اولیه خاک بر مبنای FHWA-NHI-14-007'
              : 'Configure temporary vs. permanent service life, excavation height, nail grid, length, and soil parameters per FHWA-NHI-14-007'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
              isTemporary
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/35'
                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
            }`}
          >
            {isTemporary
              ? isFa ? 'حالت: موقت (< ۲ سال)' : 'Mode: Temporary'
              : isFa ? 'حالت: دائم (> ۷۵ سال)' : 'Mode: Permanent'}
          </span>

          {onOpenGuidance && (
            <button
              type="button"
              onClick={onOpenGuidance}
              className="text-xs text-cyan-300 hover:text-white flex items-center gap-1.5 font-medium bg-cyan-500/15 hover:bg-cyan-500/25 px-3 py-1.5 rounded-lg border border-cyan-500/35 transition cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t.parameterGuidance}</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-5 space-y-6 text-xs">
        {/* 1. SERVICE LIFE MODE SELECTOR (TEMPORARY vs PERMANENT) */}
        <div className="p-4 rounded-2xl bg-slate-950/75 border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>
                {isFa
                  ? '۱. انتخاب نوع سیستم نیلینگ (دائم یا موقت) — اعمال خودکار در پوشش سطحی و حفاظت خوردگی:'
                  : '1. Select Soil Nail System Service Life (Applies automatically to Facings & Corrosion Protection):'}
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Temporary Option */}
            <button
              type="button"
              onClick={() => onChangeDesignLife('temporary')}
              className={`p-4 rounded-xl border text-start transition flex items-start gap-3 cursor-pointer ${
                isTemporary
                  ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg ring-1 ring-amber-400/40'
                  : 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800 text-slate-300'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isTemporary ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs sm:text-sm font-black">
                    {isFa ? 'سیستم نیلینگ موقت (Temporary < ۲ سال)' : 'Temporary System (< 2 Years)'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {isFa ? 'بدون نیاز به پوشش دائم و غلاف' : 'No Perm. Facing / Exempt'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {isFa
                    ? 'ویژه پایدارسازی موقت گودها. نیاز به رویه پوشش دائم (بتن نهایی و گل‌میخ‌ها) ندارد، تنها شاتکریت اولیه کنترل می‌شود و از حفاظت خوردگی معاف است.'
                    : 'For temporary excavation shoring. Permanent concrete facing & headed studs are NOT required, and corrosion encapsulation is exempt per AASHTO 11.12.8.'}
                </p>
              </div>
            </button>

            {/* Permanent Option */}
            <button
              type="button"
              onClick={() => onChangeDesignLife('permanent')}
              className={`p-4 rounded-xl border text-start transition flex items-start gap-3 cursor-pointer ${
                !isTemporary
                  ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-lg ring-1 ring-emerald-400/40'
                  : 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800 text-slate-300'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  !isTemporary ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs sm:text-sm font-black">
                    {isFa ? 'سیستم نیلینگ دائم (Permanent > ۷۵ سال)' : 'Permanent System (> 75 Years)'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    {isFa ? 'الزام رویه دائم + کلاس A/B' : 'Perm. Facing + Class A/B'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {isFa
                    ? 'ویژه دیواره‌های حائل دائمی. کنترل رویه پوشش دائم (بتن نهایی و گل‌میخ‌های سر نیل) و همچنین ارزیابی شیمیایی خاک با حفاظت کلاس A یا B الزامی است.'
                    : 'For permanent retaining walls. Requires permanent concrete facing + headed studs verification and soil aggressiveness + Class A/B corrosion protection.'}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* 2. GEOMETRY & GRID + SOIL PARAMETERS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Trench Geometry, Nail Grid & Soil */}
          <div className="lg:col-span-7 space-y-5">
            {/* Trench & Nail Geometry */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Ruler className="w-4 h-4 text-cyan-400" />
                  <span>{isFa ? '۲. هندسه ترانشه و ابعاد شبکه نیلینگ' : '2. Trench Geometry & Nail Grid Dimensions'}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono" dir="ltr">
                  S_H × S_V = {prelim.tributaryArea} m²
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {isFa ? 'ارتفاع ترانشه / دیواره (H)' : 'Wall / Trench Height (H)'}
                  </label>
                  <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-950 focus-within:ring-2 focus-within:ring-cyan-500/50" dir="ltr">
                    <input
                      type="number"
                      step="0.5"
                      min="2"
                      max="40"
                      value={system.wallHeight}
                      onChange={(e) => updateField('wallHeight', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono text-slate-100 bg-transparent focus:outline-none tabular-nums"
                    />
                    <span className="bg-slate-900 border-l border-slate-800 px-2.5 py-2 text-xs text-slate-400 font-bold">m</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {isFa ? 'فاصله افقی نیل‌ها (SH)' : 'Horiz. Spacing (SH)'}
                  </label>
                  <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-950 focus-within:ring-2 focus-within:ring-cyan-500/50" dir="ltr">
                    <input
                      type="number"
                      step="0.1"
                      min="0.8"
                      max="3.5"
                      value={Sh}
                      onChange={(e) => onChangeSpacing(parseFloat(e.target.value) || 2.0, Sv)}
                      className="w-full px-3 py-2 text-xs font-mono text-slate-100 bg-transparent focus:outline-none tabular-nums"
                    />
                    <span className="bg-slate-900 border-l border-slate-800 px-2.5 py-2 text-xs text-slate-400 font-bold">m</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {isFa ? 'فاصله قائم نیل‌ها (SV)' : 'Vert. Spacing (SV)'}
                  </label>
                  <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-950 focus-within:ring-2 focus-within:ring-cyan-500/50" dir="ltr">
                    <input
                      type="number"
                      step="0.1"
                      min="0.8"
                      max="3.5"
                      value={Sv}
                      onChange={(e) => onChangeSpacing(Sh, parseFloat(e.target.value) || 2.0)}
                      className="w-full px-3 py-2 text-xs font-mono text-slate-100 bg-transparent focus:outline-none tabular-nums"
                    />
                    <span className="bg-slate-900 border-l border-slate-800 px-2.5 py-2 text-xs text-slate-400 font-bold">m</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {isFa ? 'طول کل نیل (L)' : 'Total Nail Length (L)'}
                  </label>
                  <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-950 focus-within:ring-2 focus-within:ring-cyan-500/50" dir="ltr">
                    <input
                      type="number"
                      step="0.5"
                      min="2"
                      max="40"
                      value={system.nailLength}
                      onChange={(e) => updateField('nailLength', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono text-slate-100 bg-transparent focus:outline-none tabular-nums"
                    />
                    <span className="bg-slate-900 border-l border-slate-800 px-2.5 py-2 text-xs text-slate-400 font-bold">m</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {isFa ? 'زاویه نصب نیل (θ)' : 'Nail Inclination (θ)'}
                  </label>
                  <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-950 focus-within:ring-2 focus-within:ring-cyan-500/50" dir="ltr">
                    <input
                      type="number"
                      step="1"
                      min="5"
                      max="30"
                      value={system.nailInclinationDeg}
                      onChange={(e) => updateField('nailInclinationDeg', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono text-slate-100 bg-transparent focus:outline-none tabular-nums"
                    />
                    <span className="bg-slate-900 border-l border-slate-800 px-2.5 py-2 text-xs text-slate-400 font-bold">deg</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {isFa ? 'شیب دیواره گود (α)' : 'Face Batter (α)'}
                  </label>
                  <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-950 focus-within:ring-2 focus-within:ring-cyan-500/50" dir="ltr">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="25"
                      value={system.wallBatterDeg}
                      onChange={(e) => updateField('wallBatterDeg', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono text-slate-100 bg-transparent focus:outline-none tabular-nums"
                    />
                    <span className="bg-slate-900 border-l border-slate-800 px-2.5 py-2 text-xs text-slate-400 font-bold">deg</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {isFa ? 'شیب زمین پشت دیواره (β)' : 'Backslope Angle (β)'}
                  </label>
                  <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-950 focus-within:ring-2 focus-within:ring-cyan-500/50" dir="ltr">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="35"
                      value={system.backslopeDeg}
                      onChange={(e) => updateField('backslopeDeg', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono text-slate-100 bg-transparent focus:outline-none tabular-nums"
                    />
                    <span className="bg-slate-900 border-l border-slate-800 px-2.5 py-2 text-xs text-slate-400 font-bold">deg</span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-300 mb-1">
                    {isFa ? 'سربار سطحی بالای گود (qs)' : 'Surface Surcharge (qs)'}
                  </label>
                  <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-950 focus-within:ring-2 focus-within:ring-cyan-500/50" dir="ltr">
                    <input
                      type="number"
                      step="5"
                      min="0"
                      max="150"
                      value={system.surchargeKpa}
                      onChange={(e) => updateField('surchargeKpa', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono text-slate-100 bg-transparent focus:outline-none tabular-nums"
                    />
                    <span className="bg-slate-900 border-l border-slate-800 px-2.5 py-2 text-xs text-slate-400 font-bold">kPa</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preliminary Geotechnical Soil Parameters */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>{isFa ? '۳. مشخصات ژئوتکنیکی اولیه خاک' : '3. Preliminary Soil Shear Parameters'}</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  {isFa ? 'پیش‌تنظیم تیپ خاک:' : 'Typical Soil Presets:'}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {PRELIMINARY_SOIL_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() =>
                      onChangeSystem({
                        ...system,
                        soilUnitWeight: preset.gamma,
                        soilCohesion: preset.cohesion,
                        soilFrictionDeg: preset.friction,
                      })
                    }
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition cursor-pointer"
                  >
                    {isFa ? preset.labelFa : preset.labelEn}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {isFa ? 'وزن مخصوص خاک (γ)' : 'Unit Weight (γ)'}
                  </label>
                  <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-950 focus-within:ring-2 focus-within:ring-emerald-500/50" dir="ltr">
                    <input
                      type="number"
                      step="0.5"
                      min="14"
                      max="24"
                      value={system.soilUnitWeight}
                      onChange={(e) => updateField('soilUnitWeight', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono text-slate-100 bg-transparent focus:outline-none tabular-nums"
                    />
                    <span className="bg-slate-900 border-l border-slate-800 px-2.5 py-2 text-xs text-slate-400 font-bold">kN/m³</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {isFa ? 'چسبندگی خاک (c\')' : 'Cohesion (c\')'}
                  </label>
                  <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-950 focus-within:ring-2 focus-within:ring-emerald-500/50" dir="ltr">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="150"
                      value={system.soilCohesion}
                      onChange={(e) => updateField('soilCohesion', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono text-slate-100 bg-transparent focus:outline-none tabular-nums"
                    />
                    <span className="bg-slate-900 border-l border-slate-800 px-2.5 py-2 text-xs text-slate-400 font-bold">kPa</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {isFa ? 'زاویه اصطکاک داخلی (φ\')' : 'Friction Angle (φ\')'}
                  </label>
                  <div className="flex rounded-xl border border-slate-700 overflow-hidden bg-slate-950 focus-within:ring-2 focus-within:ring-emerald-500/50" dir="ltr">
                    <input
                      type="number"
                      step="1"
                      min="12"
                      max="50"
                      value={system.soilFrictionDeg}
                      onChange={(e) => updateField('soilFrictionDeg', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono text-slate-100 bg-transparent focus:outline-none tabular-nums"
                    />
                    <span className="bg-slate-900 border-l border-slate-800 px-2.5 py-2 text-xs text-slate-400 font-bold">deg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive FHWA-NHI-14-007 Preliminary Code Sizing Guide */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30 border border-cyan-500/35 space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>
                    {isFa ? 'راهنمای تخمین اولیه آیین‌نامه‌ای FHWA GEC-7' : 'FHWA GEC-7 Preliminary Sizing Guide'}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-200 border border-cyan-500/30">
                  Ka = {prelim.Ka}
                </span>
              </div>

              {/* Code Criteria Checks */}
              <div className="space-y-2">
                <div
                  className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 ${
                    prelim.isLengthCompliant
                      ? 'bg-emerald-950/35 border-emerald-500/35 text-emerald-200'
                      : 'bg-rose-950/35 border-rose-500/40 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {prelim.isLengthCompliant ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{isFa ? 'توصیه طول کل نیل (0.7H تا 1.0H):' : 'Recommended Nail Length (0.7H–1.0H):'}</span>
                  </div>
                  <span className="font-mono font-bold text-white" dir="ltr">
                    {prelim.recommendedLengthMin} – {prelim.recommendedLengthMax} m
                  </span>
                </div>

                <div
                  className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 ${
                    prelim.isSpacingCompliant
                      ? 'bg-emerald-950/35 border-emerald-500/35 text-emerald-200'
                      : 'bg-amber-950/35 border-amber-500/40 text-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Grid className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{isFa ? 'سطح بارگیر شبکه (SH × SV ≤ 4.0 m²):' : 'Tributary Grid Area (SH × SV ≤ 4.0 m²):'}</span>
                  </div>
                  <span className="font-mono font-bold text-white" dir="ltr">
                    {prelim.tributaryArea} m²
                  </span>
                </div>
              </div>

              {/* Preliminary Formulas & Estimates */}
              <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 space-y-2 text-[11px]">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">{isFa ? 'فشار فعال با اثر چسبندگی:' : 'Cohesion-Adjusted Active Pressure:'}</span>
                  <span className="font-mono font-bold text-slate-200" dir="ltr">{prelim.cohesionAdjustedPressureKpa} kPa</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">{isFa ? 'طول مؤثر چسبندگی برآوردی (Lp):' : 'Estimated Bond Length (Lp):'}</span>
                  <span className="font-mono font-bold text-cyan-300" dir="ltr">{prelim.estimatedBondLength} m</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">{isFa ? 'کشش تخمینی با چسبندگی (Tmax):' : 'Est. Tmax (with c\'):'}</span>
                  <span className="font-mono font-bold text-emerald-300" dir="ltr">{prelim.estimatedTmaxAdjusted} kN</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isFa ? 'حد بالای محافظه‌کارانه (c\'=0):' : 'Conservative Granular Bound:'}</span>
                  <span className="font-mono font-bold text-amber-300" dir="ltr">{prelim.estimatedTmaxUpper} kN</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[10.5px] text-slate-300 leading-relaxed flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  {isFa
                    ? `مقدار فعلی در محاسبات: Tmax = ${currentTmax} kN و Lp = ${currentLp} m. می‌توانید مقادیر برآوردی اولیه را با دکمه‌های زیر مستقیماً به محاسبات LRFD منتقل کنید.`
                    : `Current design values: Tmax = ${currentTmax} kN, Lp = ${currentLp} m. Apply preliminary estimates directly to LRFD calculations below.`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onApplyPreliminaryToDesign(prelim.estimatedTmaxAdjusted, prelim.estimatedBondLength)}
                  className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] transition cursor-pointer shadow-md"
                >
                  {isFa
                    ? `اعمال تخمین (${prelim.estimatedTmaxAdjusted} kN, ${prelim.estimatedBondLength}m)`
                    : `Apply Est. (${prelim.estimatedTmaxAdjusted} kN)`}
                </button>
                <button
                  type="button"
                  onClick={() => onApplyPreliminaryToDesign(prelim.estimatedTmaxUpper, prelim.estimatedBondLength)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/35 font-bold text-[11px] transition cursor-pointer"
                >
                  {isFa
                    ? `اعمال حد بالا (${prelim.estimatedTmaxUpper} kN)`
                    : `Apply Upper (${prelim.estimatedTmaxUpper} kN)`}
                </button>
              </div>
            </div>

            {onGoToCalculations && (
              <button
                type="button"
                onClick={onGoToCalculations}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition shadow-lg cursor-pointer"
              >
                <span>{isFa ? 'ادامه به سربرگ محاسبات طراحی LRFD' : 'Proceed to LRFD Design Calculations Tab'}</span>
                {isFa ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
