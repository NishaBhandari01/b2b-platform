import { Request } from "supertest";
import app from "../src/app";
import { cleanDatabase } from "./helper/cleanup";
import {
  createSupplierToken,
  createBuyerToken,
  createAdminToken,
} from "./helper/session.helper";
import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";

describe("Product API", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  it("Shold create product draft as supplier", async () => {
    const token = await createSupplierToken();

    const response = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Industrial Motor",
        category: "Machines",
        description: "Heavy duty motor",
        price: 5000,
        currency: "NPR",
        minOrderQty: 10,
      });
    expect(response.status).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.data.name).toBe("Industrial Motor");

    expect(response.body.data.status).toBe("draft");
  });

  it("Should reject product creation without token", async () => {
    const response = await request(app).post("/api/products").send({
      name: "Motor",
      category: "Machines",
      description: "Test product",
    });

    expect(response.status).toBe(401);
  });

  it("Should reject product without name", async () => {
    const token = await createSupplierToken();

    const response = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        category: "Machines",
        description: "Test product",
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe("Product name is required");
  });

  it("Should get supplier products", async () => {
    const token = await createSupplierToken();

    await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Laptop",
        category: "Electronics",
        description: "Business laptop",
      });

    const response = await request(app)
      .get("/api/products/my-products")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.data.length).toBe(1);
  });

  it("should update product", async () => {
    const token = await createSupplierToken();

    const createResponse = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Old Name",
        category: "Tools",
        description: "Old description",
      });

    const productId = createResponse.body.data.id;

    const updateResponse = await request(app)
      .patch(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Name",
      });

    expect(updateResponse.status).toBe(200);

    expect(updateResponse.body.data.name).toBe("Updated Name");
  });

  it("Should get product by id", async () => {
    const token = await createSupplierToken();

    //create product first

    const createResponse = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Dell laptop",
        category: "Electronics",
        description: "Gaming laptop",
        minOrderQty: 10,
      });

    const productId = createResponse.body.data.id;

    const response = await request(app)
      .get(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.id).toBe(productId);

    expect(response.body.data.name).toBe("Dell laptop");
  });

  it("Shold check supplier ownerShp", async () => {
    const supplierAToken = await createSupplierToken();

    // Supplier A creates product
    const createResponse = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${supplierAToken}`)
      .send({
        name: "Dell Laptop",
        category: "Electronics",
        description: "Gaming laptop",
        minOrderQty: 10,
      });

    const productId = createResponse.body.data.id;

    //supplier B tries to access Supplier A product

    const supplierBToken = await createSupplierToken();

    const response = await request(app)
      .get(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${supplierBToken}`);

    expect(response.status).toBe(404);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Product not found");
  });

  it("delete Product", async () => {
    const token = await createSupplierToken();

    const createResponse = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Dell Laptop",
        category: "Electronics",
        description: "Gaming laptop",
        minOrderQty: 10,
      });

    const productId = createResponse.body.data.id;

    const response = await request(app)
      .delete(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.message).toBe("Product deleted successfully");
  });
});
