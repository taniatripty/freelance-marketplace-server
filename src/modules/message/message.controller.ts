import { Request, Response } from "express";
import { getChatService, sendMessageService } from "./message.services";

export const sendMessageController = async (req: Request, res: Response) => {
  try {
    console.log("CHAT BODY:", req.body); // DEBUG IMPORTANT

    const result = await sendMessageService(req.body);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("CHAT ERROR:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to send message",
    });
  }
};

export const getChatController = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const result = await getChatService(orderId as string);

    res.status(200).json({
      success: true,
      message: "Chat fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch chat",
    });
  }
};