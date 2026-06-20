import { ObjectId } from "mongodb";

export type Order = {
  _id?: ObjectId;
  gigId: string;
  gigTitle: string;

  buyerId: string;
  buyerName: string;

  sellerId: string;
  sellerName: string;

  price: number;

  status: "pending" | "active" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid";

  createdAt: Date;
};