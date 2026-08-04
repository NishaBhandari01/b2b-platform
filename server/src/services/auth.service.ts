import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { AuthRepository } from "../repository/auth.repository.js";
import { sendEmail } from "../utils/mail.js";
import { resetPasswordEmail } from "../templates/resetPasswordEmail.js";
import { generateResetToken } from "../utils/token.js";
import { AppError } from "../utils/AppError.js";

const authRepository = new AuthRepository();

const getAccessSecret = () => process.env.JWT_SECRET || "dev-access-secret";
const getRefreshSecret = () =>
  process.env.REFRESH_TOKEN_SECRET || "dev-refresh-secret";

const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const createTokenPayload = (user: { id: string; role: UserRole }) => ({
  id: user.id,
  role: user.role,
});
const createSessionPayload = async (user: {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}) => {
  const accessToken = jwt.sign(createTokenPayload(user), getAccessSecret(), {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(createTokenPayload(user), getRefreshSecret(), {
    expiresIn: "7d",
  });

  const hashedRefreshToken = hashToken(refreshToken);

  await authRepository.saveRefreshToken(user.id, hashedRefreshToken);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      verified: false,
      createdAt: user.createdAt,
    },
  };
};

export class AuthService {
  async registerUser(
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ) {
    email = email.trim().toLowerCase();
    const existingUser = await authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await authRepository.createUser({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return await createSessionPayload(user);
  }

  async loginUser(email: string, userData: { password: string }) {
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordValid = await bcrypt.compare(
      userData.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    return await createSessionPayload(user);
  }

  async getCurrentUser(userId: string) {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      verified: false,
      createdAt: user.createdAt,
    };
  }

  async refreshSession(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, getRefreshSecret()) as {
        id: string;
        role: UserRole;
      };

      const user = await authRepository.findUserById(payload.id);

      if (!user) {
        throw new Error("User not found");
      }

      const storedToken = await authRepository.getRefreshToken(user.id);

      if (!storedToken?.hashedRefreshToken) {
        throw new Error("Refresh token not found");
      }

      const hashedToken = hashToken(refreshToken);

      if (hashedToken !== storedToken.hashedRefreshToken) {
        throw new Error("Invalid refresh token");
      }

      return await createSessionPayload(user);
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }

  async logoutUser(userId: string) {
    await authRepository.logout(userId);
    return true;
  }

  async googleLogin(email: string, name: string, role: UserRole = "buyer") {
    email = email.trim().toLowerCase();
    let user = await authRepository.findUserByEmail(email);

    if (!user) {
      const hashedPassword = await bcrypt.hash("google-oauth-placeholder", 10);
      user = await authRepository.createUser({
        name: name || email.split("@")[0],
        email,
        password: hashedPassword,
        role,
      });
    }

    return createSessionPayload(user);
  }

  async forgotPassword(email: string) {
    email = email.trim().toLowerCase();

    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      console.log("❌ User not found");

      return {
        message:
          "If an account with that email exists, a password reset link has been sent.",
      };
    }

    const { token, hashedToken } = generateResetToken();

    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await authRepository.saveResetToken(user.id, hashedToken, expires);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await sendEmail(
      user.email,
      "Reset Password",
      resetPasswordEmail(user.name, resetLink),
    );

    return {
      message:
        "If an account with that email exists, a password reset link has been sent.",
    };
  }

  async resetPassword(token: string, password: string) {
    const hashedToken = hashToken(token);

    const user = await authRepository.findByResetToken(hashedToken);

    if (!user) {
      throw new Error("Invalid or expired reset link.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await authRepository.updatePassword(user.id, hashedPassword);
    await authRepository.clearRefreshToken(user.id);

    return {
      message: "Password reset successfully.",
    };
  }
}

export const authService = new AuthService();
