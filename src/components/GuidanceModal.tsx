/**
 * Comprehensive Engineering Guidance Modal for AASHTO LRFD (2020) & FHWA-NHI-14-007
 */
import React, { useState } from 'react';
import { Language } from '../types/nailing';
import { TRANSLATIONS } from '../utils/translations';
import {
  BookOpen,
  Info,
  X,
} from 'lucide-react';
import { PRESUMPTIVE_BOND_STRENGTHS } from '../constants/standardsData';
import { DeveloperProfileSection } from './DeveloperProfileSection';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const GuidanceModal: React.FC<Props> = ({ isOpen, onClose, lang }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'factors' | 'bond' | 'facing' | 'corrosion' | 'about'>('overview');

  if (!isOpen) return null;
  const isFa = lang === 'fa';
  const t = TRANSLATIONS[lang];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div
        dir={isFa ? 'rtl' : 'ltr'}
        className={`bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-700 text-slate-100 ${
          isFa ? 'text-right' : 'text-left'
        }`}
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-sky-400 shrink-0" />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-100">
                {isFa
                  ? 'راهنمای جامع آیین‌نامه و انتخاب پارامترهای طراحی نیلینگ'
                  : 'AASHTO & FHWA Soil Nail Design Guidance Manual'}
              </h2>
              <p className="text-xs text-slate-400" dir="ltr">
                AASHTO LRFD Bridge Design Specs (9th Ed, 2020) & FHWA-NHI-14-007 (GEC 7)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 bg-slate-950/50 border-b border-slate-800 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold">
          {[
            { id: 'overview', label: isFa ? 'معرفی و اصول LRFD' : 'Overview & LRFD' },
            { id: 'factors', label: isFa ? 'ضرایب بار و مقاومت' : 'Load & Resistance Factors' },
            { id: 'bond', label: isFa ? 'مقاومت پیوستگی دوغاب (qu)' : 'Bond Strength (qu)' },
            { id: 'facing', label: isFa ? 'طراحی پوشش و پلیت' : 'Facing & Plate Design' },
            { id: 'corrosion', label: isFa ? 'سیستم حفاظت خوردگی' : 'Corrosion Protection' },
            { id: 'about', label: isFa ? 'درباره نرم‌افزار و توسعه‌دهندگان' : 'About & Developers' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-sky-400 text-sky-300 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 bg-sky-950/30 rounded-xl border border-sky-500/30 text-slate-200">
                <h3 className="font-bold text-sm text-sky-200 mb-1.5">
                  {isFa ? 'مبانی طراحی سیستم میخ‌کوبی (Soil Nailing)' : 'Principles of Soil Nail Design'}
                </h3>
                <p>
                  {isFa
                    ? 'طراحی سیستم نیلینگ بر اساس روش LRFD (حالات حدی) شامل دو بخش کلی است: ۱- پایداری خارجی و کلی ترانشه (تعادل حدی LEM) که از آن بیشترین نیروی کششی نیل‌ها (Tmax) به دست می‌آید؛ ۲- کنترل پایداری اجزای داخلی شامل تسلیم میلگرد نیل، بیرون‌کشیدگی دوغاب از خاک، خمش و برش پانچینگ پوشش شاتکریت موقت و بتن دائم، پلیت سر نیل و سیستم حفاظت خوردگی.'
                    : 'Soil nail design per AASHTO LRFD ensures internal and external stability. Internal components include the nail tendon, borehole pullout resistance, bearing plate, shotcrete and concrete facings (flexure and punching shear), and durable corrosion encapsulation.'}
                </p>
              </div>

              <div className="border border-slate-800 bg-slate-950/60 rounded-xl p-4 space-y-2.5">
                <h4 className="font-bold text-slate-100 text-xs">
                  {isFa ? 'برآورد اولیه حداکثر نیروی کششی نیل (Tmax)' : 'Estimation of Maximum Nail Force (Tmax)'}
                </h4>
                <p>
                  {isFa
                    ? 'طبق بند FHWA NHI-14-007 (بند 5.2.1b) برای برآورد اولیه در دو سوم بالایی دیواره می‌توان از رابطه زیر استفاده کرد:'
                    : 'Per FHWA GEC 7 (Eq 5.2.1b), average maximum tensile force in the upper two-thirds of the wall is estimated as:'}
                </p>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-center text-xs font-bold text-sky-300" dir="ltr">
                  Tmax = 0.75 · Ka · γs · H · Sv · SH
                </div>
                <p className="text-[11px] text-slate-400">
                  {isFa
                    ? 'محدوده تغییرات: 0.5Ka·γ·H·Sv·SH ≤ Tmax ≤ 1.1Ka·γ·H·Sv·SH. همچنین رابطه بریاود و لیم (Briaud & Lim) مقدار 0.65Ka·γ·H·Sv·SH را برای ردیف بالا پیشنهاد می‌کند.'
                    : 'Range varies between 0.5 to 1.1 Ka·γ·H·Sv·SH. Lim & Briaud suggest 0.65 Ka·γ·H·Sv·SH for upper rows.'}
                </p>
              </div>

              <div className="border border-slate-800 bg-slate-950/60 rounded-xl p-4 space-y-2.5">
                <h4 className="font-bold text-slate-100 text-xs">
                  {isFa ? 'نیروی سر میخ (T0) - رابطه کلوتر (Clouterre)' : 'Nail Head Tension (T0) - Clouterre Formula'}
                </h4>
                <p>
                  {isFa
                    ? 'نیروی وارده بر صفحه سر نیل و پوشش دیواره طبق نشریه FHWA NHI-14-007 (رابطه 5.1) بر اساس فاصله بین نیل‌ها به صورت زیر محاسبه می‌شود:'
                    : 'The connection load at the nail head is calculated per FHWA NHI-14-007 Eq 5.1:'}
                </p>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-center text-xs font-bold text-sky-300" dir="ltr">
                  T0 = Tmax · [ 0.6 + 0.2 · (Smax - 1) ] &nbsp; (Smax in meters)
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOAD & RESISTANCE FACTORS */}
          {activeTab === 'factors' && (
            <div className="space-y-4">
              <h3 className="font-bold text-xs text-slate-100">
                {isFa
                  ? 'جدول ضرایب کاهش مقاومت بر اساس AASHTO LRFD (Table 11.5.7-1)'
                  : 'Resistance Factors per AASHTO LRFD Table 11.5.7-1'}
              </h3>

              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
                <table className={`w-full border-collapse ${isFa ? 'text-right' : 'text-left'}`}>
                  <thead className="bg-slate-900 font-bold text-slate-200 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">{isFa ? 'جزء سازه‌ای و حالت حدی' : 'Component / Limit State'}</th>
                      <th className="p-2.5">{isFa ? 'شرایط و مشخصات مصالح' : 'Condition / Material'}</th>
                      <th className="p-2.5 text-center">{isFa ? 'ضریب مقاومت (φ)' : 'Resistance Factor (φ)'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-200">Tensile resistance of nail tendon</td>
                      <td className="p-2.5 text-slate-400">Mild steel bars (Grade 60 / Grade 75)</td>
                      <td className="p-2.5 text-center font-mono font-bold text-emerald-400 tabular-nums">0.75</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-200">Tensile resistance of nail tendon</td>
                      <td className="p-2.5 text-slate-400">High-strength steel (Grade 95 / Grade 150)</td>
                      <td className="p-2.5 text-center font-mono font-bold text-emerald-400 tabular-nums">0.65</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-200">Pullout resistance of nail</td>
                      <td className="p-2.5 text-slate-400">Granular / cohesive soils (no proof test)</td>
                      <td className="p-2.5 text-center font-mono font-bold text-emerald-400 tabular-nums">0.65</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-200">Pullout resistance of nail</td>
                      <td className="p-2.5 text-slate-400">Where proof tests conducted on each anchor</td>
                      <td className="p-2.5 text-center font-mono font-bold text-emerald-400 tabular-nums">1.00</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-200">{isFa ? 'Facing flexure (خمش پوشش)' : 'Facing flexure'}</td>
                      <td className="p-2.5 text-slate-400">Initial shotcrete and final facing</td>
                      <td className="p-2.5 text-center font-mono font-bold text-emerald-400 tabular-nums">0.90</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-200">{isFa ? 'Facing punching shear (برش پانچ)' : 'Facing punching shear'}</td>
                      <td className="p-2.5 text-slate-400">Initial shotcrete and final facing</td>
                      <td className="p-2.5 text-center font-mono font-bold text-emerald-400 tabular-nums">0.90</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-200">Tensile resistance of headed stud</td>
                      <td className="p-2.5 text-slate-400">A307 steel bolt / stud</td>
                      <td className="p-2.5 text-center font-mono font-bold text-emerald-400 tabular-nums">0.70</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-200">Tensile resistance of headed stud</td>
                      <td className="p-2.5 text-slate-400">A325 steel bolt / stud</td>
                      <td className="p-2.5 text-center font-mono font-bold text-emerald-400 tabular-nums">0.80</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border border-slate-800 rounded-xl p-3.5 bg-slate-950/60">
                <span className="font-bold text-slate-100">
                  {isFa ? 'ضریب بار دائمی فشار قائم خاک (AASHTO Table 3.4.1-2):' : 'Load Factor:'}
                </span>
                <span className="font-mono text-sky-300 font-bold ml-2 mr-2" dir="ltr">γp-EV = 1.35</span>
                <p className="text-[11px] text-slate-400 mt-1">
                  {isFa
                    ? 'برای دیوارهای میخ‌کوبی شده و پایدارسازی ترانشه‌ها ضریب بار فشار قائم خاک برابر ۱.۳۵ در نظر گرفته می‌شود.'
                    : 'Vertical earth pressure load factor for retaining walls is γp-EV = 1.35.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: BOND STRENGTH */}
          {activeTab === 'bond' && (
            <div className="space-y-4">
              <h3 className="font-bold text-xs text-slate-100">
                {isFa
                  ? 'مقاومت پیوستگی اسمی دوغاب و زمین (AASHTO Table C11.12.5.2-1, 2, 3)'
                  : 'Presumptive Bond Strength Table'}
              </h3>

              <div className="border border-slate-800 rounded-xl overflow-hidden max-h-96 overflow-y-auto bg-slate-950/60">
                <table className={`w-full border-collapse ${isFa ? 'text-right' : 'text-left'}`}>
                  <thead className="bg-slate-900 font-bold text-slate-200 sticky top-0 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">{isFa ? 'خاک / سنگ' : 'Soil / Rock'}</th>
                      <th className="p-2.5">{isFa ? 'روش حفاری' : 'Drilling Method'}</th>
                      <th className="p-2.5 text-center">{isFa ? 'دامنه (psi)' : 'Range (psi)'}</th>
                      <th className="p-2.5 text-center">{isFa ? 'دامنه (kPa)' : 'Range (kPa)'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {PRESUMPTIVE_BOND_STRENGTHS.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-900/70">
                        <td className="p-2.5 font-medium text-slate-200">{isFa ? row.soilDescriptionFa : row.soilDescriptionEn}</td>
                        <td className="p-2.5 text-slate-400">{row.drillingMethod}</td>
                        <td className="p-2.5 font-mono text-center text-slate-300 tabular-nums" dir="ltr">{row.quMinPsi} - {row.quMaxPsi}</td>
                        <td className="p-2.5 font-mono text-center font-bold text-teal-400 tabular-nums" dir="ltr">{row.quMinKPa} - {row.quMaxKPa}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: FACING & BEARING PLATE */}
          {activeTab === 'facing' && (
            <div className="space-y-4">
              <div className="border border-slate-800 bg-slate-950/60 rounded-xl p-4 space-y-2.5">
                <h4 className="font-bold text-slate-100 text-xs">
                  {isFa ? 'ضریب فشار غیریکنواخت خاک (CF)' : 'Non-Uniform Soil Pressure Factor (CF)'}
                </h4>
                <p>
                  {isFa
                    ? 'ضریب CF بیانگر اثر قوس‌زدگی خاک در پشت پوسته شاتکریت است و بر اساس ضخامت شاتکریت تعیین می‌گردد:'
                    : 'Factor CF accounts for soil arching behind facing:'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center font-mono text-xs">
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                    <div className="text-slate-300">h ≤ 100 mm</div>
                    <div className="font-bold text-sky-400 mt-0.5">CF = 2.0</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                    <div className="text-slate-300">h = 150 mm</div>
                    <div className="font-bold text-sky-400 mt-0.5">CF = 1.5</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                    <div className="text-slate-300">h ≥ 200 mm</div>
                    <div className="font-bold text-sky-400 mt-0.5">CF = 1.0</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                    <div className="text-slate-300 font-sans">{isFa ? 'پوشش دائم' : 'Permanent'}</div>
                    <div className="font-bold text-sky-400 mt-0.5">CF = 1.0</div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-800 bg-slate-950/60 rounded-xl p-4 space-y-2.5">
                <h4 className="font-bold text-slate-100 text-xs">
                  {isFa ? 'فرمول ظرفیت برش پانچینگ (AASHTO 11.12.6.2.2)' : 'Punching Shear Equation'}
                </h4>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-center text-xs font-bold text-sky-300" dir="ltr">
                  VF [kN] = 330 · √(f'c [MPa]) · π · Dc' [m] · hc [m]
                </div>
                <p className="text-[11px] text-slate-400">
                  {isFa
                    ? 'که در آن Dc\' = LPB + hi قطر قاعده مخروط گسیختگی پانچ در ضخامت مؤثر شاتکریت است و RFP = Cp · VF.'
                    : 'Where Dc\' = LPB + hi is the punching cone base diameter at critical section.'}
                </p>
              </div>

              <div className="border border-slate-800 bg-slate-950/60 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-slate-100 text-xs">
                  {isFa ? 'طراحی صفحه سر نیل (پلیت فولادی)' : 'Bearing Plate Design'}
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>
                    {isFa ? 'تنش مجاز اتکایی روی بتن/شاتکریت: fp = 0.7 · f\'c' : 'Concrete allowable bearing: fp = 0.7 · f\'c'}
                  </li>
                  <li>
                    {isFa ? 'حداقل سطح اتکای خالص: Anet = B² - π/4 · Dhole² ≥ T0 / fp' : 'Net bearing area requirement: Anet = B² - π/4 · Dhole² ≥ T0 / fp'}
                  </li>
                  <li>
                    {isFa ? 'تنش خمشی طره پلیت: σ = 6M / t² ≤ Fb = 0.75 · fy-p' : 'Plate cantilever flexural check: σ = 6M / t² ≤ Fb = 0.75 · fy-p'}
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: CORROSION */}
          {activeTab === 'corrosion' && (
            <div className="space-y-4">
              <div className="border border-slate-800 bg-slate-950/60 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-slate-100 text-xs">
                  {isFa ? 'معیارهای ۵ گانه AASHTO برای خاک غیرتهاجمی' : 'AASHTO Soil Aggressiveness Criteria'}
                </h4>
                <p>
                  {isFa
                    ? 'خاک تنها در صورتی غیرتهاجمی تلقی می‌شود که همزمان تمام شرایط زیر برقرار باشد:'
                    : 'Soil is considered Non-Aggressive ONLY if all 5 conditions are met simultaneously:'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span>{isFa ? 'اسیدیته (pH):' : 'pH Value:'}</span>
                    <strong className="font-mono text-emerald-400" dir="ltr">5.0 ≤ pH ≤ 10.0</strong>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span>{isFa ? 'مقاومت ویژه (Resistivity):' : 'Resistivity:'}</span>
                    <strong className="font-mono text-emerald-400" dir="ltr">≥ 3000 Ω·cm</strong>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span>{isFa ? 'کلریدها (Chlorides):' : 'Chlorides:'}</span>
                    <strong className="font-mono text-emerald-400" dir="ltr">≤ 100 ppm</strong>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span>{isFa ? 'سولفات‌ها (Sulfates):' : 'Sulfates:'}</span>
                    <strong className="font-mono text-emerald-400" dir="ltr">≤ 200 ppm</strong>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between sm:col-span-2">
                    <span>{isFa ? 'مواد آلی (Organic Matter):' : 'Organic Matter:'}</span>
                    <strong className="font-mono text-emerald-400" dir="ltr">≤ 1.0%</strong>
                  </div>
                </div>
                <p className="text-[11px] text-amber-200 bg-amber-950/30 p-3 rounded-xl border border-amber-500/30 mt-2">
                  {isFa
                    ? 'نکته مهم: چنانچه حتی یکی از معیارهای فوق نقض شود، خاک تهاجمی (Aggressive) بوده و استفاده از سیستم محصورسازی کامل (Class A Encapsulation / DCP) الزامی است.'
                    : 'Critical Note: If any single criterion fails, soil is Aggressive and Class A Encapsulation is mandatory.'}
                </p>
              </div>

              <div className="border border-slate-800 bg-slate-950/60 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-slate-100 text-xs">
                  {isFa ? 'الزامات فنی غلاف موج‌دار کلاس A (Encapsulation)' : 'Class A Duct Specifications'}
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>
                    {isFa ? 'جنس غلاف: PVC موج‌دار با حداقل ضخامت ۱.۰ میلیمتر (40 mil) یا HDPE موج‌دار با حداقل ۱.۵ میلیمتر (60 mil)' : 'PVC min 1.0mm (40 mil), HDPE min 1.5mm (60 mil)'}
                  </li>
                  <li>
                    {isFa ? 'قطر داخلی غلاف: حداقل ۱۰ میلیمتر (۰.۴ اینچ) بزرگتر از قطر میلگرد نیل' : 'Duct ID >= bar diameter + 10 mm'}
                  </li>
                  <li>
                    {isFa ? 'پوشش دوغاب سیمانی داخل غلاف: حداقل ۵ میلیمتر (۰.۲ اینچ) در تمام جهات' : 'Internal grout cover >= 5 mm'}
                  </li>
                  <li>
                    {isFa ? 'پوشش دوغاب خارجی بین غلاف و جداره گمانه: حداقل ۲۵.۴ میلیمتر (۱ اینچ)' : 'External grout cover >= 25 mm'}
                  </li>
                  <li>
                    {isFa ? 'فواصل سنترالایزرها: حداکثر ۳.۰ متر (۱۰ فوت)' : 'Centralizer spacing <= 3.0 m'}
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 6: ABOUT & DEVELOPERS */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 text-slate-100 border border-slate-800 flex items-start gap-3">
                <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {isFa
                      ? 'درباره سامانه طراحی دیوارهای نیلینگ (Soil Nail Wall Design Suite)'
                      : 'About Soil Nail Wall Design Suite'}
                  </h4>
                  <p className="text-[11.5px] text-slate-300 mt-1 leading-relaxed">
                    {isFa
                      ? 'این نرم‌افزار جهت تحلیل، طراحی و کنترل اجزای داخلی دیوارهای میخ‌کوبی‌شده مطابق آیین‌نامه AASHTO LRFD (2020) و نشریه فنی FHWA-NHI-14-007 (GEC-7) با خروجی نقشه‌های مهندسی CAD و دفترچه محاسبات دوزبانه توسعه یافته است.'
                      : 'Engineered for complete LRFD internal design of soil nail walls per AASHTO LRFD (2020) and FHWA-NHI-14-007 (GEC-7), including interactive CAD cross-sections and formal calculation booklets.'}
                  </p>
                </div>
              </div>
              <DeveloperProfileSection lang={lang} variant="full" appVersion="1.0" />
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 rounded-xl font-semibold text-xs transition cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
