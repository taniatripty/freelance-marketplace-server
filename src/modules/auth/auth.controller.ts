import { Request, Response } from "express";
import { registerUserIntoDB } from "./auth.services";


export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newUser = {
      name,
      email,
      password, // later: hash with bcrypt
      
      role: "client",
      createdAt: new Date(),
    };

    const result = await registerUserIntoDB(newUser);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};