/**
 * Executive Summary Dashboard Card showing Overall Design Health & Key Check Ratios
 */
import React from 'react';
import { FullCalculationResults, Language, DesignState } from '../types/nailing';
import { TRANSLATIONS } from '../utils/translations';
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Check,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';

export type DashboardTargetSection =
  | { tab: 'project' }
  | { tab: 'system' }
  | { tab: 'calc'; module: 'tendon' | 'pullout' | 'plate' | 'facing' | 'corrosion'; facingSubTab?: 'temp' | 'perm' | 'studs' };

interface Props {
  state: DesignState;
  results: FullCalculationResults;
  lang: Language;
  onNavigate?: (target: DashboardTargetSection) => void;
}

export const DesignSummaryCard: React.FC<Props> = ({ state, results, lang, onNavigate }) => {
  const isFa = lang === 'fa';
  const t = TRANSLATIONS[lang];

  const isTemporary = results.corrosion.isExemptTemporary;

  const checks: {
    title: string;
    code: string;
    cdr: number;
    isPassed: boolean;
    isOptionalTemp?: boolean;
    detail: string;
    target: DashboardTargetSection;
  }[] = [
    {
      title: isFa ? 'کشش میلگرد نیل' : 'Tendon Tension',
      code: 'AASHTO 11.12.6.1',
      cdr: results.tendon.capacityDemandRatio,
      isPassed: results.tendon.isPassed,
      detail: `db = φ${state.tendon.barDiameter} mm (As = ${results.tendon.AsProvided} cm²)`,
      target: { tab: 'calc', module: 'tendon' },
    },
    {
      title: isFa ? 'بیرون‌کشیدگی نیل (پیوستگی)' : 'Pullout Resistance',
      code: 'AASHTO 11.12.5.2',
      cdr: results.pullout.capacityDemandRatio,
      isPassed: results.pullout.isPassed,
      detail: `DD = ${state.pullout.drillholeDiameter} mm, Lp = ${state.pullout.effectiveBondLength} m`,
      target: { tab: 'calc', module: 'pullout' },
    },
    {
      title: isFa ? 'پلیت سر نیل (خمش و اتکا)' : 'Bearing Plate',
      code: 'FHWA NHI-14-007',
      cdr: Number((results.plate.allowableBendingStress / Math.max(results.plate.bendingStress, 1)).toFixed(2)),
      isPassed: results.plate.isPassed,
      detail: `${state.plate.plateWidth}×${state.plate.plateWidth} cm, t = ${state.plate.plateThickness} cm`,
      target: { tab: 'calc', module: 'plate' },
    },
    {
      title: isFa ? 'خمش شاتکریت موقت' : 'Temp Facing Flexure',
      code: 'AASHTO 11.12.6.2.2',
      cdr: results.tempFlexure.CDR,
      isPassed: results.tempFlexure.isPassed,
      detail: `h = ${state.facing.tempThickness} mm, CF = ${state.facing.tempCF}`,
      target: { tab: 'calc', module: 'facing', facingSubTab: 'temp' },
    },
    {
      title: isFa ? 'برش پانچ شاتکریت موقت' : 'Temp Facing Punching',
      code: 'AASHTO 11.12.6.2.2',
      cdr: results.tempPunching.CDR,
      isPassed: results.tempPunching.isPassed,
      detail: `Dc' = ${(results.tempPunching.DcPrime * 100).toFixed(1)} cm`,
      target: { tab: 'calc', module: 'facing', facingSubTab: 'temp' },
    },
    {
      title: isFa ? 'خمش بتن دائم' : 'Perm Facing Flexure',
      code: 'AASHTO 11.12.6.2.2',
      cdr: results.permFlexure.CDR,
      isPassed: isTemporary ? true : results.permFlexure.isPassed,
      isOptionalTemp: isTemporary,
      detail: isTemporary
        ? isFa ? 'سیستم موقت — بدون رویه دائم' : 'Omitted (Temporary System)'
        : `h = ${state.facing.permThickness} mm, CF = 1.0`,
      target: isTemporary ? { tab: 'system' } : { tab: 'calc', module: 'facing', facingSubTab: 'perm' },
    },
    {
      title: isFa ? 'برش پانچ بتن دائم' : 'Perm Facing Punching',
      code: 'AASHTO 11.12.6.2.2',
      cdr: results.permPunching.CDR,
      isPassed: isTemporary ? true : results.permPunching.isPassed,
      isOptionalTemp: isTemporary,
      detail: isTemporary
        ? isFa ? 'سیستم موقت — بدون رویه دائم' : 'Omitted (Temporary System)'
        : `Dc' = ${(results.permPunching.DcPrime * 100).toFixed(1)} cm`,
      target: isTemporary ? { tab: 'system' } : { tab: 'calc', module: 'facing', facingSubTab: 'perm' },
    },
    {
      title: isFa ? 'کشش گل‌میخ‌های سر نیل' : 'Headed Studs Tension',
      code: 'AASHTO 11.12.6.2.3',
      cdr: results.headedStuds.CDR,
      isPassed: isTemporary ? true : results.headedStuds.isPassed,
      isOptionalTemp: isTemporary,
      detail: isTemporary
        ? isFa ? 'سیستم موقت — غیرالزامی' : 'Not Required (Temp)'
        : `${state.facing.headedStudsCount}x φ${state.facing.headedStudDiameter} mm`,
      target: isTemporary ? { tab: 'system' } : { tab: 'calc', module: 'facing', facingSubTab: 'studs' },
    },
  ];

  const jump = (target: DashboardTargetSection) => {
    onNavigate?.(target);
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
      {/* Top Banner */}
      <div
        className={`px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-white border-b border-slate-800 ${
          results.isOverallPassed
            ? 'bg-gradient-to-r from-emerald-950/90 via-teal-950/70 to-slate-900'
            : 'bg-gradient-to-r from-rose-950/90 via-red-950/70 to-slate-900'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {results.isOverallPassed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <div>
            <div className="font-bold text-sm text-slate-100 leading-tight">
              {results.isOverallPassed ? t.statusPassed : t.statusFailed}
            </div>
            <div className="text-[11px] text-slate-300 opacity-90">
              {isFa
                ? 'محاسبات بر اساس روش ضریب بار و مقاومت (LRFD) نشریه AASHTO 2020 و FHWA GEC-7'
                : 'AASHTO LRFD (9th Ed, 2020) & FHWA GEC-7 Design Compliance'}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => jump({ tab: 'system' })}
            title={isFa ? 'رفتن به بخش مشخصات سیستم نیلینگ' : 'Go to Nailing System Specs'}
            className="bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 px-3 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer group"
          >
            <span className="text-slate-400">{isFa ? 'نوع سیستم:' : 'System:'}</span>
            <span className={`font-bold underline decoration-dotted underline-offset-4 ${isTemporary ? 'text-amber-300' : 'text-cyan-300'}`}>
              {isTemporary ? (isFa ? 'موقت (< ۲ سال)' : 'Temporary') : (isFa ? 'دائم (> ۷۵ سال)' : 'Permanent')}
            </span>
            <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-300 transition" />
          </button>

          <button
            type="button"
            onClick={() => jump({ tab: 'calc', module: 'plate' })}
            title={isFa ? 'رفتن به بخش صفحه سر نیل و T0' : 'Go to Bearing Plate & T0'}
            className="bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 px-3 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer group"
          >
            <span className="text-slate-400">{isFa ? 'نیروی سر نیل (T0):' : 'Nail Head Load (T0):'}</span>
            <span className="font-mono font-bold text-amber-300 tabular-nums underline decoration-dotted underline-offset-4" dir="ltr">
              {results.T0} kN
            </span>
            <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-amber-300 transition" />
          </button>

          <button
            type="button"
            onClick={() => jump({ tab: 'calc', module: 'corrosion' })}
            title={isFa ? 'رفتن به بخش حفاظت خوردگی' : 'Go to Corrosion Protection'}
            className="bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 px-3 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer group"
          >
            <span className="text-slate-400">{isFa ? 'کلاس حفاظت:' : 'Corrosion Class:'}</span>
            <span className="font-bold text-emerald-300 underline decoration-dotted underline-offset-4">
              {results.corrosion.isExemptTemporary
                ? isFa ? 'موقت (معاف از حفاظت)' : 'Temporary (Exempt)'
                : state.corrosion.selectedClass === 'ClassA'
                ? isFa ? 'کلاس A (محصورسازی)' : 'Class A (Encapsulation)'
                : state.corrosion.selectedClass === 'ClassB'
                ? isFa ? 'کلاس B (پوشش‌دار)' : 'Class B (Coated)'
                : isFa ? 'بدون حفاظت' : 'None'}
            </span>
            <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-300 transition" />
          </button>
        </div>
      </div>

      {/* Grid of Hyperlinked Checks */}
      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 bg-slate-950/50">
        {checks.map((c, i) => (
          <button
            key={i}
            type="button"
            onClick={() => jump(c.target)}
            title={isFa ? `مشاهده و بررسی بخش «${c.title}»` : `Inspect ${c.title}`}
            className={`p-3 rounded-xl border text-start transition-all cursor-pointer group hover:-translate-y-0.5 hover:shadow-md ${
              c.isOptionalTemp
                ? 'bg-slate-900/50 border-slate-800/80 hover:border-amber-500/45 opacity-85 hover:opacity-100'
                : c.isPassed
                ? 'bg-slate-900/90 border-slate-800 hover:border-sky-400/60 hover:bg-slate-900'
                : 'bg-rose-950/30 border-rose-500/40 hover:border-rose-400'
            }`}
          >
            <div className="flex items-start justify-between gap-1.5 mb-1.5 w-full">
              <span className="font-bold text-xs text-slate-100 group-hover:text-sky-300 transition line-clamp-1 flex items-center gap-1">
                <span>{c.title}</span>
                <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-sky-400 shrink-0 transition" />
              </span>
              {c.isOptionalTemp ? (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0">
                  {isFa ? 'غیرالزامی (موقت)' : 'N/A (Temp)'}
                </span>
              ) : (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0 ${
                    c.isPassed
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {c.isPassed ? <Check className="w-2.5 h-2.5" /> : <AlertTriangle className="w-2.5 h-2.5" />}
                  {c.isPassed ? 'OK' : 'NG'}
                </span>
              )}
            </div>

            <div className="text-[11px] text-slate-400 mb-2 font-mono truncate w-full" dir={c.isOptionalTemp && isFa ? 'rtl' : 'ltr'}>
              {c.detail}
            </div>

            <div className="flex items-baseline justify-between border-t border-slate-800 pt-1.5 w-full">
              <span className="text-[10px] text-slate-500 group-hover:text-sky-400/90 font-mono transition" dir="ltr">
                {c.code}
              </span>
              <div className="text-right tabular-nums" dir="ltr">
                {c.isOptionalTemp ? (
                  <span className="text-[10px] text-amber-300/90 font-semibold">
                    {isFa ? 'معاف (موقت)' : 'Exempt'}
                  </span>
                ) : (
                  <>
                    <span className="text-[10px] text-slate-400 font-medium">CDR = </span>
                    <span className={`text-xs font-mono font-bold ${c.cdr >= 1.0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {c.cdr}
                    </span>
                  </>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Soil Chemistry / Geometry Hyperlinked Strip */}
      <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-300">
        <button
          type="button"
          onClick={() => jump({ tab: 'calc', module: 'corrosion' })}
          title={isFa ? 'بررسی شرایط حفاظت خوردگی و آزمایش خاک' : 'Inspect Corrosion Protection'}
          className="flex items-center gap-2 hover:text-white transition cursor-pointer group text-start"
        >
          {results.corrosion.isExemptTemporary ? (
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : results.corrosion.isAggressive ? (
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span className="text-[11px] underline decoration-dotted decoration-slate-600 group-hover:decoration-sky-400 underline-offset-4">
            {results.corrosion.isExemptTemporary
              ? isFa
                ? 'نیل‌های موقت (< ۲ سال): معاف از کنترل حفاظت خوردگی مطابق AASHTO 11.12.8 ← نصب مستقیم در دوغاب'
                : 'Temporary Nails (< 2 yrs): Exempt from Corrosion Protection per AASHTO 11.12.8 (Bare Bar in Grout)'
              : results.corrosion.isAggressive
              ? isFa
                ? 'محیط خاک: تهاجمی (خوردگی بالا) ← محصورسازی کلاس A الزامی'
                : 'Aggressive Soil Environment -> Class A Encapsulation Required'
              : isFa
              ? 'محیط خاک: غیرتهاجمی ← امکان استفاده از کلاس B یا A'
              : 'Non-Aggressive Soil Environment -> Class B or A Permitted'}
          </span>
          <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-sky-300 shrink-0" />
        </button>

        <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-slate-400 font-mono tabular-nums flex-wrap" dir="ltr">
          {state.system && (
            <button
              type="button"
              onClick={() => jump({ tab: 'system' })}
              title={isFa ? 'ویرایش هندسه در مشخصات سیستم نیلینگ' : 'Edit geometry in Nailing System'}
              className="flex items-center gap-2.5 hover:text-cyan-200 transition cursor-pointer px-1.5 py-0.5 rounded hover:bg-slate-800"
            >
              <span>H: <strong className="text-cyan-300 underline decoration-dotted">{state.system.wallHeight} m</strong></span>
              <span>L: <strong className="text-cyan-300 underline decoration-dotted">{state.system.nailLength} m</strong></span>
            </button>
          )}
          {!results.corrosion.isExemptTemporary && (
            <button
              type="button"
              onClick={() => jump({ tab: 'calc', module: 'corrosion' })}
              title={isFa ? 'ویرایش آزمایش خاک در بخش حفاظت خوردگی' : 'Edit soil tests in Corrosion'}
              className="flex items-center gap-2.5 hover:text-white transition cursor-pointer px-1.5 py-0.5 rounded hover:bg-slate-800"
            >
              <span>pH: <strong className="text-slate-200 underline decoration-dotted">{state.corrosion.soilTests.pH}</strong></span>
              <span>ρ: <strong className="text-slate-200 underline decoration-dotted">{state.corrosion.soilTests.resistivity} Ω·cm</strong></span>
              <span>Cl: <strong className="text-slate-200 underline decoration-dotted">{state.corrosion.soilTests.chlorides} ppm</strong></span>
              <span>SO₄: <strong className="text-slate-200 underline decoration-dotted">{state.corrosion.soilTests.sulfates} ppm</strong></span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
