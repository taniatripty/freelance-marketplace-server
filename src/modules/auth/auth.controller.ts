import { Request, Response } from "express";
import { getAllUsersService, getUserByUidService, registerUserIntoDB, updateProfileService, updateUserRoleService } from "./auth.services";
import {
  loginUserFromDB,
} from "./auth.services";




export const registerUser = async (req: Request, res: Response) => {
  try {
    const { uid, name, email,  role, photoURL, } = req.body;

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
      photoURL,
      role: role || "client",
      createdAt: new Date(),
       updatedAt: new Date()
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


export const getAllUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await getAllUsersService();

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};
export const updateUserRole = async (
  req: Request,
  res: Response
) => {
  try {
    const { uid } = req.params;
    const { role } = req.body;

    const allowedRoles = [
      "admin",
      "client",
      "freelancer",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const result = await updateUserRoleService(
      uid as string,
      role
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Role updated to ${role}`,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const { uid } = req.params;

    const user = await getUserByUidService(uid as string);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const { uid } = req.params;

    const result = await updateProfileService(
      uid as string,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};