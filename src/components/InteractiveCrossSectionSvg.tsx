/**
 * Interactive Engineering CAD Diagrams for Soil Nail Design
 * Includes: Nail Head Assembly Detail & Borehole Encapsulation Cross-Section
 */
import React, { useState } from 'react';
import { DesignState, FullCalculationResults, Language } from '../types/nailing';
import { Layers, Eye, Compass } from 'lucide-react';

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
  const isTemporary = corrosion.designLife === 'temporary';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Top Controls Bar */}
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>{isFa ? 'نقشه‌های اجرایی و مقاطع مهندسی سیستم نیلینگ' : 'Soil Nail Engineering CAD Cross-Sections'}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="bg-white border border-slate-300 rounded-lg p-0.5 flex">
            <button
              type="button"
              onClick={() => setViewMode('both')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${viewMode === 'both' ? 'bg-blue-600 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {isFa ? 'هر دو مقطع' : 'Both Views'}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('head')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${viewMode === 'head' ? 'bg-blue-600 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {isFa ? 'اتصال سر نیل' : 'Nail Head'}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('borehole')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${viewMode === 'borehole' ? 'bg-blue-600 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {isFa ? 'مقطع گمانه' : 'Borehole'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowPunchingCone(!showPunchingCone)}
            className={`px-2.5 py-1 rounded-md border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
              showPunchingCone ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isFa ? 'مخروط برش پانچ ۴۵°' : '45° Punching Cone'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDimensions(!showDimensions)}
            className={`px-2.5 py-1 rounded-md border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
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
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-300 mb-2 border-b border-slate-800 pb-1.5">
              <span>{isFa ? 'جزئیات مونتاژ سر نیل، پلیت و پوشش‌های سطحی (AASHTO / FHWA)' : 'Nail Head Connection Assembly & Facing Detail'}</span>
              <span className="text-emerald-400 font-mono text-[11px]" dir="ltr">
                CDR Flex={results.tempFlexure.CDR} | CDR Punch={results.tempPunching.CDR}
              </span>
            </div>

            <svg
              viewBox="0 0 940 480"
              style={{ direction: 'ltr' }}
              className="w-full h-auto max-h-[480px] bg-slate-950 rounded select-none font-sans"
            >
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

              {/* ================= CENTRAL STRUCTURAL CROSS-SECTION (x = 270 to 622, y = 68 to 438) ================= */}
              {/* Zone 1: Soil / Ground (x=270 to 380) */}
              <rect x="270" y="68" width="110" height="370" fill="#1e293b" />
              <rect x="270" y="68" width="110" height="370" fill="url(#soilPattern)" />

              {/* Zone 2: Geocomposite Strip Drain behind facing (x=374 to 382) */}
              <rect x="374" y="76" width="8" height="354" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.6" />

              {/* Zone 3: Temporary Shotcrete Layer (x=382 to 482, width=100) */}
              <rect x="382" y="68" width="100" height="370" fill="#334155" />
              <rect x="382" y="68" width="100" height="370" fill="url(#shotcretePattern)" />

              {/* Zone 4: Permanent Concrete Facing (x=482 to 622, only shown for permanent system) */}
              {!isTemporary && (
                <>
                  <rect x="482" y="68" width="140" height="370" fill="#1e293b" opacity="0.95" stroke="#475569" strokeWidth="1" />
                  <rect x="482" y="68" width="140" height="370" fill="url(#concretePattern)" />
                </>
              )}

              {/* Drillhole / Grout column penetration into soil (y=205 to 295, nail axis at y=250) */}
              <polygon points="270,205 382,205 382,295 270,295" fill="#475569" stroke="#64748b" strokeWidth="1.5" />

              {/* Encapsulation duct in borehole (Class A) */}
              {corrosion.selectedClass === 'ClassA' && (
                <g>
                  <rect x="270" y="220" width="106" height="8" fill="#10b981" stroke="#34d399" strokeWidth="1" />
                  <rect x="270" y="272" width="106" height="8" fill="#10b981" stroke="#34d399" strokeWidth="1" />
                </g>
              )}

              {/* Central Steel Tendon Bar passing through into facing */}
              <rect x="270" y="242" width="264" height="16" fill="#2563eb" stroke="#93c5fd" strokeWidth="1.5" />

              {/* Shotcrete Wire Mesh (vertical line at x=432) */}
              <line x1="432" y1="76" x2="432" y2="430" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6,4" />
              <line x1="414" y1="130" x2="450" y2="130" stroke="#f59e0b" strokeWidth="2" />
              <line x1="414" y1="196" x2="450" y2="196" stroke="#f59e0b" strokeWidth="2" />
              <line x1="414" y1="304" x2="450" y2="304" stroke="#f59e0b" strokeWidth="2" />
              <line x1="414" y1="364" x2="450" y2="364" stroke="#f59e0b" strokeWidth="2" />

              {/* Waler reinforcement bars behind bearing plate (x=432, y=175 and y=325) */}
              <circle cx="432" cy="175" r="8" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.5" />
              <circle cx="432" cy="325" r="8" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.5" />

              {/* 45° Punching Shear Failure Cone (from plate edges through shotcrete to soil interface) */}
              {showPunchingCone && (
                <g>
                  <line x1="478" y1="175" x2="382" y2="100" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="5,4" />
                  <line x1="478" y1="325" x2="382" y2="400" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="5,4" />
                  <path d="M 382,100 C 368,170 368,330 382,400" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,3" />
                </g>
              )}

              {/* Steel Bearing Plate (placed against outer face of shotcrete, x=478 to 494, height 150px) */}
              <rect x="478" y="175" width="16" height="150" fill="#f8fafc" stroke="#38bdf8" strokeWidth="2" rx="1.5" />

              {/* Beveled Hardened Washer (tight against bearing plate front face x=494) */}
              <polygon points="494,225 506,228 506,272 494,275" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1.2" />

              {/* Heavy Hex Nut (threaded onto tendon bar, x=506 to 528) */}
              <rect x="506" y="232" width="22" height="36" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" rx="2" />
              <line x1="517" y1="232" x2="517" y2="268" stroke="#94a3b8" strokeWidth="1" />

              {/* Tendon Bar protrusion beyond nut */}
              <rect x="528" y="244" width="12" height="12" fill="#3b82f6" stroke="#93c5fd" strokeWidth="1" />

              {/* HEADED STUDS WELDED TO BEARING PLATE & PERMANENT REBAR GRID (Only Permanent System) */}
              {!isTemporary && (
                <>
                  <g>
                    {/* Fillet welds at stud base on bearing plate */}
                    <polygon points="494,182 498,185 494,185" fill="#d97706" />
                    <polygon points="494,198 498,195 494,195" fill="#d97706" />
                    <polygon points="494,302 498,305 494,305" fill="#d97706" />
                    <polygon points="494,318 498,315 494,315" fill="#d97706" />

                    {/* Top Stud Shank & Head */}
                    <rect x="494" y="185" width="88" height="10" fill="#fbbf24" stroke="#d97706" strokeWidth="1.2" />
                    <rect x="582" y="178" width="10" height="24" rx="2" fill="#d97706" stroke="#b45309" strokeWidth="1.2" />

                    {/* Bottom Stud Shank & Head */}
                    <rect x="494" y="305" width="88" height="10" fill="#fbbf24" stroke="#d97706" strokeWidth="1.2" />
                    <rect x="582" y="298" width="10" height="24" rx="2" fill="#d97706" stroke="#b45309" strokeWidth="1.2" />

                    {/* Tie wire loops connecting stud head to permanent facing rebar */}
                    <ellipse cx="587" cy="190" rx="8" ry="15" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,2" />
                    <ellipse cx="587" cy="310" rx="8" ry="15" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,2" />

                    {/* Connection Nodes */}
                    <circle cx="587" cy="190" r="4.5" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
                    <circle cx="587" cy="310" r="4.5" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
                  </g>

                  {/* Permanent Facing Reinforcement Mesh (vertical line at x=587) */}
                  <line x1="587" y1="76" x2="587" y2="430" stroke="#34d399" strokeWidth="2.5" strokeDasharray="5,4" />
                  <circle cx="587" cy="130" r="5" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
                  <circle cx="587" cy="190" r="5.5" fill="#059669" stroke="#34d399" strokeWidth="2" />
                  <circle cx="587" cy="250" r="5" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
                  <circle cx="587" cy="310" r="5.5" fill="#059669" stroke="#34d399" strokeWidth="2" />
                  <circle cx="587" cy="370" r="5" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
                </>
              )}

              {/* ================= TOP ZONE HEADERS & DIMENSIONS (Zero Collisions) ================= */}
              {showDimensions && (
                <g>
                  {/* Shotcrete Thickness: hi */}
                  <line x1="382" y1="16" x2="482" y2="16" stroke="#94a3b8" strokeWidth="1.2" markerStart="url(#dimArrow)" markerEnd="url(#dimArrow)" />
                  <line x1="382" y1="9" x2="382" y2="23" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="482" y1="9" x2="482" y2="23" stroke="#94a3b8" strokeWidth="1" />
                  <rect x="406" y="7" width="52" height="16" rx="3" fill="#020617" stroke="#334155" strokeWidth="0.7" />
                  <text x="432" y="18" fill="#38bdf8" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                    hi={facing.tempThickness}
                  </text>

                  {/* Permanent Facing Thickness: hf (Permanent Only) */}
                  {!isTemporary && (
                    <>
                      <line x1="482" y1="16" x2="622" y2="16" stroke="#94a3b8" strokeWidth="1.2" markerStart="url(#dimArrow)" markerEnd="url(#dimArrow)" />
                      <line x1="622" y1="9" x2="622" y2="23" stroke="#94a3b8" strokeWidth="1" />
                      <rect x="526" y="7" width="52" height="16" rx="3" fill="#020617" stroke="#334155" strokeWidth="0.7" />
                      <text x="552" y="18" fill="#67e8f9" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                        hf={facing.permThickness}
                      </text>
                    </>
                  )}

                  {/* Plate Height: B (placed cleanly at x=456 with badge above nail bar at y=214) */}
                  <line x1="458" y1="175" x2="458" y2="325" stroke="#38bdf8" strokeWidth="1.2" markerStart="url(#dimArrow)" markerEnd="url(#dimArrow)" />
                  <line x1="452" y1="175" x2="466" y2="175" stroke="#38bdf8" strokeWidth="1" />
                  <line x1="452" y1="325" x2="466" y2="325" stroke="#38bdf8" strokeWidth="1" />
                  <rect x="436" y="210" width="40" height="16" rx="3" fill="#020617" stroke="#0284c7" strokeWidth="0.8" />
                  <text x="456" y="221.5" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
                    B={plate.plateWidth}
                  </text>
                </g>
              )}

              {/* Zone Header Badges (Spaced evenly across their exact column widths) */}
              <foreignObject x="273" y="34" width="104" height="26">
                <div
                  dir={isFa ? 'rtl' : 'ltr'}
                  className="w-full h-full rounded bg-slate-900/95 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300 px-1 truncate"
                >
                  {isFa ? 'توده خاک / ترانشه' : 'Retained Soil'}
                </div>
              </foreignObject>

              <foreignObject x="385" y="34" width="94" height="26">
                <div
                  dir={isFa ? 'rtl' : 'ltr'}
                  className="w-full h-full rounded bg-slate-900/95 border border-slate-600 flex items-center justify-center text-[9.5px] font-bold text-slate-200 px-1 truncate"
                >
                  {isFa ? `شاتکریت (${facing.tempThickness}mm)` : `Shotcrete (${facing.tempThickness}mm)`}
                </div>
              </foreignObject>

              <foreignObject x="486" y="34" width="132" height="26">
                <div
                  dir={isFa ? 'rtl' : 'ltr'}
                  className={`w-full h-full rounded bg-slate-900/95 border flex items-center justify-center text-[9.5px] font-bold px-1 truncate ${
                    isTemporary ? 'border-amber-600/60 text-amber-300' : 'border-cyan-700/70 text-cyan-300'
                  }`}
                >
                  {isTemporary
                    ? isFa
                      ? 'فضای آزاد (سیستم موقت)'
                      : 'Open Air (Temp System)'
                    : isFa
                    ? `بتن نهایی دائم (${facing.permThickness}mm)`
                    : `Perm. Facing (${facing.permThickness}mm)`}
                </div>
              </foreignObject>

              {/* ================= LEFT CALLOUT COLUMN (x = 8 to 250, strictly isolated from drawing) ================= */}
              {/* 1. 45° Punching Shear Cone Callout */}
              {showPunchingCone && (
                <g>
                  <path d="M 250,92 L 340,92 L 382,100" fill="none" stroke="#f43f5e" strokeWidth="1.4" />
                  <circle cx="382" cy="100" r="3" fill="#f43f5e" />
                  <foreignObject x="8" y="68" width="242" height="46">
                    <div
                      dir={isFa ? 'rtl' : 'ltr'}
                      className="w-full h-full rounded-md bg-slate-900/95 border border-rose-500/40 px-2.5 py-1 flex flex-col justify-center"
                    >
                      <div className="text-[10.5px] font-bold text-rose-300 leading-tight">
                        {isFa ? `مخروط برش پانچ ۴۵°` : `45° Punching Shear Cone`}
                      </div>
                      <div className="text-[9.5px] text-rose-200/90 font-mono leading-tight mt-0.5" dir="ltr">
                        {`Dc' = ${results.tempPunching.DcPrime} m`}
                      </div>
                    </div>
                  </foreignObject>
                </g>
              )}

              {/* 2. Bearing Plate Callout */}
              <g>
                <path d="M 250,148 L 486,148 L 486,175" fill="none" stroke="#38bdf8" strokeWidth="1.4" />
                <circle cx="486" cy="175" r="3" fill="#38bdf8" />
                <foreignObject x="8" y="125" width="242" height="48">
                  <div
                    dir={isFa ? 'rtl' : 'ltr'}
                    className="w-full h-full rounded-md bg-slate-900/95 border border-sky-500/40 px-2.5 py-1 flex flex-col justify-center"
                  >
                    <div className="text-[10.5px] font-bold text-sky-300 leading-tight">
                      {isFa ? `پلیت فولادی ${plate.plateWidth}×${plate.plateWidth} cm` : `Bearing Plate ${plate.plateWidth}×${plate.plateWidth} cm`}
                    </div>
                    <div className="text-[9px] text-sky-200/90 leading-tight mt-0.5 truncate">
                      {isFa
                        ? `ضخامت t = ${Math.round(plate.plateThickness * 10)} mm (fy = ${plate.fyPlate} MPa)`
                        : `t = ${Math.round(plate.plateThickness * 10)} mm (fy = ${plate.fyPlate} MPa)`}
                    </div>
                  </div>
                </foreignObject>
              </g>

              {/* 3. Waler Rebar Callout */}
              <g>
                <path d="M 250,206 L 365,206 L 426,177" fill="none" stroke="#ef4444" strokeWidth="1.4" />
                <circle cx="432" cy="175" r="3" fill="#ef4444" />
                <foreignObject x="8" y="183" width="242" height="48">
                  <div
                    dir={isFa ? 'rtl' : 'ltr'}
                    className="w-full h-full rounded-md bg-slate-900/95 border border-red-500/40 px-2.5 py-1 flex flex-col justify-center"
                  >
                    <div className="text-[10.5px] font-bold text-red-300 leading-tight">
                      {isFa ? 'آرماتور والیر تسلیح سر نیل (Waler)' : 'Waler Rebar Reinforcement'}
                    </div>
                    <div className="text-[9px] text-red-200/90 leading-tight mt-0.5 truncate">
                      {isFa ? `۲ شاخه φ${facing.tempMesh.walerBarDiameter || 16} mm` : `2x φ${facing.tempMesh.walerBarDiameter || 16} mm`}
                    </div>
                  </div>
                </foreignObject>
              </g>

              {/* 4. Shotcrete Wire Mesh Callout */}
              <g>
                <path d="M 250,300 L 432,300" fill="none" stroke="#f59e0b" strokeWidth="1.4" />
                <circle cx="432" cy="300" r="3" fill="#f59e0b" />
                <foreignObject x="8" y="276" width="242" height="48">
                  <div
                    dir={isFa ? 'rtl' : 'ltr'}
                    className="w-full h-full rounded-md bg-slate-900/95 border border-amber-500/40 px-2.5 py-1 flex flex-col justify-center"
                  >
                    <div className="text-[10.5px] font-bold text-amber-300 leading-tight">
                      {isFa ? `مش فولادی شاتکریت (${facing.tempMesh.avn} mm²/m)` : `Shotcrete Wire Mesh (${facing.tempMesh.avn} mm²/m)`}
                    </div>
                    <div className="text-[9px] text-amber-200/90 leading-tight mt-0.5 truncate">
                      {isFa ? `شبکه φ${facing.tempMesh.meshDiameter || 6}@${facing.tempMesh.meshSpacing || 150} mm` : `Mesh φ${facing.tempMesh.meshDiameter || 6}@${facing.tempMesh.meshSpacing || 150} mm`}
                    </div>
                  </div>
                </foreignObject>
              </g>

              {/* 5. Geocomposite Strip Drain Callout */}
              <g>
                <path d="M 250,396 L 378,396" fill="none" stroke="#0ea5e9" strokeWidth="1.4" />
                <circle cx="378" cy="396" r="3" fill="#0ea5e9" />
                <foreignObject x="8" y="372" width="242" height="46">
                  <div
                    dir={isFa ? 'rtl' : 'ltr'}
                    className="w-full h-full rounded-md bg-slate-900/95 border border-cyan-500/40 px-2.5 py-1 flex flex-col justify-center"
                  >
                    <div className="text-[10px] font-bold text-sky-300 leading-tight">
                      {isFa ? 'نوار ژئوکامپوزیت زهکش پشت شاتکریت' : 'Prefabricated Strip Drain'}
                    </div>
                    <div className="text-[9px] text-slate-400 leading-tight mt-0.5 truncate">
                      {isFa ? 'زهکشی آب پشت دیواره شاتکریت' : 'Behind-facing water drainage'}
                    </div>
                  </div>
                </foreignObject>
              </g>

              {/* ================= RIGHT CALLOUT COLUMN (x = 654 to 932, strictly isolated from drawing) ================= */}
              {!isTemporary ? (
                <>
                  {/* 1. Headed Studs & Tied Rebar Callout */}
                  <g>
                    <path d="M 592,190 L 636,104 L 654,104" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
                    <circle cx="592" cy="190" r="3" fill="#fbbf24" />
                    <foreignObject x="654" y="68" width="278" height="76">
                      <div
                        dir={isFa ? 'rtl' : 'ltr'}
                        className="w-full h-full rounded-md bg-slate-900/95 border border-amber-500/45 px-2.5 py-1.5 flex flex-col justify-center gap-0.5"
                      >
                        <div className="text-[10.5px] font-bold text-amber-300 leading-snug">
                          {isFa ? 'اتصال گل‌میخ به آرماتور پوشش دائم (سیم آرماتوربندی/جوش)' : 'Stud Head Tied to Perm. Rebar Grid'}
                        </div>
                        <div className="text-[9.5px] text-amber-100 leading-tight">
                          {isFa
                            ? `${facing.headedStudsCount} عدد گل‌میخ φ${facing.headedStudDiameter} mm جوش روی پلیت و متصل به آرماتور`
                            : `${facing.headedStudsCount}x Studs φ${facing.headedStudDiameter} mm welded & tied`}
                        </div>
                        <div className="text-[9px] text-slate-300 leading-tight">
                          {isFa
                            ? `fy = ${facing.headedStudFy} MPa | رده ${facing.headedStudType} (AASHTO 11.12.6.2.3)`
                            : `fy = ${facing.headedStudFy} MPa | Class ${facing.headedStudType} (AASHTO 11.12.6.2.3)`}
                        </div>
                      </div>
                    </foreignObject>
                  </g>

                  {/* 2. Tension Force Arrow (T0) & Label */}
                  <g>
                    <line x1="622" y1="250" x2="778" y2="250" stroke="#38bdf8" strokeWidth="3.5" markerEnd="url(#arrowHead)" />
                    <foreignObject x="654" y="182" width="278" height="54">
                      <div
                        dir={isFa ? 'rtl' : 'ltr'}
                        className="w-full h-full rounded-md bg-slate-900/95 border border-sky-500/50 px-2.5 py-1 flex flex-col justify-center"
                      >
                        <div className="text-[11px] font-bold text-sky-300 leading-tight">
                          {isFa ? `نیروی طراحی کشش T0 = ${results.T0} kN` : `Tension Load T0 = ${results.T0} kN`}
                        </div>
                        <div className="text-[9px] text-slate-400 leading-tight mt-0.5">
                          {isFa ? 'بار ضریب‌دار ترکیبی AASHTO Strength I' : 'AASHTO Strength I Factored Force'}
                        </div>
                      </div>
                    </foreignObject>
                  </g>

                  {/* 3. Nut & Washer Callout */}
                  <g>
                    <path d="M 518,268 L 636,304 L 654,304" fill="none" stroke="#cbd5e1" strokeWidth="1.3" />
                    <circle cx="518" cy="268" r="2.8" fill="#cbd5e1" />
                    <foreignObject x="654" y="280" width="278" height="48">
                      <div
                        dir={isFa ? 'rtl' : 'ltr'}
                        className="w-full h-full rounded-md bg-slate-900/95 border border-slate-600 px-2.5 py-1 flex flex-col justify-center"
                      >
                        <div className="text-[10.5px] font-bold text-slate-100 leading-tight">
                          {isFa ? 'مهره و واشر زاویه‌دار سخت‌شده' : 'Hardened Beveled Washer & Nut'}
                        </div>
                        <div className="text-[9px] text-slate-400 leading-tight mt-0.5 truncate">
                          {isFa ? 'مهار کامل تاندون روی پلیت فولادی' : 'Tendon to Plate Anchorage'}
                        </div>
                      </div>
                    </foreignObject>
                  </g>

                  {/* 4. Permanent Facing Rebar Callout */}
                  <g>
                    <path d="M 587,370 L 636,372 L 654,372" fill="none" stroke="#34d399" strokeWidth="1.4" />
                    <circle cx="587" cy="370" r="3" fill="#34d399" />
                    <foreignObject x="654" y="346" width="278" height="52">
                      <div
                        dir={isFa ? 'rtl' : 'ltr'}
                        className="w-full h-full rounded-md bg-slate-900/95 border border-emerald-500/45 px-2.5 py-1 flex flex-col justify-center"
                      >
                        <div className="text-[10.5px] font-bold text-emerald-300 leading-tight">
                          {isFa ? `شبکه آرماتور بتن دائم (${facing.permMesh.avn} mm²/m)` : `Perm. Facing Rebar Grid (${facing.permMesh.avn} mm²/m)`}
                        </div>
                        <div className="text-[9px] text-emerald-200/90 leading-tight mt-0.5 truncate">
                          {isFa
                            ? `مش φ${facing.permMesh.meshDiameter || 12}@${facing.permMesh.meshSpacing || 150} mm (متصل به گل‌میخ‌ها)`
                            : `Mesh φ${facing.permMesh.meshDiameter || 12}@${facing.permMesh.meshSpacing || 150} mm (Tied to Studs)`}
                        </div>
                      </div>
                    </foreignObject>
                  </g>
                </>
              ) : (
                <>
                  {/* Temporary System Banner Card */}
                  <foreignObject x="654" y="74" width="278" height="72">
                    <div
                      dir={isFa ? 'rtl' : 'ltr'}
                      className="w-full h-full rounded-md bg-amber-950/50 border border-amber-500/45 px-3 py-1.5 flex flex-col justify-center gap-0.5"
                    >
                      <div className="text-[10.5px] font-bold text-amber-300 leading-tight">
                        {isFa ? 'سیستم موقت — بدون رویه پوشش دائم' : 'Temporary System — No Perm. Facing'}
                      </div>
                      <div className="text-[9px] text-amber-100/90 leading-relaxed">
                        {isFa
                          ? 'مطابق AASHTO و FHWA، برای نیلینگ موقت اجرای بتن نهایی دائم و گل‌میخ‌های اتصال سر نیل الزامی نیست.'
                          : 'Per AASHTO & FHWA, permanent concrete facing and headed studs are omitted for temporary walls.'}
                      </div>
                    </div>
                  </foreignObject>

                  {/* Tension Force Arrow (T0) from Tendon End */}
                  <g>
                    <line x1="540" y1="250" x2="778" y2="250" stroke="#38bdf8" strokeWidth="3.5" markerEnd="url(#arrowHead)" />
                    <foreignObject x="654" y="182" width="278" height="54">
                      <div
                        dir={isFa ? 'rtl' : 'ltr'}
                        className="w-full h-full rounded-md bg-slate-900/95 border border-sky-500/50 px-2.5 py-1 flex flex-col justify-center"
                      >
                        <div className="text-[11px] font-bold text-sky-300 leading-tight">
                          {isFa ? `نیروی طراحی کشش T0 = ${results.T0} kN` : `Tension Load T0 = ${results.T0} kN`}
                        </div>
                        <div className="text-[9px] text-slate-400 leading-tight mt-0.5">
                          {isFa ? 'بار ضریب‌دار ترکیبی AASHTO Strength I' : 'AASHTO Strength I Factored Force'}
                        </div>
                      </div>
                    </foreignObject>
                  </g>

                  {/* Nut & Washer Callout */}
                  <g>
                    <path d="M 518,268 L 636,304 L 654,304" fill="none" stroke="#cbd5e1" strokeWidth="1.3" />
                    <circle cx="518" cy="268" r="2.8" fill="#cbd5e1" />
                    <foreignObject x="654" y="280" width="278" height="48">
                      <div
                        dir={isFa ? 'rtl' : 'ltr'}
                        className="w-full h-full rounded-md bg-slate-900/95 border border-slate-600 px-2.5 py-1 flex flex-col justify-center"
                      >
                        <div className="text-[10.5px] font-bold text-slate-100 leading-tight">
                          {isFa ? 'مهره و واشر زاویه‌دار سخت‌شده' : 'Hardened Beveled Washer & Nut'}
                        </div>
                        <div className="text-[9px] text-slate-400 leading-tight mt-0.5 truncate">
                          {isFa ? 'مهار کامل تاندون روی پلیت فولادی' : 'Tendon to Plate Anchorage'}
                        </div>
                      </div>
                    </foreignObject>
                  </g>
                </>
              )}
            </svg>
          </div>
        )}

        {/* DIAGRAM 2: BOREHOLE & DUCT CROSS-SECTION */}
        {(viewMode === 'both' || viewMode === 'borehole') && (
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-900 text-slate-100 relative">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-300 mb-2 border-b border-slate-800 pb-1.5">
              <span>
                {isFa
                  ? `مقطع عرضی گمانه نیل (${corrosion.selectedClass === 'ClassA' ? 'کلاس A: محصورسازی دوبل' : corrosion.selectedClass === 'ClassB' ? 'کلاس B: میلگرد پوشش‌دار' : 'بدون غلاف محافظ - نیل موقت'})`
                  : `Borehole Cross-Section (${corrosion.selectedClass === 'ClassA' ? 'Class A Encapsulation' : corrosion.selectedClass === 'ClassB' ? 'Class B Coated Bar' : 'Bare Bar (Temporary)'})`}
              </span>
              <span className="text-emerald-400 font-mono text-[11px]" dir="ltr">
                DD = {pullout.drillholeDiameter} mm | Bar = φ{tendon.barDiameter}
              </span>
            </div>

            <svg
              viewBox="0 0 740 460"
              style={{ direction: 'ltr' }}
              className="w-full h-auto max-h-[480px] bg-slate-950 rounded select-none font-sans"
            >
              {/* Center of borehole at (370, 238) */}
              {/* Top Header Badge completely above circle (y=12..38 vs circle top y=66) */}
              <foreignObject x="250" y="12" width="240" height="28">
                <div
                  dir={isFa ? 'rtl' : 'ltr'}
                  className="w-full h-full rounded bg-slate-900/95 border border-slate-700 flex items-center justify-center text-[11px] font-bold text-slate-300 px-2 truncate"
                >
                  {isFa ? 'توده خاک اطراف گمانه (In-situ Ground)' : 'In-situ Surrounding Soil'}
                </div>
              </foreignObject>

              {/* Outer Soil Boundary */}
              <circle cx="370" cy="238" r="172" fill="#1e293b" stroke="#334155" strokeWidth="2" strokeDasharray="6,4" />

              {/* Borehole Wall (Diameter DD) -> r = 122 */}
              <circle cx="370" cy="238" r="122" fill="#334155" stroke="#60a5fa" strokeWidth="2.5" />

              {/* External Centralizer Spacers (4 arms) */}
              <g stroke="#94a3b8" strokeWidth="3">
                <line x1="370" y1="116" x2="370" y2="158" />
                <line x1="370" y1="360" x2="370" y2="318" />
                <line x1="248" y1="238" x2="290" y2="238" />
                <line x1="492" y1="238" x2="450" y2="238" />
              </g>

              {/* Annular Grout ring */}
              <circle cx="370" cy="238" r="122" fill="#475569" opacity="0.6" />

              {/* Class A Corrugated Duct */}
              {corrosion.selectedClass === 'ClassA' ? (
                <g>
                  <circle cx="370" cy="238" r="80" fill="#10b981" stroke="#34d399" strokeWidth="3" />
                  <circle cx="370" cy="238" r="75" fill="#047857" stroke="#059669" strokeWidth="1" strokeDasharray="4,3" />
                  <circle cx="370" cy="238" r="70" fill="#334155" stroke="#10b981" strokeWidth="2" />
                  {/* Internal Centralizer pads */}
                  <circle cx="370" cy="182" r="4" fill="#fbbf24" />
                  <circle cx="370" cy="294" r="4" fill="#fbbf24" />
                  <circle cx="314" cy="238" r="4" fill="#fbbf24" />
                  <circle cx="426" cy="238" r="4" fill="#fbbf24" />
                </g>
              ) : (
                <circle cx="370" cy="238" r="118" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
              )}

              {/* Central Steel Tendon Rebar */}
              <circle cx="370" cy="238" r="38" fill="#2563eb" stroke="#93c5fd" strokeWidth="3" />
              <circle cx="370" cy="238" r="27" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3,3" />

              <text x="370" y="243" fill="#ffffff" fontSize="13.5" fontWeight="bold" textAnchor="middle">
                φ{tendon.barDiameter}
              </text>

              {/* ================= LEFT CALLOUTS (x = 8 to 194, completely outside soil circle x >= 198) ================= */}
              {corrosion.selectedClass === 'ClassA' && (
                <>
                  <path d="M 194,94 L 285,94 L 330,168" fill="none" stroke="#34d399" strokeWidth="1.3" />
                  <circle cx="330" cy="168" r="3" fill="#34d399" />
                  <foreignObject x="8" y="68" width="186" height="52">
                    <div
                      dir={isFa ? 'rtl' : 'ltr'}
                      className="w-full h-full rounded-md bg-slate-900/95 border border-emerald-500/40 px-2 py-1 flex flex-col justify-center"
                    >
                      <div className="text-[10px] font-bold text-emerald-300 leading-tight truncate">
                        {isFa ? `غلاف موج‌دار ${corrosion.ductMaterial} (کلاس A)` : `Corrugated ${corrosion.ductMaterial} Duct`}
                      </div>
                      <div className="text-[8.5px] text-emerald-200/90 leading-tight mt-0.5 truncate">
                        {isFa ? `ضخامت: ${corrosion.ductWallThickness}mm | قطر: ${corrosion.ductInsideDiameter}mm` : `t=${corrosion.ductWallThickness}mm | ID=${corrosion.ductInsideDiameter}mm`}
                      </div>
                    </div>
                  </foreignObject>

                  <path d="M 194,220 L 260,220 L 314,238" fill="none" stroke="#fbbf24" strokeWidth="1.3" />
                  <circle cx="314" cy="238" r="3" fill="#fbbf24" />
                  <foreignObject x="8" y="194" width="186" height="52">
                    <div
                      dir={isFa ? 'rtl' : 'ltr'}
                      className="w-full h-full rounded-md bg-slate-900/95 border border-amber-500/40 px-2 py-1 flex flex-col justify-center"
                    >
                      <div className="text-[10px] font-bold text-amber-300 leading-tight truncate">
                        {isFa ? 'سنترالایزر داخلی' : 'Internal Centralizer'}
                      </div>
                      <div className="text-[8.5px] text-amber-200/90 leading-tight mt-0.5 truncate">
                        {isFa ? 'فواصل ≤ ۳ متر جهت انطباق مرکز' : 'Spacing ≤ 3.0 m'}
                      </div>
                    </div>
                  </foreignObject>
                </>
              )}

              {corrosion.selectedClass === 'ClassB' && (
                <>
                  <path d="M 194,94 L 290,94 L 352,204" fill="none" stroke="#38bdf8" strokeWidth="1.3" />
                  <circle cx="352" cy="204" r="3" fill="#38bdf8" />
                  <foreignObject x="8" y="68" width="186" height="54">
                    <div
                      dir={isFa ? 'rtl' : 'ltr'}
                      className="w-full h-full rounded-md bg-slate-900/95 border border-sky-500/40 px-2 py-1 flex flex-col justify-center"
                    >
                      <div className="text-[10px] font-bold text-sky-300 leading-tight truncate">
                        {isFa ? 'پوشش اپوکسی / گالوانیزه (کلاس B)' : 'Epoxy Coated Bar (Class B)'}
                      </div>
                      <div className="text-[8.5px] text-sky-200/90 leading-tight mt-0.5 truncate">
                        {isFa ? 'پوشش اپوکسی کارخانه‌ای' : 'Fusion-Bonded Epoxy Coating'}
                      </div>
                    </div>
                  </foreignObject>
                </>
              )}

              {corrosion.selectedClass === 'None' && (
                <>
                  <path d="M 194,94 L 290,94 L 352,204" fill="none" stroke="#f59e0b" strokeWidth="1.3" />
                  <circle cx="352" cy="204" r="3" fill="#f59e0b" />
                  <foreignObject x="8" y="68" width="186" height="54">
                    <div
                      dir={isFa ? 'rtl' : 'ltr'}
                      className="w-full h-full rounded-md bg-slate-900/95 border border-amber-500/40 px-2 py-1 flex flex-col justify-center"
                    >
                      <div className="text-[10px] font-bold text-amber-300 leading-tight truncate">
                        {isFa ? 'دوغاب سیمانی مستقیم (نیل موقت)' : 'Direct Grout (Temp Nail < 2 yrs)'}
                      </div>
                      <div className="text-[8.5px] text-amber-200/90 leading-tight mt-0.5 truncate">
                        {isFa ? 'مطابق ضوابط FHWA NHI-14-007' : 'Per FHWA NHI-14-007'}
                      </div>
                    </div>
                  </foreignObject>
                </>
              )}

              {/* ================= RIGHT CALLOUTS (x = 546 to 732, completely outside soil circle x <= 542) ================= */}
              {/* 1. Steel Tendon Callout */}
              <path d="M 392,208 L 490,94 L 546,94" fill="none" stroke="#93c5fd" strokeWidth="1.3" />
              <circle cx="392" cy="208" r="3" fill="#93c5fd" />
              <foreignObject x="546" y="68" width="186" height="52">
                <div
                  dir={isFa ? 'rtl' : 'ltr'}
                  className="w-full h-full rounded-md bg-slate-900/95 border border-blue-400/40 px-2 py-1 flex flex-col justify-center"
                >
                  <div className="text-[10px] font-bold text-blue-300 leading-tight truncate">
                    {isFa ? `میلگرد نیل (As=${results.tendon.AsProvided} cm²)` : `Steel Tendon (As=${results.tendon.AsProvided} cm²)`}
                  </div>
                  <div className="text-[8.5px] text-slate-300 leading-tight mt-0.5 truncate">
                    {isFa ? `تنش تسلیم: fy = ${tendon.fy} MPa` : `Yield: fy = ${tendon.fy} MPa`}
                  </div>
                </div>
              </foreignObject>

              {/* 2. Borehole Drillhole DD Callout */}
              <path d="M 464,316 L 515,284 L 546,284" fill="none" stroke="#60a5fa" strokeWidth="1.3" />
              <circle cx="464" cy="316" r="3" fill="#60a5fa" />
              <foreignObject x="546" y="258" width="186" height="52">
                <div
                  dir={isFa ? 'rtl' : 'ltr'}
                  className="w-full h-full rounded-md bg-slate-900/95 border border-blue-500/40 px-2 py-1 flex flex-col justify-center"
                >
                  <div className="text-[10px] font-bold text-blue-300 leading-tight truncate">
                    {isFa ? `جداره چال DD = ${pullout.drillholeDiameter} mm` : `Drillhole DD = ${pullout.drillholeDiameter} mm`}
                  </div>
                  <div className="text-[8.5px] text-slate-300 leading-tight mt-0.5 truncate">
                    {isFa ? 'قطر مته حفاری چال نیلینگ' : 'Borehole Drilling Diameter'}
                  </div>
                </div>
              </foreignObject>

              {/* 3. External Centralizer Callout */}
              <path d="M 370,360 L 495,382 L 546,382" fill="none" stroke="#cbd5e1" strokeWidth="1.3" />
              <circle cx="370" cy="360" r="3" fill="#cbd5e1" />
              <foreignObject x="546" y="356" width="186" height="52">
                <div
                  dir={isFa ? 'rtl' : 'ltr'}
                  className="w-full h-full rounded-md bg-slate-900/95 border border-slate-600 px-2 py-1 flex flex-col justify-center"
                >
                  <div className="text-[10px] font-bold text-slate-200 leading-tight truncate">
                    {isFa ? 'سنترالایزر خارجی' : 'External Centralizer (≤ 3m)'}
                  </div>
                  <div className="text-[8.5px] text-slate-400 leading-tight mt-0.5 truncate">
                    {isFa ? 'تأمین کاور دوغاب یکنواخت دور نیل' : 'Ensures uniform grout cover'}
                  </div>
                </div>
              </foreignObject>
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
        {!isTemporary && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-amber-400 rounded-sm"></span>
            <span>{isFa ? 'گل‌میخ‌ها (متصل به شبکه آرماتور بتن دائم)' : 'Headed Studs (Tied to Perm. Rebar Grid)'}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 border border-dashed border-rose-500 rounded-sm"></span>
          <span>{isFa ? 'سطح گسیختگی پانچ' : 'Punching Shear Surface'}</span>
        </div>
      </div>
    </div>
  );
};
