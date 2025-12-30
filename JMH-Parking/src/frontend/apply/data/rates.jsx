import { SHIFTS, isShiftlessEmployment } from "./policies";

const RATE_TABLE = {
  A1: { [SHIFTS.DAY]: 22.15, [SHIFTS.NIGHT]: 11.07 },
  A2: { [SHIFTS.DAY]: 22.15, [SHIFTS.NIGHT]: 11.07 },
  A3: { [SHIFTS.DAY]: 5.54, [SHIFTS.NIGHT]: 5.54 },
  A4: { [SHIFTS.DAY]: 22.15, [SHIFTS.NIGHT]: 11.07 },
  A5: { [SHIFTS.DAY]: 22.15, [SHIFTS.NIGHT]: 11.07 },
  B1: { [SHIFTS.DAY]: 22.15, [SHIFTS.NIGHT]: 11.07 },
  B4: { [SHIFTS.DAY]: 22.15, [SHIFTS.NIGHT]: 11.07 },

  B2: { [SHIFTS.DAY]: 48, [SHIFTS.NIGHT]: 24 },
  B3: { [SHIFTS.DAY]: 48, [SHIFTS.NIGHT]: 24 },
  C1: { [SHIFTS.DAY]: 48, [SHIFTS.NIGHT]: 24 },
  C2: { [SHIFTS.DAY]: 48, [SHIFTS.NIGHT]: 24 },
  C4: { [SHIFTS.DAY]: 48, [SHIFTS.NIGHT]: 24 },

  Contractor: { [SHIFTS.DAY]: 88 },
  Student: { [SHIFTS.DAY]: 36 },
};

export function getRate(employmentCode, shift) {
  if (!employmentCode) return null;

  const entry = RATE_TABLE[employmentCode];
  if (!entry) return null;

  // Shiftless roles: no shift selection → default to DAY rate
  if (isShiftlessEmployment(employmentCode)) {
    const value = entry[SHIFTS.DAY];
    return typeof value === "number" ? value : null;
  }

  // Shift-based roles must provide a shift
  if (!shift) return null;

  const value = entry[shift];
  return typeof value === "number" ? value : null;
}
