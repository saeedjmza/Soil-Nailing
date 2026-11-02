/**
 * Interactive Engineering CAD Diagrams for Soil Nail Design
 * Includes: Nail Head Assembly Detail & Borehole Encapsulation Cross-Section
 */
import React, { useState } from 'react';
import { DesignState, FullCalculationResults, Language } from '../types/nailing';
import { Layers, Eye, Compass, ZoomIn } from 'lucide-react';

interface Props {
  state: DesignState;
  results: FullCalculationResults;
  lang: Language;
}

export const InteractiveCrossSectionSvg: React.FC<Props> = ({ state, results, lang }) => {
  const [viewMode, setViewMode] = useState<'both' | 'head' | 'borehole'>('both');
  const [showPunchingCone, setShowPunchingCone] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);

  const isFa = lang === 'fa';
  const { tendon, pullout, plate, facing, corrosion } = state;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Top Controls Bar */}
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>{isFa ? 'نقشه‌های اجرایی و مقاطع مهندسی سیستم نیلینگ' : 'Soil Nail Engineering CAD Cross-Sections'}</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="bg-white border border-slate-300 rounded-lg p-0.5 flex">
            <button
              onClick={() => setViewMode('both')}
              className={`px-2.5 py-1 rounded-md transition-colors ${viewMode === 'both' ? 'bg-blue-600 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {isFa ? 'هر دو مقطع' : 'Both Views'}
            </button>
            <button
              onClick={() => setViewMode('head')}
              className={`px-2.5 py-1 rounded-md transition-colors ${viewMode === 'head' ? 'bg-blue-600 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {isFa ? 'اتصال سر نیل' : 'Nail Head'}
            </button>
            <button
              onClick={() => setViewMode('borehole')}
              className={`px-2.5 py-1 rounded-md transition-colors ${viewMode === 'borehole' ? 'bg-blue-600 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {isFa ? 'مقطع گمانه' : 'Borehole'}
            </button>
          </div>

          <button
            onClick={() => setShowPunchingCone(!showPunchingCone)}
            className={`px-2.5 py-1 rounded-md border text-xs flex items-center gap-1 transition-colors ${
              showPunchingCone ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isFa ? 'مخروط برش پانچ ۴۵°' : '45° Punching Cone'}</span>
          </button>

          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className={`px-2.5 py-1 rounded-md border text-xs flex items-center gap-1 transition-colors ${
              showDimensions ? 'bg-indigo-50 border-indigo-300 text-indigo-800' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{isFa ? 'خطوط اندازه' : 'Dimensions'}</span>
          </button>
        </div>
      </div>

      <div className={`p-4 grid gap-6 ${viewMode === 'both' ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
        {/* DIAGRAM 1: NAIL HEAD CONNECTION & FACING ASSEMBLY */}
        {(viewMode === 'both' || viewMode === 'head') && (
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-900 text-slate-100 relative">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2 border-b border-slate-800 pb-1.5">
              <span>{isFa ? 'جزئیات مونتاژ سر نیل، پلیت و پوشش‌های سطحی (AASHTO / FHWA)' : 'Nail Head Connection Assembly & Facing Detail'}</span>
              <span className="text-emerald-400 font-mono text-[11px]">CDR Flex={results.tempFlexure.CDR} | CDR Punch={results.tempPunching.CDR}</span>
            </div>

            <svg viewBox="0 0 760 450" className="w-full h-auto max-h-[460px] bg-slate-950 rounded select-none font-sans">
              <defs>
                {/* Patterns */}
                <pattern id="soilPattern" width="22" height="22" patternUnits="userSpaceOnUse">
                  <path d="M 0,11 L 11,0 M 11,22 L 22,11" stroke="#475569" strokeWidth="1" strokeOpacity="0.35" />
                  <circle cx="5" cy="16" r="1" fill="#64748b" fillOpacity="0.4" />
                  <circle cx="16" cy="6" r="1" fill="#64748b" fillOpacity="0.4" />
                </pattern>
                <pattern id="shotcretePattern" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="4" cy="4" r="1.5" fill="#94a3b8" fillOpacity="0.4" />
                  <circle cx="12" cy="10" r="1.2" fill="#cbd5e1" fillOpacity="0.4" />
                  <path d="M 2,12 L 8,14" stroke="#64748b" strokeWidth="0.8" strokeOpacity="0.4" />
                </pattern>
                <pattern id="concretePattern" width="22" height="22" patternUnits="userSpaceOnUse">
                  <polygon points="3,3 6,8 2,9" fill="#94a3b8" fillOpacity="0.35" />
                  <circle cx="16" cy="14" r="1.5" fill="#cbd5e1" fillOpacity="0.35" />
                  <polygon points="12,4 17,6 15,10" fill="#64748b" fillOpacity="0.35" />
                </pattern>
                <marker id="arrowHead" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
                </marker>
                <marker id="dimArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                  <path d="M 0 2 L 6 5 L 0 8 z" fill="#94a3b8" />
                </marker>
              </defs>

              <style>{`
                .cad-halo {
                  paint-order: stroke fill;
                  stroke: #020617;
                  stroke-width: 3.5px;
                  stroke-linecap: round;
                  stroke-linejoin: round;
                }
              `}</style>

              {/* BACKGROUND ZONES */}
              {/* Zone 1: Soil / Ground (x=0 to 170) */}
              <rect x="0" y="45" width="170" height="360" fill="#1e293b" />
              <rect x="0" y="45" width="170" height="360" fill="url(#soilPattern)" />

              {/* Zone 2: Geocomposite Strip Drain behind facing (x=164 to 172) */}
              <rect x="164" y="55" width="8" height="340" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.5" />

              {/* Zone 3: Temporary Shotcrete Layer (x=172 to 272, width=100) */}
              <rect x="172" y="45" width="100" height="360" fill="#334155" />
              <rect x="172" y="45" width="100" height="360" fill="url(#shotcretePattern)" />

              {/* Zone 4: Permanent Concrete Facing (x=272 to 432, width=160) */}
              <rect x="272" y="45" width="160" height="360" fill="#1e293b" opacity="0.95" stroke="#475569" strokeWidth="1" />
              <rect x="272" y="45" width="160" height="360" fill="url(#concretePattern)" />

              {/* Drillhole / Grout column penetration into soil (y=175 to 265, nail axis at y=220) */}
              <polygon points="0,175 172,175 172,265 0,265" fill="#475569" stroke="#64748b" strokeWidth="1.5" />

              {/* Encapsulation duct in borehole (Class A) */}
              {corrosion.selectedClass === 'ClassA' && (
                <g>
                  <rect x="0" y="190" width="166" height="8" fill="#10b981" stroke="#34d399" strokeWidth="1" />
                  <rect x="0" y="242" width="166" height="8" fill="#10b981" stroke="#34d399" strokeWidth="1" />
                </g>
              )}

              {/* Central Steel Tendon Bar passing through into facing */}
              <rect x="0" y="212" width="324" height="16" fill="#2563eb" stroke="#93c5fd" strokeWidth="1.5" />

              {/* Shotcrete Wire Mesh (vertical line at x=222) */}
              <line x1="222" y1="55" x2="222" y2="395" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6,4" />
              <line x1="202" y1="110" x2="242" y2="110" stroke="#f59e0b" strokeWidth="2" />
              <line x1="202" y1="170" x2="242" y2="170" stroke="#f59e0b" strokeWidth="2" />
              <line x1="202" y1="270" x2="242" y2="270" stroke="#f59e0b" strokeWidth="2" />
              <line x1="202" y1="330" x2="242" y2="330" stroke="#f59e0b" strokeWidth="2" />

              {/* Waler reinforcement bars behind bearing plate (x=222, y=145 and y=295) */}
              <circle cx="222" cy="145" r="8" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.5" />
              <circle cx="222" cy="295" r="8" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.5" />

              {/* 45° Punching Shear Failure Cone (originate from bearing plate edges through shotcrete to soil interface) */}
              {showPunchingCone && (
                <g>
                  {/* Punching shear failure surfaces extending backwards at 45 deg */}
                  <line x1="268" y1="145" x2="172" y2="75" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="5,4" />
                  <line x1="268" y1="295" x2="172" y2="365" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="5,4" />
                  {/* Curvature of cone boundary at soil interface */}
                  <path d="M 172,75 C 158,140 158,300 172,365" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,3" />
                  
                  {/* Punching cone callout (in clear area on the left) */}
                  <line x1="172" y1="75" x2="110" y2="75" stroke="#f43f5e" strokeWidth="1" />
                  <circle cx="172" cy="75" r="2.5" fill="#f43f5e" />
                  <text x="105" y="78" fill="#fda4af" fontSize="10" fontWeight="bold" textAnchor="end" className="cad-halo">
                    {isFa ? `مخروط برش پانچ ۴۵° (Dc' = ${results.tempPunching.DcPrime} m)` : `45° Punching Cone (Dc' = ${results.tempPunching.DcPrime} m)`}
                  </text>
                </g>
              )}

              {/* Steel Bearing Plate (placed against outer face of shotcrete, x=268 to 284, height 150px) */}
              <rect x="268" y="145" width="16" height="150" fill="#f8fafc" stroke="#38bdf8" strokeWidth="2" rx="1.5" />

              {/* Beveled Hardened Washer (tight against bearing plate front face x=284) */}
              <polygon points="284,195 296,198 296,242 284,245" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1.2" />

              {/* Heavy Hex Nut (threaded onto tendon bar, x=296 to 318) */}
              <rect x="296" y="202" width="22" height="36" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" rx="2" />
              <line x1="307" y1="202" x2="307" y2="238" stroke="#94a3b8" strokeWidth="1" />

              {/* Tendon Bar protrusion beyond nut */}
              <rect x="318" y="214" width="12" height="12" fill="#3b82f6" stroke="#93c5fd" strokeWidth="1" />

              {/* HEADED STUDS WELDED TO BEARING PLATE & TIED TO PERMANENT REBAR GRID (AASHTO 11.12.6.2.3 / FHWA NHI-14-007) */}
              {/* IMPORTANT: Studs project from plate front face (x=284) and mechanically ENGAGE & TIE to the permanent facing rebar mesh (x=382) */}
              <g>
                {/* Fillet welds at stud base on bearing plate */}
                <polygon points="284,152 288,155 284,155" fill="#d97706" />
                <polygon points="284,168 288,165 284,165" fill="#d97706" />
                <polygon points="284,272 288,275 284,275" fill="#d97706" />
                <polygon points="284,288 288,285 284,285" fill="#d97706" />

                {/* Top Stud Shank: from plate x=284 to rebar grid at x=378 (length 94px) */}
                <rect x="284" y="155" width="94" height="10" fill="#fbbf24" stroke="#d97706" strokeWidth="1.2" />
                {/* Top Stud Head (Flange disc embedded behind/around permanent rebar) */}
                <rect x="378" y="148" width="10" height="24" rx="2" fill="#d97706" stroke="#b45309" strokeWidth="1.2" />

                {/* Bottom Stud Shank: from plate x=284 to rebar grid at x=378 (length 94px) */}
                <rect x="284" y="275" width="94" height="10" fill="#fbbf24" stroke="#d97706" strokeWidth="1.2" />
                {/* Bottom Stud Head (Flange disc embedded behind/around permanent rebar) */}
                <rect x="378" y="268" width="10" height="24" rx="2" fill="#d97706" stroke="#b45309" strokeWidth="1.2" />

                {/* Tie wire loops connecting stud head directly to the permanent facing rebar */}
                <ellipse cx="383" cy="160" rx="8" ry="15" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,2" />
                <ellipse cx="383" cy="280" rx="8" ry="15" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,2" />

                {/* Connection Nodes (Stud-to-Rebar Tie) */}
                <circle cx="383" cy="160" r="4.5" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
                <circle cx="383" cy="280" r="4.5" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />

                {/* Headed Studs & Tied Rebar Callout with Leader Line (upper right) */}
                <path d="M 388,155 L 460,115 L 490,115" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
                <circle cx="388" cy="155" r="3" fill="#fbbf24" />
                <g>
                  <text x="495" y="108" fill="#fbbf24" fontSize="11" fontWeight="bold" textAnchor="start" className="cad-halo">
                    {isFa ? 'اتصال گل‌میخ به آرماتور پوشش دائم (سیم آرماتوربندی/گیرداری)' : 'Stud Head Mechanically Tied to Perm. Rebar Grid'}
                  </text>
                  <text x="495" y="123" fill="#fde68a" fontSize="10" textAnchor="start" className="cad-halo">
                    {isFa
                      ? `${facing.headedStudsCount} عدد گل‌میخ φ${facing.headedStudDiameter} mm جوش روی پلیت و متصل به آرماتور دائم`
                      : `${facing.headedStudsCount}x Studs φ${facing.headedStudDiameter} mm welded to plate & tied to rebar`}
                  </text>
                  <text x="495" y="137" fill="#cbd5e1" fontSize="9" textAnchor="start" className="cad-halo">
                    {isFa ? `fy = ${facing.headedStudFy} MPa | رده ${facing.headedStudType} (AASHTO 11.12.6.2.3)` : `fy = ${facing.headedStudFy} MPa | Class ${facing.headedStudType} (AASHTO 11.12.6.2.3)`}
                  </text>
                </g>
              </g>

              {/* Permanent Facing Reinforcement Mesh (vertical line at x=383 with rebar cross-sections intersecting studs) */}
              <line x1="383" y1="55" x2="383" y2="395" stroke="#34d399" strokeWidth="2.5" strokeDasharray="5,4" />
              <circle cx="383" cy="100" r="5" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
              <circle cx="383" cy="160" r="5.5" fill="#059669" stroke="#34d399" strokeWidth="2" />
              <circle cx="383" cy="220" r="5" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
              <circle cx="383" cy="280" r="5.5" fill="#059669" stroke="#34d399" strokeWidth="2" />
              <circle cx="383" cy="340" r="5" fill="#059669" stroke="#34d399" strokeWidth="1.5" />

              {/* Permanent Facing Rebar Callout (Leader line from rebar to lower right) */}
              <path d="M 383,340 L 460,370 L 490,370" fill="none" stroke="#34d399" strokeWidth="1.2" />
              <circle cx="383" cy="340" r="2.5" fill="#34d399" />
              <text x="495" y="366" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="start" className="cad-halo">
                {isFa ? `شبکه آرماتور بتن دائم (${facing.permMesh.avn} mm²/m)` : `Perm. Facing Rebar Grid (${facing.permMesh.avn} mm²/m)`}
              </text>
              <text x="495" y="380" fill="#a7f3d0" fontSize="9" textAnchor="start" className="cad-halo">
                {isFa ? `مش φ${facing.permMesh.meshDiameter || 12}@${facing.permMesh.meshSpacing || 150} mm (متصل به گل‌میخ‌ها)` : `Mesh φ${facing.permMesh.meshDiameter || 12}@${facing.permMesh.meshSpacing || 150} mm (Tied to Studs)`}
              </text>

              {/* Nut & Washer Callout */}
              <path d="M 310,230 L 370,320 L 490,320" fill="none" stroke="#cbd5e1" strokeWidth="1.2" />
              <circle cx="310" cy="230" r="2.5" fill="#cbd5e1" />
              <text x="495" y="316" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="start" className="cad-halo">
                {isFa ? 'مهره و واشر زاویه‌دار سخت‌شده' : 'Hardened Beveled Washer & Nut'}
              </text>
              <text x="495" y="330" fill="#94a3b8" fontSize="9" textAnchor="start" className="cad-halo">
                {isFa ? 'مهار کامل تاندون روی پلیت' : 'Tendon to Plate Anchorage'}
              </text>

              {/* Bearing Plate Callout */}
              <path d="M 276,145 L 250,105 L 180,105" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="276" cy="145" r="3" fill="#38bdf8" />
              <text x="175" y="101" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="end" className="cad-halo">
                {isFa ? `پلیت فولادی ${plate.plateWidth}×${plate.plateWidth} cm` : `Plate ${plate.plateWidth}×${plate.plateWidth} cm`}
              </text>
              <text x="175" y="115" fill="#93c5fd" fontSize="9" textAnchor="end" className="cad-halo">
                {isFa ? `ضخامت t = ${Math.round(plate.plateThickness * 10)} mm (fy = ${plate.fyPlate} MPa)` : `t = ${Math.round(plate.plateThickness * 10)} mm (fy = ${plate.fyPlate} MPa)`}
              </text>

              {/* Waler Rebar Callout (Left side, uncrowded) */}
              <path d="M 222,145 L 170,145 L 120,145" fill="none" stroke="#ef4444" strokeWidth="1.2" />
              <circle cx="222" cy="145" r="2.5" fill="#ef4444" />
              <text x="115" y="142" fill="#fca5a5" fontSize="10" fontWeight="bold" textAnchor="end" className="cad-halo">
                {isFa ? 'آرماتورهای والیر تسلیح سر نیل (Waler)' : 'Waler Rebar Reinforcement'}
              </text>
              <text x="115" y="156" fill="#f87171" fontSize="9" textAnchor="end" className="cad-halo">
                {isFa ? `۲ شاخه φ${facing.tempMesh.walerBarDiameter || 16} mm` : `2x φ${facing.tempMesh.walerBarDiameter || 16} mm`}
              </text>

              {/* Shotcrete Wire Mesh Callout */}
              <path d="M 222,270 L 170,270 L 120,270" fill="none" stroke="#f59e0b" strokeWidth="1.2" />
              <circle cx="222" cy="270" r="2.5" fill="#f59e0b" />
              <text x="115" y="267" fill="#fcd34d" fontSize="10" fontWeight="bold" textAnchor="end" className="cad-halo">
                {isFa ? `مش فولادی شاتکریت (${facing.tempMesh.avn} mm²/m)` : `Shotcrete Wire Mesh (${facing.tempMesh.avn} mm²/m)`}
              </text>
              <text x="115" y="281" fill="#fbbf24" fontSize="9" textAnchor="end" className="cad-halo">
                {isFa ? `شبکه φ${facing.tempMesh.meshDiameter || 6}@${facing.tempMesh.meshSpacing || 150} mm` : `φ${facing.tempMesh.meshDiameter || 6}@${facing.tempMesh.meshSpacing || 150} mm`}
              </text>

              {/* Geocomposite Strip Drain Callout (Bottom Left) */}
              <path d="M 168,370 L 130,370 L 100,370" fill="none" stroke="#0284c7" strokeWidth="1" />
              <circle cx="168" cy="370" r="2" fill="#0284c7" />
              <text x="95" y="373" fill="#38bdf8" fontSize="9.5" textAnchor="end" className="cad-halo">
                {isFa ? 'نوار ژئوکامپوزیت زهکش پشت شاتکریت' : 'Prefabricated Strip Drain'}
              </text>

              {/* Tension Force Arrow (T0) Vector at Nail Axis outside wall */}
              <g>
                <line x1="432" y1="220" x2="570" y2="220" stroke="#38bdf8" strokeWidth="3.5" markerEnd="url(#arrowHead)" />
                <rect x="470" y="195" width="200" height="22" rx="4" fill="#0f172a" fillOpacity="0.85" stroke="#0284c7" strokeWidth="1" />
                <text x="570" y="210" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle" className="cad-halo">
                  {isFa ? `نیروی طراحی کشش T0 = ${results.T0} kN` : `Tension Load T0 = ${results.T0} kN`}
                </text>
                <text x="570" y="233" fill="#94a3b8" fontSize="9" textAnchor="middle" className="cad-halo">
                  {isFa ? 'بار ضریب‌دار ترکیبی AASHTO Strength I' : 'AASHTO Strength I Factored Force'}
                </text>
              </g>

              {/* ZONE HEADERS (Top Bar with crisp background badges, spaced widely to prevent ANY collision) */}
              {/* Header 1: Soil */}
              <g transform="translate(85, 34)">
                <rect x="-65" y="-12" width="130" height="20" rx="4" fill="#0f172a" fillOpacity="0.85" stroke="#334155" strokeWidth="1" />
                <text x="0" y="2" fill="#94a3b8" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                  {isFa ? 'توده خاک / ترانشه' : 'Retained Soil'}
                </text>
              </g>

              {/* Header 2: Temporary Shotcrete */}
              <g transform="translate(222, 34)">
                <rect x="-60" y="-12" width="120" height="20" rx="4" fill="#0f172a" fillOpacity="0.85" stroke="#475569" strokeWidth="1" />
                <text x="0" y="2" fill="#cbd5e1" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                  {isFa ? `شاتکریت موقت (${facing.tempThickness}mm)` : `Shotcrete (${facing.tempThickness}mm)`}
                </text>
              </g>

              {/* Header 3: Permanent Facing */}
              <g transform="translate(352, 34)">
                <rect x="-65" y="-12" width="130" height="20" rx="4" fill="#0f172a" fillOpacity="0.85" stroke="#475569" strokeWidth="1" />
                <text x="0" y="2" fill="#67e8f9" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                  {isFa ? `بتن نهایی دائم (${facing.permThickness}mm)` : `Perm. Facing (${facing.permThickness}mm)`}
                </text>
              </g>

              {/* ENGINEERING DIMENSION LINES */}
              {showDimensions && (
                <g>
                  {/* Shotcrete Thickness: hi */}
                  <line x1="172" y1="14" x2="272" y2="14" stroke="#94a3b8" strokeWidth="1.2" markerStart="url(#dimArrow)" markerEnd="url(#dimArrow)" />
                  <line x1="172" y1="8" x2="172" y2="20" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="272" y1="8" x2="272" y2="20" stroke="#94a3b8" strokeWidth="1" />
                  <rect x="202" y="5" width="40" height="15" rx="3" fill="#020617" fillOpacity="0.9" />
                  <text x="222" y="16" fill="#38bdf8" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                    hi={facing.tempThickness}
                  </text>

                  {/* Permanent Facing Thickness: hf */}
                  <line x1="272" y1="14" x2="432" y2="14" stroke="#94a3b8" strokeWidth="1.2" markerStart="url(#dimArrow)" markerEnd="url(#dimArrow)" />
                  <line x1="432" y1="8" x2="432" y2="20" stroke="#94a3b8" strokeWidth="1" />
                  <rect x="332" y="5" width="40" height="15" rx="3" fill="#020617" fillOpacity="0.9" />
                  <text x="352" y="16" fill="#67e8f9" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                    hf={facing.permThickness}
                  </text>

                  {/* Plate Height: B */}
                  <line x1="254" y1="145" x2="254" y2="295" stroke="#38bdf8" strokeWidth="1.2" markerStart="url(#dimArrow)" markerEnd="url(#dimArrow)" />
                  <line x1="248" y1="145" x2="260" y2="145" stroke="#38bdf8" strokeWidth="1" />
                  <line x1="248" y1="295" x2="260" y2="295" stroke="#38bdf8" strokeWidth="1" />
                  <rect x="238" y="210" width="32" height="16" rx="3" fill="#020617" fillOpacity="0.9" />
                  <text x="254" y="222" fill="#38bdf8" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                    B={plate.plateWidth}
                  </text>
                </g>
              )}
            </svg>
          </div>
        )}

        {/* DIAGRAM 2: BOREHOLE & DUCT CROSS-SECTION */}
        {(viewMode === 'both' || viewMode === 'borehole') && (
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-900 text-slate-100 relative">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2 border-b border-slate-800 pb-1.5">
              <span>
                {isFa
                  ? `مقطع عرضی گمانه نیل (${corrosion.selectedClass === 'ClassA' ? 'کلاس A: محصورسازی دوبل' : corrosion.selectedClass === 'ClassB' ? 'کلاس B: میلگرد پوشش‌دار' : 'بدون غلاف محافظ - نیل موقت'})`
                  : `Borehole Cross-Section (${corrosion.selectedClass === 'ClassA' ? 'Class A Encapsulation' : corrosion.selectedClass === 'ClassB' ? 'Class B Coated Bar' : 'Bare Bar (Temporary)'})`}
              </span>
              <span className="text-emerald-400 font-mono text-[11px]">DD = {pullout.drillholeDiameter} mm | Bar = φ{tendon.barDiameter}</span>
            </div>

            <svg viewBox="0 0 500 450" className="w-full h-auto max-h-[460px] bg-slate-950 rounded select-none font-sans">
              <defs>
                <marker id="dimArrow2" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                  <path d="M 0 2 L 6 5 L 0 8 z" fill="#60a5fa" />
                </marker>
              </defs>

              <style>{`
                .cad-halo-sm {
                  paint-order: stroke fill;
                  stroke: #020617;
                  stroke-width: 3px;
                  stroke-linecap: round;
                  stroke-linejoin: round;
                }
              `}</style>

              {/* Center of borehole at (250, 225) */}
              {/* Outer Soil Boundary */}
              <circle cx="250" cy="225" r="185" fill="#1e293b" stroke="#334155" strokeWidth="2" strokeDasharray="6,4" />
              <rect x="150" y="30" width="200" height="22" rx="4" fill="#0f172a" fillOpacity="0.85" stroke="#334155" strokeWidth="1" />
              <text x="250" y="45" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">
                {isFa ? 'توده خاک اطراف گمانه (In-situ Ground)' : 'In-situ Surrounding Soil'}
              </text>

              {/* Borehole Wall (Diameter DD) -> r = 135 */}
              <circle cx="250" cy="225" r="135" fill="#334155" stroke="#60a5fa" strokeWidth="2.5" />

              {/* Centralizer Spacers (4 arms) */}
              <g stroke="#94a3b8" strokeWidth="3">
                <line x1="250" y1="90" x2="250" y2="135" />
                <line x1="250" y1="360" x2="250" y2="315" />
                <line x1="115" y1="225" x2="160" y2="225" />
                <line x1="385" y1="225" x2="340" y2="225" />
              </g>

              {/* Annular Grout ring */}
              <circle cx="250" cy="225" r="135" fill="#475569" opacity="0.6" />

              {/* Class A Corrugated Duct */}
              {corrosion.selectedClass === 'ClassA' ? (
                <g>
                  {/* Corrugated Outer Ring */}
                  <circle cx="250" cy="225" r="88" fill="#10b981" stroke="#34d399" strokeWidth="3" />
                  {/* Corrugation waves effect */}
                  <circle cx="250" cy="225" r="83" fill="#047857" stroke="#059669" strokeWidth="1" strokeDasharray="4,3" />
                  {/* Inner Grout in Duct */}
                  <circle cx="250" cy="225" r="78" fill="#334155" stroke="#10b981" strokeWidth="2" />
                  {/* Internal Centralizer pads */}
                  <circle cx="250" cy="163" r="4" fill="#fbbf24" />
                  <circle cx="250" cy="287" r="4" fill="#fbbf24" />
                  <circle cx="188" cy="225" r="4" fill="#fbbf24" />
                  <circle cx="312" cy="225" r="4" fill="#fbbf24" />
                </g>
              ) : (
                /* Class B or None: Direct Grout */
                <circle cx="250" cy="225" r="130" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
              )}

              {/* Central Steel Tendon Rebar */}
              <circle cx="250" cy="225" r="42" fill="#2563eb" stroke="#93c5fd" strokeWidth="3" />
              {/* Rebar deformation ribs pattern */}
              <circle cx="250" cy="225" r="30" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3,3" />

              <text x="250" y="230" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle" className="cad-halo-sm">
                φ{tendon.barDiameter}
              </text>

              {/* CALLOUTS WITH SPACING */}
              {/* 1. Rebar Callout (Top Right) */}
              <path d="M 270,195 L 340,115 L 370,115" fill="none" stroke="#93c5fd" strokeWidth="1.2" />
              <circle cx="270" cy="195" r="2.5" fill="#93c5fd" />
              <text x="375" y="112" fill="#93c5fd" fontSize="10.5" fontWeight="bold" className="cad-halo-sm">
                {isFa ? `میلگرد نیل فولادی (As=${results.tendon.AsProvided} cm²)` : `Steel Tendon (As=${results.tendon.AsProvided} cm²)`}
              </text>
              <text x="375" y="125" fill="#cbd5e1" fontSize="9" className="cad-halo-sm">
                {isFa ? `تنش تسلیم: fy = ${tendon.fy} MPa` : `Yield: fy = ${tendon.fy} MPa`}
              </text>

              {/* 2. Duct Callout (Top Left) */}
              {corrosion.selectedClass === 'ClassA' && (
                <>
                  <path d="M 230,140 L 160,85 L 120,85" fill="none" stroke="#34d399" strokeWidth="1.2" />
                  <circle cx="230" cy="140" r="2.5" fill="#34d399" />
                  <text x="115" y="82" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="end" className="cad-halo-sm">
                    {isFa ? `غلاف موج‌دار ${corrosion.ductMaterial} (کلاس A)` : `Corrugated ${corrosion.ductMaterial} Duct (Class A)`}
                  </text>
                  <text x="115" y="95" fill="#a7f3d0" fontSize="9" textAnchor="end" className="cad-halo-sm">
                    {isFa ? `ضخامت دیواره: ${corrosion.ductWallThickness}mm | قطر: ${corrosion.ductInsideDiameter}mm` : `t = ${corrosion.ductWallThickness}mm | ID = ${corrosion.ductInsideDiameter}mm`}
                  </text>

                  {/* Internal Centralizer */}
                  <path d="M 188,225 L 130,150 L 90,150" fill="none" stroke="#fbbf24" strokeWidth="1.2" />
                  <circle cx="188" cy="225" r="2.5" fill="#fbbf24" />
                  <text x="85" y="147" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="end" className="cad-halo-sm">
                    {isFa ? 'سنترالایزر داخلی (Internal Spacer)' : 'Internal Centralizer'}
                  </text>
                  <text x="85" y="160" fill="#fde68a" fontSize="9" textAnchor="end" className="cad-halo-sm">
                    {isFa ? 'فواصل ≤ ۳ متر جهت انطباق مرکز' : 'Spacing ≤ 3m'}
                  </text>
                </>
              )}

              {corrosion.selectedClass === 'ClassB' && (
                <>
                  <path d="M 250,183 L 170,90 L 120,90" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
                  <circle cx="250" cy="183" r="2.5" fill="#38bdf8" />
                  <text x="115" y="87" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="end" className="cad-halo-sm">
                    {isFa ? 'پوشش محافظ اپوکسی / گالوانیزه (کلاس B)' : 'Epoxy / Galvanized Bar Coating (Class B)'}
                  </text>
                  <text x="115" y="100" fill="#93c5fd" fontSize="9" textAnchor="end" className="cad-halo-sm">
                    {isFa ? 'پوشش اپوکسی الکترواستاتیک کارخانه‌ای' : 'Fusion-Bonded Epoxy Coating'}
                  </text>
                </>
              )}

              {corrosion.selectedClass === 'None' && (
                <>
                  <path d="M 250,183 L 170,90 L 120,90" fill="none" stroke="#f59e0b" strokeWidth="1.2" />
                  <circle cx="250" cy="183" r="2.5" fill="#f59e0b" />
                  <text x="115" y="87" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="end" className="cad-halo-sm">
                    {isFa ? 'دوغاب سیمانی مستقیم (نیل موقت < ۲ سال)' : 'Direct Grout without Duct (Temp Nail < 2 yrs)'}
                  </text>
                  <text x="115" y="100" fill="#fcd34d" fontSize="9" textAnchor="end" className="cad-halo-sm">
                    {isFa ? 'مطابق ضوابط FHWA NHI-14-007' : 'Per FHWA NHI-14-007 Guidelines'}
                  </text>
                </>
              )}

              {/* 3. Drillhole Callout (Bottom Right) */}
              <path d="M 345,320 L 390,345 L 420,345" fill="none" stroke="#60a5fa" strokeWidth="1.2" />
              <circle cx="345" cy="320" r="2.5" fill="#60a5fa" />
              <text x="425" y="342" fill="#60a5fa" fontSize="10.5" fontWeight="bold" className="cad-halo-sm">
                {isFa ? `جداره چال DD = ${pullout.drillholeDiameter} mm` : `Drillhole DD = ${pullout.drillholeDiameter} mm`}
              </text>
              <text x="425" y="355" fill="#93c5fd" fontSize="9" className="cad-halo-sm">
                {isFa ? 'قطر مته حفاری چال نیلینگ' : 'Borehole Drilling Diameter'}
              </text>

              {/* 4. External Centralizer Callout (Bottom Center) */}
              <path d="M 250,360 L 270,405 L 310,405" fill="none" stroke="#cbd5e1" strokeWidth="1.2" />
              <circle cx="250" cy="360" r="2.5" fill="#cbd5e1" />
              <text x="315" y="402" fill="#cbd5e1" fontSize="10" fontWeight="bold" className="cad-halo-sm">
                {isFa ? 'سنترالایزر خارجی (External Centralizer)' : 'External Centralizer (≤ 3m)'}
              </text>
              <text x="315" y="415" fill="#94a3b8" fontSize="9" className="cad-halo-sm">
                {isFa ? 'تأمین کاور دوغاب یکنواخت دور نیل' : 'Ensures uniform grout cover'}
              </text>
            </svg>
          </div>
        )}
      </div>

      {/* Quick Legend at bottom */}
      <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex flex-wrap items-center gap-4">
        <span className="font-semibold text-slate-700">{isFa ? 'راهنمای مقاطع فنی:' : 'Legend:'}</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-blue-600 rounded-sm"></span>
          <span>{isFa ? 'میلگرد نیل' : 'Tendon Bar'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-slate-500 rounded-sm"></span>
          <span>{isFa ? 'دوغاب سیمانی' : 'Cement Grout'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-emerald-500 rounded-sm"></span>
          <span>{isFa ? 'غلاف محافظ کلاس A' : 'Encapsulation Duct'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-amber-400 rounded-sm"></span>
          <span>{isFa ? 'گل‌میخ‌ها (متصل به شبکه آرماتور بتن دائم)' : 'Headed Studs (Tied to Perm. Rebar Grid)'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 border border-dashed border-rose-500 rounded-sm"></span>
          <span>{isFa ? 'سطح گسیختگی پانچ' : 'Punching Shear Surface'}</span>
        </div>
      </div>
    </div>
  );
};
