import { Request, Response } from "express";
import { createReviewService, getReviewsByGigService } from "./reviews.services";


export const createReview = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await createReviewService(
      req.body
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getReviewsByGigController = async (
  req: Request,
  res: Response
) => {
  try {
    const gigId = req.params.gigId;

    const reviews = await getReviewsByGigService(gigId as string);

    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch reviews",
    });
  }
};