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
  Activity,
  Layers,
  CircleDot,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  state: DesignState;
  results: FullCalculationResults;
  lang: Language;
}

export const DesignSummaryCard: React.FC<Props> = ({ state, results, lang }) => {
  const isFa = lang === 'fa';
  const t = TRANSLATIONS[lang];

  const checks = [
    {
      title: isFa ? 'کشش میلگرد نیل' : 'Tendon Tension',
      code: 'AASHTO 11.12.6.1',
      demand: `${results.tendon.factoredLoad} kN`,
      capacity: `${results.tendon.factoredResistance} kN`,
      cdr: results.tendon.capacityDemandRatio,
      isPassed: results.tendon.isPassed,
      detail: `db = φ${state.tendon.barDiameter} mm (As = ${results.tendon.AsProvided} cm²)`,
    },
    {
      title: isFa ? 'بیرون‌کشیدگی نیل (پیوستگی)' : 'Pullout Resistance',
      code: 'AASHTO 11.12.5.2',
      demand: `${results.pullout.factoredLoad} kN`,
      capacity: `${results.pullout.factoredResistance} kN`,
      cdr: results.pullout.capacityDemandRatio,
      isPassed: results.pullout.isPassed,
      detail: `DD = ${state.pullout.drillholeDiameter} mm, Lp = ${state.pullout.effectiveBondLength} m`,
    },
    {
      title: isFa ? 'پلیت سر نیل (خمش و اتکا)' : 'Bearing Plate',
      code: 'FHWA NHI-14-007',
      demand: `σ = ${results.plate.bendingStress} kg/cm²`,
      capacity: `Fb = ${results.plate.allowableBendingStress} kg/cm²`,
      cdr: Number((results.plate.allowableBendingStress / Math.max(results.plate.bendingStress, 1)).toFixed(2)),
      isPassed: results.plate.isPassed,
      detail: `${state.plate.plateWidth}×${state.plate.plateWidth} cm, t = ${state.plate.plateThickness} cm`,
    },
    {
      title: isFa ? 'خمش شاتکریت موقت' : 'Temp Facing Flexure',
      code: 'AASHTO 11.12.6.2.2',
      demand: `${results.tempFlexure.factoredLoad} kN`,
      capacity: `${results.tempFlexure.factoredResistance} kN`,
      cdr: results.tempFlexure.CDR,
      isPassed: results.tempFlexure.isPassed,
      detail: `h = ${state.facing.tempThickness} mm, CF = ${state.facing.tempCF}`,
    },
    {
      title: isFa ? 'برش پانچ شاتکریت موقت' : 'Temp Facing Punching',
      code: 'AASHTO 11.12.6.2.2',
      demand: `${results.tempPunching.factoredLoad} kN`,
      capacity: `${results.tempPunching.factoredResistance} kN`,
      cdr: results.tempPunching.CDR,
      isPassed: results.tempPunching.isPassed,
      detail: `Dc' = ${(results.tempPunching.DcPrime * 100).toFixed(1)} cm`,
    },
    {
      title: isFa ? 'خمش بتن دائم' : 'Perm Facing Flexure',
      code: 'AASHTO 11.12.6.2.2',
      demand: `${results.permFlexure.factoredLoad} kN`,
      capacity: `${results.permFlexure.factoredResistance} kN`,
      cdr: results.permFlexure.CDR,
      isPassed: results.permFlexure.isPassed,
      detail: `h = ${state.facing.permThickness} mm, CF = 1.0`,
    },
    {
      title: isFa ? 'برش پانچ بتن دائم' : 'Perm Facing Punching',
      code: 'AASHTO 11.12.6.2.2',
      demand: `${results.permPunching.factoredLoad} kN`,
      capacity: `${results.permPunching.factoredResistance} kN`,
      cdr: results.permPunching.CDR,
      isPassed: results.permPunching.isPassed,
      detail: `Dc' = ${(results.permPunching.DcPrime * 100).toFixed(1)} cm`,
    },
    {
      title: isFa ? 'کشش گل‌میخ‌های سر نیل' : 'Headed Studs Tension',
      code: 'AASHTO 11.12.6.2.3',
      demand: `${results.headedStuds.factoredLoad} kN`,
      capacity: `${results.headedStuds.factoredResistance} kN`,
      cdr: results.headedStuds.CDR,
      isPassed: results.headedStuds.isPassed,
      detail: `${state.facing.headedStudsCount}x φ${state.facing.headedStudDiameter} mm`,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Top Banner with Pass/Fail state */}
      <div
        className={`px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-white transition-colors ${
          results.isOverallPassed
            ? 'bg-gradient-to-r from-emerald-600 to-teal-700'
            : 'bg-gradient-to-r from-rose-600 to-red-700'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {results.isOverallPassed ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-200 shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-rose-200 shrink-0" />
          )}
          <div>
            <div className="font-bold text-base leading-tight">
              {results.isOverallPassed ? t.statusPassed : t.statusFailed}
            </div>
            <div className="text-xs text-emerald-100 font-light opacity-90">
              {isFa
                ? 'محاسبات بر اساس روش ضریب بار و مقاومت (LRFD) نشریه AASHTO LRFD Bridge 2020 و FHWA GEC-7'
                : 'AASHTO LRFD (9th Ed, 2020) & FHWA GEC-7 Design Compliance'}
            </div>
          </div>
        </div>

        {/* Quick Highlights */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="bg-black/20 backdrop-blur-xs px-3 py-1 rounded-md flex items-center gap-1.5">
            <span className="text-slate-200">{isFa ? 'نیروی سر نیل (T0):' : 'Nail Head Load (T0):'}</span>
            <span className="font-mono font-bold text-white" dir="ltr">{results.T0} kN</span>
          </div>

          <div className="bg-black/20 backdrop-blur-xs px-3 py-1 rounded-md flex items-center gap-1.5">
            <span className="text-slate-200">{isFa ? 'کلاس حفاظت:' : 'Corrosion Class:'}</span>
            <span className="font-bold text-amber-200">
              {state.corrosion.selectedClass === 'ClassA'
                ? (isFa ? 'کلاس A (محصورسازی کامل)' : 'Class A (Encapsulation)')
                : state.corrosion.selectedClass === 'ClassB'
                ? (isFa ? 'کلاس B (میلگرد پوشش‌دار)' : 'Class B (Coated)')
                : (isFa ? 'بدون حفاظت (نیل موقت)' : 'None (Temporary)')}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Key Structural & Geotechnical Checks */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50/50">
        {checks.map((c, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg border transition-all ${
              c.isPassed
                ? 'bg-white border-slate-200 hover:border-emerald-300'
                : 'bg-rose-50/60 border-rose-200'
            }`}
          >
            <div className="flex items-start justify-between gap-1 mb-1.5">
              <span className="font-semibold text-xs text-slate-800 line-clamp-1">{c.title}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                  c.isPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}
              >
                {c.isPassed ? <Check className="w-2.5 h-2.5" /> : <AlertTriangle className="w-2.5 h-2.5" />}
                {c.isPassed ? 'OK' : 'NG'}
              </span>
            </div>

            <div className="text-[11px] text-slate-500 mb-2 font-mono" dir="ltr">{c.detail}</div>

            <div className="flex items-baseline justify-between border-t border-slate-100 pt-1.5">
              <span className="text-[11px] text-slate-400 font-mono" dir="ltr">{c.code}</span>
              <div className="text-right" dir="ltr">
                <span className="text-[10px] text-slate-400 font-medium">CDR = </span>
                <span
                  className={`text-xs font-mono font-bold ${
                    c.cdr >= 1.0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {c.cdr}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Corrosion & Geotechnical Health Summary strip */}
      <div className="px-5 py-2.5 bg-slate-100/70 border-t border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-700">
        <div className="flex items-center gap-2">
          {results.corrosion.isAggressive ? (
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>
            {results.corrosion.isAggressive
              ? (isFa ? 'محیط خاک: تهاجمی (خوردگی بالا) -> الزامی بودن محصورسازی کلاس A' : 'Aggressive Soil Environment -> Class A Encapsulation Required')
              : (isFa ? 'محیط خاک: غیرتهاجمی (نرمال) -> امکان استفاده از کلاس B یا A' : 'Non-Aggressive Soil Environment -> Class B or A Permitted')}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono" dir="ltr">
          <span>pH: {state.corrosion.soilTests.pH}</span>
          <span>ρ: {state.corrosion.soilTests.resistivity} Ω·cm</span>
          <span>Cl: {state.corrosion.soilTests.chlorides} ppm</span>
          <span>SO₄: {state.corrosion.soilTests.sulfates} ppm</span>
        </div>
      </div>
    </div>
  );
};
