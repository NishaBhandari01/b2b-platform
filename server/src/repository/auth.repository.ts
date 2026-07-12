import prisma from "../config/db.js";
import { resetPasswordEmail } from "../templates/resetPasswordEmail.js";

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

  async saveResetToken(userId: string, hashedToken: string, expires: Date) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: expires,
      },
    });
  }

  async findByResetToken(hashedToken: string) {
    return prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });
  }

  async updatePassword(userId: string, hashedPassword: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
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
