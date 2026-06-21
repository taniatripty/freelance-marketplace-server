import express from "express";
import { getChatController, sendMessageController } from "./message.controller";


const router = express.Router();

// send message
router.post("/:orderId/message", sendMessageController);
router.get("/:orderId", getChatController);

export const messageRoutes= router;