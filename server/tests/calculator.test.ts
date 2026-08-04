import { describe, it, expect } from "vitest";
import { multiply } from "../src/utils/calculator";

describe("Calcultor", () => {
  it("Should multiply two numbers", () => {
    const result = multiply(3, 4);
    expect(result).toBe(12);
  });
});
