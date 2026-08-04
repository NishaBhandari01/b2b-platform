import request from "supertest";
import app from "../../src/app.js";

export async function login(email: string, password: string) {
  const response = await request(app).post("/api/auth/login").send({
    email,
    password,
  });

  if (response.status !== 200) {
    throw new Error(`Login failed: ${JSON.stringify(response.body)}`);
  }

  return response.body.data.accessToken;
}
