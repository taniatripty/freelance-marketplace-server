

import { Request, Response } from "express";
import { createCategoryService, getAllCategoriesService } from "./categories.services";




export const createCategoryController = async (req: Request, res: Response) => {
  try {
    const { name, icon } = req.body; // 👈 FROM JSON, NOT file

    if (!name || !icon) {
      return res.status(400).json({
        success: false,
        message: "Name and icon required",
      });
    }

    const result = await createCategoryService({
      name,
      icon,
    });

    return res.status(201).json({
      success: true,
      message: "Category created",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllCategoriesController = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategoriesService();

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};