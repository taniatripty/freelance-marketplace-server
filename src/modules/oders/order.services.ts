

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
    "cancelled_by_buyer",
    "cancelled_by_seller",
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

export const getOrderByIdService = async (orderId: string) => {
  if (!ObjectId.isValid(orderId)) {
    throw new Error("Invalid order ID");
  }

  const db = getDB();

  const order = await db.collection("orders").findOne({
    _id: new ObjectId(orderId),
  });

  return order;
};


export const cancelOrderService = async (
  id: string
) => {
  const db = getDB();
  const orders = db.collection("orders");

  const order = await orders.findOne({
    _id: new ObjectId(id),
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.paymentStatus === "paid") {
    throw new Error(
      "Paid orders cannot be cancelled"
    );
  }

  if (order.status === "completed") {
    throw new Error(
      "Completed orders cannot be cancelled"
    );
  }

  if (
    order.status === "cancelled_by_buyer" ||
    order.status === "cancelled_by_seller"
  ) {
    throw new Error(
      "Order already cancelled"
    );
  }

  await orders.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        status: "cancelled_by_buyer",
        updatedAt: new Date(),
      },
    }
  );

  return {
    success: true,
  };
};

export const sellerCancelOrderService =
  async (id: string) => {
    const db = getDB();
    const orders = db.collection("orders");

    const order = await orders.findOne({
      _id: new ObjectId(id),
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.paymentStatus === "paid") {
      throw new Error(
        "Paid orders cannot be cancelled"
      );
    }

    if (order.status === "completed") {
      throw new Error(
        "Completed orders cannot be cancelled"
      );
    }

    await orders.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          status: "cancelled_by_seller",
          updatedAt: new Date(),
        },
      }
    );

    return {
      success: true,
       message: "Order cancelled successfully"
    };
  };


  export const getSellerEarningsService = async (
  sellerId: string
) => {
  const db = getDB();

  const orderCollection = db.collection("orders");

  const orders = await orderCollection
    .find({
      sellerId,
      status: "completed",
      paymentStatus: "paid",
    })
    .sort({ completedAt: -1 })
    .toArray();

  const totalEarning = orders.reduce(
    (sum: number, order: any) =>
      sum + (order.price || 0),
    0
  );

  return {
    totalEarning,
    totalOrders: orders.length,
    orders,
  };
};