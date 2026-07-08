import prisma from "../config/db.js";
// import { Prisma } from "@prisma/client";

export class AuthRepository {
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role: "buyer" | "supplier" | "admin";
  }) {
    return await prisma.user.create({
      data: userData,
    });
  }

  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}

export default new AuthRepository();
