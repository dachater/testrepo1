import { describe, expect, it } from "vitest";
import { assertTransition, canTransition } from "../src/lib/sample-status";
import { evaluateSpec } from "../src/lib/spec";

describe("sample status machine", () => {
  it("allows the normal flow", () => {
    expect(canTransition("RECEIVED", "IN_TESTING")).toBe(true);
    expect(canTransition("IN_TESTING", "PENDING_REVIEW")).toBe(true);
    expect(canTransition("PENDING_REVIEW", "APPROVED")).toBe(true);
  });
  it("rejects skipping steps and leaving terminal states", () => {
    expect(canTransition("RECEIVED", "APPROVED")).toBe(false);
    expect(canTransition("APPROVED", "IN_TESTING")).toBe(false);
    expect(() => assertTransition("REJECTED", "RECEIVED")).toThrow();
  });
});

describe("evaluateSpec", () => {
  const spec = { minValue: 1, maxValue: 5 };
  it("treats limits as inclusive", () => {
    expect(evaluateSpec(1, spec)).toBe(true);
    expect(evaluateSpec(5, spec)).toBe(true);
  });
  it("fails outside limits", () => {
    expect(evaluateSpec(0.99, spec)).toBe(false);
    expect(evaluateSpec(5.01, spec)).toBe(false);
  });
  it("handles open-ended limits and NaN", () => {
    expect(evaluateSpec(100, { minValue: 1, maxValue: null })).toBe(true);
    expect(evaluateSpec(-1, { minValue: null, maxValue: 5 })).toBe(true);
    expect(evaluateSpec(NaN, spec)).toBe(false);
  });
});
