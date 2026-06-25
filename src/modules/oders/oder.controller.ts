import { Request, Response } from "express";
import {  cancelOrderService, createOrderService, getMyOrdersService, getOrderByIdService, getSellerOrdersService, sellerCancelOrderService, updateOrderStatusService } from "./order.services";


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

export const getMyOrdersController = async (
  req: Request,
  res: Response
) => {
  try {
    const { buyerId } = req.params;

    if (!buyerId) {
      return res.status(400).json({
        success: false,
        message: "Buyer Id is required",
      });
    }

    const orders = await getMyOrdersService(buyerId as string) ;

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSellerOrdersController = async (
  req: Request,
  res: Response
) => {
  try {
    const { sellerId } = req.params;

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Seller Id is required",
      });
    }

    const orders = await getSellerOrdersService(sellerId as string);

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const result = await updateOrderStatusService(id as string, status);

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await getOrderByIdService(orderId as string);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const cancelOrderController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const order = await cancelOrderService(id as string);

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const sellerCancelOrderController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const { id } = req.params;

      const result =
        await sellerCancelOrderService(
          id as string
        );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };