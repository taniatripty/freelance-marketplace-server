import express from "express";
import { createOrderController } from "./oder.controller";


const router = express.Router();

router.post("/", createOrderController);

export  const createOrders=router;