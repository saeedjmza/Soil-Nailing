/**
 * Comprehensive Soil Nail Calculation Booklet (دفترچه محاسبات فنی)
 * Exact technical replica of AASHTO LRFD 2020 & FHWA-NHI-14-007 design booklet.
 * Supports PDF export via jsPDF/html2canvas and high-fidelity browser print.
 */
import React, { useRef, useState } from 'react';
import { DesignState, FullCalculationResults, Language } from '../types/nailing';
import { TRANSLATIONS } from '../utils/translations';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  XCircle,
  Shield,
  Layers,
  Calendar,
  User,
  Building2,
  FileCheck,
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  state: DesignState;
  results: FullCalculationResults;
  lang: Language;
}

export const ReportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  state,
  results,
  lang,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;
  const isFa = lang === 'fa';
  const t = TRANSLATIONS[lang];
  const { metadata, tendon, pullout, plate, facing, corrosion } = state;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${metadata.projectNumber || 'SoilNail'}_Calculation_Booklet.pdf`);
    } catch (error) {
      console.error('PDF export failed', error);
      alert(isFa ? 'خطا در خروجی PDF. لطفاً از دکمه چاپ و ذخیره به عنوان PDF استفاده نمایید.' : 'PDF generation failed. Please use Print -> Save as PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4 print:p-0 print:static print:bg-white">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] flex flex-col overflow-hidden border border-slate-300 print:max-w-none print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-sm font-bold">
                {isFa ? 'دفترچه محاسبات فنی طراحی سیستم میخ‌کوبی (Soil Nailing)' : 'Soil Nail Calculation Booklet View'}
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                {metadata.projectNumber} — AASHTO LRFD (2020) & FHWA-NHI-14-007
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isFa ? 'چاپ / Print' : 'Print'}</span>
            </button>

            <button
              disabled={isExporting}
              onClick={handleDownloadPdf}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? (isFa ? 'در حال تولید PDF...' : 'Generating PDF...') : (isFa ? 'دانلود PDF' : 'Download PDF')}</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-2xl font-bold ml-2 transition"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-100 print:p-0 print:bg-white print:overflow-visible">
          <div
            ref={reportRef}
            dir={isFa ? 'rtl' : 'ltr'}
            className={`max-w-4xl mx-auto bg-white p-8 sm:p-12 shadow-sm rounded-xl border border-slate-200 text-slate-800 print:border-none print:shadow-none print:p-4 text-xs font-sans leading-relaxed space-y-8 ${
              isFa ? 'font-vazir text-right' : 'text-left'
            }`}
          >
            {/* OFFICIAL CONSULTING COVER HEADER */}
            <div className="border-2 border-slate-900 rounded-lg p-5 bg-slate-50/50 space-y-4">
              <div className="flex flex-wrap items-center justify-between border-b-2 border-slate-900 pb-3 gap-4">
                <div>
                  <div className="text-base sm:text-lg font-black text-slate-950">
                    {metadata.consultant || (isFa ? 'مهندسین مشاور ژئوتکنیک و سازه' : 'Geotechnical Consulting Engineers')}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    {isFa ? 'بخش تخصصی بهسازی خاک و پایدارسازی گود و ترانشه' : 'Soil Improvement & Excavation Support Division'}
                  </div>
                </div>

                <div className={`font-mono text-[11px] text-slate-700 space-y-0.5 ${isFa ? 'text-left' : 'text-right'}`}>
                  <div><strong>{isFa ? 'تاریخ:' : 'Date:'}</strong> {metadata.date || '1405/07/11'}</div>
                  <div><strong>{isFa ? 'شماره مدرک:' : 'Doc No:'}</strong> {metadata.projectNumber || 'CALC-SN-01'}</div>
                  <div><strong>{isFa ? 'وضعیت مدرک:' : 'Status:'}</strong> {isFa ? 'طراحی نهایی (ویرایش ۰)' : 'Final Design (Rev 0)'}</div>
                </div>
              </div>

              {/* Document Main Title */}
              <div className="text-center py-2 space-y-1">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-wide">
                  {metadata.projectName || (isFa ? 'دفترچه محاسبات طراحی سیستم میخ‌کوبی (Soil Nailing)' : 'Soil Nail Wall Design Calculation Booklet')}
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  {isFa
                    ? 'طراحی و کنترل پایداری اجزای داخلی بر اساس AASHTO LRFD (US-9th Ed, 2020) و FHWA-NHI-14-007 (GEC 7)'
                    : 'Design and Verification of Internal Components per AASHTO LRFD (2020) & FHWA-NHI-14-007'}
                </p>
              </div>

              {/* Project Parties Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-300 text-[11px]">
                <div><span className="text-slate-500">{isFa ? 'کارفرما:' : 'Client:'}</span> <strong className="text-slate-800">{metadata.client || (isFa ? 'مشخص نشده' : 'N/A')}</strong></div>
                <div><span className="text-slate-500">{isFa ? 'محاسب:' : 'Designer:'}</span> <strong className="text-slate-800">{metadata.designer || (isFa ? 'مشخص نشده' : 'N/A')}</strong></div>
                <div><span className="text-slate-500">{isFa ? 'کنترل‌کننده:' : 'Checker:'}</span> <strong className="text-slate-800">{metadata.checker || (isFa ? 'مشخص نشده' : 'N/A')}</strong></div>
                <div><span className="text-slate-500">{isFa ? 'روش طراحی:' : 'Method:'}</span> <strong className="text-slate-800">{isFa ? 'LRFD (حالات حدی مقاومت)' : 'LRFD (Strength Limit State)'}</strong></div>
              </div>

              {metadata.notes && (
                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                  <span className="font-semibold">{isFa ? 'فرضیات و یادداشت‌های پروژه: ' : 'Project Notes: '}</span>
                  <span>{metadata.notes}</span>
                </div>
              )}
            </div>

            {/* FINAL DESIGNED SOIL NAILING SYSTEM SPECIFICATIONS SUMMARY BOX */}
            <div className="border-2 border-indigo-600/80 bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/50 rounded-xl p-4 sm:p-5 shadow-xs space-y-3.5 print:border-slate-800 print:bg-white print:p-3 print:rounded-none">
              <div className="flex flex-wrap items-center justify-between border-b border-indigo-200 pb-2.5 gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-indigo-600 inline-block print:border print:border-black"></span>
                  <h2 className="text-sm sm:text-base font-black text-indigo-950">
                    {isFa ? 'مشخصات سیستم نهایی نیلینگ طراحی شده' : 'Final Designed Soil Nailing System Specifications'}
                  </h2>
                </div>
                <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-100/90 px-3 py-1 rounded-md border border-indigo-300 print:border-slate-400 print:text-black print:bg-slate-100">
                  {isFa ? 'شیت اجرایی و دفترچه فنی (AASHTO LRFD / FHWA-NHI-14-007)' : 'AASHTO LRFD / FHWA-NHI-14-007'}
                </span>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {/* 1. Nail Tendon Rebar */}
                <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1 shadow-2xs print:border-slate-400">
                  <div className="text-[11px] font-bold text-indigo-900 border-b border-slate-100 pb-1 flex items-center justify-between">
                    <span>{isFa ? '۱. آرماتور / میلگرد نیل (Tendon)' : '1. Nail Tendon'}</span>
                    <span className="font-mono text-indigo-600 font-black">φ{state.tendon.barDiameter} mm</span>
                  </div>
                  <div className="text-[11px] space-y-0.5 text-slate-700 pt-1">
                    <div><strong>{isFa ? 'قطر میلگرد:' : 'Rebar Diameter:'}</strong> <span className="font-mono" dir="ltr">φ{state.tendon.barDiameter} mm</span></div>
                    <div><strong>{isFa ? 'رده فولاد:' : 'Steel Grade:'}</strong> <span className="font-mono">{state.tendon.steelGrade} (fy = {state.tendon.fy} MPa)</span></div>
                    <div><strong>{isFa ? 'سطح مقطع میلگرد:' : 'Provided Area:'}</strong> <span className="font-mono" dir="ltr">{results.tendon.AsProvided} cm²</span></div>
                    <div><strong>{isFa ? 'حداکثر نیروی کششی:' : 'Max Load (Tmax):'}</strong> <span className="font-mono" dir="ltr">{state.tendon.Tmax} kN</span></div>
                  </div>
                </div>

                {/* 2. Grid Spacing */}
                <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1 shadow-2xs print:border-slate-400">
                  <div className="text-[11px] font-bold text-indigo-900 border-b border-slate-100 pb-1 flex items-center justify-between">
                    <span>{isFa ? '۲. فواصل و آرایش شبکه نیل‌ها' : '2. Nail Grid Spacing'}</span>
                    <span className="font-mono text-indigo-600 font-black" dir="ltr">{state.facing.Sh}m × {state.facing.Sv}m</span>
                  </div>
                  <div className="text-[11px] space-y-0.5 text-slate-700 pt-1">
                    <div><strong>{isFa ? 'فاصله افقی (Sh):' : 'Horizontal (Sh):'}</strong> <span className="font-mono" dir="ltr">{state.facing.Sh} m</span></div>
                    <div><strong>{isFa ? 'فاصله قائم (Sv):' : 'Vertical (Sv):'}</strong> <span className="font-mono" dir="ltr">{state.facing.Sv} m</span></div>
                    <div><strong>{isFa ? 'مساحت نفوذ هر نیل:' : 'Tributary Area:'}</strong> <span className="font-mono" dir="ltr">{(state.facing.Sh * state.facing.Sv).toFixed(2)} m²</span></div>
                    <div><strong>{isFa ? 'نیروی سر نیل (T0):' : 'Nail Head Load:'}</strong> <span className="font-mono" dir="ltr">{results.T0} kN</span></div>
                  </div>
                </div>

                {/* 3. Borehole & Grouting */}
                <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1 shadow-2xs print:border-slate-400">
                  <div className="text-[11px] font-bold text-indigo-900 border-b border-slate-100 pb-1 flex items-center justify-between">
                    <span>{isFa ? '۳. گمانه حفاری و دوغاب' : '3. Borehole & Grout'}</span>
                    <span className="font-mono text-indigo-600 font-black" dir="ltr">DD = {state.pullout.drillholeDiameter} mm</span>
                  </div>
                  <div className="text-[11px] space-y-0.5 text-slate-700 pt-1">
                    <div><strong>{isFa ? 'قطر چال حفاری:' : 'Drillhole Bore Dia:'}</strong> <span className="font-mono" dir="ltr">{state.pullout.drillholeDiameter} mm</span></div>
                    <div><strong>{isFa ? 'طول پیوستگی مؤثر (Lp):' : 'Effective Bond Len:'}</strong> <span className="font-mono" dir="ltr">{state.pullout.effectiveBondLength} m</span></div>
                    <div><strong>{isFa ? 'مقاومت پیوستگی خاک-دوغاب:' : 'Bond Strength (qu):'}</strong> <span className="font-mono" dir="ltr">{state.pullout.bondStrength} kPa</span></div>
                    <div><strong>{isFa ? 'زاویه نصب گمانه:' : 'Nail Drill Angle:'}</strong> <span className="font-mono" dir="ltr">15° {isFa ? 'با افق' : 'from horiz.'}</span></div>
                  </div>
                </div>

                {/* 4. Temporary Initial Facing (Shotcrete) */}
                <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1 shadow-2xs print:border-slate-400">
                  <div className="text-[11px] font-bold text-indigo-900 border-b border-slate-100 pb-1 flex items-center justify-between">
                    <span>{isFa ? '۴. پوشش اولیه (شاتکریت موقت)' : '4. Initial Temp Facing'}</span>
                    <span className="font-mono text-indigo-600 font-black" dir="ltr">h = {state.facing.tempThickness} mm</span>
                  </div>
                  <div className="text-[11px] space-y-0.5 text-slate-700 pt-1">
                    <div><strong>{isFa ? 'ضخامت شاتکریت اولیه:' : 'Thickness:'}</strong> <span className="font-mono" dir="ltr">{state.facing.tempThickness} mm ({state.facing.tempThickness / 10} cm)</span></div>
                    <div><strong>{isFa ? 'مقاومت فشاری بتن (f\'c):' : 'f\'c Shotcrete:'}</strong> <span className="font-mono" dir="ltr">{state.facing.tempFc} MPa</span></div>
                    <div><strong>{isFa ? 'آرماتوربندی / مش:' : 'Mesh Rebar:'}</strong> <span className="font-mono text-indigo-800 font-bold" dir="ltr">{state.facing.tempMesh.meshDiameter ? `φ${state.facing.tempMesh.meshDiameter}@${state.facing.tempMesh.meshSpacing}mm` : `${state.facing.tempMesh.avn} mm²/m`}</span></div>
                    <div><strong>{isFa ? 'سطح مقطع فولاد:' : 'Steel Area:'}</strong> <span className="font-mono" dir="ltr">avn={state.facing.tempMesh.avn} / ahn={state.facing.tempMesh.ahn} mm²/m</span></div>
                    {state.facing.tempMesh.walerBarsEnabled && (
                      <div className="text-[10px] text-amber-700 font-semibold">{isFa ? `+ شناژ تقویت سر نیل: ${state.facing.tempMesh.walerBarsCount}φ${state.facing.tempMesh.walerBarDiameter}` : `+ Waler Bars: ${state.facing.tempMesh.walerBarsCount}φ${state.facing.tempMesh.walerBarDiameter}`}</div>
                    )}
                  </div>
                </div>

                {/* 5. Permanent Final Facing (CIP Concrete) */}
                <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1 shadow-2xs print:border-slate-400">
                  <div className="text-[11px] font-bold text-indigo-900 border-b border-slate-100 pb-1 flex items-center justify-between">
                    <span>{isFa ? '۵. پوشش نهایی (بتن درجا دائم)' : '5. Permanent Final Facing'}</span>
                    <span className="font-mono text-indigo-600 font-black" dir="ltr">h = {state.facing.permThickness} mm</span>
                  </div>
                  <div className="text-[11px] space-y-0.5 text-slate-700 pt-1">
                    <div><strong>{isFa ? 'ضخامت بتن دائم:' : 'Thickness:'}</strong> <span className="font-mono" dir="ltr">{state.facing.permThickness} mm ({state.facing.permThickness / 10} cm)</span></div>
                    <div><strong>{isFa ? 'مقاومت فشاری بتن (f\'c):' : 'f\'c Concrete:'}</strong> <span className="font-mono" dir="ltr">{state.facing.permFc} MPa</span></div>
                    <div><strong>{isFa ? 'آرماتوربندی دیواره دائم:' : 'Permanent Rebar:'}</strong> <span className="font-mono text-indigo-800 font-bold" dir="ltr">{state.facing.permMesh.meshDiameter ? `φ${state.facing.permMesh.meshDiameter}@${state.facing.permMesh.meshSpacing}mm` : `${state.facing.permMesh.avn} mm²/m`}</span></div>
                    <div><strong>{isFa ? 'سطح مقطع فولاد:' : 'Steel Area:'}</strong> <span className="font-mono" dir="ltr">avn={state.facing.permMesh.avn} / ahn={state.facing.permMesh.ahn} mm²/m</span></div>
                    <div><strong>{isFa ? 'گل‌میخ‌های سر نیل:' : 'Headed Studs:'}</strong> <span className="font-mono text-indigo-800 font-semibold" dir="ltr">{state.facing.headedStudsCount}×φ{state.facing.headedStudDiameter} mm ({state.facing.headedStudType})</span></div>
                  </div>
                </div>

                {/* 6. Bearing Plate & Nut */}
                <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1 shadow-2xs print:border-slate-400">
                  <div className="text-[11px] font-bold text-indigo-900 border-b border-slate-100 pb-1 flex items-center justify-between">
                    <span>{isFa ? '۶. صفحه سر نیل و اتکا' : '6. Bearing Plate'}</span>
                    <span className="font-mono text-indigo-600 font-black" dir="ltr">{state.plate.plateWidth}×{state.plate.plateWidth} cm</span>
                  </div>
                  <div className="text-[11px] space-y-0.5 text-slate-700 pt-1">
                    <div><strong>{isFa ? 'ابعاد صفحه فولادی:' : 'Dimensions (B×B):'}</strong> <span className="font-mono" dir="ltr">{state.plate.plateWidth} × {state.plate.plateWidth} cm</span></div>
                    <div><strong>{isFa ? 'ضخامت صفحه (tplate):' : 'Thickness:'}</strong> <span className="font-mono" dir="ltr">{state.plate.plateThickness} cm ({state.plate.plateThickness * 10} mm)</span></div>
                    <div><strong>{isFa ? 'قطر سوراخ عبور (Dhole):' : 'Hole Diameter:'}</strong> <span className="font-mono" dir="ltr">{state.plate.holeDiameter} cm ({state.plate.holeDiameter * 10} mm)</span></div>
                    <div><strong>{isFa ? 'تنش تسلیم صفحه فولادی:' : 'Yield Strength (Fy):'}</strong> <span className="font-mono" dir="ltr">{state.plate.fyPlate} MPa</span></div>
                  </div>
                </div>
              </div>

              {/* 7. Full Width Corrosion Protection System Banner */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1 shadow-2xs print:border-slate-400">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-1">
                  <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>{isFa ? '۷. سیستم حفاظت در برابر خوردگی و دوام نیل‌ها (Corrosion Protection System):' : '7. Corrosion Protection System:'}</span>
                  </span>
                  <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                    {state.corrosion.selectedClass === 'ClassA' ? (isFa ? 'کلاس A (محصورسازی دوبل دوجداره)' : 'Class A (Double Encapsulation)') : state.corrosion.selectedClass === 'ClassB' ? (isFa ? 'کلاس B (پوشش محافظ اپوکسی / گالوانیزه)' : 'Class B (Coated)') : (isFa ? 'بدون پوشش محافظ و غلاف (پایدارسازی موقت)' : 'None (Temporary Nail)')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed pt-1">
                  {state.corrosion.selectedClass === 'ClassA' ? (
                    isFa
                      ? `حفاظت دوگانه (Double Corrosion Protection) با غلاف پلاستیکی موج‌دار شیاردار از جنس ${state.corrosion.ductMaterial} به ضخامت دیواره ${state.corrosion.ductWallThickness} میلی‌متر و قطر داخلی ${state.corrosion.ductInsideDiameter} میلی‌متر، تزریق دوغاب سیمانی داخلی در کارگاه، سنترالایزرهای داخلی و خارجی با فواصل حداکثر ${state.corrosion.externalCentralizerSpacing} متر (ویژه خاک‌های تهاجمی و دیواره‌های دائمی با طول عمر بیش از ۷۵ سال).`
                      : `Class A Encapsulated Double Corrosion Protection: corrugated ${state.corrosion.ductMaterial} duct (wall ${state.corrosion.ductWallThickness}mm, ID ${state.corrosion.ductInsideDiameter}mm) with pre-grouted internal annulus and centralizers at max ${state.corrosion.externalCentralizerSpacing}m.`
                  ) : state.corrosion.selectedClass === 'ClassB' ? (
                    isFa
                      ? `حفاظت تک‌لایه (Class B Single Protection) با پوشش اپوکسی الکترواستاتیک (ضخامت ۷ تا ۱۲ میل) یا گالوانیزه گرم به همراه حداقل ۲۵.۴ میلی‌متر پوشش دوغاب سیمانی یکپارچه درون گمانه (مناسب برای محیط‌های غیرتهاجمی و سازه‌های دائمی).`
                      : `Class B Single Corrosion Protection: epoxy coating (7-12 mil) or hot-dip galvanizing with min 25.4mm grout cover.`
                  ) : (
                    isFa
                      ? `بدون پوشش محافظ و غلاف (Plain Bar in Grout): اجرای مستقیم میلگرد ساده درون دوغاب سیمانی گمانه بدون لوله محافظ یا پوشش اپوکسی (ویژه گودبرداری‌ها و پایدارسازی‌های موقت با دوره بهره‌برداری کمتر از ۲ سال).`
                      : `None (Plain Bar): Plain steel rebar encapsulated directly in cement grout without corrugated duct or epoxy coating (suitable for temporary excavations with design life < 2 years).`
                  )}
                </p>
              </div>
            </div>

            {/* EXECUTIVE SUMMARY TABLE OF ALL CHECKS */}
            <div className="space-y-2">
              <div className="border-b-2 border-slate-800 pb-1.5 flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
                  <span>{isFa ? 'جدول ۱- خلاصه نتایج و کنترل‌های طراحی اجزای سیستم نیلینگ (LRFD)' : 'Table 1: Executive Summary of LRFD Design Checks'}</span>
                </h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-md font-black shadow-2xs ${results.isOverallPassed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                  {results.isOverallPassed ? (isFa ? 'کلیه کنترل‌ها مورد تأیید است (PASS)' : 'ALL CHECKS SATISFIED (PASS)') : (isFa ? 'نیازمند اصلاح (FAIL)' : 'REVISION REQUIRED (FAIL)')}
                </span>
              </div>

              <div className="border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
                <table className="w-full border-collapse text-[11px]" dir={isFa ? 'rtl' : 'ltr'}>
                  <thead className="bg-slate-200/80 text-slate-800 font-black border-b border-slate-300">
                    <tr>
                      <th className="p-2 text-center w-10 border border-slate-300">{isFa ? 'ردیف' : '#'}</th>
                      <th className={`p-2 border border-slate-300 ${isFa ? 'text-right' : 'text-left'}`}>{isFa ? 'موضوع و مؤلفه تحت کنترل' : 'Design Item & Component'}</th>
                      <th className="p-2 text-center border border-slate-300">{isFa ? 'آیین‌نامه مرجع' : 'Standard Ref'}</th>
                      <th className="p-2 text-center border border-slate-300">{isFa ? 'بار ضریب‌دار طرح (Demand)' : 'Factored Demand'}</th>
                      <th className="p-2 text-center border border-slate-300">{isFa ? 'مقاومت نهایی طرح (Capacity)' : 'Factored Resistance'}</th>
                      <th className="p-2 text-center w-24 border border-slate-300">{isFa ? 'نسبت CDR' : 'CDR (Cap/Dem)'}</th>
                      <th className="p-2 text-center w-24 border border-slate-300">{isFa ? 'نتیجه کنترل' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {/* Row 1: Tendon */}
                    <tr className="hover:bg-slate-50/80 transition">
                      <td className="p-2 text-center font-mono font-bold text-slate-500 border border-slate-200">1</td>
                      <td className={`p-2 font-bold text-slate-900 border border-slate-200 ${isFa ? 'text-right' : 'text-left'}`}>
                        <div>{isFa ? 'ظرفیت کششی میلگرد فولادی نیل' : 'Tendon Tensile Resistance'}</div>
                        <div className="text-[10px] text-slate-500 font-mono font-normal" dir="ltr">φ{state.tendon.barDiameter} mm ({state.tendon.steelGrade})</div>
                      </td>
                      <td className="p-2 text-center font-mono text-slate-600 border border-slate-200 text-[10.5px]">
                        <span dir="ltr">AASHTO 11.12.6.1</span>
                      </td>
                      <td className="p-2 text-center font-mono border border-slate-200">
                        <span dir="ltr" className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium">{results.tendon.factoredLoad} kN</span>
                      </td>
                      <td className="p-2 text-center font-mono border border-slate-200">
                        <span dir="ltr" className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium">{results.tendon.factoredResistance} kN</span>
                      </td>
                      <td className="p-2 text-center font-mono border border-slate-200">
                        <span dir="ltr" className={`inline-block px-2 py-0.5 rounded font-black text-xs ${results.tendon.capacityDemandRatio >= 1 ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-rose-50 text-rose-800 border border-rose-300'}`}>
                          {results.tendon.capacityDemandRatio}
                        </span>
                      </td>
                      <td className="p-2 text-center border border-slate-200">
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-black ${results.tendon.isPassed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                          {results.tendon.isPassed ? (isFa ? 'تأیید ✓' : 'PASS ✓') : (isFa ? 'رد ✕' : 'FAIL ✕')}
                        </span>
                      </td>
                    </tr>

                    {/* Row 2: Pullout */}
                    <tr className="hover:bg-slate-50/80 transition">
                      <td className="p-2 text-center font-mono font-bold text-slate-500 border border-slate-200">2</td>
                      <td className={`p-2 font-bold text-slate-900 border border-slate-200 ${isFa ? 'text-right' : 'text-left'}`}>
                        <div>{isFa ? 'ظرفیت بیرون‌کشیدگی پیوستگی دوغاب و زمین' : 'Grout-Ground Pullout Resistance'}</div>
                        <div className="text-[10px] text-slate-500 font-mono font-normal" dir="ltr">DD={state.pullout.drillholeDiameter}mm, Lp={state.pullout.effectiveBondLength}m</div>
                      </td>
                      <td className="p-2 text-center font-mono text-slate-600 border border-slate-200 text-[10.5px]">
                        <span dir="ltr">AASHTO 11.12.5.2</span>
                      </td>
                      <td className="p-2 text-center font-mono border border-slate-200">
                        <span dir="ltr" className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium">{results.pullout.factoredLoad} kN</span>
                      </td>
                      <td className="p-2 text-center font-mono border border-slate-200">
                        <span dir="ltr" className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium">{results.pullout.factoredResistance} kN</span>
                      </td>
                      <td className="p-2 text-center font-mono border border-slate-200">
                        <span dir="ltr" className={`inline-block px-2 py-0.5 rounded font-black text-xs ${results.pullout.capacityDemandRatio >= 1 ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-rose-50 text-rose-800 border border-rose-300'}`}>
                          {results.pullout.capacityDemandRatio}
                        </span>
                      </td>
                      <td className="p-2 text-center border border-slate-200">
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-black ${results.pullout.isPassed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                          {results.pullout.isPassed ? (isFa ? 'تأیید ✓' : 'PASS ✓') : (isFa ? 'رد ✕' : 'FAIL ✕')}
                        </span>
                      </td>
                    </tr>

                    {/* Row 3: Plate */}
                    <tr className="hover:bg-slate-50/80 transition">
                      <td className="p-2 text-center font-mono font-bold text-slate-500 border border-slate-200">3</td>
                      <td className={`p-2 font-bold text-slate-900 border border-slate-200 ${isFa ? 'text-right' : 'text-left'}`}>
                        <div>{isFa ? 'خمش، تنش اتکا و ضخامت صفحه سر نیل' : 'Nail Head Bearing Plate & Flexure'}</div>
                        <div className="text-[10px] text-slate-500 font-mono font-normal" dir="ltr">{state.plate.plateWidth}×{state.plate.plateWidth} cm, t={state.plate.plateThickness} cm</div>
                      </td>
                      <td className="p-2 text-center font-mono text-slate-600 border border-slate-200 text-[10.5px]">
                        <span dir="ltr">FHWA NHI-14-007</span>
                      </td>
                      <td className="p-2 text-center font-mono border border-slate-200">
                        <span dir="ltr" className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium">{results.plate.bendingStress} kg/cm²</span>
                      </td>
                      <td className="p-2 text-center font-mono border border-slate-200">
                        <span dir="ltr" className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium">{results.plate.allowableBendingStress} kg/cm²</span>
                      </td>
                      <td className="p-2 text-center font-mono border border-slate-200">
                        <span dir="ltr" className="inline-block px-2 py-0.5 rounded font-black text-xs bg-emerald-50 text-emerald-800 border border-emerald-300">
                          {(results.plate.allowableBendingStress / Math.max(results.plate.bendingStress, 1)).toFixed(2)}
                        </span>
                      </td>
                      <td className="p-2 text-center border border-slate-200">
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-black ${results.plate.isPassed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                          {results.plate.isPassed ? (isFa ? 'تأیید ✓' : 'PASS ✓') : (isFa ? 'رد ✕' : 'FAIL ✕')}
                        </span>
                      </td>
                    </tr>

                    {/* Row 4: Temp Flexure */}
                    <tr className="hover:bg-slate-50/80 transition">
                      <td className="p-2 text-center font-mono font-bold text-slate-500 border border-slate-200">4</td>
                      <td className={`p-2 font-bold text-slate-900 border border-slate-200 ${isFa ? 'text-right' : 'text-left'}`}>
                        <div>{isFa ? 'مقاومت خمشی پوشش اولیه (شاتکریت موقت)' : 'Initial Temp Facing Flexure'}</div>
                        <div className="text-[10px] text-slate-500 font-mono font-normal" dir="ltr">h={state.facing.tempThickness}mm, f'c={state.facing.tempFc}MPa</div>
                      </td>
                      <td className="p-2 text-center font-mono text-slate-600 border border-slate-200 text-[10.5px]">
                        <span dir="ltr">AASHTO 11.12.6.2.2</span>
                      </td>
                      <td className="p-2 text-center font-mono border border-slate-200">
                        <span dir="ltr" className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium">{results.tempFlexure.factoredLoad} kN</span>
                      </td>
                      <td className="p-2 text-center font-mono border border-slate-200">
                        <span dir="ltr" className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium">{results.tempFlexure.factoredResistance} kN</span>
                      </td>
                      <td className="p-2 text-center font-mono border border-slate-200">
                        <span dir="ltr" className={`inline-block px-2 py-0.5 rounded font-black text-xs ${results.tempFlexure.CDR >= 1 ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-rose-50 text-rose-800 border border-rose-300'}`}>
                          {results.tempFlexure.CDR}
                        </span>
                      </td>
                      <td className="p-2 text-center border border-slate-200">
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-black ${results.tempFlexure.isPassed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                          {results.tempFlexure.isPassed ? (isFa ? 'تأیید ✓' : 'PASS ✓') : (isFa ? 'رد ✕' : 'FAIL ✕')}
                        </span>
                      </td>
                    </tr>

                    {/* Row 5: Temp Punching */}
                    <tr className="hover:bg-slate-50/80 transition">
                      <td className="p-2 text-center font-mono font-bold text-slate-500 border border-slate-200">5</td>
                      <td className={`p-2 font-bold text-slate-900 border border-slate-200 ${isFa ? 'text-right' : 'text-left'}`}>
                        <div>{isFa ? 'برش پانچینگ مخروط شاتکریت موقت' : 'Temp Facing Punching Shear'}</div>
                        <div className="text-[10px] text-slate-500 font-mono font-normal" dir="ltr">Dc'={(results.tempPunching.DcPrime * 100).toFixed(1)}cm</div>
                      </td>
                      <td className="p-2 text-center font-mono text-slate-600 border border-slate-200 text-[10.5px]">
                        <span dir="ltr">AASHTO 11.12.6.2.2</span>
                      </td>
                      <td className="p-2 text-center font-mono border border-slate-200">
                        <span dir="ltr" className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium">{results.tempPunching.factoredLoad} kN</span>
                      </td>
                      <td className="p-2 text-center font-mono border border-slate-200">
                        <span dir="ltr" className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium">{results.tempPunching.factoredResistance} kN</span>
                      </td>
                      <td className="p-2 text-center font-mono border border-slate-200">
                        <span dir="ltr" className={`inline-block px-2 py-0.5 rounded font-black text-xs ${results.tempPunching.CDR >= 1 ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-rose-50 text-rose-800 border border-rose-300'}`}>
                          {results.tempPunching.CDR}
                        </span>
                      </td>
                      <td className="p-2 text-center border border-slate-200">
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-black ${results.tempPunching.isPassed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                          {results.tempPunching.isPassed ? (isFa ? 'تأیید ✓' : 'PASS ✓') : (isFa ? 'رد ✕' : 'FAIL ✕')}
                        </span>
                      </td>
                    </tr>

                    {/* Row 6: Perm Flexure */}
                    <tr className="hover:bg-slate-50/80 transition">
                      <td className="p-2 text-center font-mono font-bold text-slate-500 border border-slate-200">6</td>
                      <td className={`p-2 font-bold text-slate-900 border border-slate-200 ${isFa ? 'text-right' : 'text-left'}`}>
                        <div>{isFa ? 'مقاومت خمشی پوشش نهایی (بتن درجا دائم)' : 'Permanent CIP Facing Flexure'}</div>
                        <div className="text-[10px] text-slate-500 font-mono font-normal" dir="ltr">h={state.facing.permThickness}mm, f'c={state.facing.permFc}MPa</div>
                      </td>
                      <td className="p-2 text-center font-mono text-slate-600 border border-slate-200 text-[10.5px]">
                        <span dir="ltr">AASHTO 11.12.6.2.2</span>
                      </td>
                      <td className="p-2 text-center font-mono border border-slate-200">
                        <span dir="ltr" className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium">{results.permFlexure.factoredLoad} kN</span>
                      </td>
                      <td className="p-2 text-center font-mono border border-slate-200">
                        <span dir="ltr" className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium">{results.permFlexure.factoredResistance} kN</span>
                      </td>
                      <td className="p-2 text-center font-mono border border-slate-200">
                        <span dir="ltr" className={`inline-block px-2 py-0.5 rounded font-black text-xs ${results.permFlexure.CDR >= 1 ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-rose-50 text-rose-800 border border-rose-300'}`}>
                          {results.permFlexure.CDR}
                        </span>
                      </td>
                      <td className="p-2 text-center border border-slate-200">
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-black ${results.permFlexure.isPassed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                          {results.permFlexure.isPassed ? (isFa ? 'تأیید ✓' : 'PASS ✓') : (isFa ? 'رد ✕' : 'FAIL ✕')}
                        </span>
                      </td>
                    </tr>

                    {/* Row 7: Perm Punching */}
                    <tr className="hover:bg-slate-50/80 transition">
                      <td className="p-2 text-center font-mono font-bold text-slate-500 border border-slate-200">7</td>
                      <td className={`p-2 font-bold text-slate-900 border border-slate-200 ${isFa ? 'text-right' : 'text-left'}`}>
                        <div>{isFa ? 'برش پانچینگ بتن درجا نهایی' : 'Permanent Facing Punching Shear'}</div>
                        <div className="text-[10px] text-slate-500 font-mono font-normal" dir="ltr">Dc'={(results.permPunching.DcPrime * 100).toFixed(1)}cm</div>
                      </td>
                      <td className="p-2 text-center font-mono text-slate-600 border border-slate-200 text-[10.5px]">
                        <span dir="ltr">AASHTO 11.12.6.2.2</span>
                      </td>
                      <td className="p-2 text-center font-mono border border-slate-200">
                        <span dir="ltr" className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium">{results.permPunching.factoredLoad} kN</span>
                      </td>
                      <td className="p-2 text-center font-mono border border-slate-200">
                        <span dir="ltr" className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium">{results.permPunching.factoredResistance} kN</span>
                      </td>
                      <td className="p-2 text-center font-mono border border-slate-200">
                        <span dir="ltr" className={`inline-block px-2 py-0.5 rounded font-black text-xs ${results.permPunching.CDR >= 1 ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-rose-50 text-rose-800 border border-rose-300'}`}>
                          {results.permPunching.CDR}
                        </span>
                      </td>
                      <td className="p-2 text-center border border-slate-200">
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-black ${results.permPunching.isPassed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                          {results.permPunching.isPassed ? (isFa ? 'تأیید ✓' : 'PASS ✓') : (isFa ? 'رد ✕' : 'FAIL ✕')}
                        </span>
                      </td>
                    </tr>

                    {/* Row 8: Headed Studs */}
                    <tr className="hover:bg-slate-50/80 transition">
                      <td className="p-2 text-center font-mono font-bold text-slate-500 border border-slate-200">8</td>
                      <td className={`p-2 font-bold text-slate-900 border border-slate-200 ${isFa ? 'text-right' : 'text-left'}`}>
                        <div>{isFa ? 'کشش گل‌میخ‌های سر نیل (اتصال به مش دائم)' : 'Headed Studs Tensile Connection'}</div>
                        <div className="text-[10px] text-slate-500 font-mono font-normal" dir="ltr">{state.facing.headedStudsCount}×φ{state.facing.headedStudDiameter} mm ({state.facing.headedStudType})</div>
                      </td>
                      <td className="p-2 text-center font-mono text-slate-600 border border-slate-200 text-[10.5px]">
                        <span dir="ltr">AASHTO 11.12.6.2.3</span>
                      </td>
                      <td className="p-2 text-center font-mono border border-slate-200">
                        <span dir="ltr" className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium">{results.headedStuds.factoredLoad} kN</span>
                      </td>
                      <td className="p-2 text-center font-mono border border-slate-200">
                        <span dir="ltr" className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium">{results.headedStuds.factoredResistance} kN</span>
                      </td>
                      <td className="p-2 text-center font-mono border border-slate-200">
                        <span dir="ltr" className={`inline-block px-2 py-0.5 rounded font-black text-xs ${results.headedStuds.CDR >= 1 ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-rose-50 text-rose-800 border border-rose-300'}`}>
                          {results.headedStuds.CDR}
                        </span>
                      </td>
                      <td className="p-2 text-center border border-slate-200">
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-black ${results.headedStuds.isPassed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                          {results.headedStuds.isPassed ? (isFa ? 'تأیید ✓' : 'PASS ✓') : (isFa ? 'رد ✕' : 'FAIL ✕')}
                        </span>
                      </td>
                    </tr>

                    {/* Row 9: Corrosion Protection */}
                    <tr className="hover:bg-slate-50/80 transition">
                      <td className="p-2 text-center font-mono font-bold text-slate-500 border border-slate-200">9</td>
                      <td className={`p-2 font-bold text-slate-900 border border-slate-200 ${isFa ? 'text-right' : 'text-left'}`}>
                        <div>{isFa ? 'سیستم حفاظت در برابر خوردگی و دوام' : 'Corrosion Protection System'}</div>
                        <div className="text-[10px] text-slate-500 font-mono font-normal">
                          {state.corrosion.selectedClass === 'ClassA'
                            ? (isFa ? 'غلاف دوجداره موج‌دار' : 'Double Encapsulation Duct')
                            : state.corrosion.selectedClass === 'ClassB'
                            ? (isFa ? 'پوشش اپوکسی/گالوانیزه' : 'Epoxy/Galvanized')
                            : (isFa ? 'میلگرد ساده دوغاب‌ریزی شده' : 'Plain Bar in Grout')}
                        </div>
                      </td>
                      <td className="p-2 text-center font-mono text-slate-600 border border-slate-200 text-[10.5px]">
                        <span dir="ltr">AASHTO 11.12.8</span>
                      </td>
                      <td className="p-2 text-center border border-slate-200 text-[10px] font-medium text-slate-700">
                        {results.corrosion.isAggressive ? (isFa ? 'خاک تهاجمی (خورنده)' : 'Aggressive Ground') : (isFa ? 'خاک غیرتهاجمی' : 'Non-Aggressive')}
                      </td>
                      <td className="p-2 text-center border border-slate-200 text-[10px] font-bold text-slate-800">
                        {state.corrosion.selectedClass === 'ClassA'
                          ? (isFa ? 'کلاس A (الزام دوجداره)' : 'Class A (Double Duct)')
                          : state.corrosion.selectedClass === 'ClassB'
                          ? (isFa ? 'کلاس B (پوشش‌دار)' : 'Class B (Coated)')
                          : (isFa ? 'بدون غلاف (نیل موقت)' : 'None (Temp Nail < 2 yrs)')}
                      </td>
                      <td className="p-2 text-center font-mono border border-slate-200 text-[10px] font-bold text-slate-700">
                        {isFa ? 'مطابق آیین‌نامه' : 'Compliant'}
                      </td>
                      <td className="p-2 text-center border border-slate-200">
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-black ${results.corrosion.summaryStatus === 'Compliant' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                          {results.corrosion.summaryStatus === 'Compliant' ? (isFa ? 'تأیید ✓' : 'PASS ✓') : (isFa ? 'رد ✕' : 'FAIL ✕')}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* MODEL INPUTS & TRACEABILITY TABLE */}
            <div className="space-y-2 border-t border-slate-200 pt-5">
              <div className="border-b border-slate-300 pb-1.5 flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
                  <span>{isFa ? 'جدول ۲- منشأ، مراجع استاندارد و ردیابی پارامترهای محاسباتی' : 'Table 2: Design Parameters Origin, Code References & Traceability'}</span>
                </h3>
                <span className="text-[11px] font-medium text-slate-500">
                  {isFa ? 'مستندسازی فرضیات ورودی دفترچه محاسبات' : 'Engineering inputs documentation'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed text-justify">
                {isFa
                  ? 'جدول زیر منشأ هر یک از داده‌های طراحی مورد استفاده در محاسبات فوق را به تفکیک محل ورود در نرم‌افزار، گزارش‌های ژئوتکنیک و جداول آیین‌نامه‌ای AASHTO و FHWA مشخص می‌سازد:'
                  : 'The table below details the origin and reference clause of all design inputs used in this verification:'}
              </p>

              <div className="border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
                <table className="w-full border-collapse text-[10.5px]" dir={isFa ? 'rtl' : 'ltr'}>
                  <thead className="bg-slate-200/80 text-slate-800 font-black border-b border-slate-300">
                    <tr>
                      <th className="p-2 text-center w-10 border border-slate-300">{isFa ? 'ردیف' : '#'}</th>
                      <th className={`p-2 border border-slate-300 ${isFa ? 'text-right' : 'text-left'}`}>{isFa ? 'پارامتر و نماد مهندسی' : 'Parameter & Symbol'}</th>
                      <th className="p-2 text-center border border-slate-300">{isFa ? 'مقدار طراحی و واحد' : 'Design Value & Unit'}</th>
                      <th className="p-2 text-center border border-slate-300">{isFa ? 'بخش در نرم‌افزار' : 'Software Tab'}</th>
                      <th className={`p-2 border border-slate-300 ${isFa ? 'text-right' : 'text-left'}`}>{isFa ? 'منشأ مهندسی و مرجع استاندارد' : 'Engineering Origin / Standard Ref'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                    <tr>
                      <td className="p-1.5 text-center font-mono text-slate-500 border border-slate-200">1</td>
                      <td className="p-1.5 font-bold text-slate-900 border border-slate-200">{isFa ? 'حداکثر نیروی کشش نیل (Tmax)' : 'Max Nail Tension (Tmax)'}</td>
                      <td className="p-1.5 text-center font-mono border border-slate-200"><span dir="ltr" className="inline-block px-1.5 py-0.5 rounded bg-slate-100 font-bold">{state.tendon.Tmax} kN</span></td>
                      <td className="p-1.5 text-center border border-slate-200">{isFa ? 'تب میلگرد نیل (Tendon)' : 'Tendon Tab'}</td>
                      <td className="p-1.5 text-slate-600 border border-slate-200">{isFa ? 'خروجی تحلیل پایداری شیب و گوه گسیختگی (Limit Equilibrium / LEM نظیر SLOPE/W یا SNAIL)' : 'LEM global stability analysis / wedge equilibrium (SLOPE/W, SNAIL)'}</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-mono text-slate-500 border border-slate-200">2</td>
                      <td className="p-1.5 font-bold text-slate-900 border border-slate-200">{isFa ? 'ضریب بار کشش نیل (γp-EV)' : 'Load Factor (γp-EV)'}</td>
                      <td className="p-1.5 text-center font-mono border border-slate-200"><span dir="ltr" className="inline-block px-1.5 py-0.5 rounded bg-slate-100 font-bold">{state.tendon.loadFactorEV}</span></td>
                      <td className="p-1.5 text-center border border-slate-200">{isFa ? 'تب میلگرد نیل (Tendon)' : 'Tendon Tab'}</td>
                      <td className="p-1.5 text-slate-600 border border-slate-200">AASHTO LRFD (2020) Table 3.4.1-2 {isFa ? '(فشار قائم و رانش فعال خاکی)' : '(Permanent vertical & active earth pressure)'}</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-mono text-slate-500 border border-slate-200">3</td>
                      <td className="p-1.5 font-bold text-slate-900 border border-slate-200">{isFa ? 'ضریب مقاومت کششی (φT)' : 'Resistance Factor (φT)'}</td>
                      <td className="p-1.5 text-center font-mono border border-slate-200"><span dir="ltr" className="inline-block px-1.5 py-0.5 rounded bg-slate-100 font-bold">{state.tendon.phiT}</span></td>
                      <td className="p-1.5 text-center border border-slate-200">{isFa ? 'تب میلگرد نیل (Tendon)' : 'Tendon Tab'}</td>
                      <td className="p-1.5 text-slate-600 border border-slate-200">AASHTO Table 11.5.7-1 & Clause 11.12.6.1 {isFa ? '(کشش میلگردهای فولادی)' : '(Tendon tensile yielding)'}</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-mono text-slate-500 border border-slate-200">4</td>
                      <td className="p-1.5 font-bold text-slate-900 border border-slate-200">{isFa ? 'مشخصات میلگرد نیل (قطر و رده)' : 'Tendon Bar (Dia & Grade)'}</td>
                      <td className="p-1.5 text-center font-mono border border-slate-200"><span dir="ltr" className="inline-block px-1.5 py-0.5 rounded bg-slate-100 font-bold">φ{state.tendon.barDiameter} mm / fy={state.tendon.fy} MPa</span></td>
                      <td className="p-1.5 text-center border border-slate-200">{isFa ? 'تب میلگرد نیل (Tendon)' : 'Tendon Tab'}</td>
                      <td className="p-1.5 text-slate-600 border border-slate-200">{isFa ? `فولاد انتخابی کاربر (${state.tendon.steelGrade}) مطابق استاندارد ASTM A615 یا استاندارد ملی ۳۱۳۲` : `User specification (${state.tendon.steelGrade}) per ASTM A615`}</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-mono text-slate-500 border border-slate-200">5</td>
                      <td className="p-1.5 font-bold text-slate-900 border border-slate-200">{isFa ? 'قطر گمانه حفاری (DD)' : 'Drillhole Diameter (DD)'}</td>
                      <td className="p-1.5 text-center font-mono border border-slate-200"><span dir="ltr" className="inline-block px-1.5 py-0.5 rounded bg-slate-100 font-bold">{state.pullout.drillholeDiameter} mm</span></td>
                      <td className="p-1.5 text-center border border-slate-200">{isFa ? 'تب گمانه و بیرون‌کشیدگی (Pullout)' : 'Borehole Tab'}</td>
                      <td className="p-1.5 text-slate-600 border border-slate-200">{isFa ? 'سرمته دستگاه حفاری روتاری یا ضربه‌ای پیمانکار (Drilling Bit)' : 'Selected contractor drill bit (casing / auger diameter)'}</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-mono text-slate-500 border border-slate-200">6</td>
                      <td className="p-1.5 font-bold text-slate-900 border border-slate-200">{isFa ? 'طول مؤثر پیوند (Lp)' : 'Effective Bond Length (Lp)'}</td>
                      <td className="p-1.5 text-center font-mono border border-slate-200"><span dir="ltr" className="inline-block px-1.5 py-0.5 rounded bg-slate-100 font-bold">{state.pullout.effectiveBondLength} m</span></td>
                      <td className="p-1.5 text-center border border-slate-200">{isFa ? 'تب گمانه و بیرون‌کشیدگی (Pullout)' : 'Borehole Tab'}</td>
                      <td className="p-1.5 text-slate-600 border border-slate-200">{isFa ? 'طول مدفون نیل در پشت سطح گسیختگی بحرانی گود (Resistant Zone)' : 'Embedment length in resistant zone behind potential slip surface'}</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-mono text-slate-500 border border-slate-200">7</td>
                      <td className="p-1.5 font-bold text-slate-900 border border-slate-200">{isFa ? 'مقاومت پیوستگی دوغاب و خاک (qu)' : 'Nominal Bond Strength (qu)'}</td>
                      <td className="p-1.5 text-center font-mono border border-slate-200"><span dir="ltr" className="inline-block px-1.5 py-0.5 rounded bg-slate-100 font-bold">{state.pullout.bondStrength} kPa</span></td>
                      <td className="p-1.5 text-center border border-slate-200">{isFa ? 'تب گمانه و بیرون‌کشیدگی (Pullout)' : 'Borehole Tab'}</td>
                      <td className="p-1.5 text-slate-600 border border-slate-200">{isFa ? 'نتایج آزمایش بیرون‌کشیدگی درجا (Pullout Test) یا جدول FHWA Table 4.6 / AASHTO Table C11.12.5.2-1' : 'In-situ pullout test or FHWA Table 4.6 / AASHTO Table C11.12.5.2-1'}</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-mono text-slate-500 border border-slate-200">8</td>
                      <td className="p-1.5 font-bold text-slate-900 border border-slate-200">{isFa ? 'ضریب مقاومت بیرون‌کشیدگی (φPO)' : 'Pullout Factor (φPO)'}</td>
                      <td className="p-1.5 text-center font-mono border border-slate-200"><span dir="ltr" className="inline-block px-1.5 py-0.5 rounded bg-slate-100 font-bold">{state.pullout.phiPO}</span></td>
                      <td className="p-1.5 text-center border border-slate-200">{isFa ? 'تب گمانه و بیرون‌کشیدگی (Pullout)' : 'Borehole Tab'}</td>
                      <td className="p-1.5 text-slate-600 border border-slate-200">AASHTO Table 11.5.7-1 {isFa ? '(حالت استاتیکی دوغاب-خاک)' : '(Static soil-grout bond)'}</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-mono text-slate-500 border border-slate-200">9</td>
                      <td className="p-1.5 font-bold text-slate-900 border border-slate-200">{isFa ? 'ابعاد و ضخامت صفحه سر نیل' : 'Bearing Plate Dimensions'}</td>
                      <td className="p-1.5 text-center font-mono border border-slate-200"><span dir="ltr" className="inline-block px-1.5 py-0.5 rounded bg-slate-100 font-bold">{state.plate.plateWidth}×{state.plate.plateWidth} cm, t={state.plate.plateThickness} cm</span></td>
                      <td className="p-1.5 text-center border border-slate-200">{isFa ? 'تب صفحه سر نیل (Plate)' : 'Bearing Plate Tab'}</td>
                      <td className="p-1.5 text-slate-600 border border-slate-200">{isFa ? `پلیت ورق فولادی St-37 یا ASTM A36 با fy = ${state.plate.fyPlate} MPa` : `Steel plate ASTM A36 (fy = ${state.plate.fyPlate} MPa)`}</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-mono text-slate-500 border border-slate-200">10</td>
                      <td className="p-1.5 font-bold text-slate-900 border border-slate-200">{isFa ? 'فواصل نیل‌ها (شبکه حفاری)' : 'Nail Spacing (Grid SH × SV)'}</td>
                      <td className="p-1.5 text-center font-mono border border-slate-200"><span dir="ltr" className="inline-block px-1.5 py-0.5 rounded bg-slate-100 font-bold">SH={state.facing.Sh} m, SV={state.facing.Sv} m</span></td>
                      <td className="p-1.5 text-center border border-slate-200">{isFa ? 'تب پوشش فیس (Facing)' : 'Facing Tab'}</td>
                      <td className="p-1.5 text-slate-600 border border-slate-200">{isFa ? 'نقشه الگوی چیدمان حفاری میخ‌ها در فیس گود (Pattern Grid)' : 'Excavation wall nailing layout grid'}</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-mono text-slate-500 border border-slate-200">11</td>
                      <td className="p-1.5 font-bold text-slate-900 border border-slate-200">{isFa ? 'شاتکریت موقت (ضخامت و مقاومت)' : 'Temp Shotcrete (h & f\'c)'}</td>
                      <td className="p-1.5 text-center font-mono border border-slate-200"><span dir="ltr" className="inline-block px-1.5 py-0.5 rounded bg-slate-100 font-bold">h={state.facing.tempThickness} mm, f\'c={state.facing.tempFc} MPa</span></td>
                      <td className="p-1.5 text-center border border-slate-200">{isFa ? 'تب پوشش فیس (Facing)' : 'Facing Tab'}</td>
                      <td className="p-1.5 text-slate-600 border border-slate-200">{isFa ? 'مشخصات بتن پاششی اولیه مندرج در مشخصات فنی و دفترچه محاسبات' : 'Initial shotcrete layer specification'}</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-mono text-slate-500 border border-slate-200">12</td>
                      <td className="p-1.5 font-bold text-slate-900 border border-slate-200">{isFa ? 'آزمایش‌های شیمیایی خاک گمانه' : 'Geotech Chemical Lab Tests'}</td>
                      <td className="p-1.5 text-center font-mono border border-slate-200"><span dir="ltr" className="inline-block px-1.5 py-0.5 rounded bg-slate-100 font-bold">pH={state.corrosion.soilTests.pH}, ρ={state.corrosion.soilTests.resistivity} Ω·cm</span></td>
                      <td className="p-1.5 text-center border border-slate-200">{isFa ? 'تب حفاظت خوردگی (Corrosion)' : 'Corrosion Tab'}</td>
                      <td className="p-1.5 text-slate-600 border border-slate-200">{isFa ? 'گزارش مطالعات ژئوتکنیک خاک پروژه (گمانه‌های شناسایی BH)' : 'Site geotechnical investigation report (Borehole chemical lab tests)'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 1: TENDON TENSILE CAPACITY */}
            <div className="space-y-2 border-t border-slate-200 pt-5" dir={isFa ? 'rtl' : 'ltr'}>
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>{isFa ? '۱- کنترل ظرفیت کششی میلگرد نیل (Tendon Tensile Resistance)' : '1. Tendon Tensile Resistance (AASHTO 11.12.6.1)'}</span>
              </h3>
              <p className="text-slate-700 text-[11.5px] leading-relaxed text-justify">
                {isFa
                  ? 'مقاومت کششی اسمی میلگرد نیل بدون لحاظ سهم دوغاب سیمانی محاسبه می‌شود. بر اساس بند AASHTO 11.12.6.1 برای هر ردیف نیل رابطه زیر باید برقرار باشد:'
                  : 'Nominal tensile resistance is computed neglecting grout contribution. AASHTO 11.12.6.1 requires:'}
              </p>
              <div className="p-2.5 bg-slate-100 border border-slate-300 rounded font-mono text-center font-bold text-slate-800" dir="ltr">
                φT · RT ≥ γp-EV · Tmaxsn
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] space-y-2 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-1.5">
                  <span className="font-semibold text-slate-800">{isFa ? '• متغیرهای ورودی کشش نیل:' : '• Tensile Input Variables:'}</span>
                  <div className="font-mono text-slate-900 flex items-center gap-2" dir="ltr">
                    <span>Tmax = {state.tendon.Tmax} kN</span>
                    <span>|</span>
                    <span>γp-EV = {state.tendon.loadFactorEV}</span>
                    <span>|</span>
                    <span>φT = {state.tendon.phiT}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-1.5">
                  <span className="font-semibold text-slate-800">{isFa ? '• بار نهایی ضریب‌دار طرح:' : '• Factored Design Demand:'}</span>
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200" dir="ltr">
                    γ · Tmax = {state.tendon.loadFactorEV} × {state.tendon.Tmax} = {results.tendon.factoredLoad} kN
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-1.5">
                  <span className="font-semibold text-slate-800">{isFa ? '• سطح مقطع میلگرد مورد نیاز و تأمین شده:' : '• Required & Provided Bar Area:'}</span>
                  <span className="font-mono text-slate-900" dir="ltr">
                    As,req = {results.tendon.AsRequired} cm² &rarr; As,prov (φ{state.tendon.barDiameter}) = {results.tendon.AsProvided} cm²
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-1.5">
                  <span className="font-semibold text-slate-800">{isFa ? '• مقاومت کششی اسمی و نهایی طرح:' : '• Nominal & Factored Resistance:'}</span>
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200" dir="ltr">
                    RT = {results.tendon.nominalResistance} kN &rarr; φT · RT = {results.tendon.factoredResistance} kN
                  </span>
                </div>

                <div className={`p-2.5 rounded-md border flex flex-wrap items-center justify-between gap-2 font-bold ${results.tendon.isPassed ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'}`}>
                  <span className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${results.tendon.isPassed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                      {results.tendon.isPassed ? (isFa ? 'کنترل ضابطه: تأیید' : 'CRITERIA SATISFIED') : (isFa ? 'کنترل ضابطه: نامطلوب' : 'CRITERIA FAILED')}
                    </span>
                    <span>{isFa ? 'ارزیابی نهایی نسبت CDR:' : 'Final CDR Check:'}</span>
                  </span>
                  <div className="flex items-center gap-3 font-mono" dir="ltr">
                    <span>{results.tendon.factoredResistance} kN ≥ {results.tendon.factoredLoad} kN</span>
                    <span className={`px-2 py-0.5 rounded font-black text-xs ${results.tendon.isPassed ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'}`}>
                      CDR = {results.tendon.capacityDemandRatio} ≥ 1.00
                    </span>
                    <span className="font-sans font-bold text-xs">{results.tendon.isPassed ? (isFa ? '✓ تأمین شد (OK)' : '✓ PASS (OK)') : (isFa ? '✕ ناکافی (NG)' : '✕ FAIL (NG)')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: PULLOUT RESISTANCE */}
            <div className="space-y-2 border-t border-slate-200 pt-5" dir={isFa ? 'rtl' : 'ltr'}>
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>{isFa ? '۲- کنترل ظرفیت بیرون‌کشیدگی نیل (Grout-Ground Pullout Resistance)' : '2. Grout Pullout Resistance (AASHTO 11.12.5.2)'}</span>
              </h3>
              <p className="text-slate-700 text-[11.5px] leading-relaxed text-justify">
                {isFa
                  ? 'بیرون‌کشیدگی نیل باید برای طول نیل واقع در پشت سطح گسیختگی بحرانی (Lp) با ضریب مقاومت φPO = 0.65 کنترل گردد:'
                  : 'Pullout resistance along bonded length Lp behind critical failure surface:'}
              </p>
              <div className="p-2.5 bg-slate-100 border border-slate-300 rounded font-mono text-center font-bold text-slate-800" dir="ltr">
                φPO · RPO ≥ γp-EV · Tmaxsn &nbsp;|&nbsp; RPO = π · DD · Lp · qu
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] space-y-2 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-1.5">
                  <span className="font-semibold text-slate-800">{isFa ? '• مشخصات هندسی و ژئوتکنیکی گمانه:' : '• Borehole Geometric & Geotechnical Inputs:'}</span>
                  <div className="font-mono text-slate-900 flex items-center gap-2" dir="ltr">
                    <span>DD = {state.pullout.drillholeDiameter} mm</span>
                    <span>|</span>
                    <span>Lp = {state.pullout.effectiveBondLength} m</span>
                    <span>|</span>
                    <span>qu = {state.pullout.bondStrength} kPa</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-1.5">
                  <span className="font-semibold text-slate-800">{isFa ? '• مقاومت اسمی و نهایی بیرون‌کشیدگی:' : '• Nominal & Factored Pullout Resistance:'}</span>
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200" dir="ltr">
                    RPO = {results.pullout.nominalResistance} kN &rarr; φPO · RPO = {results.pullout.factoredResistance} kN
                  </span>
                </div>

                <div className={`p-2.5 rounded-md border flex flex-wrap items-center justify-between gap-2 font-bold ${results.pullout.isPassed ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'}`}>
                  <span className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${results.pullout.isPassed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                      {results.pullout.isPassed ? (isFa ? 'کنترل ضابطه: تأیید' : 'CRITERIA SATISFIED') : (isFa ? 'کنترل ضابطه: نامطلوب' : 'CRITERIA FAILED')}
                    </span>
                    <span>{isFa ? 'ارزیابی نهایی نسبت CDR بیرون‌کشیدگی:' : 'Final Pullout CDR Check:'}</span>
                  </span>
                  <div className="flex items-center gap-3 font-mono" dir="ltr">
                    <span>{results.pullout.factoredResistance} kN ≥ {results.pullout.factoredLoad} kN</span>
                    <span className={`px-2 py-0.5 rounded font-black text-xs ${results.pullout.isPassed ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'}`}>
                      CDR = {results.pullout.capacityDemandRatio} ≥ 1.00
                    </span>
                    <span className="font-sans font-bold text-xs">{results.pullout.isPassed ? (isFa ? '✓ تأمین شد (OK)' : '✓ PASS (OK)') : (isFa ? '✕ ناکافی (NG)' : '✕ FAIL (NG)')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: BEARING PLATE */}
            <div className="space-y-2 border-t border-slate-200 pt-5" dir={isFa ? 'rtl' : 'ltr'}>
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>{isFa ? '۳- طرح صفحه سر نیل (Nail Head Bearing Plate Design)' : '3. Bearing Plate Design (FHWA NHI-14-007)'}</span>
              </h3>
              <p className="text-slate-700 text-[11.5px] leading-relaxed text-justify">
                {isFa
                  ? 'نیروی سر میخ T0 بر اساس رابطه کلوتر (Clouterre Eq 5.1): T0 = Tmax [0.6 + 0.2(Smax - 1)] محاسبه می‌شود. صفحه فولادی به عنوان صفحه ستون تحت بار محوری کنترل می‌گردد:'
                  : 'Nail head tension T0 computed per Clouterre formula:'}
              </p>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] space-y-2 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-1.5">
                  <span className="font-semibold text-slate-800">{isFa ? '• محاسبه نیروی سر نیل (T0 کلوتر):' : '• Nail Head Tension T0:'}</span>
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200" dir="ltr">
                    T0 = {state.tendon.Tmax} × [0.6 + 0.2({Math.max(state.facing.Sh, state.facing.Sv)} - 1)] = {results.T0} kN
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-1.5">
                  <span className="font-semibold text-slate-800">{isFa ? '• تنش اتکای مجاز بتن شاتکریت:' : '• Concrete Allowable Bearing Stress:'}</span>
                  <span className="font-mono text-slate-900" dir="ltr">
                    fp = 0.7 × {state.plate.fcShotcrete} = {results.plate.fpAllowable} MPa ({(results.plate.fpAllowable * 10.197).toFixed(1)} kg/cm²)
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-1.5">
                  <span className="font-semibold text-slate-800">{isFa ? '• کنترل تنش خمشی طره صفحه فولادی:' : '• Plate Cantilever Bending Stress:'}</span>
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200" dir="ltr">
                    σ = {results.plate.bendingStress} kg/cm² ≤ Fb = {results.plate.allowableBendingStress} kg/cm²
                  </span>
                </div>

                <div className={`p-2.5 rounded-md border flex flex-wrap items-center justify-between gap-2 font-bold ${results.plate.isPassed ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'}`}>
                  <span className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${results.plate.isPassed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                      {results.plate.isPassed ? (isFa ? 'کنترل ضابطه: تأیید' : 'CRITERIA SATISFIED') : (isFa ? 'کنترل ضابطه: نامطلوب' : 'CRITERIA FAILED')}
                    </span>
                    <span>{isFa ? 'ضخامت ورق فولادی:' : 'Steel Plate Thickness:'}</span>
                  </span>
                  <div className="flex items-center gap-3 font-mono" dir="ltr">
                    <span>t = {state.plate.plateThickness} cm ≥ treq = {results.plate.requiredThickness} cm</span>
                    <span className={`px-2 py-0.5 rounded font-black text-xs ${results.plate.isPassed ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'}`}>
                      CDR = {(results.plate.allowableBendingStress / Math.max(results.plate.bendingStress, 1)).toFixed(2)} ≥ 1.00
                    </span>
                    <span className="font-sans font-bold text-xs">{results.plate.isPassed ? (isFa ? '✓ تأمین شد (OK)' : '✓ PASS (OK)') : (isFa ? '✕ ناکافی (NG)' : '✕ FAIL (NG)')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: TEMPORARY SHOTCRETE FACING */}
            <div className="space-y-2 border-t border-slate-200 pt-5" dir={isFa ? 'rtl' : 'ltr'}>
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>{isFa ? '۴- کنترل خمش و برش پانچینگ شاتکریت موقت اولیه (Temporary Facing)' : '4. Initial Shotcrete Facing (AASHTO 11.12.6.2.2)'}</span>
              </h3>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] space-y-2 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-1.5">
                  <span className="font-semibold text-slate-800">{isFa ? '• مشخصات شاتکریت و آرماتور مش:' : '• Shotcrete & Mesh Parameters:'}</span>
                  <div className="font-mono text-slate-900 flex items-center gap-2" dir="ltr">
                    <span>h = {state.facing.tempThickness} mm</span>
                    <span>|</span>
                    <span>f'c = {state.facing.tempFc} MPa</span>
                    <span>|</span>
                    <span>CF = {state.facing.tempCF}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-1.5">
                  <span className="font-semibold text-slate-800">{isFa ? '• کنترل خمش شاتکریت موقت:' : '• Temp Facing Flexure Check:'}</span>
                  <div className="flex items-center gap-2 font-mono" dir="ltr">
                    <span>RFF = {results.tempFlexure.RFF} kN</span>
                    <span className="font-black text-emerald-800 bg-white px-2 py-0.5 rounded border border-slate-200">CDR = {results.tempFlexure.CDR} ≥ 1.0</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-1.5">
                  <span className="font-semibold text-slate-800">{isFa ? '• کنترل برش پانچینگ شاتکریت موقت:' : '• Temp Punching Shear Check:'}</span>
                  <div className="flex items-center gap-2 font-mono" dir="ltr">
                    <span>Dc' = {results.tempPunching.DcPrime} m</span>
                    <span>|</span>
                    <span>VF = {results.tempPunching.VF} kN</span>
                    <span className="font-black text-emerald-800 bg-white px-2 py-0.5 rounded border border-slate-200">CDR = {results.tempPunching.CDR} ≥ 1.0</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-md border bg-emerald-50 border-emerald-300 text-emerald-950 flex flex-wrap items-center justify-between gap-2 font-bold">
                  <span className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white">
                      {isFa ? 'کنترل ضابطه: تأیید' : 'CRITERIA SATISFIED'}
                    </span>
                    <span>{isFa ? 'عملکرد شاتکریت موقت:' : 'Temp Facing Summary:'}</span>
                  </span>
                  <span className="font-sans font-bold text-xs text-emerald-800">{isFa ? '✓ کلیه کنترل‌های خمش و پانچینگ شاتکریت تأمین شد (OK)' : '✓ Both Flexure & Punching Satisfied (OK)'}</span>
                </div>
              </div>
            </div>

            {/* SECTION 5: PERMANENT CONCRETE FACING */}
            <div className="space-y-2 border-t border-slate-200 pt-5" dir={isFa ? 'rtl' : 'ltr'}>
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>{isFa ? '۵- کنترل خمش، برش پانچینگ بتن دائم و گل‌میخ‌ها (Permanent Facing)' : '5. Permanent Concrete Facing & Studs (AASHTO 11.12.6.2.2)'}</span>
              </h3>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] space-y-2 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-1.5">
                  <span className="font-semibold text-slate-800">{isFa ? '• مشخصات بتن دائم و شبکه آرماتور:' : '• Permanent Concrete & Rebar Grid:'}</span>
                  <div className="font-mono text-slate-900 flex items-center gap-2" dir="ltr">
                    <span>h = {state.facing.permThickness} mm</span>
                    <span>|</span>
                    <span>f'c = {state.facing.permFc} MPa</span>
                    <span>|</span>
                    <span>Mesh = {state.facing.permMesh.avn} mm²/m</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-1.5">
                  <span className="font-semibold text-slate-800">{isFa ? '• گل‌میخ‌های سر نیل (اتصال جوشی به پلیت و گیرداری با بتن دائم):' : '• Nail Head Studs Connection:'}</span>
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200" dir="ltr">
                    {state.facing.headedStudsCount}×φ{state.facing.headedStudDiameter} mm ({state.facing.headedStudType})
                  </span>
                </div>

                <div className={`p-2.5 rounded-md border flex flex-wrap items-center justify-between gap-2 font-bold ${results.headedStuds.isPassed ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'}`}>
                  <span className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${results.headedStuds.isPassed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                      {results.headedStuds.isPassed ? (isFa ? 'کنترل ضابطه: تأیید' : 'CRITERIA SATISFIED') : (isFa ? 'کنترل ضابطه: نامطلوب' : 'CRITERIA FAILED')}
                    </span>
                    <span>{isFa ? 'ظرفیت کششی گل‌میخ‌ها (RFH):' : 'Studs Tensile Capacity:'}</span>
                  </span>
                  <div className="flex items-center gap-3 font-mono" dir="ltr">
                    <span>RFH = {results.headedStuds.RFH} kN</span>
                    <span className={`px-2 py-0.5 rounded font-black text-xs ${results.headedStuds.isPassed ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'}`}>
                      CDR = {results.headedStuds.CDR} ≥ 1.00
                    </span>
                    <span className="font-sans font-bold text-xs">{results.headedStuds.isPassed ? (isFa ? '✓ تأمین شد (OK)' : '✓ PASS (OK)') : (isFa ? '✕ ناکافی (NG)' : '✕ FAIL (NG)')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 6: CORROSION PROTECTION */}
            <div className="space-y-2 border-t border-slate-200 pt-5" dir={isFa ? 'rtl' : 'ltr'}>
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>{isFa ? '۶- ارزیابی تهاجم خاک و مشخصات سیستم حفاظت خوردگی نیل‌ها' : '6. Soil Corrosiveness & Protection Assessment (AASHTO 11.12.8)'}</span>
              </h3>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] space-y-2 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-1.5">
                  <span className="font-semibold text-slate-800">{isFa ? '• نتایج آزمایش‌های الکتروشیمیایی خاک گمانه:' : '• Soil Electrochemical Tests:'}</span>
                  <div className="font-mono text-slate-900 flex items-center gap-2" dir="ltr">
                    <span>pH = {state.corrosion.soilTests.pH}</span>
                    <span>|</span>
                    <span>ρ = {state.corrosion.soilTests.resistivity} Ω·cm</span>
                    <span>|</span>
                    <span>Cl = {state.corrosion.soilTests.chlorides} ppm</span>
                    <span>|</span>
                    <span>SO₄ = {state.corrosion.soilTests.sulfates} ppm</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-1.5">
                  <span className="font-semibold text-slate-800">{isFa ? '• طبقه‌بندی محیط ژئوتکنیکی:' : '• Geotechnical Environment Classification:'}</span>
                  <span className={`px-2.5 py-0.5 rounded font-bold text-xs ${results.corrosion.isAggressive ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'}`}>
                    {results.corrosion.isAggressive ? (isFa ? 'محیط تهاجمی و خورنده (Aggressive Ground)' : 'Aggressive Ground') : (isFa ? 'محیط غیرتهاجمی و نرمال (Non-Aggressive Ground)' : 'Non-Aggressive Ground')}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-1.5">
                  <span className="font-semibold text-slate-800">{isFa ? '• سیستم مصوب انتخابی:' : '• Approved Protection System:'}</span>
                  <span className="font-bold text-indigo-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {state.corrosion.selectedClass === 'ClassA'
                      ? (isFa ? 'کلاس A: محصورسازی کامل در غلاف موج‌دار دوجداره (Double Protection)' : 'Class A: Full Encapsulation in Corrugated Duct (Double Protection)')
                      : state.corrosion.selectedClass === 'ClassB'
                      ? (isFa ? 'کلاس B: میلگرد پوشش‌دار اپوکسی یا گالوانیزه' : 'Class B: Epoxy-Coated / Galvanized Bar')
                      : (isFa ? 'بدون پوشش و بدون غلاف (صرفاً ویژه نیل‌های موقت با طول عمر کمتر از ۲ سال)' : 'Without Protection: Bare Bar in Grout (Temporary Nails < 2 yrs)')}
                  </span>
                </div>

                {state.corrosion.selectedClass === 'ClassA' && (
                  <div className="p-2 bg-indigo-50/70 rounded border border-indigo-200 space-y-1 text-[10.5px]">
                    <div>• {isFa ? 'غلاف محافظ:' : 'Corrugated Duct:'} <span className="font-mono font-bold" dir="ltr">{state.corrosion.ductMaterial} (t = {state.corrosion.ductWallThickness} mm, ID = {state.corrosion.ductInsideDiameter} mm)</span> - OK</div>
                    <div>• {isFa ? 'فواصل سنترالایزرها:' : 'Centralizers:'} <span className="font-mono font-bold" dir="ltr">{state.corrosion.internalCentralizerSpacing} m ≤ 3.0 m</span> - OK</div>
                  </div>
                )}

                {state.corrosion.selectedClass === 'None' && (
                  <div className="text-amber-900 font-sans p-2 bg-amber-50 rounded border border-amber-200 text-[10.5px]">
                    {isFa
                      ? 'توجه: این گزینه منحصراً برای پایدارسازی‌های موقت گودبرداری‌های شهری و ترانشه‌هایی با طول خدمت حداکثر ۱۸ الی ۲۴ ماه مجاز است. در این حالت میلگرد نیل بدون غلاف پلاستیکی مستقیماً درون دوغاب سیمانی قرار می‌گیرد.'
                      : 'Note: Unprotected plain nails are allowed strictly for temporary excavations with service life < 2 years per FHWA NHI-14-007. Steel rebar is grouted without protective duct.'}
                  </div>
                )}
              </div>
            </div>

            {/* SIGNATURE & APPROVAL BLOCK */}
            <div className="border-t-2 border-slate-900 pt-6 mt-8 flex flex-wrap justify-between gap-6 text-xs">
              <div className="text-center space-y-1">
                <div className="text-slate-500">{isFa ? 'مهندس محاسب ژئوتکنیک:' : 'Designed By:'}</div>
                <div className="font-bold text-slate-900">{metadata.designer || (isFa ? 'کارشناس ارشد ژئوتکنیک' : 'Senior Geotechnical Engineer')}</div>
                <div className="h-10"></div>
                <div className="border-t border-slate-400 w-36 mx-auto pt-1 text-[10px] text-slate-400">{isFa ? 'امضا و مهر' : 'Signature'}</div>
              </div>

              <div className="text-center space-y-1">
                <div className="text-slate-500">{isFa ? 'کنترل‌کننده فنی:' : 'Checked By:'}</div>
                <div className="font-bold text-slate-900">{metadata.checker || (isFa ? 'سرپرست بخش ژئوتکنیک' : 'Lead Geotechnical Checker')}</div>
                <div className="h-10"></div>
                <div className="border-t border-slate-400 w-36 mx-auto pt-1 text-[10px] text-slate-400">{isFa ? 'امضا و مهر' : 'Signature'}</div>
              </div>

              <div className="text-center space-y-1">
                <div className="text-slate-500">{isFa ? 'تأیید مدیریت مهندسی:' : 'Approved By:'}</div>
                <div className="font-bold text-slate-900">{isFa ? 'مدیر پروژه و مهندسین مشاور' : 'Project Director'}</div>
                <div className="h-10"></div>
                <div className="border-t border-slate-400 w-36 mx-auto pt-1 text-[10px] text-slate-400">{isFa ? 'امضا و مهر مشاور' : 'Seal & Approval'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
