
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

export const createWebsiteReviewService =
  async (payload: any) => {
    const db = getDB();

    const collection = db.collection(
      "website_reviews"
    );

    const alreadyReviewed =
      await collection.findOne({
        uid: payload.uid,
      });

    if (alreadyReviewed) {
      throw new Error(
        "You have already submitted a review."
      );
    }

    const review = {
      ...payload,

      helpfulCount: 0,

      createdAt: new Date(),

      updatedAt: new Date(),
    };

    await collection.insertOne(review);

    return review;
  };

  export const getWebsiteReviewsService =
  async () => {
    const db = getDB();

    return await db
      .collection("website_reviews")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
  };


 // services/review.service.ts



// export const getBuyerReviewsService = async (
//   buyerId: string
// ) => {
//   const db = getDB();

//   const reviews = await db
//     .collection("reviews")
//     .aggregate([
//       {
//         $match: {
//           buyerId,
//         },
//       },

//       {
//         $lookup: {
//           from: "orders",
//           let: {
//             orderId: {
//               $toObjectId: "$orderId",
//             },
//           },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $eq: ["$_id", "$$orderId"],
//                 },
//               },
//             },
//           ],
//           as: "orders",
//         },
//       },

//       {
//         $unwind: {
//           path: "$orders",
//           preserveNullAndEmptyArrays: true,
//         },
//       },

//       {
//         $project: {
//           _id: 1,
//           rating: 1,
//           comment: 1,
//           createdAt: 1,

//           orderTitle: "$orders.title",
//           orderPrice: "$orders.price",
//           orderImage: "$orders.gigImage",
//         },
//       },

//       {
//         $sort: {
//           createdAt: -1,
//         },
//       },
//     ])
//     .toArray();

//   return reviews;
// };

export const getBuyerReviewsService = async (buyerId: string) => {
  const db = getDB();

  return await db.collection("reviews")
    .aggregate([
      {
        $match: {
          buyerId,
        },
      },

      // Order
      {
        $lookup: {
          from: "orders",
          let: {
            orderId: {
              $toObjectId: "$orderId",
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$orderId"],
                },
              },
            },
          ],
          as: "order",
        },
      },

      {
        $unwind: {
          path: "$order",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Gig
      {
        $lookup: {
          from: "gigs",
          let: {
            gigId: {
              $toObjectId: "$gigId",
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$gigId"],
                },
              },
            },
          ],
          as: "gig",
        },
      },

      {
        $unwind: {
          path: "$gig",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          rating: 1,
          comment: 1,
          createdAt: 1,

          orderTitle: "$gig.title",
          orderImage: "$gig.images",
          orderPrice: "$gig.price",
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },
    ])
    .toArray();
};



export const getAllReviewsService = async () => {
  const db = getDB();

  const reviewsCollection = db.collection("reviews");
  const usersCollection = db.collection("users");
  const gigsCollection = db.collection("gigs");

  const reviews = await reviewsCollection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  if (!reviews.length) return [];

  // Collect ids
  const buyerIds = [
    ...new Set(reviews.map((r) => r.buyerId).filter(Boolean)),
  ];

  const sellerIds = [
    ...new Set(reviews.map((r) => r.sellerId).filter(Boolean)),
  ];

  const gigIds = [
    ...new Set(
      reviews
        .map((r) => r.gigId)
        .filter(Boolean)
        .map((id) => new ObjectId(id))
    ),
  ];

  // Fetch users
  const buyers = await usersCollection
    .find({ uid: { $in: buyerIds } })
    .toArray();

  const sellers = await usersCollection
    .find({ uid: { $in: sellerIds } })
    .toArray();

  // Fetch gigs
  const gigs = await gigsCollection
    .find({
      _id: {
        $in: gigIds,
      },
    })
    .toArray();

  // Merge everything
  const result = reviews.map((review) => {
    const buyer = buyers.find(
      (user) => user.uid === review.buyerId
    );

    const seller = sellers.find(
      (user) => user.uid === review.sellerId
    );

    const gig = gigs.find(
      (g) => g._id.toString() === review.gigId
    );

    return {
      ...review,

      buyerName: buyer?.name || "",
      buyerEmail: buyer?.email || "",
      buyerPhoto: buyer?.photoURL || "",

      sellerName: seller?.name || "",
      sellerEmail: seller?.email || "",
      sellerPhoto: seller?.photoURL || "",

      gigTitle: gig?.title || "",
      gigImage: gig?.images?.[0] || "",
      category: gig?.category || "",
    };
  });

  return result;
};