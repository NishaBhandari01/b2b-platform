import { describe, it, expect } from "vitest";

describe("Vitest Matchers", () => {
  it("Should compate primitive values", () => {
    const age = 23;
    expect(age).toBe(23);
  });
});

// it("should comapre objects", () => {
//   const user = {
//     name: "santosh",
//     role: "developer",
//   };

//   expect(user).toEqual({
//     name: "santosh",
//     role: "developer",
//   });
// });

it("Should compare object", () => {
  const movie = {
    name: "TOM HOLLAND",
    role: "SPIDERMAN",
  };
  expect(movie).toEqual({
    name: "TOM HOLLAND",
    role: "SPIDERMAN",
  });
});

it("should check array contains value", () => {
  const roles = ["ADMIN", "BUYER"];
  expect(roles).toContain("ADMIN");
});

it("Should check token exists", () => {
  const token = "abc123";
  expect(token).toBeTruthy();
});
