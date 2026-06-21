import { getDB } from "../../confing/db";
import { ObjectId } from "mongodb";

// ---------------- CREATE NOTIFICATION ----------------
export const createNotificationService = async (payload: any) => {
  const db = getDB();
  const collection = db.collection("notifications");

  if (!payload.userId || !payload.message) {
    throw new Error("Missing required fields");
  }

  const notification = {
    userId: payload.userId,
    senderId: payload.senderId || null,
    type: payload.type || "message",
    title: payload.title || "Notification",
    message: payload.message,
    orderId: payload.orderId || null,
    isRead: false,
    createdAt: new Date(),
  };

  const result = await collection.insertOne(notification);

  return {
    insertedId: result.insertedId,
    ...notification,
  };
};

export const getNotificationsService = async (userId: string) => {
  const db = getDB();
  const collection = db.collection("notifications");

  return await collection
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
};

export const markAsReadService = async (id: string) => {
  const db = getDB();
  const collection = db.collection("notifications");

  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { isRead: true } }
  );

  return result;
};