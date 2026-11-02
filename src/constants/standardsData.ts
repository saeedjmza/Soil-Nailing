/**
 * AASHTO LRFD (9th Ed, 2020) & FHWA-NHI-14-007 (GEC 7) Reference Tables & Presets
 */
import { DesignState } from '../types/nailing';

export interface PresumptiveBondEntry {
  category: 'coarse' | 'fine' | 'rock';
  drillingMethod: string;
  soilDescriptionEn: string;
  soilDescriptionFa: string;
  quMinPsi: number;
  quMaxPsi: number;
  quMinKPa: number;
  quMaxKPa: number;
  recommendedKPa: number;
}

export const PRESUMPTIVE_BOND_STRENGTHS: PresumptiveBondEntry[] = [
  // Coarse-Grained Soils (Table C11.12.5.2-1)
  {
    category: 'coarse',
    drillingMethod: 'Rotary Drilled',
    soilDescriptionEn: 'Sand / Gravel',
    soilDescriptionFa: 'ماسه / شن (حفاری چرخشی)',
    quMinPsi: 15, quMaxPsi: 26, quMinKPa: 100, quMaxKPa: 180, recommendedKPa: 140,
  },
  {
    category: 'coarse',
    drillingMethod: 'Rotary Drilled',
    soilDescriptionEn: 'Silty Sand',
    soilDescriptionFa: 'ماسه لای‌دار (Silty Sand)',
    quMinPsi: 15, quMaxPsi: 22, quMinKPa: 100, quMaxKPa: 150, recommendedKPa: 125,
  },
  {
    category: 'coarse',
    drillingMethod: 'Rotary Drilled',
    soilDescriptionEn: 'Silt',
    soilDescriptionFa: 'لای / سیلت (Silt)',
    quMinPsi: 9, quMaxPsi: 11, quMinKPa: 60, quMaxKPa: 75, recommendedKPa: 70,
  },
  {
    category: 'coarse',
    drillingMethod: 'Rotary Drilled',
    soilDescriptionEn: 'Piedmont Residual Soil',
    soilDescriptionFa: 'خاک برجا پیدمونت (Residual)',
    quMinPsi: 6, quMaxPsi: 17, quMinKPa: 40, quMaxKPa: 120, recommendedKPa: 80,
  },
  {
    category: 'coarse',
    drillingMethod: 'Rotary Drilled',
    soilDescriptionEn: 'Fine Colluvium',
    soilDescriptionFa: 'کولویوم ریزدانه (Fine Colluvium)',
    quMinPsi: 11, quMaxPsi: 22, quMinKPa: 75, quMaxKPa: 150, recommendedKPa: 110,
  },
  {
    category: 'coarse',
    drillingMethod: 'Driven Casing',
    soilDescriptionEn: 'Sand / Gravel (low overburden)',
    soilDescriptionFa: 'ماسه و شن با روباره کم (Driven Casing)',
    quMinPsi: 28, quMaxPsi: 35, quMinKPa: 190, quMaxKPa: 240, recommendedKPa: 215,
  },
  {
    category: 'coarse',
    drillingMethod: 'Driven Casing',
    soilDescriptionEn: 'Sand / Gravel (high overburden)',
    soilDescriptionFa: 'ماسه و شن با روباره زیاد (Driven Casing)',
    quMinPsi: 41, quMaxPsi: 62, quMinKPa: 280, quMaxKPa: 430, recommendedKPa: 350,
  },
  {
    category: 'coarse',
    drillingMethod: 'Driven Casing',
    soilDescriptionEn: 'Dense Moraine',
    soilDescriptionFa: 'مورن متراکم یخبندانی (Dense Moraine)',
    quMinPsi: 55, quMaxPsi: 70, quMinKPa: 380, quMaxKPa: 480, recommendedKPa: 430,
  },
  {
    category: 'coarse',
    drillingMethod: 'Augered',
    soilDescriptionEn: 'Silty Fine Sand',
    soilDescriptionFa: 'ماسه ریز سیلت‌دار (Augered)',
    quMinPsi: 8, quMaxPsi: 13, quMinKPa: 55, quMaxKPa: 90, recommendedKPa: 75,
  },
  {
    category: 'coarse',
    drillingMethod: 'Augered',
    soilDescriptionEn: 'Silty Clayey Sand',
    soilDescriptionFa: 'ماسه رس‌دار و سیلتی (Augered)',
    quMinPsi: 9, quMaxPsi: 20, quMinKPa: 60, quMaxKPa: 140, recommendedKPa: 100,
  },

  // Fine-Grained Soils (Table C11.12.5.2-2)
  {
    category: 'fine',
    drillingMethod: 'Rotary Drilled',
    soilDescriptionEn: 'Silty Clay',
    soilDescriptionFa: 'رس سیلتی (Silty Clay)',
    quMinPsi: 5, quMaxPsi: 7, quMinKPa: 35, quMaxKPa: 50, recommendedKPa: 45,
  },
  {
    category: 'fine',
    drillingMethod: 'Driven Casing',
    soilDescriptionEn: 'Clayey Silt',
    soilDescriptionFa: 'سیلت رسی (کیسینگ کوبشی)',
    quMinPsi: 13, quMaxPsi: 20, quMinKPa: 90, quMaxKPa: 140, recommendedKPa: 115,
  },
  {
    category: 'fine',
    drillingMethod: 'Augered',
    soilDescriptionEn: 'Loess',
    soilDescriptionFa: 'لس (Loess)',
    quMinPsi: 4, quMaxPsi: 11, quMinKPa: 25, quMaxKPa: 75, recommendedKPa: 50,
  },
  {
    category: 'fine',
    drillingMethod: 'Augered',
    soilDescriptionEn: 'Soft Clay',
    soilDescriptionFa: 'رس نرم (Soft Clay)',
    quMinPsi: 3, quMaxPsi: 4, quMinKPa: 20, quMaxKPa: 30, recommendedKPa: 25,
  },
  {
    category: 'fine',
    drillingMethod: 'Augered',
    soilDescriptionEn: 'Stiff Clay',
    soilDescriptionFa: 'رس سخت (Stiff Clay)',
    quMinPsi: 6, quMaxPsi: 9, quMinKPa: 40, quMaxKPa: 60, recommendedKPa: 50,
  },
  {
    category: 'fine',
    drillingMethod: 'Augered',
    soilDescriptionEn: 'Stiff Clayey Silt',
    soilDescriptionFa: 'سیلت رسی سخت (Stiff Clayey Silt)',
    quMinPsi: 6, quMaxPsi: 15, quMinKPa: 40, quMaxKPa: 100, recommendedKPa: 70,
  },
  {
    category: 'fine',
    drillingMethod: 'Augered',
    soilDescriptionEn: 'Calcareous Sandy Clay',
    soilDescriptionFa: 'رس ماسه‌ای آهکی (Calcareous)',
    quMinPsi: 13, quMaxPsi: 20, quMinKPa: 90, quMaxKPa: 140, recommendedKPa: 115,
  },

  // Rock Formations (Table C11.12.5.2-3)
  {
    category: 'rock',
    drillingMethod: 'Rotary Drilled',
    soilDescriptionEn: 'Marl / Limestone',
    soilDescriptionFa: 'مارن / سنگ آهک (Marl / Limestone)',
    quMinPsi: 44, quMaxPsi: 58, quMinKPa: 300, quMaxKPa: 400, recommendedKPa: 350,
  },
  {
    category: 'rock',
    drillingMethod: 'Rotary Drilled',
    soilDescriptionEn: 'Weathered Sandstone',
    soilDescriptionFa: 'ماسه سنگ هوازده (Sandstone)',
    quMinPsi: 29, quMaxPsi: 44, quMinKPa: 200, quMaxKPa: 300, recommendedKPa: 250,
  },
  {
    category: 'rock',
    drillingMethod: 'Rotary Drilled',
    soilDescriptionEn: 'Weathered Shale',
    soilDescriptionFa: 'شیل هوازده (Weathered Shale)',
    quMinPsi: 15, quMaxPsi: 22, quMinKPa: 100, quMaxKPa: 150, recommendedKPa: 125,
  },
  {
    category: 'rock',
    drillingMethod: 'Rotary Drilled',
    soilDescriptionEn: 'Weathered Schist',
    soilDescriptionFa: 'شیست هوازده (Weathered Schist)',
    quMinPsi: 15, quMaxPsi: 25, quMinKPa: 100, quMaxKPa: 175, recommendedKPa: 140,
  },
  {
    category: 'rock',
    drillingMethod: 'Rotary Drilled',
    soilDescriptionEn: 'Fissured Dolomite',
    soilDescriptionFa: 'دولومیت درزه‌دار (Fissured Dolomite)',
    quMinPsi: 87, quMaxPsi: 145, quMinKPa: 600, quMaxKPa: 1000, recommendedKPa: 800,
  },
  {
    category: 'rock',
    drillingMethod: 'Rotary Drilled',
    soilDescriptionEn: 'Basalt',
    soilDescriptionFa: 'بازالت (Basalt)',
    quMinPsi: 73, quMaxPsi: 87, quMinKPa: 500, quMaxKPa: 600, recommendedKPa: 550,
  },
];

export interface StandardRebar {
  diameter: number; // mm
  designationMetric: string;
  designationUS: string;
  areaCm2: number;
  massKgPerM: number;
}

export const STANDARD_REBARS: StandardRebar[] = [
  { diameter: 20, designationMetric: 'φ20', designationUS: '#6', areaCm2: 3.14, massKgPerM: 2.47 },
  { diameter: 22, designationMetric: 'φ22', designationUS: '#7', areaCm2: 3.80, massKgPerM: 2.98 },
  { diameter: 25, designationMetric: 'φ25', designationUS: '#8', areaCm2: 4.91, massKgPerM: 3.85 },
  { diameter: 28, designationMetric: 'φ28', designationUS: '#9', areaCm2: 6.16, massKgPerM: 4.83 },
  { diameter: 32, designationMetric: 'φ32', designationUS: '#10', areaCm2: 8.04, massKgPerM: 6.31 },
  { diameter: 36, designationMetric: 'φ36', designationUS: '#11', areaCm2: 10.18, massKgPerM: 7.99 },
  { diameter: 40, designationMetric: 'φ40', designationUS: '#14', areaCm2: 12.57, massKgPerM: 9.86 },
  { diameter: 50, designationMetric: 'φ50', designationUS: '#18', areaCm2: 19.63, massKgPerM: 15.4 },
];

export interface StandardMeshOption {
  labelFa: string;
  labelEn: string;
  wireDiameterMm: number;
  spacingMm: number;
  areaMm2PerM: number;
}

export const STANDARD_MESH_OPTIONS: StandardMeshOption[] = [
  { labelFa: 'φ6 @ 150×150 mm', labelEn: 'φ6 @ 150×150 mm (188 mm²/m)', wireDiameterMm: 6, spacingMm: 150, areaMm2PerM: 188 },
  { labelFa: 'φ8 @ 150×150 mm (متداول)', labelEn: 'φ8 @ 150×150 mm (355 mm²/m)', wireDiameterMm: 8, spacingMm: 150, areaMm2PerM: 355 },
  { labelFa: 'φ8 @ 100×100 mm', labelEn: 'φ8 @ 100×100 mm (503 mm²/m)', wireDiameterMm: 8, spacingMm: 100, areaMm2PerM: 503 },
  { labelFa: 'φ10 @ 200×200 mm', labelEn: 'φ10 @ 200×200 mm (392 mm²/m)', wireDiameterMm: 10, spacingMm: 200, areaMm2PerM: 392 },
  { labelFa: 'φ10 @ 150×150 mm', labelEn: 'φ10 @ 150×150 mm (524 mm²/m)', wireDiameterMm: 10, spacingMm: 150, areaMm2PerM: 524 },
  { labelFa: 'φ12 @ 150×150 mm', labelEn: 'φ12 @ 150×150 mm (754 mm²/m)', wireDiameterMm: 12, spacingMm: 150, areaMm2PerM: 754 },
];

// Presets
export const SAMPLE_PROJECT_FROM_PDF: DesignState = {
  metadata: {
    projectName: 'طراحی سیستم میخ‌کوبی ترانشه‌های تونل اتصال (نمونه گزارش)',
    projectNumber: 'CALC-SN-1405-01',
    client: 'کارفرمای محترم پروژه تونل',
    consultant: 'مهندسین مشاور راه و ابنیه',
    designer: 'کارشناس ژئوتکنیک',
    checker: 'مدیر فنی ژئوتکنیک',
    date: '1405/07/11',
    notes: 'طراحی بر مبنای AASHTO LRFD (US-9th Ed, 2020) و FHWA-NHI-14-007 (GEC 7)',
  },
  tendon: {
    Tmax: 178, // kN
    loadFactorEV: 1.35,
    steelGrade: 'Grade60',
    fy: 400, // MPa
    phiT: 0.75,
    barDiameter: 32, // mm (φ32mm, As = 8.04 cm2)
  },
  pullout: {
    drillholeDiameter: 120, // mm (D_D = 0.120 m)
    effectiveBondLength: 7.0, // m (L_p)
    bondStrength: 150, // kPa (q_u)
    phiPO: 0.65,
    soilDescriptionKey: 'ماسه / شن هوازده',
  },
  plate: {
    plateWidth: 20.0, // cm (200x200 mm)
    holeDiameter: 4.5, // cm (45 mm)
    plateThickness: 2.0, // cm (20 mm)
    fyPlate: 400, // MPa
    fcShotcrete: 20, // MPa
  },
  facing: {
    Sh: 2.0, // m
    Sv: 2.0, // m
    tempThickness: 150, // mm (15 cm)
    tempFc: 20, // MPa
    tempFy: 400, // MPa
    tempMesh: {
      avn: 355,
      avm: 355,
      ahn: 355,
      ahm: 355,
      meshDiameter: 8,
      meshSpacing: 150,
      walerBarsEnabled: false,
      walerBarDiameter: 16,
      walerBarsCount: 2,
    },
    tempCF: 1.5,
    tempCp: 1.0,

    permThickness: 200, // mm (20 cm)
    permFc: 30, // MPa
    permFy: 400, // MPa
    permMesh: {
      avn: 392,
      avm: 392,
      ahn: 392,
      ahm: 392,
      meshDiameter: 10,
      meshSpacing: 200,
      walerBarsEnabled: false,
      walerBarDiameter: 16,
      walerBarsCount: 2,
    },
    permCF: 1.0,
    permCp: 1.0,

    headedStudsCount: 4,
    headedStudDiameter: 16, // mm
    headedStudFy: 350, // MPa
    headedStudType: 'A307',
    phiFH: 0.70,
    phiFF: 0.90,
    phiFP: 0.90,
  },
  corrosion: {
    soilTests: {
      pH: 8.0,
      resistivity: 774, // ohm-cm (< 3000 -> Aggressive!)
      electricalConductivity: 1.3, // dS/m
      chlorides: 56, // ppm (< 100)
      sulfates: 89, // ppm (< 200)
      organicContent: 0.5, // % (< 1.0%)
    },
    designLife: 'permanent',
    selectedClass: 'ClassA',
    ductMaterial: 'PVC',
    ductWallThickness: 1.2, // mm (min 1.0 mm for PVC)
    ductInsideDiameter: 45, // mm (> 32 + 10 = 42 mm)
    internalCentralizerSpacing: 2.5, // m (< 3.0 m)
    externalCentralizerSpacing: 2.5, // m (< 3.0 m)
    epoxyCoatingThickness: 10, // mil
    galvanizingWeight: 2.0, // oz/ft2
    groutCoverClassB: 25.4, // mm
  },
};

export const DEEP_EXCAVATION_PRESET: DesignState = {
  metadata: {
    projectName: 'گودبرداری عمیق شهری - دیواره خیابان ولیعصر',
    projectNumber: 'EXCAV-2026-VALI',
    client: 'شرکت سرمایه‌گذاری مسکن',
    consultant: 'مهندسین مشاور خاک و پایه',
    designer: 'م. احمدی',
    checker: 'د. کمالی',
    date: '1405/01/20',
    notes: 'پروژه موقت پایدارسازی ترانشه گودبرداری به عمق 18 متر با سیستم میخ‌کوبی ترکیبی',
  },
  tendon: {
    Tmax: 145,
    loadFactorEV: 1.35,
    steelGrade: 'Grade60',
    fy: 400,
    phiT: 0.75,
    barDiameter: 28, // φ28
  },
  pullout: {
    drillholeDiameter: 110,
    effectiveBondLength: 6.5,
    bondStrength: 125,
    phiPO: 0.65,
    soilDescriptionKey: 'ماسه لای‌دار ریزدانه',
  },
  plate: {
    plateWidth: 20.0,
    holeDiameter: 4.0,
    plateThickness: 1.8,
    fyPlate: 370,
    fcShotcrete: 20,
  },
  facing: {
    Sh: 1.5,
    Sv: 1.5,
    tempThickness: 120,
    tempFc: 20,
    tempFy: 400,
    tempMesh: {
      avn: 355,
      avm: 355,
      ahn: 355,
      ahm: 355,
      meshDiameter: 8,
      meshSpacing: 150,
      walerBarsEnabled: true,
      walerBarDiameter: 16,
      walerBarsCount: 2,
    },
    tempCF: 1.8,
    tempCp: 1.0,

    permThickness: 150,
    permFc: 25,
    permFy: 400,
    permMesh: {
      avn: 355,
      avm: 355,
      ahn: 355,
      ahm: 355,
      meshDiameter: 8,
      meshSpacing: 150,
      walerBarsEnabled: false,
      walerBarDiameter: 16,
      walerBarsCount: 2,
    },
    permCF: 1.0,
    permCp: 1.0,

    headedStudsCount: 4,
    headedStudDiameter: 16,
    headedStudFy: 350,
    headedStudType: 'A307',
    phiFH: 0.70,
    phiFF: 0.90,
    phiFP: 0.90,
  },
  corrosion: {
    soilTests: {
      pH: 7.4,
      resistivity: 4500, // > 3000 -> Non-aggressive
      electricalConductivity: 0.22,
      chlorides: 30,
      sulfates: 50,
      organicContent: 0.2,
    },
    designLife: 'temporary',
    selectedClass: 'ClassB',
    ductMaterial: 'PVC',
    ductWallThickness: 1.0,
    ductInsideDiameter: 40,
    internalCentralizerSpacing: 2.5,
    externalCentralizerSpacing: 2.5,
    epoxyCoatingThickness: 8,
    galvanizingWeight: 2.0,
    groutCoverClassB: 25.4,
  },
};
