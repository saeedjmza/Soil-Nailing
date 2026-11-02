/**
 * Types and interfaces for AASHTO LRFD 2020 & FHWA-NHI-14-007 Soil Nail Design
 */

export type Language = 'fa' | 'en';

export type SteelGrade = 'Grade60' | 'Grade75' | 'Grade95' | 'Grade150' | 'A36' | 'Custom';

export type FacingType = 'temporary' | 'permanent';

export type CorrosionClass = 'ClassA' | 'ClassB' | 'None';

export type DuctMaterial = 'PVC' | 'HDPE';

export interface SoilChemicalProperties {
  pH: number;
  resistivity: number; // ohm-cm
  electricalConductivity: number; // dS/m (optional, syncs with resistivity: rho = 1000 / EC)
  chlorides: number; // ppm
  sulfates: number; // ppm
  organicContent: number; // % by weight
}

export interface TendonInputs {
  Tmax: number; // kN (Maximum nail load from Limit Equilibrium Analysis)
  loadFactorEV: number; // gamma_p-EV (typically 1.35)
  steelGrade: SteelGrade;
  fy: number; // MPa (Yield strength of bar)
  phiT: number; // Resistance factor for tendon tension (0.75 for mild steel, 0.65 for high strength)
  barDiameter: number; // mm (Nominal rebar diameter, e.g. 25, 28, 32, 36)
  selectedCustomArea?: number; // cm2 if custom
}

export interface PulloutInputs {
  drillholeDiameter: number; // mm (D_D)
  effectiveBondLength: number; // m (L_p behind critical slip surface)
  bondStrength: number; // kPa (q_u grout-ground bond strength)
  phiPO: number; // Resistance factor for pullout (0.65)
  soilDescriptionKey?: string;
}

export interface BearingPlateInputs {
  plateWidth: number; // cm (B_plate = L_plate)
  holeDiameter: number; // cm (D_hole)
  plateThickness: number; // cm (t_plate)
  fyPlate: number; // MPa (Yield strength of steel plate, e.g. 240, 400 MPa)
  fcShotcrete: number; // MPa (Compressive strength of temporary shotcrete)
}

export interface FacingMeshReinforcement {
  avn: number; // mm2/m (Vertical rebar at nail head)
  avm: number; // mm2/m (Vertical rebar at midspan)
  ahn: number; // mm2/m (Horizontal rebar at nail head)
  ahm: number; // mm2/m (Horizontal rebar at midspan)
  meshDiameter: number; // mm
  meshSpacing: number; // mm
  walerBarsEnabled: boolean;
  walerBarDiameter: number; // mm
  walerBarsCount: number;
}

export interface FacingInputs {
  // Common geometry
  Sh: number; // m (Horizontal spacing between nails)
  Sv: number; // m (Vertical spacing between nails)
  
  // Temporary Facing (Initial)
  tempThickness: number; // mm (h_temp, e.g. 100, 150, 200)
  tempFc: number; // MPa (Shotcrete f'c)
  tempFy: number; // MPa (Mesh steel yield strength, e.g. 400 or 500)
  tempMesh: FacingMeshReinforcement;
  tempCF: number; // Non-uniform soil pressure factor (2.0 for 100mm, 1.5 for 150mm, 1.0 for 200mm)
  tempCp: number; // Punching soil pressure reduction factor (typically 1.0 to 1.15)
  
  // Permanent Facing (Final)
  permThickness: number; // mm (h_perm, e.g. 150, 200, 250)
  permFc: number; // MPa (Concrete f'c)
  permFy: number; // MPa (Rebar steel yield strength)
  permMesh: FacingMeshReinforcement;
  permCF: number; // 1.0
  permCp: number; // 1.0
  
  // Headed Studs on Bearing Plate for Permanent Facing
  headedStudsCount: number; // NH (typically 4)
  headedStudDiameter: number; // mm (d_hs, typically 16, 19, 22 mm)
  headedStudFy: number; // MPa (e.g. 350 to 400 MPa)
  headedStudType: 'A307' | 'A325';
  phiFH: number; // Resistance factor for headed studs (0.70 for A307, 0.80 for A325)
  
  phiFF: number; // Resistance factor for facing flexure (0.90)
  phiFP: number; // Resistance factor for facing punching (0.90)
}

export interface CorrosionInputs {
  soilTests: SoilChemicalProperties;
  designLife: 'temporary' | 'permanent'; // temporary < 2 years, permanent > 75 years
  selectedClass: CorrosionClass;
  ductMaterial: DuctMaterial;
  ductWallThickness: number; // mm (min 1.0mm for PVC, 1.5mm for HDPE)
  ductInsideDiameter: number; // mm (must be at least barDiameter + 10mm)
  internalCentralizerSpacing: number; // m (max 3.0m)
  externalCentralizerSpacing: number; // m (max 3.0m)
  epoxyCoatingThickness?: number; // mil (7 to 12 mil)
  galvanizingWeight?: number; // oz/ft2 (min 2.0 oz/ft2)
  groutCoverClassB?: number; // mm (min 25.4 mm = 1 in)
}

export interface ProjectMetadata {
  projectName: string;
  projectNumber: string;
  client: string;
  consultant: string;
  designer: string;
  checker: string;
  date: string;
  notes: string;
}

export interface DesignState {
  metadata: ProjectMetadata;
  tendon: TendonInputs;
  pullout: PulloutInputs;
  plate: BearingPlateInputs;
  facing: FacingInputs;
  corrosion: CorrosionInputs;
}

// Calculation Results interfaces
export interface TendonResults {
  AsRequired: number; // cm2
  AsProvided: number; // cm2
  factoredLoad: number; // kN (gamma * Tmax)
  nominalResistance: number; // kN (R_T)
  factoredResistance: number; // kN (phi_T * R_T)
  demandCapacityRatio: number;
  capacityDemandRatio: number;
  isPassed: boolean;
}

export interface PulloutResults {
  factoredLoad: number; // kN
  nominalResistance: number; // kN (R_PO = pi * D_D * L_P * q_u)
  factoredResistance: number; // kN (phi_PO * R_PO)
  demandCapacityRatio: number;
  capacityDemandRatio: number;
  isPassed: boolean;
}

export interface BearingPlateResults {
  T0: number; // kN (Nail head load)
  fpAllowable: number; // MPa (0.7 * f'c)
  requiredArea: number; // cm2 (T0 / fp)
  netAreaProvided: number; // cm2 (B^2 - pi/4 * D_hole^2)
  contactPressure: number; // kg/cm2
  cantileverLength: number; // cm
  bendingMoment: number; // kg.cm
  requiredThickness: number; // cm
  actualThickness: number; // cm
  bendingStress: number; // kg/cm2 (sigma = M*c / I)
  allowableBendingStress: number; // kg/cm2 (0.75 * fy_plate)
  isBearingAreaPassed: boolean;
  isFlexurePassed: boolean;
  isPassed: boolean;
}

export interface FacingFlexureResults {
  F: number; // mm2
  RFF: number; // kN
  factoredResistance: number; // kN (phi_FF * RFF)
  factoredLoad: number; // kN (gamma * T0)
  CDR: number; // phi_FF * RFF / (gamma * T0)
  isPassed: boolean;
}

export interface FacingPunchingResults {
  DcPrime: number; // m (LPB + hi)
  VF: number; // kN (330 * sqrt(fc) * pi * Dc' * hc)
  RFP: number; // kN (Cp * VF)
  factoredResistance: number; // kN (phi_FP * RFP)
  factoredLoad: number; // kN (gamma * T0)
  CDR: number; // phi_FP * RFP / (gamma * T0)
  isPassed: boolean;
}

export interface HeadedStudsResults {
  AsSingleStud: number; // cm2
  totalAs: number; // cm2
  RFH: number; // kN (NH * As * fy_hs)
  factoredResistance: number; // kN (phi_FH * RFH)
  factoredLoad: number; // kN (gamma * T0)
  CDR: number; // phi_FH * RFH / (gamma * T0)
  isPassed: boolean;
}

export interface CorrosionAssessmentResults {
  isPHSafe: boolean;
  isResistivitySafe: boolean;
  isChloridesSafe: boolean;
  isSulfatesSafe: boolean;
  isOrganicsSafe: boolean;
  isAggressive: boolean;
  recommendedClass: CorrosionClass;
  isDuctThicknessAdequate: boolean;
  isDuctDiameterAdequate: boolean;
  isInternalClearanceAdequate: boolean;
  isClassAdequate: boolean;
  summaryStatus: 'Compliant' | 'Non-Compliant';
}

export interface FullCalculationResults {
  T0: number; // kN
  tendon: TendonResults;
  pullout: PulloutResults;
  plate: BearingPlateResults;
  tempFlexure: FacingFlexureResults;
  tempPunching: FacingPunchingResults;
  permFlexure: FacingFlexureResults;
  permPunching: FacingPunchingResults;
  headedStuds: HeadedStudsResults;
  corrosion: CorrosionAssessmentResults;
  isOverallPassed: boolean;
}
