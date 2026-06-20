import { Request, Response } from "express";
import { createOrderService } from "./order.services";


export const createOrderController = async (req: Request, res: Response) => {
  try {
    const {
      gigId,
      gigTitle,
      buyerId,
      buyerName,
      sellerId,
      sellerName,
      price,
    } = req.body;

    // ---------------- VALIDATION ----------------
    if (!gigId || !buyerId || !sellerId) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const result = await createOrderService({
      gigId,
      gigTitle,
      buyerId,
      buyerName,
      sellerId,
      sellerName,
      price,
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};