import express from "express";
import {createOrderController, getMyOrdersController, getOrderById, getSellerOrdersController, updateOrderStatusController } from "./oder.controller";


const router = express.Router();

router.post("/", createOrderController);
router.get("/buyer/:buyerId", getMyOrdersController);
router.get("/seller/:sellerId", getSellerOrdersController);
router.get("/:orderId", getOrderById);
router.patch("/:id", updateOrderStatusController);

export  const createOrders=router;