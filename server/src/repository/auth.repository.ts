import prisma from "../config/db.js";

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

  async findUserById(id: string) {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async login(email: string, _userData: { password: string }) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async logout(_userId: string) {
    return true;
  }
}

export default new AuthRepository();
