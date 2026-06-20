// import { getDB } from "../../confing/db";


// export const createOrderService = async (payload: any) => {
//   const db = getDB();

//   const ordersCollection = db.collection("orders");

//   // ---------------- VALIDATION ----------------
//   if (!payload.gigId || !payload.buyerId || !payload.sellerId) {
//     throw new Error("Missing required fields");
//   }

//   // ❌ prevent self purchase
//   if (payload.buyerId === payload.sellerId) {
//     throw new Error("You cannot purchase your own gig");
//   }

//   const orderDoc = {
//     gigId: payload.gigId,
//     gigTitle: payload.gigTitle,

//     buyerId: payload.buyerId,
//     buyerName: payload.buyerName,

//     sellerId: payload.sellerId,
//     sellerName: payload.sellerName,

//     price: payload.price,

//     status: "pending",
//     paymentStatus: "unpaid",

//     createdAt: new Date(),
//   };

//   const result = await ordersCollection.insertOne(orderDoc);

//   return {
//     insertedId: result.insertedId,
//     ...orderDoc,
//   };
// };

import { ObjectId } from "mongodb";
import { getDB } from "../../confing/db";

export const createOrderService = async (payload: any) => {
  const db = getDB();

  const ordersCollection = db.collection("orders");

  const {
    gigId,
    gigTitle,
    buyerId,
    buyerName,
    sellerId,
    sellerName,
    price,
  } = payload;

  // ---------------- VALIDATION ----------------
  if (!gigId || !buyerId || !sellerId) {
    throw new Error("Missing required fields");
  }

  // ---------------- PREVENT SELF PURCHASE ----------------
  if (buyerId === sellerId) {
    throw new Error("You cannot purchase your own service");
  }

  // ---------------- CHECK EXISTING ORDER ----------------
  const existingOrder = await ordersCollection.findOne({
    gigId,
    buyerId,
  });

  if (existingOrder) {
    throw new Error("You already purchased this service");
  }

  // ---------------- CREATE ORDER ----------------
  const orderDoc = {
    gigId,
    gigTitle,

    buyerId,
    buyerName,

    sellerId,
    sellerName,

    price,

    status: "pending", // pending | in-progress | completed | cancelled
    paymentStatus: "unpaid", // unpaid | paid

    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await ordersCollection.insertOne(orderDoc);

  return {
    insertedId: result.insertedId,
    ...orderDoc,
  };
};

export const getMyOrdersService = async (buyerId: string) => {
  const db = getDB();

  const ordersCollection = db.collection("orders");

  const orders = await ordersCollection
    .find({ buyerId })
    .sort({ createdAt: -1 })
    .toArray();

  return orders;
};

export const getSellerOrdersService = async (sellerId: string) => {
  const db = getDB();

  const ordersCollection = db.collection("orders");

  const orders = await ordersCollection
    .find({ sellerId })
    .sort({ createdAt: -1 })
    .toArray();

  return orders;
};

export const updateOrderStatusService = async (
  orderId: string,
  status: string
) => {
  const db = getDB();
  const ordersCollection = db.collection("orders");

  // ---------------- VALID STATUS ----------------
  const allowedStatus = [
    "pending",
    "accepted",
    "in_progress",
    "completed",
    "cancelled",
  ];

  if (!allowedStatus.includes(status)) {
    throw new Error("Invalid status value");
  }

  if (!ObjectId.isValid(orderId)) {
    throw new Error("Invalid order ID");
  }

  // ---------------- UPDATE ORDER ----------------
  const result = await ordersCollection.updateOne(
    { _id: new ObjectId(orderId) },
    {
      $set: {
        status,
        updatedAt: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) {
    throw new Error("Order not found");
  }

  return {
    orderId,
    status,
  };
};