/**
 * AASHTO LRFD (9th Ed, 2020) & FHWA-NHI-14-007 (GEC 7) Calculation Engine
 */
import {
  DesignState,
  FullCalculationResults,
  TendonResults,
  PulloutResults,
  BearingPlateResults,
  FacingFlexureResults,
  FacingPunchingResults,
  HeadedStudsResults,
  CorrosionAssessmentResults,
} from '../types/nailing';

/**
 * Calculate nail head tension T0 from maximum nail load Tmax using Clouterre formula
 * T0 = Tmax * [ 0.6 + 0.2 * (Smax - 1) ] where Smax = max(Sh, Sv) in meters
 */
export function calculateNailHeadTension(Tmax: number, Sh: number, Sv: number): number {
  const Smax = Math.max(Sh, Sv);
  const factor = 0.6 + 0.2 * (Smax - 1);
  return Number((Tmax * factor).toFixed(2));
}

/**
 * 1. Control of Tendon Tensile Resistance (AASHTO 11.12.6.1)
 * phi_T * R_T >= gamma_p_EV * T_maxsn
 */
export function calculateTendonCapacity(
  Tmax: number,
  loadFactorEV: number,
  fy: number, // MPa
  phiT: number,
  barDiameter: number // mm
): TendonResults {
  const factoredLoad = loadFactorEV * Tmax; // kN
  const barRadiusCm = barDiameter / 20; // cm
  const AsProvided = Math.PI * Math.pow(barRadiusCm, 2); // cm2
  
  // Nominal resistance RT = As * fy
  // As in cm2, fy in MPa -> (As * 100 mm2) * (fy N/mm2) / 1000 = kN
  const nominalResistance = (AsProvided * 100 * fy) / 1000; // kN
  const factoredResistance = phiT * nominalResistance; // kN

  // Required steel area: As_req = (gamma * Tmax) / (phi_T * fy)
  // (factoredLoad in kN * 1000 N) / (phi_T * fy MPa) -> mm2 -> / 100 -> cm2
  const AsRequired = (factoredLoad * 1000) / (phiT * fy * 100);

  const demandCapacityRatio = factoredLoad / factoredResistance;
  const capacityDemandRatio = factoredResistance / factoredLoad;
  const isPassed = factoredResistance >= factoredLoad;

  return {
    AsRequired: Number(AsRequired.toFixed(2)),
    AsProvided: Number(AsProvided.toFixed(2)),
    factoredLoad: Number(factoredLoad.toFixed(2)),
    nominalResistance: Number(nominalResistance.toFixed(2)),
    factoredResistance: Number(factoredResistance.toFixed(2)),
    demandCapacityRatio: Number(demandCapacityRatio.toFixed(3)),
    capacityDemandRatio: Number(capacityDemandRatio.toFixed(3)),
    isPassed,
  };
}

/**
 * 2. Control of Grout-Ground Pullout Resistance (AASHTO 11.12.5.2)
 * phi_PO * R_PO >= gamma_p_EV * T_maxsn
 * R_PO = pi * D_D * L_P * q_u
 */
export function calculatePulloutCapacity(
  Tmax: number,
  loadFactorEV: number,
  drillholeDiameterMm: number, // mm
  effectiveBondLengthM: number, // m
  bondStrengthKPa: number, // kPa
  phiPO: number
): PulloutResults {
  const factoredLoad = loadFactorEV * Tmax; // kN
  const DD_m = drillholeDiameterMm / 1000; // m
  
  // R_PO = pi * D_D * L_P * q_u
  // [m] * [m] * [kN/m2] = kN
  const nominalResistance = Math.PI * DD_m * effectiveBondLengthM * bondStrengthKPa;
  const factoredResistance = phiPO * nominalResistance;

  const demandCapacityRatio = factoredLoad / factoredResistance;
  const capacityDemandRatio = factoredResistance / factoredLoad;
  const isPassed = factoredResistance >= factoredLoad;

  return {
    factoredLoad: Number(factoredLoad.toFixed(2)),
    nominalResistance: Number(nominalResistance.toFixed(2)),
    factoredResistance: Number(factoredResistance.toFixed(2)),
    demandCapacityRatio: Number(demandCapacityRatio.toFixed(3)),
    capacityDemandRatio: Number(capacityDemandRatio.toFixed(3)),
    isPassed,
  };
}

/**
 * 3. Nail Head Bearing Plate Design
 * Controls: Bearing stress on shotcrete/concrete, Cantilever bending moment & flexural stress
 */
export function calculateBearingPlate(
  T0: number, // kN
  plateWidthCm: number, // B (cm)
  holeDiameterCm: number, // D_hole (cm)
  plateThicknessCm: number, // t (cm)
  fyPlateMPa: number, // MPa
  fcShotcreteMPa: number // MPa
): BearingPlateResults {
  // Allowable bearing stress fp = 0.7 * f'c (MPa)
  const fpAllowable = 0.7 * fcShotcreteMPa; // MPa (e.g. 14 MPa)
  // fp in kN/cm2: 1 MPa = 0.1 kN/cm2
  const fpKnPerCm2 = fpAllowable * 0.1;

  // Required plate bearing area
  const requiredArea = T0 / fpKnPerCm2; // cm2

  // Net provided area: B^2 - pi/4 * D_hole^2
  const netAreaProvided = Math.pow(plateWidthCm, 2) - (Math.PI / 4) * Math.pow(holeDiameterCm, 2);

  // Convert T0 to kg for classical plate bending checks (1 kN = 101.9716 kgf)
  const T0_kg = T0 * 101.9716;
  const contactPressure = T0_kg / Math.max(netAreaProvided, 1); // kg/cm2

  // Cantilever length: l = (B - D_hole) / 2
  const cantileverLength = (plateWidthCm - holeDiameterCm) / 2; // cm

  // Cantilever moment: M = q * l^2 / 2 (kg.cm / cm width)
  const bendingMoment = (contactPressure * Math.pow(cantileverLength, 2)) / 2; // kg.cm/cm

  // Allowable bending stress: Fb = 0.75 * fy_plate (in kg/cm2, 1 MPa = 10.197 kg/cm2)
  const fyPlateKgCm2 = fyPlateMPa * 10.19716;
  // According to standard steel AISC / ASD: Fb = 0.75 * Fy
  const allowableBendingStress = 0.75 * fyPlateKgCm2;

  // Required thickness: t_req = sqrt(6 * M / Fb)
  const requiredThickness = Math.sqrt((6 * bendingMoment) / allowableBendingStress);

  // Actual bending stress: sigma = M * (t/2) / (1/12 * t^3) = 6 * M / t^2
  const bendingStress = (6 * bendingMoment) / Math.pow(plateThicknessCm, 2);

  const isBearingAreaPassed = netAreaProvided >= requiredArea;
  const isFlexurePassed = bendingStress <= allowableBendingStress;
  const isPassed = isBearingAreaPassed && isFlexurePassed;

  return {
    T0: Number(T0.toFixed(2)),
    fpAllowable: Number(fpAllowable.toFixed(2)),
    requiredArea: Number(requiredArea.toFixed(2)),
    netAreaProvided: Number(netAreaProvided.toFixed(2)),
    contactPressure: Number(contactPressure.toFixed(2)),
    cantileverLength: Number(cantileverLength.toFixed(2)),
    bendingMoment: Number(bendingMoment.toFixed(2)),
    requiredThickness: Number(requiredThickness.toFixed(2)),
    actualThickness: plateThicknessCm,
    bendingStress: Number(bendingStress.toFixed(2)),
    allowableBendingStress: Number(allowableBendingStress.toFixed(2)),
    isBearingAreaPassed,
    isFlexurePassed,
    isPassed,
  };
}

/**
 * 4. Facing Flexural Resistance (AASHTO 11.12.6.2.2 & FHWA NHI-14-007)
 * R_FF [kN] = 0.0038 * CF * Fy [MPa] * F [mm2]
 * F = min( (avn + avm) * (Sh * h / Sv), (ahn + ahm) * (Sv * h / Sh) )
 * CDR = phi_FF * R_FF / (gamma * T0) >= 1.0
 */
export function calculateFacingFlexure(
  T0: number, // kN
  loadFactorEV: number,
  phiFF: number,
  ShM: number, // m
  SvM: number, // m
  thicknessMm: number, // mm
  fyMPa: number, // MPa
  CF: number,
  avn: number, // mm2/m
  avm: number, // mm2/m
  ahn: number, // mm2/m
  ahm: number  // mm2/m
): FacingFlexureResults {
  const hM = thicknessMm / 1000; // m
  const factoredLoad = loadFactorEV * T0; // kN

  const termV = (avn + avm) * ((ShM * hM) / SvM); // mm2
  const termH = (ahn + ahm) * ((SvM * hM) / ShM); // mm2
  const F = Math.min(termV, termH);

  // SI formula: RFF [kN] = 0.0038 * CF * Fy [MPa] * F [mm2]
  const RFF = 0.0038 * CF * fyMPa * F; // kN
  const factoredResistance = phiFF * RFF; // kN

  const CDR = factoredResistance / Math.max(factoredLoad, 0.001);
  const isPassed = CDR >= 1.0;

  return {
    F: Number(F.toFixed(2)),
    RFF: Number(RFF.toFixed(2)),
    factoredResistance: Number(factoredResistance.toFixed(2)),
    factoredLoad: Number(factoredLoad.toFixed(2)),
    CDR: Number(CDR.toFixed(3)),
    isPassed,
  };
}

/**
 * 5. Facing Punching Shear Resistance (AASHTO 11.12.6.2.2 & FHWA NHI-14-007)
 * Dc' = LPB + hi
 * VF [kN] = 330 * sqrt(fc' [MPa]) * pi * Dc' [m] * hc [m]
 * RFP = Cp * VF
 * CDR = phi_FP * RFP / (gamma * T0) >= 1.0
 */
export function calculateFacingPunching(
  T0: number, // kN
  loadFactorEV: number,
  phiFP: number,
  plateWidthCm: number, // cm
  facingThicknessMm: number, // mm
  fcMPa: number, // MPa
  Cp: number = 1.0
): FacingPunchingResults {
  const factoredLoad = loadFactorEV * T0; // kN
  const LPB_m = plateWidthCm / 100; // m
  const hc_m = facingThicknessMm / 1000; // m
  const DcPrime = LPB_m + hc_m; // m

  // VF [kN] = 330 * sqrt(fc') * pi * Dc' * hc
  const VF = 330 * Math.sqrt(fcMPa) * Math.PI * DcPrime * hc_m; // kN
  const RFP = Cp * VF; // kN
  const factoredResistance = phiFP * RFP;

  const CDR = factoredResistance / Math.max(factoredLoad, 0.001);
  const isPassed = CDR >= 1.0;

  return {
    DcPrime: Number(DcPrime.toFixed(3)),
    VF: Number(VF.toFixed(2)),
    RFP: Number(RFP.toFixed(2)),
    factoredResistance: Number(factoredResistance.toFixed(2)),
    factoredLoad: Number(factoredLoad.toFixed(2)),
    CDR: Number(CDR.toFixed(3)),
    isPassed,
  };
}

/**
 * 6. Headed Studs Tensile Resistance for Permanent Facing (AASHTO 11.12.6.2.3)
 * RFH = NH * As * Fy_hs
 * CDR = phi_FH * RFH / (gamma * T0) >= 1.0
 */
export function calculateHeadedStuds(
  T0: number, // kN
  loadFactorEV: number,
  phiFH: number,
  studsCount: number,
  studDiameterMm: number,
  fyHsMPa: number
): HeadedStudsResults {
  const factoredLoad = loadFactorEV * T0; // kN
  const studRadiusCm = studDiameterMm / 20; // cm
  const AsSingleStud = Math.PI * Math.pow(studRadiusCm, 2); // cm2
  const totalAs = studsCount * AsSingleStud; // cm2

  // RFH = NH * As * fy_hs
  // As in cm2, fy in MPa -> (totalAs * 100 mm2) * (fyHs N/mm2) / 1000 = kN
  const RFH = (totalAs * 100 * fyHsMPa) / 1000; // kN
  const factoredResistance = phiFH * RFH;

  const CDR = factoredResistance / Math.max(factoredLoad, 0.001);
  const isPassed = CDR >= 1.0;

  return {
    AsSingleStud: Number(AsSingleStud.toFixed(2)),
    totalAs: Number(totalAs.toFixed(2)),
    RFH: Number(RFH.toFixed(2)),
    factoredResistance: Number(factoredResistance.toFixed(2)),
    factoredLoad: Number(factoredLoad.toFixed(2)),
    CDR: Number(CDR.toFixed(3)),
    isPassed,
  };
}

/**
 * 7. Soil Corrosiveness & Permanent Corrosion Protection Evaluation
 * AASHTO LRFD 11.12.8 & FHWA NHI-14-007
 */
export function evaluateCorrosionProtection(
  state: DesignState
): CorrosionAssessmentResults {
  const { soilTests, selectedClass, ductMaterial, ductWallThickness, ductInsideDiameter } = state.corrosion;
  const barDiameter = state.tendon.barDiameter;

  // Criteria for Non-aggressive soil:
  // 5 <= pH <= 10
  // Resistivity >= 3000 ohm-cm (or EC <= 1.0 dS/m)
  // Chlorides <= 100 ppm
  // Sulfates <= 200 ppm
  // Organics <= 1.0 %
  const isPHSafe = soilTests.pH >= 5.0 && soilTests.pH <= 10.0;
  const isResistivitySafe = soilTests.resistivity >= 3000;
  
  // If resistivity >= 5000 ohm-cm, chloride and sulfate requirements may be waived
  const waiverActive = soilTests.resistivity >= 5000;
  const isChloridesSafe = waiverActive || soilTests.chlorides <= 100;
  const isSulfatesSafe = waiverActive || soilTests.sulfates <= 200;
  const isOrganicsSafe = soilTests.organicContent <= 1.0;

  const isNonAggressive = isPHSafe && isResistivitySafe && isChloridesSafe && isSulfatesSafe && isOrganicsSafe;
  const isAggressive = !isNonAggressive;

  // AASHTO: For aggressive soils or unknown conditions, Class A encapsulation is mandatory
  const recommendedClass = isAggressive ? 'ClassA' : 'ClassB';

  // Duct thickness check (PVC min 1.0mm, HDPE min 1.5mm)
  const minDuctThickness = ductMaterial === 'PVC' ? 1.0 : 1.5;
  const isDuctThicknessAdequate = ductWallThickness >= minDuctThickness;

  // Duct inside diameter must be at least bar diameter + 10 mm (0.4 inch)
  const minInsideDiameter = barDiameter + 10;
  const isDuctDiameterAdequate = ductInsideDiameter >= minInsideDiameter;

  // Internal grout clearance must be at least 5 mm (0.2 inch) all around
  const internalClearance = (ductInsideDiameter - barDiameter) / 2;
  const isInternalClearanceAdequate = internalClearance >= 5.0;

  // Class adequacy
  let isClassAdequate = false;
  let summaryStatus: 'Compliant' | 'Non-Compliant' = 'Non-Compliant';

  if (selectedClass === 'None') {
    // Permitted only for temporary walls (life < 2 years) per FHWA & AASHTO
    isClassAdequate = true;
    summaryStatus = state.corrosion.designLife === 'temporary' ? 'Compliant' : 'Non-Compliant';
  } else if (selectedClass === 'ClassA') {
    isClassAdequate = true;
    summaryStatus = (isDuctThicknessAdequate && isDuctDiameterAdequate && isInternalClearanceAdequate)
      ? 'Compliant'
      : 'Non-Compliant';
  } else if (selectedClass === 'ClassB') {
    isClassAdequate = !isAggressive;
    summaryStatus = isClassAdequate ? 'Compliant' : 'Non-Compliant';
  }

  return {
    isPHSafe,
    isResistivitySafe,
    isChloridesSafe,
    isSulfatesSafe,
    isOrganicsSafe,
    isAggressive,
    recommendedClass,
    isDuctThicknessAdequate: selectedClass === 'None' ? true : isDuctThicknessAdequate,
    isDuctDiameterAdequate: selectedClass === 'None' ? true : isDuctDiameterAdequate,
    isInternalClearanceAdequate: selectedClass === 'None' ? true : isInternalClearanceAdequate,
    isClassAdequate,
    summaryStatus,
  };
}

/**
 * Execute full calculation suite on current design state
 */
export function calculateAll(state: DesignState): FullCalculationResults {
  const { tendon, pullout, plate, facing } = state;

  // 1. Nail head load
  const T0 = calculateNailHeadTension(tendon.Tmax, facing.Sh, facing.Sv);

  // 2. Tendon tension check
  const tendonRes = calculateTendonCapacity(
    tendon.Tmax,
    tendon.loadFactorEV,
    tendon.fy,
    tendon.phiT,
    tendon.barDiameter
  );

  // 3. Pullout resistance check
  const pulloutRes = calculatePulloutCapacity(
    tendon.Tmax,
    tendon.loadFactorEV,
    pullout.drillholeDiameter,
    pullout.effectiveBondLength,
    pullout.bondStrength,
    pullout.phiPO
  );

  // 4. Bearing plate check
  const plateRes = calculateBearingPlate(
    T0,
    plate.plateWidth,
    plate.holeDiameter,
    plate.plateThickness,
    plate.fyPlate,
    plate.fcShotcrete
  );

  // 5. Temporary facing checks
  const tempFlexure = calculateFacingFlexure(
    T0,
    tendon.loadFactorEV,
    facing.phiFF,
    facing.Sh,
    facing.Sv,
    facing.tempThickness,
    facing.tempFy,
    facing.tempCF,
    facing.tempMesh.avn,
    facing.tempMesh.avm,
    facing.tempMesh.ahn,
    facing.tempMesh.ahm
  );

  const tempPunching = calculateFacingPunching(
    T0,
    tendon.loadFactorEV,
    facing.phiFP,
    plate.plateWidth,
    facing.tempThickness,
    facing.tempFc,
    facing.tempCp
  );

  // 6. Permanent facing checks
  const permFlexure = calculateFacingFlexure(
    T0,
    tendon.loadFactorEV,
    facing.phiFF,
    facing.Sh,
    facing.Sv,
    facing.permThickness,
    facing.permFy,
    facing.permCF,
    facing.permMesh.avn,
    facing.permMesh.avm,
    facing.permMesh.ahn,
    facing.permMesh.ahm
  );

  const permPunching = calculateFacingPunching(
    T0,
    tendon.loadFactorEV,
    facing.phiFP,
    plate.plateWidth,
    facing.permThickness,
    facing.permFc,
    facing.permCp
  );

  // 7. Headed studs check
  const headedStuds = calculateHeadedStuds(
    T0,
    tendon.loadFactorEV,
    facing.phiFH,
    facing.headedStudsCount,
    facing.headedStudDiameter,
    facing.headedStudFy
  );

  // 8. Corrosion check
  const corrosion = evaluateCorrosionProtection(state);

  const isOverallPassed =
    tendonRes.isPassed &&
    pulloutRes.isPassed &&
    plateRes.isPassed &&
    tempFlexure.isPassed &&
    tempPunching.isPassed &&
    permFlexure.isPassed &&
    permPunching.isPassed &&
    headedStuds.isPassed &&
    corrosion.summaryStatus === 'Compliant';

  return {
    T0,
    tendon: tendonRes,
    pullout: pulloutRes,
    plate: plateRes,
    tempFlexure,
    tempPunching,
    permFlexure,
    permPunching,
    headedStuds,
    corrosion,
    isOverallPassed,
  };
}
