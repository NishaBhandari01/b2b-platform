import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";

import app from "../src/app.js";

import { cleanDatabase } from "./helper/cleanup.js";
import { createBuyerToken } from "./helper/session.helper.js";

describe("POST /api/rfq", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterEach(async () => {
    await cleanDatabase();
  });

  it("should create RFQ as buyer", async () => {
    const token = await createBuyerToken();

    const response = await request(app)
      .post("/api/rfq")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Need laptops",
        category: "Electronics",
        quantity: 100,
        budget: 50000,
        deadline: "2026-12-31",
        description: "Looking for laptop supplier",
      });

    expect(response.status).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.data.title).toBe("Need laptops");
  });

  it("should reject RFQ creation without token", async () => {
    const response = await request(app).post("/api/rfq").send({
      title: "Need laptops",
      category: "Electronics",
      quantity: 100,
      budget: 50000,
      deadline: "2026-12-31",
      description: "Looking for laptop supplier",
    });

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);
  });

  it("should reject RFQ creation with invalid token", async () => {
    const response = await request(app)
      .post("/api/rfq")
      .set("Authorization", "Bearer invalid-token")
      .send({
        title: "Need laptops",
        category: "Electronics",
        quantity: 100,
        budget: 50000,
        deadline: "2026-12-31",
        description: "Looking for supplier",
      });

    expect(response.status).toBe(401);
  });

  it("should reject RFQ without title", async () => {
    const token = await createBuyerToken();

    const response = await request(app)
      .post("/api/rfq")
      .set("Authorization", `Bearer ${token}`)
      .send({
        category: "Electronics",
        quantity: 100,
        budget: 50000,
        deadline: "2026-12-31",
        description: "Need supplier",
      });

    expect(response.status).toBe(400);
  });

  it("should reject RFQ with invalid quantity", async () => {
    const token = await createBuyerToken();

    const response = await request(app)
      .post("/api/rfq")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Need laptops",
        category: "Electronics",
        quantity: -10,
        budget: 50000,
        deadline: "2026-12-31",
        description: "Need supplier",
      });

    expect(response.status).toBe(400);
  });
});
