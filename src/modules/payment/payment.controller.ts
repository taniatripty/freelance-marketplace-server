import { Request, Response } from "express";
import { createPaymentIntentService, paymentSuccessService } from "./payment.services";


export const createPaymentIntentController = async (
  req: Request,
  res: Response
) => {
  try {
    const { orderId, amount } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        message: "orderId and amount required",
      });
    }

    const result = await createPaymentIntentService(orderId, amount);

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


export const paymentSuccessController = async (
  req: Request,
  res: Response
) => {
  try {
    const { orderId } = req.params;
    const { transactionId } = req.body;

    const result = await paymentSuccessService(
      orderId as string,
      transactionId
    );

    res.status(200).json({
      success: true,
      data: result,
      message: "Payment updated successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};