import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { AuthRepository } from "../repository/auth.repository.js";

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
}

export const authService = new AuthService();
