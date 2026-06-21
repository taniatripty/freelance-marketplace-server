import { Request, Response } from "express";
import { createNotificationService, getNotificationsService, markAsReadService } from "./notification.services";

// ---------------- CREATE ----------------
export const createNotificationController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await createNotificationService(req.body);

    res.status(201).json({
      success: true,
      message: "Notification created",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------- GET ----------------
export const getNotificationsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;

    const result = await getNotificationsService(userId as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------- MARK AS READ ----------------
export const markAsReadController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await markAsReadService(id as string);

    res.status(200).json({
      success: true,
      message: "Marked as read",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};