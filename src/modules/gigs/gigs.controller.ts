import { Request, Response } from "express";
import { createGigService } from "./gigs.services";


export const createGigController = async (req: Request, res: Response) => {
  try {
    const {
      sellerId,
      name,
      email,
      title,
      description,
      categoryId,
      price,
      deliveryDays,
      revisions,
      images,
    } = req.body;

    // ---------------- VALIDATION ----------------
    if (!sellerId || !title || !description || !price) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const payload = {
      sellerId,
      name,
      email,
      title,
      description,
      categoryId,
      price,
      deliveryDays,
      revisions,
      images: images || [],
    };

    const result = await createGigService(payload);

    return res.status(201).json({
      success: true,
      message: "Gig created successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};