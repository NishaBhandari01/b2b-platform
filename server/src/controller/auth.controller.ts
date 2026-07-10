import { Response } from "express";
import {
  registerSchema,
  LoginSchema,
  GoogleAuthSchema,
} from "../validator/auth.validator.js";
import { authService } from "../services/auth.service.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
) => {
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearAuthCookies = (res: Response) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
};

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const body = registerSchema.parse(req.body);

    const result = await authService.registerUser(
      body.name,
      body.email,
      body.password,
      body.role,
    );

    setAuthCookies(res, result.accessToken, result.refreshToken);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const body = LoginSchema.parse(req.body);

    const result = await authService.loginUser(body.email, {
      password: body.password,
    });

    setAuthCookies(res, result.accessToken, result.refreshToken);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await authService.getCurrentUser(req.user.id);

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const refresh = async (req: AuthRequest, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new Error("Refresh token missing");
    }

    const result = await authService.refreshSession(refreshToken);
    setAuthCookies(res, result.accessToken, result.refreshToken);

    return res.status(200).json({
      success: true,
      message: "Session refreshed",
      data: result,
    });
  } catch (error: any) {
    clearAuthCookies(res);
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.id) {
      await authService.logoutUser(req.user.id);
    }

    clearAuthCookies(res);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const google = async (req: AuthRequest, res: Response) => {
  try {
    const body = GoogleAuthSchema.parse(req.body);

    const result = await authService.googleLogin(
      body.email,
      body.name || "Google User",
      body.role || "buyer",
    );
    setAuthCookies(res, result.accessToken, result.refreshToken);

    return res.status(200).json({
      success: true,
      message: "Google sign-in successful",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
