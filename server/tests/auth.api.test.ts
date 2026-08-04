import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";

import app from "../src/app.js";

import { createUser } from "./helper/user.factory.js";
import { cleanDatabase } from "./helper/cleanup.js";

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterEach(async () => {
    await cleanDatabase();
  });

  it("should login user successfully", async () => {
    const user = await createUser();

    const response = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: user.password,
    });

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.accessToken).toBeDefined();

    expect(response.body.data.refreshToken).toBeDefined();

    expect(response.body.data.user.email).toBe(user.email);
  });

  it("should reject invalid password", async () => {
    const user = await createUser();

    const response = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should reject unknown user", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "unknown@gmail.com",
      password: "password123",
    });

    expect(response.status).toBe(401);
  });

  it("should reject unknown user", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "unknown@gmail.com",
      password: "password123",
    });

    expect(response.status).toBe(401);
  });
});
