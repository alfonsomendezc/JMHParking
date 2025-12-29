// Employment codes that do NOT select shift (no day/night choice)
export const SHIFTLESS_CODES = ["Student", "Contractor"];

// Canonical facility IDs 
export const FACILITIES = Object.freeze({
  PPE: "PPE",
  HPG: "HPG",
  NG: "NG",
  PPW: "PPW",
  LOT_10: "LOT_10",
});

// Display labels for facilities
export const FACILITY_LABELS = Object.freeze({
  [FACILITIES.PPE]: "Park Plaza East (Red Garage)",
  [FACILITIES.HPG]: "Highland Park Garage (Yellow Garage)",
  [FACILITIES.NG]: "North Garage (Blue Garage)",
  [FACILITIES.PPW]: "Park Plaza West (Green Garage)",
  [FACILITIES.LOT_10]: "Lot 10",
});

// Constants for shift values (what you store in form state)
export const SHIFTS = Object.freeze({
  DAY: "day",
  NIGHT: "night",
});

// Helper: is this employment code shiftless?
export function isShiftlessEmployment(employmentCode) {
  return SHIFTLESS_CODES.includes(employmentCode);
}

// Core rule: eligible facilities based on employmentCode + shift.
// Notes:
// - Students: Lot 10 only, no shift.
// - Contractors: PPE/HPG only, no shift.
// - Everyone else: day => PPE/HPG, night => PPE/HPG/NG/PPW.

export function getEligibleFacilities(employmentCode, shift) {
  if (!employmentCode) return [];

  // Student: shiftless, Lot 10 only
  if (employmentCode === "Student") {
    return [FACILITIES.LOT_10];
  }

  // Contractor: shiftless, PPE/HPG only
  if (employmentCode === "Contractor") {
    return [FACILITIES.PPE, FACILITIES.HPG];
  }

  // All other employment codes: shift-based
  if (shift === SHIFTS.NIGHT) {
    return [FACILITIES.PPE, FACILITIES.HPG, FACILITIES.NG, FACILITIES.PPW];
  }

  if (shift === SHIFTS.DAY) {
    return [FACILITIES.PPE, FACILITIES.HPG];
  }

  // No shift selected yet
  return [];
}

// Validation helper: is a chosen facility valid for this employmentCode/shift?
export function isFacilityAllowed(employmentCode, shift, facility) {
  if (!facility) return false;
  const eligible = getEligibleFacilities(employmentCode, shift);
  return eligible.includes(facility);
}

// UI helper: convert eligible facility IDs into Mantine Select data items
export function facilitiesToSelectData(facilityIds) {
  return (facilityIds || []).map((id) => ({
    value: id,
    label: FACILITY_LABELS[id] || id,
  }));
}

// Rule: night proof upload required?
// - Students and contractors never pick night/day => never required
// - Everyone else: required if shift is night
export function requiresNightProof(employmentCode, shift) {
  if (!employmentCode) return false;
  if (isShiftlessEmployment(employmentCode)) return false;
  return shift === SHIFTS.NIGHT;
}


