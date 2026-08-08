import { beforeEach, afterEach, describe, expect, it } from "vitest";
import request from "supertest";

import app from "../src/app";
import { cleanDatabase } from "./helper/cleanup";
import { createBuyerToken, createSupplierToken } from "./helper/session.helper";

describe("Quotation API", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterEach(async () => {
    await cleanDatabase();
  });

  async function createRFQ() {
    const buyerToken = await createBuyerToken();

    const response = await request(app)
      .post("/api/rfq")
      .set("Authorization", `Bearer ${buyerToken}`)
      .send({
        title: "Need laptops",
        category: "Electronics",
        quantity: 100,
        budget: 50000,
        deadline: "2026-12-31",
        description: "Looking for supplier",
      });

    return {
      buyerToken,
      rfqId: response.body.data.id,
    };
  }

  describe("GET /api/quotations/:rfqId", () => {
    it("should return quotations for an RFQ", async () => {
      const { rfqId } = await createRFQ();

      const response = await request(app).get(`/api/quotations/${rfqId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should return empty array for RFQ without quotations", async () => {
      const { rfqId } = await createRFQ();

      const response = await request(app).get(`/api/quotations/${rfqId}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });
  });

  describe("POST /api/quotations", () => {
    it("should create quotation", async () => {
      const { rfqId } = await createRFQ();

      const supplierToken = await createSupplierToken();

      const response = await request(app)
        .post("/api/quotations")
        .set("Authorization", `Bearer ${supplierToken}`)
        .send({
          rfqId,
          price: 5000,
          leadTime: "15 days",
          message: "We can supply this product",
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.price).toBe(5000);
    });

    it("should reject without token", async () => {
      const { rfqId } = await createRFQ();

      const response = await request(app).post("/api/quotations").send({
        rfqId,
        price: 5000,
        leadTime: "15 days",
        message: "Test",
      });

      expect(response.status).toBe(401);
    });

    it("should reject invalid token", async () => {
      const { rfqId } = await createRFQ();

      const response = await request(app)
        .post("/api/quotations")
        .set("Authorization", "Bearer invalid-token")
        .send({
          rfqId,
          price: 5000,
          leadTime: "15 days",
          message: "Test",
        });

      expect(response.status).toBe(401);
    });

    it("should reject invalid request body", async () => {
      const { rfqId } = await createRFQ();

      const supplierToken = await createSupplierToken();

      const response = await request(app)
        .post("/api/quotations")
        .set("Authorization", `Bearer ${supplierToken}`)
        .send({
          rfqId,
          leadTime: "15 days",
          message: "Test",
        });

      expect(response.status).toBe(400);
    });
  });
});
