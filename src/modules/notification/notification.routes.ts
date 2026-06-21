import express from "express";
import { createNotificationController, getNotificationsController, markAsReadController } from "./notification.controller";


const router = express.Router();

// CREATE
router.post("/", createNotificationController);

// GET BY USER
router.get("/:userId", getNotificationsController);

// MARK AS READ
router.patch("/:id/read", markAsReadController);

export const notificationRoutes= router;