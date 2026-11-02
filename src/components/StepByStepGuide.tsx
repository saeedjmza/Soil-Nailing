/**
 * Step-by-Step Parameter Selection Guide Component
 * Based on AASHTO LRFD (2020) & FHWA-NHI-14-007 (GEC 7)
 */
import React, { useState } from 'react';
import { Language } from '../types/nailing';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Shield,
  Layers,
  CircleDot,
  Wrench,
} from 'lucide-react';

interface Props {
  lang: Language;
  onApplyPreset?: (presetName: string) => void;
}

interface StepItem {
  stepNum: number;
  titleFa: string;
  titleEn: string;
  parameterNameFa: string;
  parameterNameEn: string;
  standardSymbol: string;
  typicalRangeFa: string;
  typicalRangeEn: string;
  designCodeFa: string;
  designCodeEn: string;
  designImpactFa: string;
  designImpactEn: string;
  recommendationsFa: string[];
  recommendationsEn: string[];
}

const STEPS_DATA: StepItem[] = [
  {
    stepNum: 1,
    titleFa: 'تعیین فواصل شبکه نیل‌ها و برآورد نیروی حداکثر نیل',
    titleEn: 'Nail Grid Spacing & Maximum Tensile Force (Tmax)',
    parameterNameFa: 'فواصل افقی و قائم نیل‌ها و نیروی Tmax',
    parameterNameEn: 'Nail Spacing (SH, Sv) & Max Nail Load (Tmax)',
    standardSymbol: 'SH, SV, Tmax',
    typicalRangeFa: 'فاصله ۱.۲ تا ۲.۰ متر (متداول ۱.۵×۱.۵ متر یا ۲.۰×۲.۰ متر)',
    typicalRangeEn: '1.2 to 2.0 m (Typically 1.5×1.5 m or 2.0×2.0 m)',
    designCodeFa: 'AASHTO 11.12.2 و FHWA NHI-14-007 بند 5.2.1b',
    designCodeEn: 'AASHTO 11.12.2 & FHWA NHI-14-007 Eq 5.2.1b',
    designImpactFa:
      'فواصل نیل‌ها مساحت بارگیر هر میخ را تعیین می‌کند. فواصل بزرگتر باعث افزایش شدید نیروی کششی Tmax و لنگر خمشی شاتکریت می‌گردد. مقدار Tmax مبنای اولیه تمام کنترل‌های بعدی است.',
    designImpactEn:
      'Spacing controls the tributary area per nail. Wider spacing sharply increases Tmax and facing bending moments. Tmax is the benchmark load for all subsequent limit state checks.',
    recommendationsFa: [
      'در خاک‌های دانه‌ای معمولی یا دیواره‌های مرتفع، فاصله ۱.۵×۱.۵ متر ایمن‌ترین و بهینه‌ترین انتخاب است.',
      'برای برآورد اولیه در دو سوم بالایی دیوار از رابطه Tmax = 0.75·Ka·γ·H·Sv·SH استفاده کنید.',
      'برای طراحی نهایی، مقدار Tmax باید حتماً از تحلیل تعادل حدی دقیق (مانند Slide یا SLOPE/W) استخراج شود.',
    ],
    recommendationsEn: [
      'In ordinary granular soils or high walls, 1.5×1.5 m spacing is the most reliable and balanced choice.',
      'For preliminary design, use Tmax = 0.75·Ka·γ·H·Sv·SH for the upper two-thirds of the wall.',
      'For final design, Tmax must be obtained directly from 2D limit equilibrium slope stability analyses.',
    ],
  },
  {
    stepNum: 2,
    titleFa: 'انتخاب رده فولاد و قطر میلگرد نیل (Tendon Rebar)',
    titleEn: 'Tendon Rebar Diameter & Steel Grade',
    parameterNameFa: 'قطر اسمی میلگرد تسلیح نیل',
    parameterNameEn: 'Nominal Tendon Rebar Diameter (db)',
    standardSymbol: 'db, As, fy',
    typicalRangeFa: 'سایزهای φ25, φ28, φ32, φ36 میلیمتر (فولاد Grade 60 با fy=400 یا 420 MPa)',
    typicalRangeEn: 'φ25, φ28, φ32, φ36 mm (#8 to #11) with Grade 60 (fy=400-420 MPa) or Grade 75',
    designCodeFa: 'AASHTO LRFD 11.12.6.1 (جدول 11.5.7-1 ضریب φT = 0.75)',
    designCodeEn: 'AASHTO LRFD 11.12.6.1 (Table 11.5.7-1: φT = 0.75)',
    designImpactFa:
      'مقاومت کششی تسلیم میلگرد باید بتواند بار ضریب‌دار γp-EV · Tmax (با ضریب ۱.۳۵) را تحمل کند. سهم بتن یا دوغاب در کشش صفر فرض می‌شود.',
    designImpactEn:
      'Steel rebar cross-section must resist the factored demand γp-EV · Tmax (factor = 1.35). Tensile contribution of cement grout is neglected.',
    recommendationsFa: [
      'حداقل سطح مقطع مورد نیاز را از فرمول As,req = (1.35 · Tmax) / (0.75 · fy) محاسبه کنید.',
      'برای نیروهای تا ۱۵۰ کیلو نیوتن معمولاً میلگرد φ28 و برای نیروهای ۱۵۰ تا ۲۰۰ کیلو نیوتن میلگرد φ32 مناسب است.',
      'میلگردهای با رزوه کامل پیوسته (Threadbar) به دلیل امکان اتصال آسان مهره و کوپلر بسیار توصیه می‌شوند.',
    ],
    recommendationsEn: [
      'Compute minimum required rebar area: As,req = (1.35 · Tmax) / (0.75 · fy).',
      'For Tmax up to 150 kN, φ28 is typically adequate; for 150 to 200 kN, φ32 is commonly specified.',
      'Continuously threaded bars (Threadbars) are strongly recommended for easy nut fastening and couplers.',
    ],
  },
  {
    stepNum: 3,
    titleFa: 'تعیین قطر گمانه حفاری و طول پیوستگی نیل (Borehole & Bond Length)',
    titleEn: 'Drillhole Borehole Diameter & Effective Bond Length',
    parameterNameFa: 'قطر گمانه حفاری (DD) و طول مؤثر (Lp)',
    parameterNameEn: 'Drillhole Diameter (DD) & Bond Length (Lp)',
    standardSymbol: 'DD, Lp, qu',
    typicalRangeFa: 'قطر گمانه ۱۰۰ الی ۱۵۰ میلیمتر (معمولاً ۱۱۰ یا ۱۲۰ mm)؛ طول مؤثر ۶ الی ۱۲ متر',
    typicalRangeEn: 'DD = 100 to 150 mm (typically 110 or 120 mm); Lp = 6 to 12 m behind failure plane',
    designCodeFa: 'AASHTO LRFD 11.12.5.2 (جدول 11.5.7-1 ضریب φPO = 0.65)',
    designCodeEn: 'AASHTO LRFD 11.12.5.2 (Table 11.5.7-1: φPO = 0.65)',
    designImpactFa:
      'ظرفیت بیرون‌کشیدگی دوغاب از فرمول RPO = π · DD · Lp · qu محاسبه می‌شود. افزایش قطر گمانه یا طول مؤثر، مقاومت بیرون‌کشیدگی را مستقیماً بالا می‌برد.',
    designImpactEn:
      'Nominal pullout capacity RPO = π · DD · Lp · qu. Increasing borehole diameter or bond length directly increases pullout resistance.',
    recommendationsFa: [
      'قطر حفاری باید متناسب با سایز غلاف محافظ باشد تا حداقل ۲۵ میلیمتر پوشش دوغاب خارجی تأمین شود.',
      'طول مؤثر Lp فقط شامل بخشی از نیل است که در پشت گوه لغزش بحرانی قرار دارد (نه کل طول نیل).',
      'مقاومت پیوستگی qu را بر اساس جدول AASHTO C11.12.5.2 برای نوع خاک انتخاب کرده و با آزمایش صحرایی راستی‌آزمایی کنید.',
    ],
    recommendationsEn: [
      'Drillhole diameter must accommodate duct and centralizers, guaranteeing at least 25 mm outer grout cover.',
      'Effective bond length Lp only includes the bonded length BEHIND the critical slip surface.',
      'Select qu conservatively from AASHTO Table C11.12.5.2 and confirm with pre-production pullout testing.',
    ],
  },
  {
    stepNum: 4,
    titleFa: 'طراحی ابعاد و ضخامت صفحه سر نیل (Bearing Plate)',
    titleEn: 'Bearing Plate Geometry & Thickness',
    parameterNameFa: 'ابعاد صفحه فولادی (B×B)، ضخامت (t) و سوراخ مرکزی',
    parameterNameEn: 'Plate Width (B), Thickness (tplate), and Center Hole',
    standardSymbol: 'Bplate, tplate, Dhole',
    typicalRangeFa: 'ابعاد ۲۰×۲۰ سانتیمتر یا ۲۵×۲۵ سانتیمتر؛ ضخامت ۱.۵ تا ۲.۵ سانتیمتر (۱۵ تا ۲۵ mm)',
    typicalRangeEn: '200×200 mm to 250×250 mm square; thickness 15 to 25 mm',
    designCodeFa: 'FHWA NHI-14-007 فصل ۶ و مبحث دهم مقررات ملی ساختمان',
    designCodeEn: 'FHWA NHI-14-007 Chapter 6 (Structural Facing Design)',
    designImpactFa:
      'صفحه سر نیل مانع از خردشدگی موضعی شاتکریت در زیر مهره شده و نیروی T0 را توزیع می‌کند. ضخامت صفحه باید مانع از تسلیم خمشی طره پلیت شود.',
    designImpactEn:
      'Bearing plate distributes nail head tension T0 to prevent concrete crushing and must resist cantilever bending.',
    recommendationsFa: [
      'سطح اتکای خالص صفحه (Anet = B² - π/4·Dhole²) باید حداقل برابر T0 / (0.7·f\'c) باشد.',
      'قطر سوراخ مرکزی باید حدود ۵ تا ۱۰ میلیمتر بزرگتر از میلگرد یا غلاف انتخاب شود (مثلاً ۴۵ mm).',
      'ضخامت پلیت حداقل از رابطه t = √(6M / Fb) محاسبه شود (معمولاً حداقل ۲۰ میلیمتر برای دیوارهای دائم).',
    ],
    recommendationsEn: [
      'Net bearing area must satisfy Anet ≥ T0 / (0.7·f\'c).',
      'Center hole diameter should be 5-10 mm larger than the tendon bar/duct (e.g. 45 mm).',
      'Plate thickness must satisfy t ≥ √(6M / Fb), typically at least 20 mm for permanent walls.',
    ],
  },
  {
    stepNum: 5,
    titleFa: 'طراحی پوشش موقت شاتکریت و آرماتورهای مش (Initial Shotcrete)',
    titleEn: 'Temporary Shotcrete Facing & Wire Mesh',
    parameterNameFa: 'ضخامت شاتکریت (h) و شبکه آرماتور مش',
    parameterNameEn: 'Shotcrete Thickness (h) & Mesh Grid (avn, ahn)',
    standardSymbol: 'hi, CF, mesh φ@spacing',
    typicalRangeFa: 'ضخامت ۱۰۰ تا ۱۵۰ میلیمتر؛ مش φ8@150×150 mm (355 mm²/m)؛ مقاومت ف\'c=20 MPa',
    typicalRangeEn: 'Thickness 100 to 150 mm; Mesh φ8@150×150 mm (355 mm²/m); f\'c = 20 MPa',
    designCodeFa: 'AASHTO LRFD 11.12.6.2.2 (کنترل خمش و برش پانچینگ)',
    designCodeEn: 'AASHTO LRFD 11.12.6.2.2 (Flexure & Punching Shear)',
    designImpactFa:
      'شاتکریت موقت خاک دیواره را بلافاصله پس از خاکبرداری پایدار نگه می‌دارد. باید در برابر خمش بین نیل‌ها و برش پانچینگ اطراف پلیت مقاوم باشد.',
    designImpactEn:
      'Temporary shotcrete provides immediate support during construction. Checked for flexure and punching shear around plate.',
    recommendationsFa: [
      'برای ضخامت ۱۵۰ میلیمتر، ضریب فشار غیریکنواخت خاک CF برابر ۱.۵ و برای ۱۰۰ میلیمتر برابر ۲.۰ است.',
      'کنترل نسبت ظرفیت به تقاضا (CDR) برای هر دو حالت خمش و برش پانچینگ باید بزرگتر یا مساوی ۱.۰ باشد.',
      'در محل سر نیل برای جلوگیری از ترک‌خوردگی، میلگردهای تقویتی والیر (Waler bars) به کار برده شوند.',
    ],
    recommendationsEn: [
      'Use CF = 1.5 for 150 mm thickness and CF = 2.0 for 100 mm thickness.',
      'Capacity-Demand Ratio (CDR) must exceed 1.0 for both flexural and punching shear modes.',
      'Waler bars behind bearing plate help resist local bending and prevent crack propagation.',
    ],
  },
  {
    stepNum: 6,
    titleFa: 'طراحی پوشش نهایی بتن دائم و گل‌میخ‌ها (Permanent Facing & Studs)',
    titleEn: 'Permanent Concrete Facing & Headed Studs',
    parameterNameFa: 'ضخامت بتن دائم، مقاومت f\'c و تعداد گل‌میخ‌های سر نیل (NH)',
    parameterNameEn: 'Permanent Facing Thickness, f\'c, and Headed Studs (NH)',
    standardSymbol: 'hperm, NH, dhs, fy-hs',
    typicalRangeFa: 'ضخامت ۱۵۰ تا ۲۵۰ میلیمتر بتن مسلح (f\'c=30 MPa)؛ ۴ عدد گل‌میخ φ16 یا φ19 mm',
    typicalRangeEn: '150 to 250 mm reinforced concrete (f\'c = 30 MPa); 4 headed studs φ16 or φ19 mm',
    designCodeFa: 'AASHTO LRFD 11.12.6.2.3 (کنترل کشش گل‌میخ‌های سر نیل)',
    designCodeEn: 'AASHTO LRFD 11.12.6.2.3 (Headed Stud Tensile Resistance)',
    designImpactFa:
      'بتن پوشش دائم طول عمر بیش از ۷۵ تا ۱۰۰ سال را تضمین می‌کند. گل‌میخ‌های جوش شده به پلیت وظیفه انتقال نیروی سر نیل به دیواره بتنی را بر عهده دارند.',
    designImpactEn:
      'Permanent facing ensures a 75-100 year design life. Headed studs transfer nail head tension into the permanent wall.',
    recommendationsFa: [
      'برای پوشش دائم ضریب CF همواره برابر ۱.۰ در نظر گرفته می‌شود.',
      'مقاومت کششی گل‌میخ‌ها RFH = NH · As · fy-hs با ضریب φFH = 0.70 برای پیچ‌های A307 کنترل گردد.',
      'تعبیه لوله‌های زهکش سوراخ‌دار (Weep holes) و نوارهای ژئوکامپوزیت قائم در پشت پوشش الزامی است.',
    ],
    recommendationsEn: [
      'For permanent facings, CF factor is always taken as 1.0.',
      'Stud resistance RFH = NH · As · fy-hs is checked with φFH = 0.70 for A307 studs.',
      'Weep holes and vertical geocomposite strip drains are essential behind permanent walls.',
    ],
  },
  {
    stepNum: 7,
    titleFa: 'ارزیابی آزمایش‌های شیمیایی خاک و انتخاب رده حفاظت خوردگی',
    titleEn: 'Soil Chemical Aggressiveness & Corrosion Protection Class',
    parameterNameFa: 'شاخص‌های pH، مقاومت ویژه، کلریدها، سولفات‌ها و غلاف محافظ',
    parameterNameEn: 'Soil pH, Resistivity, Chlorides, Sulfates & Duct Detailing',
    standardSymbol: 'pH, ρ, Cl⁻, SO₄²⁻, Class A / B',
    typicalRangeFa: 'خاک تهاجمی &larr; کالس A (غلاف موج‌دار PVC یا HDPE)؛ خاک غیرتهاجمی &larr; کالس B (اپوکسی/گالوانیزه)',
    typicalRangeEn: 'Aggressive Soil -> Class A Encapsulation; Non-Aggressive -> Class B Coated Bars',
    designCodeFa: 'AASHTO LRFD 11.12.8 و FHWA NHI-14-007 فصل ۳',
    designCodeEn: 'AASHTO LRFD 11.12.8 & FHWA NHI-14-007 Chapter 3',
    designImpactFa:
      'خوردگی مهم‌ترین عامل شکست بلندمدت دیوارهای نیلینگ است. نقض هر یک از معیارهای ۵ گانه خاک، استفاده از کالس A محصورسازی کامل (DCP) را الزامی می‌کند.',
    designImpactEn:
      'Corrosion is the primary threat to permanent walls. If any soil test criterion fails, Class A full encapsulation (DCP) is mandatory.',
    recommendationsFa: [
      'اگر مقاومت ویژه خاک کمتر از ۳۰۰۰ اهم-سانتی‌متر باشد، خاک قطعاً تهاجمی است و کلاس A اجباری است.',
      'ضخامت غلاف PVC حداقل ۱.۰ میلیمتر (40 mil) و غلاف HDPE حداقل ۱.۵ میلیمتر (60 mil) باشد.',
      'قطر داخلی غلاف باید حداقل ۱۰ میلیمتر (۰.۴ اینچ) بزرگتر از قطر میلگرد نیل باشد.',
      'سنترالایزرهای داخلی و خارجی در فواصل حداکثر ۳.۰ متر برای حفظ هم‌مرکزی نصب شوند.',
    ],
    recommendationsEn: [
      'If soil resistivity is below 3000 ohm-cm, the site is classified Aggressive -> Class A is mandatory.',
      'Corrugated PVC duct wall must be ≥ 1.0 mm (40 mil); HDPE duct must be ≥ 1.5 mm (60 mil).',
      'Duct inside diameter must be at least 10 mm (0.4 in) larger than rebar diameter.',
      'Internal and external centralizers must be spaced at intervals not exceeding 3.0 m (10 ft).',
    ],
  },
];

export const StepByStepGuide: React.FC<Props> = ({ lang, onApplyPreset }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const isFa = lang === 'fa';

  const step = STEPS_DATA[currentStepIndex];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Top Header */}
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
            {step.stepNum}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              {isFa ? step.titleFa : step.titleEn}
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              {isFa ? `گام ${step.stepNum} از ${STEPS_DATA.length} — مرجع: ${step.designCodeFa}` : `Step ${step.stepNum} of ${STEPS_DATA.length} — Code: ${step.designCodeEn}`}
            </p>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            disabled={currentStepIndex === 0}
            onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 flex items-center gap-1"
          >
            {isFa ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{isFa ? 'گام قبلی' : 'Previous'}</span>
          </button>

          <button
            disabled={currentStepIndex === STEPS_DATA.length - 1}
            onClick={() => setCurrentStepIndex((prev) => Math.min(STEPS_DATA.length - 1, prev + 1))}
            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 disabled:opacity-40 flex items-center gap-1"
          >
            <span>{isFa ? 'گام بعدی' : 'Next'}</span>
            {isFa ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Step Pills Navigation Strip */}
      <div className="px-5 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs">
        {STEPS_DATA.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentStepIndex(idx)}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition font-semibold text-xs flex items-center gap-1.5 ${
              idx === currentStepIndex
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <span className="text-[10px] opacity-80">{s.stepNum}.</span>
            <span>{isFa ? s.parameterNameFa : s.parameterNameEn}</span>
          </button>
        ))}
      </div>

      {/* Main Body */}
      <div className="p-6 space-y-6">
        {/* Key Parameter Facts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="text-slate-400 font-semibold">{isFa ? 'علامت در آیین‌نامه:' : 'Code Symbol:'}</span>
            <div className="font-mono font-bold text-sm text-blue-700">{step.standardSymbol}</div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="text-slate-400 font-semibold">{isFa ? 'محدوده متداول مهندسی:' : 'Typical Safe Range:'}</span>
            <div className="font-bold text-slate-800">{isFa ? step.typicalRangeFa : step.typicalRangeEn}</div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="text-slate-400 font-semibold">{isFa ? 'مرجع مستقیم استاندارد:' : 'Code Standard:'}</span>
            <div className="font-medium text-slate-800">{isFa ? step.designCodeFa : step.designCodeEn}</div>
          </div>
        </div>

        {/* Design Impact Section */}
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
          <h3 className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <span>{isFa ? 'تأثیر این پارامتر بر طراحی و رفتار سازه نیلینگ:' : 'Influence on Design & Stability:'}</span>
          </h3>
          <p className="text-xs text-blue-900 leading-relaxed">
            {isFa ? step.designImpactFa : step.designImpactEn}
          </p>
        </div>

        {/* Practical Engineering Recommendations */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{isFa ? 'توصیه‌های کاربردی و ضوابط آیین‌نامه‌ای انتخاب پارامتر:' : 'Engineering Recommendations:'}</span>
          </h3>

          <ul className="space-y-2">
            {(isFa ? step.recommendationsFa : step.recommendationsEn).map((rec, i) => (
              <li
                key={i}
                className="p-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 flex items-start gap-2.5 shadow-2xs"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
