import express from "express";
import { createOrderController, getMyOrdersController, getSellerOrdersController, updateOrderStatusController } from "./oder.controller";


const router = express.Router();

router.post("/", createOrderController);
router.get("/buyer/:buyerId", getMyOrdersController);
router.get("/seller/:sellerId", getSellerOrdersController);
router.patch("/:id", updateOrderStatusController);
export  const createOrders=router;