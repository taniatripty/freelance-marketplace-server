import express from "express";
import { createPaymentIntentController, paymentSuccessController } from "./payment.controller";


const router = express.Router();

router.post("/create-intent", createPaymentIntentController);
router.patch(
  "/success/:orderId",
  paymentSuccessController
);
export const paymentRoutes= router;