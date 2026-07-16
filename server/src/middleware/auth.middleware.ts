import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : undefined;
  const tokenFromCookie = req.cookies?.accessToken;
  const token = tokenFromHeader || tokenFromCookie;

  // console.log(`[Auth] Checking route ${req.method} ${req.originalUrl}`);
  // console.log(
  //   `[Auth] Header token: ${!!tokenFromHeader}, Cookie token: ${!!tokenFromCookie}`,
  // );

  if (!token) {
    // console.log(`[Auth] Unauthorized: No token found`);
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev-access-secret",
    ) as {
      id: string;
      role: string;
    };

    // console.log("[Auth] Decoded token:", decoded);

    req.user = decoded;

    next();
  } catch (err: any) {
    console.log(`[Auth] Invalid token: ${err.message}`);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
