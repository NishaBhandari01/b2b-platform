import { describe, it, expect, vi } from "vitest";

describe("Mocking basic", () => {
  it("Should track function call", () => {
    const notifyUser = vi.fn();
    notifyUser();
    expect(notifyUser).toHaveBeenCalled();
  });
  it("Should track number of calls", () => {
    const sendEmail = vi.fn();
    sendEmail();
    sendEmail();

    expect(sendEmail).toHaveBeenCalledTimes(2);
  });

  it("Should return fake data", async () => {
    const getUser = vi.fn().mockResolvedValue({
      id: "1",
      name: "santosh",
    });

    const user = await getUser();
    expect(user).toEqual({
      id: "1",
      name: "santosh",
    });
  });
});
