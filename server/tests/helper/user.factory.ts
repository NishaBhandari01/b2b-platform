import bcrypt from "bcrypt";
import prisma from "../../src/config/db.js";
import { randomUUID } from "crypto";

type CreateUserOptions = {
  role?: "buyer" | "supplier" | "admin";
  email?: string;
  password?: string;
};

export async function createUser(options: CreateUserOptions = {}) {
  const password = options.password ?? "password123";

  const email = options.email ?? `test-${randomUUID()}@example.com`;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: "Test User",
      role: options.role ?? "buyer",
    },
  });

  return {
    user,
    email,
    password,
  };
}
