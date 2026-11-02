/**
 * Comprehensive Engineering Guidance Modal for AASHTO LRFD (2020) & FHWA-NHI-14-007
 */
import React, { useState } from 'react';
import { Language } from '../types/nailing';
import { TRANSLATIONS } from '../utils/translations';
import {
  HelpCircle,
  BookOpen,
  CheckCircle,
  Shield,
  Layers,
  Wrench,
  Search,
  ExternalLink,
} from 'lucide-react';
import { PRESUMPTIVE_BOND_STRENGTHS } from '../constants/standardsData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const GuidanceModal: React.FC<Props> = ({ isOpen, onClose, lang }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'factors' | 'bond' | 'facing' | 'corrosion'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;
  const isFa = lang === 'fa';
  const t = TRANSLATIONS[lang];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-300">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-base font-bold">
                {isFa
                  ? 'راهنمای جامع آیین‌نامه و انتخاب پارامترهای طراحی نیلینگ'
                  : 'AASHTO & FHWA Soil Nail Design Guidance Manual'}
              </h2>
              <p className="text-xs text-slate-400">
                AASHTO LRFD Bridge Design Specs (9th Ed, 2020) & FHWA-NHI-14-007 (GEC 7)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl font-bold transition p-1"
          >
            &times;
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 bg-slate-100 border-b border-slate-200 flex gap-4 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'overview', label: isFa ? 'معرفی و اصول LRFD' : 'Overview & LRFD' },
            { id: 'factors', label: isFa ? 'ضرایب بار و مقاومت' : 'Load & Resistance Factors' },
            { id: 'bond', label: isFa ? 'مقاومت پیوستگی دوغاب (qu)' : 'Bond Strength (qu)' },
            { id: 'facing', label: isFa ? 'طراحی پوشش و پلیت' : 'Facing & Plate Design' },
            { id: 'corrosion', label: isFa ? 'سیستم حفاظت خوردگی' : 'Corrosion Protection' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 leading-relaxed">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 text-blue-900">
                <h3 className="font-bold text-sm mb-1">
                  {isFa ? 'مبانی طراحی سیستم میخ‌کوبی (Soil Nailing)' : 'Principles of Soil Nail Design'}
                </h3>
                <p>
                  {isFa
                    ? 'طراحی سیستم نیلینگ بر اساس روش LRFD (حالات حدی) شامل دو بخش کلی است: ۱- پایداری خارجی و کلی ترانشه (تعادل حدی LEM) که از آن بیشترین نیروی کششی نیل‌ها (Tmax) به دست می‌آید؛ ۲- کنترل پایداری اجزای داخلی شامل تسلیم میلگرد نیل، بیرون‌کشیدگی دوغاب از خاک، خمش و برش پانچینگ پوشش شاتکریت موقت و بتن دائم، پلیت سر نیل و سیستم حفاظت خوردگی.'
                    : 'Soil nail design per AASHTO LRFD ensures internal and external stability. Internal components include the nail tendon, borehole pullout resistance, bearing plate, shotcrete and concrete facings (flexure and punching shear), and durable corrosion encapsulation.'}
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs">
                  {isFa ? 'برآورد اولیه حداکثر نیروی کششی نیل (Tmax)' : 'Estimation of Maximum Nail Force (Tmax)'}
                </h4>
                <p>
                  {isFa
                    ? 'طبق بند FHWA NHI-14-007 (بند 5.2.1b) برای برآورد اولیه در دو سوم بالایی دیواره می‌توان از رابطه زیر استفاده کرد:'
                    : 'Per FHWA GEC 7 (Eq 5.2.1b), average maximum tensile force in the upper two-thirds of the wall is estimated as:'}
                </p>
                <div className="p-2.5 bg-slate-100 rounded font-mono text-center text-xs font-bold text-slate-800">
                  Tmax = 0.75 · Ka · γs · H · Sv · SH
                </div>
                <p className="text-[11px] text-slate-500">
                  {isFa
                    ? 'محدوده تغییرات: 0.5Ka·γ·H·Sv·SH ≤ Tmax ≤ 1.1Ka·γ·H·Sv·SH. همچنین رابطه بریاود و لیم (Briaud & Lim) مقدار 0.65Ka·γ·H·Sv·SH را برای ردیف بالا پیشنهاد می‌کند.'
                    : 'Range varies between 0.5 to 1.1 Ka·γ·H·Sv·SH. Lim & Briaud suggest 0.65 Ka·γ·H·Sv·SH for upper rows.'}
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs">
                  {isFa ? 'نیروی سر میخ (T0) - رابطه کلوتر (Clouterre)' : 'Nail Head Tension (T0) - Clouterre Formula'}
                </h4>
                <p>
                  {isFa
                    ? 'نیروی وارده بر صفحه سر نیل و پوشش دیواره طبق نشریه FHWA NHI-14-007 (رابطه 5.1) بر اساس فاصله بین نیل‌ها به صورت زیر محاسبه می‌شود:'
                    : 'The connection load at the nail head is calculated per FHWA NHI-14-007 Eq 5.1:'}
                </p>
                <div className="p-2.5 bg-slate-100 rounded font-mono text-center text-xs font-bold text-slate-800">
                  T0 = Tmax · [ 0.6 + 0.2 · (Smax - 1) ] &nbsp; (Smax در متر)
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOAD & RESISTANCE FACTORS */}
          {activeTab === 'factors' && (
            <div className="space-y-4">
              <h3 className="font-bold text-xs text-slate-800">
                {isFa
                  ? 'جدول ضرایب کاهش مقاومت بر اساس AASHTO LRFD (Table 11.5.7-1)'
                  : 'Resistance Factors per AASHTO LRFD Table 11.5.7-1'}
              </h3>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-right border-collapse">
                  <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="p-2">{isFa ? 'جزء سازه‌ای و حالت حدی' : 'Component / Limit State'}</th>
                      <th className="p-2">{isFa ? 'شرایط و مشخصات مصالح' : 'Condition / Material'}</th>
                      <th className="p-2 text-center">{isFa ? 'ضریب مقاومت (φ)' : 'Resistance Factor (φ)'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2 font-semibold">Tensile resistance of nail tendon</td>
                      <td className="p-2">Mild steel bars (Grade 60 / Grade 75)</td>
                      <td className="p-2 text-center font-mono font-bold text-emerald-700">0.75</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Tensile resistance of nail tendon</td>
                      <td className="p-2">High-strength steel (Grade 95 / Grade 150)</td>
                      <td className="p-2 text-center font-mono font-bold text-emerald-700">0.65</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Pullout resistance of nail</td>
                      <td className="p-2">Granular / cohesive soils (no proof test)</td>
                      <td className="p-2 text-center font-mono font-bold text-emerald-700">0.65</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Pullout resistance of nail</td>
                      <td className="p-2">Where proof tests conducted on each anchor</td>
                      <td className="p-2 text-center font-mono font-bold text-emerald-700">1.00</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Facing flexure (خمش پوشش)</td>
                      <td className="p-2">Initial shotcrete and final facing</td>
                      <td className="p-2 text-center font-mono font-bold text-emerald-700">0.90</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Facing punching shear (برش پانچ)</td>
                      <td className="p-2">Initial shotcrete and final facing</td>
                      <td className="p-2 text-center font-mono font-bold text-emerald-700">0.90</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Tensile resistance of headed stud</td>
                      <td className="p-2">A307 steel bolt / stud</td>
                      <td className="p-2 text-center font-mono font-bold text-emerald-700">0.70</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Tensile resistance of headed stud</td>
                      <td className="p-2">A325 steel bolt / stud</td>
                      <td className="p-2 text-center font-mono font-bold text-emerald-700">0.80</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <span className="font-bold text-slate-800">
                  {isFa ? 'ضریب بار دائمی فشار قائم خاک (AASHTO Table 3.4.1-2):' : 'Load Factor:'}
                </span>
                <span className="font-mono text-slate-700 ml-2">γp-EV = 1.35</span>
                <p className="text-[11px] text-slate-500 mt-1">
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
              <h3 className="font-bold text-xs text-slate-800">
                {isFa
                  ? 'مقاومت پیوستگی اسمی دوغاب و زمین (AASHTO Table C11.12.5.2-1, 2, 3)'
                  : 'Presumptive Bond Strength Table'}
              </h3>

              <div className="border border-slate-200 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                <table className="w-full text-right border-collapse">
                  <thead className="bg-slate-100 font-bold text-slate-700 sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="p-2">{isFa ? 'خاک / سنگ' : 'Soil / Rock'}</th>
                      <th className="p-2">{isFa ? 'روش حفاری' : 'Drilling Method'}</th>
                      <th className="p-2">{isFa ? 'دامنه (psi)' : 'Range (psi)'}</th>
                      <th className="p-2">{isFa ? 'دامنه (kPa)' : 'Range (kPa)'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {PRESUMPTIVE_BOND_STRENGTHS.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-2 font-medium">{isFa ? row.soilDescriptionFa : row.soilDescriptionEn}</td>
                        <td className="p-2 text-slate-500">{row.drillingMethod}</td>
                        <td className="p-2 font-mono">{row.quMinPsi} - {row.quMaxPsi}</td>
                        <td className="p-2 font-mono font-bold text-teal-700">{row.quMinKPa} - {row.quMaxKPa}</td>
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
              <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs">
                  {isFa ? 'ضریب فشار غیریکنواخت خاک (CF)' : 'Non-Uniform Soil Pressure Factor (CF)'}
                </h4>
                <p>
                  {isFa
                    ? 'ضریب CF بیانگر اثر قوس‌زدگی خاک در پشت پوسته شاتکریت است و بر اساس ضخامت شاتکریت تعیین می‌گردد:'
                    : 'Factor CF accounts for soil arching behind facing:'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-xs">
                  <div className="p-2 bg-slate-50 border rounded">
                    <div>h ≤ 100 mm</div>
                    <div className="font-bold text-blue-700">CF = 2.0</div>
                  </div>
                  <div className="p-2 bg-slate-50 border rounded">
                    <div>h = 150 mm</div>
                    <div className="font-bold text-blue-700">CF = 1.5</div>
                  </div>
                  <div className="p-2 bg-slate-50 border rounded">
                    <div>h ≥ 200 mm</div>
                    <div className="font-bold text-blue-700">CF = 1.0</div>
                  </div>
                  <div className="p-2 bg-slate-50 border rounded">
                    <div>پوشش دائم</div>
                    <div className="font-bold text-blue-700">CF = 1.0</div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs">
                  {isFa ? 'فرمول ظرفیت برش پانچینگ (AASHTO 11.12.6.2.2)' : 'Punching Shear Equation'}
                </h4>
                <div className="p-2.5 bg-slate-100 rounded font-mono text-center text-xs font-bold text-slate-800">
                  VF [kN] = 330 · √(f'c [MPa]) · π · Dc' [m] · hc [m]
                </div>
                <p className="text-[11px] text-slate-500">
                  {isFa
                    ? 'که در آن Dc\' = LPB + hi قطر قاعده مخروط گسیختگی پانچ در ضخامت مؤثر شاتکریت است و RFP = Cp · VF.'
                    : 'Where Dc\' = LPB + hi is the punching cone base diameter at critical section.'}
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs">
                  {isFa ? 'طراحی صفحه سر نیل (پلیت فولادی)' : 'Bearing Plate Design'}
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>
                    {isFa ? 'تنش مجاز اتکایی روی بتن/شاتکریت: fp = 0.7 · f\'c' : 'Concrete allowable bearing: fp = 0.7 · f\'c'}
                  </li>
                  <li>
                    {isFa ? 'حداقل سطح اتکای خالص: Anet = B² - π/4 · Dhole² ≥ T0 / fp' : 'Net bearing area requirement'}
                  </li>
                  <li>
                    {isFa ? 'تنش خمشی طره پلیت: σ = 6M / t² ≤ Fb = 0.75 · fy-p' : 'Plate cantilever flexural check'}
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: CORROSION */}
          {activeTab === 'corrosion' && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs">
                  {isFa ? 'معیارهای ۵ گانه AASHTO برای خاک غیرتهاجمی' : 'AASHTO Soil Aggressiveness Criteria'}
                </h4>
                <p>
                  {isFa
                    ? 'خاک تنها در صورتی غیرتهاجمی تلقی می‌شود که همزمان تمام شرایط زیر برقرار باشد:'
                    : 'Soil is considered Non-Aggressive ONLY if all 5 conditions are met simultaneously:'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-slate-50 rounded border flex items-center justify-between">
                    <span>اسیدیته (pH):</span>
                    <strong className="font-mono text-emerald-700">5.0 ≤ pH ≤ 10.0</strong>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border flex items-center justify-between">
                    <span>مقاومت ویژه (Resistivity):</span>
                    <strong className="font-mono text-emerald-700">≥ 3000 Ω·cm</strong>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border flex items-center justify-between">
                    <span>کلریدها (Chlorides):</span>
                    <strong className="font-mono text-emerald-700">≤ 100 ppm</strong>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border flex items-center justify-between">
                    <span>سولفات‌ها (Sulfates):</span>
                    <strong className="font-mono text-emerald-700">≤ 200 ppm</strong>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border flex items-center justify-between sm:col-span-2">
                    <span>مواد آلی (Organic Matter):</span>
                    <strong className="font-mono text-emerald-700">≤ 1.0% وزنی</strong>
                  </div>
                </div>
                <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 mt-2">
                  {isFa
                    ? 'نکته مهم: چنانچه حتی یکی از معیارهای فوق نقض شود، خاک تهاجمی (Aggressive) بوده و استفاده از سیستم محصورسازی کامل (Class A Encapsulation / DCP) الزامی است.'
                    : 'Critical Note: If any single criterion fails, soil is Aggressive and Class A Encapsulation is mandatory.'}
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs">
                  {isFa ? 'الزامات فنی غلاف موج‌دار کلاس A (Encapsulation)' : 'Class A Duct Specifications'}
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
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
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 font-semibold text-xs transition"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
