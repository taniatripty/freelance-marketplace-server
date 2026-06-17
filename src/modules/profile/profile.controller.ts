import { Request, Response } from "express";
import { becomeFreelancerService } from "./profile.services";


export const becomeFreelancerController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      userId,
      title,
      bio,
      skills,
      languages,
      experience,
      hourlyRate,
      portfolio,
    } = req.body;

    // validation
    if (!userId || !title || !bio) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const payload = {
      userId,
      title,
      bio,
      skills,
      languages,
      experience,
      hourlyRate,
      portfolio,
    };

    const result = await becomeFreelancerService(payload);

    return res.status(200).json({
      success: true,
      message: "Successfully became freelancer",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};