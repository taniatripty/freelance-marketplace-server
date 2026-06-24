import { Request, Response } from "express";
import { createGigService, getAllGigsService, getSingleGigService } from "./gigs.services";


export const createGigController = async (req: Request, res: Response) => {
  try {
    const {
      sellerId,
      name,
      email,
      title,
      shortDescription,
      description,
      categoryId,
      price,
      deliveryDays,
      revisions,
      tags,
      features,
      images,
      totalSales
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
      shortDescription,
      description,
      categoryId,
      price,
      deliveryDays,
      revisions,
      tags,
      features,
      totalSales,
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

export const getAllGigsController = async (
  req: Request,
  res: Response
) => {
  try {
    const gigs = await getAllGigsService(req.query);

    return res.status(200).json({
      success: true,
      message: "Gigs fetched successfully",
      data: gigs,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const getSingleGigController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const gig = await getSingleGigService(id as string);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: gig,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};