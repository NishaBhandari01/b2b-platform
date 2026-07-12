import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { AuthRepository } from "../repository/auth.repository.js";
import { sendEmail } from "../utils/mail.js";
import { resetPasswordEmail } from "../templates/resetPasswordEmail.js";
import { generateResetToken } from "../utils/token.js";

const authRepository = new AuthRepository();

const getAccessSecret = () => process.env.JWT_SECRET || "dev-access-secret";
const getRefreshSecret = () =>
  process.env.REFRESH_TOKEN_SECRET || "dev-refresh-secret";

const createTokenPayload = (user: { id: string; role: UserRole }) => ({
  id: user.id,
  role: user.role,
});

const createSessionPayload = (user: {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}) => ({
  accessToken: jwt.sign(createTokenPayload(user), getAccessSecret(), {
    expiresIn: "15m",
  }),
  refreshToken: jwt.sign(createTokenPayload(user), getRefreshSecret(), {
    expiresIn: "7d",
  }),
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    verified: false,
    createdAt: user.createdAt,
  },
});

export class AuthService {
  async registerUser(
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ) {
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

    return createSessionPayload(user);
  }

  async loginUser(email: string, userData: { password: string }) {
    const user = await authRepository.login(email, userData);

    const isPasswordValid = await bcrypt.compare(
      userData.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    return createSessionPayload(user);
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
    const payload = jwt.verify(refreshToken, getRefreshSecret()) as {
      id: string;
      role: UserRole;
    };

    const user = await authRepository.findUserById(payload.id);
    if (!user) {
      throw new Error("User not found");
    }

    return createSessionPayload(user);
  }

  async logoutUser(userId: string) {
    await authRepository.logout(userId);
    return true;
  }

  async googleLogin(email: string, name: string, role: UserRole = "buyer") {
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

  // async forgotPassword(email: string) {
  //   const user = await authRepository.findUserByEmail(email);

  //   /**
  //    * Never reveal whether an email exists.
  //    * This prevents email enumeration attacks.
  //    */
  //   if (!user) {
  //     return {
  //       message:
  //         "If an account with that email exists, a password reset link has been sent.",
  //     };
  //   }

  //   const { token, hashedToken } = generateResetToken();

  //   const expires = new Date(Date.now() + 15 * 60 * 1000);

  //   await authRepository.saveResetToken(user.id, hashedToken, expires);

  //   const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  //   await sendEmail(
  //     user.email,
  //     "Reset Your Password",
  //     resetPasswordEmail(user.name, resetLink),
  //   );

  //   return {
  //     message:
  //       "If an account with that email exists, a password reset link has been sent.",
  //   };
  // }

  // async forgotPassword(email: string) {
  //   console.log("Forgot password requested for:", email);

  //   const user = await authRepository.findUserByEmail(email);

  //   console.log("User found:", user);

  //   if (!user) {
  //     return {
  //       message:
  //         "If an account with that email exists, a password reset link has been sent.",
  //     };
  //   }

  //   const { token, hashedToken } = generateResetToken();

  //   console.log("Generated Token:", token);
  //   console.log("Generated Hash:", hashedToken);

  //   const expires = new Date(Date.now() + 15 * 60 * 1000);

  //   await authRepository.saveResetToken(user.id, hashedToken, expires);

  //   console.log("✅ Reset token saved");

  //   const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  //   console.log("Reset Link:", resetLink);

  //   await sendEmail(
  //     user.email,
  //     "Reset Your Password",
  //     resetPasswordEmail(user.name, resetLink),
  //   );

  //   console.log("✅ Email sent");

  //   return {
  //     message:
  //       "If an account with that email exists, a password reset link has been sent.",
  //   };
  // }

  async forgotPassword(email: string) {
    console.log("========== FORGOT PASSWORD ==========");
    email = email.trim().toLowerCase();
    console.log("Email:", email);

    const user = await authRepository.findUserByEmail(email);

    console.log("User:", user);

    if (!user) {
      console.log("❌ User not found");

      return {
        message:
          "If an account with that email exists, a password reset link has been sent.",
      };
    }

    const { token, hashedToken } = generateResetToken();

    console.log("Token:", token);
    console.log("Hash:", hashedToken);

    const expires = new Date(Date.now() + 15 * 60 * 1000);

    console.log("Saving token...");

    await authRepository.saveResetToken(user.id, hashedToken, expires);

    console.log("✅ Token saved");

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    console.log("Reset Link:", resetLink);

    await sendEmail(
      user.email,
      "Reset Password",
      resetPasswordEmail(user.name, resetLink),
    );

    console.log("✅ Email sent");

    return {
      message:
        "If an account with that email exists, a password reset link has been sent.",
    };
  }

  async resetPassword(token: string, password: string) {
    console.log("Incoming token:", token);
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log("Hashed token:", hashedToken);
    const user = await authRepository.findByResetToken(hashedToken);
    console.log("User found:", user);

    if (!user) {
      throw new Error("Invalid or expired reset link.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await authRepository.updatePassword(user.id, hashedPassword);

    return {
      message: "Password reset successfully.",
    };
  }
}

export const authService = new AuthService();
