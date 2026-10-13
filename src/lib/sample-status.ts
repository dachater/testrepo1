export type SampleStatus =
  | "RECEIVED"
  | "IN_TESTING"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED";

const TRANSITIONS: Record<SampleStatus, SampleStatus[]> = {
  RECEIVED: ["IN_TESTING"],
  IN_TESTING: ["PENDING_REVIEW"],
  PENDING_REVIEW: ["APPROVED", "REJECTED", "IN_TESTING"],
  APPROVED: [],
  REJECTED: [],
};

export function canTransition(from: SampleStatus, to: SampleStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

export function assertTransition(from: SampleStatus, to: SampleStatus): void {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid sample status transition: ${from} -> ${to}`);
  }
}
