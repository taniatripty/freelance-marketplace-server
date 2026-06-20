import { getDB } from "../../confing/db";


export const createOrderService = async (payload: any) => {
  const db = getDB();

  const ordersCollection = db.collection("orders");

  // ---------------- VALIDATION ----------------
  if (!payload.gigId || !payload.buyerId || !payload.sellerId) {
    throw new Error("Missing required fields");
  }

  // ❌ prevent self purchase
  if (payload.buyerId === payload.sellerId) {
    throw new Error("You cannot purchase your own gig");
  }

  const orderDoc = {
    gigId: payload.gigId,
    gigTitle: payload.gigTitle,

    buyerId: payload.buyerId,
    buyerName: payload.buyerName,

    sellerId: payload.sellerId,
    sellerName: payload.sellerName,

    price: payload.price,

    status: "pending",
    paymentStatus: "unpaid",

    createdAt: new Date(),
  };

  const result = await ordersCollection.insertOne(orderDoc);

  return {
    insertedId: result.insertedId,
    ...orderDoc,
  };
};