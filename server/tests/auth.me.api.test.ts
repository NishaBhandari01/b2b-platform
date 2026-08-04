import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";

import { createUser } from "./helper/user.factory.js";

import { cleanDatabase } from "./helper/cleanup.js";

describe("GET /api/auth/me", () => {
  beforeEach(async () => {
    await cleanDatabase();
    await createUser();
  });
  afterEach(async () => {
    await cleanDatabase();
  });
  it("should return current user with valid token", async () => {
    const { email, password } = await createUser();

    const loginResponse = await request(app).post("/api/auth/login").send({
      email,
      password,
    });

    const token = loginResponse.body.data.accessToken;

    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.user.email).toBe(email);

    expect(response.body.data.user.role).toBe("buyer");
  });
  it("Should reject request without token", async () => {
    const response = await request(app).get("/api/auth/me");
    console.log(response.body);

    expect(response.status).toBe(401);
  });

  it("Should reject invalid token", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer fake-token`);

    expect(response.status).toBe(401);
  });
});
