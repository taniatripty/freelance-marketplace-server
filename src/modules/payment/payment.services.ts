import Stripe from "stripe";

import { ObjectId } from "mongodb";
import { getDB } from "../../confing/db";
import { createNotificationService } from "../notification/notification.services";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const createPaymentIntentService = async (
  orderId: string,
  amount: number
) => {
  const db = getDB(); // 🔥 SAFE DB ACCESS
  const orderCollection = db.collection("orders");

  // 1. validate ObjectId
  if (!ObjectId.isValid(orderId)) {
    throw new Error("Invalid orderId");
  }

  // 2. find order
  const order = await orderCollection.findOne({
    _id: new ObjectId(orderId),
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // 3. prevent double payment
  if (order.paymentStatus === "paid") {
    throw new Error("Order already paid");
  }

  // 4. create Stripe Payment Intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // cents
    currency: "usd",
    metadata: {
      orderId: orderId,
    },
  });

  return {
     id: paymentIntent.id,
    clientSecret: paymentIntent.client_secret!,
  };
};




// export const paymentSuccessService = async (
//   orderId: string,
//   transactionId: string
// ) => {
//   const db = getDB();
//   const orders = db.collection("orders");

//   const order = await orders.findOne({
//     _id: new ObjectId(orderId),
//   });

//   if (!order) {
//     throw new Error("Order not found");
//   }

//   // 1. Update order payment status
//   await orders.updateOne(
//     { _id: new ObjectId(orderId) },
//     {
//       $set: {
//         paymentStatus: "paid",
        
//         transactionId,
//         updatedAt: new Date(),
//       },
//     }
//   );

//   // 2. 🔥 CREATE NOTIFICATION (IMPORTANT PART)
//   await createNotificationService({
//     userId: order.sellerId, // notify seller
//     senderId: order.buyerId,
//     type: "payment",
//     title: "Payment Received 💰",
//     message: `You received $${order.price} for "${order.gigTitle}"`,
//     orderId: orderId,
//   });

//   return {
//     success: true,
//     message: "Payment updated + notification sent",
//   };
// };


export const paymentSuccessService = async (
  orderId: string,
  transactionId: string
) => {
  const db = getDB();

  const orders = db.collection("orders");
  const gigs = db.collection("gigs"); // 🔥 ADD THIS

  // ---------------- FIND ORDER ----------------
  const order = await orders.findOne({
    _id: new ObjectId(orderId),
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // ---------------- UPDATE ORDER ----------------
  await orders.updateOne(
    { _id: new ObjectId(orderId) },
    {
      $set: {
        paymentStatus: "paid",
        transactionId,
        updatedAt: new Date(),
      },
    }
  );

  // ---------------- 🔥 UPDATE TOTAL SALES ----------------
  await gigs.updateOne(
    { _id: new ObjectId(order.gigId) }, // IMPORTANT
    {
      $inc: {
        totalSales: 1, // ✔ increase sales
      },
    }
  );

  // ---------------- NOTIFICATION ----------------
  await createNotificationService({
    userId: order.sellerId,
    senderId: order.buyerId,
    type: "payment",
    title: "Payment Received 💰",
    message: `You received $${order.price} for "${order.gigTitle}"`,
    orderId: orderId,
  });

  return {
    success: true,
    message: "Payment updated + totalSales updated + notification sent",
  };
};