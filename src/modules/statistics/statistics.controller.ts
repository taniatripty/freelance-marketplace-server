import { Request, Response } from "express";
import { getClientDashboardStatsService, getFreelancerStatsService } from "./statistics.services";


export const getFreelancerStats = async (
  req: Request,
  res: Response
) => {
  try {
    const { sellerId } = req.params;

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Seller ID is required",
      });
    }

    const stats =
      await getFreelancerStatsService(sellerId as string);

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getClientDashboardStats = async (
  req: Request,
  res: Response
) => {
  try {
    const { buyerId } = req.params;

    const stats = await getClientDashboardStatsService(buyerId as string);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to load client dashboard.",
    });
  }
};