import { getDB } from "../../confing/db";
import { ObjectId } from "mongodb";

export const sendMessageService = async (payload: any) => {
  const db = getDB();

  const chatCollection = db.collection("chats");
  const orderCollection = db.collection("orders");

  const { orderId, senderId, text } = payload;

  if (!orderId || !senderId || !text) {
    throw new Error("Missing required fields");
  }

  // 🔥 GET ORDER DETAILS
  const order = await orderCollection.findOne({
    _id: new ObjectId(orderId),
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const message = {
    senderId,
    text,
    createdAt: new Date(),
  };

  // 🔥 FIND CHAT
  const existingChat = await chatCollection.findOne({ orderId });

  if (existingChat) {
    await chatCollection.updateOne(
      { orderId },
      {
        $push: { messages: message } as any,
        $set: { updatedAt: new Date() },
      }
    );

    return { updated: true };
  }

  // 🔥 CREATE CHAT (AUTO buyer + seller FIXED HERE)
  const newChat = {
    orderId,
    buyerId: order.buyerId,     // ✅ FIXED
    sellerId: order.sellerId,   // ✅ FIXED
    messages: [message],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await chatCollection.insertOne(newChat);

  return {
    insertedId: result.insertedId,
    created: true,
  };
};

export const getChatService = async (orderId: string) => {
  const db = getDB();
  const chatCollection = db.collection("chats");

  if (!orderId) {
    throw new Error("orderId is required");
  }

  const chat = await chatCollection.findOne({ orderId });

  // If chat doesn't exist yet, return empty structure
  if (!chat) {
    return {
      orderId,
      messages: [],
    };
  }

  return chat;
};