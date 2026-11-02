/**
 * Technical References, Theory Fundamentals & Bilingual Glossary Component
 * (AASHTO LRFD 2020 & FHWA-NHI-14-007)
 */
import React, { useState } from 'react';
import { Language } from '../types/nailing';
import { TRANSLATIONS } from '../utils/translations';
import {
  BookOpen,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Bookmark,
  Languages,
  Check,
} from 'lucide-react';

interface Props {
  lang: Language;
}

interface ReferenceItem {
  id: string;
  title: string;
  publisher: string;
  year: string;
  codeNumber: string;
  scopeEn: string;
  scopeFa: string;
  keySections: string[];
  relevanceEn: string;
  relevanceFa: string;
}

const REFERENCES_DATA: ReferenceItem[] = [
  {
    id: 'aashto-2020',
    title: 'AASHTO LRFD Bridge Design Specifications (US 9th Edition)',
    publisher: 'American Association of State Highway and Transportation Officials (AASHTO)',
    year: '2020',
    codeNumber: 'AASHTO LRFD-9',
    scopeEn: 'Governing standard for LRFD structural and geotechnical design of highway structures, retaining walls, and soil nail systems in the USA and international practice.',
    scopeFa: 'آیین‌نامه حاکم بر طراحی سازه‌ای و ژئوتکنیکی سازه‌های بزرگراهی، دیوارهای حائل و سیستم‌های میخ‌کوبی به روش حالات حدی LRFD.',
    keySections: [
      'Section 11.12: Soil Nail Walls (Design criteria, limit states, stability)',
      'Section 11.5.7: Resistance Factors (Table 11.5.7-1 for tension, pullout, facing flexure, punching, studs)',
      'Section 3.4.1: Permanent Load Factors (Table 3.4.1-2: gamma_p-EV = 1.35)',
      'Section 11.12.8: Corrosion Protection Requirements (Class A encapsulation vs Class B)',
    ],
    relevanceEn: 'Direct source for all resistance factors (phi), earth pressure load factor (1.35), facing formulas, and corrosion classification thresholds in this application.',
    relevanceFa: 'مرجع مستقیم کلیه ضرایب مقاومت (φ)، ضریب بارگذاری فشار خاک (۱.۳۵)، فرمول‌های طراحی پوشش و معیارهای ارزیابی خوردگی خاک در این اپلیکیشن.',
  },
  {
    id: 'fhwa-2015',
    title: 'Soil Nail Walls Reference Manual (Geotechnical Engineering Circular No. 7)',
    publisher: 'Federal Highway Administration (FHWA)',
    year: '2015',
    codeNumber: 'FHWA-NHI-14-007 / GEC 7',
    scopeEn: 'Comprehensive FHWA manual covering design, analysis, construction, testing, and corrosion mitigation for permanent and temporary soil nail walls.',
    scopeFa: 'کتابچه مرجع جامع اداره فدرال بزرگراه‌های آمریکا شامل مبانی کامل تحلیل تعادل حدی، طراحی سازه‌ای اجزا، جزئیات اجرایی، آزمایش‌ها و حفاظت خوردگی.',
    keySections: [
      'Chapter 5: Wall Design Analysis & Preliminary Nail Load Formulas (Eq 5.1 & Eq 5.2.1b)',
      'Chapter 6: Structural Facing Design (Flexure, Punching Shear, Headed Studs)',
      'Chapter 3 & Appendix C: Corrosion Protection Systems (DCP encapsulation details)',
      'Appendix E: Standard Specifications and Construction Guidelines',
    ],
    relevanceEn: 'Source for the Clouterre nail head tension distribution formula T0, empirical bond strength tables qu, and bearing plate cantilever bending mechanics.',
    relevanceFa: 'مرجع فرمول کلوتر نیروی سر نیل (T0)، جداول تجربی مقاومت پیوستگی دوغاب (qu) و مکانیک طراحی خمش طره صفحه سر نیل.',
  },
  {
    id: 'clouterre-1991',
    title: 'French National Research Project Recommendations (Clouterre)',
    publisher: 'Presses de l\'Ecole Nationale des Ponts et Chaussees',
    year: '1991',
    codeNumber: 'Clouterre 1991',
    scopeEn: 'Pioneering full-scale experimental program on soil-nailed structures that established the global empirical foundation for modern soil nailing practice.',
    scopeFa: 'پروژه ملی تحقیقاتی فرانسه (کلوتر) شامل آزمایش‌های تمام مقیاس ابزاربندی شده که سنگ‌بنای تجربی استانداردهای بین‌المللی نیلینگ شد.',
    keySections: [
      'Nail Head Tensile Force Ratio (T0 / Tmax) based on horizontal and vertical spacing',
      'Yield-line patterns in shotcrete facings and soil arching behavior',
    ],
    relevanceEn: 'Formulated the widely used T0 equation: T0 = Tmax [0.6 + 0.2(Smax - 1)].',
    relevanceFa: 'ارائه‌دهنده رابطه بنیادین نیروی سر میخ T0 بر اساس بیشترین فاصله نیل‌ها.',
  },
  {
    id: 'astm-rebar',
    title: 'ASTM A615 / A706 Standards for Steel Reinforcement & ASTM A775 / A153 Coatings',
    publisher: 'ASTM International',
    year: '2022',
    codeNumber: 'ASTM A615 / A706 / A775 / A153',
    scopeEn: 'Standard specifications for deformed carbon-steel rebar, low-alloy weldable bars, fusion-bonded epoxy coatings, and hot-dip zinc galvanizing.',
    scopeFa: 'استانداردهای بین‌المللی مشخصات فنی میلگردهای آجدار فولادی، میلگردهای جوش‌پذیر، پوشش اپوکسی الکترواستاتیک و گالوانیزه گرم.',
    keySections: [
      'Tensile yield properties for Grade 60 (420 MPa) and Grade 75 (520 MPa)',
      'ASTM A775: Fusion-bonded epoxy coating thickness (7 to 12 mils / 0.178 - 0.305 mm)',
      'ASTM A153: Minimum zinc coating weight (2.0 oz/ft2 / ~3.4 mils)',
    ],
    relevanceEn: 'Provides material properties and coating verification rules for Class B corrosion protection.',
    relevanceFa: 'تأمین‌کننده مشخصات مکانیکی فولاد و الزامات پوشش‌های اپوکسی و گالوانیزه کلاس B.',
  },
  {
    id: 'aci-shotcrete',
    title: 'ACI 506R: Guide to Shotcrete & ACI 318: Building Code Requirements',
    publisher: 'American Concrete Institute (ACI)',
    year: '2019',
    codeNumber: 'ACI 506R-16 / ACI 318-19',
    scopeEn: 'Guidelines for dry-mix and wet-mix shotcrete application, compressive strength development, welded wire mesh encapsulation, and structural concrete checks.',
    scopeFa: 'راهنمای طراحی و اجرای شاتکریت تر و خشک، مقاومت فشاری ۲۸ روزه، جایگذاری شبکه مش و بتن‌ریزی پوسته نهایی.',
    keySections: [
      'Compressive strength criteria (f\'c = 20 - 35 MPa for temporary and permanent facings)',
      'Rebar and mesh clear cover, rebound control, and consolidation around nail plates',
    ],
    relevanceEn: 'Provides guidelines for temporary shotcrete thickness and wire mesh reinforcement areas.',
    relevanceFa: 'مرجع ضخامت اجرایی شاتکریت موقت و شبکه‌های مش آرماتور.',
  },
];

interface GlossaryTerm {
  en: string;
  fa: string;
  defEn: string;
  defFa: string;
  reference: string;
}

const GLOSSARY_DATA: GlossaryTerm[] = [
  {
    en: 'Nail Tendon',
    fa: 'میلگرد نیل (تاندون)',
    defEn: 'The central steel rebar or threadbar placed in the drillhole that carries tensile load from the unstable soil mass to the stable ground behind.',
    defFa: 'میلگرد آجدار فولادی یا میلگرد رزوه‌دار پرمقاومت در مرکز گمانه که نیروی کششی ناشی از گوه‌لغزش را به خاک پایدار پشت دیواره منتقل می‌کند.',
    reference: 'AASHTO 11.12.6.1',
  },
  {
    en: 'Drillhole Borehole (DD)',
    fa: 'گمانه حفاری (سوراخ گمانه)',
    defEn: 'The circular hole drilled into soil or rock (typically 100 to 150 mm) in which the nail tendon and cement grout are installed.',
    defFa: 'سوراخ استوانه‌ای حفر شده در زمین (معمولاً ۱۰۰ الی ۱۵۰ میلیمتر) که میلگرد و دوغاب سیمانی در آن جایگذاری می‌شوند.',
    reference: 'FHWA NHI-14-007 Ch. 5',
  },
  {
    en: 'Grout-Ground Bond Strength (qu)',
    fa: 'مقاومت پیوستگی دوغاب و زمین',
    defEn: 'The ultimate shear stress capacity mobilized along the cylindrical interface between the cement grout and surrounding ground.',
    defFa: 'حداکثر مقاومت برشی اصطکاکی نهایی در سطح تماس استوانه‌ای بین دوغاب سیمان و توده خاک یا سنگ دیواره گمانه.',
    reference: 'AASHTO C11.12.5.2',
  },
  {
    en: 'Effective Bond Length (Lp)',
    fa: 'طول مؤثر پیوستگی پشت سطح گسیختگی',
    defEn: 'The portion of the nail length located behind the potential critical failure surface that contributes to pullout anchorage.',
    defFa: 'طول مفید نیل که در توده خاک پایدار در پشت گوه لغزش بحرانی قرار داشته و ظرفیت بیرون‌کشیدگی را تأمین می‌کند.',
    reference: 'AASHTO 11.12.5.2',
  },
  {
    en: 'Bearing Plate',
    fa: 'صفحه سر نیل (پلیت اتکایی)',
    defEn: 'A square structural steel plate mounted on the nail head that transfers nail tensile reaction force (T0) uniformly to the shotcrete facing.',
    defFa: 'ورق فولادی مربعی در سر میخ که نیروی کششی سر نیل (T0) را به صورت تنش اتکایی یکنواخت به پوسته بتنی یا شاتکریت منتقل می‌سازد.',
    reference: 'FHWA NHI-14-007 Ch. 6',
  },
  {
    en: 'Initial / Temporary Facing',
    fa: 'پوشش اولیه (شاتکریت موقت)',
    defEn: 'A layer of pneumatic shotcrete (typically 100 to 150 mm thick) reinforced with welded wire mesh, installed immediately after excavation to retain soil between nails.',
    defFa: 'لایه‌ای از بتن پاششی (شاتکریت) مسلح به شبکه مش فولادی که بلافاصله پس از خاکبرداری هر مرحله برای حفظ خاک بین نیل‌ها اجرا می‌شود.',
    reference: 'AASHTO 11.12.6.2',
  },
  {
    en: 'Final / Permanent Facing',
    fa: 'پوشش نهایی (بتن دائم)',
    defEn: 'A cast-in-place or precast reinforced concrete wall (typically 150 to 250 mm thick) constructed for long-term structural durability and aesthetic finish.',
    defFa: 'دیواره بتن مسلح درجا یا پیش‌ساخته با ضخامت ۱۵۰ الی ۲۵۰ میلیمتر که برای تأمین پایایی بلندمدت، زیبایی و مقاومت دائمی روی شاتکریت اجرا می‌شود.',
    reference: 'AASHTO 11.12.6.2',
  },
  {
    en: 'Punching Shear Failure',
    fa: 'گسیختگی برش پانچینگ (سوراخ‌شدگی)',
    defEn: 'A brittle failure mode where the bearing plate punches through the shotcrete facing forming a truncated 45-degree conical failure surface.',
    defFa: 'حالت شکست برشی که در آن صفحه فولادی سر نیل به صورت مخروطی با زاویه حدود ۴۵ درجه پوسته شاتکریت را سوراخ کرده و به درون فرو می‌رود.',
    reference: 'AASHTO 11.12.6.2.2',
  },
  {
    en: 'Headed Studs',
    fa: 'گل‌میخ‌های سر پهن',
    defEn: 'Shear studs with enlarged heads welded to the bearing plate, embedded in the permanent concrete facing to transfer nail head tension into the permanent structure.',
    defFa: 'میله‌های فولادی سرپهن که روی صفحه سر نیل جوش داده شده و درون بتن پوشش دائم مدفون می‌شوند تا نیروی کششی را به پوسته نهایی منتقل کنند.',
    reference: 'AASHTO 11.12.6.2.3',
  },
  {
    en: 'Waler Reinforcing Bars',
    fa: 'آرماتورهای نواری والیر',
    defEn: 'Horizontal and vertical reinforcing bars placed directly behind or over the bearing plate to provide extra moment capacity and avoid local cracking.',
    defFa: 'میلگردهای تقویتی افقی و قائم که در محل سر نیل در پوسته شاتکریت تعبیه می‌شوند تا ظرفیت خمشی موضعی سر نیل را ارتقا دهند.',
    reference: 'FHWA NHI-14-007 Fig 6.1',
  },
  {
    en: 'Class A Encapsulation (DCP)',
    fa: 'محصورسازی کامل کلاس A (حفاظت دوگانه)',
    defEn: 'A double corrosion protection system where the nail tendon is completely sealed inside a corrugated PVC or HDPE duct filled with cement grout.',
    defFa: 'سیستم حفاظت دوگانه خوردگی که در آن میلگرد به طور کامل درون یک غلاف موج‌دار PVC یا HDPE پر شده از دوغاب سیمانی قرار می‌گیرد.',
    reference: 'AASHTO 11.12.8',
  },
  {
    en: 'Class B Corrosion Protection',
    fa: 'حفاظت خوردگی کلاس B (میلگرد پوشش‌دار)',
    defEn: 'Corrosion protection for non-aggressive soils using fusion-bonded epoxy coating or hot-dip galvanizing on the rebar with at least 25 mm grout cover.',
    defFa: 'حفاظت خوردگی برای خاک‌های غیرتهاجمی با استفاده از پوشش اپوکسی یا گالوانیزه گرم میلگرد به همراه حداقل ۲۵ میلیمتر پوشش دوغاب سیمانی.',
    reference: 'AASHTO 11.12.8',
  },
  {
    en: 'Capacity-Demand Ratio (CDR)',
    fa: 'نسبت ظرفیت به تقاضا (CDR)',
    defEn: 'The ratio of factored nominal resistance to factored demand (phi * R / gamma * S). A CDR >= 1.0 indicates structural adequacy per LRFD.',
    defFa: 'نسبت مقاومت طراحی ضریب‌دار به بار ضریب‌دار طرح. مقدار CDR بزرگتر یا مساوی ۱.۰ نشان‌دهنده کفایت و تأمین ضوابط آیین‌نامه است.',
    reference: 'AASHTO Section 11',
  },
  {
    en: 'Centralizer (Spacer)',
    fa: 'سنترالایزر (فاصله‌نگه‌دار مرکزی)',
    defEn: 'Plastic or steel spacers attached along the nail length at maximum 3 m intervals to center the bar/duct inside the borehole and guarantee uniform grout cover.',
    defFa: 'قطعات فاصله‌نگه‌دار پلاستیکی که در فواصل حداکثر ۳ متری روی میلگرد و غلاف نصب می‌شوند تا هم‌مرکزی در گمانه و یکنواختی پوشش دوغاب تضمین گردد.',
    reference: 'FHWA NHI-14-007 Ch. 8',
  },
  {
    en: 'Soil Electrical Resistivity (ρ)',
    fa: 'مقاومت ویژه الکتریکی خاک',
    defEn: 'A key electrochemical indicator of soil corrosiveness. AASHTO sets rho >= 3000 ohm-cm for non-aggressive soil; below 3000 ohm-cm indicates an aggressive soil.',
    defFa: 'شاخص الکتروشیمیایی خورندگی خاک. آیین‌نامه مقدار بیشتر از ۳۰۰۰ اهم-سانتی‌متر را شرط محیط غیرتهاجمی می‌داند؛ مقادیر کمتر تهاجمی محسوب می‌شوند.',
    reference: 'AASHTO 11.12.8',
  },
  {
    en: 'Soil Arching / Non-Uniform Factor (CF)',
    fa: 'ضریب فشار غیریکنواخت خاک (قوس‌زدگی)',
    defEn: 'A correction factor accounting for non-uniform earth pressure distribution behind the facing due to soil arching between nails.',
    defFa: 'ضریب تصحیح اثر قوس‌زدگی خاک در پشت پوسته شاتکریت که بسته به ضخامت پوسته بین ۱.۰ تا ۲.۰ متغیر است.',
    reference: 'AASHTO Table 11.12.6.2.2-1',
  },
];

export const TechnicalReferencesAndGlossary: React.FC<Props> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'references' | 'glossary'>('theory');
  const [expandedRef, setExpandedRef] = useState<string | null>('aashto-2020');
  const [searchTerm, setSearchTerm] = useState('');

  const isFa = lang === 'fa';

  const filteredGlossary = GLOSSARY_DATA.filter(
    (item) =>
      item.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.defEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.defFa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>{isFa ? 'مبانی تئوری، مراجع استاندارد و واژه‌نامه فنی تخصصی' : 'Theoretical Fundamentals, References & Technical Glossary'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isFa
              ? 'مستندات مرجع آیین‌نامه‌ای AASHTO LRFD (2020) و FHWA-NHI-14-007 به همراه تعاریف و اصطلاحات دو زبانه'
              : 'Official references, design theory equations, and bilingual technical glossary'}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="bg-white border border-slate-200 rounded-lg p-0.5 flex text-xs">
          <button
            onClick={() => setActiveTab('theory')}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${
              activeTab === 'theory' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isFa ? '۱. خلاصه مبانی تئوری' : '1. Theory Fundamentals'}
          </button>
          <button
            onClick={() => setActiveTab('references')}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${
              activeTab === 'references' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isFa ? '۲. مراجع اصلی استاندارد' : '2. Key References'}
          </button>
          <button
            onClick={() => setActiveTab('glossary')}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${
              activeTab === 'glossary' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isFa ? '۳. واژه‌نامه تخصصی (دو زبانه)' : '3. Bilingual Glossary'}
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* TAB 1: THEORY FUNDAMENTALS */}
        {activeTab === 'theory' && (
          <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
            {/* Box 1: LRFD Methodology */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-indigo-600" />
                <span>{isFa ? '۱. فلسفه طراحی بر اساس روش حالات حدی LRFD' : '1. LRFD Limit States Design Philosophy'}</span>
              </h3>
              <p>
                {isFa
                  ? 'بر خلاف روش سنتی تنش مجاز (ASD) که تنها از یک ضریب اطمینان کلی استفاده می‌کرد، در استاندارد AASHTO LRFD (ویرایش نهم، ۲۰۲۰) عدم قطعیت بارها و مقاومت‌ها به طور جداگانه با ضرایب آماری فرموله می‌شوند:'
                  : 'Unlike traditional Allowable Stress Design (ASD), AASHTO LRFD accounts for statistical uncertainties in loads and materials separately:'}
              </p>
              <div className="p-3 bg-white border border-slate-200 rounded-lg text-center font-mono text-xs font-bold text-slate-800">
                φ · Rn ≥ Σ (γi · Qi) &nbsp;&implies;&nbsp; CDR = (φ · Rn) / (γ · Q) ≥ 1.00
              </div>
              <p className="text-[11px] text-slate-500">
                {isFa
                  ? 'که در آن γi ضرایب بارگذاری، Qi بارهای اثرگذار، Rn مقاومت اسمی و φ ضریب کاهش مقاومت عضو است. ضریب بار فشار قائم خاک برای دیوارهای میخ‌کوبی شده بر اساس جدول AASHTO Table 3.4.1-2 برابر γp-EV = 1.35 است.'
                  : 'Where γi are load factors, Qi are load demands, Rn is nominal resistance, and φ is the resistance factor. The earth pressure load factor for soil nails per Table 3.4.1-2 is γp-EV = 1.35.'}
              </p>
            </div>

            {/* Box 2: Internal Stability Limit States */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
                <h4 className="font-bold text-blue-950 text-xs flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>{isFa ? 'الف) تسلیم کششی میلگرد نیل (Tendon Tension)' : 'A) Nail Tendon Tensile Yield'}</span>
                </h4>
                <p>
                  {isFa
                    ? 'تسلیم کششی میلگرد فولادی بدون لحاظ سهم دوغاب سیمانی محاسبه می‌شود (AASHTO 11.12.6.1):'
                    : 'Nominal tensile strength is based strictly on steel rebar cross-section without grout contribution:'}
                </p>
                <div className="p-2 bg-white rounded font-mono font-bold text-center text-blue-900 border border-blue-200">
                  φT · RT ≥ γp-EV · Tmaxsn &nbsp;|&nbsp; RT = As · fy
                </div>
                <p className="text-[11px] text-blue-800">
                  {isFa
                    ? 'ضریب مقاومت φT بر اساس جدول 11.5.7-1 برای فولاد معمولی 0.75 و فولاد پرمقاومت 0.65 است.'
                    : 'Resistance factor φT is 0.75 for mild steel and 0.65 for high-strength steel.'}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 space-y-2">
                <h4 className="font-bold text-teal-950 text-xs flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-teal-600" />
                  <span>{isFa ? 'ب) مقاومت بیرون‌کشیدگی دوغاب (Pullout Resistance)' : 'B) Grout-Ground Pullout Resistance'}</span>
                </h4>
                <p>
                  {isFa
                    ? 'انتقال بار از دوغاب به خاک در طول مؤثر نیل در پشت سطح گسیختگی بحرانی (AASHTO 11.12.5.2):'
                    : 'Load transfer from cement grout to ground along effective bond length Lp behind failure plane:'}
                </p>
                <div className="p-2 bg-white rounded font-mono font-bold text-center text-teal-900 border border-teal-200">
                  φPO · RPO ≥ γp-EV · Tmaxsn &nbsp;|&nbsp; RPO = π · DD · Lp · qu
                </div>
                <p className="text-[11px] text-teal-800">
                  {isFa
                    ? 'ضریب مقاومت φPO برابر 0.65 است. مقاومت پیوستگی qu از جداول تجربی یا آزمون کشش تعیین می‌شود.'
                    : 'Resistance factor φPO = 0.65. Bond strength qu comes from presumptive tables or pullout tests.'}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
                <h4 className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>{isFa ? 'ج) خمش و برش پانچینگ پوسته شاتکریت' : 'C) Facing Flexure & Punching Shear'}</span>
                </h4>
                <p>
                  {isFa
                    ? 'پوسته شاتکریت تحت اثر نیروی سر نیل (T0) کنترل می‌شود (AASHTO 11.12.6.2.2):'
                    : 'Facing is checked against nail head tension T0 computed per Clouterre formula:'}
                </p>
                <div className="p-2 bg-white rounded font-mono font-bold text-center text-amber-900 border border-amber-200">
                  RFF = 0.0038 · CF · Fy · F &nbsp;|&nbsp; VF = 330 √f\'c π Dc\' hc
                </div>
                <p className="text-[11px] text-amber-800">
                  {isFa
                    ? 'ضریب تصحیح CF اثر قوس‌زدگی خاک را اعمال می‌کند و Dc\' = LPB + hi قطر قاعده مخروط گسیختگی پانچ ۴۵ درجه است.'
                    : 'CF factor accounts for soil arching. Dc\' is the critical punching shear cone diameter.'}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <h4 className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>{isFa ? 'د) حفاظت خوردگی نیل‌های دائم (Corrosion Protection)' : 'D) Permanent Corrosion Encapsulation'}</span>
                </h4>
                <p>
                  {isFa
                    ? 'ارزیابی بر اساس مشخصات الکتروشیمیایی خاک (AASHTO 11.12.8 & FHWA GEC 7):'
                    : 'Evaluation based on electrochemical laboratory testing of site soil:'}
                </p>
                <div className="p-2 bg-white rounded text-[11px] text-emerald-900 border border-emerald-200 space-y-1">
                  <div>• خاک غیرتهاجمی: pH بین ۵ تا ۱۰، مقاومت ویژه ≥ ۳۰۰۰ Ω·cm، کلرید ≤ ۱۰۰ ppm، سولفات ≤ ۲۰۰ ppm</div>
                  <div>• خاک تهاجمی: نقض هر یک از شرایط فوق &larr; الزام محصورسازی کامل با غلاف موج‌دار (کلاس A)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KEY REFERENCES */}
        {activeTab === 'references' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              {isFa
                ? 'لیست مراجع معتبر فنی و استانداردهای طراحی مورد استفاده در محاسبات نرم‌افزار. برای مشاهده بندها و جزئیات روی هر مرجع کلیک کنید:'
                : 'Click any reference to expand detailed code clauses, chapter references, and design scope:'}
            </p>

            <div className="space-y-3">
              {REFERENCES_DATA.map((ref) => {
                const isExpanded = expandedRef === ref.id;
                return (
                  <div
                    key={ref.id}
                    className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-white"
                  >
                    <div
                      onClick={() => setExpandedRef(isExpanded ? null : ref.id)}
                      className="p-4 bg-slate-50/70 hover:bg-slate-100/70 cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {ref.year}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900">{ref.title}</div>
                          <div className="text-[11px] text-slate-500">
                            {ref.publisher} — <span className="font-mono">{ref.codeNumber}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 border-t border-slate-200 bg-white space-y-3 text-xs">
                        <div>
                          <span className="font-bold text-slate-800">{isFa ? 'دامنه کاربرد و محتوا:' : 'Scope & Overview:'}</span>
                          <p className="text-slate-600 mt-0.5">{isFa ? ref.scopeFa : ref.scopeEn}</p>
                        </div>

                        <div>
                          <span className="font-bold text-slate-800">{isFa ? 'بندها و فصل‌های کلیدی:' : 'Key Sections:'}</span>
                          <ul className="list-disc list-inside mt-1 space-y-1 text-slate-600">
                            {ref.keySections.map((sec, i) => (
                              <li key={i} className="font-mono text-[11px]">{sec}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-2.5 rounded-lg bg-indigo-50/60 text-indigo-900 border border-indigo-100">
                          <strong>{isFa ? 'کاربرد در این اپلیکیشن:' : 'Relevance to this App:'} </strong>
                          <span>{isFa ? ref.relevanceFa : ref.relevanceEn}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: BILINGUAL GLOSSARY */}
        {activeTab === 'glossary' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder={isFa ? 'جستجو در اصطلاحات فارسی یا انگلیسی...' : 'Search English or Persian terms...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="text-xs text-slate-500 font-medium">
                {isFa ? `تعداد اصطلاحات: ${filteredGlossary.length}` : `Terms: ${filteredGlossary.length}`}
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[500px] overflow-y-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead className="bg-slate-100 font-bold text-slate-700 sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-1/4">{isFa ? 'اصطلاح انگلیسی (English)' : 'English Term'}</th>
                    <th className="p-3 w-1/4">{isFa ? 'معادل فارسی (Persian)' : 'Persian Equivalent'}</th>
                    <th className="p-3 w-2/5">{isFa ? 'تعریف و توضیح فنی' : 'Definition'}</th>
                    <th className="p-3 w-1/10 text-center">{isFa ? 'مرجع' : 'Ref'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredGlossary.map((g, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-semibold text-blue-900 font-mono text-[11px]">{g.en}</td>
                      <td className="p-3 font-bold text-slate-800">{g.fa}</td>
                      <td className="p-3 text-slate-600 leading-normal">
                        {isFa ? g.defFa : g.defEn}
                      </td>
                      <td className="p-3 text-center font-mono text-[10px] text-slate-400 whitespace-nowrap">
                        {g.reference}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
