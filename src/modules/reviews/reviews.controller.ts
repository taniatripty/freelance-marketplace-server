import { Request, Response } from "express";
import { createReviewService, createWebsiteReviewService, getAllReviewsService, getBuyerReviewsService,  getReviewsByGigService, getWebsiteReviewsService } from "./reviews.services";


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

export const createWebsiteReview = async (
  req: Request,
  res: Response
) => {
  try {
    const review = await createWebsiteReviewService(
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getWebsiteReviews = async (
  req: Request,
  res: Response
) => {
  try {
    const reviews =
      await getWebsiteReviewsService();

    res.json({
      success: true,
      data: reviews,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getBuyerReviews = async (
  req: Request,
  res: Response
) => {
  try {
    const { buyerId } = req.params;

    const reviews = await getBuyerReviewsService( 
      buyerId as string
    );

    return res.status(200).json({
      success: true,
      message: "Buyer reviews fetched successfully",
      data: reviews,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const getAllReviews = async (
  req: Request,
  res: Response
) => {
  try {
    const reviews = await getAllReviewsService();

    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews.",
    });
  }
};