// import { getDB } from "../../confing/db";
// import { ObjectId } from "mongodb";

// export const sendMessageService = async (payload: any) => {
//   const db = getDB();

//   const chatCollection = db.collection("chats");
//   const orderCollection = db.collection("orders");

//   const { orderId, senderId, text } = payload;

//   if (!orderId || !senderId || !text) {
//     throw new Error("Missing required fields");
//   }

//   // 🔥 GET ORDER DETAILS
//   const order = await orderCollection.findOne({
//     _id: new ObjectId(orderId),
//   });

//   if (!order) {
//     throw new Error("Order not found");
//   }

//   const message = {
//     senderId,
//     text,
//     createdAt: new Date(),
//   };

//   // 🔥 FIND CHAT
//   const existingChat = await chatCollection.findOne({ orderId });

//   if (existingChat) {
//     await chatCollection.updateOne(
//       { orderId },
//       {
//         $push: { messages: message } as any,
//         $set: { updatedAt: new Date() },
//       }
//     );

//     return { updated: true };
//   }

//   // 🔥 CREATE CHAT (AUTO buyer + seller FIXED HERE)
//   const newChat = {
//     orderId,
//     buyerId: order.buyerId,     
//     sellerId: order.sellerId,   
//     messages: [message],
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   };

//   const result = await chatCollection.insertOne(newChat);

//   return {
//     insertedId: result.insertedId,
//     created: true,
//   };
// };

// export const getChatService = async (orderId: string) => {
//   const db = getDB();
//   const chatCollection = db.collection("chats");

//   if (!orderId) {
//     throw new Error("orderId is required");
//   }

//   const chat = await chatCollection.findOne({ orderId });

//   // If chat doesn't exist yet, return empty structure
//   if (!chat) {
//     return {
//       orderId,
//       messages: [],
//     };
//   }

//   return chat;
// };

import { getDB } from "../../confing/db";
import { ObjectId } from "mongodb";

/**
 * SEND MESSAGE SERVICE
 */
export const sendMessageService = async (payload: any) => {
  const db = getDB();

  const chatCollection = db.collection("chats");
  const orderCollection = db.collection("orders");

  const { orderId, senderId, text } = payload;

  if (!orderId || !senderId || !text) {
    throw new Error("Missing required fields");
  }

  // 🔥 Get order
  const order = await orderCollection.findOne({
    _id: new ObjectId(orderId),
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const buyerId = order.buyerId;
  const sellerId = order.sellerId;

  // 🔥 receiver detection
  const receiverId = senderId === buyerId ? sellerId : buyerId;

  const message = {
    senderId,
    text,
    createdAt: new Date(),
  };

  const chat = await chatCollection.findOne({ orderId });

  // ---------------- CHAT EXISTS ----------------
  if (chat) {
    await chatCollection.updateOne(
      { orderId },
      {
        $push: { messages: message } as any,
        $inc: {
          [`unread.${receiverId}`]: 1,
        },
        $set: { updatedAt: new Date() },
      }
    );

    return { success: true, updated: true };
  }

  // ---------------- CREATE CHAT ----------------
  const newChat = {
    orderId,
    buyerId,
    sellerId,
    messages: [message],

    unread: {
      [receiverId]: 1,
    },

    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await chatCollection.insertOne(newChat);

  return {
    success: true,
    insertedId: result.insertedId,
  };
};

/**
 * GET CHAT SERVICE
 */
export const getChatService = async (orderId: string) => {
  const db = getDB();
  const chatCollection = db.collection("chats");

  if (!orderId) {
    throw new Error("orderId is required");
  }

  const chat = await chatCollection.findOne({ orderId });

  if (!chat) {
    return {
      orderId,
      messages: [],
      unread: {},
    };
  }

  return chat;
};

/**
 * MARK CHAT AS READ
 */
export const markAsReadService = async (orderId: string, userId: string) => {
  const db = getDB();
  const chatCollection = db.collection("chats");

  await chatCollection.updateOne(
    { orderId },
    {
      $set: {
        [`unread.${userId}`]: 0,
      },
    }
  );

  return { success: true };
};

/**
 * GET ALL UNREAD FOR USER
 */
export const getAllUnreadService = async (userId: string) => {
  const db = getDB();
  const chatCollection = db.collection("chats");

  const chats = await chatCollection
    .find({ $or: [{ buyerId: userId }, { sellerId: userId }] })
    .toArray();

  const result: Record<string, number> = {};

  chats.forEach((chat: any) => {
    const count = chat.unread?.[userId] || 0;
    result[chat.orderId] = count;
  });

  return result;
};