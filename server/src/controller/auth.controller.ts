import { Request, Response } from "express";
import { registerSchema } from "../validator/auth.validator.js";
import { authService } from "../services/auth.service.js";

export const register = async (req: Request, res: Response) => {
  try {
    const body = registerSchema.parse(req.body);

    const result = await authService.registerUser(
      body.name,
      body.email,
      body.password,
      body.role,
    );

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
