import { Request, Response } from "express";
import { registerUserIntoDB } from "./auth.services";
import {
  loginUserFromDB,
} from "./auth.services";




export const registerUser = async (req: Request, res: Response) => {
  try {
    const { uid, name, email,  role } = req.body;

    // validation (Firebase handles password, so no password here)
    if (!uid || !name || !email) {
      return res.status(400).json({
        success: false,
        message: "uid, name and email are required",
      });
    }

    const newUser = {
      uid,
      name,
      email,
      
      role: role || "client",
      createdAt: new Date(),
    };

    const result = await registerUserIntoDB(newUser);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};




export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, uid } = req.body;

    // validation
    if (!email || !uid) {
      return res.status(400).json({
        success: false,
        message: "Email and UID are required",
      });
    }

    // find user in MongoDB
    const user = await loginUserFromDB(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};