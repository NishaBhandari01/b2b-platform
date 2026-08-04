import { describe, it, expect, vi } from "vitest";
import { registerUser } from "../src/services/user.service.js";

vi.mock("../src/services/email.service.js", () => {
  return {
    sendEmail: vi.fn(() => {
      return "Fake email sent";
    }),
  };
});

describe("User Registration", () => {
  it("Should send Email after registration", () => {
    const result = registerUser("test@gmail.com");

    expect(result).toBe("Fake email sent");
  });
});
