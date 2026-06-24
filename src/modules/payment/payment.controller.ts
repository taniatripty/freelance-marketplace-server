import { Request, Response } from "express";
import { createPaymentIntentService,  paymentSuccessService } from "./payment.services";





export const createPaymentIntentController = async (
  req: Request,
  res: Response
) => {
  try {
    const { orderId, amount } = req.body;

    // validation
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "orderId is required",
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    const paymentIntent =
      await createPaymentIntentService(
        orderId,
        Number(amount)
      );

    return res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.clientSecret,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
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

    if (!orderId || !transactionId) {
      return res.status(400).json({
        success: false,
        message: "orderId and transactionId required",
      });
    }

    const result = await paymentSuccessService(
      orderId as string,
      transactionId
    );

    return res.status(200).json({
      success: true,
      message: "Payment successful",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};