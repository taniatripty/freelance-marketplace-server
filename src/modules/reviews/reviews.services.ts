
import { ObjectId } from "mongodb";
import { getDB } from "../../confing/db";

export const createReviewService = async (payload: any) => {
  const db = getDB();

  const reviews = db.collection("reviews");
  const gigs = db.collection("gigs");
  const orders = db.collection("orders");

  // ---------------- 1. check order exists ----------------
  const order = await orders.findOne({
    _id: new ObjectId(payload.orderId),
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // ---------------- 2. only completed + paid ----------------
  if (
    order.status !== "completed" ||
    order.paymentStatus !== "paid"
  ) {
    throw new Error(
      "You can only review completed & paid orders"
    );
  }

  // ---------------- 3. prevent duplicate review ----------------
  const existingReview = await reviews.findOne({
    orderId: payload.orderId,
    buyerId: payload.buyerId,
  });

  if (existingReview) {
    throw new Error("You already reviewed this order");
  }

  // ---------------- 4. create review ----------------
  const review = {
    gigId: payload.gigId,
    orderId: payload.orderId,

    buyerId: payload.buyerId,
    buyerName: payload.buyerName,

    rating: Number(payload.rating),
    comment: payload.comment,

    createdAt: new Date(),
  };

  const result = await reviews.insertOne(review);

  // ---------------- 5. update gig rating ----------------
  const allReviews = await reviews
    .find({ gigId: payload.gigId })
    .toArray();

  const totalRating = allReviews.reduce(
    (sum, r) => sum + r.rating,
    0
  );

  const avgRating =
    totalRating / allReviews.length;

  await gigs.updateOne(
    { _id: new ObjectId(payload.gigId) },
    {
      $set: {
        rating: avgRating,
        totalReviews: allReviews.length,
      },
    }
  );

  return {
    insertedId: result.insertedId,
    message: "Review created successfully",
  };
};

export const getReviewsByGigService = async (gigId: string) => {
  const db = getDB();
  const collection = db.collection("reviews");

  if (!gigId) {
    throw new Error("GigId is required");
  }

  const reviews = await collection
    .find({ gigId })
    .sort({ createdAt: -1 })
    .toArray();

  return reviews;
};