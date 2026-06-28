import { getDB } from "../../confing/db";


type EarningsResult = {
  _id: null;
  total: number;
};

export const getFreelancerStatsService = async (
  sellerId: string
) => {
  const db = getDB();

  const gigCollection = db.collection("gigs");
  const orderCollection = db.collection("orders");

  // Total Active Gigs
  const totalGigs = await gigCollection.countDocuments({
    sellerId,
    status: "active",
  });

  // Total Orders
  const totalOrders = await orderCollection.countDocuments({
    sellerId,
  });

  // Completed Orders
  const completedOrders =
    await orderCollection.countDocuments({
      sellerId,
      status: "completed",
    });

  // Total Earnings
  const earningResult = await orderCollection
    .aggregate<EarningsResult>([
      {
        $match: {
          sellerId,
          status: "completed",
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$price",
          },
        },
      },
    ])
    .toArray();

  const totalEarnings =
    earningResult[0]?.total ?? 0;

  return {
    totalGigs,
    totalOrders,
    completedOrders,
    totalEarnings,
  };
};


export const getClientDashboardStatsService = async (
  buyerId: string
) => {
  const db = getDB();

  const ordersCollection = db.collection("orders");

  const totalOrders = await ordersCollection.countDocuments({
    buyerId,
  });

  const completedOrders =
    await ordersCollection.countDocuments({
      buyerId,
      status: "completed",
    });

  const pendingOrders =
    await ordersCollection.countDocuments({
      buyerId,
      status: {
        $in: [
          "pending",
          "accepted",
          "in_progress",
        ],
      },
    });

  const spendingResult =
    await ordersCollection
      .aggregate([
        {
          $match: {
            buyerId,
            status: "completed",
          },
        },
        {
          $group: {
            _id: null,
            totalSpent: {
              $sum: "$price",
            },
          },
        },
      ])
      .toArray();

  const totalSpent =
    spendingResult.length > 0
      ? spendingResult[0]?.totalSpent ?? 0
      : 0;

  return {
    totalOrders,
    completedOrders,
    pendingOrders,
    totalSpent,
  };
};
