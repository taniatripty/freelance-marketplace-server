import { Request, Response } from "express";
import { becomeFreelancerService, getAllFreelancersService, getSingleFreelancerService } from "./profile.services";


// export const becomeFreelancerController = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const {
//       userId,
//       title,
//       bio,
//       skills,
//       languages,
//       experience,
//       hourlyRate,
//       portfolio,
//     } = req.body;

//     // validation
//     if (!userId || !title || !bio) {
//       return res.status(400).json({
//         success: false,
//         message: "Required fields missing",
//       });
//     }

//     const payload = {
//       userId,
//       title,
//       bio,
//       skills,
//       languages,
//       experience,
//       hourlyRate,
//       portfolio,
//     };

//     const result = await becomeFreelancerService(payload);

//     return res.status(200).json({
//       success: true,
//       message: "Successfully became freelancer",
//       data: result,
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Server error",
//     });
//   }
// };

export const becomeFreelancerController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      userId,
      name,
      email,
      title,
      bio,
      skills,
      languages,
      experience,
      hourlyRate,
      portfolio,
    } = req.body;

    // ---------------- VALIDATION ----------------
    if (!userId || !title || !bio) {
      return res.status(400).json({
        success: false,
        message: "userId, title, and bio are required",
      });
    }

    if (!Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: "Skills must be an array",
      });
    }

    // ---------------- PAYLOAD ----------------
    const payload = {
      userId: userId?.trim(),
      name: name?.trim(),
      email: email?.trim(),
      title: title?.trim(),
      bio: bio?.trim(),
      skills,
      languages: languages || [],
      experience: experience || "",
      hourlyRate: Number(hourlyRate) || 0,
      portfolio: portfolio || [],
    };

    // ---------------- SERVICE CALL ----------------
    const result = await becomeFreelancerService(payload);

    return res.status(201).json({
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
export const getAllFreelancersController = async (
  req: Request,
  res: Response
) => {
  try {
    const freelancers = await getAllFreelancersService();

    res.status(200).json({
      success: true,
      data: freelancers,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingleFreelancerController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const freelancer =
      await getSingleFreelancerService(id as string);

    res.status(200).json({
      success: true,
      data: freelancer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch freelancer",
    });
  }
};