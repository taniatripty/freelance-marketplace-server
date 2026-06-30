import express from "express";
import {
  cancelOrderController,
  createOrderController,
  getBuyerCompletedProjects,
  getbuyerpayment,
  getMyOrdersController,
  getOrderById,
  getSellerEarnings,
  getSellerOrdersController,
  sellerCancelOrderController,
  updateOrderStatusController,
} from "./oder.controller";

const router = express.Router();

router.post("/", createOrderController);
router.get("/buyer/:buyerId", getMyOrdersController);
router.get("/seller/:sellerId", getSellerOrdersController);
router.get("/:orderId", getOrderById);
router.patch("/:id", updateOrderStatusController);
router.patch("/cancel/:id", cancelOrderController);
router.patch(
  "/seller-cancel/:id",
  sellerCancelOrderController
);
router.get(
  "/earnings/:sellerId",
  getSellerEarnings
);

router.get(
  "/payment/:buyerId",
  getbuyerpayment
);
router.get(
  "/buyer/completed/:buyerId",
  getBuyerCompletedProjects
);
export const createOrders = router;
