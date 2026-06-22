

import { Request, Response } from "express";
import {
  sendMessageService,
  getChatService,
  markAsReadService,
  getAllUnreadService,
} from "./message.services";

/**
 * SEND MESSAGE
 */
export const sendMessageController = async (req: Request, res: Response) => {
  try {
    const result = await sendMessageService(req.body);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET CHAT
 */
export const getChatController = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const result = await getChatService(orderId as string);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * MARK AS READ
 */
export const markAsReadController = async (req: Request, res: Response) => {
  try {
    const { orderId, userId } = req.body;

    const result = await markAsReadService(orderId, userId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET ALL UNREAD
 */
export const getAllUnreadController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const result = await getAllUnreadService(userId as string);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};